import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

const StatusBadge = ({ status }) => {
    const variants = {
        root: 'bg-blue-100 text-blue-800',
        child: 'bg-purple-100 text-purple-800',
    };

    const labels = {
        root: 'Root Category',
        child: 'Child Category',
    };

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[status] || 'bg-slate-100 text-slate-700'}`}>
            {labels[status] || status}
        </span>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
        <span className="text-sm text-slate-900">{value || '—'}</span>
    </div>
);

const StatCard = ({ title, value, subtitle }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
        <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
    </div>
);

export default function CategoryShow({ category }) {
    const { flash } = usePage().props;

    if (!category) {
        return null;
    }

    const handleDelete = () => {
        if (!confirm('Delete this category? This action cannot be undone.')) {
            return;
        }

        router.delete(route('admin.categories.destroy', category.id), {
            preserveScroll: true,
        });
    };

    const status = category.parent_id ? 'child' : 'root';

    return (
        <DashboardLayout>
            <Head title={category.name} />

            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Category Overview</p>
                        <h1 className="text-3xl font-bold text-slate-900">{category.name}</h1>
                        <p className="mt-2 text-sm text-slate-500">{category.meta_description || 'No meta description provided yet.'}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <span>Slug:</span>
                            <code className="rounded-xl bg-slate-100 px-3 py-1 text-slate-700">/{category.slug}</code>
                            {category.parent && (
                                <>
                                    <span>•</span>
                                    <span>Parent: {category.parent.name}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={route('admin.categories.edit', category.id)}
                            className="inline-flex items-center rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
                        >
                            Edit Category
                        </Link>
                        <Link
                            href={route('admin.categories.index')}
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

                <section className="grid gap-4 md:grid-cols-4">
                    <StatCard
                        title="Status"
                        value={<StatusBadge status={status} />}
                        subtitle={`Last updated ${category.updated_at ? new Date(category.updated_at).toLocaleDateString() : '—'}`}
                    />
                    <StatCard
                        title="Subcategories"
                        value={category.children_count || 0}
                        subtitle="Direct child categories"
                    />
                    <StatCard
                        title="Articles"
                        value={category.articles_count || 0}
                        subtitle="Associated articles"
                    />
                    <StatCard
                        title="Type"
                        value={status === 'root' ? 'Root' : 'Child'}
                        subtitle={category.parent ? `Child of ${category.parent.name}` : 'Top-level category'}
                    />
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
                    <h2 className="text-lg font-semibold text-slate-900">Description</h2>
                    <div
                        className="mt-4 text-sm leading-relaxed text-slate-600 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                        dangerouslySetInnerHTML={{ __html: category.description || '<p>No description provided.</p>' }}
                    />
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow lg:col-span-2">
                        <h2 className="text-lg font-semibold text-slate-900">Media</h2>
                        {category.featured_image ? (
                            <div className="mt-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Featured image</p>
                                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
                                    <img
                                        src={category.featured_image.url}
                                        alt={category.featured_image.alt_text || category.name}
                                        className="h-64 w-full object-cover"
                                    />
                                </div>
                                {category.featured_image.alt_text && (
                                    <p className="mt-2 text-sm text-slate-500">Alt text: {category.featured_image.alt_text}</p>
                                )}
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-slate-500">No featured image uploaded yet.</p>
                        )}

                        {category.media && category.media.length > 1 && (
                            <div className="mt-6">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Additional Media</p>
                                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {category.media.filter(m => m.tag !== 'featured_image').map((media) => (
                                        <div key={media.id} className="overflow-hidden rounded-xl border border-slate-200">
                                            {media.mime_type.startsWith('image/') ? (
                                                <img src={media.url} alt={media.alt_text || media.filename} className="h-32 w-full object-cover" />
                                            ) : (
                                                <div className="h-32 w-full bg-slate-100 flex items-center justify-center">
                                                    <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            {media.caption && <p className="px-3 py-2 text-xs text-slate-500">{media.caption}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
                            <h2 className="text-lg font-semibold text-slate-900">Details</h2>
                            <div className="mt-4 grid gap-4">
                                <InfoRow label="Category ID" value={`#${category.id}`} />
                                <InfoRow label="Created" value={category.created_at ? new Date(category.created_at).toLocaleString() : '—'} />
                                <InfoRow label="Updated" value={category.updated_at ? new Date(category.updated_at).toLocaleString() : '—'} />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
                            <h2 className="text-lg font-semibold text-slate-900">Hierarchy</h2>
                            <div className="mt-4 space-y-4">
                                {category.parent && (
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Parent Category</p>
                                        <Link
                                            href={route('admin.categories.show', category.parent.id)}
                                            className="mt-2 inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700"
                                        >
                                            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                            {category.parent.name}
                                        </Link>
                                    </div>
                                )}

                                {category.children && category.children.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Child Categories</p>
                                        <div className="mt-2 space-y-1">
                                            {category.children.map((child) => (
                                                <Link
                                                    key={child.id}
                                                    href={route('admin.categories.show', child.id)}
                                                    className="flex items-center text-sm font-medium text-brand-600 hover:text-brand-700"
                                                >
                                                    <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
                            <h2 className="text-lg font-semibold text-slate-900">SEO Metadata</h2>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Meta title</p>
                                    <p className="text-sm text-slate-900">{category.meta_title || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Meta description</p>
                                    <p className="text-sm text-slate-900">{category.meta_description || '—'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}