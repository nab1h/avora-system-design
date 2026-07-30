<?php
namespace App\Models; use Illuminate\Database\Eloquent\Model;
class Material extends Model { protected $fillable=['name_ar','name_en']; public function products(){ return $this->belongsToMany(Product::class)->withTimestamps(); } }
