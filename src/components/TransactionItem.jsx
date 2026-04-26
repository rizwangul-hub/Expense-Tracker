import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTransaction } from '../store/slices/transactionSlice';
import { openModal } from '../store/slices/uiSlice';
import { FiEdit2, FiTrash2, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import toast from 'react-hot-toast';

const TransactionItem = ({ transaction }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(transaction.id));
      toast.success('Transaction deleted');
    }
  };

  const handleEdit = () => {
    dispatch(openModal(transaction.id));
  };

  const isIncome = transaction.type === 'Income';

  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${isIncome ? 'bg-emerald-100 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400'}`}>
          {isIncome ? <FiTrendingUp size={20} /> : <FiTrendingDown size={20} />}
        </div>
        <div>
          <p className="text-base font-semibold text-slate-800 dark:text-slate-200">{transaction.title}</p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {new Date(transaction.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} 
            <span className="mx-1.5 opacity-50">•</span> 
            {transaction.category}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className={`text-lg font-bold tracking-tight ${isIncome ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
          {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleEdit} className="p-2 text-slate-400 hover:text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-500/10 rounded-xl transition-colors">
            <FiEdit2 />
          </button>
          <button onClick={handleDelete} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors">
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
