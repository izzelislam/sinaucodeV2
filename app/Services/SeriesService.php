<?php

namespace App\Services;

use App\Models\Series;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Collection;

class SeriesService
{
    protected MediaService $mediaService;

    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }

    /**
     * Get all series with optional filtering
     */
    public function getSeries(Request $request): Collection
    {
        $query = Series::with(['featuredImage', 'media'])
            ->withCount(['articles', 'publishedArticles']);

        // Search by name or description
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Filter by status (active/inactive based on articles)
        if ($request->filled('status')) {
            if ($request->input('status') === 'active') {
                $query->whereHas('publishedArticles');
            } elseif ($request->input('status') === 'inactive') {
                $query->doesntHave('publishedArticles');
            }
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Get paginated series for admin index
     */
    public function getPaginatedSeries(Request $request)
    {
        $query = Series::with(['featuredImage', 'media'])
            ->withCount(['articles', 'publishedArticles']);

        // Search functionality
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            if ($request->input('status') === 'active') {
                $query->whereHas('publishedArticles');
            } elseif ($request->input('status') === 'inactive') {
                $query->doesntHave('publishedArticles');
            }
        }

        // Order by name
        return $query->orderBy('name')->paginate(10);
    }

    /**
     * Get series by ID with relationships
     */
    public function getSeriesById(int $id): ?Series
    {
        return Series::with(['featuredImage', 'media', 'articles' => function ($query) {
            $query->orderBy('series_order');
        }])->findOrFail($id);
    }

    /**
     * Create a new series
     */
    public function createSeries(Request $request): Series
    {
        $data = $this->validateSeriesData($request);

        // Generate slug if not provided
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $series = Series::create($data);

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            $this->handleFeaturedImageUpload($request->file('featured_image'), $series);
        }

        return $series->load(['featuredImage', 'media']);
    }

    /**
     * Update an existing series
     */
    public function updateSeries(Request $request, Series $series): Series
    {
        $data = $this->validateSeriesData($request, $series->id);

        // Generate slug if name changed and slug not provided
        if (isset($data['name']) && $data['name'] !== $series->name && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $series->update($data);

        // Handle featured image upload
        if ($request->hasFile('featured_image')) {
            // Delete existing featured image
            if ($series->featuredImage) {
                $this->mediaService->delete($series->featuredImage);
            }
            $this->handleFeaturedImageUpload($request->file('featured_image'), $series);
        }

        return $series->load(['featuredImage', 'media']);
    }

    /**
     * Delete a series
     */
    public function deleteSeries(Series $series): bool
    {
        // Check if series has articles
        if ($series->articles()->count() > 0) {
            throw new \InvalidArgumentException('Cannot delete series that has articles. Please remove or reassign articles first.');
        }

        // Delete associated media
        foreach ($series->media as $media) {
            $this->mediaService->delete($media);
        }

        return $series->delete();
    }

    /**
     * Get series options for dropdown/select
     */
    public function getSeriesOptions(): \Illuminate\Support\Collection
    {
        return Series::orderBy('name')
            ->get(['id', 'name'])
            ->map(function ($series) {
                return [
                    'value' => $series->id,
                    'label' => $series->name,
                ];
            });
    }

    /**
     * Get status options for filtering
     */
    public function getStatusOptions(): array
    {
        return [
            ['label' => 'Active Series', 'value' => 'active'],
            ['label' => 'Inactive Series', 'value' => 'inactive'],
        ];
    }

    /**
     * Handle featured image upload
     */
    protected function handleFeaturedImageUpload($uploadedFile, Series $series): void
    {
        $media = $this->mediaService->uploadFeaturedImage(
            $uploadedFile,
            $series->id,
            Series::class
        );

        // Update series with featured image info if needed
        // (The relationship is handled through the polymorphic relation)
    }

    /**
     * Validate series data
     */
    protected function validateSeriesData(Request $request, ?int $seriesId = null): array
    {
        $rules = [
            'name' => 'required|string|max:255|unique:series,name,' . $seriesId,
            'description' => 'nullable|string',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240', // 10MB max
        ];

        return $request->validate($rules);
    }

    /**
     * Update series metadata
     */
    public function updateSeriesMetadata(Series $series, array $data): Series
    {
        // Currently no metadata fields for series, but keeping for consistency
        if (!empty($data)) {
            $series->update($data);
        }

        return $series->fresh();
    }

    /**
     * Reorder articles in series
     */
    public function reorderArticles(Series $series, array $articleOrders): Series
    {
        foreach ($articleOrders as $articleId => $order) {
            $series->articles()
                ->where('id', $articleId)
                ->update(['series_order' => $order]);
        }

        return $series->fresh(['articles' => function ($query) {
            $query->orderBy('series_order');
        }]);
    }
}