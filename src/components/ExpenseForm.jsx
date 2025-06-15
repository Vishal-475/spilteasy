import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function ExpenseForm({ onExpenseAdded, session }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !paidBy) {
      alert('Please fill all fields.');
      return;
    }
    const { error } = await supabase.from('expenses').insert([{
      title,
      amount: parseFloat(amount),
      paid_by: paidBy,
      user_id: session.user.id
    }]);
    if (error) console.error('Error adding expense:', error.message);
    else {
      setTitle('');
      setAmount('');
      setPaidBy('');
      onExpenseAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
      <h2 className="text-xl font-semibold">Add New Expense</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="p-2 border rounded"
        />
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Amount"
          className="p-2 border rounded"
        />
        <input
          value={paidBy}
          onChange={e => setPaidBy(e.target.value)}
          placeholder="Paid by"
          className="p-2 border rounded col-span-1 sm:col-span-2"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Add Expense
      </button>
    </form>
  );
}
