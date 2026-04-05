import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const FinanceContext = createContext();

const CATEGORY_META = {
  Salary: { color: '#6366f1', emoji: '💼' },
  Freelance: { color: '#8b5cf6', emoji: '💻' },
  Food: { color: '#f59e0b', emoji: '🍔' },
  Rent: { color: '#ef4444', emoji: '🏠' },
  Utilities: { color: '#06b6d4', emoji: '💡' },
  Entertainment: { color: '#ec4899', emoji: '🎬' },
  Healthcare: { color: '#10b981', emoji: '🏥' },
  Shopping: { color: '#f97316', emoji: '🛍️' },
  Travel: { color: '#14b8a6', emoji: '✈️' },
  Education: { color: '#a855f7', emoji: '📚' },
  Investment: { color: '#22c55e', emoji: '📈' },
  Other: { color: '#64748b', emoji: '📌' },
};

const initialTransactions = [
  { id: '1', date: '2024-01-05', category: 'Salary', amount: 4800, type: 'income', note: 'January paycheck' },
  { id: '2', date: '2024-01-06', category: 'Rent', amount: 1200, type: 'expense', note: 'Apartment rent' },
  { id: '3', date: '2024-01-08', category: 'Utilities', amount: 95, type: 'expense', note: 'Electricity bill' },
  { id: '4', date: '2024-01-10', category: 'Food', amount: 65, type: 'expense', note: 'Weekly groceries' },
  { id: '5', date: '2024-01-14', category: 'Entertainment', amount: 15, type: 'expense', note: 'Streaming subscription' },
  { id: '6', date: '2024-01-18', category: 'Healthcare', amount: 40, type: 'expense', note: 'Vitamin supplements' },
  { id: '7', date: '2024-01-22', category: 'Food', amount: 42, type: 'expense', note: 'Restaurant dinner' },
  { id: '8', date: '2024-01-25', category: 'Shopping', amount: 120, type: 'expense', note: 'New headphones' },
  { id: '9', date: '2024-01-28', category: 'Freelance', amount: 350, type: 'income', note: 'Logo design project' },
  { id: '10', date: '2024-02-03', category: 'Salary', amount: 4800, type: 'income', note: 'February paycheck' },
  { id: '11', date: '2024-02-04', category: 'Rent', amount: 1200, type: 'expense', note: 'Apartment rent' },
  { id: '12', date: '2024-02-06', category: 'Investment', amount: 500, type: 'expense', note: 'Index fund contribution' },
  { id: '13', date: '2024-02-09', category: 'Food', amount: 78, type: 'expense', note: 'Grocery run' },
  { id: '14', date: '2024-02-12', category: 'Utilities', amount: 110, type: 'expense', note: 'Internet + phone' },
  { id: '15', date: '2024-02-15', category: 'Education', amount: 29, type: 'expense', note: 'Online course' },
  { id: '16', date: '2024-02-18', category: 'Entertainment', amount: 35, type: 'expense', note: 'Concert tickets' },
  { id: '17', date: '2024-02-22', category: 'Shopping', amount: 85, type: 'expense', note: 'Winter jacket' },
  { id: '18', date: '2024-02-26', category: 'Freelance', amount: 600, type: 'income', note: 'Website project' },
  { id: '19', date: '2024-03-01', category: 'Salary', amount: 5000, type: 'income', note: 'March paycheck (raise)' },
  { id: '20', date: '2024-03-02', category: 'Rent', amount: 1200, type: 'expense', note: 'Apartment rent' },
  { id: '21', date: '2024-03-05', category: 'Utilities', amount: 88, type: 'expense', note: 'Electricity' },
  { id: '22', date: '2024-03-07', category: 'Food', amount: 55, type: 'expense', note: 'Groceries' },
  { id: '23', date: '2024-03-10', category: 'Travel', amount: 220, type: 'expense', note: 'Weekend trip bus' },
  { id: '24', date: '2024-03-12', category: 'Food', amount: 30, type: 'expense', note: 'Lunch with colleague' },
  { id: '25', date: '2024-03-15', category: 'Healthcare', amount: 60, type: 'expense', note: 'Doctor visit copay' },
  { id: '26', date: '2024-03-18', category: 'Freelance', amount: 200, type: 'income', note: 'Quick gig' },
  { id: '27', date: '2024-03-20', category: 'Food', amount: 90, type: 'expense', note: 'Birthday dinner' },
  { id: '28', date: '2024-03-23', category: 'Entertainment', amount: 12, type: 'expense', note: 'Movie rental' },
  { id: '29', date: '2024-03-25', category: 'Investment', amount: 500, type: 'expense', note: 'Monthly SIP' },
  { id: '30', date: '2024-03-28', category: 'Freelance', amount: 450, type: 'income', note: 'App UI mockups' },
];

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('fin_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { /* ignore corrupted storage */ }
    return initialTransactions;
  });

  const [role, setRole] = useState('Admin');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('fin_darkMode');
      return saved ? JSON.parse(saved) : true;
    } catch { return true; }
  });

  useEffect(() => {
    localStorage.setItem('fin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fin_darkMode', JSON.stringify(isDarkMode));
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const addTransaction = useCallback((transaction) => {
    if (role !== 'Admin') return;
    setTransactions(prev => [{ ...transaction, id: Date.now().toString() }, ...prev]);
  }, [role]);

  const updateTransaction = useCallback((id, updates) => {
    if (role !== 'Admin') return;
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [role]);

  const deleteTransaction = useCallback((id) => {
    if (role !== 'Admin') return;
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, [role]);

  const resetData = useCallback(() => {
    setTransactions(initialTransactions);
    localStorage.removeItem('fin_transactions');
  }, []);

  const summary = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { totalBalance: income - expenses, totalIncome: income, totalExpenses: expenses };
  }, [transactions]);

  const insights = useMemo(() => {
    const expensesByCategory = {};
    const monthlyTotals = {};

    transactions.forEach(t => {
      const month = t.date.substring(0, 7);
      if (!monthlyTotals[month]) monthlyTotals[month] = { income: 0, expense: 0 };
      monthlyTotals[month][t.type] += t.amount;

      if (t.type === 'expense') {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      }
    });

    const sortedCategories = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);
    const topCategory = sortedCategories[0] || ['None', 0];

    const months = Object.keys(monthlyTotals).sort();
    let savingsRate = 0;
    if (months.length > 0) {
      const latest = monthlyTotals[months[months.length - 1]];
      savingsRate = latest.income > 0 ? ((latest.income - latest.expense) / latest.income * 100) : 0;
    }

    let monthOverMonthChange = null;
    if (months.length >= 2) {
      const curr = monthlyTotals[months[months.length - 1]].expense;
      const prev = monthlyTotals[months[months.length - 2]].expense;
      monthOverMonthChange = prev > 0 ? ((curr - prev) / prev * 100) : 0;
    }

    const avgTransaction = transactions.length > 0
      ? transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) / transactions.filter(t => t.type === 'expense').length
      : 0;

    return {
      topCategory: { name: topCategory[0], amount: topCategory[1] },
      savingsRate: Math.round(savingsRate),
      monthOverMonthChange: monthOverMonthChange !== null ? Math.round(monthOverMonthChange * 10) / 10 : null,
      avgExpense: Math.round(avgTransaction),
      totalTransactions: transactions.length,
      categoryBreakdown: sortedCategories,
    };
  }, [transactions]);

  const exportCSV = useCallback(() => {
    const headers = ['Date', 'Category', 'Type', 'Amount', 'Note'];
    const rows = transactions.map(t => [t.date, t.category, t.type, t.amount, `"${t.note || ''}"`]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [transactions]);

  return (
    <FinanceContext.Provider value={{
      transactions, role, setRole, isDarkMode, setIsDarkMode,
      summary, insights, addTransaction, updateTransaction,
      deleteTransaction, resetData, exportCSV, CATEGORY_META,
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
