import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

const StatusBadge = ({ status }) => {
    const variants = {
        published: 'bg-green-100 text-green-800',
        draft: 'bg-yellow-100 text-yellow-800',
        scheduled: 'bg-blue-100 text-blue-800',
    };

    const labels = {
        published: 'Published',
        draft: 'Draft',
        scheduled: 'Scheduled',
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
        <span className="text-sm text-slate-900">{value || ''}</span>
    </div>
);

const StatCard = ({ title, value, subtitle }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
        <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
    </div>
);

const TagBadge = ({ tag }) => (
    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
        {tag.name}
    </span>
);

const CategoryBadge = ({ category }) => (
    <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
        {category.name}
    </span>
);

export default function ArticleShow({ article }) {
    const { flash } = usePage().props;

    if (!article) {
        return null;
    }

    const handleDelete = () => {
        if (!confirm('Delete this article? This action cannot be undone.')) {
            return;
        }

        router.delete(route('admin.articles.destroy', article.id), {
            preserveScroll: true,
        });
    };

    const handlePublish = () => {
        router.post(route('admin.articles.publish', article.id), {}, {
            preserveScroll: true,
        });
    };

    const handleUnpublish = () => {
        router.post(route('admin.articles.unpublish', article.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout>
            <Head title={article.title} />

            <div className="mx-auto max-w-full space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Article Overview</p>
                        <h1 className="text-3xl font-bold text-slate-900">{article.title}</h1>
                        <p className="mt-2 text-sm text-slate-500">{article.excerpt}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <span>Slug:</span>
                            <code className="rounded-xl bg-slate-100 px-3 py-1 text-slate-700">/{article.slug}</code>
                            <span>"</span>
                            <span>Author: {article.author?.name || 'Unknown'}</span>
                            {article.series && (
                                <>
                                    <span>"</span>
                                    <span>Series: {article.series.name}</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={route('admin.articles.edit', article.id)}
                            className="inline-flex items-center rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
                        >
                            Edit Article
                        </Link>
                        {article.status === 'published' ? (
                            <button
                                onClick={handleUnpublish}
                                className="inline-flex items-center rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-600 hover:bg-yellow-100"
                            >
                                Unpublish
                            </button>
                        ) : (
                            <button
                                onClick={handlePublish}
                                className="inline-flex items-center rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-600 hover:bg-green-100"
                            >
                                Publish
                            </button>
                        )}
                        <Link
                            href={route('admin.articles.index')}
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
                        value={<StatusBadge status={article.status} />}
                        subtitle={`Last updated ${article.updated_at ? new Date(article.updated_at).toLocaleDateString() : ''}`}
                    />
                    <StatCard
                        title="Categories"
                        value={article.categories?.length || 0}
                        subtitle="Assigned categories"
                    />
                    <StatCard
                        title="Tags"
                        value={article.tags?.length || 0}
                        subtitle="Content tags"
                    />
                    <StatCard
                        title="Series"
                        value={article.series ? article.series.name : 'None'}
                        subtitle="Article series"
                    />
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
                    <h2 className="text-lg font-semibold text-slate-900">Content</h2>
                    <div className="mt-4 prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">
                        <div dangerouslySetInnerHTML={{ __html: article.content || '<p>No content provided.</p>' }} />
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow lg:col-span-2">
                        <h2 className="text-lg font-semibold text-slate-900">Media</h2>
                        {article.featured_image ? (
                            <div className="mt-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Featured image</p>
                                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
                                    <img
                                        src={article.featured_image.url}
                                        alt={article.featured_image.alt_text || article.title}
                                        className="h-64 w-full object-cover"
                                    />
                                </div>
                                {article.featured_image.alt_text && (
                                    <p className="mt-2 text-sm text-slate-500">Alt text: {article.featured_image.alt_text}</p>
                                )}
                            </div>
                        ) : (
                            <p className="mt-4 text-sm text-slate-500">No featured image uploaded yet.</p>
                        )}

                        {article.media && article.media.length > 1 && (
                            <div className="mt-6">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Additional Media</p>
                                <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {article.media.filter(m => m.tag !== 'featured_image').map((media) => (
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
                            <h2 className="text-lg font-semibold text-slate-900">Taxonomy</h2>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Categories</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {article.categories && article.categories.length > 0 ? (
                                            article.categories.map((category) => (
                                                <CategoryBadge key={category.id} category={category} />
                                            ))
                                        ) : (
                                            <span className="text-sm text-slate-500">No categories assigned</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tags</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {article.tags && article.tags.length > 0 ? (
                                            article.tags.map((tag) => (
                                                <TagBadge key={tag.id} tag={tag} />
                                            ))
                                        ) : (
                                            <span className="text-sm text-slate-500">No tags assigned</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
                            <h2 className="text-lg font-semibold text-slate-900">Details</h2>
                            <div className="mt-4 grid gap-4">
                                <InfoRow label="Article ID" value={`#${article.id}`} />
                                <InfoRow label="Created" value={article.created_at ? new Date(article.created_at).toLocaleString() : ''} />
                                <InfoRow label="Updated" value={article.updated_at ? new Date(article.updated_at).toLocaleString() : ''} />
                                <InfoRow label="Published" value={article.published_at ? new Date(article.published_at).toLocaleString() : ''} />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
                            <h2 className="text-lg font-semibold text-slate-900">SEO Metadata</h2>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Meta title</p>
                                    <p className="text-sm text-slate-900">{article.meta_title || ''}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Meta description</p>
                                    <p className="text-sm text-slate-900">{article.meta_description || ''}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}