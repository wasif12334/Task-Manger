document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  const tasksContainer = document.getElementById("tasksContainer");
  const emptyState = document.getElementById("emptyState");
  const taskCount = document.getElementById("taskCount");
  const themeToggle = document.getElementById("themeToggle");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Render all tasks
  function renderTasks() {
    tasksContainer.innerHTML = "";
    if (tasks.length === 0) {
      emptyState.style.display = "block";
      taskCount.textContent = "0 tasks";
      return;
    }
    emptyState.style.display = "none";

    tasks.forEach((task, index) => {
      const card = document.createElement("div");
      card.className = `card p-2 mb-2 ${task.completed ? 'border-success' : ''}`;
      card.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-0">${task.title}</h6>
            <small class="text-muted">${task.category} | ${task.date}</small>
          </div>
          <div>
            <button class="btn btn-sm btn-success me-1" onclick="toggleTask(${index})">${task.completed ? 'Undo' : 'Done'}</button>
            <button class="btn btn-sm btn-warning me-1" onclick="editTask(${index})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteTask(${index})">Delete</button>
          </div>
        </div>
      `;
      tasksContainer.appendChild(card);
    });

    taskCount.textContent = `${tasks.length} task${tasks.length > 1 ? 's' : ''}`;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Add new task
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("titleInput").value.trim();
    const category = document.getElementById("categoryInput").value.trim();
    const date = document.getElementById("dateInput").value;

    if (!title || !category || !date) return;

    tasks.push({ title, category, date, completed: false });
    taskForm.reset();
    renderTasks();
  });

  // Delete task
  window.deleteTask = (index) => {
    tasks.splice(index, 1);
    renderTasks();
  };

  // Toggle task completion
  window.toggleTask = (index) => {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
  };

  // Edit task (open modal)
  window.editTask = (index) => {
    const modal = new bootstrap.Modal(document.getElementById("editModal"));
    document.getElementById("editId").value = index;
    document.getElementById("editTitle").value = tasks[index].title;
    document.getElementById("editCategory").value = tasks[index].category;
    document.getElementById("editDate").value = tasks[index].date;
    modal.show();
  };

  // Handle modal save
  document.getElementById("editForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("editId").value;
    tasks[id].title = document.getElementById("editTitle").value;
    tasks[id].category = document.getElementById("editCategory").value;
    tasks[id].date = document.getElementById("editDate").value;
    renderTasks();
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
  });

  // Theme toggle
  themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", themeToggle.checked);
  });

  // Initial render
  renderTasks();
});
