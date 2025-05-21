<?php

namespace App\Models;

use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'shop_orders';

    protected $fillable = [
        'user_id',
        'code',
        'status',
        'coupon_id',
        'approved_by',
        'approved_at',
        'cancelled_by',
        'cancelled_at',
        'cancellation_note',
        'order_date',
        'payment_due',
        'payment_url',
        'base_total_price',
        'tax_amount',
        'tax_percent',
        'discount_amount',
        'discount_percent',
        'grand_total',
        'customer_note',
        'customer_first_name',
        'customer_last_name',
        'customer_email',
    ];

    public const STATUS_PENDING = 'PENDING';
    public const STATUS_CONFIRMED = 'CONFIRMED';
    public const STATUS_COMPLETED = 'COMPLETED';
    public const STATUS_CANCELLED = 'CANCELLED';

    public const ORDER_CODE = 'ORDER';
    
    protected static function newFactory()
    {
        return OrderFactory::new();
    }

    public function items() : HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public static function generateCode()
    {
        $dateCode = self::ORDER_CODE . '/' . date('Y') . '/' . date('m') . '/' . date('d') . '/';
        
        $uuid = substr(Str::uuid()->toString(), 0, 18);

        $orderCode = $dateCode . $uuid;

        // Pastikan unik
        while (self::where('code', $orderCode)->exists()) {
            $uuid = substr(Str::uuid()->toString(), 0, 18);
            $orderCode = $dateCode . $uuid;
        }

        return $orderCode;
    }


    private static function isCodeExists($orderCode)
    {
        return Order::where('code', '=', $orderCode)->exists();
    }
}
