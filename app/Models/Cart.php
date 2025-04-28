<?php

namespace App\Models;

use App\Traits\UuidTrait;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use UuidTrait;

    protected $table = 'shop_carts';

    protected $fillable = [
        'user_id',
        'expired_at',
        'base_total_price',
        'tax_amount',
        'tax_percent',
        'discount_amount',
        'discount_percent',
        'grand_total',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    public function totalQuantity()
    {
        return $this->items->sum('qty');
    }
}
