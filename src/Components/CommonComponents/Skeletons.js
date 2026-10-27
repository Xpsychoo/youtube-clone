import React from 'react';

export const VideoCardSkeleton = ({ variant = 'grid' }) => (
  <div className={`video-card video-card--${variant}`} aria-hidden="true">
    <div className="video-card__thumb skeleton" />
    <div className="video-card__body">
      {variant === 'grid' && <div className="skeleton skeleton--circle" style={{ width: 36, height: 36 }} />}
      <div className="video-card__text">
        <div className="skeleton skeleton--line" style={{ width: '92%' }} />
        <div className="skeleton skeleton--line" style={{ width: '64%' }} />
        {variant !== 'compact' && <div className="skeleton skeleton--line" style={{ width: '40%' }} />}
      </div>
    </div>
  </div>
);

export const VideoListSkeleton = ({ count = 8, variant = 'grid' }) =>
  Array.from({ length: count }, (_, i) => <VideoCardSkeleton key={i} variant={variant} />);

export const CommentSkeleton = ({ count = 4 }) =>
  Array.from({ length: count }, (_, i) => (
    <div className="comment" key={i} aria-hidden="true">
      <div className="skeleton skeleton--circle" style={{ width: 40, height: 40 }} />
      <div className="comment__body">
        <div className="skeleton skeleton--line" style={{ width: 160 }} />
        <div className="skeleton skeleton--line" style={{ width: '85%' }} />
        <div className="skeleton skeleton--line" style={{ width: '55%' }} />
      </div>
    </div>
  ));

export const LinesSkeleton = ({ widths = ['70%', '45%'] }) => (
  <div aria-hidden="true" style={{ padding: '16px 0' }}>
    {widths.map((width, i) => (
      <div key={i} className="skeleton skeleton--line" style={{ width, height: i === 0 ? 24 : 14 }} />
    ))}
  </div>
);
