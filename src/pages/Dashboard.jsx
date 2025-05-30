import { supabase } from "../utils/supabaseClient";

function Dashboard() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="dashboard">
      <h1>Welcome to SplitEasy</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
