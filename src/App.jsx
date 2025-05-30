import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

function App() {
  const [expenses, setExpenses] = useState([]);

useEffect(() => {
  async function fetchExpenses() {
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
}, []);


  return (
    <div style={{ padding: '20px' }}>
      <h1>💸 SplitEasy</h1>
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
