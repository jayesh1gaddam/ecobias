import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import BlogList from './components/blog/BlogList';
import BlogPost from './components/blog/BlogPost';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-amber-50 noise-bg m-0 p-0">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
