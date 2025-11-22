import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css'; // We'll create this for specific animations

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isOperationsOpen, setIsOperationsOpen] = useState(false);
    const settingsRef = useRef(null);
    const operationsRef = useRef(null);

    const isActive = (path) => location.pathname === path;

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setIsSettingsOpen(false);
            }
            if (operationsRef.current && !operationsRef.current.contains(event.target)) {
                setIsOperationsOpen(false);
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
        if (!isSettingsOpen) setIsOperationsOpen(false); // ensure only one open
    };

    const toggleOperationsDropdown = (e) => {
        e.preventDefault();
        setIsOperationsOpen(!isOperationsOpen);
        if (!isOperationsOpen) setIsSettingsOpen(false); // ensure only one open
    };

    const closeSettingsDropdown = () => setIsSettingsOpen(false);
    const closeOperationsDropdown = () => setIsOperationsOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-text">StockMaster</span>
                </Link>

                <div className="navbar-links">
                    <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>

                    {/* Operations Dropdown (matches Settings style) */}
                    <div className="nav-dropdown" ref={operationsRef}>
                        <button
                            className={`nav-link dropdown-toggle ${isActive('/operations') || isActive('/operations/receipt') || isActive('/operations/delivery') ? 'active' : ''}`}
                            onClick={toggleOperationsDropdown}
                        >
                            Operations
                            <span className={`dropdown-arrow ${isOperationsOpen ? 'open' : ''}`}>▼</span>
                        </button>
                        {isOperationsOpen && (
                            <div className="dropdown-menu">
                                <Link to="/operations/receipt" className="dropdown-item" onClick={closeOperationsDropdown}>
                                    Receipt
                                </Link>
                                <Link to="/operations/delivery" className="dropdown-item" onClick={closeOperationsDropdown}>
                                    Delivery
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link to="/stocks" className={`nav-link ${isActive('/stocks') ? 'active' : ''}`}>Stocks</Link>
                    <Link to="/move-history" className={`nav-link ${isActive('/move-history') ? 'active' : ''}`}>History</Link>

                    {/* Settings Dropdown */}
                    <div className="nav-dropdown" ref={settingsRef}>
                        <button
                            className={`nav-link dropdown-toggle ${isActive('/settings') || isActive('/location') || isActive('/warehouse') ? 'active' : ''}`}
                            onClick={toggleSettingsDropdown}
                        >
                            Settings
                            <span className={`dropdown-arrow ${isSettingsOpen ? 'open' : ''}`}>▼</span>
                        </button>
                        {isSettingsOpen && (
                            <div className="dropdown-menu">
                                <Link to="/location" className="dropdown-item" onClick={closeSettingsDropdown}>
                                    Location
                                </Link>
                                <Link to="/warehouse" className="dropdown-item" onClick={closeSettingsDropdown}>
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