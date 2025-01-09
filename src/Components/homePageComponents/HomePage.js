import React, { useEffect } from 'react'

import './HomePage.scss'
import Sidebar from '../CommonComponents/Sidebar'
import Videocard from '../CommonComponents/Videocard'
import { useSelector } from 'react-redux'

//Assets
import { getDataFromApi } from '../../Utils/api'

const HomePage = () => {
  const isSidebar = useSelector((state) => state.HomeFilesReducer.isSidebar);
  const searchresults = useSelector((state) => state.HomeFilesReducer.searchresults);

  const fetchSelectedCategory = async () => {
    try {
      const response = await getDataFromApi(`search/?q=${'New'}`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
     fetchSelectedCategory();
  }, [])

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