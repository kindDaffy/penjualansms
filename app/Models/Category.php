<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Database\Factories\CategoryFactory;
use App\Models\Product;
use App\Traits\UuidTrait;

class Category extends Model
{
    use HasFactory, UuidTrait;

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

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'shop_categories_products', 'product_id', 'category_id');
    }
}
