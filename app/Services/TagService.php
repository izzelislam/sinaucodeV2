<?php

namespace App\Services;

use App\Models\Tag;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Collection;

class TagService
{
    /**
     * Get all tags with optional filtering
     */
    public function getTags(Request $request): Collection
    {
        $query = Tag::withCount(['articles']);

        // Search by name
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Filter by minimum article count
        if ($request->filled('min_articles')) {
            $query->having('articles_count', '>=', $request->input('min_articles'));
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Get paginated tags for admin index
     */
    public function getPaginatedTags(Request $request)
    {
        $query = Tag::withCount(['articles']);

        // Search functionality
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Filter by minimum article count
        if ($request->filled('min_articles')) {
            $query->having('articles_count', '>=', $request->input('min_articles'));
        }

        return $query->orderBy('name')->paginate(20);
    }

    /**
     * Get tag by ID with relationships
     */
    public function getTagById(int $id): ?Tag
    {
        return Tag::with(['articles' => function ($query) {
            $query->orderBy('created_at', 'desc')->limit(10);
        }])->findOrFail($id);
    }

    /**
     * Create a new tag
     */
    public function createTag(Request $request): Tag
    {
        $data = $this->validateTagData($request);

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return Tag::create($data);
    }

    /**
     * Update an existing tag
     */
    public function updateTag(Request $request, Tag $tag): Tag
    {
        $data = $this->validateTagData($request, $tag->id);

        // Generate slug if name changed and slug not provided
        if (isset($data['name']) && $data['name'] !== $tag->name && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $tag->update($data);
        return $tag->fresh();
    }

    /**
     * Delete a tag
     */
    public function deleteTag(Tag $tag): bool
    {
        // Detach from all articles
        $tag->articles()->detach();

        return $tag->delete();
    }

    /**
     * Get popular tags (most used)
     */
    public function getPopularTags(int $limit = 10): Collection
    {
        return Tag::withCount(['articles'])
            ->orderBy('articles_count', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get tag options for dropdown/select
     */
    public function getTagOptions(): \Illuminate\Support\Collection
    {
        return Tag::orderBy('name')
            ->get(['id', 'name'])
            ->map(function ($tag) {
                return [
                    'value' => $tag->id,
                    'label' => $tag->name,
                ];
            });
    }

    /**
     * Find or create tags by names
     */
    public function findOrCreateTags(array $tagNames): Collection
    {
        $tags = collect();

        foreach ($tagNames as $tagName) {
            $tagName = trim($tagName);
            if (empty($tagName)) continue;

            $tag = Tag::firstOrCreate(
                ['slug' => Str::slug($tagName)],
                ['name' => $tagName]
            );

            $tags->push($tag);
        }

        return $tags;
    }

    /**
     * Get tags with usage statistics
     */
    public function getTagStatistics(): Collection
    {
        return Tag::withCount(['articles'])
            ->orderBy('articles_count', 'desc')
            ->get()
            ->map(function ($tag) {
                return [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'slug' => $tag->slug,
                    'articles_count' => $tag->articles_count,
                    'created_at' => $tag->created_at,
                ];
            });
    }

    /**
     * Validate tag data
     */
    protected function validateTagData(Request $request, ?int $tagId = null): array
    {
        $rules = [
            'name' => 'required|string|max:100|unique:tags,name,' . $tagId,
        ];

        return $request->validate($rules);
    }

    /**
     * Merge duplicate tags
     */
    public function mergeDuplicateTags(): array
    {
        $duplicates = Tag::selectRaw('LOWER(name) as normalized_name, GROUP_CONCAT(id) as ids, COUNT(*) as count')
            ->groupBy('normalized_name')
            ->having('count', '>', 1)
            ->get();

        $mergedCount = 0;

        foreach ($duplicates as $duplicate) {
            $ids = explode(',', $duplicate->ids);
            $keepTagId = array_shift($ids); // Keep the first ID

            // Move all articles from duplicate tags to the main tag
            foreach ($ids as $tagId) {
                $tag = Tag::find($tagId);
                if ($tag) {
                    $articles = $tag->articles()->pluck('articles.id');
                    Tag::find($keepTagId)->articles()->syncWithoutDetaching($articles);
                    $tag->delete();
                    $mergedCount++;
                }
            }
        }

        return [
            'merged_count' => $mergedCount,
            'duplicate_groups' => $duplicates->count(),
        ];
    }

    /**
     * Clean up unused tags (tags with no articles)
     */
    public function cleanupUnusedTags(): int
    {
        $unusedTags = Tag::whereDoesntHave('articles')->get();
        $count = $unusedTags->count();

        $unusedTags->each->delete();

        return $count;
    }
}