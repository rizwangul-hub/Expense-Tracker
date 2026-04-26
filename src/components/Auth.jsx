import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/uiSlice';
import { loadTransactions } from '../store/slices/transactionSlice';
import { FiUpload, FiUser } from 'react-icons/fi';

const Auth = () => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(login({ name: name.trim(), avatar }));
      dispatch(loadTransactions());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/20 transform transition-transform hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome to ExpenseTracker
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          Manage your finances with style
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-slate-200 dark:border-slate-800 backdrop-blur-xl transition-all hover:shadow-2xl hover:shadow-teal-500/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div 
                className="relative w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-teal-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatar ? (
                  <img src={avatar} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="w-8 h-8 text-slate-400 group-hover:text-teal-500 transition-colors" />
                )}
                
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiUpload className="w-6 h-6 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Add a profile picture (optional)</p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                What should we call you?
              </label>
              <div className="mt-2 relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white transition-all focus:bg-white dark:focus:bg-slate-900"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300 active:scale-95 dark:focus:ring-offset-slate-900 hover:shadow-lg hover:shadow-teal-500/30"
              >
                Continue to Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
