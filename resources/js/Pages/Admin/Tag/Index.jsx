import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

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

export default function TagIndex({ tags, filters, statistics }) {
    const { flash } = usePage();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [minArticles, setMinArticles] = useState(filters.min_articles || '');

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(window.location.search);

        if (searchTerm) params.set('search', searchTerm);
        else params.delete('search');

        if (minArticles) params.set('min_articles', minArticles);
        else params.delete('min_articles');

        window.location.href = `/admin/tags?${params.toString()}`;
    };

    const handleClear = () => {
        setSearchTerm('');
        setMinArticles('');
        window.location.href = '/admin/tags';
    };

    return (
        <DashboardLayout>
            <Head title="Tags" />

            <div className="mx-auto max-w-full space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Content Organization</p>
                        <h1 className="text-3xl font-bold text-slate-900">Tags</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Manage tags to organize and categorize your content efficiently.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/admin/tags/create"
                            className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black"
                        >
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Tag
                        </Link>
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
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total Tags</p>
                        <p className="mt-3 text-3xl font-bold text-slate-900">{tags?.total || 0}</p>
                        <p className="mt-2 text-sm text-slate-500">All tags in system</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Popular Tags</p>
                        <div className="mt-3 space-y-2">
                            {statistics?.popular_tags?.slice(0, 3).map((tag) => (
                                <div key={tag.id} className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-900">{tag.name}</span>
                                    <span className="text-xs text-slate-500">{tag.articles_count} articles</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Quick Actions</p>
                        <div className="mt-3 space-y-2">
                            <form method="POST" action="/admin/tags/merge-duplicates" className="inline">
                                <button
                                    type="submit"
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                    onClick={(e) => {
                                        if (!confirm('Are you sure you want to merge duplicate tags? This will combine tags with similar names.')) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    Merge Duplicates
                                </button>
                            </form>
                            <form method="POST" action="/admin/tags/cleanup" className="inline">
                                <button
                                    type="submit"
                                    className="block text-sm text-red-600 hover:text-red-800"
                                    onClick={(e) => {
                                        if (!confirm('Are you sure you want to clean up unused tags? This will permanently delete tags with no articles.')) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    Cleanup Unused
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Filter</p>
                        <form onSubmit={handleSearch} className="mt-3 space-y-3">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search tags..."
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                            />
                            <input
                                type="number"
                                value={minArticles}
                                onChange={(e) => setMinArticles(e.target.value)}
                                placeholder="Min articles"
                                min="0"
                                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-black"
                                >
                                    Search
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Clear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Tags Table */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">All Tags</h2>
                    </div>

                    {tags?.data?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Slug
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Articles
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {tags.data.map((tag) => (
                                        <tr key={tag.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-semibold text-slate-600">
                                                            {tag.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-slate-900">
                                                            {tag.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                                                    {tag.slug}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-slate-900 font-semibold">
                                                    {tag.articles_count || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge count={tag.articles_count || 0} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {new Date(tag.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/tags/${tag.id}`}
                                                        className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={`/admin/tags/${tag.id}/edit`}
                                                        className="inline-flex items-center rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <form method="POST" action={`/admin/tags/${tag.id}`} className="inline">
                                                        <input type="hidden" name="_method" value="DELETE" />
                                                        <button
                                                            type="submit"
                                                            className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                                                            onClick={(e) => {
                                                                if (!confirm(`Are you sure you want to delete the tag "${tag.name}"? This action cannot be undone.`)) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-semibold text-slate-900">No tags found</h3>
                            <p className="mt-2 text-sm text-slate-500">
                                {searchTerm || minArticles
                                    ? "No tags match your current filters."
                                    : "Get started by creating your first tag."}
                            </p>
                            {!searchTerm && !minArticles && (
                                <div className="mt-6">
                                    <Link
                                        href="/admin/tags/create"
                                        className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black"
                                    >
                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create Tag
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {tags?.data?.length > 0 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-700">
                            Showing {tags.from || 0} to {tags.to || 0} of {tags.total} results
                        </div>
                        <div className="flex items-center gap-2">
                            {tags.prev_page_url && (
                                <button
                                    onClick={() => window.location.href = tags.prev_page_url}
                                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Previous
                                </button>
                            )}
                            {tags.next_page_url && (
                                <button
                                    onClick={() => window.location.href = tags.next_page_url}
                                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}