import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TodoList.css"; // Import the CSS file

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  const addTask = async () => {
    try {
      await axios.post("http://localhost:5000/tasks", newTask);
      fetchTasks();
      setNewTask({ title: "", description: "" });
    } catch (error) {
      console.error("Error adding task:", error.message);
    }
  };

  const updateTask = async () => {
    try {
      await axios.patch(`http://localhost:5000/tasks/${editingTask._id}`, {
        title: newTask.title,
        description: newTask.description,
      });
      fetchTasks();
      setEditingTask(null);
      setNewTask({ title: "", description: "" });
    } catch (error) {
      console.error("Error updating task:", error.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setNewTask({ title: task.title, description: task.description });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setNewTask({ title: "", description: "" });
  };

  return (
    <div className="todo-container">
      <h1>Todo List in MERN Stack</h1>
      <div className="form-container">
        <h3>{editingTask ? "Edit Task" : "Add New Task"}</h3>
        <form>
          <label className="form-label">Title:</label>
          <input
            type="text"
            className="form-input"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />

          <label className="form-label">Description:</label>
          <input
            type="text"
            className="form-input"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />

          {editingTask ? (
            <div>
              <button
                className="form-button"
                type="button"
                onClick={updateTask}
              >
                Update Task
              </button>
              <button
                className="form-button cancel-button"
                type="button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button className="form-button" type="button" onClick={addTask}>
              Add Task
            </button>
          )}
        </form>
      </div>
      <h2>Todo List</h2>
      <table className="todo-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEditClick(task)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
