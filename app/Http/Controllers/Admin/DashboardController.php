<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Display the admin dashboard.
     */
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => $this->dashboardService->getStats(),
            'recentArticles' => $this->dashboardService->getRecentArticles(5),
            'contentPerformance' => $this->dashboardService->getContentPerformance(),
            'categories' => $this->dashboardService->getCategoriesOverview(),
            'series' => $this->dashboardService->getSeriesOverview(),
            'popularTags' => $this->dashboardService->getPopularTags(10),
            'summary' => $this->dashboardService->getQuickSummary(),
        ]);
    }
}
