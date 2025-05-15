<?php

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\MidtransWebhookController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CartController;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::post('/midtrans/webhook', [MidtransWebhookController::class, 'handle'])->name('midtrans.webhook');

// Customer
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/oli-mesin', [ProductController::class, 'show_product_oli'])->name('oli-mesin');
    Route::get('/bahan-bakar', [ProductController::class, 'show_product_bbk'])->name('bbk');

    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'addToCart'])->name('cart.add');
    Route::post('/cart/buy', [CartController::class, 'buy'])->name('cart.buy');
    Route::delete('/cart/item/{item}', [CartController::class, 'removeItem'])->name('cart.item.remove');
    Route::put('/cart/item/{item}', [CartController::class, 'updateItemQty'])->name('cart.item.update');
    Route::post('/cart/apply-coupon', [CartController::class, 'applyCoupon'])->name('cart.apply-coupon');
    Route::delete('/cart/remove-coupon', [CartController::class, 'removeCoupon'])->name('cart.remove-coupon');

    Route::post('/checkout', [CheckoutController::class, 'process'])->name('checkout.process');
});

// Admin
Route::middleware(['auth', 'admin'])->group(function () {
    Route::resource('/admin/categories', CategoryController::class)->except(['show'])->whereUuid('category');
    Route::resource('/admin/products', ProductController::class);
    Route::post('/admin/produk/{id}',[ProductController::class,'update']);
    Route::resource('/admin/users', UserController::class)->except(['show']);
    // Admin - Update Role
    Route::put('/admin/users/{user}/role', [UserController::class, 'updateRole'])->name('users.updateRole');

    Route::get('/admin', function () {
        return Inertia::render('AdminDashboard');
    })->name('admin');
    
    Route::get('/admin/products/{product}/edit', [ProductController::class, 'edit'])
    ->name('products.edit')
    ->whereUuid('product');

    Route::get('/transactions', function () {
        return Inertia::render('Transactions');
    })->name('transactions');

});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
