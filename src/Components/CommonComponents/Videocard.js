import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Styles
import './Videocard.scss';
import { toggleSidebarAction } from '../../store/Reducers/HomeFiles/HomeFilesAction';
import { useDispatch } from 'react-redux';

const Videocard = ({ data, width }) => {
  const dispatch = useDispatch();

  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleVideoClick = (data) => {
    const video = data?.video;
    if (video && video?.videoId) {
      navigate(`/video/${video.videoId}`);
      dispatch(toggleSidebarAction(false)); 
    } else {
      console.error("Video or videoId is not defined");
    }
  };

  return (
    <div
      className={`col-md-${width} p-0`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className='card-wrapper' onClick={() => handleVideoClick(data)}>
        <div className="imgbox">
          <img
            src={isHovered ? data?.video?.movingThumbnails?.[0]?.url || data?.video?.thumbnails?.[0]?.url : data?.video?.thumbnails?.[0]?.url}
            alt={data?.video?.title}
            className='thumbnail'
          />
        </div>
        <div className='video-info'>
          <h3 className='video-title' title={data?.video?.title}>{data?.video?.title.substring(0, 50)}...</h3>
          <p className='channel-name'>{data?.video?.author?.title}</p>
          <p className='video-stats'>
            {data?.video?.stats?.views && <span>{data?.video?.stats?.views}  views • </span>}
            {data?.video?.publishedTimeText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Videocard;
