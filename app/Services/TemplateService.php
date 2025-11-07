<?php

namespace App\Services;

use App\Models\Template;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TemplateService
{
    /**
     * Return paginated list of templates with optional filters.
     */
    public function paginateTemplates(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return Template::query()
            ->when($filters['search'] ?? null, function ($query, string $search) {
                $query->where(function ($nestedQuery) use ($search) {
                    $nestedQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('type', 'like', "%{$search}%");
                });
            })
            ->when($filters['status'] ?? null, function ($query, string $status) {
                $query->where('status', $status);
            })
            ->when($filters['type'] ?? null, function ($query, string $type) {
                $query->where('type', $type);
            })
            ->with('featuredImage')
            ->withCount('galleryImages')
            ->latest('created_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Create a new template record.
     */
    public function createTemplate(array $data): Template
    {
        return Template::create($data);
    }

    /**
     * Update an existing template record.
     */
    public function updateTemplate(Template $template, array $data): Template
    {
        $template->update($data);

        return $template->refresh();
    }

    /**
     * Delete a template.
     */
    public function deleteTemplate(Template $template): void
    {
        $template->delete();
    }
}
