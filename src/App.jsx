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
            <strong>{expense.title}</strong> - ₹{expense.amount} (Paid by: {expense.paid_by})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
