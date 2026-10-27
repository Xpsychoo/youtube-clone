import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import './HomePage.scss'
import Videocard from '../CommonComponents/Videocard'
import { VideoListSkeleton } from '../CommonComponents/Skeletons'
import { EmptyState, ErrorState, LoadMore } from '../CommonComponents/StateViews'
import { categories } from '../../Utils/Constant'
import { setSelectedCategory } from '../../store/Reducers/HomeFiles/HomeFilesAction'
import { useDocumentTitle, usePaginatedApi } from '../../Utils/hooks'

const chipCategories = categories.filter((item) => item.type !== 'menu');

const CategoryChips = ({ selected }) => {
  const dispatch = useDispatch();
  return (
    <div className="category-chips" role="tablist">
      {chipCategories.map((item) => (
        <button
          key={item.name}
          role="tab"
          aria-selected={selected === item.name}
          className={`chip ${selected === item.name ? 'is-active' : ''}`}
          onClick={() => dispatch(setSelectedCategory(item.name))}
        >
          {item.name === 'New' ? 'All' : item.name}
        </button>
      ))}
    </div>
  );
};

const HomePage = () => {
  const selectedCategory = useSelector((state) => state.HomeFilesReducer.selectedCategory);
  const { items, loading, error, hasMore, loadMore, retry } = usePaginatedApi(
    `search/?q=${encodeURIComponent(selectedCategory)}`
  );
  useDocumentTitle(selectedCategory === 'New' ? 'Home' : selectedCategory);

  const videos = items.filter((item) => item?.type === 'video' && item.video?.videoId);

  return (
    <div className="home-page">
      <CategoryChips selected={selectedCategory} />

      {error && !videos.length ? (
        <ErrorState error={error} onRetry={retry} />
      ) : (
        <div className="video-grid">
          {videos.map((item, ind) => (
            <Videocard key={`${item.video.videoId}-${ind}`} data={item} />
          ))}
          {loading && <VideoListSkeleton count={videos.length ? 4 : 12} />}
        </div>
      )}

      {!loading && !error && !videos.length && (
        <EmptyState title="No videos here yet" message="Try another category." />
      )}

      {videos.length > 0 && (
        <LoadMore hasMore={hasMore} loading={loading} error={error} onLoadMore={loadMore} onRetry={retry} />
      )}
    </div>
  )
}

export default HomePage
