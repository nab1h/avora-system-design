<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{


// relation---------
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class);
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
}
