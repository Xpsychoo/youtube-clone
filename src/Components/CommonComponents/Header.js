import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Icons
import { FiMenu, FiMoon, FiSun, FiUser } from 'react-icons/fi';
import { IoSearch } from 'react-icons/io5';

// Assets
import { ReactComponent as YoutubeIcon } from '../../Assets/Images/youtube-color-icon.svg';

// Styles
import './Header.scss';

import SearchBar from './SearchBar';
import { setDrawerAction, setSelectedCategory, toggleSidebarAction } from '../../store/Reducers/HomeFiles/HomeFilesAction';
import { useSidebarMode, useTheme } from '../../Utils/hooks';

export const Brand = () => {
  const dispatch = useDispatch();
  return (
    <Link to="/" className="brand" onClick={() => dispatch(setSelectedCategory('New'))} aria-label="Home">
      <YoutubeIcon className="brand__icon" />
      <span className="brand__text">YouTube</span>
    </Link>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const sidebarMode = useSidebarMode();
  const [theme, toggleTheme] = useTheme();
  const [isMobileSearch, setIsMobileSearch] = useState(false);

  const handleMenuClick = () => {
    dispatch(sidebarMode === 'overlay' ? setDrawerAction(true) : toggleSidebarAction());
  };

  return (
    <header className={`app-header ${isMobileSearch ? 'is-searching' : ''}`}>
      <div className="app-header__start">
        <button className="icon-btn" onClick={handleMenuClick} aria-label="Menu">
          <FiMenu />
        </button>
        <Brand />
      </div>

      <SearchBar autoFocus={isMobileSearch} onClose={() => setIsMobileSearch(false)} />

      <div className="app-header__end">
        <button className="icon-btn mobile-only" onClick={() => setIsMobileSearch(true)} aria-label="Search">
          <IoSearch />
        </button>
        <button
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
        >
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>
        <button className="sign-in-btn">
          <FiUser />
          <span>Sign in</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
