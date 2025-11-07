<?php

namespace App\Services;

use App\Models\Media;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaService
{

    /**
     * Upload a media file and create corresponding database record
     *
     * @param UploadedFile $file
     * @param array $options
     * @return Media
     */
    public function upload(UploadedFile $file, array $options = []): Media
    {
        $this->validateFile($file);

        $filename = $this->generateFilename($file);
        $path = $this->storeFile($file, $filename, $options['folder'] ?? 'media');
        $mimeType = $file->getMimeType();

        $mediaData = [
            'filename' => $filename,
            'path' => $path,
            'mime_type' => $mimeType,
            'alt_text' => $options['alt_text'] ?? null,
            'caption' => $options['caption'] ?? null,
            'tag' => $options['tag'] ?? null,
            'mediable_id' => $options['mediable_id'] ?? null,
            'mediable_type' => $options['mediable_type'] ?? null,
        ];

  
        return Media::create($mediaData);
    }

    /**
     * Upload multiple files
     *
     * @param array $files
     * @param array $options
     * @return \Illuminate\Support\Collection
     */
    public function uploadMultiple(array $files, array $options = []): \Illuminate\Support\Collection
    {
        return collect($files)->map(function ($file) use ($options) {
            return $this->upload($file, $options);
        });
    }

    /**
     * Upload a featured image
     *
     * @param UploadedFile $file
     * @param int|null $mediableId
     * @param string|null $mediableType
     * @return Media
     */
    public function uploadFeaturedImage(UploadedFile $file, ?int $mediableId = null, ?string $mediableType = null): Media
    {
        return $this->upload($file, [
            'tag' => 'featured_image',
            'mediable_id' => $mediableId,
            'mediable_type' => $mediableType,
            'folder' => 'images/featured'
        ]);
    }

    /**
     * Upload gallery images
     *
     * @param array $files
     * @param int|null $mediableId
     * @param string|null $mediableType
     * @return \Illuminate\Support\Collection
     */
    public function uploadGallery(array $files, ?int $mediableId = null, ?string $mediableType = null): \Illuminate\Support\Collection
    {
        return $this->uploadMultiple($files, [
            'tag' => 'gallery',
            'mediable_id' => $mediableId,
            'mediable_type' => $mediableType,
            'folder' => 'images/gallery'
        ]);
    }

    /**
     * Upload profile picture
     *
     * @param UploadedFile $file
     * @param int|null $mediableId
     * @param string|null $mediableType
     * @return Media
     */
    public function uploadProfilePicture(UploadedFile $file, ?int $mediableId = null, ?string $mediableType = null): Media
    {
        return $this->upload($file, [
            'tag' => 'profile_picture',
            'mediable_id' => $mediableId,
            'mediable_type' => $mediableType,
            'folder' => 'images/profiles'
        ]);
    }

    /**
     * Delete media file and database record
     *
     * @param Media $media
     * @return bool
     */
    public function delete(Media $media): bool
    {
        // Delete file from storage
        if (Storage::disk('public')->exists($media->path)) {
            Storage::disk('public')->delete($media->path);
        }

        // Delete database record
        return $media->delete();
    }

    /**
     * Update media metadata
     *
     * @param Media $media
     * @param array $data
     * @return Media
     */
    public function updateMetadata(Media $media, array $data): Media
    {
        $media->update($data);
        return $media;
    }

    /**
     * Get media by tag
     *
     * @param string $tag
     * @param int|null $mediableId
     * @param string|null $mediableType
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByTag(string $tag, ?int $mediableId = null, ?string $mediableType = null): \Illuminate\Database\Eloquent\Collection
    {
        $query = Media::where('tag', $tag);

        if ($mediableId && $mediableType) {
            $query->where('mediable_id', $mediableId)
                  ->where('mediable_type', $mediableType);
        }

        return $query->get();
    }

    /**
     * Validate uploaded file
     *
     * @param UploadedFile $file
     * @return void
     * @throws \InvalidArgumentException
     */
    private function validateFile(UploadedFile $file): void
    {
        if (!$file->isValid()) {
            throw new \InvalidArgumentException('File upload is not valid.');
        }

        $allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];

        if (!in_array($file->getMimeType(), $allowedMimes)) {
            throw new \InvalidArgumentException('File type is not allowed.');
        }

        $maxSize = 10 * 1024 * 1024; // 10MB
        if ($file->getSize() > $maxSize) {
            throw new \InvalidArgumentException('File size exceeds maximum allowed size of 10MB.');
        }
    }

    /**
     * Generate unique filename
     *
     * @param UploadedFile $file
     * @return string
     */
    private function generateFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $basename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $timestamp = now()->timestamp;
        $random = Str::random(6);

        return "{$basename}-{$timestamp}-{$random}.{$extension}";
    }

    /**
     * Store file in storage
     *
     * @param UploadedFile $file
     * @param string $filename
     * @param string $folder
     * @return string
     */
    private function storeFile(UploadedFile $file, string $filename, string $folder = 'media'): string
    {
        return $file->storeAs($folder, $filename, 'public');
    }

  
    /**
     * Get storage path URL
     *
     * @param Media $media
     * @return string
     */
    public function getUrl(Media $media): string
    {
        return asset('storage/' . $media->path);
    }
}