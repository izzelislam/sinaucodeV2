import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

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
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[status] || 'bg-slate-100 text-slate-700'}`}>
            {labels[status] || status}
        </span>
    );
};

const Pagination = ({ links = [] }) => {
    if (!links.length) {
        return null;
    }

    return (
        <nav className="flex flex-wrap items-center justify-end gap-2">
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url}
                        preserveScroll
                        className={`rounded-lg px-3 py-1 text-sm transition ${
                            link.active ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={`${link.label}-${index}`}
                        className="rounded-lg px-3 py-1 text-sm text-slate-400"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            )}
        </nav>
    );
};

const FilterShell = ({ label, helper, children }) => (
    <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
        {helper && <span className="text-xs text-slate-400">{helper}</span>}
        {children}
    </div>
);

const MultiSelect = ({ options = [], value = [], onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(search.toLowerCase())
    );

    const selectedLabels = value.map(val =>
        options.find(opt => opt.value.toString() === val.toString())?.label
    ).filter(Boolean);

    return (
        <div className="relative">
            <div
                className="min-w-[200px] rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedLabels.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {selectedLabels.slice(0, 2).map((label, index) => (
                            <span key={index} className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs">
                                {label}
                            </span>
                        ))}
                        {selectedLabels.length > 2 && (
                            <span className="text-xs text-slate-500">+{selectedLabels.length - 2} more</span>
                        )}
                    </div>
                ) : (
                    <span className="text-slate-400">{placeholder}</span>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-3 py-2 text-sm border-b border-slate-200 focus:outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="max-h-48 overflow-y-auto">
                        {filteredOptions.map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={value.includes(option.value)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            onChange([...value, option.value]);
                                        } else {
                                            onChange(value.filter(v => v !== option.value));
                                        }
                                    }}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function ArticleIndex({ articles, filters = {}, statusOptions = [], seriesOptions = [], categoryOptions = [], tagOptions = [] }) {
    const { flash } = usePage().props;
    const [localFilters, setLocalFilters] = useState({
        search: filters.search ?? '',
        status: filters.status ?? '',
        series_id: filters.series_id ?? '',
        category_id: filters.category_id ?? '',
        tags: filters.tags ?? [],
    });

    const articleRows = articles?.data ?? [];

    const applyFilters = (event) => {
        event?.preventDefault();

        router.get(route('admin.articles.index'), localFilters, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        const reset = { search: '', status: '', series_id: '', category_id: '', tags: [] };
        setLocalFilters(reset);
        router.get(route('admin.articles.index'), reset, {
            preserveScroll: true,
            replace: true,
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
            return;
        }

        router.delete(route('admin.articles.destroy', id), {
            preserveScroll: true,
        });
    };

    const handlePublish = (id) => {
        router.post(route('admin.articles.publish', id), {}, {
            preserveScroll: true,
        });
    };

    const handleUnpublish = (id) => {
        router.post(route('admin.articles.unpublish', id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout>
            <Head title="Article Management" />

            <div className="mx-auto max-w-full space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Article Management</p>
                        <h1 className="text-3xl font-bold text-slate-900">Manage Articles</h1>
                        <p className="mt-1 text-sm text-slate-500">Create, edit, and manage your content with powerful publishing tools.</p>
                    </div>
                    <Link
                        href={route('admin.articles.create')}
                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
                    >
                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        New Article
                    </Link>
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

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                    <form onSubmit={applyFilters} className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <FilterShell label="Search" helper="Title, content, or excerpt">
                                <div className="flex items-center rounded-2xl border border-slate-200 px-4">
                                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-5.2-5.2M17 10.5A6.5 6.5 0 1 1 4 10.5a6.5 6.5 0 0 1 13 0Z" />
                                    </svg>
                                    <input
                                        type="search"
                                        placeholder="Search articles"
                                        className="w-full border-0 bg-transparent px-3 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                                        value={localFilters.search}
                                        onChange={(event) => setLocalFilters((prev) => ({ ...prev, search: event.target.value }))}
                                    />
                                </div>
                            </FilterShell>

                            <FilterShell label="Status">
                                <select
                                    className="min-w-[120px] rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                    value={localFilters.status}
                                    onChange={(event) => setLocalFilters((prev) => ({ ...prev, status: event.target.value }))}
                                >
                                    <option value="">All status</option>
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </FilterShell>

                            <FilterShell label="Series">
                                <select
                                    className="min-w-[150px] rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                    value={localFilters.series_id}
                                    onChange={(event) => setLocalFilters((prev) => ({ ...prev, series_id: event.target.value }))}
                                >
                                    <option value="">All series</option>
                                    {seriesOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </FilterShell>

                            <FilterShell label="Category">
                                <select
                                    className="min-w-[150px] rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                    value={localFilters.category_id}
                                    onChange={(event) => setLocalFilters((prev) => ({ ...prev, category_id: event.target.value }))}
                                >
                                    <option value="">All categories</option>
                                    {categoryOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </FilterShell>

                            <FilterShell label="Tags">
                                <MultiSelect
                                    options={tagOptions}
                                    value={localFilters.tags}
                                    onChange={(value) => setLocalFilters((prev) => ({ ...prev, tags: value }))}
                                    placeholder="Select tags"
                                />
                            </FilterShell>

                            <div className="ms-auto flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    Reset
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Article</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Author</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Series</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Categories</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Tags</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Media</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Created</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {articleRows.map((article) => (
                                    <tr key={article.id} className="transition hover:bg-slate-50/60">
                                        <td className="px-6 py-4">
                                            <div className="max-w-md">
                                                <div className="font-semibold text-slate-900 truncate">{article.title}</div>
                                                <div className="text-xs text-slate-400">/{article.slug}</div>
                                                <div className="mt-1 text-xs text-slate-500 line-clamp-2">{article.excerpt}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {article.author?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {article.series?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {article.categories?.slice(0, 2).map((category) => (
                                                    <span key={category.id} className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800">
                                                        {category.name}
                                                    </span>
                                                ))}
                                                {article.categories?.length > 2 && (
                                                    <span className="text-xs text-slate-500">+{article.categories.length - 2}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {article.tags?.slice(0, 3).map((tag) => (
                                                    <span key={tag.id} className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                                        {tag.name}
                                                    </span>
                                                ))}
                                                {article.tags?.length > 3 && (
                                                    <span className="text-xs text-slate-500">+{article.tags.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={article.status} />
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex h-2 w-2 rounded-full ${article.has_featured_image ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                {article.has_featured_image ? 'Featured' : 'No featured'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {article.created_at ? new Date(article.created_at).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('admin.articles.show', article.id)}
                                                    className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={route('admin.articles.edit', article.id)}
                                                    className="inline-flex items-center rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                                                >
                                                    Edit
                                                </Link>
                                                {article.status === 'published' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUnpublish(article.id)}
                                                        className="inline-flex items-center rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs font-semibold text-yellow-600 hover:bg-yellow-100"
                                                        title="Change to draft"
                                                    >
                                                        Unpublish
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePublish(article.id)}
                                                        className="inline-flex items-center rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-600 hover:bg-green-100"
                                                        title="Publish article"
                                                    >
                                                        Publish
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(article.id)}
                                                    className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {articleRows.length === 0 && (
                        <div className="px-6 py-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h3 className="mt-4 text-base font-semibold text-slate-900">No articles found</h3>
                            <p className="mt-2 text-sm text-slate-500">Try adjusting your filters or create a new article.</p>
                        </div>
                    )}

                    <div className="border-t border-slate-100 px-6 py-4">
                        <Pagination links={articles?.links ?? []} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}