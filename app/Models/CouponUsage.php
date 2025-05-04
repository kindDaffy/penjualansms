<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;

class CouponUsage extends Model
{
    use UuidTrait;

    protected $table = 'shop_coupon_usages';

    protected $fillable = ['user_id', 'coupon_id'];

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

