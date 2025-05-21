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
        'coupon_id',
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

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    public $jerigen_count = 0;
    public function recalculateTotals()
    {
        $jerigenFee = 20000;

        $uniqueBbkTypes = $this->items->filter(function ($item) {
            return $item->use_jerigen && $item->product->categories->contains('slug', 'bbk');
        })->unique(fn($item) => $item->product->slug);

        $this->jerigen_count = $uniqueBbkTypes->count(); // ⬅️ set langsung ke property

        $baseTotal = $this->items->sum(fn($item) => $item->qty * $item->price);
        $discount = $this->discount_amount ?? 0;
        $grandTotal = $baseTotal - $discount;

        if ($this->jerigen_count > 0) {
            $grandTotal += $jerigenFee * $this->jerigen_count;
        }

        $this->update([
            'base_total_price' => $baseTotal,
            'grand_total' => max(0, $grandTotal),
        ]);

        return true;
    }
}
