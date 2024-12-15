
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Dashboard.css'
import '../global.css'
const Dashboard = () => {
    const [stats, setStats] = useState({});
    const [displayStats, setDisplayStats] = useState({
        totalTasks: 0,
        percentCompleted: 0,
        percentPending: 0,
        elapsed: 0,
        remaining: 0,
        averageCompletionTime: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const { data } = await axios.get('https://task-manager-xy1l.onrender.com/dashboard', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setStats(data);
                animateStats(data); 
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };
        fetchStats();
    }, []);

    const animateStats = (finalStats) => {
        const duration = 2000;
        const steps = 100; 
        const interval = duration / steps;

        const incrementStats = (step) => {
            setDisplayStats((prev) => ({
                totalTasks: Math.min(Math.round((finalStats.totalTasks / steps) * step), finalStats.totalTasks),
                percentCompleted: Math.min(((finalStats.percentCompleted / steps) * step).toFixed(2), finalStats.percentCompleted).toFixed(2),
                percentPending: Math.min(((finalStats.percentPending / steps) * step).toFixed(2), finalStats.percentPending).toFixed(2),
                elapsed: Math.min(((finalStats.timeStats.elapsed / steps) * step).toFixed(2), finalStats.timeStats.elapsed).toFixed(2),
                remaining: Math.min(((finalStats.timeStats.remaining / steps) * step).toFixed(2), finalStats.timeStats.remaining).toFixed(2),
                averageCompletionTime: Math.min(((finalStats.averageCompletionTime / steps) * step).toFixed(2), finalStats.averageCompletionTime).toFixed(2),
            }));
        };

        for (let i = 0; i <= steps; i++) {
            setTimeout(() => incrementStats(i), i * interval);
        }
    };

    return (
        <div className="dashboard-container">
        <div className="stat-row">
            <div className="stat-card">
                <h1 className="stat-number">{displayStats.percentCompleted}%</h1>
                <p className="stat-label">Completed Tasks</p>
            </div>
            <div className="stat-card">
                <h1 className="stat-number">{displayStats.percentPending}%</h1>
                <p className="stat-label">Pending Tasks</p>
            </div>
            <div className="stat-card">
                <h1 className="stat-number">{displayStats.totalTasks}</h1>
                <p className="stat-label">Total Tasks</p>
            </div>
        </div>
        <div className="stat-row">
            <div className="stat-card">
                <h1 className="stat-number">{displayStats.elapsed} hours</h1>
                <p className="stat-label">Total Time Lapsed</p>
            </div>
            <div className="stat-card">
                <h1 className="stat-number">{displayStats.remaining} hours</h1>
                <p className="stat-label">Estimated Time Left</p>
            </div>
            <div className="stat-card">
                <h1 className="stat-number">{displayStats.averageCompletionTime} hours</h1>
                <p className="stat-label">Average Completion Time</p>
            </div>
        </div>
    </div>
    );
};

export default Dashboard;