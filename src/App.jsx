import { useEffect, useState } from 'react';
import { supabase } from './utils/supabaseClient';
import AuthComponent from './components/auth';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [expenses, setExpenses] = useState([]);

  // Check user session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch expenses when logged in
  useEffect(() => {
    async function fetchExpenses() {
      if (!session) return;

      console.log("📦 Fetching from Supabase...");
      const { data, error } = await supabase.from('expenses').select('*');
      if (error) {
        console.error("❌ Supabase error:", error.message);
      } else {
        console.log("✅ Data fetched:", data);
        setExpenses(data);
      }
    }

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
