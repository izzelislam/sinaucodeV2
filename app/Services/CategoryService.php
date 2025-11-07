<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    protected MediaService $mediaService;

    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }

    /**
     * Get all categories with optional filtering
     */
    public function getCategories(Request $request): Collection
    {
        $query = Category::with(['parent', 'featuredImage', 'media'])
            ->withCount(['children', 'articles']);

        // Search by name or description
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Filter by parent status
        if ($request->filled('parent_status')) {
            if ($request->input('parent_status') === 'root') {
                $query->root();
            } elseif ($request->input('parent_status') === 'child') {
                $query->parent();
            }
        }

        // Filter by parent category
        if ($request->filled('parent_id')) {
            $query->where('parent_id', $request->input('parent_id'));
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Get paginated categories for admin index
     */
    public function getPaginatedCategories(Request $request)
    {
        $query = Category::with(['parent', 'featuredImage', 'media'])
            ->withCount(['children', 'articles']);

        // Search functionality
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Filter by status (root/child)
        if ($request->filled('status')) {
            if ($request->input('status') === 'root') {
                $query->whereNull('parent_id');
            } elseif ($request->input('status') === 'child') {
                $query->whereNotNull('parent_id');
            }
        }

        // Order by name
        return $query->orderBy('name')->paginate(10);
    }

    /**
     * Get category by ID with relationships
     */
    public function getCategoryById(int $id): ?Category
    {
        return Category::with(['parent', 'children', 'featuredImage', 'media', 'articles'])
            ->findOrFail($id);
    }

    /**
     * Create a new category
     */
    public function createCategory(Request $request): Category
    {
        $data = $this->validateCategoryData($request);

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category = Category::create($data);

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            $this->handleFeaturedImageUpload($request->file('featured_image'), $category);
        }

        return $category->load(['parent', 'featuredImage', 'media']);
    }

    /**
     * Update an existing category
     */
    public function updateCategory(Request $request, Category $category): Category
    {
        $data = $this->validateCategoryData($request, $category->id);

        // Generate slug if name changed and slug not provided
        if (isset($data['name']) && $data['name'] !== $category->name && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category->update($data);

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            // Delete existing featured image
            if ($category->featuredImage) {
                $this->mediaService->delete($category->featuredImage);
            }
            $this->handleFeaturedImageUpload($request->file('featured_image'), $category);
        }

        return $category->load(['parent', 'featuredImage', 'media']);
    }

    /**
     * Delete a category
     */
    public function deleteCategory(Category $category): bool
    {
        // Check if category has children
        if ($category->children()->count() > 0) {
            throw new \InvalidArgumentException('Cannot delete category that has child categories. Please delete or move child categories first.');
        }

        // Delete associated media
        foreach ($category->media as $media) {
            $this->mediaService->delete($media);
        }

        return $category->delete();
    }

    /**
     * Get root categories (categories without parents)
     */
    public function getRootCategories(): Collection
    {
        return Category::root()
            ->with(['featuredImage', 'children'])
            ->orderBy('name')
            ->get();
    }

    /**
     * Get category options for dropdown/select
     */
    public function getCategoryOptions(): \Illuminate\Support\Collection
    {
        return Category::orderBy('name')
            ->get(['id', 'name', 'parent_id'])
            ->map(function ($category) {
                return [
                    'value' => $category->id,
                    'label' => $category->getFullPath(),
                    'level' => $category->parent ? 1 : 0,
                ];
            });
    }

    /**
     * Get status options for filtering
     */
    public function getStatusOptions(): array
    {
        return [
            ['label' => 'Root Category', 'value' => 'root'],
            ['label' => 'Child Category', 'value' => 'child'],
        ];
    }

    /**
     * Handle featured image upload
     */
    protected function handleFeaturedImageUpload($uploadedFile, Category $category): void
    {
        $media = $this->mediaService->uploadFeaturedImage(
            $uploadedFile,
            $category->id,
            Category::class
        );

        // Update category with featured image info if needed
        // (The relationship is handled through the polymorphic relation)
    }

    /**
     * Validate category data
     */
    protected function validateCategoryData(Request $request, ?int $categoryId = null): array
    {
        $rules = [
            'name' => 'required|string|max:255|unique:categories,name,' . $categoryId,
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // 10MB max
        ];

        // If updating, make sure parent_id is not the category itself
        if ($categoryId) {
            $rules['parent_id'] .= '|not_in:' . $categoryId;
        }

        return $request->validate($rules);
    }

    /**
     * Update category metadata (SEO fields)
     */
    public function updateCategoryMetadata(Category $category, array $data): Category
    {
        $allowedFields = ['meta_title', 'meta_description'];

        $metadata = array_intersect_key($data, array_flip($allowedFields));

        if (!empty($metadata)) {
            $category->update($metadata);
        }

        return $category->fresh();
    }

    /**
     * Move category to new parent
     */
    public function moveCategory(Category $category, ?int $newParentId): Category
    {
        // Prevent making a category its own parent
        if ($newParentId === $category->id) {
            throw new \InvalidArgumentException('A category cannot be its own parent.');
        }

        // Prevent creating circular references
        if ($newParentId && $this->wouldCreateCircularReference($category->id, $newParentId)) {
            throw new \InvalidArgumentException('Moving this category would create a circular reference.');
        }

        $category->update(['parent_id' => $newParentId]);

        return $category->fresh(['parent', 'children']);
    }

    /**
     * Check if moving a category would create circular reference
     */
    protected function wouldCreateCircularReference(int $categoryId, int $potentialParentId): bool
    {
        $potentialParent = Category::find($potentialParentId);

        if (!$potentialParent) {
            return false;
        }

        // Check if the potential parent is a descendant of the category being moved
        return $this->isDescendant($potentialParent, $categoryId);
    }

    /**
     * Check if a category is a descendant of another category
     */
    protected function isDescendant(Category $category, int $ancestorId): bool
    {
        if ($category->parent_id === $ancestorId) {
            return true;
        }

        if ($category->parent) {
            return $this->isDescendant($category->parent, $ancestorId);
        }

        return false;
    }
}