<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\MidtransWebhookController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\TransactionController;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::get('/oli-mesin', [ProductController::class, 'show_product_oli'])->name('oli-mesin');
Route::get('/bahan-bakar', [ProductController::class, 'show_product_bbk'])->name('bbk');
Route::post('/midtrans/webhook', [MidtransWebhookController::class, 'handle'])->name('midtrans.webhook');

// Customer
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'addToCart'])->name('cart.add');
    Route::post('/cart/buy', [CartController::class, 'buy'])->name('cart.buy');
    Route::delete('/cart/item/{item}', [CartController::class, 'removeItem'])->name('cart.item.remove');
    Route::put('/cart/item/{item}', [CartController::class, 'updateItemQty'])->name('cart.item.update');
    Route::post('/cart/apply-coupon', [CartController::class, 'applyCoupon'])->name('cart.apply-coupon');
    Route::delete('/cart/remove-coupon', [CartController::class, 'removeCoupon'])->name('cart.remove-coupon');

    Route::post('/checkout', [CheckoutController::class, 'process'])->name('checkout.process');
    Route::get('/order-history', [CheckoutController::class, 'history'])->name('checkout.history');

    Route::get('/checkout/success', function () {
        return Inertia::render('Customer/OrderSuccess');
    })->name('checkout.success');
});

// Admin
Route::middleware(['auth', 'admin'])->group(function () {
    Route::resource('/admin/categories', CategoryController::class)->except(['show'])->whereUuid('category');
    Route::get('products/archive', [ProductController::class, 'archive'])->name('products.archive'); // <-- ROUTE BARU
        Route::post('products/{product}/restore', [ProductController::class, 'restore'])
            ->name('products.restore')
            ->whereUuid('product'); // <-- ROUTE BARU
        Route::delete('products/{product}/force-delete', [ProductController::class, 'forceDelete'])
            ->name('products.forceDelete')
            ->whereUuid('product'); // <-- ROUTE BARU
    Route::resource('/admin/products', ProductController::class);
    Route::resource('/admin/transaction', TransactionController::class);
    Route::post('/admin/transaction/{order}/complete', [TransactionController::class, 'complete'])
    ->name('transaction.complete')
    ->whereUuid('order');
    Route::get('/admin/coupons', [CouponController::class, 'index'])->name('coupons.index');
    Route::post('/admin/coupons', [CouponController::class, 'store'])->name('coupons.store');
    Route::put('/admin/coupons/{coupon}', [CouponController::class, 'update'])->name('coupons.update');
    Route::delete('/admin/coupons/{coupon}', [CouponController::class, 'destroy'])->name('coupons.destroy');
    Route::get('/admin/coupons/{coupon}/usage', [CouponController::class, 'usageDetails'])->name('coupons.usage-details');
    Route::resource('/admin/laporan', LaporanController::class);
    Route::resource('/admin/users', UserController::class)->except(['show']);
    Route::put('/admin/users/{user}/role', [UserController::class, 'updateRole'])->name('users.updateRole');
    Route::resource('/admin', AdminDashboardController::class)->names([
        'index' => 'admin', // Menambahkan nama rute untuk method index
        'create' => 'admin.create',
        'store' => 'admin.store',
        'show' => 'admin.show',
        'edit' => 'admin.edit',
        'update' => 'admin.update',
        'destroy' => 'admin.destroy'
    ]);
    Route::post('/admin/produk/{id}',[ProductController::class,'update']);
    Route::get('/admin/products/{product}/edit', [ProductController::class, 'edit'])
    ->name('products.edit')
    ->whereUuid('product');
    Route::get('/admin/laporan-penjualan/export', [LaporanController::class, 'export'])->name('admin.laporan-penjualan.export');
    Route::get('/admin/laporan-penjualan/print', [LaporanController::class, 'print'])->name('admin.laporan-penjualan.print');

});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
