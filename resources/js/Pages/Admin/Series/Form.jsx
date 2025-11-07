import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const FormSection = ({ title, description, children }) => (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-6">
        <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
        {children}
    </section>
);

const FieldWrapper = ({ label, htmlFor, error, children }) => (
    <div>
        <InputLabel htmlFor={htmlFor} value={label} />
        <div className="mt-2">{children}</div>
        <InputError message={error} className="mt-2" />
    </div>
);

const TextField = ({ id, name, value, onChange, placeholder, type = 'text', required, error, label }) => (
    <FieldWrapper label={label} htmlFor={id} error={error}>
        <TextInput
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="block w-full rounded-xl border-slate-300"
        />
    </FieldWrapper>
);

const TextAreaField = ({ id, name, value, onChange, placeholder, rows = 4, error, label }) => (
    <FieldWrapper label={label} htmlFor={id} error={error}>
        <textarea
            id={id}
            name={name}
            value={value}
            rows={rows}
            onChange={onChange}
            placeholder={placeholder}
            className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
    </FieldWrapper>
);

export default function SeriesForm({ series = null, mode = 'create' }) {
    const isEdit = mode === 'edit' && series;
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [coverPreview, setCoverPreview] = useState(series?.featured_image?.url || null);
    const [objectUrl, setObjectUrl] = useState(null);
    const quillRef = useRef(null);

    const { data, setData, post, put, processing, errors } = useForm({
        name: series?.name ?? '',
        description: series?.description ?? '',
        featured_image: null,
    });

    const quillModules = useMemo(
        () => ({
            toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'blockquote', 'code-block'],
                [{ color: [] }, { background: [] }],
                ['clean'],
            ],
        }),
        []
    );

    const quillFormats = useMemo(
        () => ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'blockquote', 'code-block', 'color', 'background'],
        []
    );

    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [objectUrl]);

    const handleCoverFiles = (files) => {
        const file = files?.[0];
        if (!file) return;

        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }

        const previewUrl = URL.createObjectURL(file);
        setCoverPreview(previewUrl);
        setObjectUrl(previewUrl);
        setData('featured_image', file);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        handleCoverFiles(event.dataTransfer?.files);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleResetCover = () => {
        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
            setObjectUrl(null);
        }
        setCoverPreview(series?.featured_image?.url || null);
        setData('featured_image', null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            forceFormData: true,
        };

        if (isEdit) {
            put(route('admin.series.update', series.id), options);
            return;
        }

        post(route('admin.series.store'), options);
    };

    const pageTitle = isEdit ? `Edit ${series.name}` : 'Create Series';

    return (
        <DashboardLayout>
            <Head title={pageTitle} />

            <div className="mx-auto max-w-full space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                            {isEdit ? 'Update existing series' : 'Add new series'}
                        </p>
                        <h1 className="text-3xl font-bold text-slate-900">{pageTitle}</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Create series to organize related articles and provide structured content for your readers.
                        </p>
                    </div>
                    <Link
                        href={route('admin.series.index')}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to list
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <FormSection title="Series Details" description="Add the essential information for organizing your series.">
                        <TextField
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(event) => setData('name', event.target.value)}
                            placeholder="e.g. Getting Started with Laravel, Advanced React Patterns"
                            required
                            label="Series Name"
                            error={errors.name}
                        />

                        <FieldWrapper label="Description" htmlFor="description" error={errors.description}>
                            <div className="quill-wrapper">
                                <ReactQuill
                                    ref={quillRef}
                                    id="description"
                                    theme="snow"
                                    className="quill-editor"
                                    value={data.description}
                                    onChange={(value) => setData('description', value)}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="Enter series description..."
                                />
                            </div>
                        </FieldWrapper>

                        <FieldWrapper label="Featured Image" htmlFor="featured_image" error={errors.featured_image}>
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDragEnter={handleDragOver}
                                onClick={handleBrowseClick}
                                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
                                    isDragging ? 'border-slate-900 bg-slate-50' : 'border-slate-300 bg-slate-50/50 hover:border-slate-500'
                                }`}
                            >
                                {coverPreview ? (
                                    <div className="w-full">
                                        <img src={coverPreview} alt="Cover preview" className="mx-auto h-56 w-full rounded-xl object-cover shadow-sm" />
                                        <p className="mt-4 text-sm text-slate-600">Drop a new file or click to replace the current featured image.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-slate-500">
                                        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 16.5V7.125A2.625 2.625 0 0 1 5.625 4.5h12.75A2.625 2.625 0 0 1 21 7.125V16.5M3 16.5a2.625 2.625 0 0 0 2.625 2.625h12.75A2.625 2.625 0 0 0 21 16.5M3 16.5l4.848-4.848a2.625 2.625 0 0 1 3.714 0L16.5 16.5M21 16.5l-3.873-3.873a2.625 2.625 0 0 0-3.714 0L9 17.04" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 8.25h.008v.008H9.75z" />
                                        </svg>
                                        <div className="text-sm">
                                            <p className="font-semibold text-slate-900">Drag & drop your featured image</p>
                                            <p>PNG, JPG up to 10MB</p>
                                        </div>
                                    </div>
                                )}
                                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleBrowseClick();
                                        }}
                                        className="inline-flex items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
                                    >
                                        Browse files
                                    </button>
                                    {objectUrl && (
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleResetCover();
                                            }}
                                            className="text-sm font-semibold text-slate-500 hover:text-slate-700"
                                        >
                                            Use previous image
                                        </button>
                                    )}
                                    <span className="text-xs text-slate-500">Supports drag & drop with instant preview</span>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="featured_image"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => handleCoverFiles(event.target.files)}
                            />
                        </FieldWrapper>
                    </FormSection>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <Link
                            href={route('admin.series.index')}
                            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </Link>
                        <PrimaryButton
                            type="submit"
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-black"
                            disabled={processing}
                        >
                            {processing ? 'Saving...' : isEdit ? 'Update Series' : 'Create Series'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}