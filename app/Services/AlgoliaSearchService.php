<?php

namespace App\Services;

use App\Models\Article;
use Laravel\Scout\Builder as ScoutBuilder;

class AlgoliaSearchService
{
    /**
     * Search articles using Algolia
     *
     * @param string $query
     * @param string|null $category
     * @param array|null $tags
     * @param int $limit
     * @return array
     */
    public function searchArticles(string $query, ?string $category = null, ?array $tags = null, int $limit = 20): array
    {
        $search = Article::search($query);

        // Apply category filter
        if ($category && $category !== 'all') {
            $search->where('category', $category);
        }

        // Apply tags filter
        if ($tags && !empty($tags)) {
            foreach ($tags as $tag) {
                if ($tag && $tag !== 'all') {
                    $search->where('tags', $tag);
                }
            }
        }

        // Only show published articles
        $search->where('status', 'published');

        // Limit results
        $search->take($limit);

        // Get results with relationships
        $results = $search->get()->load(['author', 'categories', 'tags', 'featuredImage']);

        return $results->map(function ($article) {
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
        })->toArray();
    }

    /**
     * Get popular search suggestions
     *
     * @param string $query
     * @param int $limit
     * @return array
     */
    public function getSuggestions(string $query, int $limit = 5): array
    {
        if (strlen($query) < 2) {
            return [];
        }

        $search = Article::search($query)
            ->where('status', 'published')
            ->take($limit);

        return $search->get()->map(function ($article) {
            return [
                'title' => $article->title,
                'excerpt' => $article->excerpt,
                'slug' => $article->slug,
                'category' => $article->categories->first()?->name ?? 'Uncategorized',
            ];
        })->toArray();
    }

    /**
     * Get search facets for filtering
     *
     * @return array
     */
    public function getSearchFacets(): array
    {
        $search = Article::search('')
            ->where('status', 'published')
            ->take(0);

        $results = $search->raw();

        $facets = [];

        if (isset($results['facets'])) {
            foreach ($results['facets'] as $facet => $values) {
                if ($facet === 'category') {
                    $facets['categories'] = array_keys($values);
                } elseif ($facet === 'tags') {
                    $facets['tags'] = array_keys($values);
                }
            }
        }

        return $facets;
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
     * Calculate approximate reading time in minutes
     */
    private function calculateReadTime(string $content): int
    {
        $wordCount = str_word_count(strip_tags($content));
        $wordsPerMinute = 200; // Average reading speed
        return max(1, ceil($wordCount / $wordsPerMinute));
    }
}