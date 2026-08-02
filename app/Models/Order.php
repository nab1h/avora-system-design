<?php
namespace App\Models; use Illuminate\Database\Eloquent\Model;
class Order extends Model { protected $fillable=['uuid','user_id','payment_transaction_id','status','subtotal','total','currency','paid_at']; protected $casts=['paid_at'=>'datetime']; public function items(){return $this->hasMany(OrderItem::class);} public function user(){return $this->belongsTo(User::class);} public function transaction(){return $this->belongsTo(PaymentTransaction::class,'payment_transaction_id');} }
