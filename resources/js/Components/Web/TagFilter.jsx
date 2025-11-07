const TagFilter = ({ tags = [], activeTag, onSelect }) => {
  if (!tags.length) return null;

  const handleClick = (tag) => {
    onSelect?.(tag);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isActive = activeTag?.toLowerCase() === tag.toLowerCase();
        const baseClasses =
          'tag-chip rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500';
        const activeClasses = isActive ? 'ring-2 ring-sky-500 bg-sky-50' : '';

        return (
          <button
            key={tag}
            type="button"
            aria-pressed={isActive}
            className={`${baseClasses} ${activeClasses}`.trim()}
            onClick={() => handleClick(tag)}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
};

export default TagFilter;
