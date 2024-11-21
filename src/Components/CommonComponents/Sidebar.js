import React from 'react';

// Styles
import './Sidebar.scss';
import { categories } from '../../Utils/Constant';
import { getDataFromApi } from '../../Utils/api';
import { useDispatch } from 'react-redux';
import { setSearchresults } from '../../store/Reducers/HomeFiles/HomeFilesAction';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategoryClick = async (category) => {
    try {
      const response = await getDataFromApi(`search/?q=${category?.name}`);
      console.log(response);  
      dispatch(setSearchresults(response?.contents));
      navigate('/');  
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='sidebar_wrapper'>
      <ul className="sidebarLists">
        {categories?.map((item, i)=> <li className="list-item" key={i} onClick={()=> handleCategoryClick(item)} >
          <div className="icon"> {item?.icon} </div>
          <div className="text"> {item?.name === 'New'? 'Home' : item.name} </div>
        </li>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
