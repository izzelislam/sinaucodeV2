import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

const StatusBadge = ({ status }) => {
    const variants = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-yellow-100 text-yellow-800',
    };

    const labels = {
        active: 'Active Series',
        inactive: 'Inactive Series',
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

const ArticleRow = ({ article, index, onReorder }) => (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
                <button
                    type="button"
                    onClick={() => onReorder(article.id, 'up')}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    disabled={index === 0}
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => onReorder(article.id, 'down')}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    disabled={index === 0} // This would need actual count in real implementation
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
            <span className="text-sm font-semibold text-slate-500">#{index + 1}</span>
        </div>

        <div className="flex-1">
            <h4 className="font-semibold text-slate-900">{article.title}</h4>
            <p className="text-sm text-slate-500">{article.excerpt || 'No excerpt available'}</p>
        </div>

        <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                article.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
            }`}>
                {article.status}
            </span>
        </div>

        <div className="flex items-center gap-2">
            <Link
                href={route('admin.articles.show', article.id)}
                className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
                View
            </Link>
        </div>
    </div>
);

export default function SeriesShow({ series }) {
    const { flash } = usePage().props;

    if (!series) {
        return null;
    }

    const handleDelete = () => {
        if (!confirm('Delete this series? This action cannot be undone.')) {
            return;
        }

        router.delete(route('admin.series.destroy', series.id), {
            preserveScroll: true,
        });
    };

    const handleReorderArticle = (articleId, direction) => {
        // This would implement reordering logic
        console.log('Reorder article:', articleId, direction);
    };

    const status = series.published_articles_count > 0 ? 'active' : 'inactive';

    return (
        <DashboardLayout>
            <Head title={series.name} />

            <div className="mx-auto max-w-full space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Series Overview</p>
                        <h1 className="text-3xl font-bold text-slate-900">{series.name}</h1>
                        <p className="mt-2 text-sm text-slate-500">{series.description || 'No description provided yet.'}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <span>Slug:</span>
                            <code className="rounded-xl bg-slate-100 px-3 py-1 text-slate-700">/{series.slug}</code>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={route('admin.series.edit', series.id)}
                            className="inline-flex items-center rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
                        >
                            Edit Series
                        </Link>
                        <Link
                            href={route('admin.series.index')}
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
                        subtitle={`Last updated ${series.updated_at ? new Date(series.updated_at).toLocaleDateString() : ''}`}
                    />
                    <StatCard
                        title="Total Articles"
                        value={series.articles_count || 0}
                        subtitle="All articles in series"
                    />
                    <StatCard
                        title="Published"
                        value={series.published_articles_count || 0}
                        subtitle="Live articles"
                    />
                    <StatCard
                        title="Completion"
                        value={`${series.articles_count > 0 ? Math.round((series.published_articles_count / series.articles_count) * 100) : 0}%`}
                        subtitle="Series progress"
                    />
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
                    <h2 className="text-lg font-semibold text-slate-900">Description</h2>
                    <div
                        className="mt-4 text-sm leading-relaxed text-slate-600 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                        dangerouslySetInnerHTML={{ __html: series.description || '<p>No description provided.</p>' }}
                    />
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">Articles</h2>
                            <Link
                                href={route('admin.articles.create', { series_id: series.id })}
                                className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black"
                            >
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Article
                            </Link>
                        </div>

                        {series.articles && series.articles.length > 0 ? (
                            <div className="mt-6 space-y-4">
                                {series.articles.map((article, index) => (
                                    <ArticleRow
                                        key={article.id}
                                        article={article}
                                        index={index}
                                        onReorder={handleReorderArticle}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-6 text-center">
                                <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-4 text-base font-semibold text-slate-900">No articles yet</h3>
                                <p className="mt-2 text-sm text-slate-500">Start building this series by adding your first article.</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
                            <h2 className="text-lg font-semibold text-slate-900">Media</h2>
                            {series.featured_image ? (
                                <div className="mt-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Featured image</p>
                                    <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
                                        <img
                                            src={series.featured_image.url}
                                            alt={series.featured_image.alt_text || series.name}
                                            className="h-64 w-full object-cover"
                                        />
                                    </div>
                                    {series.featured_image.alt_text && (
                                        <p className="mt-2 text-sm text-slate-500">Alt text: {series.featured_image.alt_text}</p>
                                    )}
                                </div>
                            ) : (
                                <p className="mt-4 text-sm text-slate-500">No featured image uploaded yet.</p>
                            )}

                            {series.media && series.media.length > 1 && (
                                <div className="mt-6">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Additional Media</p>
                                    <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {series.media.filter(m => m.tag !== 'featured_image').map((media) => (
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

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
                            <h2 className="text-lg font-semibold text-slate-900">Details</h2>
                            <div className="mt-4 grid gap-4">
                                <InfoRow label="Series ID" value={`#${series.id}`} />
                                <InfoRow label="Created" value={series.created_at ? new Date(series.created_at).toLocaleString() : ''} />
                                <InfoRow label="Updated" value={series.updated_at ? new Date(series.updated_at).toLocaleString() : ''} />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}