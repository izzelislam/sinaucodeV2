<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Tag extends Model
{
    use HasFactory, HasSlug, Searchable;

    protected $fillable = [
        'name',
        'slug',
    ];

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug')
            ->slugsShouldBeNoLongerThan(255)
            ->usingSeparator('-')
            ->allowDuplicateSlugs(false);
    }

    // Relationships
    public function articles()
    {
        return $this->belongsToMany(Article::class);
    }

    // Methods
    public function getArticleCount(): int
    {
        return $this->articles()->count();
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'article_count' => $this->getArticleCount(),
            'popular' => $this->getArticleCount() > 10,
        ];
    }

    /**
     * Get the Scout index name for the model.
     *
     * @return string
     */
    public function searchableAs()
    {
        return 'tags';
    }
}
