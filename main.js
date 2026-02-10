import { VibeKanbanWebCompanion } from 'vibe-kanban-web-companion';
import { saveToLocalStorage, loadFromLocalStorage } from './localStorage-utils.js';
import { format, compareAsc, formatDistanceToNow, isPast } from 'date-fns';

// Todos array (Feature 1)
let todos = [];
let nextId = 1;

// Current filter (Feature 2)
let currentFilter = 'all';

// Sort mode (Feature 3)
let sortByDueDate = false;

// Search query (Feature 4)
let searchQuery = '';

// Dark mode (Feature 5)
let darkMode = false;

document.addEventListener('DOMContentLoaded', () => {
    initializeDarkMode();
    init();
    initVibeKanban();
});

function init() {
    // Restore state from localStorage
    const stored = loadFromLocalStorage();
    todos = stored.todos;
    nextId = stored.nextId;

    // Wire up add button
    const addBtn = document.getElementById('addBtn');
    const todoInput = document.getElementById('todoInput');

    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    // Wire up filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });

    // Wire up sort button
    const sortBtn = document.getElementById('sortByDueDate');
    sortBtn.addEventListener('click', toggleSortByDueDate);

    // Wire up search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', updateSearch);

    renderTodos();
}

function initVibeKanban() {
    const companion = new VibeKanbanWebCompanion();
    companion.render(document.body);
}

// Feature 1: Add, toggle, delete todos
function addTodo() {
    const input = document.getElementById('todoInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const text = input.value.trim();

    if (text === '') return;

    let dueDate = null;
    if (dueDateInput.value) {
        dueDate = new Date(dueDateInput.value);
    }

    todos.push({
        id: nextId++,
        text: text,
        completed: false,
        dueDate: dueDate
    });

    saveToLocalStorage(todos, nextId);
    input.value = '';
    dueDateInput.value = '';
    renderTodos();
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveToLocalStorage(todos, nextId);
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveToLocalStorage(todos, nextId);
    renderTodos();
}

// Feature 1: Render todos
function renderTodos() {
    const todoList = document.getElementById('todoList');
    let displayTodos = getFilteredTodos();

    if (sortByDueDate) {
        displayTodos = sortTodosByDueDate(displayTodos);
    }

    todoList.innerHTML = '';

    displayTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        if (todo.completed) li.classList.add('completed');
        if (todo.dueDate && isPast(todo.dueDate) && !todo.completed) {
            li.classList.add('overdue');
        }

        let dueDateHtml = '';
        if (todo.dueDate) {
            const dueDateObj = new Date(todo.dueDate);
            const formatted = format(dueDateObj, 'MMM d, yyyy');
            const relative = formatDistanceToNow(dueDateObj, { addSuffix: true });
            dueDateHtml = `<span class="due-date" title="${formatted}">${relative}</span>`;
        }

        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            ${dueDateHtml}
            <button class="todo-delete">Delete</button>
        `;

        li.querySelector('.todo-checkbox').addEventListener('change', () => toggleTodo(todo.id));
        li.querySelector('.todo-delete').addEventListener('click', () => deleteTodo(todo.id));

        todoList.appendChild(li);
    });
}

// Feature 2: Filter todos based on current filter and search query
function getFilteredTodos() {
    let filtered;
    if (currentFilter === 'active') {
        filtered = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = todos.filter(t => t.completed);
    } else {
        filtered = todos; // 'all'
    }

    // Apply text search filter
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(t => t.text.toLowerCase().includes(query));
    }

    return filtered;
}

// Feature 2: Set filter and update UI
function setFilter(filter) {
    currentFilter = filter;

    // Update button styling
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });

    renderTodos();
}

// Feature 4: Update search query and re-render
function updateSearch() {
    const searchInput = document.getElementById('searchInput');
    searchQuery = searchInput.value;
    renderTodos();
}

// Feature 3: Sort todos by due date (upcoming first)
function sortTodosByDueDate(todosToSort) {
    const withDates = todosToSort.filter(t => t.dueDate).sort((a, b) => {
        return compareAsc(new Date(a.dueDate), new Date(b.dueDate));
    });
    const withoutDates = todosToSort.filter(t => !t.dueDate);
    return [...withDates, ...withoutDates];
}

// Feature 3: Toggle sort by due date
function toggleSortByDueDate() {
    sortByDueDate = !sortByDueDate;
    const sortBtn = document.getElementById('sortByDueDate');
    sortBtn.classList.toggle('active');
    renderTodos();
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Feature 5: Dark mode theme toggle
function loadDarkModePreference() {
    const stored = localStorage.getItem('todoAppTheme');
    if (stored !== null) {
        return stored === 'dark';
    }
    // Check system preference if no localStorage value
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark;
}

function initializeDarkMode() {
    darkMode = loadDarkModePreference();
    applyTheme();

    // Wire up dark mode toggle button
    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleDarkMode);
    }
}

function applyTheme() {
    if (darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

function toggleDarkMode() {
    darkMode = !darkMode;
    applyTheme();
    localStorage.setItem('todoAppTheme', darkMode ? 'dark' : 'light');
}
