import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function TagForm({ tag, mode }) {
    const isEdit = mode === 'edit' && tag;

    const { data, setData, post, put, processing, errors } = useForm({
        name: tag?.name ?? '',
        slug: tag?.slug ?? '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isEdit) {
            put(route('admin.tags.update', tag.id));
            return;
        }

        post(route('admin.tags.store'));
    };

    const pageTitle = isEdit ? `Edit Tag: ${tag.name}` : 'Create Tag';

    return (
        <DashboardLayout>
            <Head title={pageTitle} />

            <div className="mx-auto max-w-full space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                            {isEdit ? 'Update existing tag' : 'Add new tag'}
                        </p>
                        <h1 className="text-3xl font-bold text-slate-900">{pageTitle}</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            {isEdit
                                ? 'Update tag details and usage information.'
                                : 'Create a new tag to organize and categorize your content.'
                            }
                        </p>
                    </div>
                    <Link
                        href={route('admin.tags.index')}
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
                            {/* Tag Information */}
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Tag Information</h2>
                                    <p className="text-sm text-slate-500">
                                        Provide the basic information for this tag.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <InputLabel htmlFor="name" value="Tag Name" />
                                        <TextInput
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(event) => setData('name', event.target.value)}
                                            placeholder="Enter tag name (e.g., JavaScript, React, Laravel)"
                                            required
                                            className="mt-2 block w-full rounded-xl border-slate-300"
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                        <p className="mt-2 text-sm text-slate-500">
                                            This is the name that will be displayed to users and used for categorization.
                                        </p>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="slug" value="URL Slug" />
                                        <TextInput
                                            id="slug"
                                            name="slug"
                                            type="text"
                                            value={data.slug}
                                            onChange={(event) => setData('slug', event.target.value)}
                                            placeholder="url-friendly-slug"
                                            className="mt-2 block w-full rounded-xl border-slate-300"
                                        />
                                        <InputError message={errors.slug} className="mt-2" />
                                        <p className="mt-2 text-sm text-slate-500">
                                            The URL-friendly version of the name. Leave empty to auto-generate from the name.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Usage Guidelines */}
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Usage Guidelines</h2>
                                    <p className="text-sm text-slate-500">
                                        Best practices for creating effective tags.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">Keep it Simple</h4>
                                            <p className="text-sm text-slate-600">Use single words or short phrases that clearly describe the topic.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">Be Consistent</h4>
                                            <p className="text-sm text-slate-600">Use consistent naming conventions across all your tags.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900">Avoid Duplicates</h4>
                                            <p className="text-sm text-slate-600">Check if a similar tag already exists before creating new ones.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Sidebar Column - Takes 1 column on large screens */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Preview Card */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4">Preview</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-semibold text-slate-600">
                                                {data.name ? data.name.charAt(0).toUpperCase() : 'T'}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-900">
                                                {data.name || 'Tag Name'}
                                            </div>
                                            {data.slug && (
                                                <code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                                                    {data.slug}
                                                </code>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                                            New Tag
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tips Card */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                                <h3 className="text-sm font-semibold text-slate-900 mb-4">Tips</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-xs text-slate-600">
                                            Tags are automatically available in the article editor for categorizing content.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-xs text-slate-600">
                                            You can track tag usage statistics to see which tags are most popular.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-xs text-slate-600">
                                            Unused tags can be cleaned up to keep your system organized.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons - Sticky on desktop */}
                            <div className="lg:sticky lg:top-24">
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Actions</h3>
                                    <div className="space-y-3">
                                        <Link
                                            href={route('admin.tags.index')}
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
                                            ) : isEdit ? 'Update Tag' : 'Create Tag'}
                                        </PrimaryButton>
                                    </div>
                                    <div className="mt-4 text-xs text-slate-500">
                                        {processing ? 'Please wait while we save your changes...' : 'Your tag will be saved with the current settings.'}
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