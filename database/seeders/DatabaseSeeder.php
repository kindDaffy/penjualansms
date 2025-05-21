<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Tag;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::factory()->create();

        $this->call([
            UserSeeder::class,
            ProductTableSeeder::class,
            ShopCategorySeeder::class,
            CouponSeeder::class,

        ]);

    }
}
