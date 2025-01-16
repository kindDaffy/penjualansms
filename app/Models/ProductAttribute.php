<?php

namespace App\Models;

use Database\Factories\ProductAttributeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProductAttribute extends Model
{
    use HasFactory;

    protected $table = 'shop_product_attributes';

    protected $fillable = [
        'product_id',
        'attribute_id',
        'string_value',
        'text_value',
        'boolean_value',
        'integer_value',
        'float_value',
        'datetime_value',
        'date_value',
        'json_value',
    ];
    
    protected static function newFactory()
    {
        return ProductAttributeFactory::new();
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

    public function product()
    {
        return $this->belongsTo('Product');
    }

    public function attribute()
    {
        return $this->belongsTo('Attribute');
    }
}
