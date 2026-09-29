'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleHardReset = () => {
    // This wipes the confused browser memory
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pakaza-storage');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">App Data Conflict</h2>
        <p className="text-gray-600 mb-6">
          The app encountered an error, likely due to old data saved in your browser from a previous version.
        </p>
        <button
          onClick={handleHardReset}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
        >
          Clear Data & Reload App
        </button>
        <button
          onClick={reset}
          className="w-full mt-3 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
