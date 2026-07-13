<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Category;

class SubCategory extends Model
{

    protected $fillable = [
        'category_id',
        'name_ar',
        'name_en',
        'slug',
        'desc_ar',
        'desc_en',
        'img',
        'is_active',
    ];


    public function category(){
        return $this->belongsTo(Category::class);
    }
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
