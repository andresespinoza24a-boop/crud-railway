const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      precio REAL
    )
  `);
});

// Obtener todos
app.get('/productos', (req, res) => {
  db.all('SELECT * FROM productos', [], (err, rows) => {
    res.json(rows);
  });
});

// Obtener uno
app.get('/productos/:id', (req, res) => {
  db.get('SELECT * FROM productos WHERE id = ?', [req.params.id], (err, row) => {
    res.json(row);
  });
});

// Agregar
app.post('/productos', (req, res) => {
  const { nombre, precio } = req.body;

  db.run(
    'INSERT INTO productos (nombre, precio) VALUES (?, ?)',
    [nombre, precio],
    function(err) {
      res.json({ id: this.lastID });
    }
  );
});

// Editar
app.put('/productos/:id', (req, res) => {
  const { nombre, precio } = req.body;

  db.run(
    'UPDATE productos SET nombre = ?, precio = ? WHERE id = ?',
    [nombre, precio, req.params.id],
    () => {
      res.json({ mensaje: 'Producto actualizado' });
    }
  );
});

// Eliminar
app.delete('/productos/:id', (req, res) => {
  db.run('DELETE FROM productos WHERE id = ?', [req.params.id], () => {
    res.json({ mensaje: 'Producto eliminado' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});