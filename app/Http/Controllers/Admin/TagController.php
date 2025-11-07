<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\TagService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class TagController extends Controller
{
    protected TagService $tagService;

    public function __construct(TagService $tagService)
    {
        $this->tagService = $tagService;
    }

    /**
     * Display a listing of tags.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'min_articles']);

        $tags = $this->tagService->getPaginatedTags($request);

        return Inertia::render('Admin/Tag/Index', [
            'tags' => $tags,
            'filters' => $filters,
            'statistics' => [
                'total_tags' => $tags->total(),
                'popular_tags' => $this->tagService->getPopularTags(5),
            ],
        ]);
    }

    /**
     * Show the form for creating a new tag.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Tag/Form', [
            'tag' => null,
            'mode' => 'create',
        ]);
    }

    /**
     * Store a newly created tag in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $tag = $this->tagService->createTag($request);

            return redirect()
                ->route('admin.tags.index')
                ->with('success', "Tag '{$tag->name}' has been created successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create tag: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified tag.
     */
    public function show(int $id): Response
    {
        $tag = $this->tagService->getTagById($id);

        return Inertia::render('Admin/Tag/Show', [
            'tag' => $tag,
        ]);
    }

    /**
     * Show the form for editing the specified tag.
     */
    public function edit(int $id): Response
    {
        $tag = $this->tagService->getTagById($id);

        return Inertia::render('Admin/Tag/Form', [
            'tag' => $tag,
            'mode' => 'edit',
        ]);
    }

    /**
     * Update the specified tag in storage.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        try {
            $tag = $this->tagService->getTagById($id);
            $updatedTag = $this->tagService->updateTag($request, $tag);

            return redirect()
                ->route('admin.tags.index')
                ->with('success', "Tag '{$updatedTag->name}' has been updated successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update tag: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified tag from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        try {
            $tag = $this->tagService->getTagById($id);
            $tagName = $tag->name;

            $this->tagService->deleteTag($tag);

            return redirect()
                ->route('admin.tags.index')
                ->with('success', "Tag '{$tagName}' has been deleted successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to delete tag: ' . $e->getMessage()]);
        }
    }

    /**
     * API endpoint to get tags as JSON (for AJAX requests)
     */
    public function apiIndex(Request $request): JsonResponse
    {
        try {
            $tags = $this->tagService->getTags($request);

            return response()->json([
                'success' => true,
                'data' => $tags,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch tags: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * API endpoint to get tag options for dropdowns
     */
    public function apiOptions(): JsonResponse
    {
        try {
            $options = $this->tagService->getTagOptions();

            return response()->json([
                'success' => true,
                'data' => $options,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch tag options: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * API endpoint to get popular tags
     */
    public function apiPopular(Request $request): JsonResponse
    {
        try {
            $limit = $request->input('limit', 10);
            $popularTags = $this->tagService->getPopularTags($limit);

            return response()->json([
                'success' => true,
                'data' => $popularTags,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch popular tags: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Find or create tags by names (API endpoint)
     */
    public function apiFindOrCreate(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'names' => 'required|array',
                'names.*' => 'required|string|max:100',
            ]);

            $tagNames = $request->input('names');
            $tags = $this->tagService->findOrCreateTags($tagNames);

            return response()->json([
                'success' => true,
                'data' => $tags,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to find or create tags: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get tag statistics
     */
    public function statistics(): Response
    {
        $statistics = $this->tagService->getTagStatistics();

        return Inertia::render('Admin/Tag/Statistics', [
            'statistics' => $statistics,
        ]);
    }

    /**
     * Clean up unused tags
     */
    public function cleanup(): RedirectResponse
    {
        try {
            $count = $this->tagService->cleanupUnusedTags();

            return redirect()
                ->back()
                ->with('success', "Cleaned up {$count} unused tags.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to cleanup tags: ' . $e->getMessage()]);
        }
    }

    /**
     * Merge duplicate tags
     */
    public function mergeDuplicates(): RedirectResponse
    {
        try {
            $result = $this->tagService->mergeDuplicateTags();

            return redirect()
                ->back()
                ->with('success', "Merged {$result['merged_count']} duplicate tags from {$result['duplicate_groups']} groups.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to merge duplicate tags: ' . $e->getMessage()]);
        }
    }
}