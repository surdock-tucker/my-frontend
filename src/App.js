import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Base URL for the Django API
const API_BASE_URL = 'ec2-54-226-10-195.compute-1.amazonaws.com:8000/api/tasks/';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (newTask.trim() === '') return;

    try {
      await axios.post(API_BASE_URL, { name: newTask });
      setNewTask('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}${id}/`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Start editing a task
  const startEditing = (task) => {
    setEditingTask(task);
    setEditedTaskName(task.name);
  };

  // Cancel editing a task
  const cancelEditing = () => {
    setEditingTask(null);
    setEditedTaskName('');
  };

  // Save edited task
  const saveTask = async () => {
    if (editedTaskName.trim() === '') return;

    try {
      await axios.put(`${API_BASE_URL}${editingTask.id}/`, { name: editedTaskName });
      setEditingTask(null);
      setEditedTaskName('');
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div className="add-task">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id}>
            {editingTask && editingTask.id === task.id ? (
              <div className="edit-task">
                <input
                  type="text"
                  value={editedTaskName}
                  onChange={(e) => setEditedTaskName(e.target.value)}
                />
                <button onClick={saveTask}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </div>
            ) : (
              <div>
                <span>{task.name}</span>
                <button onClick={() => startEditing(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
