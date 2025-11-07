<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    protected CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Display a listing of categories.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status']);

        $categories = $this->categoryService->getPaginatedCategories($request);

        return Inertia::render('Admin/Category/Index', [
            'categories' => $categories,
            'filters' => $filters,
            'statusOptions' => $this->categoryService->getStatusOptions(),
        ]);
    }

    /**
     * Show the form for creating a new category.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Category/Form', [
            'category' => null,
            'mode' => 'create',
            'parentCategories' => $this->categoryService->getCategoryOptions(),
        ]);
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $category = $this->categoryService->createCategory($request);

            return redirect()
                ->route('admin.categories.index')
                ->with('success', "Category '{$category->name}' has been created successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create category: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified category.
     */
    public function show(int $id): Response
    {
        $category = $this->categoryService->getCategoryById($id);
        // dd($category->toArray());

        return Inertia::render('Admin/Category/Show', [
            'category' => $category,
        ]);
    }

    /**
     * Show the form for editing the specified category.
     */
    public function edit(int $id): Response
    {
        $category = $this->categoryService->getCategoryById($id);

        return Inertia::render('Admin/Category/Form', [
            'category' => $category,
            'mode' => 'edit',
            'parentCategories' => $this->categoryService->getCategoryOptions(),
        ]);
    }

    /**
     * Update the specified category in storage.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        try {
            $category = $this->categoryService->getCategoryById($id);
            $updatedCategory = $this->categoryService->updateCategory($request, $category);

            return redirect()
                ->route('admin.categories.index')
                ->with('success', "Category '{$updatedCategory->name}' has been updated successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update category: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        try {
            $category = $this->categoryService->getCategoryById($id);
            $categoryName = $category->name;

            $this->categoryService->deleteCategory($category);

            return redirect()
                ->route('admin.categories.index')
                ->with('success', "Category '{$categoryName}' has been deleted successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to delete category: ' . $e->getMessage()]);
        }
    }

    /**
     * API endpoint to get categories as JSON (for AJAX requests)
     */
    public function apiIndex(Request $request): JsonResponse
    {
        try {
            $categories = $this->categoryService->getCategories($request);

            return response()->json([
                'success' => true,
                'data' => $categories,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch categories: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * API endpoint to get category options for dropdowns
     */
    public function apiOptions(): JsonResponse
    {
        try {
            $options = $this->categoryService->getCategoryOptions();

            return response()->json([
                'success' => true,
                'data' => $options,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch category options: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Move category to a new parent
     */
    public function move(Request $request, int $id): RedirectResponse
    {
        try {
            $category = $this->categoryService->getCategoryById($id);
            $newParentId = $request->input('parent_id');

            $this->categoryService->moveCategory($category, $newParentId ? (int) $newParentId : null);

            return redirect()
                ->back()
                ->with('success', "Category '{$category->name}' has been moved successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to move category: ' . $e->getMessage()]);
        }
    }

    /**
     * Update category metadata (SEO fields)
     */
    public function updateMetadata(Request $request, int $id): RedirectResponse
    {
        try {
            $category = $this->categoryService->getCategoryById($id);

            $this->categoryService->updateCategoryMetadata($category, $request->all());

            return redirect()
                ->back()
                ->with('success', "Category metadata has been updated successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to update metadata: ' . $e->getMessage()]);
        }
    }
}