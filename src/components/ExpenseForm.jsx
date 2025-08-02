import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function ExpenseForm({ onExpenseAdded, session }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !paidBy) return alert('Please fill all fields');

    const { error } = await supabase.from('expenses').insert([
      {
        title,
        amount: parseFloat(amount),
        paid_by: paidBy,
        user_id: session.user.id,
      },
    ]);

    if (error) alert('❌ Error: ' + error.message);
    else {
      setTitle('');
      setAmount('');
      setPaidBy('');
      onExpenseAdded();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl mx-auto mt-10 px-8 py-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl"
    >
      <h2 className="text-3xl font-extrabold text-white mb-6 text-center flex items-center justify-center gap-2">
        <span>💸</span> Add New Expense
      </h2>

      {/* Input Group */}
      <div className="space-y-5">
        {/* Title */}
        <div className="relative">
          <span className="absolute left-4 top-3 text-lg">📝</span>
          <input
            type="text"
            placeholder="Enter expense title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
          />
        </div>

        {/* Amount */}
        <div className="relative">
          <span className="absolute left-4 top-3 text-lg">💰</span>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          />
        </div>

        {/* Paid By */}
        <div className="relative">
          <span className="absolute left-4 top-3 text-lg">🙋</span>
          <input
            type="text"
            placeholder="Who paid?"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 text-center">
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-green-400 to-lime-500 hover:from-green-500 hover:to-lime-600 text-white font-semibold rounded-lg transition-all shadow-lg"
        >
          ➕ Add Expense
        </button>
      </div>
    </form>
  );
}
