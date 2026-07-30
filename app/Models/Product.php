<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'category_id', 'sub_category_id', 'offer_id', 'name_ar', 'name_en',
        'slug_ar', 'slug_en', 'desc_ar', 'desc_en', 'price', 'stock', 'has_custom_color_stock', 'has_custom_size_stock', 'has_custom_weight_stock', 'is_active',
        'class_id', 'brand_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'has_custom_color_stock' => 'boolean',
        'has_custom_size_stock' => 'boolean',
        'has_custom_weight_stock' => 'boolean',
    ];

// relation---------
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function productClass(): BelongsTo
    {
        return $this->belongsTo(Classes::class, 'class_id');
    }
    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }
    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }

    public function favoritedByUsers()
    {
        return $this->belongsToMany(User::class, 'favorites');
    }

    public function usersInCart()
    {
        return $this->belongsToMany(User::class, 'carts')
            ->withPivot('quantity')
            ->withTimestamps();
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
    public function features()
    {
        return $this->hasMany(ProductFeature::class);
    }

    public function colors()
    {
        return $this->belongsToMany(Color::class)->withPivot('stock')->withTimestamps();
    }

    public function sizes() { return $this->belongsToMany(Size::class)->withPivot('stock')->withTimestamps(); }
    public function weights() { return $this->belongsToMany(Weight::class)->withPivot('stock')->withTimestamps(); }
    public function materials() { return $this->belongsToMany(Material::class)->withTimestamps(); }
}
