import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const saved = localStorage.getItem('expense_tracker_theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getInitialUser = () => {
  const saved = localStorage.getItem('expense_tracker_user');
  if (saved === 'undefined' || saved === 'null' || !saved) return null;
  try {
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch (e) {
    // Legacy support for string names
    return { name: saved, avatar: null };
  }
  return { name: saved, avatar: null };
};

const initialState = {
  isModalOpen: false,
  editingTransactionId: null, // null means adding a new transaction
  isLoading: false,
  theme: getInitialTheme(),
  user: getInitialUser()
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.editingTransactionId = action.payload || null;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.editingTransactionId = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('expense_tracker_theme', state.theme);
      
      // Update HTML class
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('expense_tracker_user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('expense_tracker_user');
    }
  }
});

export const { openModal, closeModal, setLoading, toggleTheme, login, logout } = uiSlice.actions;

export default uiSlice.reducer;
