
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../global.css'
import '../css/TaskList.css'
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 1,
    status: '',
    startTime: '',
    endTime: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('https://task-manager-task-7.onrender.com/tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        if (error.response?.status === 401) {
          navigate('/login');  }
      }
    };

    fetchTasks();
  }, [navigate]);

  const handleEditTask = (task) => {
    setIsEditing(true);
    setCurrentTask(task);
    setNewTask({
      title: task.title,
      priority: task.priority,
      status: task.status,
      startTime: task.startTime,
      endTime: task.endTime,
    });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://task-manager-task-7.onrender.com/tasks/${currentTask._id}`,
        newTask,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setTasks(tasks.map((task) => (task._id === currentTask._id ? response.data : task)));
      setIsEditing(false);
      setCurrentTask(null);
      setNewTask({
        title: '',
        priority: 1,
        status: '',
        startTime: '',
        endTime: '',
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`https://task-manager-task-7.onrender.com/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

return (
  <div className="task-list-container">
    <div className="task-list-content">
      <h2 className="task-list-header">Task List</h2>

      {/* Update the form section of your TaskList component with this structure */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Update Task</h3>
            <form onSubmit={handleUpdateTask} className="form-container">
              <div className="form-group">
                <div className="form-section">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-section">
                  <label className="form-label">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    required
                    className="form-select"
                  >
                    <option value="">Select Priority</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div className="form-section">
                  <label className="form-label">Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    required
                    className="form-select"
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Complete">Complete</option>
                  </select>
                </div>

                <div className="datetime-group">
                  <div className="form-section">
                    <label className="form-label">Start Time</label>
                    <input
                      type="datetime-local"
                      value={newTask.startTime}
                      onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-section">
                    <label className="form-label">End Time</label>
                    <input
                      type="datetime-local"
                      value={newTask.endTime}
                      onChange={(e) => setNewTask({ ...newTask, endTime: e.target.value })}
                      required
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="button-group">
                <button type="submit" className="btn btn-primary">
                  Update Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentTask(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    {/* Displaying Tasks */}
    <ul>
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <h3>{task.title}</h3>
            <p>Priority: {task.priority}</p>
            <p>Status: {task.status}</p>
            <p>Start Time: {new Date(task.startTime).toLocaleString()}</p>
            <p>End Time: {new Date(task.endTime).toLocaleString()}</p>
            <div className="button-group">
              <button onClick={() => handleEditTask(task)} className="edit-btn">Edit</button>
              <button onClick={() => handleDeleteTask(task._id)} className="delete-btn">Delete</button>
            </div>
          </li>
        ))}
      </ul>
  </div>
  
);
}
export default TaskList;
