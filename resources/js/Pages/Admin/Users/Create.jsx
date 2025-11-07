import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function CreateUser() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('admin.users.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const user = usePage().props.auth.user;
    const canCreateSuperAdmin = user.isSuperAdmin();

    return (
        <DashboardLayout>
            <Head title="Create User" />

            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New User</h1>
                        <p className="text-slate-600">Add a new user to the system with appropriate role and permissions.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="name" value="Full Name" />

                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter user's full name"
                            />

                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email Address" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="email"
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="user@example.com"
                            />

                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" />

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter a secure password"
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Confirm the password"
                            />

                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="role" value="User Role" />

                            <select
                                id="role"
                                name="role"
                                value={data.role}
                                className="mt-1 block w-full border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-3 border bg-white"
                                onChange={(e) => setData('role', e.target.value)}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                {canCreateSuperAdmin && (
                                    <option value="super_admin">Super Admin</option>
                                )}
                            </select>

                            <InputError message={errors.role} className="mt-2" />

                            <div className="mt-2 text-sm text-slate-600">
                                <p className="font-medium mb-1">Role Permissions:</p>
                                <ul className="space-y-1 text-xs">
                                    <li>• <strong>User:</strong> Can access their own profile and basic features</li>
                                    <li>• <strong>Admin:</strong> Can manage users and access admin dashboard</li>
                                    {canCreateSuperAdmin && (
                                        <li>• <strong>Super Admin:</strong> Full system access including creating other admins</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <PrimaryButton
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating User...
                                    </span>
                                ) : (
                                    'Create User'
                                )}
                            </PrimaryButton>

                            <Link
                                href={route('admin.dashboard')}
                                className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}