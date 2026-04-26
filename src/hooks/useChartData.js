import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAllTransactions } from '../store/slices/transactionSlice';

export const useChartData = (transactionsProp) => {
  const reduxTransactions = useSelector(selectAllTransactions);
  const transactions = transactionsProp || reduxTransactions || [];

  const pieData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'Expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    return Object.keys(grouped).map(key => ({
      name: key,
      value: grouped[key]
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const barData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthYear = d.toLocaleDateString('default', { month: 'short', year: 'numeric' });
      data.push({ name: monthYear, income: 0, expense: 0, sortKey: d.getTime() });
    }

    transactions.forEach(t => {
      const tDate = new Date(t.date);
      const monthYear = tDate.toLocaleDateString('default', { month: 'short', year: 'numeric' });
      
      const monthData = data.find(m => m.name === monthYear);
      if (monthData) {
        if (t.type === 'Income') monthData.income += t.amount;
        if (t.type === 'Expense') monthData.expense += t.amount;
      }
    });

    return data;
  }, [transactions]);

  const lineData = useMemo(() => {
    const data = [];
    const today = new Date();
    today.setHours(0,0,0,0);
    
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const displayStr = d.toLocaleDateString('default', { month: 'short', day: 'numeric' });
      data.push({ name: displayStr, dateStr: dateStr, amount: 0 });
    }

    const expenses = transactions.filter(t => t.type === 'Expense');
    expenses.forEach(t => {
      const dayData = data.find(d => d.dateStr === t.date);
      if (dayData) {
        dayData.amount += t.amount;
      }
    });

    return data;
  }, [transactions]);

  return { pieData, barData, lineData };
};
