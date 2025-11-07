<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Category;
use App\Models\Series;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardService
{
    /**
     * Get dashboard statistics
     */
    public function getStats(): array
    {
        $now = Carbon::now();
        $lastWeek = Carbon::now()->subWeek();
        $lastMonth = Carbon::now()->subMonth();

        // Total articles count
        $totalArticles = Article::count();
        $articlesLastWeek = Article::where('created_at', '>=', $lastWeek)->count();
        $articlesPercentage = $this->calculatePercentage($totalArticles, $articlesLastWeek);

        // Published articles
        $publishedArticles = Article::where('status', 'published')->count();
        
        // Draft articles
        $draftArticles = Article::where('status', 'draft')->count();

        // Total views (from viewers table - count records)
        $totalViews = DB::table('viewers')->count();
        $viewsLastWeek = DB::table('viewers')
            ->where('timestamp', '>=', $lastWeek)
            ->count();
        $viewsPercentage = $this->calculatePercentage($totalViews, $viewsLastWeek);

        return [
            [
                'title' => 'Total Articles',
                'value' => (string) $totalArticles,
                'note' => [
                    'text' => $articlesPercentage >= 0 ? "+{$articlesPercentage}% this week" : "{$articlesPercentage}% this week",
                    'className' => $articlesPercentage >= 0 ? 'text-green-500' : 'text-red-500'
                ],
            ],
            [
                'title' => 'Published',
                'value' => (string) $publishedArticles,
                'tag' => 'Live',
                'caption' => 'articles online',
            ],
            [
                'title' => 'Draft Articles',
                'value' => (string) $draftArticles,
                'note' => [
                    'text' => $draftArticles > 0 ? 'Ready to publish' : 'All published',
                    'className' => $draftArticles > 0 ? 'text-amber-500' : 'text-green-500'
                ],
            ],
            [
                'title' => 'Total Views',
                'value' => $this->formatNumber($totalViews),
                'progress' => min(100, ($publishedArticles > 0 ? ($totalViews / ($publishedArticles * 100)) * 100 : 0)),
                'delta' => $viewsPercentage >= 0 ? "+{$viewsPercentage}%" : "{$viewsPercentage}%",
            ],
        ];
    }

    /**
     * Get recent articles
     */
    public function getRecentArticles(int $limit = 5): array
    {
        return Article::with(['author', 'categories'])
            ->latest()
            ->limit($limit)
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'status' => $article->status,
                    'author' => $article->author->name ?? 'Unknown',
                    'created_at' => $article->created_at->format('M d, Y'),
                    'categories' => $article->categories->pluck('name')->toArray(),
                ];
            })
            ->toArray();
    }

    /**
     * Get content performance data
     */
    public function getContentPerformance(): array
    {
        $lastDays = 7;
        $performance = [];

        for ($i = $lastDays - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $articlesCount = Article::whereDate('created_at', $date->format('Y-m-d'))->count();
            
            $performance[] = [
                'date' => $date->format('M d'),
                'articles' => $articlesCount,
            ];
        }

        return $performance;
    }

    /**
     * Get categories overview
     */
    public function getCategoriesOverview(): array
    {
        return Category::withCount('articles')
            ->orderBy('articles_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'count' => $category->articles_count,
                    'percentage' => $this->calculateCategoryPercentage($category->articles_count),
                ];
            })
            ->toArray();
    }

    /**
     * Get series overview
     */
    public function getSeriesOverview(): array
    {
        return Series::withCount('articles')
            ->orderBy('articles_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($series) {
                return [
                    'id' => $series->id,
                    'title' => $series->title,
                    'count' => $series->articles_count,
                    'status' => $series->status,
                ];
            })
            ->toArray();
    }

    /**
     * Get popular tags
     */
    public function getPopularTags(int $limit = 10): array
    {
        return Tag::withCount('articles')
            ->orderBy('articles_count', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($tag) {
                return [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'count' => $tag->articles_count,
                ];
            })
            ->toArray();
    }

    /**
     * Get quick summary
     */
    public function getQuickSummary(): array
    {
        return [
            'total_articles' => Article::count(),
            'total_categories' => Category::count(),
            'total_series' => Series::count(),
            'total_tags' => Tag::count(),
            'total_authors' => User::count(),
        ];
    }

    /**
     * Calculate percentage change
     */
    private function calculatePercentage(int $total, int $recent): int
    {
        if ($total == 0) {
            return 0;
        }
        
        $previous = $total - $recent;
        if ($previous == 0) {
            return 100;
        }

        return (int) round((($recent - $previous) / $previous) * 100);
    }

    /**
     * Calculate category percentage
     */
    private function calculateCategoryPercentage(int $count): int
    {
        $total = Article::count();
        if ($total == 0) {
            return 0;
        }

        return (int) round(($count / $total) * 100);
    }

    /**
     * Format large numbers
     */
    private function formatNumber(int $number): string
    {
        if ($number >= 1000000) {
            return round($number / 1000000, 1) . 'M';
        } elseif ($number >= 1000) {
            return round($number / 1000, 1) . 'K';
        }

        return (string) $number;
    }
}
