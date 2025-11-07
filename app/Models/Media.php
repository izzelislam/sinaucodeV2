<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'filename',
        'path',
        'mime_type',
        'alt_text',
        'caption',
        'mediable_id',
        'mediable_type',
        'tag',
    ];

    // Relationships
    public function mediable()
    {
        return $this->morphTo();
    }

    // Scopes
    public function scopeImages($query)
    {
        return $query->where('mime_type', 'like', 'image/%');
    }

    public function scopeDocuments($query)
    {
        return $query->where('mime_type', 'like', 'application/%')
                    ->orWhere('mime_type', 'like', 'text/%');
    }

    public function scopeFeaturedImages($query)
    {
        return $query->where('tag', 'featured_image');
    }

    public function scopeGallery($query)
    {
        return $query->where('tag', 'gallery');
    }

    public function scopeProfilePictures($query)
    {
        return $query->where('tag', 'profile_picture');
    }

    // Methods
    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    public function isDocument(): bool
    {
        return str_starts_with($this->mime_type, 'application/') ||
               str_starts_with($this->mime_type, 'text/');
    }

    public function getUrl(): string
    {
        return asset('storage/' . $this->path);
    }

    public function getDisplaySize(): string
    {
        if (!file_exists(storage_path('app/public/' . $this->path))) {
            return 'Unknown';
        }

        $bytes = filesize(storage_path('app/public/' . $this->path));
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getExtension(): string
    {
        return pathinfo($this->filename, PATHINFO_EXTENSION);
    }
}
