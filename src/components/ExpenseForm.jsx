import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

// ⬇ Accept session as a prop to get user ID
function ExpenseForm({ onExpenseAdded, session }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !amount || !paidBy) {
      alert('Please fill all fields.');
      return;
    }

    // ⬇ Insert the expense with user_id linked to current user
    const { data, error } = await supabase.from('expenses').insert([
      {
        title,
        amount: parseFloat(amount),
        paid_by: paidBy,
        user_id: session.user.id // ⬅️ Important line
      }
    ]);

    if (error) {
      console.error('❌ Error adding expense:', error.message);
    } else {
      console.log('✅ Expense added:', data);
      onExpenseAdded(); // Refresh list
      setTitle('');
      setAmount('');
      setPaidBy('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Add New Expense</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Paid by"
        value={paidBy}
        onChange={(e) => setPaidBy(e.target.value)}
      />
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;
