import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/CommonComponents/Header';
import HomePage from './Components/homePageComponents/HomePage';
import SearchComponent from './Components/SearchComponents/SearchComponent';
import VideoPlayer from './Components/VideoPlayer/VideoPlayer';

function App() {
  return (
   <div className="app-wrapper">
 
    <BrowserRouter >
      <Header />
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/search/:searchQuery' element={<SearchComponent/>} />
        <Route path='/video/:id' element={<VideoPlayer/>} />
      </Routes>
    </BrowserRouter>
   </div>
  );
}

export default App;
