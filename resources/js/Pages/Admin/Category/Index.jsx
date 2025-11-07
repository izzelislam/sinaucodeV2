import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const StatusBadge = ({ status }) => {
    const normalizedStatus = status || 'unknown';

    const variants = {
        root: 'bg-blue-100 text-blue-800',
        child: 'bg-purple-100 text-purple-800',
        unknown: 'bg-slate-100 text-slate-700',
    };

    const labels = {
        root: 'Root',
        child: 'Child',
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[normalizedStatus] || variants.unknown}`}>
            {labels[normalizedStatus] || normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
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

export default function CategoryIndex({ categories, filters = {}, statusOptions = [] }) {
    const { flash } = usePage().props;
    const [localFilters, setLocalFilters] = useState({
        search: filters.search ?? '',
        status: filters.status ?? '',
    });

    const categoryRows = categories?.data ?? [];

    const applyFilters = (event) => {
        event?.preventDefault();

        router.get(route('admin.categories.index'), localFilters, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        const reset = { search: '', status: '' };
        setLocalFilters(reset);
        router.get(route('admin.categories.index'), reset, {
            preserveScroll: true,
            replace: true,
        });
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            return;
        }

        router.delete(route('admin.categories.destroy', id), {
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout>
            <Head title="Category Management" />

            <div className="mx-auto max-w-full space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Category Management</p>
                        <h1 className="text-3xl font-bold text-slate-900">Manage Categories</h1>
                        <p className="mt-1 text-sm text-slate-500">Create, organize, and manage content categories with hierarchical structure.</p>
                    </div>
                    <Link
                        href={route('admin.categories.create')}
                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
                    >
                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        New Category
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
                            <FilterShell label="Search" helper="Name, slug, or description">
                                <div className="flex items-center rounded-2xl border border-slate-200 px-4">
                                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-5.2-5.2M17 10.5A6.5 6.5 0 1 1 4 10.5a6.5 6.5 0 0 1 13 0Z" />
                                    </svg>
                                    <input
                                        type="search"
                                        placeholder="Search categories"
                                        className="w-full border-0 bg-transparent px-3 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                                        value={localFilters.search}
                                        onChange={(event) => setLocalFilters((prev) => ({ ...prev, search: event.target.value }))}
                                    />
                                </div>
                            </FilterShell>

                            <FilterShell label="Status">
                                <select
                                    className="min-w-[180px] rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                    value={localFilters.status}
                                    onChange={(event) => setLocalFilters((prev) => ({ ...prev, status: event.target.value }))}
                                >
                                    <option value="">All categories</option>
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
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
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Category</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Parent</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Content</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Media</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Created</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {categoryRows.map((category) => (
                                    <tr key={category.id} className="transition hover:bg-slate-50/60">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">{category.name}</div>
                                            <div className="text-xs uppercase text-slate-400">/{category.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {category.parent ? category.parent.name : ''}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={category.parent_id ? 'child' : 'root'} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex h-2 w-2 rounded-full bg-blue-500" />
                                                {category.children_count} subcategories
                                                <span className="text-slate-400">|</span>
                                                {category.articles_count} articles
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex h-2 w-2 rounded-full ${category.has_featured_image ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                {category.has_featured_image ? 'Featured' : 'No featured'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {category.created_at ? new Date(category.created_at).toLocaleDateString() : ''}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('admin.categories.show', category.id)}
                                                    className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={route('admin.categories.edit', category.id)}
                                                    className="inline-flex items-center rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(category.id)}
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

                    {categoryRows.length === 0 && (
                        <div className="px-6 py-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h3 className="mt-4 text-base font-semibold text-slate-900">No categories found</h3>
                            <p className="mt-2 text-sm text-slate-500">Try adjusting your filters or create a new category.</p>
                        </div>
                    )}

                    <div className="border-t border-slate-100 px-6 py-4">
                        <Pagination links={categories?.links ?? []} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}