import React from 'react';
import { Link } from 'react-router-dom';
import { MdPlaylistPlay, MdVerified } from 'react-icons/md';
import { FaPlay } from 'react-icons/fa';

import Avatar from '../CommonComponents/Avatar';
import SubscribeButton from '../CommonComponents/SubscribeButton';
import { ChannelName } from '../CommonComponents/Videocard';
import { formatCount, formatDuration, isVerified, pickImage } from '../../Utils/AppConstants';

export const ChannelResult = ({ channel }) => {
  const href = `/channel/${channel.channelId}`;
  const { stats = {} } = channel;
  const subscribers = stats.subscribersText
    || (stats.subscribers != null ? `${formatCount(stats.subscribers)} subscribers` : '');
  const meta = [channel.username, subscribers].filter(Boolean).join(' • ');

  return (
    <article className="channel-result">
      <Link to={href} className="channel-result__avatar">
        <Avatar src={pickImage(channel.avatar)} name={channel.title} size={136} />
      </Link>
      <div className="channel-result__info">
        <Link to={href} className="channel-result__title">
          {channel.title}
          {isVerified(channel.badges) && <MdVerified className="verified-icon" />}
        </Link>
        {meta && <div className="channel-result__meta">{meta}</div>}
        {channel.descriptionSnippet && <p className="channel-result__desc">{channel.descriptionSnippet}</p>}
      </div>
      <SubscribeButton channelId={channel.channelId} />
    </article>
  );
};

export const PlaylistResult = ({ playlist }) => {
  const href = `/playlist/${playlist.playlistId}`;
  const firstVideo = playlist.videos?.[0];
  const thumb = pickImage(playlist.thumbnails)
    || (firstVideo?.videoId && `https://i.ytimg.com/vi/${firstVideo.videoId}/hqdefault.jpg`);

  return (
    <article className="video-card video-card--list playlist-result">
      <Link to={href} className="video-card__thumb playlist-result__thumb" aria-label={playlist.title}>
        {thumb && <img src={thumb} alt="" loading="lazy" />}
        <span className="playlist-result__play"><FaPlay /> Play all</span>
        <span className="badge"><MdPlaylistPlay /> {playlist.stats?.videos ?? ''} videos</span>
      </Link>
      <div className="video-card__body">
        <div className="video-card__text">
          <Link to={href} className="video-card__title">{playlist.title}</Link>
          <ChannelName author={playlist.author} />
          {playlist.videos?.length > 0 && (
            <ul className="playlist-result__videos">
              {playlist.videos.slice(0, 2).map((video) => (
                <li key={video.videoId}>
                  <Link to={`/video/${video.videoId}`}>{video.title}</Link>
                  {video.lengthSeconds ? <span> · {formatDuration(video.lengthSeconds)}</span> : null}
                </li>
              ))}
            </ul>
          )}
          <Link to={href} className="playlist-result__link">View full playlist</Link>
        </div>
      </div>
    </article>
  );
};
