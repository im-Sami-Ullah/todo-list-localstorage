<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Modern To-Do List</title>
  <style>
    :root {
      --primary-color: #4CAF50;
      --primary-hover: #45a049;
      --danger-color: #ff4d4d;
      --bg-color: #f9f9f9;
      --text-color: #333;
      --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      --border-radius: 8px;
      --transition-speed: 0.3s;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--bg-color);
      margin: 0;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 40px 20px;
      color: var(--text-color);
    }

    .todo-container {
      background: #fff;
      padding: 30px 25px;
      border-radius: var(--border-radius);
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 450px;
    }

    h2 {
      text-align: center;
      margin-bottom: 25px;
      font-weight: 700;
      font-size: 2rem;
      letter-spacing: 1px;
      color: var(--primary-color);
    }

    .input-group {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    input[type="text"] {
      flex-grow: 1;
      padding: 12px 15px;
      font-size: 1rem;
      border: 2px solid #ccc;
      border-radius: var(--border-radius);
      transition: border-color var(--transition-speed);
    }
    input[type="text"]:focus {
      border-color: var(--primary-color);
      outline: none;
    }

    button.add-btn {
      background-color: var(--primary-color);
      color: #fff;
      border: none;
      padding: 12px 20px;
      font-size: 1rem;
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: background-color var(--transition-speed);
      user-select: none;
    }
    button.add-btn:hover, button.add-btn:focus {
      background-color: var(--primary-hover);
      outline: none;
    }

    ul#taskList {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    ul#taskList li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f0f0f0;
      margin-bottom: 12px;
      padding: 12px 15px;
      border-radius: var(--border-radius);
      transition: background-color var(--transition-speed);
      cursor: pointer;
    }
    ul#taskList li:hover {
      background-color: #e0e0e0;
    }

    ul#taskList li.completed .task-text {
      text-decoration: line-through;
      color: #999;
    }

    .task-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-grow: 1;
    }

    .task-text {
      font-size: 1rem;
      user-select: none;
    }

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    button.remove-btn {
      background-color: var(--danger-color);
      border: none;
      color: #fff;
      padding: 6px 10px;
      font-weight: bold;
      font-size: 1rem;
      border-radius: var(--border-radius);
      cursor: pointer;
      transition: background-color var(--transition-speed);
      user-select: none;
    }
    button.remove-btn:hover, button.remove-btn:focus {
      background-color: #d43c3c;
      outline: none;
    }

    /* Edit input */
    input.edit-input {
      flex-grow: 1;
      font-size: 1rem;
      padding: 8px 10px;
      border-radius: var(--border-radius);
      border: 2px solid var(--primary-color);
      outline: none;
    }
  </style>
</head>
<body>

  <div class="todo-container" role="main" aria-label="To-Do List Application">
    <h2>To-Do List</h2>
    <div class="input-group">
      <input
        type="text"
        id="taskInput"
        placeholder="Add a new task..."
        aria-label="Task input"
        autocomplete="off"
      />
      <button class="add-btn" id="addTaskBtn" aria-label="Add task button">Add</button>
    </div>
    <ul id="taskList" aria-live="polite" aria-relevant="additions removals"></ul>
  </div>

  <script>
    (() => {
      const taskInput = document.getElementById('taskInput');
      const addTaskBtn = document.getElementById('addTaskBtn');
      const taskList = document.getElementById('taskList');

      // Util: Generate unique ID (simple)
      const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

      // Load tasks from localStorage
      function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';
        tasks.forEach(task => {
          taskList.appendChild(createTaskElement(task));
        });
      }

      // Save tasks to localStorage
      function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }

      // Create a task list item DOM element
      function createTaskElement(task) {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);

        if (task.completed) li.classList.add('completed');

        const leftDiv = document.createElement('div');
        leftDiv.className = 'task-left';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.setAttribute('aria-label', `Mark task "${task.text}" as completed`);

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;
        span.tabIndex = 0;
        span.setAttribute('role', 'textbox');
        span.setAttribute('aria-label', `Task: ${task.text}`);
        span.setAttribute('aria-readonly', 'true');

        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(span);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = '✕';
        removeBtn.setAttribute('aria-label', `Remove task "${task.text}"`);

        li.appendChild(leftDiv);
        li.appendChild(removeBtn);

        return li;
      }

      // Add task handler
      function addTask() {
        const text = taskInput.value.trim();
        if (!text) return;

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const newTask = { id: generateId(), text, completed: false };
        tasks.push(newTask);
        saveTasks(tasks);
        taskInput.value = '';
        loadTasks();
        taskInput.focus();
      }

      // Toggle completed status
      function toggleTask(id) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const index = tasks.findIndex(t => t.id === id);
        if (index > -1) {
          tasks[index].completed = !tasks[index].completed;
          saveTasks(tasks);
          loadTasks();
        }
      }

      // Remove task
      function removeTask(id) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const newTasks = tasks.filter(t => t.id !== id);
        saveTasks(newTasks);
        loadTasks();
      }

      // Edit task inline
      function editTask(id, span) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        // Create input field
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.className = 'edit-input';
        input.setAttribute('aria-label', `Edit task "${task.text}"`);
        span.replaceWith(input);
        input.focus();

        // Save on Enter or blur
        function saveEdit() {
          const newText = input.value.trim();
          if (newText) {
            task.text = newText;
            saveTasks(tasks);
          }
          loadTasks();
        }

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            input.blur();
          } else if (e.key === 'Escape') {
            loadTasks(); // Cancel edit
          }
        });
      }

      // Event delegation for task list
      taskList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;
        const id = li.getAttribute('data-id');

        if (e.target.matches('input[type="checkbox"]')) {
          toggleTask(id);
        } else if (e.target.matches('button.remove-btn')) {
          removeTask(id);
        } else if (e.target.matches('span.task-text')) {
          editTask(id, e.target);
        }
      });

      // Allow keyboard editing with Enter key on span.task-text
      taskList.addEventListener('keydown', (e) => {
        if (e.target.matches('span.task-text') && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          editTask(e.target.closest('li').getAttribute('data-id'), e.target);
        }
      });

      // Add task on button click or Enter key press
      addTaskBtn.addEventListener('click', addTask);
      taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          addTask();
        }
      });

      // Initial load
      loadTasks();
    })();
  </script>
</body>
</html>
