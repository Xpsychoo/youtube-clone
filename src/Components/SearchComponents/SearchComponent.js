import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { MdSearchOff } from 'react-icons/md'

import './SearchComponent.scss'
import Videocard from '../CommonComponents/Videocard'
import { ChannelResult, PlaylistResult } from './SearchResults'
import { VideoListSkeleton } from '../CommonComponents/Skeletons'
import { EmptyState, ErrorState, LoadMore } from '../CommonComponents/StateViews'
import { formatNumber } from '../../Utils/AppConstants'
import { useDocumentTitle, usePaginatedApi } from '../../Utils/hooks'

const renderResult = (item, ind) => {
  if (item?.type === 'video' && item.video?.videoId) {
    return <Videocard key={`v-${item.video.videoId}-${ind}`} data={item} variant="list" />;
  }
  if (item?.type === 'channel' && item.channel?.channelId) {
    return <ChannelResult key={`c-${item.channel.channelId}-${ind}`} channel={item.channel} />;
  }
  if (item?.type === 'playlist' && item.playlist?.playlistId) {
    return <PlaylistResult key={`p-${item.playlist.playlistId}-${ind}`} playlist={item.playlist} />;
  }
  return null;
};

const SearchComponent = () => {
  const { searchQuery } = useParams();
  const { items, meta, loading, error, hasMore, loadMore, retry } = usePaginatedApi(
    `search/?q=${encodeURIComponent(searchQuery)}`
  );
  useDocumentTitle(searchQuery);

  const results = items.map(renderResult).filter(Boolean);
  const didYouMean = typeof meta?.didYouMean === 'string' ? meta.didYouMean : null;

  return (
    <div className="search-page">
      {meta?.estimatedResults > 0 && (
        <p className="search-page__count">About {formatNumber(meta.estimatedResults)} results</p>
      )}
      {didYouMean && (
        <p className="search-page__dym">
          Did you mean <Link to={`/search/${encodeURIComponent(didYouMean)}`}>{didYouMean}</Link>?
        </p>
      )}

      {error && !results.length ? (
        <ErrorState error={error} onRetry={retry} />
      ) : (
        <div className="search-page__results">
          {results}
          {loading && <VideoListSkeleton count={results.length ? 2 : 6} variant="list" />}
        </div>
      )}

      {!loading && !error && !results.length && (
        <EmptyState
          icon={<MdSearchOff />}
          title="No results found"
          message="Try different keywords or check the spelling."
        />
      )}

      {results.length > 0 && (
        <LoadMore hasMore={hasMore} loading={loading} error={error} onLoadMore={loadMore} onRetry={retry} />
      )}
    </div>
  )
}

export default SearchComponent
