const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
// Allow overriding the database path for tests
const DB_PATH = process.env.DB_PATH || 'bills.db';
const db = new sqlite3.Database(DB_PATH);

app.use(cors());
app.use(bodyParser.json());

// Initialize tables
// paychecks table: id, date (text), amount
// bills table: id, description, amount, dueDate, paycheckId

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS paychecks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    amount REAL NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    amount REAL NOT NULL,
    dueDate TEXT NOT NULL,
    paycheckId INTEGER,
    FOREIGN KEY(paycheckId) REFERENCES paychecks(id)
  )`);
});

// Routes
app.get('/api/paychecks', (req, res) => {
  db.all('SELECT * FROM paychecks', [], (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.post('/api/paychecks', (req, res) => {
  const {date, amount} = req.body;
  db.run('INSERT INTO paychecks(date, amount) VALUES(?, ?)', [date, amount], function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({id: this.lastID});
  });
});

app.post('/api/paychecks/generate', (req, res) => {
  const { startDate, amount, count } = req.body;
  if (!startDate || !amount || !count) {
    return res.status(400).json({error: 'startDate, amount and count are required'});
  }

  const date = new Date(startDate);
  db.serialize(() => {
    const stmt = db.prepare('INSERT INTO paychecks(date, amount) VALUES(?, ?)');
    for (let i = 0; i < count; i++) {
      stmt.run(date.toISOString().slice(0, 10), amount);
      date.setDate(date.getDate() + 14);
    }
    stmt.finalize(err => {
      if (err) return res.status(500).json({error: err.message});
      res.json({created: count});
    });
  });
});

app.put('/api/paychecks/:id', (req, res) => {
  const { date, amount } = req.body;
  db.run('UPDATE paychecks SET date = ?, amount = ? WHERE id = ?', [date, amount, req.params.id], function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({changes: this.changes});
  });
});

app.get('/api/bills', (req, res) => {
  db.all('SELECT * FROM bills', [], (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.get('/api/paychecks/:id/bills', (req, res) => {
  db.all('SELECT * FROM bills WHERE paycheckId = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.get('/api/paychecks/:id/summary', (req, res) => {
  const id = req.params.id;
  db.get('SELECT amount FROM paychecks WHERE id = ?', [id], (err, paycheck) => {
    if (err || !paycheck) return res.status(500).json({error: err?.message || 'Paycheck not found'});
    db.all('SELECT amount FROM bills WHERE paycheckId = ?', [id], (err2, bills) => {
      if (err2) return res.status(500).json({error: err2.message});
      const totalBills = bills.reduce((sum, b) => sum + b.amount, 0);
      res.json({paycheckAmount: paycheck.amount, totalBills, remaining: paycheck.amount - totalBills});
    });
  });
});

app.post('/api/bills', (req, res) => {
  const { description, amount, dueDate, paycheckId } = req.body;

  const insertBill = (assignedId) => {
    db.run(
      'INSERT INTO bills(description, amount, dueDate, paycheckId) VALUES(?, ?, ?, ?)',
      [description, amount, dueDate, assignedId],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, paycheckId: assignedId });
      }
    );
  };

  if (paycheckId) {
    insertBill(paycheckId);
  } else {
    db.get(
      'SELECT id FROM paychecks WHERE date <= ? ORDER BY date DESC LIMIT 1',
      [dueDate],
      (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        insertBill(row ? row.id : null);
      }
    );
  }
});

if (require.main === module) {
  app.listen(3001, () => {
    console.log('Server running on port 3001');
  });
}

module.exports = app;
