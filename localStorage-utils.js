const STORAGE_KEY = 'todoApp';

export function loadFromLocalStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === null) {
            return { todos: [], nextId: 1 };
        }
        const data = JSON.parse(stored);
        return {
            todos: Array.isArray(data.todos) ? data.todos : [],
            nextId: typeof data.nextId === 'number' ? data.nextId : 1
        };
    } catch (err) {
        // Corrupted JSON or localStorage disabled
        console.warn('Failed to load todos from localStorage:', err.message);
        return { todos: [], nextId: 1 };
    }
}

export function saveToLocalStorage(todos, nextId) {
    try {
        const data = { todos, nextId };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
        // Quota exceeded, disabled, or private browsing
        if (err.name === 'QuotaExceededError') {
            console.warn('localStorage quota exceeded, todos not persisted');
        } else {
            console.warn('Failed to save todos to localStorage:', err.message);
        }
    }
}

export function clearLocalStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
        console.warn('Failed to clear localStorage:', err.message);
    }
}
