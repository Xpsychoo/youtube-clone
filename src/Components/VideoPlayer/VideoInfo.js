import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from 'react-icons/ai';
import { RiShareForwardLine } from 'react-icons/ri';
import { FiExternalLink } from 'react-icons/fi';

import Avatar from '../CommonComponents/Avatar';
import SubscribeButton from '../CommonComponents/SubscribeButton';
import { ChannelName } from '../CommonComponents/Videocard';
import { formatCount, formatDate, formatNumber, pickImage, timeAgo } from '../../Utils/AppConstants';

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

// Turns URLs in plain text into clickable links.
export const Linkified = ({ text = '' }) =>
  text.split(URL_PATTERN).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
        {part}
      </a>
    ) : (
      part
    )
  );

const VideoInfo = ({ video }) => {
  const [reaction, setReaction] = useState(null); // 'like' | 'dislike' | null
  const [expanded, setExpanded] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    setReaction(null);
    setExpanded(false);
  }, [video.videoId]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const author = video.author || {};
  const stats = video.stats || {};
  const published = video.publishedDate || video.publishedDateTime;
  const likes = (Number(stats.likes) || 0) + (reaction === 'like' ? 1 : 0);
  const subscribers = author.stats?.subscribersText
    || (author.stats?.subscribers != null ? `${formatCount(author.stats.subscribers)} subscribers` : '');
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.videoId}`;

  const toggleReaction = (type) => setReaction((current) => (current === type ? null : type));

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: video.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setToast('Link copied to clipboard');
      }
    } catch (e) {
      // The user closed the share sheet; nothing to do.
    }
  };

  return (
    <div className="video-info">
      <h1 className="watch-title">{video.title}</h1>

      <div className="watch-row">
        <div className="watch-channel">
          {author.channelId ? (
            <Link to={`/channel/${author.channelId}`}>
              <Avatar src={pickImage(author.avatar)} name={author.title} size={40} />
            </Link>
          ) : (
            <Avatar src={pickImage(author.avatar)} name={author.title} size={40} />
          )}
          <div className="watch-channel__text">
            <ChannelName author={author} />
            {subscribers && <span className="watch-channel__subs">{subscribers}</span>}
          </div>
          <SubscribeButton channelId={author.channelId} />
        </div>

        <div className="watch-actions">
          <div className="segmented">
            <button
              className={reaction === 'like' ? 'is-active' : ''}
              onClick={() => toggleReaction('like')}
              aria-pressed={reaction === 'like'}
              aria-label="Like"
            >
              {reaction === 'like' ? <AiFillLike /> : <AiOutlineLike />}
              {likes > 0 && <span>{formatCount(likes)}</span>}
            </button>
            <button
              className={reaction === 'dislike' ? 'is-active' : ''}
              onClick={() => toggleReaction('dislike')}
              aria-pressed={reaction === 'dislike'}
              aria-label="Dislike"
            >
              {reaction === 'dislike' ? <AiFillDislike /> : <AiOutlineDislike />}
            </button>
          </div>
          <button className="pill-btn" onClick={share}>
            <RiShareForwardLine /> Share
          </button>
          <a className="pill-btn" href={youtubeUrl} target="_blank" rel="noreferrer">
            <FiExternalLink /> YouTube
          </a>
        </div>
      </div>

      <div
        className={`description-box ${expanded ? 'is-expanded' : ''}`}
        onClick={() => !expanded && setExpanded(true)}
      >
        <div className="description-box__meta">
          {stats.views != null && (
            <span>{expanded ? formatNumber(stats.views) : formatCount(stats.views)} views</span>
          )}
          {published && <span>{expanded ? formatDate(published) : timeAgo(published)}</span>}
          {video.keywords?.slice(0, 3).map((keyword) => (
            <span key={keyword} className="description-box__tag">#{keyword.replace(/\s+/g, '')}</span>
          ))}
        </div>
        {video.description && (
          <div className="description-box__text">
            <Linkified text={video.description} />
          </div>
        )}
        <button
          className="text-btn"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? 'Show less' : '...more'}
        </button>
      </div>

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
};

export default VideoInfo;
