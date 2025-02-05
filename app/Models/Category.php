<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Database\Factories\CategoryFactory;
use Illuminate\Support\Str;
use App\Models\Product;

class Category extends Model
{
    use HasFactory;

    protected $table = 'shop_categories';

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'parent_id',
        'slug',
        'name',
    ];

    protected static function newFactory(){
        return CategoryFactory::new();
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

    public function children()
    {
        return $this->hasMany(\App\Models\Category::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(\App\Models\Category::class, 'parent_id');
    }

    public function products()
    {
        return $this->belongsToMany(\App\Models\Product::class, 'shop_categories_products', 'product_id', 'category_id');
    }
}
