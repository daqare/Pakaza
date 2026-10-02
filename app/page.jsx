'use client';
import { useState } from 'react';
import Link from 'next/link';
import usePakazaStore from '../lib/store';
import ParcelDetailModal from '../components/ParcelDetailModal';

export default function Home() {
  const { parcels, ledger, currentRole, operatorSaccoId, setOperatorSaccoId, saccos, withdrawals, requestPayout, resetDemoData, setSelectedParcel } = usePakazaStore();
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [showQrModal, setShowQrModal] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false); // NEW
  const [withdrawPhone, setWithdrawPhone] = useState(''); // NEW

  const safeSaccos = Array.isArray(saccos) ? saccos : [];
  const safeParcels = Array.isArray(parcels) ? parcels : [];
  const safeLedger = Array.isArray(ledger) ? ledger : [];
  const safeWithdrawals = Array.isArray(withdrawals) ? withdrawals : []; // NEW

  const totalRevenue = safeLedger.filter(l => l.type === 'REVENUE').reduce((sum, e) => sum + (e.total || 0), 0);
  const myParcels = safeParcels.filter(p => p.saccoId === operatorSaccoId);
  const myRevenue = myParcels.reduce((sum, p) => sum + (p.price || 0), 0);
  const myGrossEarnings = Math.round(myRevenue * 0.45);
  const myTotalWithdrawn = safeWithdrawals.filter(w => w.saccoId === operatorSaccoId).reduce((sum, w) => sum + w.amount, 0);
  const myAvailableBalance = myGrossEarnings - myTotalWithdrawn; // NEW
  const mySacco = safeSaccos.find(s => s.id === operatorSaccoId);

  const handleTrack = (e) => { 
    e.preventDefault(); 
    setSearchResult(safeParcels.find(p => p?.id?.toLowerCase() === searchId.toLowerCase()) || 'NOT_FOUND'); 
  };
  const getTimelineStep = (status) => ['PAID', 'IN_TRANSIT', 'ARRIVED', 'COLLECTED'].indexOf(status) + 1 || 0;

  // NEW: Handle withdrawal
  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if (myAvailableBalance > 0 && withdrawPhone.length >= 10) {
      requestPayout(operatorSaccoId, myAvailableBalance, withdrawPhone);
      setShowWithdrawModal(false);
      setWithdrawPhone('');
    }
  };

  if (currentRole === 'ADMIN') {
    return (
      <div className="space-y-6 animate-slide-up">
        <ParcelDetailModal />
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowQrModal(null)}>
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-2">{showQrModal.name} QR Code</h3>
              <div className="w-48 h-48 bg-gray-900 rounded-xl mx-auto mb-4 flex items-center justify-center text-white text-xs p-4">
                <div className="grid grid-cols-8 gap-1 w-full h-full">{[...Array(64)].map((_, i) => (<div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'}`}></div>))}</div>
              </div>
              <button onClick={() => setShowQrModal(null)} className="w-full bg-pakaza-blue text-white py-3 rounded-xl font-bold">Close</button>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div><h1 className="text-3xl font-bold text-pakaza-blue">Admin Control Tower</h1><p className="text-sm text-gray-500">Full oversight of network and revenue.</p></div>
          <div className="flex flex-wrap gap-3">
            <Link href="/settings" className="bg-white text-pakaza-blue border border-pakaza-blue px-4 py-2 rounded-lg font-medium">⚙️ Manage</Link>
            <Link href="/ledger" className="bg-white text-pakaza-blue border border-pakaza-blue px-4 py-2 rounded-lg font-medium">View Ledger</Link>
            <Link href="/new" className="bg-pakaza-blue text-white px-6 py-2 rounded-lg font-medium shadow-md">+ New Parcel</Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-sm text-gray-500 mb-1">Parcels in Network</p><p className="text-3xl font-bold">{safeParcels.length}</p></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-sm text-gray-500 mb-1">Revenue Collected</p><p className="text-3xl font-bold text-pakaza-blue">KES {totalRevenue.toLocaleString()}</p></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-sm text-gray-500 mb-1">Active Routes</p><p className="text-3xl font-bold text-pakaza-green">{safeSaccos.length}</p></div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Operator QR Codes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {safeSaccos.map(s => (
              <div key={s.id} className="border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center">
                <div className={`w-12 h-12 ${s.color} rounded-lg mb-3 flex items-center justify-center text-white font-bold text-xl`}>{s.name.charAt(0)}</div>
                <h3 className="font-bold">{s.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{s.route}</p>
                <button onClick={() => setShowQrModal(s)} className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-semibold">View QR Code</button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-semibold">Recent Activity</h2><button onClick={resetDemoData} className="text-xs text-gray-400 hover:text-red-500">Reset</button></div>
          <div className="space-y-3">
            {safeParcels.slice(0, 5).map(p => (
              <button key={p.id} onClick={() => setSelectedParcel(p)} className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition text-left">
                <div><p className="font-bold text-pakaza-blue">{p.id}</p><p className="text-sm text-gray-600">{p.senderName} → {p.receiverName}</p></div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.status === 'PAID' ? 'bg-blue-100 text-blue-700' : p.status === 'IN_TRANSIT' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{p.status.replace('_', ' ')}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // OPERATOR VIEW WITH WITHDRAWAL
  if (currentRole === 'OPERATOR') {
    return (
      <div className="space-y-6 animate-slide-up">
        <ParcelDetailModal />
        
        {/* Withdrawal Modal */}
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowWithdrawModal(false)}>
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
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

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
          <p className="text-sm font-bold text-gray-700">Demo Simulation: Switch Driver Identity</p>
          <select value={operatorSaccoId} onChange={(e) => setOperatorSaccoId(e.target.value)} className="px-4 py-2 border rounded-lg">
            {safeSaccos.map(s => <option key={s.id} value={s.id}>{s.name} Driver</option>)}
          </select>
        </div>
        <div className="bg-gradient-to-r from-pakaza-blue to-blue-800 text-white p-8 rounded-2xl shadow-lg">
          <div className="flex items-center gap-4 mb-6"><div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">🚐</div><div><h1 className="text-2xl font-bold">Driver Portal</h1><p className="text-blue-200">Logged in as: {mySacco?.name} Fleet</p></div></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 p-4 rounded-xl"><p className="text-xs text-blue-200 uppercase">My Deliveries</p><p className="text-2xl font-bold">{myParcels.length}</p></div>
            <div className="bg-white/10 p-4 rounded-xl"><p className="text-xs text-blue-200 uppercase">Total Earned (45%)</p><p className="text-2xl font-bold">KES {myGrossEarnings.toLocaleString()}</p></div>
            <div className="bg-white/20 p-4 rounded-xl border border-white/30 relative">
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
      </div>
    );
  }

  if (currentRole === 'STAFF') {
    return (
      <div className="space-y-6 animate-slide-up max-w-2xl mx-auto text-center pt-10">
        <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-200">
          <div className="text-6xl mb-4"></div>
          <h1 className="text-3xl font-bold mb-2">Counter Staff Portal</h1>
          <p className="text-gray-500 mb-8">Fast intake and M-Pesa integration.</p>
          <Link href="/new" className="block w-full bg-pakaza-blue text-white text-xl py-4 rounded-xl font-bold shadow-lg">+ Book New Parcel</Link>
        </div>
      </div>
    );
  }

  if (currentRole === 'CLIENT') {
    const currentStep = searchResult && searchResult !== 'NOT_FOUND' ? getTimelineStep(searchResult.status) : 0;
    const steps = [{ id: 'PAID', label: 'Booked & Paid' }, { id: 'IN_TRANSIT', label: 'In Transit' }, { id: 'ARRIVED', label: 'Arrived at Hub' }, { id: 'COLLECTED', label: 'Collected' }];
    return (
      <div className="space-y-6 animate-slide-up max-w-2xl mx-auto text-center pt-5">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <div className="text-5xl mb-2"></div>
          <h1 className="text-3xl font-bold mb-2">Client Tracking</h1>
          <p className="text-gray-500 mb-6">Enter your tracking ID to see live status.</p>
          <form onSubmit={handleTrack} className="flex gap-2 mb-8">
            <input type="text" placeholder="Enter ID (e.g., PAK-1001)" value={searchId} onChange={(e) => setSearchId(e.target.value)} className="flex-1 px-4 py-3 border border-gray-300 rounded-xl" />
            <button type="submit" className="bg-pakaza-green text-white px-6 py-3 rounded-xl font-bold">Track</button>
          </form>
          {searchResult && searchResult !== 'NOT_FOUND' && (
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl text-left">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <div><p className="text-xs text-gray-500 uppercase font-bold">Tracking ID</p><p className="text-2xl font-black text-pakaza-blue">{searchResult.id}</p></div>
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-pakaza-blue text-white">{searchResult.status.replace('_', ' ')}</span>
              </div>
              <div className="relative pl-8 border-l-2 border-gray-200 space-y-8 my-8">
                {steps.map((step, index) => {
                  const isCompleted = index < currentStep; const isCurrent = index === currentStep;
                  return (
                    <div key={step.id} className="relative">
                      <div className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isCompleted ? 'bg-green-500 border-green-500 text-white' : isCurrent ? 'bg-white border-pakaza-blue text-pakaza-blue animate-pulse' : 'bg-white border-gray-300 text-gray-300'}`}>{isCompleted ? '✓' : index + 1}</div>
                      <div className={isCurrent || isCompleted ? 'opacity-100' : 'opacity-40'}><p className={`font-bold ${isCurrent ? 'text-pakaza-blue' : 'text-gray-900'}`}>{step.label}</p><p className="text-xs text-gray-500">{isCompleted ? 'Completed' : isCurrent ? 'Current Status' : 'Pending'}</p></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {searchResult === 'NOT_FOUND' && <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-left text-red-700 font-semibold">❌ Parcel not found</div>}
        </div>
      </div>
    );
  }
  return null;
}
