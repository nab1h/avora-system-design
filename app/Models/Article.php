<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Article extends Model
{
    protected $fillable = ['title_ar', 'title_en', 'slug_ar', 'slug_en', 'excerpt_ar', 'excerpt_en', 'content_ar', 'content_en', 'image', 'is_published', 'published_at'];
    protected function casts(): array { return ['is_published' => 'boolean', 'published_at' => 'datetime']; }
    public function images(): HasMany { return $this->hasMany(ArticleImage::class)->orderBy('sort_order'); }
}
