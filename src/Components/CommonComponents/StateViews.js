import React, { useEffect, useRef } from 'react';
import { MdErrorOutline, MdOutlineVideoLibrary } from 'react-icons/md';

const errorMessage = (error) => {
  const status = error?.response?.status;
  if (status === 429 && /quota/i.test(error?.response?.data?.message || '')) {
    return 'The monthly RapidAPI quota for the YouTube API is used up. Upgrade the plan or wait for it to reset.';
  }
  if (status === 429) return "We're sending too many requests to the YouTube API. Give it a few seconds and try again.";
  if (status === 403) return 'The YouTube API key was rejected. Check that your RapidAPI subscription is active.';
  return error?.response?.data?.error || error?.response?.data?.message || 'Something went wrong while loading this.';
};

export const ErrorState = ({ error, onRetry, compact = false }) => (
  <div className={`state-view ${compact ? 'state-view--compact' : ''}`}>
    {!compact && <MdErrorOutline />}
    <h3>Couldn't load this</h3>
    <p>{errorMessage(error)}</p>
    {onRetry && <button className="pill-btn" onClick={onRetry}>Try again</button>}
  </div>
);

export const EmptyState = ({ title, message, icon = <MdOutlineVideoLibrary /> }) => (
  <div className="state-view">
    {icon}
    <h3>{title}</h3>
    {message && <p>{message}</p>}
  </div>
);

// Loads the next page when scrolled into view (auto), or shows a "Show more" button.
export const LoadMore = ({ hasMore, loading, error, onLoadMore, onRetry, auto = true }) => {
  const ref = useRef(null);
  const canLoad = hasMore && !loading && !error;

  useEffect(() => {
    if (!auto || !canLoad || !ref.current) return undefined;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && onLoadMore(), {
      rootMargin: '600px',
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [auto, canLoad, onLoadMore]);

  if (error) return <ErrorState error={error} onRetry={onRetry} compact />;
  if (!hasMore && !loading) return null;

  return (
    <div ref={ref} className="load-more">
      {loading && <span className="spinner" />}
      {!loading && !auto && <button className="pill-btn" onClick={onLoadMore}>Show more</button>}
    </div>
  );
};
