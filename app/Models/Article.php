<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Article extends Model
{
    use HasFactory, HasSlug, Searchable;

    protected $fillable = [
        'title',
        'content',
        'excerpt',
        'status',
        'user_id',
        'series_id',
        'series_order',
        'meta_title',
        'meta_description',
        'published_at',
    ];

    protected $appends = [
        'has_featured_image',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions() : SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug')
            ->slugsShouldBeNoLongerThan(255)
            ->usingSeparator('-')
            ->allowDuplicateSlugs(false);
    }

    // Relationships
    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function series()
    {
        return $this->belongsTo(Series::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    public function featuredImage()
    {
        return $this->morphOne(Media::class, 'mediable')->where('tag', 'featured_image');
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    public function viewers()
    {
        return $this->hasMany(Viewer::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                    ->where('published_at', '<=', now());
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    // Methods
    public function isPublished(): bool
    {
        return $this->status === 'published' && $this->published_at <= now();
    }

    public function getExcerptAttribute($value)
    {
        return $value ?: Str::limit(strip_tags($this->content), 150);
    }

    /**
     * Check if article has a featured image
     */
    public function getHasFeaturedImageAttribute(): bool
    {
        return $this->featuredImage !== null;
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array
     */
    public function toSearchableArray()
    {
        // Truncate content to prevent exceeding Algolia's record size limit
        $content = strip_tags($this->content);
        $content = Str::limit($content, 8000); // Limit to ~8000 characters to stay well under 10KB

        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $content,
            'excerpt' => $this->excerpt,
            'category' => $this->categories->first()?->name ?? 'Uncategorized',
            'tags' => $this->tags->pluck('name')->toArray(),
            'author_name' => $this->author?->name ?? 'Anonymous',
            'published_at' => $this->published_at?->timestamp,
            'status' => $this->status,
            'views' => $this->viewers->count() ?? 0,
            'featured_image' => $this->featuredImage?->url,
            'read_time' => $this->calculateReadTime($this->content),
            'slug' => $this->slug,
        ];
    }

    /**
     * Determine if the model should be searchable.
     *
     * @return bool
     */
    public function shouldBeSearchable()
    {
        return $this->isPublished();
    }

    /**
     * Get the Scout index name for the model.
     *
     * @return string
     */
    public function searchableAs()
    {
        return 'articles';
    }

    /**
     * Calculate reading time for content
     */
    private function calculateReadTime(string $content): int
    {
        $wordCount = str_word_count(strip_tags($content));
        $wordsPerMinute = 200; // Average reading speed
        return max(1, ceil($wordCount / $wordsPerMinute));
    }
}
