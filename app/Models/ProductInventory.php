<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Database\Factories\ProductInventoryFactory;
use Illuminate\Support\Str;

class ProductInventory extends Model
{
    use HasFactory;

    protected $table = 'shop_product_inventories';
    
    protected $fillable = [
        'product_id',
        'qty',
        'low_stock_threshold',
    ];

    protected static function newFactory()
    {
        return ProductInventoryFactory::new();
    }

    protected static function boot()
    {
        parent::boot();

        // Generate UUID secara otomatis untuk kolom id
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Str::uuid()->toString(); // Generate UUID baru
            }
        });
    }
}
