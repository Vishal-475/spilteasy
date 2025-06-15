import React from 'react';

export default function BalanceSummary({ expenses }) {
  if (!expenses || expenses.length === 0) return <p>No expenses yet.</p>;

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const paidByMap = {};
  expenses.forEach(e => { paidByMap[e.paid_by] = (paidByMap[e.paid_by] || 0) + e.amount; });

  const participants = Object.keys(paidByMap);
  const share = total / participants.length;

  const balances = {};
  participants.forEach(user => { balances[user] = paidByMap[user] - share; });

  const creditors = [], debtors = [];
  Object.entries(balances).forEach(([person, bal]) => {
    if (bal > 0) creditors.push({ person, amount: bal });
    else if (bal < 0) debtors.push({ person, amount: -bal });
  });

  const transactions = [];
  while (creditors.length && debtors.length) {
    const c = creditors[0], d = debtors[0];
    const amt = Math.min(c.amount, d.amount);
    transactions.push(`${d.person} owes ₹${amt.toFixed(2)} to ${c.person}`);
    c.amount -= amt; d.amount -= amt;
    if (c.amount < 0.01) creditors.shift();
    if (d.amount < 0.01) debtors.shift();
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">💰 Balance Summary</h2>
      <ul className="list-disc list-inside text-gray-700">
        {transactions.length === 0
          ? <li>All settled up! 🎉</li>
          : transactions.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}
