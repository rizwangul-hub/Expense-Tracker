import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { logout } from './store/slices/uiSlice';

function App() {
  const user = useSelector((state) => state.ui.user);
  const theme = useSelector((state) => state.ui.theme);
  const dispatch = useDispatch();

  // Apply theme class to HTML element on mount and on theme change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'dark:bg-slate-800 dark:text-white border dark:border-slate-700',
          style: {
            background: theme === 'dark' ? '#1e293b' : '#fff',
            color: theme === 'dark' ? '#fff' : '#334155',
          }
        }}
      />
      {user ? <Dashboard user={user} onLogout={handleLogout} /> : <Auth />}
    </>
  );
}

export default App;
