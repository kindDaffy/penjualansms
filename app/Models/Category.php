<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Database\Factories\CategoryFactory;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory;

    protected $table = 'shop_categories';

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
        return $this->hasMany('Category', 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo('Category', 'parent_id');
    }

    public function products()
    {
        return $this->belongsToMany('Product', 'shop_categories_products', 'product_id', 'category_id');
    }
}
