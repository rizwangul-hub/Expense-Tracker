import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction, editTransaction } from '../store/slices/transactionSlice';
import { closeModal } from '../store/slices/uiSlice';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FiX } from 'react-icons/fi';

const expenseCategories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education', 'Other'];
const incomeCategories = ['Salary', 'Freelance', 'Gift', 'Other'];

const TransactionModal = () => {
  const dispatch = useDispatch();
  const { isModalOpen, editingTransactionId } = useSelector(state => state.ui);
  const transactions = useSelector(state => state.transactions.transactions);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'Expense',
    category: expenseCategories[0],
    date: new Date()
  });

  useEffect(() => {
    if (editingTransactionId) {
      const t = transactions.find(tx => tx.id === editingTransactionId);
      if (t) {
        setFormData({
          title: t.title,
          amount: t.amount.toString(),
          type: t.type,
          category: t.category,
          date: new Date(t.date)
        });
      }
    } else {
      setFormData({
        title: '',
        amount: '',
        type: 'Expense',
        category: expenseCategories[0],
        date: new Date()
      });
    }
  }, [editingTransactionId, transactions, isModalOpen]);

  if (!isModalOpen) return null;

  const currentCategories = formData.type === 'Income' ? incomeCategories : expenseCategories;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || formData.title.length > 30) {
      toast.error("Title is required and max 30 characters.");
      return;
    }
    const amt = parseFloat(formData.amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Amount must be a positive number.");
      return;
    }

    const transactionData = {
      id: editingTransactionId || uuidv4(),
      title: formData.title,
      amount: amt,
      type: formData.type,
      category: formData.category,
      date: formData.date.toISOString().split('T')[0],
      createdAt: editingTransactionId ? undefined : Date.now()
    };

    if (editingTransactionId) {
      dispatch(editTransaction(transactionData));
      toast.success('Transaction updated successfully!');
    } else {
      dispatch(addTransaction(transactionData));
      toast.success('Transaction added successfully!');
    }
    
    dispatch(closeModal());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            {editingTransactionId ? 'Edit Transaction' : 'Add Transaction'}
          </h3>
          <button onClick={() => dispatch(closeModal())} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Title</label>
            <input type="text" maxLength="30" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Amount</label>
            <input type="number" min="0.01" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={formData.type === 'Expense'} onChange={() => setFormData({...formData, type: 'Expense', category: expenseCategories[0]})} className="text-rose-500 focus:ring-rose-500" />
                <span className="text-slate-700 dark:text-slate-300">Expense</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={formData.type === 'Income'} onChange={() => setFormData({...formData, type: 'Income', category: incomeCategories[0]})} className="text-emerald-500 focus:ring-emerald-500" />
                <span className="text-slate-700 dark:text-slate-300">Income</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Category</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
              {currentCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Date</label>
            <DatePicker 
              selected={formData.date} 
              onChange={(date) => setFormData({...formData, date})} 
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              dateFormat="yyyy-MM-dd"
            />
          </div>

          <button type="submit" className="w-full py-3 mt-6 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl transition-all">
            {editingTransactionId ? 'Save Changes' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
