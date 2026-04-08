import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { AppProvider } from './context/AppContext';
import './index.css';

// Navigation Component
const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <Gamepad2 size={28} color="#c77dff" />
        <span className="title-display">ShortsGame</span>
      </Link>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>뉴스 피드</Link>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AppProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gadmin" element={<Admin />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
