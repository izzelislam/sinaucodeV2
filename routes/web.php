<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\TemplateController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Web\HomeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');

Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes (protected by authentication)
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // User management routes (admin only)
    Route::middleware(['admin'])->group(function () {
        Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserManagementController::class, 'create'])->name('users.create');
        Route::post('/users', [UserManagementController::class, 'store'])->name('users.store');
        Route::resource('templates', TemplateController::class);
        Route::resource('categories', CategoryController::class);

        // Category specific routes
        Route::get('/api/categories', [CategoryController::class, 'apiIndex'])->name('categories.api.index');
        Route::get('/api/categories/options', [CategoryController::class, 'apiOptions'])->name('categories.api.options');
        Route::post('/categories/{category}/move', [CategoryController::class, 'move'])->name('categories.move');
        Route::patch('/categories/{category}/metadata', [CategoryController::class, 'updateMetadata'])->name('categories.metadata.update');
    });
});

require __DIR__.'/auth.php';
