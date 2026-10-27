import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';

import './PlaylistPage.scss';
import Videocard, { ChannelName } from '../CommonComponents/Videocard';
import { LinesSkeleton, VideoListSkeleton } from '../CommonComponents/Skeletons';
import { EmptyState, ErrorState, LoadMore } from '../CommonComponents/StateViews';
import { formatCount, pickImage } from '../../Utils/AppConstants';
import { useApi, useDocumentTitle, usePaginatedApi } from '../../Utils/hooks';

const PlaylistPage = () => {
  const { id } = useParams();
  const { data: playlist, loading, error, retry } = useApi(`playlist/details/?id=${id}`);
  const videos = usePaginatedApi(`playlist/videos/?id=${id}`);
  useDocumentTitle(playlist?.title);

  const entries = videos.items.filter((item) => item?.video?.videoId);
  const firstVideo = entries[0]?.video;
  const cover = pickImage(playlist?.thumbnails)
    || (firstVideo && `https://i.ytimg.com/vi/${firstVideo.videoId}/hqdefault.jpg`);
  const stats = playlist?.stats || {};
  const meta = [
    stats.videos != null && `${formatCount(stats.videos)} videos`,
    stats.views != null && `${formatCount(stats.views)} views`,
  ].filter(Boolean).join(' • ');

  return (
    <div className="playlist-page">
      <aside className="playlist-hero" style={{ '--cover': cover ? `url("${cover}")` : 'none' }}>
        {cover ? (
          <img className="playlist-hero__cover" src={cover} alt="" />
        ) : (
          <div className="playlist-hero__cover skeleton" />
        )}
        {loading && <LinesSkeleton widths={['80%', '50%']} />}
        {error && <ErrorState error={error} onRetry={retry} compact />}
        {playlist && (
          <>
            <h1>{playlist.title}</h1>
            <ChannelName author={playlist.author} />
            {meta && <div className="playlist-hero__meta">{meta}</div>}
          </>
        )}
        {firstVideo && (
          <Link to={`/video/${firstVideo.videoId}`} className="play-all-btn">
            <FaPlay /> Play all
          </Link>
        )}
        {playlist?.description && <p className="playlist-hero__desc">{playlist.description}</p>}
      </aside>

      <section className="playlist-videos">
        {entries.map((item, ind) => (
          <Videocard
            key={`${item.video.videoId}-${ind}`}
            data={item}
            variant="compact"
            index={item.index ?? ind + 1}
          />
        ))}
        {videos.loading && <VideoListSkeleton count={entries.length ? 3 : 8} variant="compact" />}
        {videos.error && !entries.length && <ErrorState error={videos.error} onRetry={videos.retry} />}
        {!videos.loading && !videos.error && !entries.length && (
          <EmptyState title="This playlist is empty" />
        )}
        {entries.length > 0 && (
          <LoadMore
            hasMore={videos.hasMore}
            loading={videos.loading}
            error={videos.error}
            onLoadMore={videos.loadMore}
            onRetry={videos.retry}
          />
        )}
      </section>
    </div>
  );
};

export default PlaylistPage;
