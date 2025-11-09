<?php

namespace App\Http\Controllers\Web;

use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Series;
use App\Models\Viewer;
use App\Services\ArticleService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController
{
    public function __invoke(Request $request): Response
    {
        // Get published articles only for public view
        $articles = Article::with(['author', 'categories', 'tags', 'featuredImage'])
            ->where('status', 'published')
            ->orderBy('published_at', 'desc')
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'title' => $article->title,
                    'excerpt' => $article->excerpt,
                    'content' => $article->content,
                    'slug' => $article->slug,
                    'category' => $article->categories->first()?->name ?? 'Uncategorized',
                    'tags' => $article->tags->pluck('name')->toArray(),
                    'author' => [
                        'name' => $article->author?->name ?? 'Anonymous',
                        'email' => $article->author?->email,
                        'avatar' => $this->getAuthorAvatar($article->author),
                    ],
                    'published_at' => $article->published_at->format('Y-m-d'),
                    'read_time' => $this->calculateReadTime($article->content),
                    'featured_image' => $article->featuredImage?->url,
                    'views' => $article->viewers->count() ?? 0,
                ];
            });

        // Get series tutorials
        $seriesTutorials = Series::with(['articles' => function ($query) {
            $query->where('status', 'published')->orderBy('series_order');
        }])->get()->map(function ($series) {
            // Get the title from series or generate one
            $title = $series->title ?: 'Untitled Series';

            return [
                'id' => $series->id,
                'title' => $series->name,
                'description' => strip_tags($series->description ?? '') ?: 'A collection of related tutorials and guides.',
                'category' => $series->articles->first()?->categories->first()?->name ?? 'General',
                'parts' => $series->articles->count(),
                'level' => $this->getDifficultyLevel($series), // You can add level field to series table
            ];
        })->filter(function ($series) {
            return $series['parts'] > 0; // Only show series with published articles
        });

        // Get categories with featured images for filtering
        $categories = ['All'];
        $dbCategories = Category::whereHas('articles', function ($query) {
            $query->where('status', 'published');
        })->with(['featuredImage'])->orderBy('name')->get()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => strip_tags($category->description ?? ''),
                'featured_image' => $category->featuredImage?->url,
                'article_count' => $category->articles()->where('status', 'published')->count(),
            ];
        })->toArray();
        $categories = array_merge($categories, $dbCategories);

        // Get all tags for filtering
        $tags = ['All'];
        $tags = array_merge($tags, Tag::whereHas('articles', function ($query) {
            $query->where('status', 'published');
        })->orderBy('name')->pluck('name')->toArray());

        return Inertia::render('Web/Index', [
            'articles' => $articles,
            'seriesTutorials' => $seriesTutorials->values()->all(),
            'categories' => $categories,
            'tags' => $tags,
            // Algolia search configuration for frontend
            'algolia' => [
                'appId' => config('scout.algolia.id'),
                'indexName' => 'articles',
                'searchApiKey' => env('ALGOLIA_SEARCH_KEY', ''),
            ],
        ]);
    }

    /**
     * Calculate approximate reading time in minutes
     */
    private function calculateReadTime(string $content): int
    {
        $wordCount = str_word_count(strip_tags($content));
        $wordsPerMinute = 200; // Average reading speed
        return max(1, ceil($wordCount / $wordsPerMinute));
    }

    /**
     * Get difficulty level for series
     * This is a placeholder - you might want to add a level field to your series table
     */
    private function getDifficultyLevel(Series $series): string
    {
        // For now, return a default level
        // You could implement logic based on content complexity, article count, etc.
        return 'Beginner';
    }

    /**
     * Get author avatar (fallback to initials-based avatar)
     */
    private function getAuthorAvatar($author): string
    {
        if (!$author) {
            return $this->generateInitialsAvatar('Anonymous');
        }

        // If there's a profile_picture field or media relationship in the future, use it here
        // For now, generate initials-based avatar
        return $this->generateInitialsAvatar($author->name);
    }

    /**
     * Generate avatar with initials using a service like UI Avatars
     */
    private function generateInitialsAvatar(string $name): string
    {
        $initials = $this->getInitials($name);
        $colors = ['7F9CF5', '55A3FF', '5E72E4', '2DCE89', 'F5365C', 'FB6340', '11CDEF'];
        $color = $colors[abs(crc32($name)) % count($colors)];

        return "https://ui-avatars.com/api/?name=" . urlencode($initials) . "&background={$color}&color=ffffff&size=128&font-size=0.6&bold=true";
    }

    /**
     * Get initials from name
     */
    private function getInitials(string $name): string
    {
        $words = preg_split('/[\s,_-]+/', $name);
        if (count($words) >= 2) {
            return strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1));
        }
        return strtoupper(substr($name, 0, 2));
    }

    /**
     * Show individual article with related articles
     */
    public function show(string $slug): Response
    {
        $article = Article::with([
            'author',
            'categories',
            'tags',
            'featuredImage',
            'series',
            'viewers'
        ])
        ->where('slug', $slug)
        ->where('status', 'published')
        ->firstOrFail();

        // Record view for analytics
        $this->recordArticleView($article);

        // Get related articles based on category and tags
        $relatedArticles = $this->getRelatedArticles($article);

        // Get series articles if article belongs to a series
        $seriesArticles = [];
        if ($article->series) {
            $seriesArticles = $article->series->articles()
                ->with(['author', 'categories', 'tags', 'featuredImage'])
                ->where('status', 'published')
                ->where('id', '!=', $article->id)
                ->orderBy('series_order')
                ->get()
                ->map(function ($seriesArticle) {
                    return [
                        'id' => $seriesArticle->id,
                        'title' => $seriesArticle->title,
                        'excerpt' => $seriesArticle->excerpt,
                        'slug' => $seriesArticle->slug,
                        'featured_image' => $seriesArticle->featuredImage?->url,
                        'published_at' => $seriesArticle->published_at->format('Y-m-d'),
                        'read_time' => $this->calculateReadTime($seriesArticle->content),
                        'series_order' => $seriesArticle->series_order,
                    ];
                });
        }

        // Format article data
        $formattedArticle = [
            'id' => $article->id,
            'title' => $article->title,
            'content' => $article->content,
            'excerpt' => $article->excerpt,
            'slug' => $article->slug,
            'published_at' => $article->published_at->format('F j, Y'),
            'read_time' => $this->calculateReadTime($article->content),
            'views' => $article->viewers->count(),
            'category' => $article->categories->first(),
            'tags' => $article->tags,
            'author' => [
                'name' => $article->author?->name ?? 'Anonymous',
                'email' => $article->author?->email,
                'avatar' => $this->getAuthorAvatar($article->author),
            ],
            'featured_image' => $article->featuredImage?->url,
            'series' => $article->series ? [
                'id' => $article->series->id,
                'name' => $article->series->name,
                'slug' => $article->series->slug,
                'description' => $article->series->description,
                'current_order' => $article->series_order,
                'total_articles' => $article->series->publishedArticles()->count(),
            ] : null,
            'meta_title' => $article->meta_title,
            'meta_description' => $article->meta_description,
        ];

        return Inertia::render('Web/ArticleDetail', [
            'article' => $formattedArticle,
            'relatedArticles' => $relatedArticles,
            'seriesArticles' => $seriesArticles,
            'disqusConfig' => [
                'shortname' => config('services.disqus.shortname', env('VITE_DISQUS_SHORTNAME', '')),
                'url' => url('/article/' . $article->slug),
                'language' => 'en',
            ],
        ]);
    }

    /**
     * Get related articles based on category and tags
     */
    private function getRelatedArticles(Article $article): array
    {
        // Get articles from same category or with same tags
        $categoryIds = $article->categories->pluck('id')->toArray();
        $tagIds = $article->tags->pluck('id')->toArray();

        $relatedQuery = Article::with(['author', 'categories', 'tags', 'featuredImage'])
            ->where('status', 'published')
            ->where('id', '!=', $article->id)
            ->where(function ($query) use ($categoryIds, $tagIds) {
                // Articles from same category
                $query->whereHas('categories', function ($q) use ($categoryIds) {
                    $q->whereIn('categories.id', $categoryIds);
                })
                // OR articles with same tags
                ->orWhereHas('tags', function ($q) use ($tagIds) {
                    $q->whereIn('tags.id', $tagIds);
                });
            });

        // Get and format related articles
        return $relatedQuery->orderBy('published_at', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($relatedArticle) {
                return [
                    'id' => $relatedArticle->id,
                    'title' => $relatedArticle->title,
                    'excerpt' => $relatedArticle->excerpt,
                    'slug' => $relatedArticle->slug,
                    'featured_image' => $relatedArticle->featuredImage?->url,
                    'published_at' => $relatedArticle->published_at->format('Y-m-d'),
                    'read_time' => $this->calculateReadTime($relatedArticle->content),
                    'category' => $relatedArticle->categories->first(),
                    'author' => [
                        'name' => $relatedArticle->author?->name ?? 'Anonymous',
                    ],
                ];
            })
            ->toArray();
    }

    /**
     * Record article view for analytics
     */
    private function recordArticleView(Article $article): void
    {
        // Use the Viewer model's trackView method
        // This handles IP hashing and timestamp automatically
        Viewer::trackView($article, request()->ip(), request()->userAgent());
    }
}
