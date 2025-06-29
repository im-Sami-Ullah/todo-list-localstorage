<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>To-Do List</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      padding: 50px;
    }
    .todo-container {
      background: #fff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    h2 {
      margin-bottom: 20px;
      text-align: center;
      color: #333;
    }
    input[type="text"] {
      width: 75%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    button {
      padding: 10px 15px;
      margin-left: 5px;
      border: none;
      background: #4CAF50;
      color: white;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background: #45a049;
    }
    ul {
      list-style: none;
      padding: 0;
      margin-top: 20px;
    }
    li {
      background: #eee;
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    li.completed {
      text-decoration: line-through;
      color: gray;
    }
    .remove-btn {
      background: #ff4d4d;
      padding: 5px 8px;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="todo-container">
    <h2>To-Do List</h2>
    <input type="text" id="taskInput" placeholder="Add a task" />
    <button onclick="addTask()">Add</button>
    <ul id="taskList"></ul>
  </div>

  <script>
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    function loadTasks() {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      taskList.innerHTML = '';
      tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.completed) li.classList.add('completed');

        li.onclick = () => toggleComplete(index);
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'X';
        removeBtn.className = 'remove-btn';
        removeBtn.onclick = (e) => {
          e.stopPropagation();
          removeTask(index);
        };
        li.appendChild(removeBtn);
        taskList.appendChild(li);
      });
    }

    function saveTasks(tasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function addTask() {
      const text = taskInput.value.trim();
      if (text === '') return;
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.push({ text, completed: false });
      saveTasks(tasks);
      taskInput.value = '';
      loadTasks();
    }

    function toggleComplete(index) {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks[index].completed = !tasks[index].completed;
      saveTasks(tasks);
      loadTasks();
    }

    function removeTask(index) {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.splice(index, 1);
      saveTasks(tasks);
      loadTasks();
    }

    // Load tasks on startup
    loadTasks();
  </script>
</body>
</html>
