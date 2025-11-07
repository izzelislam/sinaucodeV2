<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ArticleService;
use App\Services\SeriesService;
use App\Services\CategoryService;
use App\Services\TagService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class ArticleController extends Controller
{
    protected ArticleService $articleService;
    protected SeriesService $seriesService;
    protected CategoryService $categoryService;
    protected TagService $tagService;

    public function __construct(
        ArticleService $articleService,
        SeriesService $seriesService,
        CategoryService $categoryService,
        TagService $tagService
    ) {
        $this->articleService = $articleService;
        $this->seriesService = $seriesService;
        $this->categoryService = $categoryService;
        $this->tagService = $tagService;
    }

    /**
     * Display a listing of articles.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'author_id', 'series_id', 'category_id', 'tags']);

        $articles = $this->articleService->getPaginatedArticles($request);

        return Inertia::render('Admin/Article/Index', [
            'articles' => $articles,
            'filters' => $filters,
            'statusOptions' => $this->articleService->getStatusOptions(),
            'seriesOptions' => $this->seriesService->getSeriesOptions(),
            'categoryOptions' => $this->categoryService->getCategoryOptions(),
            'tagOptions' => $this->tagService->getTagOptions(),
        ]);
    }

    /**
     * Show the form for creating a new article.
     */
    public function create(Request $request): Response
    {
        $seriesId = $request->get('series_id');

        return Inertia::render('Admin/Article/Form', [
            'article' => null,
            'mode' => 'create',
            'seriesOptions' => $this->seriesService->getSeriesOptions(),
            'categoryOptions' => $this->categoryService->getCategoryOptions(),
            'tagOptions' => $this->tagService->getTagOptions(),
            'defaultSeriesId' => $seriesId,
        ]);
    }

    /**
     * Store a newly created article in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $article = $this->articleService->createArticle($request);

            return redirect()
                ->route('admin.articles.index')
                ->with('success', "Article '{$article->title}' has been created successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create article: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified article.
     */
    public function show(int $id): Response
    {
        $article = $this->articleService->getArticleById($id);

        return Inertia::render('Admin/Article/Show', [
            'article' => $article,
        ]);
    }

    /**
     * Show the form for editing the specified article.
     */
    public function edit(int $id): Response
    {
        $article = $this->articleService->getArticleById($id);

        return Inertia::render('Admin/Article/Form', [
            'article' => $article,
            'mode' => 'edit',
            'seriesOptions' => $this->seriesService->getSeriesOptions(),
            'categoryOptions' => $this->categoryService->getCategoryOptions(),
            'tagOptions' => $this->tagService->getTagOptions(),
        ]);
    }

    /**
     * Update the specified article in storage.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        try {
            $article = $this->articleService->getArticleById($id);
            $updatedArticle = $this->articleService->updateArticle($request, $article);

            return redirect()
                ->route('admin.articles.index')
                ->with('success', "Article '{$updatedArticle->title}' has been updated successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update article: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified article from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        try {
            $article = $this->articleService->getArticleById($id);
            $articleTitle = $article->title;

            $this->articleService->deleteArticle($article);

            return redirect()
                ->route('admin.articles.index')
                ->with('success', "Article '{$articleTitle}' has been deleted successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to delete article: ' . $e->getMessage()]);
        }
    }

    /**
     * Publish article
     */
    public function publish(int $id): RedirectResponse
    {
        try {
            $article = $this->articleService->getArticleById($id);
            $this->articleService->publishArticle($article);

            return redirect()
                ->back()
                ->with('success', "Article '{$article->title}' has been published successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to publish article: ' . $e->getMessage()]);
        }
    }

    /**
     * Unpublish article (change to draft)
     */
    public function unpublish(int $id): RedirectResponse
    {
        try {
            $article = $this->articleService->getArticleById($id);
            $this->articleService->unpublishArticle($article);

            return redirect()
                ->back()
                ->with('success', "Article '{$article->title}' has been changed to draft.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to unpublish article: ' . $e->getMessage()]);
        }
    }

    /**
     * API endpoint to get articles as JSON (for AJAX requests)
     */
    public function apiIndex(Request $request): JsonResponse
    {
        try {
            $articles = $this->articleService->getArticles($request);

            return response()->json([
                'success' => true,
                'data' => $articles,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch articles: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * API endpoint to get article options for dropdowns
     */
    public function apiOptions(): JsonResponse
    {
        try {
            $options = $this->articleService->getArticleOptions();

            return response()->json([
                'success' => true,
                'data' => $options,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch article options: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update article metadata
     */
    public function updateMetadata(Request $request, int $id): RedirectResponse
    {
        try {
            $article = $this->articleService->getArticleById($id);

            $this->articleService->updateArticleMetadata($article, $request->all());

            return redirect()
                ->back()
                ->with('success', "Article metadata has been updated successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to update metadata: ' . $e->getMessage()]);
        }
    }
}