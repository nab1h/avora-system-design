<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classes extends Model
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

    protected $casts = [
        'status' => 'boolean',
    ];
    public function products(){
        $this->hasMany(Product::class, 'class_id');
    }

}
