import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

function ExpenseForm({ onExpenseAdded, session }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !paidBy) return alert('❌ Please fill all fields');

    const { error } = await supabase.from('expenses').insert([{
      title,
      amount: parseFloat(amount),
      paid_by: paidBy,
      user_id: session.user.id,
    }]);

    if (error) {
      alert('❌ Error: ' + error.message);
    } else {
      setTitle('');
      setAmount('');
      setPaidBy('');
      onExpenseAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">➕ Add New Expense</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
          <input
            type="text"
            placeholder="e.g. Dinner"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Amount (₹)</label>
          <input
            type="number"
            placeholder="e.g. 500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Paid By</label>
          <input
            type="text"
            placeholder="e.g. Vishal"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition"
        >
          ➕ Add Expense
        </button>
      </div>
    </form>
  );
}

export default ExpenseForm;
