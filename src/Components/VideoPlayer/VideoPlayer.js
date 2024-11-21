/* import React, { useEffect, useState } from 'react' */
import { useParams } from 'react-router-dom';
import { getDataFromApi } from '../../Utils/api';

//Styles
import './VideoPlayer.scss';
import ReactPlayer from 'react-player';
import Videocard from '../CommonComponents/Videocard';
import { setSelectedVideoAction } from '../../store/Reducers/HomeFiles/HomeFilesAction';
import { useDispatch, useSelector } from 'react-redux';
import { getTimeSinceUpload } from '../../Utils/AppConstants';
import Sidebar from '../CommonComponents/Sidebar';

const VideoPlayer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  /*   const [video, setVideo] = useState();
    const [relatedVideos, setRelatedVideos] = useState();
   */
  const searchresults = useSelector((state) => state.HomeFilesReducer.searchresults);
  const selectedVideo = useSelector((state) => state.HomeFilesReducer.selectedVideo);
  const isSidebar = useSelector((state) => state.HomeFilesReducer.isSidebar);


  console.log(selectedVideo);


  const fetchvideodetails = async () => {
    try {
      const response = await getDataFromApi(`video/details/?id=${id}`);
      dispatch(setSelectedVideoAction(response));
      /* setVideo(response) */
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchRelatedVideos = async () => {
    try {
      const response = await getDataFromApi(`video/related-contents/?id=${id}`);
      /*  setRelatedVideos(response); */
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  console.log(selectedVideo);


  /*  useEffect(() => {
     fetchvideodetails();
     fetchRelatedVideos();
   }, [id]) */

  return (
    <div className={`main-wrapper ${!isSidebar ? 'full' : ''}`}>
      {isSidebar && <Sidebar />}
      <div className='video-player-wrapper row'>
        <div className="col-md-8">
          <div className="video-payer">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${id}`}
              controls
              width='100%'
              height='70vh'
              style={{ backgroundColor: '#000' }}
            />
          </div>
          <div className="video-details">
            <div className="video-title">  {selectedVideo && selectedVideo?.title} </div>
            <div className="channel-details">
              <div className="channel">
                {/* <div className="image">{selectedVideo && selectedVideo?.author?.avatar ? <img className='channel-logo' src={selectedVideo?.author?.avatar?.[0].url} alt={selectedVideo && selectedVideo?.author?.title && selectedVideo && selectedVideo?.author?.title} /> : ''}</div> */}
                <div className="image"> <img className='channel-logo' src="https://cdn.pixabay.com/photo/2016/12/27/13/10/logo-1933884_640.png" /> </div>
                <div className="channel-desc">
                  <div className="name"> {selectedVideo && selectedVideo?.author?.title} </div>
                  {selectedVideo?.author?.stats?.subscribers && <div className="subscribers-count"> {selectedVideo && selectedVideo?.author?.stats?.subscribers + ` Subscribers`} </div>}
                </div>
              </div>

              <div className="video-description">
                <div className="top-sec">
                  <div className="views-count">{selectedVideo && selectedVideo?.stats?.views + ` views`}</div>
                  <div className="timeUploaded">
                    {selectedVideo?.publishedDateTime && getTimeSinceUpload(selectedVideo?.publishedDateTime) + ` ago`}
                  </div>
                </div>
                <div className="description">
                  {selectedVideo?.description}
                </div>
              </div>

            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="suggestion-section">
            {searchresults?.map((item, ind) => {
              if (item?.video?.title && item?.type == "video") {
                return (
                  <Videocard
                    width={12}
                    key={ind}
                    data={item}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>


      </div>
    </div>
  )
}

export default VideoPlayer