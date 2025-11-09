<?php

namespace App\Console\Commands;

use App\Models\Article;
use Illuminate\Console\Command;
use Algolia\AlgoliaSearch\SearchClient;

class IndexArticlesToAlgolia extends Command
{
    protected $signature = 'algolia:index-articles';
    protected $description = 'Manually index articles to Algolia';

    public function handle()
    {
        $appId = env('ALGOLIA_APP_ID');
        $adminKey = env('ALGOLIA_SECRET');
        
        if (!$appId || !$adminKey) {
            $this->error('Algolia credentials not found in .env file');
            return 1;
        }

        $this->info('Connecting to Algolia...');
        $client = SearchClient::create($appId, $adminKey);
        $index = $client->initIndex('articles');

        $this->info('Fetching published articles...');
        $articles = Article::with(['author', 'categories', 'tags', 'featuredImage'])
            ->where('status', 'published')
            ->get();

        if ($articles->isEmpty()) {
            $this->warn('No published articles found to index.');
            return 0;
        }

        $this->info("Found {$articles->count()} articles. Indexing...");

        $records = $articles->map(function ($article) {
            return [
                'objectID' => (string) $article->id,
                'title' => $article->title,
                'excerpt' => $article->excerpt,
                'content' => strip_tags($article->content),
                'slug' => $article->slug,
                'category' => $article->categories->first()?->name ?? 'Uncategorized',
                'tags' => $article->tags->pluck('name')->toArray(),
                'author_name' => $article->author?->name ?? 'Anonymous',
                'published_at' => $article->published_at?->timestamp,
                'featured_image' => $article->featuredImage?->url,
                'status' => $article->status,
            ];
        })->toArray();

        try {
            $index->saveObjects($records);
            $this->info('Successfully indexed ' . count($records) . ' articles to Algolia!');
            return 0;
        } catch (\Exception $e) {
            $this->error('Error indexing articles: ' . $e->getMessage());
            return 1;
        }
    }
}
