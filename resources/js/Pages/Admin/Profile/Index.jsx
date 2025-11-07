import React, { useState, useRef } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    UserIcon,
    EnvelopeIcon,
    ShieldCheckIcon,
    DocumentTextIcon,
    CalendarIcon,
    PencilSquareIcon,
    PhotoIcon,
    KeyIcon,
    Cog6ToothIcon,
    TrashIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    BellIcon,
    MoonIcon,
    SunIcon,
    ComputerDesktopIcon,
    GlobeAltIcon,
    ExclamationTriangleIcon,
    UserCircleIcon,
    ChartBarIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import DashboardLayout from '@/Layouts/DashboardLayout';

const Index = ({ auth, profile, preferences, mustVerifyEmail, status }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [uploadingPicture, setUploadingPicture] = useState(false);
    const fileInputRef = useRef(null);

    const user = profile.user;
    const statistics = profile.statistics;
    const recentActivity = profile.recent_activity;

    // Profile form
    const {
        data: profileData,
        setData: setProfileData,
        put: putProfile,
        processing: processingProfile,
        errors: profileErrors,
        reset: resetProfile
    } = useForm({
        name: user.name,
        email: user.email,
        bio: user.bio || '',
    });

    // Password form
    const {
        data: passwordData,
        setData: setPasswordData,
        post: postPassword,
        processing: processingPassword,
        errors: passwordErrors,
        reset: resetPassword
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Preferences form
    const {
        data: preferencesData,
        setData: setPreferencesData,
        put: putPreferences,
        processing: processingPreferences,
        errors: preferencesErrors
    } = useForm({
        email_notifications: preferences.email_notifications,
        theme: preferences.theme,
        language: preferences.language,
        timezone: preferences.timezone,
    });

    // Delete form
    const {
        data: deleteData,
        setData: setDeleteData,
        delete: destroy,
        processing: processingDelete,
        errors: deleteErrors
    } = useForm({
        password: '',
        confirmation: '',
    });

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        putProfile(route('admin.profile.update'), {
            onSuccess: () => {
                resetProfile();
            }
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        postPassword(route('admin.profile.updatePassword'), {
            onSuccess: () => {
                resetPassword();
                setShowPasswordForm(false);
            }
        });
    };

    const handlePreferencesSubmit = (e) => {
        e.preventDefault();
        putPreferences(route('admin.profile.updatePreferences'), {
            onSuccess: () => {
                // Success is handled by flash messages
            }
        });
    };

    const handleProfilePictureUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingPicture(true);

        const formData = new FormData();
        formData.append('profile_picture', file);

        router.post(route('admin.profile.updateProfilePicture'), formData, {
            onSuccess: () => {
                setUploadingPicture(false);
                fileInputRef.current.value = '';
            },
            onError: () => {
                setUploadingPicture(false);
            }
        });
    };

    const handleDelete = () => {
        if (!deleteData.confirmation || deleteData.confirmation !== 'DELETE') {
            return;
        }

        destroy(route('admin.profile.destroy'), {
            onSuccess: () => {
                // User will be redirected and logged out
            }
        });
    };

    const getThemeIcon = (theme) => {
        switch (theme) {
            case 'dark':
                return <MoonIcon className="h-5 w-5" />;
            case 'light':
                return <SunIcon className="h-5 w-5" />;
            default:
                return <ComputerDesktopIcon className="h-5 w-5" />;
        }
    };

    return (
        <DashboardLayout>
            <Head title="My Profile" />

            <div className="py-8">
                <div className="mx-auto max-w-full sm:px-6 lg:px-8">
                    {/* Profile Header */}
                    <div className="bg-white shadow-sm ring-1 ring-slate-900/5 rounded-xl overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-brand-50 to-brand-100 px-8 py-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        src={user.profile_picture_url}
                                        alt={user.name}
                                        className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-lg"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploadingPicture}
                                        className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition-colors disabled:opacity-50"
                                    >
                                        {uploadingPicture ? (
                                            <ClockIcon className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <PhotoIcon className="h-4 w-4" />
                                        )}
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureUpload}
                                        className="hidden"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                                    <p className="text-slate-600 flex items-center gap-2 mt-1">
                                        <EnvelopeIcon className="h-4 w-4" />
                                        {user.email}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                            user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                                            user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                                            user.role === 'penulis' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            <ShieldCheckIcon className="h-3 w-3 mr-1" />
                                            {user.role_label}
                                        </span>
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                            user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500">
                                        Member for {statistics.account_age}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Last login {statistics.last_login}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Messages */}
                    {status && (
                        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
                            <p className="text-sm text-green-800">{status}</p>
                        </div>
                    )}

                    {/* Tab Navigation */}
                    <div className="border-b border-slate-200 mb-8">
                        <nav className="-mb-px flex space-x-8">
                            {[
                                { id: 'overview', label: 'Overview', icon: UserCircleIcon },
                                { id: 'edit', label: 'Edit Profile', icon: PencilSquareIcon },
                                { id: 'security', label: 'Security', icon: KeyIcon },
                                { id: 'preferences', label: 'Preferences', icon: Cog6ToothIcon },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? 'border-brand-500 text-brand-600'
                                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }`}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    {/* Statistics Cards */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                            <ChartBarIcon className="h-5 w-5 text-brand-600" />
                                            Statistics
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="bg-white rounded-lg border border-slate-200 p-4">
                                                <div className="flex items-center gap-2">
                                                    <DocumentTextIcon className="h-5 w-5 text-slate-400" />
                                                    <span className="text-sm font-medium text-slate-600">Total Articles</span>
                                                </div>
                                                <p className="text-2xl font-bold text-slate-900 mt-2">{statistics.total_articles}</p>
                                            </div>
                                            <div className="bg-white rounded-lg border border-slate-200 p-4">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                                    <span className="text-sm font-medium text-slate-600">Published</span>
                                                </div>
                                                <p className="text-2xl font-bold text-green-600 mt-2">{statistics.published_articles}</p>
                                            </div>
                                            <div className="bg-white rounded-lg border border-slate-200 p-4">
                                                <div className="flex items-center gap-2">
                                                    <ClockIcon className="h-5 w-5 text-yellow-500" />
                                                    <span className="text-sm font-medium text-slate-600">Drafts</span>
                                                </div>
                                                <p className="text-2xl font-bold text-yellow-600 mt-2">{statistics.draft_articles}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                            <ClockIcon className="h-5 w-5 text-brand-600" />
                                            Recent Activity
                                        </h3>
                                        <div className="bg-white rounded-lg border border-slate-200">
                                            {recentActivity.recent_articles.length > 0 ? (
                                                <div className="divide-y divide-slate-200">
                                                    {recentActivity.recent_articles.map((article) => (
                                                        <div key={article.id} className="p-4 flex items-center justify-between">
                                                            <div>
                                                                <h4 className="text-sm font-medium text-slate-900">{article.title}</h4>
                                                                <p className="text-xs text-slate-500 mt-1">
                                                                    {formatDistanceToNow(new Date(article.created_at), { addSuffix: true, locale: id })}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                                    article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                    {article.status}
                                                                </span>
                                                                <Link
                                                                    href={route('admin.articles.show', article.id)}
                                                                    className="text-brand-600 hover:text-brand-800"
                                                                >
                                                                    <EyeIcon className="h-4 w-4" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <DocumentTextIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                                                    <p className="text-slate-500">No articles yet</p>
                                                    <Link
                                                        href={route('admin.articles.create')}
                                                        className="inline-flex items-center text-brand-600 hover:text-brand-800 font-medium mt-2"
                                                    >
                                                        Create your first article �
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Edit Profile Tab */}
                            {activeTab === 'edit' && (
                                <div className="bg-white rounded-lg border border-slate-200 p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-6">Edit Profile Information</h3>
                                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData('name', e.target.value)}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                                required
                                            />
                                            {profileErrors.name && (
                                                <p className="mt-1 text-sm text-red-600">{profileErrors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData('email', e.target.value)}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                                required
                                            />
                                            {profileErrors.email && (
                                                <p className="mt-1 text-sm text-red-600">{profileErrors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-2">
                                                Bio
                                            </label>
                                            <textarea
                                                id="bio"
                                                rows={4}
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData('bio', e.target.value)}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                                placeholder="Tell us about yourself..."
                                            />
                                            {profileErrors.bio && (
                                                <p className="mt-1 text-sm text-red-600">{profileErrors.bio}</p>
                                            )}
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={processingProfile}
                                                className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processingProfile ? (
                                                    <>
                                                        <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    {/* Change Password */}
                                    <div className="bg-white rounded-lg border border-slate-200 p-6">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-6">Change Password</h3>
                                        {!showPasswordForm ? (
                                            <button
                                                onClick={() => setShowPasswordForm(true)}
                                                className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                            >
                                                <KeyIcon className="h-4 w-4 mr-2" />
                                                Change Password
                                            </button>
                                        ) : (
                                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                                <div>
                                                    <label htmlFor="current_password" className="block text-sm font-medium text-slate-700 mb-2">
                                                        Current Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        id="current_password"
                                                        value={passwordData.current_password}
                                                        onChange={(e) => setPasswordData('current_password', e.target.value)}
                                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                                        required
                                                    />
                                                    {passwordErrors.current_password && (
                                                        <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                                        New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        id="password"
                                                        value={passwordData.password}
                                                        onChange={(e) => setPasswordData('password', e.target.value)}
                                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                                        required
                                                    />
                                                    {passwordErrors.password && (
                                                        <p className="mt-1 text-sm text-red-600">{passwordErrors.password}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-slate-700 mb-2">
                                                        Confirm New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        id="password_confirmation"
                                                        value={passwordData.password_confirmation}
                                                        onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                                        required
                                                    />
                                                </div>

                                                <div className="flex justify-end gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowPasswordForm(false);
                                                            resetPassword();
                                                        }}
                                                        className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={processingPassword}
                                                        className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {processingPassword ? (
                                                            <>
                                                                <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircleIcon className="h-4 w-4 mr-2" />
                                                                Update Password
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>

                                    {/* Delete Account */}
                                    <div className="bg-white rounded-lg border border-red-200 p-6">
                                        <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                                            <ExclamationTriangleIcon className="h-5 w-5" />
                                            Delete Account
                                        </h3>
                                        <p className="text-sm text-slate-600 mb-4">
                                            Once you delete your account, there is no going back. Please be certain.
                                        </p>
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                                        >
                                            <TrashIcon className="h-4 w-4 mr-2" />
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <div className="bg-white rounded-lg border border-slate-200 p-6">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-6">Preferences</h3>
                                    <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                                        <div>
                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={preferencesData.email_notifications}
                                                    onChange={(e) => setPreferencesData('email_notifications', e.target.checked)}
                                                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                                                />
                                                <div>
                                                    <span className="text-sm font-medium text-slate-700">Email Notifications</span>
                                                    <p className="text-xs text-slate-500">Receive email notifications about your account activity</p>
                                                </div>
                                            </label>
                                        </div>

                                        <div>
                                            <label htmlFor="theme" className="block text-sm font-medium text-slate-700 mb-2">
                                                Theme
                                            </label>
                                            <select
                                                id="theme"
                                                value={preferencesData.theme}
                                                onChange={(e) => setPreferencesData('theme', e.target.value)}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                            >
                                                <option value="light">Light</option>
                                                <option value="dark">Dark</option>
                                                <option value="auto">Auto (System)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="language" className="block text-sm font-medium text-slate-700 mb-2">
                                                Language
                                            </label>
                                            <select
                                                id="language"
                                                value={preferencesData.language}
                                                onChange={(e) => setPreferencesData('language', e.target.value)}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                            >
                                                <option value="en">English</option>
                                                <option value="id">Bahasa Indonesia</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="timezone" className="block text-sm font-medium text-slate-700 mb-2">
                                                Timezone
                                            </label>
                                            <select
                                                id="timezone"
                                                value={preferencesData.timezone}
                                                onChange={(e) => setPreferencesData('timezone', e.target.value)}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                            >
                                                <option value="UTC">UTC</option>
                                                <option value="Asia/Jakarta">Asia/Jakarta</option>
                                                <option value="Asia/Singapore">Asia/Singapore</option>
                                                <option value="America/New_York">America/New_York</option>
                                                <option value="Europe/London">Europe/London</option>
                                            </select>
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={processingPreferences}
                                                className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processingPreferences ? (
                                                    <>
                                                        <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                                                        Save Preferences
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>

                        {/* Side Panel */}
                        <div className="space-y-6">
                            {/* Quick Info */}
                            <div className="bg-slate-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">User ID</span>
                                        <p className="text-sm text-slate-900 mt-1">#{user.id}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Role</span>
                                        <p className="text-sm text-slate-900 mt-1">{user.role_label}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</span>
                                        <p className="text-sm text-slate-900 mt-1">{user.is_active ? 'Active' : 'Inactive'}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Member Since</span>
                                        <p className="text-sm text-slate-900 mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Email Verification */}
                            {mustVerifyEmail && !user.email_verified_at && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
                                        <ExclamationTriangleIcon className="h-5 w-5" />
                                        Email Verification
                                    </h3>
                                    <p className="text-sm text-yellow-800 mb-4">
                                        Your email address is unverified. Please check your inbox for a verification link.
                                    </p>
                                    <form method="POST" action={route('verification.send')} className="inline">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center rounded-lg border border-yellow-200 bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-200"
                                        >
                                            Resend Verification Email
                                        </button>
                                    </form>
                                </div>
                            )}
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
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Delete Account</h3>
                        </div>

                        <p className="text-sm text-slate-600 mb-6">
                            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                        </p>

                        {statistics.total_articles > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                                <p className="text-sm text-yellow-800">
                                    <strong>Warning:</strong> You have {statistics.total_articles} article(s). You cannot delete your account until your articles are deleted.
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleDelete} className="space-y-4">
                            <div>
                                <label htmlFor="delete_password" className="block text-sm font-medium text-slate-700 mb-2">
                                    Enter your password to confirm
                                </label>
                                <input
                                    type="password"
                                    id="delete_password"
                                    value={deleteData.password}
                                    onChange={(e) => setDeleteData('password', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                    required
                                />
                                {deleteErrors.password && (
                                    <p className="mt-1 text-sm text-red-600">{deleteErrors.password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="delete_confirmation" className="block text-sm font-medium text-slate-700 mb-2">
                                    Type <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">DELETE</code> to confirm
                                </label>
                                <input
                                    type="text"
                                    id="delete_confirmation"
                                    value={deleteData.confirmation}
                                    onChange={(e) => setDeleteData('confirmation', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                    placeholder="DELETE"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteData('password', '');
                                        setDeleteData('confirmation', '');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processingDelete || deleteData.confirmation !== 'DELETE' || statistics.total_articles > 0}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                                        statistics.total_articles > 0 || deleteData.confirmation !== 'DELETE'
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50'
                                    }`}
                                >
                                    {processingDelete ? (
                                        <>
                                            <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete Account'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default Index;