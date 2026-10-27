import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './Components/CommonComponents/Header';
import Sidebar from './Components/CommonComponents/Sidebar';
import HomePage from './Components/homePageComponents/HomePage';
import SearchComponent from './Components/SearchComponents/SearchComponent';
import VideoPlayer from './Components/VideoPlayer/VideoPlayer';
import ChannelPage from './Components/ChannelComponents/ChannelPage';
import PlaylistPage from './Components/PlaylistComponents/PlaylistPage';
import { EmptyState } from './Components/CommonComponents/StateViews';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/search/:searchQuery' element={<SearchComponent />} />
            <Route path='/video/:id' element={<VideoPlayer />} />
            <Route path='/channel/:id' element={<ChannelPage />} />
            <Route path='/playlist/:id' element={<PlaylistPage />} />
            <Route path='*' element={<EmptyState title="Page not found" message="The page you're looking for doesn't exist." />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
