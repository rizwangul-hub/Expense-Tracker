import React, { useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use localStorage to track visits on this device
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem("last_visit_date");
    const totalVisits = parseInt(localStorage.getItem("total_visits") || "0");

    // Increment count if it's a new day or first visit
    if (lastVisit !== today) {
      const newCount = totalVisits + 1;
      localStorage.setItem("total_visits", newCount.toString());
      localStorage.setItem("last_visit_date", today);
      setVisitorCount(newCount);
    } else {
      setVisitorCount(totalVisits || 1);
    }

    setLoading(false);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <FiUsers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {loading ? "..." : `${visitorCount} visits`}
      </span>
    </div>
  );
};

export default VisitorCounter;
