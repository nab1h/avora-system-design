<?php
namespace App\Models; use Illuminate\Database\Eloquent\Model;
class CustomerAddress extends Model { protected $fillable=['user_id','full_name','phone','country','city','area','street','building','floor','apartment','postal_code','notes']; public function user(){return $this->belongsTo(User::class);} }
