<?php

namespace App\Http\Controllers\Web;

use App\Services\AlgoliaSearchService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class SearchController
{
    protected AlgoliaSearchService $algoliaSearchService;

    public function __construct(AlgoliaSearchService $algoliaSearchService)
    {
        $this->algoliaSearchService = $algoliaSearchService;
    }

    /**
     * Perform search and return results
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        $category = $request->get('category', 'all');
        $tags = $request->get('tags', []);
        $limit = $request->get('limit', 20);

        if (is_string($tags)) {
            $tags = explode(',', $tags);
        }

        try {
            $articles = $this->algoliaSearchService->searchArticles($query, $category, $tags, $limit);

            return response()->json([
                'success' => true,
                'data' => $articles,
                'total' => count($articles),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Search failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get search suggestions
     */
    public function suggestions(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        $limit = $request->get('limit', 5);

        try {
            $suggestions = $this->algoliaSearchService->getSuggestions($query, $limit);

            return response()->json([
                'success' => true,
                'data' => $suggestions,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Suggestions failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get search facets for filtering
     */
    public function facets(Request $request): JsonResponse
    {
        try {
            $facets = $this->algoliaSearchService->getSearchFacets();

            return response()->json([
                'success' => true,
                'data' => $facets,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Facets failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}