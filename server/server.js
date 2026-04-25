const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let todos = [
  { id: uuidv4(), title: 'Buy groceries 🛒', completed: false, createdAt: new Date().toISOString() },
  { id: uuidv4(), title: 'Read a book 📚', completed: true, createdAt: new Date().toISOString() },
  { id: uuidv4(), title: 'Go for a walk 🚶', completed: false, createdAt: new Date().toISOString() },
];

app.get('/todos', (req, res) => res.json(todos));

app.post('/todos', (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: 'Title required' });
  const todo = { id: uuidv4(), title: title.trim(), completed: false, createdAt: new Date().toISOString() };
  todos.unshift(todo);
  res.status(201).json(todo);
});

app.patch('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === req.params.id);
  if (!todo) return res.status(404).json({ error: 'Not found' });
  if (req.body.hasOwnProperty('completed')) todo.completed = req.body.completed;
  if (req.body.title) todo.title = req.body.title.trim();
  res.json(todo);
});

app.delete('/todos/:id', (req, res) => {
  const i = todos.findIndex(t => t.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Not found' });
  todos.splice(i, 1);
  res.status(204).send();
});

app.delete('/todos/completed/all', (req, res) => {
  todos = todos.filter(t => !t.completed);
  res.json({ message: 'Cleared' });
});

app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server running at http://localhost:${PORT}`));
