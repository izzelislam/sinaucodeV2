<?php

namespace App\Console\Commands;

use App\Models\Article;
use App\Models\Category;
use App\Models\Series;
use App\Models\Tag;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate sitemap for all public pages';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating sitemap...');

        try {
            $sitemap = Sitemap::create();

            // Add homepage
            $sitemap->add(Url::create('/')
                ->setLastModificationDate(Carbon::now())
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
                ->setPriority(1.0));

            // Add static pages
            $staticPages = [
                'about' => 0.8,
                'contact' => 0.7,
                'search' => 0.6,
            ];

            foreach ($staticPages as $page => $priority) {
                $sitemap->add(Url::create("/{$page}")
                    ->setLastModificationDate(Carbon::now()->subDays(7))
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                    ->setPriority($priority));
            }

            // Add category pages
            $categories = Category::whereHas('articles', function ($query) {
                $query->where('status', 'published');
            })->get();

            foreach ($categories as $category) {
                $lastArticle = $category->articles()
                    ->where('status', 'published')
                    ->latest('published_at')
                    ->first();

                $sitemap->add(Url::create("/?category={$category->slug}")
                    ->setLastModificationDate($lastArticle ? $lastArticle->updated_at : Carbon::now()->subDays(30))
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                    ->setPriority(0.9));
            }

            // Add series pages
            $series = Series::whereHas('articles', function ($query) {
                $query->where('status', 'published');
            })->get();

            foreach ($series as $item) {
                $lastArticle = $item->articles()
                    ->where('status', 'published')
                    ->latest('published_at')
                    ->first();

                $sitemap->add(Url::create("/series/{$item->slug}")
                    ->setLastModificationDate($lastArticle ? $lastArticle->updated_at : Carbon::now()->subDays(30))
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                    ->setPriority(0.9));
            }

            // Add tag pages
            $tags = Tag::whereHas('articles', function ($query) {
                $query->where('status', 'published');
            })->get();

            foreach ($tags as $tag) {
                $lastArticle = $tag->articles()
                    ->where('status', 'published')
                    ->latest('published_at')
                    ->first();

                $sitemap->add(Url::create("/?tag={$tag->slug}")
                    ->setLastModificationDate($lastArticle ? $lastArticle->updated_at : Carbon::now()->subDays(30))
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                    ->setPriority(0.7));
            }

            // Add published articles
            $articles = Article::where('status', 'published')
                ->with(['categories', 'tags'])
                ->orderBy('updated_at', 'desc')
                ->get();

            foreach ($articles as $article) {
                $priority = $this->calculateArticlePriority($article);

                $url = Url::create("/article/{$article->slug}")
                    ->setLastModificationDate($article->updated_at)
                    ->setChangeFrequency($this->getChangeFrequency($article))
                    ->setPriority($priority);

                // Add images to the URL if available
                if ($article->featuredImage) {
                    $url->addImage(
                        $article->featuredImage->url,
                        $article->title,
                        $article->excerpt
                    );
                }

                $sitemap->add($url);
            }

            // Add search results page
            $sitemap->add(Url::create("/search")
                ->setLastModificationDate(Carbon::now())
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
                ->setPriority(0.6));

            // Save the sitemap
            $sitemap->writeToFile(public_path('sitemap.xml'));

            $this->info('Sitemap generated successfully!');
            $this->info("Total URLs: " . count($sitemap->getTags()));

            Log::info('Sitemap generated successfully', [
                'total_urls' => count($sitemap->getTags()),
                'generated_at' => Carbon::now()
            ]);

        } catch (\Exception $e) {
            $this->error('Error generating sitemap: ' . $e->getMessage());
            Log::error('Sitemap generation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return 1;
        }

        return 0;
    }

    /**
     * Calculate article priority based on various factors
     */
    private function calculateArticlePriority($article): float
    {
        $priority = 0.5;

        // Boost priority for recent articles
        $daysSincePublished = $article->published_at->diffInDays(now());
        if ($daysSincePublished <= 7) {
            $priority += 0.3;
        } elseif ($daysSincePublished <= 30) {
            $priority += 0.2;
        } elseif ($daysSincePublished <= 90) {
            $priority += 0.1;
        }

        // Boost priority for articles with featured images
        if ($article->featuredImage) {
            $priority += 0.1;
        }

        // Boost priority for articles in series
        if ($article->series) {
            $priority += 0.1;
        }

        // Boost priority based on view count
        $views = $article->viewers->count() ?? 0;
        if ($views > 1000) {
            $priority += 0.1;
        } elseif ($views > 500) {
            $priority += 0.05;
        }

        return min(1.0, $priority);
    }

    /**
     * Determine change frequency based on article age
     */
    private function getChangeFrequency($article): string
    {
        $daysSinceUpdated = $article->updated_at->diffInDays(now());

        if ($daysSinceUpdated <= 7) {
            return Url::CHANGE_FREQUENCY_DAILY;
        } elseif ($daysSinceUpdated <= 30) {
            return Url::CHANGE_FREQUENCY_WEEKLY;
        } elseif ($daysSinceUpdated <= 90) {
            return Url::CHANGE_FREQUENCY_MONTHLY;
        } else {
            return Url::CHANGE_FREQUENCY_YEARLY;
        }
    }
}
