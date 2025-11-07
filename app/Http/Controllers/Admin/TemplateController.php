<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Services\MediaService;
use App\Services\TemplateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TemplateController extends Controller
{
    public function __construct(
        private readonly TemplateService $templateService,
        private readonly MediaService $mediaService
    ) {
    }

    /**
     * Display a listing of templates.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'type']);

        $templates = $this->templateService
            ->paginateTemplates($filters)
            ->through(fn (Template $template) => $this->transformTemplateForList($template));

        return Inertia::render('Admin/Template/Index', [
            'filters' => $filters,
            'templates' => $templates,
            'statusOptions' => $this->statusOptions(),
            'typeOptions' => $this->typeOptions(),
        ]);
    }

    /**
     * Show the form for creating a new template.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Template/Form', [
            'template' => null,
            'mode' => 'create',
            'statusOptions' => $this->statusOptions(),
            'typeOptions' => $this->typeOptions(),
        ]);
    }

    /**
     * Store a newly created template in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateTemplate($request);

        $template = $this->templateService->createTemplate($data);

        if ($request->hasFile('cover_image')) {
            $this->mediaService->uploadFeaturedImage(
                $request->file('cover_image'),
                $template->id,
                Template::class
            );
        }

        $template->load(['featuredImage', 'galleryImages']);

        return redirect()
            ->route('admin.templates.show', $template)
            ->with('success', "Template '{$template->name}' created successfully.");
    }

    /**
     * Display the specified template.
     */
    public function show(Template $template): Response
    {
        $template->load(['featuredImage', 'galleryImages']);

        return Inertia::render('Admin/Template/Show', [
            'template' => $this->transformTemplate($template),
        ]);
    }

    /**
     * Show the form for editing the specified template.
     */
    public function edit(Template $template): Response
    {
        $template->load(['featuredImage', 'galleryImages']);

        return Inertia::render('Admin/Template/Form', [
            'template' => $this->transformTemplate($template),
            'mode' => 'edit',
            'statusOptions' => $this->statusOptions(),
            'typeOptions' => $this->typeOptions(),
        ]);
    }

    /**
     * Update the specified template in storage.
     */
    public function update(Request $request, Template $template): RedirectResponse
    {
        $data = $this->validateTemplate($request);

        $this->templateService->updateTemplate($template, $data);

        if ($request->hasFile('cover_image')) {
            if ($template->featuredImage) {
                $this->mediaService->delete($template->featuredImage);
            }

            $this->mediaService->uploadFeaturedImage(
                $request->file('cover_image'),
                $template->id,
                Template::class
            );
        }

        $template->load(['featuredImage', 'galleryImages']);

        return redirect()
            ->route('admin.templates.show', $template)
            ->with('success', "Template '{$template->name}' updated successfully.");
    }

    /**
     * Remove the specified template from storage.
     */
    public function destroy(Template $template): RedirectResponse
    {
        $this->templateService->deleteTemplate($template);

        return redirect()
            ->route('admin.templates.index')
            ->with('success', "Template '{$template->name}' deleted successfully.");
    }

    private function validateTemplate(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'version' => ['nullable', 'string', 'max:50'],
            'type' => ['nullable', 'string', 'max:100'],
            'price' => ['required', 'string', 'max:50'],
            'paypal_info' => ['nullable', 'string', 'max:255'],
            'bank_transfer_info' => ['nullable', 'string'],
            'status' => ['required', 'in:draft,published'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:255'],
            'cover_image' => ['nullable', 'image', 'max:10240'],
        ]);
    }

    private function transformTemplate(Template $template): array
    {
        $data = $template->only([
            'id',
            'name',
            'slug',
            'description',
            'version',
            'type',
            'price',
            'paypal_info',
            'bank_transfer_info',
            'status',
            'meta_title',
            'meta_description',
            'created_at',
            'updated_at',
        ]);

        $data['formatted_price'] = $template->getFormattedPrice();
        $data['payment_methods'] = $template->getPaymentMethods();
        $data['is_published'] = $template->isPublished();
        if ($template->featuredImage) {
            $featuredImage = $template->featuredImage->only(['id', 'filename', 'path', 'tag', 'alt_text', 'caption']);
            $featuredImage['url'] = $template->featuredImage->getUrl();
            $data['featured_image'] = $featuredImage;
        } else {
            $data['featured_image'] = null;
        }

        $data['gallery_images'] = $template->galleryImages
            ->map(function ($media) {
                $item = $media->only(['id', 'filename', 'path', 'tag', 'alt_text', 'caption']);
                $item['url'] = $media->getUrl();

                return $item;
            })
            ->values()
            ->all();

        return $data;
    }

    private function transformTemplateForList(Template $template): array
    {
        return [
            'id' => $template->id,
            'name' => $template->name,
            'slug' => $template->slug,
            'type' => $template->type,
            'status' => $template->status,
            'price' => $template->getFormattedPrice(),
            'created_at' => $template->created_at?->toIso8601String(),
            'updated_at' => $template->updated_at?->toIso8601String(),
            'gallery_images_count' => $template->gallery_images_count ?? 0,
            'has_featured_image' => (bool) $template->featuredImage,
        ];
    }

    private function statusOptions(): array
    {
        return [
            ['label' => 'Draft', 'value' => 'draft'],
            ['label' => 'Published', 'value' => 'published'],
        ];
    }

    private function typeOptions(): array
    {
        return [
            ['label' => 'Admin Dashboard', 'value' => 'Admin Dashboard'],
            ['label' => 'Landing Page', 'value' => 'Landing Page'],
            ['label' => 'Marketing Website', 'value' => 'Marketing Website'],
            ['label' => 'SaaS Product', 'value' => 'SaaS Product'],
            ['label' => 'E-commerce', 'value' => 'E-commerce'],
            ['label' => 'Portfolio', 'value' => 'Portfolio'],
        ];
    }
}
