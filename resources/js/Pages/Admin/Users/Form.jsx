import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function UserForm({ user, mode, availableRoles }) {
    const isEdit = mode === 'edit' && user;

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
        role: user?.role ?? 'user',
        bio: user?.bio ?? '',
        is_active: user?.is_active ?? true,
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        // For editing, don't send password if it's empty
        if (isEdit && !data.password) {
            setData('password', undefined);
            setData('password_confirmation', undefined);
        }

        if (isEdit) {
            put(route('admin.users.update', user.id));
            return;
        }

        post(route('admin.users.store'));
    };

    const pageTitle = isEdit ? `Edit User: ${user.name}` : 'Create User';

    return (
        <DashboardLayout>
            <Head title={pageTitle} />

            <div className="mx-auto max-w-full space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                            {isEdit ? 'Update existing user' : 'Add new user'}
                        </p>
                        <h1 className="text-3xl font-bold text-slate-900">{pageTitle}</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            {isEdit
                                ? 'Update user details, role, and access permissions.'
                                : 'Create a new user account with appropriate access level.'
                            }
                        </p>
                    </div>
                    <Link
                        href={route('admin.users.index')}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to list
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Main Content Column - Takes 2 columns on large screens */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* User Information */}
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">User Information</h2>
                                    <p className="text-sm text-slate-500">
                                        Provide the basic information for this user account.
                                    </p>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="name" value="Full Name" />
                                        <TextInput
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(event) => setData('name', event.target.value)}
                                            placeholder="Enter user's full name"
                                            required
                                            className="mt-2 block w-full rounded-xl border-slate-300"
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="email" value="Email Address" />
                                        <TextInput
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(event) => setData('email', event.target.value)}
                                            placeholder="user@example.com"
                                            required
                                            className="mt-2 block w-full rounded-xl border-slate-300"
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="role" value="Role" />
                                        <select
                                            id="role"
                                            name="role"
                                            value={data.role}
                                            onChange={(event) => setData('role', event.target.value)}
                                            className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                            required
                                        >
                                            {availableRoles.map((role) => (
                                                <option key={role.value} value={role.value}>
                                                    {role.label} - {role.description}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.role} className="mt-2" />
                                        <p className="mt-2 text-sm text-slate-500">
                                            Select the appropriate role based on the user's responsibilities.
                                        </p>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="is_active" value="Account Status" />
                                        <div className="mt-3">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="is_active"
                                                    name="is_active"
                                                    checked={data.is_active}
                                                    onChange={(event) => setData('is_active', event.target.checked)}
                                                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                                                />
                                                <span className="ml-2 text-sm text-slate-700">
                                                    Active (user can log in and access the system)
                                                </span>
                                            </label>
                                        </div>
                                        <InputError message={errors.is_active} className="mt-2" />
                                    </div>
                                </div>
                            </section>

                            {/* Password Section */}
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Password</h2>
                                    <p className="text-sm text-slate-500">
                                        {isEdit
                                            ? 'Leave blank to keep the current password.'
                                            : 'Set a secure password for the new user account.'
                                        }
                                    </p>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                        <InputLabel htmlFor="password" value="Password" />
                                        <TextInput
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(event) => setData('password', event.target.value)}
                                            placeholder={isEdit ? 'Leave blank to keep current password' : 'Enter password'}
                                            required={!isEdit}
                                            className="mt-2 block w-full rounded-xl border-slate-300"
                                        />
                                        <InputError message={errors.password} className="mt-2" />
                                        {!isEdit && (
                                            <p className="mt-2 text-sm text-slate-500">
                                                Password must be at least 8 characters long.
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                        <TextInput
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(event) => setData('password_confirmation', event.target.value)}
                                            placeholder="Confirm password"
                                            required={!isEdit || data.password}
                                            className="mt-2 block w-full rounded-xl border-slate-300"
                                        />
                                        <InputError message={errors.password_confirmation} className="mt-2" />
                                    </div>
                                </div>
                            </section>

                            {/* Bio Section */}
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Bio</h2>
                                    <p className="text-sm text-slate-500">
                                        Optional: Brief description about the user (visible in profile).
                                    </p>
                                </div>

                                <div>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={data.bio}
                                        onChange={(event) => setData('bio', event.target.value)}
                                        placeholder="Brief description about the user..."
                                        rows={4}
                                        maxLength={1000}
                                        className="mt-2 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                                    />
                                    <div className="mt-2 flex justify-between">
                                        <InputError message={errors.bio} className="mt-2" />
                                        <span className="text-xs text-slate-500">
                                            {data.bio?.length || 0}/1000 characters
                                        </span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar Column - Takes 1 column on large screens */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Role Information */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4">Role Information</h3>
                                <div className="space-y-3">
                                    <div className="p-3 rounded-lg bg-slate-50">
                                        <h4 className="text-xs font-semibold text-slate-700 mb-1">Selected Role</h4>
                                        <p className="text-sm text-slate-900 font-medium">
                                            {availableRoles.find(r => r.value === data.role)?.label || 'User'}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {availableRoles.find(r => r.value === data.role)?.description || 'Standard user access'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Password Guidelines */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4">Security Guidelines</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-xs text-slate-600">
                                            Use strong, unique passwords
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-xs text-slate-600">
                                            Include numbers and special characters
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-xs text-slate-600">
                                            Minimum 8 characters required
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4">Tips</h3>
                                <div className="space-y-3 text-xs text-slate-600">
                                    <p>" Users can change their own password later</p>
                                    <p>" Roles determine access permissions</p>
                                    <p>" Inactive users cannot log in</p>
                                    <p>" Bio is optional but recommended</p>
                                </div>
                            </div>

                            {/* Action Buttons - Sticky on desktop */}
                            <div className="lg:sticky lg:top-24">
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Actions</h3>
                                    <div className="space-y-3">
                                        <Link
                                            href={route('admin.users.index')}
                                            className="block w-full text-center inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                            Cancel
                                        </Link>
                                        <PrimaryButton
                                            type="submit"
                                            className="w-full inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-black transition-colors"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    {isEdit ? 'Updating...' : 'Creating...'}
                                                </>
                                            ) : isEdit ? 'Update User' : 'Create User'}
                                        </PrimaryButton>
                                    </div>
                                    <div className="mt-4 text-xs text-slate-500">
                                        {processing ? 'Please wait while we save your changes...' : 'Your user account will be saved with the current settings.'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}