<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Series;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ArticleService
{
    protected MediaService $mediaService;

    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }

    /**
     * Get all articles with optional filtering
     */
    public function getArticles(Request $request): Collection
    {
        $query = Article::with(['author', 'series', 'categories', 'tags', 'featuredImage'])
            ->withCount(['categories', 'tags']);

        // Search by title, content, or excerpt
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by author
        if ($request->filled('author_id')) {
            $query->where('user_id', $request->input('author_id'));
        }

        // Filter by series
        if ($request->filled('series_id')) {
            $query->where('series_id', $request->input('series_id'));
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', $request->input('category_id'));
            });
        }

        // Filter by tags
        if ($request->filled('tags')) {
            $tags = explode(',', $request->input('tags'));
            $query->whereHas('tags', function ($q) use ($tags) {
                $q->whereIn('tags.id', $tags);
            });
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get paginated articles for admin index
     */
    public function getPaginatedArticles(Request $request)
    {
        $query = Article::with(['author', 'series', 'categories', 'tags', 'featuredImage'])
            ->withCount(['categories', 'tags']);

        // Apply same filters as getArticles method
        $this->applyFilters($query, $request);

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    /**
     * Apply common filters to article queries
     */
    private function applyFilters($query, Request $request)
    {
        // Search functionality
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filter by author
        if ($request->filled('author_id')) {
            $query->where('user_id', $request->input('author_id'));
        }

        // Filter by series
        if ($request->filled('series_id')) {
            $query->where('series_id', $request->input('series_id'));
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', $request->input('category_id'));
            });
        }

        // Filter by tags
        if ($request->filled('tags')) {
            $tags = explode(',', $request->input('tags'));
            $query->whereHas('tags', function ($q) use ($tags) {
                $q->whereIn('tags.id', $tags);
            });
        }
    }

    /**
     * Get article by ID with relationships
     */
    public function getArticleById(int $id): ?Article
    {
        return Article::with(['author', 'series', 'categories', 'tags', 'media'])->findOrFail($id);
    }

    /**
     * Create a new article
     */
    public function createArticle(Request $request): Article
    {
        $data = $this->validateArticleData($request);

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        // Set default excerpt if not provided
        if (empty($data['excerpt'])) {
            $data['excerpt'] = Str::limit(strip_tags($data['content'] ?? ''), 150);
        }

        // Set published_at if status is published and not set
        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        // Set series_order if adding to series
        if (!empty($data['series_id'])) {
            $maxOrder = Article::where('series_id', $data['series_id'])->max('series_order') ?? 0;
            $data['series_order'] = $maxOrder + 1;
        }

        DB::beginTransaction();
        try {
            $article = Article::create($data);

            // Handle featured image upload
            if ($request->hasFile('featured_image')) {
                $this->handleFeaturedImageUpload($request->file('featured_image'), $article);
            }

            // Sync categories
            if (!empty($data['categories'])) {
                $article->categories()->sync($data['categories']);
            }

            // Sync tags
            if (!empty($data['tags'])) {
                $article->tags()->sync($data['tags']);
            }

            DB::commit();
            return $article->load(['author', 'series', 'categories', 'tags', 'featuredImage']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update an existing article
     */
    public function updateArticle(Request $request, Article $article): Article
    {
        $data = $this->validateArticleData($request, $article->id);

        // Generate slug if title changed and slug not provided
        if (isset($data['title']) && $data['title'] !== $article->title && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        // Update excerpt if content changed and excerpt not provided
        if (isset($data['content']) && $data['content'] !== $article->content && empty($data['excerpt'])) {
            $data['excerpt'] = Str::limit(strip_tags($data['content']), 150);
        }

        // Set published_at if status changed to published and not set
        if (isset($data['status']) && $data['status'] === 'published' && !$article->published_at) {
            $data['published_at'] = now();
        }

        // Handle series change
        if (isset($data['series_id']) && $data['series_id'] != $article->series_id) {
            if (!empty($data['series_id'])) {
                $maxOrder = Article::where('series_id', $data['series_id'])->max('series_order') ?? 0;
                $data['series_order'] = $maxOrder + 1;
            } else {
                $data['series_order'] = null;
            }
        }

        DB::beginTransaction();
        try {
            $article->update($data);

            // Handle featured image upload
            if ($request->hasFile('featured_image')) {
                // Delete existing featured image
                if ($article->featuredImage) {
                    $this->mediaService->delete($article->featuredImage);
                }
                $this->handleFeaturedImageUpload($request->file('featured_image'), $article);
            }

            // Sync categories
            if (isset($data['categories'])) {
                $article->categories()->sync($data['categories']);
            }

            // Sync tags
            if (isset($data['tags'])) {
                $article->tags()->sync($data['tags']);
            }

            DB::commit();
            return $article->fresh(['author', 'series', 'categories', 'tags', 'featuredImage']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete an article
     */
    public function deleteArticle(Article $article): bool
    {
        // Delete associated media
        foreach ($article->media as $media) {
            $this->mediaService->delete($media);
        }

        // Detach relationships
        $article->categories()->detach();
        $article->tags()->detach();

        return $article->delete();
    }

    /**
     * Get article options for dropdowns
     */
    public function getArticleOptions(): \Illuminate\Support\Collection
    {
        return Article::orderBy('title')
            ->get(['id', 'title'])
            ->map(function ($article) {
                return [
                    'value' => $article->id,
                    'label' => $article->title,
                ];
            });
    }

    /**
     * Get status options for filtering
     */
    public function getStatusOptions(): array
    {
        return [
            ['label' => 'Published', 'value' => 'published'],
            ['label' => 'Draft', 'value' => 'draft'],
            ['label' => 'Scheduled', 'value' => 'scheduled'],
        ];
    }

    /**
     * Handle featured image upload
     */
    protected function handleFeaturedImageUpload($uploadedFile, Article $article): void
    {
        $media = $this->mediaService->uploadFeaturedImage(
            $uploadedFile,
            $article->id,
            Article::class
        );
    }

    /**
     * Validate article data
     */
    protected function validateArticleData(Request $request, ?int $articleId = null): array
    {
        $rules = [
            'title' => 'required|string|max:255|unique:articles,title,' . $articleId,
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'status' => 'required|in:draft,published,scheduled',
            'series_id' => 'nullable|exists:series,id',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'required', // Allow existing IDs (integers) and new tag names (strings with "new:" prefix)
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'published_at' => 'nullable|date',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // 10MB max
        ];

        // Additional validation for scheduled status
        if ($request->input('status') === 'scheduled') {
            $rules['published_at'] = 'required|date|after:now';
        }

        // Get all data first
        $requestData = $request->all();

        // Pre-process tags to convert objects to IDs before validation
        if (isset($requestData['tags']) && is_array($requestData['tags'])) {
            $requestData['tags'] = array_map(function($tag) {
                // Handle if tag is an object (with 'id' property)
                if (is_object($tag) && isset($tag->id)) {
                    return (int) $tag->id;
                }

                // Handle if tag is an array (with 'id' key)
                if (is_array($tag) && isset($tag['id'])) {
                    return (int) $tag['id'];
                }

                // Return as-is if it's already an ID or string
                return $tag;
            }, $requestData['tags']);
        }

        // Replace the request data with processed data
        $request->merge($requestData);

        $data = $request->validate($rules);

        // Add authenticated user ID
        $data['user_id'] = auth()->id();

        // Process tags - handle both existing IDs and new tags
        if (isset($data['tags'])) {
            $data['tags'] = $this->processTags($data['tags']);
        }

        return $data;
    }

    /**
     * Process tags array - create new tags if needed and return tag IDs
     */
    private function processTags(array $tags): array
    {
        $tagIds = [];

        foreach ($tags as $tag) {
            // Handle if tag is an object (with 'id' property)
            if (is_object($tag) && isset($tag->id)) {
                $tagIds[] = (int) $tag->id;
                continue;
            }

            // Handle if tag is an array (with 'id' key)
            if (is_array($tag) && isset($tag['id'])) {
                $tagIds[] = (int) $tag['id'];
                continue;
            }

            // Convert to string if it's an integer for checking
            $tagString = is_numeric($tag) ? (string)$tag : $tag;

            if (is_string($tagString) && substr($tagString, 0, 4) === 'new:') {
                // Create new tag
                $tagName = substr($tagString, 4); // Remove 'new:' prefix
                $tagName = trim($tagName);

                if (!empty($tagName)) {
                    $slug = Str::slug($tagName);
                    $newTag = Tag::firstOrCreate(
                        ['slug' => $slug],
                        ['name' => $tagName, 'slug' => $slug]
                    );
                    $tagIds[] = $newTag->id;
                }
            } else {
                // Existing tag ID
                $tagIds[] = (int) $tag;
            }
        }

        return array_unique($tagIds);
    }

    /**
     * Update article metadata
     */
    public function updateArticleMetadata(Article $article, array $data): Article
    {
        $allowedFields = ['meta_title', 'meta_description'];

        $metadata = array_intersect_key($data, array_flip($allowedFields));

        if (!empty($metadata)) {
            $article->update($metadata);
        }

        return $article->fresh();
    }

    /**
     * Publish article
     */
    public function publishArticle(Article $article): Article
    {
        $article->update([
            'status' => 'published',
            'published_at' => $article->published_at ?: now(),
        ]);

        return $article->fresh();
    }

    /**
     * Unpublish article (change to draft)
     */
    public function unpublishArticle(Article $article): Article
    {
        $article->update([
            'status' => 'draft',
        ]);

        return $article->fresh();
    }

    /**
     * Schedule article for publication
     */
    public function scheduleArticle(Article $article, \DateTime $publishAt): Article
    {
        $article->update([
            'status' => 'scheduled',
            'published_at' => $publishAt,
        ]);

        return $article->fresh();
    }
}