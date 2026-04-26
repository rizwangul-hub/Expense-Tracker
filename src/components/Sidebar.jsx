import React from 'react';
import { useFilters } from '../hooks/useFilters';
import { FiSearch, FiFilter } from 'react-icons/fi';

const expenseCategories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education', 'Other'];
const incomeCategories = ['Salary', 'Freelance', 'Gift', 'Other'];
const allCategories = [...expenseCategories, ...incomeCategories];

const Sidebar = () => {
  const { category, type, dateRange, searchTerm, sortBy, updateFilters, updateSearch, updateSort } = useFilters();

  let filterCategoryOptions = allCategories;
  if (type === 'Income') filterCategoryOptions = incomeCategories;
  if (type === 'Expense') filterCategoryOptions = expenseCategories;

  return (
    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <FiFilter className="text-teal-500" size={20} />
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Filters</h3>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search title..."
              value={searchTerm}
              onChange={(e) => updateSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Type</label>
          <select 
            value={type} 
            onChange={(e) => updateFilters({ type: e.target.value, category: 'All' })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Category</label>
          <select 
            value={category} 
            onChange={(e) => updateFilters({ category: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Categories</option>
            {filterCategoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Date Range</label>
          <select 
            value={dateRange} 
            onChange={(e) => updateFilters({ dateRange: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="All">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="thisMonth">This Month</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Sort By</label>
          <select 
            value={sortBy} 
            onChange={(e) => updateSort(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount (High to Low)</option>
            <option value="amount-asc">Amount (Low to High)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
