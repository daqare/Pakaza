'use client';
import { useState } from 'react';
import Link from 'next/link';
import usePakazaStore from '../lib/store';
import ParcelDetailModal from '../components/ParcelDetailModal';

export default function Home() {
  const { 
    parcels, ledger, currentRole, operatorSaccoId, setOperatorSaccoId, 
    saccos, withdrawals, requestPayout, resetDemoData, hardResetApp, setSelectedParcel 
  } = usePakazaStore();
  
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [showQrModal, setShowQrModal] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawPhone, setWithdrawPhone] = useState('');

  // 100% SAFE CALCULATIONS (Never crashes)
  const safeSaccos = saccos || [];
  const safeWithdrawals = withdrawals || [];
  const safeParcels = parcels || [];
  const safeLedger = ledger || [];

  const totalRevenue = safeLedger.filter(l => l.type === 'REVENUE').reduce((sum, entry) => sum + (entry.total || 0), 0);
  
  const myParcels = safeParcels.filter(p => p.saccoId === operatorSaccoId);
  const myGrossRevenue = myParcels.reduce((sum, p) => sum + (p.price || 0), 0);
  const myGrossEarnings = Math.round(myGrossRevenue * 0.45);
  const myTotalWithdrawn = safeWithdrawals.filter(w => w.saccoId === operatorSaccoId).reduce((sum, w) => sum + w.amount, 0);
  const myAvailableBalance = myGrossEarnings - myTotalWithdrawn;
  const mySacco = safeSaccos.find(s => s.id === operatorSaccoId);

  const handleReset = () => { if (window.confirm('Reset demo data?')) resetDemoData(); };
  const handleHardReset = () => { if (window.confirm('This will clear your browser cache and reload the app. Proceed?')) hardResetApp(); };
  
  const handleTrack = (e) => {
    e.preventDefault();
    const found = safeParcels.find(p => p && p.id && p.id.toLowerCase() === searchId.toLowerCase());
    setSearchResult(found || 'NOT_FOUND');
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if (myAvailableBalance > 0 && withdrawPhone.length >= 10) {
      requestPayout(operatorSaccoId, myAvailableBalance, withdrawPhone);
      setShowWithdrawModal(false);
      setWithdrawPhone('');
    }
  };

  const getTimelineStep = (status) => {
    const steps = ['PAID', 'IN_TRANSIT', 'ARRIVED', 'COLLECTED'];
    const index = steps.indexOf(status);
    return index === -1 ? 0 : index + 1;
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
            <Link href="/settings" className="bg-white text-pakaza-blue border border-pakaza-blue px-4 py-2 rounded-lg font-medium">⚙️ Manage</Link>
            <Link href="/track" className="bg-white text-pakaza-blue border border-pakaza-blue px-4 py-2 rounded-lg font-medium">Track Parcels</Link>
            <Link href="/ledger" className="bg-white text-pakaza-blue border border-pakaza-blue px-4 py-2 rounded-lg font-medium">View Ledger</Link>
            <Link href="/new" className="bg-pakaza-blue text-white px-6 py-2 rounded-lg font-medium shadow-md">+ New Parcel</Link>
            <button onClick={handleHardReset} className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-xs font-medium hover:bg-red-100 transition"> Hard Reset</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-sm text-gray-500 mb-1">Parcels in Network</p><p className="text-3xl font-bold text-gray-900">{safeParcels.length}</p></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-sm text-gray-500 mb-1">Revenue Collected</p><p className="text-3xl font-bold text-pakaza-blue">KES {totalRevenue.toLocaleString()}</p></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-sm text-gray-500 mb-1">Active Routes</p><p className="text-3xl font-bold text-pakaza-green">{safeSaccos.length}</p></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Operator Self-Service QR Codes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {safeSaccos.map((sacco) => (
              <div key={sacco.id} className="border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center hover:shadow-md transition">
                <div className={`w-12 h-12 ${sacco.color} rounded-lg mb-3 flex items-center justify-center text-white font-bold text-xl`}>{sacco.name.charAt(0)}</div>
                <h3 className="font-bold text-gray-900">{sacco.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{sacco.route}</p>
                <button onClick={() => setShowQrModal(sacco)} className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"> View QR Code</button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-semibold">Recent Activity</h2><button onClick={handleReset} className="text-xs text-gray-400 hover:text-red-500">Reset Demo</button></div>
          <div className="space-y-3">
            {safeParcels.length > 0 ? safeParcels.slice(0, 5).map((parcel) => (
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

  // --- OPERATOR VIEW (WITH FULL WALLET & WITHDRAW MODAL) ---
  if (currentRole === 'OPERATOR') {
    return (
      <div className="space-y-6 animate-slide-up">
        <ParcelDetailModal />
        
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowWithdrawModal(false)}>
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full animate-slide-up" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Withdraw Funds</h3>
              <p className="text-sm text-gray-500 mb-6">Send your earnings to M-Pesa.</p>
              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Withdraw</label>
                  <input type="text" disabled value={`KES ${myAvailableBalance.toLocaleString()}`} className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg font-bold text-pakaza-blue" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Phone Number</label>
                  <input type="tel" required value={withdrawPhone} onChange={(e) => setWithdrawPhone(e.target.value)} placeholder="0712345678" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakaza-blue" />
                </div>
                <button type="submit" disabled={myAvailableBalance <= 0} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50">Confirm Withdrawal</button>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div><p className="text-xs text-gray-500 uppercase font-bold">Demo Simulation</p><p className="text-sm text-gray-700">Switch driver identity to test different revenue splits.</p></div>
          <select value={operatorSaccoId} onChange={(e) => setOperatorSaccoId(e.target.value)} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakaza-blue font-semibold text-pakaza-blue bg-gray-50">
            {safeSaccos.map(s => (<option key={s.id} value={s.id}> {s.name} Driver</option>))}
          </select>
        </div>

        <div className="bg-gradient-to-r from-pakaza-blue to-blue-800 text-white p-8 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">🚐</div>
            <div><h1 className="text-2xl font-bold">Driver Portal</h1><p className="text-blue-200">Logged in as: {mySacco?.name || 'Unknown'} Fleet</p></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-xs text-blue-200 uppercase">My Deliveries</p>
              <p className="text-2xl font-bold">{myParcels.length}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-xs text-blue-200 uppercase">Total Earned (45%)</p>
              <p className="text-2xl font-bold">KES {myGrossEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border border-white/30 relative overflow-hidden">
              <p className="text-xs text-blue-100 uppercase">Available Balance</p>
              <p className="text-3xl font-black text-green-300">KES {myAvailableBalance.toLocaleString()}</p>
              {myAvailableBalance > 0 && (
                <button onClick={() => setShowWithdrawModal(true)} className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-lg transition">
                  💸 Withdraw to M-Pesa
                </button>
              )}
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
            )) : <p className="text-gray-500 text-center py-4">No deliveries for {mySacco?.name} yet.</p>}
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
            <div className="bg-gray-50 p-4 rounded-lg"><p className="text-xs text-gray-500">Today's Parcels</p><p className="text-2xl font-bold text-gray-900">{safeParcels.length}</p></div>
            <div className="bg-gray-50 p-4 rounded-lg"><p className="text-xs text-gray-500">Today's Sales</p><p className="text-2xl font-bold text-pakaza-blue">KES {totalRevenue.toLocaleString()}</p></div>
          </div>
        </div>
      </div>
    );
  }

  // --- CLIENT VIEW (WITH FULL TIMELINE) ---
  if (currentRole === 'CLIENT') {
    const currentStep = searchResult && searchResult !== 'NOT_FOUND' ? getTimelineStep(searchResult.status) : 0;
    const steps = [
      { id: 'PAID', label: 'Booked & Paid', icon: '💳' },
      { id: 'IN_TRANSIT', label: 'In Transit', icon: '🚐' },
      { id: 'ARRIVED', label: 'Arrived at Hub', icon: '📍' },
      { id: 'COLLECTED', label: 'Collected', icon: '✅' },
    ];

    return (
      <div className="space-y-6 animate-slide-up max-w-2xl mx-auto text-center pt-5">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <div className="text-5xl mb-2"></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Tracking</h1>
          <p className="text-gray-500 mb-6">Enter your tracking ID to see live status.</p>
          
          <form onSubmit={handleTrack} className="flex gap-2 mb-8">
            <input type="text" placeholder="Enter ID (e.g., PAK-1001)" value={searchId} onChange={(e) => setSearchId(e.target.value)} className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pakaza-blue outline-none" />
            <button type="submit" className="bg-pakaza-green text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition">Track</button>
          </form>

          {searchResult && searchResult !== 'NOT_FOUND' && searchResult.id && (
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl text-left animate-slide-up">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <div><p className="text-xs text-gray-500 uppercase font-bold">Tracking ID</p><p className="text-2xl font-black text-pakaza-blue">{searchResult.id}</p></div>
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-pakaza-blue text-white">{(searchResult.status || 'UNKNOWN').replace('_', ' ')}</span>
              </div>
              <div className="relative pl-8 border-l-2 border-gray-200 space-y-8 my-8">
                {steps.map((step, index) => {
                  const isCompleted = index < currentStep;
                  const isCurrent = index === currentStep;
                  return (
                    <div key={step.id} className="relative">
                      <div className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isCompleted ? 'bg-green-500 border-green-500 text-white' : isCurrent ? 'bg-white border-pakaza-blue text-pakaza-blue animate-pulse' : 'bg-white border-gray-300 text-gray-300'}`}>
                        {isCompleted ? '✓' : index + 1}
                      </div>
                      <div className={`${isCurrent ? 'opacity-100' : isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                        <p className={`font-bold ${isCurrent ? 'text-pakaza-blue' : 'text-gray-900'}`}>{step.label}</p>
                        <p className="text-xs text-gray-500">{isCompleted ? 'Completed' : isCurrent ? 'Current Status' : 'Pending'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm bg-white p-4 rounded-lg border border-gray-100">
                <div><p className="text-gray-500">From</p><p className="font-semibold">{searchResult.senderName}</p></div>
                <div><p className="text-gray-500">To</p><p className="font-semibold">{searchResult.receiverName}</p></div>
                <div><p className="text-gray-500">Weight</p><p className="font-semibold">{searchResult.weightKg} kg</p></div>
                <div><p className="text-gray-500">SACCO</p><p className="font-semibold">{safeSaccos.find(s => s.id === searchResult.saccoId)?.name || 'Unknown'}</p></div>
              </div>
            </div>
          )}
          {searchResult === 'NOT_FOUND' && <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-left"><p className="text-red-700 font-semibold">❌ Parcel not found</p></div>}
        </div>
      </div>
    );
  }
  return null;
}
