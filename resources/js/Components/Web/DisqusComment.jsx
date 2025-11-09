import { DiscussionEmbed, CommentCount } from 'disqus-react';
import { useState, useEffect } from 'react';

const DisqusComment = ({ article, config }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [trackingBlocked, setTrackingBlocked] = useState(false);

  // Clean shortname (remove quotes if present)
  const shortname = config?.shortname?.replace(/['"]/g, '').trim();

  // Validate configuration
  if (!config || !shortname || shortname === 'your-disqus-shortname' || shortname === '') {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 mb-4">
          <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">
          Disqus Not Configured
        </h3>
        <p className="text-amber-700 dark:text-amber-300 max-w-md mx-auto mb-4">
          To enable comments, please configure your Disqus shortname in the .env file.
        </p>
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Set <code className="px-2 py-1 bg-amber-100 dark:bg-amber-900/40 rounded">VITE_DISQUS_SHORTNAME</code> in your .env file
        </p>
      </div>
    );
  }

  // Validate article
  if (!article || !article.id) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
        <p className="text-red-700 dark:text-red-300">
          Unable to load comments: Article information is missing
        </p>
      </div>
    );
  }

  // Load comments only when component is in viewport (performance optimization)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    const commentSection = document.getElementById('disqus-comment-section');
    if (commentSection) {
      observer.observe(commentSection);
    }

    return () => observer.disconnect();
  }, []);

  // Detect tracking prevention and show helpful message
  useEffect(() => {
    if (shouldLoad) {
      // Reset DISQUS to ensure clean load
      if (typeof window !== 'undefined' && window.DISQUS) {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.url = window.location.href;
            this.page.identifier = `article-${article.id}`;
            this.page.title = article.title || 'Article';
          }
        });
      }

      // Check for tracking prevention after a delay
      const timer = setTimeout(() => {
        const disqusFrame = document.querySelector('#disqus_thread iframe');
        const disqusThread = document.querySelector('#disqus_thread');
        
        // Check if Disqus failed to load
        if (disqusThread && !disqusFrame) {
          const errorMessage = disqusThread.textContent;
          if (errorMessage.includes('unable to load') || errorMessage.includes('taking longer')) {
            setTrackingBlocked(true);
          }
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [shouldLoad, article.id, article.title]);

  // Disqus configuration object
  const disqusConfig = {
    url: typeof window !== 'undefined' ? window.location.href : `${config.url}${window.location.pathname}`,
    identifier: `article-${article.id}`,
    title: article.title || 'Article',
    language: config.language || 'en',
    // Force Disqus to load even on localhost/development
    api: {
      onReady: function() {
        console.log('Disqus loaded successfully');
      },
      onError: function(error) {
        console.error('Disqus error:', error);
        setTrackingBlocked(true);
      }
    }
  };

  return (
    <div id="disqus-comment-section" className="scroll-mt-8">
      {/* Loading state */}
      {!shouldLoad && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
            <svg className="w-4 h-4 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Scroll down to load comments...</p>
        </div>
      )}

      {/* Tracking Prevention Warning */}
      {trackingBlocked && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-8 mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 mb-4">
            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">
            Comments Temporarily Unavailable
          </h3>
          <p className="text-amber-700 dark:text-amber-300 mb-4">
            {window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
              ? 'Disqus comments are not available on localhost. They will work in production.'
              : 'Unable to load comments. This may be due to browser tracking prevention or network issues.'}
          </p>
          {window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && (
            <div className="text-sm text-amber-600 dark:text-amber-400 space-y-2">
              <p className="font-medium">Possible solutions:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Refresh the page</li>
                <li>Check if your domain is configured in Disqus admin</li>
                <li>Disable tracking prevention for this site</li>
                <li>Allow third-party cookies in browser settings</li>
                <li>Try a different browser</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Disqus Discussion Embed */}
      {shouldLoad && (
        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 p-4">
          <DiscussionEmbed
            shortname={shortname}
            config={disqusConfig}
          />
        </div>
      )}
    </div>
  );
};

export default DisqusComment;