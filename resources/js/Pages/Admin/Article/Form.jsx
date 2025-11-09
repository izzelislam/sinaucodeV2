import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

// Configure highlight.js for Quill
hljs.configure({
    languages: ['javascript', 'python', 'java', 'cpp', 'csharp', 'php', 'ruby', 'go', 'rust', 'typescript', 'html', 'css', 'sql', 'bash', 'json', 'xml', 'yaml']
});

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

const SelectField = ({ id, name, value, onChange, options, error, label }) => (
    <FieldWrapper label={label} htmlFor={id} error={error}>
        <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </FieldWrapper>
);

const MultiSelect = ({ label, options = [], value = [], onChange, error, canCreate = false }) => {
    const [selectedValues, setSelectedValues] = useState(value);
    const [inputValue, setInputValue] = useState('');
    const [showCreateNew, setShowCreateNew] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        setSelectedValues(value);
    }, [value]);

    const handleChange = (selectedValue) => {
        let newValue = [...selectedValues];

        if (newValue.includes(selectedValue)) {
            newValue = newValue.filter(v => v !== selectedValue);
        } else {
            newValue.push(selectedValue);
        }

        setSelectedValues(newValue);
        onChange(newValue);
    };

    const handleAddNew = (tagValue) => {
        const trimmedValue = tagValue.trim();
        if (!trimmedValue) return;

        // Check if tag already exists
        const existingTag = options.find(opt =>
            opt.label.toLowerCase() === trimmedValue.toLowerCase()
        );

        if (existingTag) {
            handleChange(existingTag.value);
        } else {
            // Create a temporary value that will be handled on form submission
            const tempValue = `new:${trimmedValue}`;
            handleChange(tempValue);
        }

        setInputValue('');
        setShowCreateNew(false);
    };

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedValues.includes(option.value)
    );

    const selectedLabels = selectedValues.map(val => {
        if (typeof val === 'string' && val.startsWith('new:')) {
            return val.replace('new:', '');
        }
        const option = options.find(opt => opt.value.toString() === val.toString());
        return option ? option.label : null;
    }).filter(Boolean);

    return (
        <FieldWrapper label={label} error={error}>
            <div className="space-y-3">
                {/* Selected tags */}
                <div className="flex flex-wrap gap-2 p-3 border border-slate-300 rounded-xl bg-white min-h-[48px]">
                    {selectedLabels.map((label, index) => (
                        <span key={index} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm">
                            {label}
                            <button
                                type="button"
                                onClick={() => handleChange(selectedValues[index])}
                                className="text-slate-500 hover:text-slate-700"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    {selectedLabels.length === 0 && (
                        <span className="text-slate-400 text-sm">Select {label.toLowerCase()}...</span>
                    )}
                </div>

                {/* Tag input and suggestions */}
                <div className="relative">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onFocus={() => canCreate && setInputValue('')}
                            onBlur={() => {
                                setTimeout(() => {
                                    if (!showCreateNew) {
                                        setShowCreateNew(false);
                                    }
                                }, 200);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (inputValue.trim()) {
                                        handleAddNew(inputValue);
                                    }
                                } else if (e.key === 'Escape') {
                                    setInputValue('');
                                    setShowCreateNew(false);
                                }
                            }}
                            placeholder={`Type to add ${label.toLowerCase()}...`}
                            className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
                        />
                        {inputValue && (
                            <button
                                type="button"
                                onClick={() => handleAddNew(inputValue)}
                                className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black transition-colors"
                            >
                                Add
                            </button>
                        )}
                    </div>

                    {/* Suggestions dropdown */}
                    {(inputValue || showCreateNew) && (
                        <div className="absolute z-10 mt-1 w-full rounded-xl border border-slate-200 bg-white shadow-lg max-h-48 overflow-y-auto">
                            {filteredOptions.length > 0 && (
                                <div className="border-b border-slate-100">
                                    <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Existing {label}</p>
                                    {filteredOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => {
                                                handleChange(option.value);
                                                setInputValue('');
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors"
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {inputValue && (
                                <div>
                                    <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        Create New
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => handleAddNew(inputValue)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors border-t border-slate-100"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{inputValue}</span>
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                                                New
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick access to existing tags */}
                {!inputValue && (
                    <div>
                        <p className="text-xs font-semibold text-slate-500 mb-2">Quick add:</p>
                        <div className="flex flex-wrap gap-2">
                            {options.slice(0, 8).map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleChange(option.value)}
                                    className={`px-3 py-1 text-sm rounded-full transition ${
                                        selectedValues.includes(option.value)
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                            {options.length > 8 && (
                                <span className="text-xs text-slate-500 px-3 py-1">+{options.length - 8} more</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </FieldWrapper>
    );
};

export default function ArticleForm({ article = null, mode = 'create', seriesOptions = [], categoryOptions = [], tagOptions = [], defaultSeriesId = null }) {
    const isEdit = mode === 'edit' && article;
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [coverPreview, setCoverPreview] = useState(article?.featured_image?.url || null);
    const [objectUrl, setObjectUrl] = useState(null);

    const { data, setData, post, put, processing, errors } = useForm({
        title: article?.title ?? '',
        content: article?.content ?? '',
        excerpt: article?.excerpt ?? '',
        status: article?.status ?? 'draft',
        series_id: article?.series_id ?? defaultSeriesId ?? '',
        categories: article?.categories?.map(c => c.id) ?? [],
        tags: article?.tags?.map(t => t.id || t) ?? [], // Handle both ID and object cases
        meta_title: article?.meta_title ?? '',
        meta_description: article?.meta_description ?? '',
        published_at: article?.published_at ? new Date(article.published_at).toISOString().slice(0, 16) : '',
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
            syntax: {
                highlight: text => hljs.highlightAuto(text).value
            }
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
        setCoverPreview(article?.featured_image?.url || null);
        setData('featured_image', null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const options = {
            preserveScroll: true,
        };

        // Only use form data if we have a file to upload
        if (data.featured_image instanceof File) {
            options.forceFormData = true;
            // When using FormData, convert tags and categories to strings
            // Laravel validation expects string|integer but FormData serializes everything as strings
            options.transform = (data) => ({
                ...data,
                tags: data.tags.map(t => String(t)),
                categories: data.categories.map(c => String(c))
            });
        }

        if (isEdit) {
            put(route('admin.articles.update', article.id), options);
            return;
        }

        post(route('admin.articles.store'), options);
    };

    const pageTitle = isEdit ? `Edit ${article.title}` : 'Create Article';

    return (
        <DashboardLayout>
            <Head title={pageTitle} />

            <div className="mx-auto max-w-full space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                            {isEdit ? 'Update existing article' : 'Add new article'}
                        </p>
                        <h1 className="text-3xl font-bold text-slate-900">{pageTitle}</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Create engaging content with rich text editing and media support.
                        </p>
                    </div>
                    <Link
                        href={route('admin.articles.index')}
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
                            <FormSection title="Article Content" description="Add the main content for your article.">
                                <TextField
                                    id="title"
                                    name="title"
                                    value={data.title}
                                    onChange={(event) => setData('title', event.target.value)}
                                    placeholder="Enter a compelling title for your article"
                                    required
                                    label="Article Title"
                                    error={errors.title}
                                />

                                <TextAreaField
                                    id="excerpt"
                                    name="excerpt"
                                    value={data.excerpt}
                                    onChange={(event) => setData('excerpt', event.target.value)}
                                    placeholder="Brief summary of your article (optional)"
                                    rows={3}
                                    label="Excerpt"
                                    error={errors.excerpt}
                                />

                                <FieldWrapper label="Content" htmlFor="content" error={errors.content}>
                                    <div className="quill-wrapper">
                                        <ReactQuill
                                            ref={null}
                                            id="content"
                                            theme="snow"
                                            className="quill-editor min-h-[400px]"
                                            value={data.content}
                                            onChange={(value) => setData('content', value)}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="Write your article content here..."
                                        />
                                    </div>
                                </FieldWrapper>
                            </FormSection>

                            <FormSection title="Featured Image" description="Add a visual element to make your article stand out.">
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
                                                <img src={coverPreview} alt="Cover preview" className="mx-auto h-64 w-full rounded-xl object-cover shadow-sm" />
                                                <p className="mt-4 text-sm text-slate-600">Drop a new file or click to replace the current featured image.</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 text-slate-500">
                                                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        </div>

                        {/* Sidebar Column - Takes 1 column on large screens */}
                        <div className="lg:col-span-1 space-y-8">
                            <FormSection title="Publishing Options" description="Control how and when your article is published.">
                                <div className="space-y-6">
                                    <SelectField
                                        id="status"
                                        name="status"
                                        value={data.status}
                                        onChange={(event) => setData('status', event.target.value)}
                                        options={[
                                            { value: 'draft', label: 'Draft' },
                                            { value: 'published', label: 'Published' },
                                            { value: 'scheduled', label: 'Scheduled' },
                                        ]}
                                        label="Status"
                                        error={errors.status}
                                    />

                                    <SelectField
                                        id="series_id"
                                        name="series_id"
                                        value={data.series_id}
                                        onChange={(event) => setData('series_id', event.target.value)}
                                        options={seriesOptions}
                                        label="Series"
                                        error={errors.series_id}
                                    />

                                    {data.status === 'scheduled' && (
                                        <TextField
                                            id="published_at"
                                            name="published_at"
                                            type="datetime-local"
                                            value={data.published_at}
                                            onChange={(event) => setData('published_at', event.target.value)}
                                            label="Publish Date"
                                            error={errors.published_at}
                                        />
                                    )}
                                </div>
                            </FormSection>

                            <FormSection title="Organization" description="Organize your article with categories and tags.">
                                <div className="space-y-6">
                                    <MultiSelect
                                        label="Categories"
                                        options={categoryOptions}
                                        value={data.categories}
                                        onChange={(value) => setData('categories', value)}
                                        error={errors.categories}
                                    />

                                    <MultiSelect
                                        label="Tags"
                                        options={tagOptions}
                                        value={data.tags}
                                        onChange={(value) => setData('tags', value)}
                                        error={errors.tags}
                                        canCreate={true}
                                    />
                                </div>
                            </FormSection>

                            <FormSection title="SEO Metadata" description="Improve search engine visibility and social sharing.">
                                <div className="space-y-6">
                                    <TextField
                                        id="meta_title"
                                        name="meta_title"
                                        value={data.meta_title}
                                        onChange={(event) => setData('meta_title', event.target.value)}
                                        placeholder="Custom meta title (optional)"
                                        label="Meta Title"
                                        error={errors.meta_title}
                                    />
                                    <TextAreaField
                                        id="meta_description"
                                        name="meta_description"
                                        value={data.meta_description}
                                        onChange={(event) => setData('meta_description', event.target.value)}
                                        placeholder="Custom meta description (optional)"
                                        rows={4}
                                        label="Meta Description"
                                        error={errors.meta_description}
                                    />
                                </div>
                            </FormSection>

                            {/* Action Buttons - Sticky on desktop */}
                            <div className="lg:sticky lg:top-24">
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Actions</h3>
                                    <div className="space-y-3">
                                        <Link
                                            href={route('admin.articles.index')}
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
                                            ) : isEdit ? 'Update Article' : 'Create Article'}
                                        </PrimaryButton>
                                    </div>
                                    <div className="mt-4 text-xs text-slate-500">
                                        {processing ? 'Please wait while we save your changes...' : 'Your article will be saved with the current settings.'}
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