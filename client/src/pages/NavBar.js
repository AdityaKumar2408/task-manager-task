import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css'; 
import '../global.css'
const Navbar = () => {
    const isAuthenticated = () => {
        return localStorage.getItem('token') !== null;
    };

    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/tasks">Tasks</Link></li>
                <li><Link to="/add">Add Task</Link></li>
                {!isAuthenticated() ? (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                ) : (
                    <li><Link to="/login" onClick={() => { localStorage.removeItem('token'); }}>Logout</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;