import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css'; // We'll create this for specific animations

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-text">StockMaster</span>
                </Link>

                <div className="navbar-links">
                    <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
                    <Link to="/operations" className={`nav-link ${isActive('/operations') ? 'active' : ''}`}>Operations</Link>
                    <Link to="/stocks" className={`nav-link ${isActive('/stocks') ? 'active' : ''}`}>Stocks</Link>
                    <Link to="/move-history" className={`nav-link ${isActive('/move-history') ? 'active' : ''}`}>History</Link>
                    <Link to="/settings" className={`nav-link ${isActive('/settings') ? 'active' : ''}`}>Settings</Link>
                </div>

                <button
                    className="theme-toggle-btn"
                    onClick={toggleTheme}
                    aria-label="Toggle Theme"
                >
                    <div className={`toggle-icon ${theme}`}>
                        <div className="shape-center"></div>
                        <div className="shape-rays"></div>
                    </div>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
