import { useEffect, useState } from 'react';
import { supabase } from './utils/supabaseClient';
import AuthComponent from './components/auth';
import ExpenseForm from './components/ExpenseForm';
import BalanceSummary from './components/BalanceSummary';
import './index.css';

function App() {
  const [session, setSession] = useState(null);
  const [expenses, setExpenses] = useState([]);

  // Get session on load
  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => setSession(session));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch expenses
  const fetchExpenses = async () => {
    if (!session?.user) return;
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error.message);
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
    if (error) alert('❌ Error deleting expense: ' + error.message);
    else fetchExpenses();
  };

  const handleEditExpense = async (expense) => {
    const newTitle = prompt('Edit title', expense.title);
    const newAmount = prompt('Edit amount', expense.amount);
    const newPaidBy = prompt('Edit paid by', expense.paid_by);
    if (!newTitle || !newAmount || !newPaidBy) return;

    const { error } = await supabase.from('expenses').update({
      title: newTitle,
      amount: parseFloat(newAmount),
      paid_by: newPaidBy
    }).eq('id', expense.id);

    if (error) alert('❌ Error updating: ' + error.message);
    else fetchExpenses();
  };

  if (!session) return <AuthComponent />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">💸 SplitEasy</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <ExpenseForm onExpenseAdded={fetchExpenses} session={session} />

        <h2 className="text-2xl font-semibold mt-6 mb-4">Expense List</h2>
        <ul className="space-y-4">
          {expenses.map(expense => (
            <li key={expense.id} className="bg-gray-50 p-4 rounded shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{expense.title}</h3>
                  <p className="text-gray-700">₹{expense.amount}</p>
                  <p className="text-gray-500 text-sm">
                    👤 {expense.paid_by} &middot; 🕒 {new Date(expense.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2 text-sm">
                  <button
                    onClick={() => handleEditExpense(expense)}
                    className="text-blue-500 hover:underline"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="text-red-500 hover:underline"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 border-t pt-6">
          <BalanceSummary expenses={expenses} />
        </div>
      </div>
    </div>
  );
}

export default App;
