<?php

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Generate sitemap daily at 2 AM
        $schedule->command('sitemap:generate')
            ->dailyAt('02:00')
            ->description('Generate sitemap for all public pages')
            ->withoutOverlapping()
            ->onSuccess(function () {
                \Log::info('Sitemap generation completed successfully');
            })
            ->onFailure(function () {
                \Log::error('Sitemap generation failed');
            });

        // Index articles to Algolia every 6 hours
        $schedule->command('app:index-articles-to-algolia')
            ->everySixHours()
            ->description('Index articles to Algolia search')
            ->withoutOverlapping();

        // Clean up old sitemap logs weekly
        $schedule->command('log:clear', ['--keep' => 30])
            ->weekly()
            ->description('Clean up old log files');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}