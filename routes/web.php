<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


// Dashboard Admin
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin', function () {
        return Inertia::render('AdminDashboard');
    })->name('admin');

    Route::get('/categories', function () {
        return Inertia::render('Categories');
    })->name('categories');

    Route::get('/products', function () {
        return Inertia::render('Products');
    })->name('products');

    Route::get('/transactions', function () {
        return Inertia::render('Transactions');
    })->name('transactions');

    Route::get('/users', function () {
        return Inertia::render('Users');
    })->name('users');
});

// Route::middleware(['auth', 'admin'])->group(function () {
//     // Route::get('/Admin/Daftar-pegawai',[PegawaiController::class,'index'])->name("pegawai.index");
//     // Route::post('/Admin/tambah-pegawai', [PegawaiController::class,'store'])->name('pegawai.store');
//     // // Route::get(`/edit-pegawai`, [PegawaiController::class,'edit'])->name('pegawai.edit');
//     // Route::get('/admin/pegawai/{pegawai}/edit', [PegawaiController::class, 'edit'])->name('pegawai.edit');
//     // Route::put('/admin/pegawai/{pegawai}/update',[PegawaiController::class,'update'])->name('pegawai.update');
//     // Route::delete('/admin/pegawai/{pegawai}',[PegawaiController::class,'destroy'])->name('pegawai.destroy');
//     // Route::resource('pegawai', PegawaiController::class);
// });

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
