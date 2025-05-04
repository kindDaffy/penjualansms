<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ShopCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'BBK', 'slug' => 'bbk'],
            ['name' => 'Oli Motor 2 Tak', 'slug' => 'oli-motor-2-tak'],
            ['name' => 'Oli Motor Sport', 'slug' => 'oli-motor-sport'],
            ['name' => 'Oli Motor Bebek', 'slug' => 'oli-motor-bebek'],
            ['name' => 'Oli Motor Matic', 'slug' => 'oli-motor-matic'],
            ['name' => 'Oli Mobil Bensin', 'slug' => 'oli-mobil-bensin'],
            ['name' => 'Oli Mobil Diesel', 'slug' => 'oli-mobil-diesel'],
        ];

        foreach ($categories as $category) {
            DB::table('shop_categories')->insert([
                'id' => Str::uuid(),
                'parent_id' => null,
                'name' => $category['name'],
                'slug' => $category['slug'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
