<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SeriesService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class SeriesController extends Controller
{
    protected SeriesService $seriesService;

    public function __construct(SeriesService $seriesService)
    {
        $this->seriesService = $seriesService;
    }

    /**
     * Display a listing of series.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status']);

        $series = $this->seriesService->getPaginatedSeries($request);

        return Inertia::render('Admin/Series/Index', [
            'series' => $series,
            'filters' => $filters,
            'statusOptions' => $this->seriesService->getStatusOptions(),
        ]);
    }

    /**
     * Show the form for creating a new series.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Series/Form', [
            'series' => null,
            'mode' => 'create',
        ]);
    }

    /**
     * Store a newly created series in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $series = $this->seriesService->createSeries($request);

            return redirect()
                ->route('admin.series.index')
                ->with('success', "Series '{$series->name}' has been created successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create series: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified series.
     */
    public function show(int $id): Response
    {
        $series = $this->seriesService->getSeriesById($id);

        return Inertia::render('Admin/Series/Show', [
            'series' => $series,
        ]);
    }

    /**
     * Show the form for editing the specified series.
     */
    public function edit(int $id): Response
    {
        $series = $this->seriesService->getSeriesById($id);

        return Inertia::render('Admin/Series/Form', [
            'series' => $series,
            'mode' => 'edit',
        ]);
    }

    /**
     * Update the specified series in storage.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        try {
            $series = $this->seriesService->getSeriesById($id);
            $updatedSeries = $this->seriesService->updateSeries($request, $series);

            return redirect()
                ->route('admin.series.index')
                ->with('success', "Series '{$updatedSeries->name}' has been updated successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update series: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified series from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        try {
            $series = $this->seriesService->getSeriesById($id);
            $seriesName = $series->name;

            $this->seriesService->deleteSeries($series);

            return redirect()
                ->route('admin.series.index')
                ->with('success', "Series '{$seriesName}' has been deleted successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to delete series: ' . $e->getMessage()]);
        }
    }

    /**
     * API endpoint to get series as JSON (for AJAX requests)
     */
    public function apiIndex(Request $request): JsonResponse
    {
        try {
            $series = $this->seriesService->getSeries($request);

            return response()->json([
                'success' => true,
                'data' => $series,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch series: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * API endpoint to get series options for dropdowns
     */
    public function apiOptions(): JsonResponse
    {
        try {
            $options = $this->seriesService->getSeriesOptions();

            return response()->json([
                'success' => true,
                'data' => $options,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch series options: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update series metadata
     */
    public function updateMetadata(Request $request, int $id): RedirectResponse
    {
        try {
            $series = $this->seriesService->getSeriesById($id);

            $this->seriesService->updateSeriesMetadata($series, $request->all());

            return redirect()
                ->back()
                ->with('success', "Series metadata has been updated successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to update metadata: ' . $e->getMessage()]);
        }
    }

    /**
     * Reorder articles in series
     */
    public function reorderArticles(Request $request, int $id): RedirectResponse
    {
        try {
            $series = $this->seriesService->getSeriesById($id);
            $articleOrders = $request->input('article_orders', []);

            $this->seriesService->reorderArticles($series, $articleOrders);

            return redirect()
                ->back()
                ->with('success', "Article order has been updated successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to reorder articles: ' . $e->getMessage()]);
        }
    }
}