import React from 'react';
import { useSelector } from 'react-redux';
import { selectTotalBalance, selectTotalIncome, selectTotalExpenses } from '../store/slices/transactionSlice';

const SummaryCards = () => {
  const balance = useSelector(selectTotalBalance);
  const income = useSelector(selectTotalIncome);
  const expenses = useSelector(selectTotalExpenses);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 border border-slate-700 shadow-lg relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-sm font-medium text-slate-400 mb-1">Total Balance</p>
          <h3 className={`text-4xl font-bold mb-2 ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${Math.abs(balance).toFixed(2)}
          </h3>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Income</p>
        <h3 className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
          +${income.toFixed(2)}
        </h3>
      </div>

      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Expenses</p>
        <h3 className="text-2xl font-bold text-rose-500 dark:text-rose-400">
          -${expenses.toFixed(2)}
        </h3>
      </div>
    </div>
  );
};

export default SummaryCards;
