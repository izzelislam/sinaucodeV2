import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

const StatusBadge = ({ status }) => {
    const normalizedStatus = status || 'unknown';
    const variants = {
        published: 'bg-green-100 text-green-800',
        draft: 'bg-yellow-100 text-yellow-800',
        unknown: 'bg-slate-100 text-slate-700',
    };

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[normalizedStatus] || variants.unknown}`}>
            {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
        </span>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
        <span className="text-sm text-slate-900">{value || '—'}</span>
    </div>
);

export default function TemplateShow({ template }) {
    const { flash } = usePage().props;

    if (!template) {
        return null;
    }

    const handleDelete = () => {
        if (!confirm('Delete this template? This action cannot be undone.')) {
            return;
        }

        router.delete(route('admin.templates.destroy', template.id), {
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout>
            <Head title={template.name} />

            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Template Overview</p>
                        <h1 className="text-3xl font-bold text-slate-900">{template.name}</h1>
                        <p className="mt-2 text-sm text-slate-500">{template.meta_description || 'No meta description provided yet.'}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <span>Slug:</span>
                            <code className="rounded-xl bg-slate-100 px-3 py-1 text-slate-700">/{template.slug}</code>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={route('admin.templates.edit', template.id)}
                            className="inline-flex items-center rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
                        >
                            Edit Template
                        </Link>
                        <Link
                            href={route('admin.templates.index')}
                            className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            Back to list
                        </Link>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex items-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {flash?.success && (
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                            <p className="text-sm font-medium text-green-800">{flash.success}</p>
                        </div>
                    </div>
                )}

                <section className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</p>
                        <div className="mt-3">
                            <StatusBadge status={template.status} />
                        </div>
                        <p className="mt-4 text-xs uppercase text-slate-400">Last updated</p>
                        <p className="text-sm text-slate-900">{template.updated_at ? new Date(template.updated_at).toLocaleString() : '—'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Price</p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">{template.formatted_price}</p>
                        <p className="mt-2 text-sm text-slate-500">{template.payment_methods?.length ? 'Payment methods available' : 'No payment methods provided'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Version</p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">{template.version || '—'}</p>
                        <p className="mt-2 text-sm text-slate-500">Type: {template.type || 'Not specified'}</p>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
                    <h2 className="text-lg font-semibold text-slate-900">Description</h2>
                    <div
                        className="mt-4 text-sm leading-relaxed text-slate-600 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                        dangerouslySetInnerHTML={{ __html: template.description || '<p>No description provided.</p>' }}
                    />
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow lg:col-span-2">
                        <h2 className="text-lg font-semibold text-slate-900">Media</h2>
                        {template.featured_image ? (
                            <div className="mt-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Featured image</p>
                                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
                                    <img
                                        src={template.featured_image.url}
                                        alt={template.featured_image.alt_text || template.name}
                                        className="h-64 w-full object-cover"
                                    />
                                </div>
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-slate-500">No featured image uploaded yet.</p>
                        )}

                        <div className="mt-6">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Gallery</p>
                            {template.gallery_images?.length ? (
                                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {template.gallery_images.map((image) => (
                                        <div key={image.id} className="overflow-hidden rounded-xl border border-slate-200">
                                            <img src={image.url} alt={image.alt_text || image.filename} className="h-32 w-full object-cover" />
                                            {image.caption && <p className="px-3 py-2 text-xs text-slate-500">{image.caption}</p>}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-2 text-sm text-slate-500">No gallery images yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
                            <h2 className="text-lg font-semibold text-slate-900">Details</h2>
                            <div className="mt-4 grid gap-4">
                                <InfoRow label="Template type" value={template.type || 'Not specified'} />
                                <InfoRow label="Created" value={template.created_at ? new Date(template.created_at).toLocaleString() : '—'} />
                                <InfoRow label="Updated" value={template.updated_at ? new Date(template.updated_at).toLocaleString() : '—'} />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
                            <h2 className="text-lg font-semibold text-slate-900">Payment Methods</h2>
                            {template.payment_methods?.length ? (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {template.payment_methods.map((method) => (
                                        <span key={method} className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {method}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-2 text-sm text-slate-500">No payment methods configured.</p>
                            )}

                            {template.paypal_info && (
                                <div className="mt-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">PayPal</p>
                                    <p className="text-sm text-slate-900">{template.paypal_info}</p>
                                </div>
                            )}

                            {template.bank_transfer_info && (
                                <div className="mt-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Bank transfer</p>
                                    <p className="whitespace-pre-line text-sm text-slate-900">{template.bank_transfer_info}</p>
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
                            <h2 className="text-lg font-semibold text-slate-900">SEO Metadata</h2>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Meta title</p>
                                    <p className="text-sm text-slate-900">{template.meta_title || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Meta description</p>
                                    <p className="text-sm text-slate-900">{template.meta_description || '—'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}
