
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
// import EditPage from './components/EditPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Navbar from './pages/NavBar';

// Helper function to check if the user is logged in
const isAuthenticated = () => {
    return !!localStorage.getItem('token');  // Check if there's a token in localStorage
};

// PrivateRoute component to protect routes
const PrivateRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/login" />;
};

const App = () => {
    return (<>
     {/* <Navbar/> */}
        <Router>
            
        <Navbar/>
            

            <Routes>
                {/* Protect routes by wrapping with PrivateRoute */}
                <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
                <Route path="/tasks" element={<PrivateRoute element={<TaskList />} />} />
                <Route path="/add" element={<PrivateRoute element={<AddTask />} />} />
                {/* <Route path="/edit/:id" element={<PrivateRoute element={<EditPage />} />} /> */}
                <Route path="/login" element={!isAuthenticated() ? <LoginPage /> : <Navigate to="/dashboard" />} />
                <Route path="/register" element={!isAuthenticated() ? <RegisterPage /> : <Navigate to="/" />} />
            </Routes>
        </Router>
        </> );
    
};

export default App;
