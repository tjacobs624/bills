import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [paychecks, setPaychecks] = useState([]);
  const [bills, setBills] = useState([]);
  const [paycheckForm, setPaycheckForm] = useState({date: '', amount: ''});
  const [billForm, setBillForm] = useState({description: '', amount: '', dueDate: '', paycheckId: ''});

  useEffect(() => {
    fetchPaychecks();
    fetchBills();
  }, []);

  const fetchPaychecks = async () => {
    const res = await fetch('http://localhost:3001/api/paychecks');
    const data = await res.json();
    setPaychecks(data);
  };

  const fetchBills = async () => {
    const res = await fetch('http://localhost:3001/api/bills');
    const data = await res.json();
    setBills(data);
  };

  const handlePaycheckSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3001/api/paychecks', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        date: paycheckForm.date,
        amount: parseFloat(paycheckForm.amount)
      })
    });
    setPaycheckForm({date: '', amount: ''});
    fetchPaychecks();
  };

  const handleBillSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3001/api/bills', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        description: billForm.description,
        amount: parseFloat(billForm.amount),
        dueDate: billForm.dueDate,
        paycheckId: billForm.paycheckId || null
      })
    });
    setBillForm({description: '', amount: '', dueDate: '', paycheckId: ''});
    fetchBills();
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Bill Manager</h1>

      <div className="row">
        <div className="col-md-6">
          <h2>Add Paycheck</h2>
          <form onSubmit={handlePaycheckSubmit} className="mb-4">
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" value={paycheckForm.date} onChange={e => setPaycheckForm({...paycheckForm, date: e.target.value})} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Amount</label>
              <input type="number" step="0.01" className="form-control" value={paycheckForm.amount} onChange={e => setPaycheckForm({...paycheckForm, amount: e.target.value})} required />
            </div>
            <button className="btn btn-primary" type="submit">Add Paycheck</button>
          </form>

          <h2>Add Bill</h2>
          <form onSubmit={handleBillSubmit} className="mb-4">
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input type="text" className="form-control" value={billForm.description} onChange={e => setBillForm({...billForm, description: e.target.value})} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Amount</label>
              <input type="number" step="0.01" className="form-control" value={billForm.amount} onChange={e => setBillForm({...billForm, amount: e.target.value})} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Due Date</label>
              <input type="date" className="form-control" value={billForm.dueDate} onChange={e => setBillForm({...billForm, dueDate: e.target.value})} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Paycheck</label>
              <select className="form-select" value={billForm.paycheckId} onChange={e => setBillForm({...billForm, paycheckId: e.target.value})}>
                <option value="">Unassigned</option>
                {paychecks.map(p => (
                  <option key={p.id} value={p.id}>{p.date} - ${p.amount}</option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" type="submit">Add Bill</button>
          </form>
        </div>

        <div className="col-md-6">
          <h2>Paychecks</h2>
          <ul className="list-group mb-4">
            {paychecks.map(p => {
              const total = bills.filter(b => b.paycheckId === p.id).reduce((sum, b) => sum + b.amount, 0);
              const remaining = p.amount - total;
              return (
                <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {p.date} - ${p.amount.toFixed(2)}
                  <span>
                    <span className="badge bg-secondary me-2">
                      {total.toFixed(2)} / {p.amount.toFixed(2)}
                    </span>
                    <span className="badge bg-success">
                      {remaining.toFixed(2)} left
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          <h2>Bills</h2>
          <ul className="list-group">
            {bills.map(b => (
              <li key={b.id} className="list-group-item">
                {b.description} - ${b.amount.toFixed(2)} due {b.dueDate}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
