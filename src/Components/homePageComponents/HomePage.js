import React, { useEffect } from 'react'

import './HomePage.scss'
import Sidebar from '../CommonComponents/Sidebar'
import Videocard from '../CommonComponents/Videocard'
import { useDispatch, useSelector } from 'react-redux'

//Assets
import { getDataFromApi } from '../../Utils/api'
import { setSearchresults } from '../../store/Reducers/HomeFiles/HomeFilesAction'

const HomePage = () => {
  const dispatch = useDispatch();
  const isSidebar = useSelector((state) => state.HomeFilesReducer.isSidebar);
  const searchresults = useSelector((state) => state.HomeFilesReducer.searchresults);

  useEffect(() => {
    const fetchSelectedCategory = async () => {
      try {
        const response = await getDataFromApi(`search/?q=${'New'}`);
        dispatch(setSearchresults(response?.contents));
      } catch (error) {
        console.log(error);
      }
    }

    fetchSelectedCategory();
  }, [dispatch])

  return (
    <div className={`main-wrapper ${!isSidebar ? 'full' : ''}`}>
      {isSidebar && <Sidebar />}
      <div className="video-list row">
        {searchresults?.map((item, ind) => {
          if (item?.video?.title && item?.type === "video") {
            return (
              <Videocard
                width={3}
                key={ind}
                data={item}
              />
            );
          }
          return null;
        })}
      </div>

    </div>
  )
}

export default HomePage