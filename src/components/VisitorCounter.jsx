import React, { useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, runTransaction } from "firebase/database";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBWpu9Ljtf-gHdC1r2L1SIHLNP8rUSRDUc",
  authDomain: "expense-traker-ffc49.firebaseapp.com",
  projectId: "expense-traker-ffc49",
  storageBucket: "expense-traker-ffc49.firebasestorage.app",
  messagingSenderId: "417876694643",
  appId: "1:417876694643:web:6f1a7072557d50adf17c06",
  measurementId: "G-GNQMZTLY19",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get visitor count from Firebase Realtime Database
    const countRef = ref(database, "visitors/count");

    // Increment visitor count on each visit
    runTransaction(countRef, (currentCount) => {
      return (currentCount || 0) + 1;
    });

    // Listen for real-time updates
    const unsubscribe = onValue(countRef, (snapshot) => {
      const count = snapshot.val() || 0;
      setVisitorCount(count);
      setLoading(false);
    });

    return () => unsubscribe();
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
