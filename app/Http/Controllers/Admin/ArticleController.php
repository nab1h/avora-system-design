<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(): Response { return Inertia::render('Dashboard', ['section' => 'articles', 'articles' => Article::latest()->get()]); }
    public function store(Request $request): RedirectResponse { $article = Article::create($this->data($request)); $this->importDocumentImages($article, $request); return back()->with('success', 'تم إنشاء المقال بنجاح.'); }
    public function update(Request $request, Article $article): RedirectResponse { $article->update($this->data($request, $article)); $this->importDocumentImages($article, $request); return back()->with('success', 'تم تعديل المقال بنجاح.'); }
    public function destroy(Article $article): RedirectResponse { if ($article->image) Storage::disk('public')->delete($article->image); $article->delete(); return back()->with('success', 'تم حذف المقال بنجاح.'); }
    private function data(Request $request, ?Article $article = null): array
    {
        $data = $request->validate([
            'title_ar' => ['required','string','max:255'], 'title_en' => ['required','string','max:255'],
            'slug_ar' => ['required','string','max:255', Rule::unique('articles','slug_ar')->ignore($article?->id)],
            'slug_en' => ['required','string','max:255', Rule::unique('articles','slug_en')->ignore($article?->id)],
            'excerpt_ar' => ['nullable','string','max:500'], 'excerpt_en' => ['nullable','string','max:500'],
            'content_ar' => ['nullable','string'], 'content_en' => ['nullable','string'],
            'image' => ['nullable','image','mimes:jpg,jpeg,png,webp','max:4096'], 'is_published' => ['required','boolean'], 'published_at' => ['nullable','date'],
            'ar_document' => ['nullable','file','mimes:docx,txt','max:5120'],
            'en_document' => ['nullable','file','mimes:docx,txt','max:5120'],
        ]);
        if ($request->hasFile('ar_document')) $data['content_ar'] = $this->extractDocumentText($request->file('ar_document'));
        if ($request->hasFile('en_document')) $data['content_en'] = $this->extractDocumentText($request->file('en_document'));
        unset($data['ar_document'], $data['en_document']);
        $data['is_published'] = (bool) $data['is_published'];
        $data['published_at'] = $data['is_published'] ? ($data['published_at'] ?? now()) : null;
        if ($request->hasFile('image')) { if ($article?->image) Storage::disk('public')->delete($article->image); $data['image'] = $request->file('image')->store('articles','public'); }
        else unset($data['image']);
        return $data;
    }

    private function extractDocumentText(UploadedFile $file): string
    {
        if ($file->getClientOriginalExtension() === 'txt') return trim((string) file_get_contents($file->getRealPath()));
        $zip = new \ZipArchive();
        if ($zip->open($file->getRealPath()) !== true) return '';
        $xml = $zip->getFromName('word/document.xml') ?: '';
        $zip->close();
        preg_match_all('/<w:t[^>]*>(.*?)<\/w:t>/s', $xml, $matches);
        return trim(html_entity_decode(implode(' ', array_map('strip_tags', $matches[1] ?? [])), ENT_QUOTES | ENT_XML1, 'UTF-8'));
    }

    private function importDocumentImages(Article $article, Request $request): void
    {
        $files = array_filter([$request->file('ar_document'), $request->file('en_document')]);
        if (! collect($files)->contains(fn ($file) => $file->getClientOriginalExtension() === 'docx')) return;
        foreach ($article->images as $image) Storage::disk('public')->delete($image->image);
        $article->images()->delete(); $order = 0;
        foreach ($files as $file) {
            if ($file->getClientOriginalExtension() !== 'docx') continue;
            $zip = new \ZipArchive(); if ($zip->open($file->getRealPath()) !== true) continue;
            for ($i = 0; $i < $zip->numFiles; $i++) { $name = $zip->getNameIndex($i); if (! str_starts_with($name, 'word/media/')) continue; $contents = $zip->getFromIndex($i); $extension = pathinfo($name, PATHINFO_EXTENSION); $path = 'articles/content/'.uniqid('article_', true).'.'.$extension; Storage::disk('public')->put($path, $contents); $article->images()->create(['image' => $path, 'sort_order' => $order++]); }
            $zip->close();
        }
    }
}
