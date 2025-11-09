<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Category extends Model
{
    use HasFactory, HasSlug, Searchable;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'parent_id',
        'meta_title',
        'meta_description',
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
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function articles()
    {
        return $this->belongsToMany(Article::class);
    }

    public function featuredImage()
    {
        return $this->morphOne(Media::class, 'mediable')->where('tag', 'featured_image');
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    // Scopes
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeParent($query)
    {
        return $query->whereNotNull('parent_id');
    }

    // Methods
    public function hasChildren(): bool
    {
        return $this->children()->count() > 0;
    }

    public function getFullPath(): string
    {
        if ($this->parent) {
            return $this->parent->getFullPath() . ' / ' . $this->name;
        }
        return $this->name;
    }

    /**
     * Check if category has a featured image
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
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'article_count' => $this->articles()->count(),
            'has_children' => $this->hasChildren(),
            'parent_name' => $this->parent?->name,
            'featured_image' => $this->featuredImage?->url,
        ];
    }

    /**
     * Get the Scout index name for the model.
     *
     * @return string
     */
    public function searchableAs()
    {
        return 'categories';
    }
}
