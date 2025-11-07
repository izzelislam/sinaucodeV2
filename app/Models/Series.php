<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Series extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'name',
        'description',
    ];

    protected $appends = [
        'has_featured_image',
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
        return $this->hasMany(Article::class)->orderBy('series_order');
    }

    public function publishedArticles()
    {
        return $this->hasMany(Article::class)
                    ->where('status', 'published')
                    ->where('published_at', '<=', now())
                    ->orderBy('series_order');
    }

    public function featuredImage()
    {
        return $this->morphOne(Media::class, 'mediable')->where('tag', 'featured_image');
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    // Methods
    public function getArticleCount(): int
    {
        return $this->articles()->count();
    }

    public function getPublishedArticleCount(): int
    {
        return $this->publishedArticles()->count();
    }

    public function getNextArticleOrder(): int
    {
        return $this->articles()->max('series_order') + 1;
    }

    /**
     * Check if series has a featured image
     */
    public function getHasFeaturedImageAttribute(): bool
    {
        return $this->featuredImage !== null;
    }
}
