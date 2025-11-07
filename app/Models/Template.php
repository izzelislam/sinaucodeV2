<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Template extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'name',
        'description',
        'version',
        'type',
        'price',
        'paypal_info',
        'bank_transfer_info',
        'status',
        'meta_title',
        'meta_description',
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
    public function featuredImage()
    {
        return $this->morphOne(Media::class, 'mediable')->where('tag', 'featured_image');
    }

    public function galleryImages()
    {
        return $this->morphMany(Media::class, 'mediable')->where('tag', 'gallery');
    }

    public function media()
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    // Methods
    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    public function hasPaymentInfo(): bool
    {
        return !empty($this->paypal_info) || !empty($this->bank_transfer_info);
    }

    public function getFormattedPrice(): string
    {
        return $this->price;
    }

    public function getPaymentMethods(): array
    {
        $methods = [];
        if (!empty($this->paypal_info)) {
            $methods[] = 'PayPal';
        }
        if (!empty($this->bank_transfer_info)) {
            $methods[] = 'Bank Transfer';
        }
        return $methods;
    }
}
