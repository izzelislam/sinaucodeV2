import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

const StatusBadge = ({ isActive }) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
    }`}>
        {isActive ? 'Active' : 'Inactive'}
    </span>
);

const RoleBadge = ({ role }) => {
    const variants = {
        super_admin: 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
        admin: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
        penulis: 'bg-gradient-to-r from-green-500 to-teal-600 text-white',
        user: 'bg-slate-100 text-slate-700',
    };

    const labels = {
        super_admin: 'Super Admin',
        admin: 'Administrator',
        penulis: 'Penulis',
        user: 'User',
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[role] || variants.user}`}>
            {labels[role] || role}
        </span>
    );
};

const StatCard = ({ title, value, subtitle }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
        <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
    </div>
);

const FilterShell = ({ label, helper, children }) => (
    <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
        {helper && <span className="text-xs text-slate-400">{helper}</span>}
        {children}
    </div>
);

export default function UsersIndex({ users, filters, availableRoles, statistics }) {
    const { flash } = usePage().props;
    const [localFilters, setLocalFilters] = useState({
        search: filters.search ?? '',
        role: filters.role ?? '',
        status: filters.status ?? '',
    });

    const userRows = users?.data ?? [];

    const applyFilters = (event) => {
        event?.preventDefault();

        router.get(route('admin.users.index'), localFilters, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        const reset = { search: '', role: '', status: '' };
        setLocalFilters(reset);
        router.get(route('admin.users.index'), reset, {
            preserveScroll: true,
            replace: true,
        });
    };

    const handleToggleStatus = (userId) => {
        router.post(route('admin.users.toggle-status', userId));
    };

    const handleDelete = (user) => {
        if (!confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) {
            return;
        }

        router.delete(route('admin.users.destroy', user.id));
    };

    const handleRoleChange = (userId, newRole) => {
        router.post(route('admin.users.change-role', userId), { role: newRole });
    };

    return (
        <DashboardLayout>
            <Head title="User Management" />

            <div className="mx-auto max-w-full space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">User Management</p>
                        <h1 className="text-3xl font-bold text-slate-900">Manage Users</h1>
                        <p className="mt-1 text-sm text-slate-500">Manage system users, roles, and permissions.</p>
                    </div>
                    <Link
                        href={route('admin.users.create')}
                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
                    >
                        <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        New User
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

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <StatCard
                        title="Total Users"
                        value={statistics?.total_users || 0}
                        subtitle="All registered users"
                    />
                    <StatCard
                        title="Active Users"
                        value={statistics?.active_users || 0}
                        subtitle="Currently active"
                    />
                    <StatCard
                        title="Administrators"
                        value={(statistics?.role_statistics?.admin || 0) + (statistics?.role_statistics?.super_admin || 0)}
                        subtitle="Admin & Super Admin"
                    />
                    <StatCard
                        title="Penulis"
                        value={statistics?.role_statistics?.penulis || 0}
                        subtitle="Content creators"
                    />
                </div>

                {/* Filters */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                    <form onSubmit={applyFilters} className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <FilterShell label="Search" helper="Name or email">
                                <div className="flex items-center rounded-2xl border border-slate-200 px-4">
                                    <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-5.2-5.2M17 10.5A6.5 6.5 0 1 1 4 10.5a6.5 6.5 0 0 1 13 0Z" />
                                    </svg>
                                    <input
                                        type="search"
                                        placeholder="Search users"
                                        className="w-full border-0 bg-transparent px-3 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                                        value={localFilters.search}
                                        onChange={(event) => setLocalFilters((prev) => ({ ...prev, search: event.target.value }))}
                                    />
                                </div>
                            </FilterShell>

                            <FilterShell label="Role">
                                <select
                                    className="min-w-[180px] rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                    value={localFilters.role}
                                    onChange={(event) => setLocalFilters((prev) => ({ ...prev, role: event.target.value }))}
                                >
                                    <option value="">All roles</option>
                                    {availableRoles.map((role) => (
                                        <option key={role.value} value={role.value}>
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                            </FilterShell>

                            <FilterShell label="Status">
                                <select
                                    className="min-w-[180px] rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                    value={localFilters.status}
                                    onChange={(event) => setLocalFilters((prev) => ({ ...prev, status: event.target.value }))}
                                >
                                    <option value="">All statuses</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
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

                {/* Users Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">User</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Role</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Articles</th>
                                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Joined</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {userRows.map((user) => (
                                    <tr key={user.id} className="transition hover:bg-slate-50/60">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.profile_picture_url}
                                                    alt={user.name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                                <div>
                                                    <div className="font-semibold text-slate-900">{user.name}</div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className="text-xs rounded-lg border border-slate-200 px-2 py-1 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-200"
                                            >
                                                {availableRoles.map((role) => (
                                                    <option key={role.value} value={role.value}>
                                                        {role.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge isActive={user.is_active} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span>{user.articles_count || 0} total</span>
                                                <span className="text-slate-400">|</span>
                                                <span>{user.published_articles_count || 0} published</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : '\u0014'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('admin.users.show', user.id)}
                                                    className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={route('admin.users.edit', user.id)}
                                                    className="inline-flex items-center rounded-lg border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(user.id)}
                                                    className={`inline-flex items-center rounded-lg border px-3 py-2 text-xs font-semibold ${
                                                        user.is_active
                                                            ? 'border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100'
                                                            : 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100'
                                                    }`}
                                                >
                                                    {user.is_active ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(user)}
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

                    {userRows.length === 0 && (
                        <div className="px-6 py-12 text-center">
                            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <h3 className="mt-4 text-base font-semibold text-slate-900">No users found</h3>
                            <p className="mt-2 text-sm text-slate-500">
                                {localFilters.search || localFilters.role || localFilters.status
                                    ? "No users match your current filters."
                                    : "Get started by creating a new user."}
                            </p>
                            {!localFilters.search && !localFilters.role && !localFilters.status && (
                                <div className="mt-6">
                                    <Link
                                        href={route('admin.users.create')}
                                        className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black"
                                    >
                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create User
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {userRows.length > 0 && (
                        <div className="border-t border-slate-100 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-700">
                                    Showing {users.from || 0} to {users.to || 0} of {users.total} results
                                </div>
                                <div className="flex items-center gap-2">
                                    {users.prev_page_url && (
                                        <button
                                            onClick={() => window.location.href = users.prev_page_url}
                                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            Previous
                                        </button>
                                    )}
                                    {users.next_page_url && (
                                        <button
                                            onClick={() => window.location.href = users.next_page_url}
                                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            Next
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}