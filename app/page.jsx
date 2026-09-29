'use client';
import Link from 'next/link';
import usePakazaStore from '../lib/store';
import { saccos } from '../lib/saccos';

export default function Home() {
  const { parcels, ledger, currentRole, resetDemoData } = usePakazaStore();
  
  const totalRevenue = ledger.reduce((sum, entry) => sum + entry.total, 0);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all demo data?')) {
      resetDemoData();
    }
  };

  // --- ADMIN VIEW ---
  if (currentRole === 'ADMIN') {
    return (
      <div className="space-y-6 animate-slide-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-pakaza-blue">Admin Control Tower</h1>
            <p className="text-sm text-gray-500">Full oversight of network and revenue.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/track" className="bg-white text-pakaza-blue border border-pakaza-blue px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition">Track Parcels</Link>
            <Link href="/ledger" className="bg-white text-pakaza-blue border border-pakaza-blue px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition">View Ledger</Link>
            <Link href="/new" className="bg-pakaza-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-pakaza-darkBlue transition shadow-md">+ New Parcel</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Parcels in Network</p>
            <p className="text-3xl font-bold text-gray-900">{parcels.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Revenue Collected</p>
            <p className="text-3xl font-bold text-pakaza-blue">KES {totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Active Routes</p>
            <p className="text-3xl font-bold text-pakaza-green">{saccos.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            {parcels.length > 0 && <button onClick={handleReset} className="text-sm text-red-500 hover:underline">Reset Demo</button>}
          </div>
          {parcels.length === 0 ? (
            <p className="text-gray-500 text-center py-8">System ready. No parcels yet.</p>
          ) : (
            <div className="space-y-3">
              {parcels.slice(0, 5).map((parcel) => (
                <div key={parcel.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{parcel.id}</p>
                    <p className="text-sm text-gray-500">{parcel.senderName} → {parcel.receiverName}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{parcel.status.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- STAFF VIEW ---
  if (currentRole === 'STAFF') {
    return (
      <div className="space-y-6 animate-slide-up max-w-2xl mx-auto text-center pt-10">
        <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Counter Staff Portal</h1>
          <p className="text-gray-500 mb-8">Fast intake and M-Pesa integration.</p>
          
          <Link href="/new" className="block w-full bg-pakaza-blue text-white text-xl py-4 rounded-xl font-bold hover:bg-pakaza-darkBlue transition shadow-lg">
            + Book New Parcel
          </Link>
          
          <div className="mt-8 grid grid-cols-2 gap-4 text-left">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500">Today's Parcels</p>
              <p className="text-2xl font-bold text-gray-900">{parcels.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-500">Today's Sales</p>
              <p className="text-2xl font-bold text-pakaza-blue">KES {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- CLIENT VIEW ---
  if (currentRole === 'CLIENT') {
    return (
      <div className="space-y-6 animate-slide-up max-w-2xl mx-auto text-center pt-10">
        <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200">
          <div className="text-6xl mb-4">📱</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Tracking</h1>
          <p className="text-gray-500 mb-8">Enter your tracking ID to see live status.</p>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter ID (e.g., PAK-1096)" 
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pakaza-blue outline-none"
            />
            <button className="bg-pakaza-green text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition">
              Track
            </button>
          </div>

          <div className="mt-8 text-left bg-gray-50 p-6 rounded-xl">
            <h3 className="font-bold text-gray-700 mb-2">Recent Updates:</h3>
            {parcels.length === 0 ? (
              <p className="text-sm text-gray-500">No active parcels.</p>
            ) : (
              parcels.slice(0, 3).map(p => (
                <div key={p.id} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                  <span className="font-mono text-sm text-pakaza-blue">{p.id}</span>
                  <span className="text-sm font-semibold text-green-600">{p.status.replace('_', ' ')}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
