
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/AddTask.css';
import '../global.css';

const AddTask = () => {
    const [formData, setFormData] = useState({
        title: '',
        priority: 1,
        status: 'Pending',
        startTime: '',
        endTime: ''
    });

    const navigate = useNavigate(); 
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('Token is missing');
                return;
            }

            const response = await axios.post('https://task-manager-task-7.onrender.com/add', formData, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });

            console.log('Task added:', response.data);
            navigate('/tasks');
        } catch (error) {
            console.error('Error adding task:', error.response?.data || error.message);
        }
    };

    return (
        <div className="form-container">
            <h1>Add Task</h1>
            <form onSubmit={handleSubmit} className="form-area">
                <label>Title:</label>
                <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                />
                <label>Priority:</label>
                <select 
                    name="priority" 
                    value={formData.priority} 
                    onChange={handleChange}
                >
                    {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>
                <label>Status:</label>
                <select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleChange}
                >
                    <option value="Pending">Pending</option>
                    <option value="Complete">Complete</option>
                </select>
                <label>Start Time:</label>
                <input 
                    type="datetime-local" 
                    name="startTime" 
                    value={formData.startTime} 
                    onChange={handleChange} 
                    required 
                />
                <label>End Time:</label>
                <input 
                    type="datetime-local" 
                    name="endTime" 
                    value={formData.endTime} 
                    onChange={handleChange} 
                    required 
                />
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
};

export default AddTask;
