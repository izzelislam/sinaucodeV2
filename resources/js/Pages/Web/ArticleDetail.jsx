import { useEffect, useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import WebLayout from '../../Layouts/WebLayout';
import DisqusComment from '../../Components/Web/DisqusComment';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const slugify = (text = '') =>
    text
        .toLowerCase()
        .replace(/<\/?[^>]+(>|$)/g, '')
        .replace(/&.+?;/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const stripTags = (value = '') => value.replace(/<[^>]+>/g, '');

    const addHeadingAnchors = (content = '') => {
    if (!content) return '';

    const headingCounts = {};

    return content.replace(/<h([1-6])([^>]*)>(.*?)<\/h\1>/gi, (_, level, attrs, inner) => {
        const plain = inner.replace(/<[^>]+>/g, '').trim();
        let slug = slugify(plain) || `heading-${level}`;

        if (headingCounts[slug]) {
        headingCounts[slug] += 1;
        slug = `${slug}-${headingCounts[slug]}`;
        } else {
        headingCounts[slug] = 1;
        }

        const sanitizedAttrs = attrs?.trim() ? ` ${attrs.trim()}` : '';
        const hasId = sanitizedAttrs.includes('id=');
        const attrWithId = hasId ? sanitizedAttrs : `${sanitizedAttrs} id="${slug}"`;

        return `<h${level}${attrWithId}>${inner}</h${level}>`;
    });
    };

    const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    };

    const ArticleDetail = ({
    auth,
    article,
    relatedArticles = [],
    seriesArticles = [],
    disqusConfig,
    }) => {
    const [tableOfContents, setTableOfContents] = useState([]);
    const [tocOpen, setTocOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const contentWithAnchors = useMemo(
        () => addHeadingAnchors(article?.content ?? ''),
        [article?.content],
    );

    const currentUrl =
        typeof window !== 'undefined'
        ? window.location.href
        : disqusConfig?.url || '';

    const shareLinks = [
        {
        name: 'Twitter',
        href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article?.title ?? '')}`,
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23 3a10.9 10.9 0 01-3.1.9 4.48 4.48 0 001.98-2.48 9.15 9.15 0 01-2.88 1.1A4.52 4.52 0 0016.11 1a4.5 4.5 0 00-4.53 4.53c0 .35.04.68.11 1A12.8 12.8 0 013 2.1a4.52 4.52 0 001.4 6.04 4.23 4.23 0 01-2.05-.56v.06A4.5 4.5 0 004.5 12a4.32 4.32 0 01-2 .08 4.54 4.54 0 004.23 3.15A9 9 0 012 17.54 12.76 12.76 0 008.92 19.5c8.35 0 12.92-7 12.92-13.07 0-.2 0-.39-.02-.58A9.4 9.4 0 0023 3z" />
            </svg>
        ),
        },
        {
        name: 'LinkedIn',
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.98 3.5c0 1.38-1.1 2.5-2.48 2.5A2.47 2.47 0 010 3.5 2.47 2.47 0 012.5 1c1.38 0 2.48 1.12 2.48 2.5zM.2 8.7h4.6V24H.2V8.7zM8.98 8.7H13v2.09h.06c.56-1.05 1.92-2.14 3.95-2.14 4.23 0 5 2.78 5 6.4V24h-4.8v-7.71c0-1.84-.03-4.21-2.57-4.21-2.57 0-2.96 2-2.96 4.08V24H8.98V8.7z" />
            </svg>
        ),
        },
    ];

    const handleCopyLink = () => {
        if (!currentUrl) return;

        if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(currentUrl).then(() => setCopied(true));
        return;
        }

        const textarea = document.createElement('textarea');
        textarea.value = currentUrl;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
    };

    useEffect(() => {
        if (!article?.content) {
        setTableOfContents([]);
        return;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contentWithAnchors;
        const headings = tempDiv.querySelectorAll('h1, h2, h3, h4');
        const toc = Array.from(headings)
        .map((heading) => ({
            id: heading.id || slugify(heading.textContent ?? ''),
            text: heading.textContent ?? '',
            level: Number(heading.tagName.replace('H', '')),
        }))
        .filter((item) => item.text);

        setTableOfContents(toc);
    }, [article?.content, contentWithAnchors]);

    useEffect(() => {
        if (!copied) return;

        const timer = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(timer);
    }, [copied]);

    // Highlight code blocks and add language badge + copy button
    useEffect(() => {
        const codeBlocks = document.querySelectorAll('pre code, .ql-syntax');
        codeBlocks.forEach((block) => {
            // Highlight the code
            hljs.highlightElement(block);
            
            // Get the detected or specified language
            const language = block.className.match(/language-(\w+)/)?.[1] || 
                           block.result?.language || 
                           'plaintext';
            
            // Find or create the parent pre element
            const pre = block.closest('pre') || block.parentElement;
            if (!pre || pre.querySelector('.code-header')) return; // Skip if already processed
            
            // Add relative positioning to pre
            pre.style.position = 'relative';
            pre.style.paddingTop = '3rem';
            
            // Create header container
            const header = document.createElement('div');
            header.className = 'code-header';
            header.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem 1rem;
                background: rgba(0, 0, 0, 0.2);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            `;
            
            // Create language badge
            const langBadge = document.createElement('span');
            langBadge.className = 'language-badge';
            langBadge.textContent = language;
            langBadge.style.cssText = `
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
                color: #94a3b8;
                letter-spacing: 0.05em;
            `;
            
            // Create copy button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-code-btn';
            copyBtn.innerHTML = `
                <svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            copyBtn.style.cssText = `
                padding: 0.25rem 0.5rem;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                border-radius: 0.375rem;
                color: #94a3b8;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 0.25rem;
            `;
            
            // Copy button hover effect
            copyBtn.addEventListener('mouseenter', () => {
                copyBtn.style.background = 'rgba(255, 255, 255, 0.2)';
                copyBtn.style.color = '#fff';
            });
            copyBtn.addEventListener('mouseleave', () => {
                copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                copyBtn.style.color = '#94a3b8';
            });
            
            // Copy functionality
            copyBtn.addEventListener('click', () => {
                const code = block.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    const copyIcon = copyBtn.querySelector('.copy-icon');
                    const checkIcon = copyBtn.querySelector('.check-icon');
                    
                    copyIcon.style.display = 'none';
                    checkIcon.style.display = 'block';
                    copyBtn.style.color = '#10b981';
                    
                    setTimeout(() => {
                        copyIcon.style.display = 'block';
                        checkIcon.style.display = 'none';
                        copyBtn.style.color = '#94a3b8';
                    }, 2000);
                });
            });
            
            // Assemble the header
            header.appendChild(langBadge);
            header.appendChild(copyBtn);
            pre.insertBefore(header, pre.firstChild);
        });
    }, [contentWithAnchors]);

    const fullSeriesList = useMemo(() => {
        if (!article?.series) return [];

        const currentEntry = {
        id: article.id,
        title: article.title,
        slug: article.slug,
        series_order: article.series.current_order ?? 0,
        isCurrent: true,
        read_time: article.read_time,
        published_at: article.published_at,
        };

        return [...seriesArticles.map((item) => ({ ...item, isCurrent: false })), currentEntry].sort(
        (a, b) => (a.series_order ?? 0) - (b.series_order ?? 0),
        );
    }, [article, seriesArticles]);

    if (!article) {
        return (
        <WebLayout auth={auth}>
            <div className="mx-auto max-w-3xl px-4 py-20 text-center">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Article not found
            </h1>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
                The article you are looking for might have been removed or is temporarily unavailable.
            </p>
            <Link
                href="/"
                className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
                Back to home
            </Link>
            </div>
        </WebLayout>
        );
    }

    return (
        <WebLayout auth={auth}>
        <Head>
            <title>{article.meta_title || article.title}</title>
            <meta name="description" content={article.meta_description || article.excerpt || ''} />
            <meta property="og:type" content="article" />
            <meta property="og:title" content={article.meta_title || article.title} />
            <meta property="og:description" content={article.meta_description || article.excerpt || ''} />
            <meta property="og:image" content={article.featured_image || '/default-og-image.jpg'} />
            <meta property="og:url" content={currentUrl} />
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={article.meta_title || article.title} />
            <meta property="twitter:description" content={article.meta_description || article.excerpt || ''} />
            <meta property="twitter:image" content={article.featured_image || '/default-og-image.jpg'} />
            {article.published_at && (
            <meta property="article:published_time" content={new Date(article.published_at).toISOString()} />
            )}
            {article.author?.name && <meta property="article:author" content={article.author.name} />}
            {article.category?.name && <meta property="article:section" content={article.category.name} />}
            {article.tags?.map((tag) => (
            <meta key={tag.id} property="article:tag" content={tag.name} />
            ))}
        </Head>


        {/* <article className="bg-slate-50 dark:bg-slate-900/60 text-black dark:text-white">
        </article> */}

        <section className="bg-slate-50 dark:bg-slate-900/60">
            <div className="mx-auto max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid lg:grid-cols-[minmax(0,3fr)_minmax(320px,1fr)] lg:px-8">
                <div>
                    <div className="mx-auto max-w-7xl mb-6">
                        <div className='px-1'>
                            <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm font-bold">
                            <Link href="/" className="hover:text-white dark:hover:text-white">
                                Home
                            </Link>
                            <span>/</span>
                            {article.category?.name ? (
                                <Link
                                href={`/?category=${encodeURIComponent(article.category.name)}`}
                                className="hover:text-white dark:hover:text-white"
                                >
                                {article.category.name}
                                </Link>
                            ) : (
                                <span>Articles</span>
                            )}
                            <span>/</span>
                            <span className="text-slate-900 dark:text-white">{article.title}</span>
                        </nav>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-4 shadow-md rounded-md flex flex-col gap-10">
                            <div>

                            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-300">
                                {article.series ? 'Series Lesson' : 'Article'}
                            </p>
                            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-gray-700 dark:text-gray-50 md:text-3xl lg:text-3xl">
                                {article.title}
                            </h1>
                            {article.excerpt && (
                                <p className="mt-6 max-w-2xl text-base text-gray-600 dark:text-gray-400">
                                {article.excerpt}
                                </p>
                            )}

                            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-3">
                                <img
                                    src={article.author?.avatar}
                                    alt={article.author?.name}
                                    className="h-12 w-12 rounded-full bg-white/10 object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">{article.author?.name}</p>
                                    <p>{article.author?.email}</p>
                                </div>
                                </div>
                                <span className="hidden h-8 w-px bg-white/30 md:block" />
                                <div className="flex flex-col gap-1 text-slate-500 dark:text-slate-40 md:flex-row md:items-center md:gap-4">
                                <span>{formatDate(article.published_at)}</span>
                                <span className="hidden md:inline">•</span>
                                <span>{article.read_time} min read</span>
                                {article.views ? (
                                    <>
                                    <span className="hidden md:inline">•</span>
                                    <span>{article.views} views</span>
                                    </>
                                ) : null}
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>

                    {tableOfContents.length > 0 && (
                    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
                            Outline
                            </p>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Table of contents
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {tableOfContents.length} topics
                            </span>
                            <button
                            type="button"
                            onClick={() => setTocOpen((prev) => !prev)}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                            aria-expanded={tocOpen}
                            >
                            {tocOpen ? 'Hide' : 'Show'}
                            <svg
                                className={`h-3 w-3 transition-transform ${tocOpen ? '' : 'rotate-180'}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.022l3.71-3.79a.75.75 0 111.08 1.04l-4.24 4.33a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                                />
                            </svg>
                            </button>
                        </div>
                        </div>
                        {tocOpen && (
                        <div className="mt-4 space-y-3 text-sm">
                            {tableOfContents.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className="block rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                            >
                                {item.text}
                            </a>
                            ))}
                        </div>
                        )}
                    </div>
                    )}

                    <article className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900">
                    {article.featured_image && (
                        <figure className="mb-10 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/30">
                        <img
                            src={article.featured_image}
                            alt={article.title}
                            className="h-80 w-full object-cover"
                        />
                        </figure>
                    )}
                    <div
                        className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-a:text-sky-600 prose-blockquote:border-sky-500 prose-blockquote:text-slate-900 dark:prose-invert dark:prose-a:text-sky-300"
                        dangerouslySetInnerHTML={{ __html: contentWithAnchors }}
                    />

                    {article.tags?.length > 0 && (
                        <div className="mt-10 flex flex-wrap gap-3">
                        {article.tags.map((tag) => (
                            <Link
                            key={tag.id}
                            href={`/?tag=${encodeURIComponent(tag.name)}`}
                            className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:text-slate-300"
                            >
                            #{tag.name}
                            </Link>
                        ))}
                        </div>
                    )}

                    <div className="mt-12 border-t border-slate-100 pt-8 dark:border-slate-800">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Share
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                        {shareLinks.map((link) => (
                            <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                            >
                            {link.icon}
                            {link.name}
                            </a>
                        ))}
                        <button
                            type="button"
                            onClick={handleCopyLink}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 9h11a2 2 0 012 2v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8a2 2 0 012-2z" strokeWidth="1.5" />
                            <path d="M7 9V7a2 2 0 012-2h8" strokeWidth="1.5" />
                            </svg>
                            {copied ? 'Link copied' : 'Copy link'}
                        </button>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-slate-100 pt-8 dark:border-slate-800">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Author
                        </h3>
                        <div className="mt-4 flex items-center gap-4">
                        <img
                            src={article.author?.avatar}
                            alt={article.author?.name}
                            className="h-16 w-16 rounded-2xl border border-slate-100 object-cover dark:border-slate-700"
                        />
                        <div>
                            <p className="text-lg font-semibold text-slate-900 dark:text-white">
                            {article.author?.name}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                            {article.author?.email}
                            </p>
                        </div>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-slate-100 pt-8 dark:border-slate-800">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Comments</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Start a conversation or ask a question about this tutorial.
                        </p>
                        <div className="mt-6">
                        <DisqusComment
                            article={article}
                            config={
                            disqusConfig || {
                                shortname: import.meta.env.VITE_DISQUS_SHORTNAME || '',
                                url: currentUrl,
                                language: 'en',
                            }
                            }
                        />
                        </div>
                    </div>
                    </article>
                </div>

                <aside className="mt-12 lg:mt-0">
                    <div className="space-y-6 lg:sticky lg:top-10">
                    {article.series && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600">
                                Series
                            </p>
                            <h2 className="mt-1 text-md font-semibold text-slate-900 dark:text-white">
                                {article.series.name}
                            </h2>
                            </div>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {article.series.total_articles} lessons
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {stripTags(article.series.description ?? '')}
                        </p>
                        <div className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            Currently on part {article.series.current_order}
                        </div>
                        <div className="mt-4 space-y-2 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/60 p-2 dark:border-slate-800 dark:bg-slate-900/40">
                            <div className="max-h-[420px] space-y-2 overflow-auto pr-1">
                            {fullSeriesList.map((item) => (
                                <Link
                                key={`${item.slug}-${item.series_order}`}
                                href={`/article/${item.slug}`}
                                aria-current={item.isCurrent ? 'page' : undefined}
                                className={`flex items-center gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                                    item.isCurrent
                                    ? 'pointer-events-none border-sky-200 bg-white text-slate-900 shadow-sm dark:border-sky-800/50 dark:bg-slate-900/80'
                                    : 'border-slate-200 bg-white/70 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700'
                                }`}
                                >
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white shadow-sm dark:bg-slate-800">
                                    {item.series_order}
                                </span>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-800 dark:text-white">{item.title}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {item.isCurrent ? 'You are here' : `${item.read_time} min read`}
                                    </p>
                                </div>
                                </Link>
                            ))}
                            </div>
                        </div>
                        </div>
                    )}

                    {relatedArticles.length > 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center justify-between">
                            <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                Related
                            </p>
                            <h2 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                                Keep reading
                            </h2>
                            </div>
                            <span className="text-xs text-slate-400">{relatedArticles.length} picks</span>
                        </div>
                        <div className="mt-4 divide-y divide-slate-100">
                            {relatedArticles.slice(0, 5).map((related) => (
                            <Link
                                key={related.id}
                                href={`/article/${related.slug}`}
                                className="group flex gap-3 py-4 transition hover:opacity-90"
                            >
                                {related.featured_image ? (
                                <img
                                    src={related.featured_image}
                                    alt={related.title}
                                    className="h-16 w-16 rounded-xl object-cover"
                                />
                                ) : (
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-500">
                                    {related.category?.name || 'Article'}
                                </div>
                                )}
                                <div>
                                <p className="text-sm font-semibold text-slate-900 transition group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-300">
                                    {related.title}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {formatDate(related.published_at)} · {related.read_time} min read
                                </p>
                                </div>
                            </Link>
                            ))}
                        </div>
                        </div>
                    )}
                    </div>
                </aside>
            </div>
        </section>
        </WebLayout>
    );
};

export default ArticleDetail;
