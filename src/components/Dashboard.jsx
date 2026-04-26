import React, { useState, useEffect } from "react";
import Charts from "./Charts";
import ThemeToggle from "./ThemeToggle";
import { FiClock, FiUser } from "react-icons/fi";

const Dashboard = ({ user, onLogout }) => {
  // Handle both string and object user formats for backward compatibility
  const userName = typeof user === "string" ? user : user?.name || "Guest";
  const userAvatar = typeof user === "object" ? user?.avatar : null;

  const storageKey = `expense_tracker_data_${userName}`;

  // Initialize state from localStorage or use empty array
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    // Get current time in Pakistan (Asia/Karachi) - UTC+5
    const now = new Date();
    const pakistanTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Karachi" }),
    );
    const hour = pakistanTime.getHours();

    if (hour < 5) return "Good night";
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 20) return "Good evening";
    return "Good night";
  };

  const expenseCategories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Other",
  ];

  const incomeCategories = ["Salary", "Freelance", "Gift", "Other"];

  const allCategories = [...expenseCategories, ...incomeCategories];

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    amount: "",
    category: expenseCategories[0],
    date: new Date().toISOString().split("T")[0],
    type: "Expense",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Filters State
  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDateRange, setFilterDateRange] = useState("All");
  const [customDateStart, setCustomDateStart] = useState("");
  const [customDateEnd, setCustomDateEnd] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");

  // Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(transactions));
  }, [transactions, storageKey]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      const newCategories =
        value === "Income" ? incomeCategories : expenseCategories;
      setFormData({
        ...formData,
        type: value,
        category: newCategories[0],
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || formData.title.length > 30) return;
    if (!formData.amount || Number(formData.amount) <= 0) return;

    const transactionData = {
      ...formData,
      amount: Number(formData.amount),
      id: isEditing ? formData.id : Date.now(),
    };

    if (isEditing) {
      setTransactions(
        transactions.map((t) => (t.id === formData.id ? transactionData : t)),
      );
      setIsEditing(false);
    } else {
      setTransactions([transactionData, ...transactions]);
    }

    // Reset form
    setFormData({
      id: null,
      title: "",
      amount: "",
      category: expenseCategories[0],
      date: new Date().toISOString().split("T")[0],
      type: "Expense",
    });
  };

  const handleEdit = (transaction) => {
    setIsEditing(true);
    setFormData({
      id: transaction.id,
      title: transaction.title,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.date,
      type: transaction.type,
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  // Calculating summaries based on ALL transactions (not filtered)
  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpenses;

  const currentCategories =
    formData.type === "Income" ? incomeCategories : expenseCategories;

  // Filter & Sort Logic
  const getFilteredAndSortedTransactions = () => {
    let result = [...transactions];

    // Search by title
    if (searchQuery) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by Type
    if (filterType !== "All") {
      result = result.filter((t) => t.type === filterType);
    }

    // Filter by Category
    if (filterCategory !== "All") {
      result = result.filter((t) => t.category === filterCategory);
    }

    // Filter by Date Range
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filterDateRange === "7days") {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      result = result.filter((t) => new Date(t.date) >= sevenDaysAgo);
    } else if (filterDateRange === "thisMonth") {
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );
      result = result.filter((t) => new Date(t.date) >= firstDayOfMonth);
    } else if (filterDateRange === "custom") {
      if (customDateStart) {
        result = result.filter(
          (t) => new Date(t.date) >= new Date(customDateStart),
        );
      }
      if (customDateEnd) {
        result = result.filter(
          (t) => new Date(t.date) <= new Date(customDateEnd),
        );
      }
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "date_desc") {
        return new Date(b.date) - new Date(a.date) || b.id - a.id;
      } else if (sortBy === "date_asc") {
        return new Date(a.date) - new Date(b.date) || a.id - b.id;
      } else if (sortBy === "amount_desc") {
        return b.amount - a.amount;
      } else if (sortBy === "amount_asc") {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  };

  const displayedTransactions = getFilteredAndSortedTransactions();

  // Dynamic category options for filter based on selected type
  let filterCategoryOptions = allCategories;
  if (filterType === "Income") filterCategoryOptions = incomeCategories;
  if (filterType === "Expense") filterCategoryOptions = expenseCategories;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-teal-500/30 pb-12 transition-colors duration-300">
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300 shadow-sm dark:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 transform transition-transform hover:rotate-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500 dark:from-teal-400 dark:to-emerald-300 hidden sm:block">
                Expense Tracker
              </h1>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl transition-colors duration-300">
                <FiClock className="w-4 h-4 text-teal-500" />
                <span className="text-sm font-medium">
                  {currentTime.toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  •{" "}
                  {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <ThemeToggle />

              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {getGreeting()}
                  </span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {userName}
                  </span>
                </div>

                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-teal-500/50 shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-slate-800 flex items-center justify-center border-2 border-teal-500/50 text-teal-600 dark:text-teal-400 shadow-sm">
                    <span className="font-bold text-sm">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <button
                  onClick={onLogout}
                  className="ml-2 px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all duration-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {getGreeting()}, {userName}! Here's your financial overview.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-6 shadow-xl shadow-teal-500/20 relative overflow-hidden group transform transition-transform hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-white/20 transition-colors"></div>
            <div className="relative z-10">
              <p className="text-sm font-medium text-teal-100 mb-1">
                Total Balance
              </p>
              <h3 className="text-4xl font-bold text-white mb-2">
                ${balance.toFixed(2)}
              </h3>
            </div>
          </div>

          <div
            className="bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center transform transition-all hover:-translate-y-1 hover:shadow-md animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Income
            </p>
            <h3 className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
              ${totalIncome.toFixed(2)}
            </h3>
          </div>

          <div
            className="bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center transform transition-all hover:-translate-y-1 hover:shadow-md animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Expenses
            </p>
            <h3 className="text-2xl font-bold text-rose-500 dark:text-rose-400">
              ${totalExpenses.toFixed(2)}
            </h3>
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          <Charts transactions={transactions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div
              className="bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm sticky top-28 animate-fade-in-up transition-colors duration-300 hover:shadow-md"
              style={{ animationDelay: "0.5s" }}
            >
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
                {isEditing ? "Edit Transaction" : "Add New Transaction"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    maxLength="30"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors"
                    placeholder="E.g., Groceries"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    required
                    min="0.01"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Type
                  </label>
                  <div className="flex gap-4 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded-full border ${formData.type === "Expense" ? "border-rose-500 border-[5px]" : "border-slate-400 group-hover:border-rose-400"} transition-all`}
                      ></div>
                      <input
                        type="radio"
                        name="type"
                        value="Expense"
                        checked={formData.type === "Expense"}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        Expense
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div
                        className={`w-4 h-4 rounded-full border ${formData.type === "Income" ? "border-emerald-500 border-[5px]" : "border-slate-400 group-hover:border-emerald-400"} transition-all`}
                      ></div>
                      <input
                        type="radio"
                        name="type"
                        value="Income"
                        checked={formData.type === "Income"}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        Income
                      </span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors"
                  >
                    {currentCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 mt-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-medium rounded-xl transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg hover:shadow-teal-500/30"
                >
                  {isEditing ? "Update Transaction" : "Add Transaction"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        id: null,
                        title: "",
                        amount: "",
                        category: expenseCategories[0],
                        date: new Date().toISOString().split("T")[0],
                        type: "Expense",
                      });
                    }}
                    className="w-full py-3 mt-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-all duration-200"
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Transactions List & Filters */}
          <div className="lg:col-span-3">
            <div
              className="bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm h-full flex flex-col animate-fade-in-up transition-colors duration-300"
              style={{ animationDelay: "0.6s" }}
            >
              {/* Filters Header */}
              <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                    Transactions History
                  </h3>

                  {/* Search */}
                  <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-4 w-4 text-slate-400 dark:text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search by title..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap gap-3">
                  <select
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      setFilterCategory("All"); // Reset category when type changes
                    }}
                    className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors cursor-pointer hover:border-slate-300 dark:hover:border-slate-600"
                  >
                    <option value="All">All Types</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors cursor-pointer hover:border-slate-300 dark:hover:border-slate-600"
                  >
                    <option value="All">All Categories</option>
                    {filterCategoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filterDateRange}
                    onChange={(e) => setFilterDateRange(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors cursor-pointer hover:border-slate-300 dark:hover:border-slate-600"
                  >
                    <option value="All">All Time</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="thisMonth">This Month</option>
                    <option value="custom">Custom Range</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors cursor-pointer hover:border-slate-300 dark:hover:border-slate-600"
                  >
                    <option value="date_desc">Newest First</option>
                    <option value="date_asc">Oldest First</option>
                    <option value="amount_desc">Amount (High to Low)</option>
                    <option value="amount_asc">Amount (Low to High)</option>
                  </select>
                </div>

                {/* Custom Date Range Inputs */}
                {filterDateRange === "custom" && (
                  <div className="flex items-center gap-3 mt-3 animate-fade-in-up">
                    <input
                      type="date"
                      value={customDateStart}
                      onChange={(e) => setCustomDateStart(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors"
                    />
                    <span className="text-slate-500">to</span>
                    <input
                      type="date"
                      value={customDateEnd}
                      onChange={(e) => setCustomDateEnd(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors"
                    />
                  </div>
                )}
              </div>

              {/* Transactions List */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/50 flex-grow bg-white dark:bg-transparent">
                {displayedTransactions.length === 0 ? (
                  <div className="p-16 text-center flex flex-col items-center justify-center animate-fade-in-up">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">
                      No transactions found
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Try adjusting your filters or add a new transaction.
                    </p>
                  </div>
                ) : (
                  displayedTransactions.map((transaction, index) => (
                    <div
                      key={transaction.id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group animate-fade-in-up"
                      style={{
                        animationDelay: `${Math.min(index * 0.05, 0.5)}s`,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${transaction.type === "Income" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"}`}
                        >
                          {transaction.type === "Income" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                            {transaction.title}
                          </p>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                            {new Date(transaction.date).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                            <span className="mx-1.5 opacity-50">•</span>
                            <span className="text-slate-600 dark:text-slate-300">
                              {transaction.category}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div
                          className={`text-lg font-bold tracking-tight ${transaction.type === "Income" ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}
                        >
                          {transaction.type === "Income" ? "+" : "-"}$
                          {transaction.amount.toFixed(2)}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:text-teal-400 dark:hover:bg-teal-400/10 rounded-xl transition-colors shadow-sm"
                            title="Edit"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-400/10 rounded-xl transition-colors shadow-sm"
                            title="Delete"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
