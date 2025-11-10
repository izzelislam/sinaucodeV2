<?php

use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SeriesController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\TemplateController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Web\HomeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');
Route::get('/article/{slug}', [HomeController::class, 'show'])->name('article.show');

// Sitemap route
Route::get('/sitemap.xml', function () {
    $sitemapPath = public_path('sitemap.xml');

    if (!file_exists($sitemapPath)) {
        // Generate sitemap on-the-fly if it doesn't exist
        \Artisan::call('sitemap:generate');
    }

    $sitemapContent = file_get_contents($sitemapPath);

    return response($sitemapContent, 200, [
        'Content-Type' => 'application/xml; charset=utf-8',
        'Cache-Control' => 'public, max-age=3600', // Cache for 1 hour
    ]);
})->name('sitemap');

// Robots.txt route
Route::get('/robots.txt', function () {
    $robotsPath = public_path('robots.txt');

    if (file_exists($robotsPath)) {
        $robotsContent = file_get_contents($robotsPath);
        // Replace dynamic placeholders
        $robotsContent = str_replace('http://sinaucode.test/sitemap.xml', url('/sitemap.xml'), $robotsContent);
        $robotsContent = str_replace('Host: sinaucode.test', 'Host: ' . parse_url(config('app.url'), PHP_URL_HOST), $robotsContent);
    } else {
        // Create a default robots.txt if it doesn't exist
        $robotsContent = "User-agent: *\n";
        $robotsContent .= "Allow: /\n";
        $robotsContent .= "Disallow: /admin/\n";
        $robotsContent .= "Disallow: /api/\n";
        $robotsContent .= "Allow: /api/search\n";
        $robotsContent .= "Disallow: /profile\n";
        $robotsContent .= "Disallow: /dashboard\n";
        $robotsContent .= "Disallow: /*.json$\n";
        $robotsContent .= "Allow: /*.css$\n";
        $robotsContent .= "Allow: /*.js$\n";
        $robotsContent .= "\n";
        $robotsContent .= "Sitemap: " . url('/sitemap.xml') . "\n";
    }

    return response($robotsContent, 200, [
        'Content-Type' => 'text/plain; charset=utf-8',
        'Cache-Control' => 'public, max-age=86400', // Cache for 24 hours
    ]);
})->name('robots');

// Search routes
Route::prefix('api/search')->name('search.')->group(function () {
    Route::get('/', [App\Http\Controllers\Web\SearchController::class, 'search'])->name('search');
    Route::get('/suggestions', [App\Http\Controllers\Web\SearchController::class, 'suggestions'])->name('suggestions');
    Route::get('/facets', [App\Http\Controllers\Web\SearchController::class, 'facets'])->name('facets');
});

Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin profile routes
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile.index');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.updatePassword');
    Route::post('/profile/picture', [ProfileController::class, 'updateProfilePicture'])->name('profile.updateProfilePicture');
    Route::put('/profile/preferences', [ProfileController::class, 'updatePreferences'])->name('profile.updatePreferences');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Profile API routes
    Route::get('/profile/statistics', [ProfileController::class, 'statistics'])->name('profile.statistics');
    Route::get('/profile/activity', [ProfileController::class, 'activity'])->name('profile.activity');
});

// Admin routes (protected by authentication)
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // User management routes (admin only)
    Route::middleware(['admin'])->group(function () {
        Route::get('/users', [UserManagementController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserManagementController::class, 'create'])->name('users.create');
        Route::post('/users', [UserManagementController::class, 'store'])->name('users.store');
        Route::get('/users/{user}', [UserManagementController::class, 'show'])->name('users.show');
        Route::get('/users/{user}/edit', [UserManagementController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [UserManagementController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');
        Route::post('/users/{user}/toggle-status', [UserManagementController::class, 'toggleStatus'])->name('users.toggleStatus');
        Route::post('/users/{user}/change-role', [UserManagementController::class, 'changeRole'])->name('users.changeRole');

        // User API routes
        Route::get('/api/users', [UserManagementController::class, 'apiIndex'])->name('users.api.index');
        Route::get('/api/users/options', [UserManagementController::class, 'apiOptions'])->name('users.api.options');
        Route::get('/api/users/search', [UserManagementController::class, 'apiSearch'])->name('users.api.search');
        Route::get('/users/statistics', [UserManagementController::class, 'statistics'])->name('users.statistics');

        // Bulk operations
        Route::post('/users/bulk-update-status', [UserManagementController::class, 'bulkUpdateStatus'])->name('users.bulk.update-status');
        Route::post('/users/bulk-update-role', [UserManagementController::class, 'bulkUpdateRole'])->name('users.bulk.update-role');
        Route::resource('templates', TemplateController::class);
        Route::resource('categories', CategoryController::class);
        Route::resource('series', SeriesController::class);
        Route::resource('articles', ArticleController::class);
        Route::resource('tags', TagController::class);

        // Category specific routes
        Route::get('/api/categories', [CategoryController::class, 'apiIndex'])->name('categories.api.index');
        Route::get('/api/categories/options', [CategoryController::class, 'apiOptions'])->name('categories.api.options');
        Route::post('/categories/{category}/move', [CategoryController::class, 'move'])->name('categories.move');
        Route::patch('/categories/{category}/metadata', [CategoryController::class, 'updateMetadata'])->name('categories.metadata.update');

        // Series specific routes
        Route::get('/api/series', [SeriesController::class, 'apiIndex'])->name('series.api.index');
        Route::get('/api/series/options', [SeriesController::class, 'apiOptions'])->name('series.api.options');
        Route::patch('/series/{series}/metadata', [SeriesController::class, 'updateMetadata'])->name('series.metadata.update');
        Route::post('/series/{series}/reorder-articles', [SeriesController::class, 'reorderArticles'])->name('series.reorder.articles');

        // Article specific routes
        Route::get('/api/articles', [ArticleController::class, 'apiIndex'])->name('articles.api.index');
        Route::get('/api/articles/options', [ArticleController::class, 'apiOptions'])->name('articles.api.options');
        Route::patch('/articles/{article}/metadata', [ArticleController::class, 'updateMetadata'])->name('articles.metadata.update');
        Route::post('/articles/{article}/publish', [ArticleController::class, 'publish'])->name('articles.publish');
        Route::post('/articles/{article}/unpublish', [ArticleController::class, 'unpublish'])->name('articles.unpublish');

        // Tag specific routes
        Route::get('/api/tags', [TagController::class, 'apiIndex'])->name('tags.api.index');
        Route::get('/api/tags/options', [TagController::class, 'apiOptions'])->name('tags.api.options');
        Route::get('/api/tags/popular', [TagController::class, 'apiPopular'])->name('tags.api.popular');
        Route::post('/api/tags/find-or-create', [TagController::class, 'apiFindOrCreate'])->name('tags.api.find-or-create');
        Route::get('/tags/statistics', [TagController::class, 'statistics'])->name('tags.statistics');
        Route::post('/tags/cleanup', [TagController::class, 'cleanup'])->name('tags.cleanup');
        Route::post('/tags/merge-duplicates', [TagController::class, 'mergeDuplicates'])->name('tags.merge-duplicates');
    });
});

require __DIR__.'/auth.php';
