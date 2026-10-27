import React from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';

// Styles
import './VideoPlayer.scss';
import VideoInfo from './VideoInfo';
import Comments from './Comments';
import Videocard from '../CommonComponents/Videocard';
import { LinesSkeleton, VideoListSkeleton } from '../CommonComponents/Skeletons';
import { ErrorState, LoadMore } from '../CommonComponents/StateViews';
import { useApi, useDocumentTitle, usePaginatedApi } from '../../Utils/hooks';

const VideoPlayer = () => {
  const { id } = useParams();
  const { data: video, loading, error, retry } = useApi(`video/details/?id=${id}`);
  const related = usePaginatedApi(`video/related-contents/?id=${id}`);
  useDocumentTitle(video?.title);

  const relatedVideos = related.items.filter((item) => item?.type === 'video' && item.video?.videoId);

  return (
    <div className="watch-page">
      <div className="watch-page__primary">
        <div className="watch-player">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${id}`}
            controls
            playing
            width="100%"
            height="100%"
          />
        </div>
        {loading && <LinesSkeleton widths={['80%', '35%', '100%']} />}
        {error && <ErrorState error={error} onRetry={retry} compact />}
        {video && <VideoInfo video={video} />}
      </div>

      <aside className="watch-page__secondary">
        {relatedVideos.map((item, ind) => (
          <Videocard key={`${item.video.videoId}-${ind}`} data={item} variant="compact" />
        ))}
        {related.loading && <VideoListSkeleton count={relatedVideos.length ? 3 : 10} variant="compact" />}
        {related.error && !relatedVideos.length ? (
          <ErrorState error={related.error} onRetry={related.retry} compact />
        ) : (
          relatedVideos.length > 0 && (
            <LoadMore
              auto={false}
              hasMore={related.hasMore}
              loading={related.loading}
              error={related.error}
              onLoadMore={related.loadMore}
              onRetry={related.retry}
            />
          )
        )}
      </aside>

      <section className="watch-page__comments">
        <Comments videoId={id} total={video?.stats?.comments} />
      </section>
    </div>
  );
};

export default VideoPlayer;
