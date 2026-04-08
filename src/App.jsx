import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Gamepad2, LayoutDashboard } from 'lucide-react';
import Home from './pages/Home';
import Admin from './pages/Admin';
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
        <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
          <LayoutDashboard size={18} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
          관리자
        </Link>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
