import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';

// Styles
import './Sidebar.scss';
import { categories } from '../../Utils/Constant';
import { setDrawerAction, setSelectedCategory } from '../../store/Reducers/HomeFiles/HomeFilesAction';
import { useSidebarMode } from '../../Utils/hooks';
import { Brand } from './Header';

const homeItem = categories.find((item) => item.type === 'home');
const exploreItems = categories.filter((item) => item.type === 'category');
const menuItems = categories.filter((item) => item.type === 'menu');

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const mode = useSidebarMode();
  const isSidebar = useSelector((state) => state.HomeFilesReducer.isSidebar);
  const isDrawerOpen = useSelector((state) => state.HomeFilesReducer.isDrawerOpen);
  const selectedCategory = useSelector((state) => state.HomeFilesReducer.selectedCategory);

  const closeDrawer = () => dispatch(setDrawerAction(false));

  // Close the drawer whenever the page or layout changes.
  useEffect(() => {
    dispatch(setDrawerAction(false));
  }, [pathname, mode, dispatch]);

  useEffect(() => {
    if (!isDrawerOpen) return undefined;
    const onKeyDown = (e) => e.key === 'Escape' && dispatch(setDrawerAction(false));
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen, dispatch]);

  const handleCategoryClick = (category) => {
    dispatch(setSelectedCategory(category.name));
    navigate('/');
    closeDrawer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderItem = (item) => {
    const label = item.name === 'New' ? 'Home' : item.name;
    const isActive = item.type !== 'menu' && pathname === '/' && selectedCategory === item.name;
    return (
      <li key={item.name}>
        <button
          className={`sidebar__item ${isActive ? 'is-active' : ''}`}
          onClick={item.type === 'menu' ? undefined : () => handleCategoryClick(item)}
          title={label}
        >
          <span className="sidebar__icon">{item.icon}</span>
          <span className="sidebar__label">{label}</span>
        </button>
      </li>
    );
  };

  const nav = (
    <nav className="sidebar__nav">
      <ul>{renderItem(homeItem)}</ul>
      <div className="sidebar__divider" />
      <h4 className="sidebar__heading">Explore</h4>
      <ul>{exploreItems.map(renderItem)}</ul>
      <div className="sidebar__divider" />
      <ul className="sidebar__menu">{menuItems.map(renderItem)}</ul>
      <p className="sidebar__footer">YouTube Clone · Built with React</p>
    </nav>
  );

  if (mode === 'overlay') {
    return (
      <>
        <div className={`sidebar-backdrop ${isDrawerOpen ? 'is-open' : ''}`} onClick={closeDrawer} />
        <aside className={`sidebar sidebar--full sidebar--drawer ${isDrawerOpen ? 'is-open' : ''}`} aria-hidden={!isDrawerOpen}>
          <div className="sidebar__drawer-head">
            <button className="icon-btn" onClick={closeDrawer} aria-label="Close menu">
              <FiMenu />
            </button>
            <Brand />
          </div>
          {nav}
        </aside>
      </>
    );
  }

  return <aside className={`sidebar ${isSidebar ? 'sidebar--full' : 'sidebar--mini'}`}>{nav}</aside>;
};

export default Sidebar;
