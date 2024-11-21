import React, { useState } from 'react';
import { /* useLocation, */ useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { Form, InputGroup } from 'react-bootstrap';

// Icons
import { FiAlignJustify } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { BiLogIn, BiLogOut } from "react-icons/bi"; // Add login/logout icons

// Assets
import { ReactComponent as YoutubeIcon } from '../../Assets/Images/youtube-color-icon.svg';

// Styles
import './Header.scss';


import { toggleSidebarAction } from '../../store/Reducers/HomeFiles/HomeFilesAction';

const Header = () => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const isSidebar = useSelector((state) => state.HomeFilesReducer.isSidebar);
  //const isLoggedIn = useSelector((state) => state.AuthReducer.isLoggedIn); // Get user login status
  const dispatch = useDispatch(); // To dispatch actions
  const isLoggedIn = false;

  const SearchQueryHandler = (event) => {
    if (event === 'searchButton' || event.key === 'Enter') {
      if (searchText.length > 0) {
        navigate(`/search/${searchText}`);
      }
    }
  };


  const handleToggleSidebar = () => {
    dispatch(toggleSidebarAction(isSidebar)); // Dispatch action to toggle sidebar
  };

  /*  const handleAuthClick = () => {
     if (isLoggedIn) {
       // Logic to sign out
       console.log("Signing out...");
       // Perform sign-out actions
     } else {
       // Logic to sign in
       console.log("Signing in...");
       // Perform sign-in actions
     }
   };
  */
  /* const { pathname } = useLocation();
  const pageName = pathname?.split?.('/').filter(Boolean)?.[0]; */

  return (
    <div className='main-header-wrapper row'>
      <div className="left-side col-md-3">
        <div className="Hamburger" onClick={handleToggleSidebar}>
          <FiAlignJustify />
        </div>
        <div className="icon-Box" onClick={() => navigate('/')}>
          <div className="icon-img"><YoutubeIcon /></div>
          <div className="YouTube-text">YouTube</div>
        </div>
      </div>
      <div className="search-box col-md-4">
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Search"
            aria-label="Search"
            aria-describedby="Search"
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            onKeyDown={(e) => SearchQueryHandler(e)}
          />
          <InputGroup.Text onClick={() => SearchQueryHandler('searchButton')} id="Search">
            <IoIosSearch />
          </InputGroup.Text>
        </InputGroup>
      </div>
      <div className="user-profile-box col-md-3">
        <div className="avatar-box" onClick={() => { }}>
          <div className="icon">
            {isLoggedIn ? <BiLogOut style={{ color: '#2d2dffad' }} /> : <BiLogIn style={{ color: '#2d2dffad' }} />}
          </div>
          <div className="text">{isLoggedIn ? 'Sign Out' : 'Sign In'}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
