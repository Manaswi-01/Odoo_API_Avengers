import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css'; // We'll create this for specific animations

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const isActive = (path) => location.pathname === path;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsSettingsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleSettingsDropdown = (e) => {
        e.preventDefault();
        setIsSettingsOpen(!isSettingsOpen);
    };

    const closeDropdown = () => {
        setIsSettingsOpen(false);
    };

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

                    {/* Settings Dropdown */}
                    <div className="nav-dropdown" ref={dropdownRef}>
                        <button
                            className={`nav-link dropdown-toggle ${isActive('/settings') || isActive('/location') || isActive('/warehouse') ? 'active' : ''}`}
                            onClick={toggleSettingsDropdown}
                        >
                            Settings
                            <span className={`dropdown-arrow ${isSettingsOpen ? 'open' : ''}`}>▼</span>
                        </button>
                        {isSettingsOpen && (
                            <div className="dropdown-menu">
                                <Link to="/location" className="dropdown-item" onClick={closeDropdown}>
                                    Location
                                </Link>
                                <Link to="/warehouse" className="dropdown-item" onClick={closeDropdown}>
                                    Warehouse
                                </Link>
                            </div>
                        )}
                    </div>
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
