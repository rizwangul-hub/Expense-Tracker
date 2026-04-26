import React, { useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        // Using free counter from hitwebcounter.com
        const response = await fetch(
          "https://www.hitwebcounter.com/counter/counter.php?page=expense-tracker-54&style=tl6&lngs=0-0&mode=pub&cid=000001&tm=0",
        );

        if (response.ok) {
          const text = await response.text();
          // Extract number from HTML response
          const match = text.match(/(\d+)/);
          if (match) {
            setVisitorCount(parseInt(match[1]));
          } else {
            setVisitorCount(0);
          }
        } else {
          setVisitorCount(0);
        }
      } catch (error) {
        // Fallback: show 0
        setVisitorCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <FiUsers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {loading ? "..." : `${visitorCount.toLocaleString()} visitors`}
      </span>
    </div>
  );
};

export default VisitorCounter;
