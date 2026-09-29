'use client';
import { useState } from 'react';
import Link from 'next/link';
import usePakazaStore from '../lib/store';
import { saccos } from '../lib/saccos';
import ParcelDetailModal from '../components/ParcelDetailModal';

export default function Home() {
  const { parcels, ledger, currentRole, operatorSaccoId, resetDemoData, setSelectedParcel } = usePakazaStore();
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [showQrModal, setShowQrModal] = useState(null);

  const totalRevenue = ledger ? ledger.reduce((sum, entry) => sum + (entry.total || 0), 0) : 0;

  // --- OPERATOR SPECIFIC CALCULATIONS ---
  const myParcels = parcels ? parcels.filter(p => p.saccoId === operatorSaccoId) : [];
  const myRevenue = myParcels.reduce((sum, p) => sum + (p.price || 0), 0);
  const myEarnings = Math.round(myRevenue * 0.45); // The 45% Rule
  const mySacco = saccos.find(s => s.id === operatorSaccoId);

  const handleReset = () => { if (window.confirm('Reset data?')) resetDemoData(); };
  const handleTrack = (e) => {
    e.preventDefault();
    const found = parcels ? parcels.find(p => p && p.id && p.id.toLowerCase() === searchId.toLowerCase()) : null;
    setSearchResult(found || 'NOT_FOUND');
  };

  // --- ADMIN VIEW ---
  if (currentRole === 'ADMIN') {
    return (
      <div className="space-y-6 animate-slide-up">
        <ParcelDetailModal />
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowQrModal(null)}>
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-slide-up" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{showQrModal.name} QR Code</h3>
              <div className="w-48 h-48 bg-gray-900 rounded-xl mx-auto mb-4 flex items-center justify-center text-white text-xs p-4">
                <div className="grid grid-cols-8 gap-1 w-full h-full">
                  {[...Array(64)].map((_, i) => (<div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'}`}></div>))}
                </div>
              </div>
              <button onClick={() => setShowQrModal(null)} className="w-full bg-pakaza-blue text-white py-3 rounded-xl font-bold">Close</button>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div><h1 className="text-3xl font-bold text-pakaza-blue">Admin Control Tower</h1><p className="text-sm text-gray-500">Full oversight of network and revenue.</p></div>
          <div className="flex flex-wrap gap-3">
            <Link href="/track" className="bg-white text-pakaza-blue border border-pakaza-blue px-4 py-2 rounded-lg font-medium">Track Parcels</Link>
            <Link href="/ledger" className="bg-white text-pakaza-blue border border-pakaza-blue px-4 py-2 rounded-lg font-medium">View Ledger</Link>
            <Link href="/new" className="bg-pakaza-blue text-white px-6 py-2 rounded-lg font-medium shadow-md">+ New Parcel</Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-sm text-gray-500 mb-1">Parcels in Network</p><p className="text-3xl font-bold text-gray-900">{parcels ? parcels.length : 0}</p></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-sm text-gray-500 mb-1">Revenue Collected</p><p className="text-3xl font-bold text-pakaza-blue">KES {totalRevenue.toLocaleString()}</p></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-sm text-gray-500 mb-1">Active Routes</p><p className="text-3xl font-bold text-pakaza-green">{saccos ? saccos.length : 0}</p></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Operator Self-Service QR Codes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {saccos && saccos.map((sacco) => (
              <div key={sacco.id} className="border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition">
                <div className={`w-12 h-12 ${sacco.color} rounded-lg mb-3 flex items-center justify-center text-white font-bold text-xl`}>{sacco.name.charAt(0)}</div>
                <h3 className="font-bold text-gray-900">{sacco.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{sacco.route}</p>
                <button onClick={() => setShowQrModal(sacco)} className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition">📱 View QR Code</button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-semibold">Recent Activity</h2><button onClick={handleReset} className="text-xs text-gray-400 hover:text-red-500">Reset</button></div>
          <div className="space-y-3">
            {parcels && parcels.length > 0 ? parcels.slice(0, 5).map((parcel) => (
              <button key={parcel.id} onClick={() => setSelectedParcel(parcel)} className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-transparent hover:border-pakaza-blue/30 hover:bg-blue-50/50 transition-all text-left">
                <div><p className="font-bold text-pakaza-blue">{parcel.id}</p><p className="text-sm text-gray-600">{parcel.senderName} → {parcel.receiverName}</p></div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-xs font-semibold text-gray-500">KES {(parcel.price || 0).toLocaleString()}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${parcel.status === 'PAID' ? 'bg-blue-100 text-blue-700' : parcel.status === 'IN_TRANSIT' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{(parcel.status || 'UNKNOWN').replace('_', ' ')}</span>
                  <span className="text-gray-400">→</span>
                </div>
              </button>
            )) : <p className="text-gray-500 text-center py-4">No parcels yet.</p>}
          </div>
        </div>
      </div>
    );
  }

  // --- OPERATOR VIEW (NEW!) ---
  if (currentRole === 'OPERATOR') {
    return (
      <div className="space-y-6 animate-slide-up">
        <ParcelDetailModal />
        <div className="bg-gradient-to-r from-pakaza-blue to-blue-800 text-white p-8 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">🚐</div>
            <div>
              <h1 className="text-2xl font-bold">Driver Portal</h1>
              <p className="text-blue-200">Logged in as: {mySacco?.name} Fleet</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-xs text-blue-200 uppercase">My Deliveries</p>
              <p className="text-2xl font-bold">{myParcels.length}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-xs text-blue-200 uppercase">Total Value Moved</p>
              <p className="text-2xl font-bold">KES {myRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border border-white/30">
              <p className="text-xs text-blue-100 uppercase">My 45% Earnings</p>
              <p className="text-3xl font-black text-green-300">KES {myEarnings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">My Active Parcels</h2>
          <div className="space-y-3">
            {myParcels.length > 0 ? myParcels.map((parcel) => (
              <button key={parcel.id} onClick={() => setSelectedParcel(parcel)} className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition text-left">
                <div><p className="font-bold text-pakaza-blue">{parcel.id}</p><p className="text-sm text-gray-600">{parcel.senderName} → {parcel.receiverName}</p></div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">Earned: KES {Math.round((parcel.price || 0) * 0.45).toLocaleString()}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${parcel.status === 'PAID' ? 'bg-blue-100 text-blue-700' : parcel.status === 'IN_TRANSIT' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{(parcel.status || 'UNKNOWN').replace('_', ' ')}</span>
                </div>
              </button>
            )) : <p className="text-gray-500 text-center py-4">No deliveries for your SACCO yet.</p>}
          </div>
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
          <Link href="/new" className="block w-full bg-pakaza-blue text-white text-xl py-4 rounded-xl font-bold hover:bg-pakaza-darkBlue transition shadow-lg">+ Book New Parcel</Link>
          <div className="mt-8 grid grid-cols-2 gap-4 text-left">
            <div className="bg-gray-50 p-4 rounded-lg"><p className="text-xs text-gray-500">Today's Parcels</p><p className="text-2xl font-bold text-gray-900">{parcels ? parcels.length : 0}</p></div>
            <div className="bg-gray-50 p-4 rounded-lg"><p className="text-xs text-gray-500">Today's Sales</p><p className="text-2xl font-bold text-pakaza-blue">KES {totalRevenue.toLocaleString()}</p></div>
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
          <form onSubmit={handleTrack} className="flex gap-2 mb-6">
            <input type="text" placeholder="Enter ID (e.g., PAK-1001)" value={searchId} onChange={(e) => setSearchId(e.target.value)} className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pakaza-blue outline-none" />
            <button type="submit" className="bg-pakaza-green text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition">Track</button>
          </form>
          {searchResult && searchResult !== 'NOT_FOUND' && searchResult.id && (
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl mb-6 text-left animate-slide-up">
              <div className="flex justify-between items-start mb-4">
                <div><p className="text-sm text-gray-600">Tracking ID</p><p className="text-2xl font-bold text-pakaza-blue">{searchResult.id}</p></div>
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-700">{(searchResult.status || 'UNKNOWN').replace('_', ' ')}</span>
              </div>
            </div>
          )}
          {searchResult === 'NOT_FOUND' && <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6 text-left"><p className="text-red-700 font-semibold">Parcel not found</p></div>}
        </div>
      </div>
    );
  }
  return null;
}
