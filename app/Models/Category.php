<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name_ar',
        'name_en',
        'desc_ar',
        'desc_en',
        'slug_ar',
        'slug_en',
        'img',
        'status',
    ];
    public function subCategories()
    {
        return $this->hasMany(SubCategory::class, 'categories_id');
    }
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
