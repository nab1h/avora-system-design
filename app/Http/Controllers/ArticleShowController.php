<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Inertia\Inertia;
use Inertia\Response;

class ArticleShowController extends Controller
{
    public function show(string $slug): Response
    {
        $article = Article::query()->with('images')
            ->where('is_published', true)
            ->where(fn ($query) => $query->where('slug_ar', $slug)->orWhere('slug_en', $slug))
            ->where(fn ($query) => $query->whereNull('published_at')->orWhere('published_at', '<=', now()))
            ->firstOrFail();

        $relatedArticles = Article::query()
            ->where('is_published', true)
            ->whereKeyNot($article->id)
            ->where(fn ($query) => $query->whereNull('published_at')->orWhere('published_at', '<=', now()))
            ->latest('published_at')
            ->limit(6)
            ->get([
                'id', 'title_ar', 'title_en', 'slug_ar', 'slug_en',
                'excerpt_ar', 'excerpt_en', 'image', 'published_at',
            ]);

        return Inertia::render('ArticleShow', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
        ]);
    }
}
