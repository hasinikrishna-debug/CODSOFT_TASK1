import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("Personal");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [editId, setEditId] = useState(null);

  // Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Save Tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save Theme
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Add / Update Task
  const addTask = () => {
    if (task.trim() === "") {
      alert("Please enter a task.");
      return;
    }

    if (editId) {
      const updatedTasks = tasks.map((item) =>
        item.id === editId
          ? {
              ...item,
              text: task,
              category,
              priority,
              dueDate,
            }
          : item
      );

      setTasks(updatedTasks);
      setEditId(null);
    } else {
      const newTask = {
        id: Date.now(),
        text: task,
        category,
        priority,
        dueDate,
        completed: false,
      };

      setTasks([...tasks, newTask]);
    }

    setTask("");
    setCategory("Personal");
    setPriority("Medium");
    setDueDate("");
  };

  // Delete
  const deleteTask = (id) => {
    setTasks(tasks.filter((item) => item.id !== id));
  };

  // Complete / Pending
  const toggleTask = (id) => {
    const updatedTasks = tasks.map((item) =>
      item.id === id
        ? { ...item, completed: !item.completed }
        : item
    );

    setTasks(updatedTasks);
  };

  // Edit
  const editTask = (taskItem) => {
    setTask(taskItem.text);
    setCategory(taskItem.category);
    setPriority(taskItem.priority);
    setDueDate(taskItem.dueDate);
    setEditId(taskItem.id);
  };

  // Search + Filter
  const filteredTasks = tasks.filter((item) => {
    const matchesSearch = item.text
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All"
        ? true
        : filter === "Completed"
        ? item.completed
        : !item.completed;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <h1>📝 To-Do List</h1>

      <div className="theme-toggle">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="input-section">

        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Personal</option>
          <option>Work</option>
          <option>Study</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button onClick={addTask}>
          {editId ? "Update Task" : "Add Task"}
        </button>

      </div>

      <div className="search-filter">

        <input
          type="text"
          placeholder="Search task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>

      </div>

      <div className="task-list">

        {filteredTasks.length === 0 ? (

          <h3 style={{ textAlign: "center" }}>
            No Tasks Found
          </h3>

        ) : (

          filteredTasks.map((item) => (

            <div className="task-card" key={item.id}>

              <div>

                <h3
                  style={{
                    textDecoration: item.completed
                      ? "line-through"
                      : "none",
                    color: item.completed
                      ? "#22c55e"
                      : "inherit",
                  }}
                >
                  {item.text}
                </h3>

                <p>

                  <strong>Category:</strong>{" "}

                  {item.category === "Study" && "📚 Study"}

                  {item.category === "Work" && "💼 Work"}

                  {item.category === "Personal" && "🏠 Personal"}

                </p>

                <p>

                  <strong>Priority:</strong>{" "}

                  {item.priority === "High" && "🔴 High"}

                  {item.priority === "Medium" && "🟡 Medium"}

                  {item.priority === "Low" && "🟢 Low"}

                </p>
                                <p>
                  <strong>Due Date:</strong>{" "}
                  {item.dueDate || "Not Set"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {item.completed
                    ? "Completed ✅"
                    : "Pending ⏳"}
                </p>

              </div>

              <div className="buttons">

                <button onClick={() => editTask(item)}>
                  Edit
                </button>

                <button onClick={() => deleteTask(item.id)}>
                  Delete
                </button>

                <button onClick={() => toggleTask(item.id)}>
                  {item.completed
                    ? "Pending"
                    : "Complete"}
                </button>

              </div>

            </div>

          ))

        )}

      </div>

      {/* Summary */}

      <div className="summary">

        <p>
          Total Tasks: {tasks.length}
        </p>

        <p>
          Completed:{" "}
          {tasks.filter((task) => task.completed).length}
        </p>

        <p>
          Pending:{" "}
          {tasks.filter((task) => !task.completed).length}
        </p>

      </div>

    </div>
  );
}

export default App; 