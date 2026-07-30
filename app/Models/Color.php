<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Color extends Model
{
    protected $fillable = ['name_ar', 'name_en', 'hex'];

    public function products()
    {
        return $this->belongsToMany(Product::class)->withPivot('stock')->withTimestamps();
    }
}
