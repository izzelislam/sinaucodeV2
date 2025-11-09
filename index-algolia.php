<?php

// Simple script to index articles to Algolia without using Laravel Scout
require __DIR__ . '/vendor/autoload.php';

use Algolia\AlgoliaSearch\SearchClient;

// Load .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Database connection
$pdo = new PDO(
    'mysql:host=' . $_ENV['DB_HOST'] . ';dbname=' . $_ENV['DB_DATABASE'],
    $_ENV['DB_USERNAME'],
    $_ENV['DB_PASSWORD']
);

// Get articles
$stmt = $pdo->query('
    SELECT a.*, u.name as author_name, GROUP_CONCAT(DISTINCT c.name) as categories, GROUP_CONCAT(DISTINCT t.name) as tags
    FROM articles a
    LEFT JOIN users u ON a.user_id = u.id
    LEFT JOIN article_category ac ON a.id = ac.article_id
    LEFT JOIN categories c ON ac.category_id = c.id
    LEFT JOIN article_tag at ON a.id = at.article_id
    LEFT JOIN tags t ON at.tag_id = t.id
    WHERE a.status = "published"
    GROUP BY a.id
');

$articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($articles)) {
    echo "No published articles found.\n";
    exit(0);
}

echo "Found " . count($articles) . " articles.\n";

// Connect to Algolia
$client = SearchClient::create(
    trim($_ENV['ALGOLIA_APP_ID']),
    trim($_ENV['ALGOLIA_SECRET'])
);

$index = $client->initIndex('articles');

// Prepare records
$records = array_map(function($article) {
    return [
        'objectID' => (string) $article['id'],
        'title' => $article['title'],
        'excerpt' => $article['excerpt'],
        'content' => strip_tags($article['content']),
        'slug' => $article['slug'],
        'category' => explode(',', $article['categories'] ?? 'Uncategorized')[0],
        'tags' => $article['tags'] ? explode(',', $article['tags']) : [],
        'author_name' => $article['author_name'] ?? 'Anonymous',
        'published_at' => strtotime($article['published_at']),
        'status' => $article['status'],
    ];
}, $articles);

try {
    $index->saveObjects($records);
    echo "Successfully indexed " . count($records) . " articles to Algolia!\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
