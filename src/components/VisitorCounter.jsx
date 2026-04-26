import React, { useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const namespace = "expense-tracker-vercel";

        // First, try to get the current count
        const getResponse = await fetch(
          `https://api.countapi.xyz/get/${namespace}`,
        );

        if (getResponse.ok) {
          const data = await getResponse.json();
          setVisitorCount(data?.value || 0);

          // Increment the counter for this visit
          await fetch(`https://api.countapi.xyz/hit/${namespace}`, {
            method: "GET",
          });
        } else {
          // If no counter exists, create one with initial value
          const createResponse = await fetch(
            `https://api.countapi.xyz/create?namespace=${namespace}&enable_reset=0`,
          );
          if (createResponse.ok) {
            const data = await createResponse.json();
            setVisitorCount(data?.value || 1);
          }
        }
      } catch (error) {
        console.log("Visitor counter unavailable");
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
