<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Database\Factories\ProductFactory;
use App\Models\Category;
use Illuminate\Support\Str;
use App\Traits\UuidTrait;


class Product extends Model
{
    use HasFactory, UuidTrait;
    
    protected $table = 'shop_products';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'parent_id', 'user_id', 'sku', 'type', 'name', 'slug', 'price',
        'featured_image', 'sale_price', 'status', 'stock_status', 'manage_stock',
        'publish_date', 'excerpt', 'body', 'metas',
    ];

    public const DRAFT = 'DRAFT';
    public const ACTIVE = 'ACTIVE';
    public const INACTIVE = 'INACTIVE';

    public const STATUSES = [
        self::DRAFT => 'Draft',
        self::ACTIVE => 'Active',
        self::INACTIVE => 'Inactive',
    ];

    public const STATUS_IN_STOCK = 'IN_STOCK';
    public const STATUS_OUT_OF_STOCK = 'OUT_OF_STOCK';

    public const STOCK_STATUSES = [
        self::STATUS_IN_STOCK => 'In Stock',
        self::STATUS_OUT_OF_STOCK => 'Out of Stock',
    ];

    public const SIMPLE = 'SIMPLE';
    public const CONFIGURABLE = 'CONFIGURABLE';
    public const TYPES = [
        self::SIMPLE => 'Simple',
        self::CONFIGURABLE => 'Configurable',
    ];
    
    protected static function newFactory()
    {
        return ProductFactory::new();
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Str::uuid()->toString();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function inventory()
    {
        return $this->hasOne(ProductInventory::class);
    }

    public function variants()
    {
        return $this->hasMany(Product::class, 'parent_id')->orderBy('price', 'ASC');
    }
    
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'shop_categories_products', 'product_id', 'category_id');
    }    

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'shop_products_tags', 'product_id', 'tag_id');
    }

    public function attributes()
    {
        return $this->hasMany(ProductAttribute::class, 'product_id');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }

    public function image()
    {
        return $this->hasOne(ProductImage::class)->where('id', $this->featured_image);
    }

    // Accessor yang Disesuaikan
    public function getFeaturedImageUrlAttribute()
    {
        if (empty($this->featured_image)) {
            return asset('https://placehold.jp/150x150.png'); // Placeholder jika tidak ada gambar
        }

        // Jika path gambar dimulai dengan 'images/', berarti itu dari public/images/ (seeder)
        if (Str::startsWith($this->featured_image, 'images/')) {
            return asset($this->featured_image);
        }

        // Jika path gambar dimulai dengan 'product-images/' atau pola lainnya yang disimpan di storage/app/public/
        // Asumsi: ini adalah gambar yang di-upload dan disimpan di storage/app/public/
        // Maka URL-nya harus melalui symbolic link 'storage/'
        return asset('storage/' . $this->featured_image);
    }
}