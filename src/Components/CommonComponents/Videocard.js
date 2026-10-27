import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdVerified } from 'react-icons/md';

// Styles
import './Videocard.scss';
import Avatar from './Avatar';
import { formatCount, formatDuration, isVerified, pickImage } from '../../Utils/AppConstants';

export const ChannelName = ({ author, withAvatar = false }) => {
  if (!author?.title) return null;

  const content = (
    <>
      {withAvatar && <Avatar src={pickImage(author.avatar)} name={author.title} size={24} />}
      <span>{author.title}</span>
      {isVerified(author.badges) && <MdVerified className="verified-icon" title="Verified" />}
    </>
  );

  return author.channelId ? (
    <Link to={`/channel/${author.channelId}`} className="channel-name">{content}</Link>
  ) : (
    <span className="channel-name">{content}</span>
  );
};

const videoMeta = (video) => {
  const { stats = {} } = video;
  const views = stats.views != null
    ? `${formatCount(stats.views)} views`
    : stats.viewers != null ? `${formatCount(stats.viewers)} watching` : '';
  return [views, video.publishedTimeText].filter(Boolean).join(' • ');
};

// variant: 'grid' (home, channel), 'list' (search results), 'compact' (related, playlist)
const Videocard = ({ data, variant = 'grid', index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);

  const video = data?.video;
  if (!video?.videoId) return null;

  const href = `/video/${video.videoId}`;
  const fallbackThumb = `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
  const thumb = (!thumbFailed && pickImage(video.thumbnails)) || fallbackThumb;
  const preview = isHovered && !previewFailed && variant !== 'compact' ? pickImage(video.movingThumbnails) : null;
  const duration = formatDuration(video.lengthSeconds);
  const meta = videoMeta(video);
  const author = video.author;

  return (
    <article
      className={`video-card video-card--${variant}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {index != null && <span className="video-card__index">{index}</span>}

      <Link to={href} className="video-card__thumb" aria-label={video.title}>
        <img
          src={preview || thumb}
          alt=""
          loading="lazy"
          onError={() => (preview ? setPreviewFailed(true) : setThumbFailed(true))}
        />
        {video.isLiveNow ? (
          <span className="badge badge--live">● LIVE</span>
        ) : (
          duration && <span className="badge">{duration}</span>
        )}
      </Link>

      <div className="video-card__body">
        {variant === 'grid' && author?.title && (
          author.channelId ? (
            <Link to={`/channel/${author.channelId}`} className="video-card__avatar">
              <Avatar src={pickImage(author.avatar)} name={author.title} size={36} />
            </Link>
          ) : (
            <Avatar src={pickImage(author.avatar)} name={author.title} size={36} />
          )
        )}

        <div className="video-card__text">
          <Link to={href} className="video-card__title" title={video.title}>{video.title}</Link>
          {variant === 'list' ? (
            <>
              {meta && <div className="video-card__meta">{meta}</div>}
              <ChannelName author={author} withAvatar />
              {video.descriptionSnippet && <p className="video-card__snippet">{video.descriptionSnippet}</p>}
            </>
          ) : (
            <>
              <ChannelName author={author} />
              {meta && <div className="video-card__meta">{meta}</div>}
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default Videocard;
