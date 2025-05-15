<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use UuidTrait;

    protected $table = 'shop_coupons';

    protected $fillable = [
        'code', 
        'discount_percent', 
        'discount_amount', 
        'valid_until',
        'quota',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'shop_coupon_usages');
    }
}

