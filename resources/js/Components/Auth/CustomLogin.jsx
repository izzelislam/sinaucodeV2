import { useState } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CustomLogin({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [environment, setEnvironment] = useState('production');

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
            <Head title="Admin Login" />

            <div className="relative isolate overflow-hidden px-6 py-12 sm:py-16 lg:px-12">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute -top-40 left-1/2 h-96 w-[30rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/40 to-purple-600/40 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-blue-500/30 blur-[120px]" />
                </div>

                <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center">
                    <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="space-y-10">
                            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-slate-200">
                                Sinaucode Access
                            </div>

                            <div className="space-y-6">
                                <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                                    Centralized control for your learning teams
                                </h1>
                                <p className="text-lg text-slate-300">
                                    Securely manage instructors, content, and cohorts with enterprise-grade authentication and visibility into everything happening in your workspace.
                                </p>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-blue-900/30">
                                    <div className="text-sm uppercase tracking-wide text-blue-200">Realtime</div>
                                    <p className="mt-2 text-3xl font-semibold text-white">42</p>
                                    <p className="text-sm text-slate-300">Active cohorts monitored</p>
                                    <div className="mt-4 h-2 rounded-full bg-white/10">
                                        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-200">
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6v6l4 2m6 2a10 10 0 11-20 0 10 10 0 0120 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">SLA Guaranteed</p>
                                            <p className="text-xs text-slate-300">Under 120 ms response time</p>
                                        </div>
                                    </div>
                                    <ul className="mt-4 space-y-2 text-sm text-slate-300">
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                                            Adaptive MFA prompts
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                                            Unified audit trails
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="w-full">
                            <div className="rounded-[28px] border border-slate-200/70 bg-white/95 p-8 shadow-2xl shadow-blue-500/20 backdrop-blur-xl sm:p-10">
                                <div className="mt-8 space-y-2 text-center">
                                    <div className="inline-flex items-center justify-center rounded-2xl bg-blue-50 p-3 text-blue-600">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c1.38 0 2.5-1.12 2.5-2.5S13.38 6 12 6s-2.5 1.12-2.5 2.5S10.62 11 12 11zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C19 14.17 14.33 13 12 13z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-blue-600">Admin authentication</p>
                                        <h2 className="text-2xl font-semibold text-slate-900">Sign in to the control room</h2>
                                    </div>
                                </div>

                                {status && (
                                    <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                        {status}
                                    </div>
                                )}

                                <form onSubmit={submit} className="mt-6 space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-semibold text-slate-600">
                                            Work email
                                        </label>
                                        <div className="relative rounded-2xl border border-slate-200 bg-white shadow-inner">
                                            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 12H8m13-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v2m16 0v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6m18 0l-9 5-9-5" />
                                                </svg>
                                            </span>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                className="w-full rounded-2xl bg-transparent px-4 py-3 pl-12 text-base text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                autoComplete="username"
                                                autoFocus
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="admin@sinaucode.dev"
                                            />
                                        </div>
                                        <InputError message={errors.email} className="mt-1 text-sm text-rose-600" />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="password" className="text-sm font-semibold text-slate-600">
                                            Password
                                        </label>
                                        <div className="relative rounded-2xl border border-slate-200 bg-white shadow-inner">
                                            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m4-6V7a4 4 0 10-8 0v4m-3 0h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                                                </svg>
                                            </span>
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={data.password}
                                                className="w-full rounded-2xl bg-transparent px-4 py-3 pl-12 pr-12 text-base text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                autoComplete="current-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="absolute inset-y-0 right-2 flex items-center rounded-2xl px-3 text-sm font-semibold text-slate-500 hover:text-slate-800"
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? 'Hide' : 'Show'}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} className="mt-1 text-sm text-rose-600" />
                                    </div>

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <label className="flex items-center text-sm font-medium text-slate-600">
                                            <input
                                                type="checkbox"
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2">Keep me signed in</span>
                                        </label>

                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>

                                    <PrimaryButton
                                        className="w-full rounded-2xl bg-blue-600 py-3 text-base font-semibold tracking-wide text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-70"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <span className="flex items-center justify-center gap-3">
                                                <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Signing in
                                            </span>
                                        ) : (
                                            'Secure Sign In'
                                        )}
                                    </PrimaryButton>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
