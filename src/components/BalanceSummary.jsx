import React from 'react';

function BalanceSummary({ expenses }) {
  if (!expenses || expenses.length === 0) return <p>No expenses yet.</p>;

  // Step 1: Total amount spent
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Step 2: Calculate paid per person
  const paidByMap = {};
  expenses.forEach((exp) => {
    if (!paidByMap[exp.paid_by]) paidByMap[exp.paid_by] = 0;
    paidByMap[exp.paid_by] += exp.amount;
  });

  // Step 3: Even share
  const participants = Object.keys(paidByMap);
  const sharePerPerson = total / participants.length;

  // Step 4: Calculate net balance
  const balances = {};
  for (const person of participants) {
    balances[person] = paidByMap[person] - sharePerPerson;
  }

  // Step 5: Build readable output
  const result = [];
  const creditors = [];
  const debtors = [];

  for (const [person, balance] of Object.entries(balances)) {
    if (balance > 0) creditors.push({ person, amount: balance });
    else if (balance < 0) debtors.push({ person, amount: -balance });
  }

  while (creditors.length > 0 && debtors.length > 0) {
    const creditor = creditors[0];
    const debtor = debtors[0];
    const amount = Math.min(creditor.amount, debtor.amount);

    result.push(`${debtor.person} owes ₹${amount.toFixed(2)} to ${creditor.person}`);

    creditor.amount -= amount;
    debtor.amount -= amount;

    if (creditor.amount < 0.01) creditors.shift();
    if (debtor.amount < 0.01) debtors.shift();
  }

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>💰 Balance Summary</h2>
      <ul>
        {result.length === 0 ? (
          <li>All settled up! 🎉</li>
        ) : (
          result.map((line, idx) => <li key={idx}>{line}</li>)
        )}
      </ul>
    </div>
  );
}

export default BalanceSummary;
