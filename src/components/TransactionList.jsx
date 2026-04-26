import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilteredTransactions } from '../store/slices/transactionSlice';
import { openModal } from '../store/slices/uiSlice';
import TransactionItem from './TransactionItem';
import { FiPlus } from 'react-icons/fi';

const TransactionList = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectFilteredTransactions);

  return (
    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Transactions</h3>
        <button
          onClick={() => dispatch(openModal())}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium transition-colors"
        >
          <FiPlus />
          <span className="hidden sm:inline">Add New</span>
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/50 flex-grow">
        {transactions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">No transactions found</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Try adjusting your filters or add a new one.</p>
          </div>
        ) : (
          transactions.map(t => <TransactionItem key={t.id} transaction={t} />)
        )}
      </div>
    </div>
  );
};

export default TransactionList;
