import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    UserIcon,
    MailIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    CalendarIcon,
    PencilSquareIcon,
    TrashIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    XCircleIcon,
    EyeIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const Show = ({ auth, user }) => {
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleToggleStatus = () => {
        if (isTogglingStatus) return;

        setIsTogglingStatus(true);

        router.post(
            route('admin.users.toggleStatus', user.id),
            {},
            {
                onSuccess: () => {
                    setIsTogglingStatus(false);
                },
                onError: () => {
                    setIsTogglingStatus(false);
                }
            }
        );
    };

    const handleDelete = () => {
        if (showDeleteModal) return;

        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route('admin.users.destroy', user.id), {
            onSuccess: () => {
                setShowDeleteModal(false);
            }
        });
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleRoleChange = (e) => {
        const newRole = e.target.value;

        router.post(
            route('admin.users.changeRole', user.id),
            { role: newRole },
            {
                preserveState: true,
                onSuccess: () => {
                    // Success is handled by flash messages
                }
            }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.users.index')}
                            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Back to Users
                        </Link>
                        <h2 className="text-xl font-semibold text-slate-900">User Details</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route('admin.users.edit', user.id)}
                            className="inline-flex items-center rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
                        >
                            <PencilSquareIcon className="h-4 w-4 mr-2" />
                            Edit User
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                        >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Delete
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`User: ${user.name}`} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* User Overview Card */}
                    <div className="bg-white shadow-sm ring-1 ring-slate-900/5 rounded-xl overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src={user.profile_picture_url}
                                            alt={user.name}
                                            className="h-16 w-16 rounded-full object-cover ring-4 ring-white shadow-lg"
                                        />
                                        <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ring-2 ring-white ${
                                            user.is_active ? 'bg-green-500' : 'bg-red-500'
                                        }`}></div>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                                        <p className="text-slate-600 flex items-center gap-2 mt-1">
                                            <MailIcon className="h-4 w-4" />
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                        user.is_active
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.is_active ? (
                                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                                        ) : (
                                            <XCircleIcon className="h-3 w-3 mr-1" />
                                        )}
                                        {user.status}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Joined {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: id })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Main Information */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Basic Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                            <UserIcon className="h-5 w-5 text-brand-600" />
                                            Basic Information
                                        </h3>
                                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <dt className="text-sm font-medium text-slate-500">Full Name</dt>
                                                <dd className="mt-1 text-sm text-slate-900">{user.name}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-slate-500">Email Address</dt>
                                                <dd className="mt-1 text-sm text-slate-900">{user.email}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-slate-500">Current Role</dt>
                                                <dd className="mt-1">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                                        user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                                                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                                                        user.role === 'penulis' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        <ShieldCheckIcon className="h-3 w-3 mr-1" />
                                                        {user.role_label}
                                                    </span>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-slate-500">Account Status</dt>
                                                <dd className="mt-1">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {user.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-slate-500">Bio</dt>
                                                <dd className="mt-1 text-sm text-slate-900">
                                                    {user.bio || (
                                                        <span className="text-slate-400 italic">No bio provided</span>
                                                    )}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>

                                    {/* Recent Articles */}
                                    {user.articles && user.articles.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                                <DocumentTextIcon className="h-5 w-5 text-brand-600" />
                                                Recent Articles
                                            </h3>
                                            <div className="space-y-3">
                                                {user.articles.map((article) => (
                                                    <div key={article.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-medium text-slate-900">{article.title}</h4>
                                                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-4">
                                                                <span className="flex items-center gap-1">
                                                                    <CalendarIcon className="h-3 w-3" />
                                                                    {new Date(article.created_at).toLocaleDateString()}
                                                                </span>
                                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                                                    article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                    {article.status}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <Link
                                                            href={route('admin.articles.show', article.id)}
                                                            className="inline-flex items-center text-brand-600 hover:text-brand-800 text-sm font-medium"
                                                        >
                                                            <EyeIcon className="h-4 w-4 mr-1" />
                                                            View
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                            {user.articles_count > user.articles.length && (
                                                <div className="mt-4 text-center">
                                                    <Link
                                                        href={route('admin.articles.index', { author: user.id })}
                                                        className="text-sm text-brand-600 hover:text-brand-800 font-medium"
                                                    >
                                                        View all {user.articles_count} articles ’
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Side Panel */}
                                <div className="space-y-6">
                                    {/* Quick Actions */}
                                    <div className="bg-slate-50 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                                        <div className="space-y-3">
                                            <button
                                                onClick={handleToggleStatus}
                                                disabled={isTogglingStatus}
                                                className={`w-full inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                                    isTogglingStatus
                                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                        : user.is_active
                                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                            >
                                                {isTogglingStatus ? (
                                                    <>
                                                        <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : user.is_active ? (
                                                    <>
                                                        <XCircleIcon className="h-4 w-4 mr-2" />
                                                        Deactivate User
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                                                        Activate User
                                                    </>
                                                )}
                                            </button>

                                            <Link
                                                href={route('admin.users.edit', user.id)}
                                                className="w-full inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                            >
                                                <PencilSquareIcon className="h-4 w-4 mr-2" />
                                                Edit User
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Change Role */}
                                    <div className="bg-slate-50 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Change Role</h3>
                                        <select
                                            value={user.role}
                                            onChange={handleRoleChange}
                                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                        >
                                            <option value="user">User</option>
                                            <option value="penulis">Penulis</option>
                                            <option value="admin">Administrator</option>
                                            <option value="super_admin">Super Admin</option>
                                        </select>
                                        <p className="text-xs text-slate-500 mt-2">
                                            Change the user's role and permissions
                                        </p>
                                    </div>

                                    {/* Statistics */}
                                    <div className="bg-slate-50 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Statistics</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-600">Total Articles</span>
                                                <span className="text-sm font-semibold text-slate-900">{user.articles_count || 0}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-600">Published Articles</span>
                                                <span className="text-sm font-semibold text-green-600">{user.published_articles_count || 0}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-600">Member Since</span>
                                                <span className="text-sm font-semibold text-slate-900">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                <TrashIcon className="h-5 w-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Delete User</h3>
                        </div>

                        <p className="text-sm text-slate-600 mb-6">
                            Are you sure you want to delete "{user.name}"? This action cannot be undone and will remove all user data permanently.
                        </p>

                        {user.articles_count > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                                <p className="text-sm text-yellow-800">
                                    <strong>Warning:</strong> This user has {user.articles_count} article(s). You cannot delete this user until their articles are reassigned or deleted.
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={user.articles_count > 0}
                                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                                    user.articles_count > 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-red-600 text-white hover:bg-red-700'
                                }`}
                            >
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default Show;