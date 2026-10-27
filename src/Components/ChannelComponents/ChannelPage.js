import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MdVerified } from 'react-icons/md';
import { FiCalendar, FiEye, FiGlobe, FiLink, FiUsers, FiVideo } from 'react-icons/fi';

import './ChannelPage.scss';
import Avatar from '../CommonComponents/Avatar';
import SubscribeButton from '../CommonComponents/SubscribeButton';
import Videocard from '../CommonComponents/Videocard';
import { LinesSkeleton, VideoListSkeleton } from '../CommonComponents/Skeletons';
import { EmptyState, ErrorState, LoadMore } from '../CommonComponents/StateViews';
import { Linkified } from '../VideoPlayer/VideoInfo';
import { formatCount, formatDate, formatNumber, isVerified, pickImage } from '../../Utils/AppConstants';
import { useApi, useDocumentTitle, usePaginatedApi } from '../../Utils/hooks';

const ChannelAbout = ({ channel }) => {
  const stats = channel.stats || {};
  const joined = channel.joinedDateText || (channel.joinedDate && `Joined ${formatDate(channel.joinedDate)}`);
  const links = (channel.links || []).filter((link) => link?.targetUrl || link?.url);

  return (
    <div className="channel-about">
      {channel.description && (
        <section>
          <h3>Description</h3>
          <p><Linkified text={channel.description} /></p>
        </section>
      )}
      {links.length > 0 && (
        <section>
          <h3>Links</h3>
          <ul className="channel-about__list">
            {links.map((link, i) => (
              <li key={i}>
                <FiLink />
                <a href={link.targetUrl || link.url} target="_blank" rel="noreferrer">
                  {link.title || link.targetUrl || link.url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section>
        <h3>Channel details</h3>
        <ul className="channel-about__list">
          {stats.subscribers != null && <li><FiUsers /> {formatNumber(stats.subscribers)} subscribers</li>}
          {stats.videos != null && <li><FiVideo /> {formatNumber(stats.videos)} videos</li>}
          {stats.views != null && <li><FiEye /> {formatNumber(stats.views)} views</li>}
          {joined && <li><FiCalendar /> {joined}</li>}
          {channel.country && <li><FiGlobe /> {channel.country}</li>}
        </ul>
      </section>
    </div>
  );
};

const ChannelPage = () => {
  const { id } = useParams();
  const [tab, setTab] = useState('videos');
  const { data: channel, loading, error, retry } = useApi(`channel/details/?id=${id}`);
  const videos = usePaginatedApi(tab === 'videos' ? `channel/videos/?id=${id}` : null);
  useDocumentTitle(channel?.title);

  useEffect(() => {
    setTab('videos');
  }, [id]);

  const banner = pickImage(channel?.banner?.desktop) || pickImage(channel?.banner);
  const stats = channel?.stats || {};
  const subscribers = stats.subscribersText
    || (stats.subscribers != null ? `${formatCount(stats.subscribers)} subscribers` : '');
  const videoCount = stats.videos != null ? `${formatCount(stats.videos)} videos` : '';
  const meta = [channel?.username, subscribers, videoCount].filter(Boolean).join(' • ');
  const channelVideos = videos.items.filter((item) => item?.type === 'video' && item.video?.videoId);

  if (error) return <ErrorState error={error} onRetry={retry} />;

  return (
    <div className="channel-page">
      {banner && (
        <div className="channel-banner">
          <img src={banner} alt="" referrerPolicy="no-referrer" />
        </div>
      )}

      {loading && <LinesSkeleton widths={['40%', '25%', '60%']} />}

      {channel && (
        <header className="channel-header">
          <Avatar src={pickImage(channel.avatar)} name={channel.title} size={160} />
          <div className="channel-header__info">
            <h1>
              {channel.title}
              {isVerified(channel.badges) && <MdVerified className="verified-icon" />}
            </h1>
            {meta && <div className="channel-header__meta">{meta}</div>}
            {channel.description && (
              <button className="channel-header__desc" onClick={() => setTab('about')}>
                {channel.description}
              </button>
            )}
            <SubscribeButton channelId={channel.channelId || id} />
          </div>
        </header>
      )}

      <nav className="channel-tabs" role="tablist">
        {['videos', 'about'].map((name) => (
          <button
            key={name}
            role="tab"
            aria-selected={tab === name}
            className={tab === name ? 'is-active' : ''}
            onClick={() => setTab(name)}
          >
            {name === 'videos' ? 'Videos' : 'About'}
          </button>
        ))}
      </nav>

      {tab === 'about' ? (
        channel && <ChannelAbout channel={channel} />
      ) : (
        <>
          {videos.error && !channelVideos.length ? (
            <ErrorState error={videos.error} onRetry={videos.retry} />
          ) : (
            <div className="video-grid">
              {channelVideos.map((item, ind) => (
                <Videocard key={`${item.video.videoId}-${ind}`} data={item} />
              ))}
              {videos.loading && <VideoListSkeleton count={channelVideos.length ? 4 : 8} />}
            </div>
          )}
          {!videos.loading && !videos.error && !channelVideos.length && (
            <EmptyState title="No videos" message="This channel hasn't uploaded any videos yet." />
          )}
          {channelVideos.length > 0 && (
            <LoadMore
              hasMore={videos.hasMore}
              loading={videos.loading}
              error={videos.error}
              onLoadMore={videos.loadMore}
              onRetry={videos.retry}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ChannelPage;
