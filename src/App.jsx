import { useEffect, useState } from 'react';
import { supabase } from './utils/supabaseClient';
import AuthComponent from './components/auth';
import ExpenseForm from './components/ExpenseForm';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [expenses, setExpenses] = useState([]);

  // Get session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch expenses for the logged-in user
  const fetchExpenses = async () => {
    if (!session?.user) return;

    console.log("📦 Fetching expenses for:", session.user.id);
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("❌ Error fetching expenses:", error.message);
    } else {
      setExpenses(data);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setExpenses([]);
  };

  const handleDeleteExpense = async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) {
      alert("❌ Failed to delete expense: " + error.message);
    } else {
      fetchExpenses();
    }
  };

  const handleEditExpense = async (expense) => {
    const newTitle = prompt("Edit title", expense.title);
    const newAmount = prompt("Edit amount", expense.amount);
    const newPaidBy = prompt("Edit paid by", expense.paid_by);

    if (!newTitle || !newAmount || !newPaidBy) return;

    const { error } = await supabase.from('expenses').update({
      title: newTitle,
      amount: parseFloat(newAmount),
      paid_by: newPaidBy,
    }).eq('id', expense.id);

    if (error) {
      alert("❌ Failed to update: " + error.message);
    } else {
      fetchExpenses();
    }
  };

  if (!session) return <AuthComponent />;

  return (
    <div style={{ padding: '20px' }}>
      <h1>💸 SplitEasy</h1>
      <button onClick={handleLogout} style={{ marginBottom: '20px' }}>
        Logout
      </button>

      <ExpenseForm onExpenseAdded={fetchExpenses} session={session} />

      <h2>Expense List</h2>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            <strong>{expense.title}</strong> - ₹{expense.amount} <br />
            <span>👤 Paid by: {expense.paid_by}</span> <br />
            <span>🕒 Added on: {new Date(expense.created_at).toLocaleString()}</span> <br />

            <button onClick={() => handleEditExpense(expense)} style={{ marginRight: '10px' }}>✏️ Edit</button>
            <button onClick={() => handleDeleteExpense(expense.id)}>🗑️ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
