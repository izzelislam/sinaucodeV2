import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const StatusBadge = ({ count }) => {
    if (count === 0) {
        return (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                Unused
            </span>
        );
    } else if (count <= 5) {
        return (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                Low Usage
            </span>
        );
    } else if (count <= 20) {
        return (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                Moderate Usage
            </span>
        );
    } else {
        return (
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                Popular
            </span>
        );
    }
};

const InfoRow = ({ label, value }) => (
    <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
        <span className="text-sm text-slate-900">{value || '\u0014'}</span>
    </div>
);

const StatCard = ({ title, value, subtitle }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
        <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
    </div>
);

export default function TagShow({ tag }) {
    const { flash } = usePage();

    if (!tag) {
        return null;
    }

    // handleDelete is now inline in the form

    return (
        <DashboardLayout>
            <Head title={tag.name} />

            <div className="mx-auto max-w-full space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Tag Details</p>
                        <h1 className="text-3xl font-bold text-slate-900">{tag.name}</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Tag overview and usage statistics.
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <span>Slug:</span>
                            <code className="rounded-xl bg-slate-100 px-3 py-1 text-slate-700">{tag.slug}</code>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={`/admin/tags/${tag.id}/edit`}
                            className="inline-flex items-center rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
                        >
                            Edit Tag
                        </Link>
                        <Link
                            href="/admin/tags"
                            className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            Back to list
                        </Link>
                        <form method="POST" action={`/admin/tags/${tag.id}`} className="inline">
                            <input type="hidden" name="_method" value="DELETE" />
                            <button
                                type="submit"
                                className="inline-flex items-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                                onClick={(e) => {
                                    if (!confirm(`Are you sure you want to delete the tag "${tag.name}"? This action cannot be undone and will remove this tag from all articles.`)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </form>
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

                {/* Statistics Cards */}
                <section className="grid gap-4 md:grid-cols-4">
                    <StatCard
                        title="Status"
                        value={<StatusBadge count={tag.articles_count || 0} />}
                        subtitle={`Last updated ${tag.updated_at ? new Date(tag.updated_at).toLocaleDateString() : '\u0014'}`}
                    />
                    <StatCard
                        title="Total Articles"
                        value={tag.articles_count || 0}
                        subtitle="Articles using this tag"
                    />
                    <StatCard
                        title="Tag ID"
                        value={`#${tag.id}`}
                        subtitle="System identifier"
                    />
                    <StatCard
                        title="Usage Rank"
                        value={tag.articles_count > 0 ? `Top ${Math.min(tag.articles_count, 100)}%` : 'N/A'}
                        subtitle="Compared to other tags"
                    />
                </section>

                {/* Tag Details */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
                    <h2 className="text-lg font-semibold text-slate-900">Tag Information</h2>
                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoRow label="Tag Name" value={tag.name} />
                        <InfoRow label="URL Slug" value={tag.slug} />
                        <InfoRow label="Created" value={tag.created_at ? new Date(tag.created_at).toLocaleString() : '\u0014'} />
                        <InfoRow label="Updated" value={tag.updated_at ? new Date(tag.updated_at).toLocaleString() : '\u0014'} />
                    </div>
                </section>

                {/* Articles using this tag */}
                <section className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900">Articles Using This Tag</h2>
                            {tag.articles_count > 10 && (
                                <Link
                                    href={`/admin/articles?tags=${tag.id}`}
                                    className="inline-flex items-center rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    View All
                                </Link>
                            )}
                        </div>

                        {tag.articles && tag.articles.length > 0 ? (
                            <div className="mt-6 space-y-4">
                                {tag.articles.map((article) => (
                                    <div key={article.id} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                        <div className="flex-shrink-0">
                                            {article.featured_image ? (
                                                <img
                                                    src={article.featured_image.url}
                                                    alt={article.title}
                                                    className="h-12 w-12 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center">
                                                    <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-slate-900 truncate">{article.title}</h3>
                                            <p className="text-xs text-slate-500 truncate">{article.excerpt || 'No excerpt available'}</p>
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
                                                href={`/admin/articles/${article.id}`}
                                                className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-6 text-center">
                                <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-4 text-base font-semibold text-slate-900">No articles yet</h3>
                                <p className="mt-2 text-sm text-slate-500">This tag hasn't been used in any articles yet.</p>
                                <div className="mt-6">
                                    <Link
                                        href={`/admin/articles/create?tags=${tag.id}`}
                                        className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black"
                                    >
                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create Article
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
                            <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
                            <div className="mt-4 space-y-3">
                                <Link
                                    href={`/admin/articles/create?tags=${tag.id}`}
                                    className="block w-full text-center inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black"
                                >
                                    Create Article
                                </Link>
                                <Link
                                    href={`/admin/tags/${tag.id}/edit`}
                                    className="block w-full text-center inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Edit Tag
                                </Link>
                                <form method="POST" action={`/admin/tags/${tag.id}`} className="w-full">
                                    <input type="hidden" name="_method" value="DELETE" />
                                    <button
                                        type="submit"
                                        className="w-full inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                                        onClick={(e) => {
                                            if (!confirm(`Are you sure you want to delete the tag "${tag.name}"? This action cannot be undone and will remove this tag from all articles.`)) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        Delete Tag
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow">
                            <h2 className="text-lg font-semibold text-slate-900">Usage Tips</h2>
                            <div className="mt-4 space-y-3 text-sm text-slate-600">
                                <p>" Use this tag to categorize related content</p>
                                <p>" Tags help readers find similar articles</p>
                                <p>" Consider merging similar tags to reduce clutter</p>
                                <p>" Remove unused tags to keep your system organized</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}