// backend/server.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// GET all products
app.get('/products', async (req, res) => {
  const result = await pool.query('SELECT * FROM products');
  res.json(result.rows);
});

// POST a new product
app.post('/products', async (req, res) => {
  const { name, description, price, quantity } = req.body;
  const result = await pool.query(
    'INSERT INTO products (name, description, price, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, description, price, quantity]
  );
  res.json(result.rows[0]);
});

// PUT (update) a product by ID
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;
  const result = await pool.query(
    'UPDATE products SET name = $1, description = $2, price = $3, quantity = $4 WHERE id = $5 RETURNING *',
    [name, description, price, quantity, id]
  );
  res.json(result.rows[0]);
});

// DELETE a product by ID
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM products WHERE id = $1', [id]);
  res.json({ message: 'Product deleted' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
