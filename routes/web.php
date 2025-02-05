<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', function () {
    return redirect()->route('login');
});

// Customer
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/oli-mesin', function () {
        return Inertia::render('OliMesin');
    })->name('oli-mesin');

    Route::get('/bahan-bakar', function () {
        return Inertia::render('BahanBakarKhusus');
    })->name('bahan-bakar');
});

// Dashboard Admin
Route::middleware(['auth', 'admin'])->group(function () {
    Route::resource('categories', CategoryController::class)->except(['show'])->whereUuid('category');
    Route::resource('products', ProductController::class);
    Route::resource('users', UserController::class)->except(['show']);

    Route::get('/admin', function () {
        return Inertia::render('AdminDashboard');
    })->name('admin');

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
