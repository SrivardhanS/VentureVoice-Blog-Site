import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            <h1>StartupBlogs</h1>
          </Link>
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/create">Write Blog</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;