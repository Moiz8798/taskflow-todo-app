import { API_BASE_URL } from './api';

const h = { 'Content-Type': 'application/json' };

export const getTodos = async () => {
  const res = await fetch(`${API_BASE_URL}/todos`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export const createTodo = async (title) => {
  const res = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST', headers: h, body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
};

export const toggleTodo = async (id, completed) => {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'PATCH', headers: h, body: JSON.stringify({ completed }),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
};

export const updateTitle = async (id, title) => {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'PATCH', headers: h, body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
};

export const deleteTodo = async (id) => {
  const res = await fetch(`${API_BASE_URL}/todos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
};

export const clearCompleted = async () => {
  const res = await fetch(`${API_BASE_URL}/todos/completed/all`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to clear');
};
