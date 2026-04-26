import { createSlice, createSelector } from '@reduxjs/toolkit';

const getInitialTransactions = () => {
  const user = localStorage.getItem('expense_tracker_user');
  if (!user) return [];
  const saved = localStorage.getItem(`expense_tracker_data_${user}`);
  return saved ? JSON.parse(saved) : [];
};

const saveTransactions = (transactions) => {
  const user = localStorage.getItem('expense_tracker_user');
  if (user) {
    localStorage.setItem(`expense_tracker_data_${user}`, JSON.stringify(transactions));
  }
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    transactions: getInitialTransactions(),
  },
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload); // add to top
      saveTransactions(state.transactions);
    },
    editTransaction: (state, action) => {
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
        saveTransactions(state.transactions);
      }
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter(t => t.id !== action.payload);
      saveTransactions(state.transactions);
    },
    loadTransactions: (state) => {
      state.transactions = getInitialTransactions();
    }
  }
});

export const { addTransaction, editTransaction, deleteTransaction, loadTransactions } = transactionSlice.actions;

// Base selector
export const selectAllTransactions = (state) => state.transactions.transactions;

// Derived Selectors
export const selectTotalIncome = createSelector(
  [selectAllTransactions],
  (transactions) => transactions.filter(t => t.type === 'Income').reduce((acc, curr) => acc + curr.amount, 0)
);

export const selectTotalExpenses = createSelector(
  [selectAllTransactions],
  (transactions) => transactions.filter(t => t.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0)
);

export const selectTotalBalance = createSelector(
  [selectTotalIncome, selectTotalExpenses],
  (income, expenses) => income - expenses
);

export const selectCategoryTotals = createSelector(
  [selectAllTransactions],
  (transactions) => {
    const expenses = transactions.filter(t => t.type === 'Expense');
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    return Object.keys(grouped).map(name => ({
      name,
      value: grouped[name]
    })).sort((a, b) => b.value - a.value);
  }
);

// Complex selector combining filters, search, and sort
export const selectFilteredTransactions = createSelector(
  [
    selectAllTransactions,
    (state) => state.filters.category,
    (state) => state.filters.type,
    (state) => state.filters.dateRange,
    (state) => state.filters.searchTerm,
    (state) => state.filters.sortBy,
  ],
  (transactions, category, type, dateRange, searchTerm, sortBy) => {
    let result = [...transactions];

    if (searchTerm) {
      result = result.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (type !== 'All') {
      result = result.filter(t => t.type === type);
    }

    if (category !== 'All') {
      result = result.filter(t => t.category === category);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateRange === '7days') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      result = result.filter(t => new Date(t.date) >= sevenDaysAgo);
    } else if (dateRange === 'thisMonth') {
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      result = result.filter(t => new Date(t.date) >= firstDayOfMonth);
    }
    // Custom date range logic can be added here if we expand state to include start/end dates

    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.date) - new Date(a.date) || b.id - a.id;
      } else if (sortBy === 'date-asc') {
        return new Date(a.date) - new Date(b.date) || a.id - b.id;
      } else if (sortBy === 'amount-desc') {
        return b.amount - a.amount;
      } else if (sortBy === 'amount-asc') {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }
);

export default transactionSlice.reducer;
