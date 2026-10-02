
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
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawPhone, setWithdrawPhone] = useState('');

  const safeSaccos = Array.isArray(saccos) ? saccos : [];
  const safeParcels = Array.isArray(parcels) ? parcels : [];
  const safeLedger = Array.isArray(ledger) ? ledger : [];
  const safeWithdrawals = Array.isArray(withdrawals) ? withdrawals : [];

  const totalRevenue = safeLedger.filter(l => l.type === 'REVENUE').reduce((sum, e) => sum + (e.total || 0), 0);
  const myParcels = safeParcels.filter(p => p.saccoId === operatorSaccoId);
  const myRevenue = myParcels.reduce((sum, p) => sum + (p.price || 0), 0);
  const myGrossEarnings = Math.round(myRevenue * 0.45);
  const myTotalWithdrawn = safeWithdrawals.filter(w => w.saccoId === operatorSaccoId).reduce((sum, w) => sum + w.amount, 0);
  const myAvailableBalance = myGrossEarnings - myTotalWithdrawn;
  const mySacco = safeSaccos.find(s => s.id === operatorSaccoId);

  const handleTrack = (e) => { 
    e.preventDefault(); 
    setSearchResult(safeParcels.find(p => p?.id?.toLowerCase() === searchId.toLowerCase()) || 'NOT_FOUND'); 
  };
  const getTimelineStep = (status) => ['PAID', 'IN_TRANSIT', 'ARRIVED', 'COLLECTED'].indexOf(status) + 1 || 0;

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if (myAvailableBalance > 0 && withdrawPhone.length >= 10) {
      requestPayout(operatorSaccoId, myAvailableBalance, withdrawPhone);
      setShowWithdrawModal(false);
      setWithdrawPhone('');
    }
  };

  // ADMIN VIEW
  if (currentRole === 'ADMIN') {
    return (
      <div className="space-y-8 animate-slide-up">
        <ParcelDetailModal />
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowQrModal(null)}>
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{showQrModal.name} QR Code</h3>
              <div className="w-48 h-48 bg-gray-900 rounded-xl mx-auto mb-4 flex items-center justify-center text-white text-xs p-4">
                <div className="grid grid-cols-8 gap-1 w-full h-full">{[...Array(64)].map((_, i) => (<div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-white' : 'bg-transparent'}`}></div>))}</div>
              </div>
              <button onClick={() => setShowQrModal(null)} className="w-full bg-[#0047AB] text-white py-3 rounded-xl font-bold hover:bg-[#003380] transition">Close</button>
            </div>
          </div>
        )}
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#0047AB]">Admin Control Tower</h1>
            <p className="text-sm text-gray-500 mt-1">Full oversight of network and revenue.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/settings" className="bg-white text-[#0047AB] border-2 border-[#0047AB] px-4 py-2 rounded-lg font-semibold hover:bg-[#0047AB] hover:text-white transition">⚙️ Manage</Link>
            <Link href="/ledger" className="bg-white text-[#0047AB] border-2 border-[#0047AB] px-4 py-2 rounded-lg font-semibold hover:bg-[#0047AB] hover:text-white transition">View Ledger</Link>
            <Link href="/new" className="bg-[#0047AB] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#003380] transition shadow-lg">+ New Parcel</Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition">
            <p className="text-sm text-gray-500 mb-2 font-medium">Parcels in Network</p>
            <p className="text-4xl font-black text-gray-900">{safeParcels.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-[#0047AB] hover:shadow-xl transition">
            <p className="text-sm text-gray-500 mb-2 font-medium">Revenue Collected</p>
            <p className="text-4xl font-black text-[#0047AB]">KES {totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-[#00A651] hover:shadow-xl transition">
            <p className="text-sm text-gray-500 mb-2 font-medium">Active Routes</p>
            <p className="text-4xl font-black text-[#00A651]">{safeSaccos.length}</p>
          </div>
        </div>

        {/* QR Codes Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Operator QR Codes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {safeSaccos.map(s => (
              <div key={s.id} className="border-2 border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center hover:border-[#0047AB]/30 hover:shadow-lg transition">
                <div className={`w-16 h-16 ${s.color} rounded-2xl mb-4 flex items-center justify-center text-white font-black text-2xl shadow-lg`}>{s.name.charAt(0)}</div>
                <h3 className="font-bold text-lg text-gray-900">{s.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{s.route}</p>
                <button onClick={() => setShowQrModal(s)} className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition">View QR Code</button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <button onClick={resetDemoData} className="text-sm text-gray-400 hover:text-[#ED1C24] transition font-medium">Reset Demo</button>
          </div>
          <div className="space-y-3">
            {safeParcels.slice(0, 5).map(p => (
              <button key={p.id} onClick={() => setSelectedParcel(p)} className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-[#0047AB]/5 hover:border-[#0047AB]/30 border-2 border-transparent transition text-left group">
                <div>
                  <p className="font-bold text-[#0047AB] group-hover:text-[#003380]">{p.id}</p>
                  <p className="text-sm text-gray-600">{p.senderName} → {p.receiverName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-sm font-semibold text-gray-700">KES {(p.price || 0).toLocaleString()}</span>
                  <span className={`px-4 py-2 rounded-full text-xs font-bold ${p.status === 'PAID' ? 'bg-blue-100 text-blue-700' : p.status === 'IN_TRANSIT' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{p.status.replace('_', ' ')}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // OPERATOR VIEW
  if (currentRole === 'OPERATOR') {
    return (
      <div className="space-y-6 animate-slide-up">
        <ParcelDetailModal />
        
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowWithdrawModal(false)}>
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Withdraw Funds</h3>
              <p className="text-sm text-gray-500 mb-6">Send your earnings to M-Pesa.</p>
              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Withdraw</label>
                  <input type="text" disabled value={`KES ${myAvailableBalance.toLocaleString()}`} className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg font-bold text-[#0047AB]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Phone Number</label>
                  <input type="tel" required value={withdrawPhone} onChange={(e) => setWithdrawPhone(e.target.value)} placeholder="0712345678" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0047AB]" />
                </div>
                <button type="submit" disabled={myAvailableBalance <= 0} className="w-full bg-[#00A651] text-white py-3 rounded-xl font-bold hover:bg-[#008F45] transition disabled:opacity-50">Confirm Withdrawal</button>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
          <p className="text-sm font-bold text-gray-700">Demo Simulation: Switch Driver Identity</p>
          <select value={operatorSaccoId} onChange={(e) => setOperatorSaccoId(e.target.value)} className="px-4 py-2 border-2 border-gray-200 rounded-lg font-semibold text-[#0047AB]">
            {safeSaccos.map(s => <option key={s.id} value={s.id}>{s.name} Driver</option>)}
          </select>
        </div>
        
        <div className="bg-gradient-to-br from-[#0047AB] to-[#003380] text-white p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm">🚐</div>
            <div>
              <h1 className="text-2xl font-black">Driver Portal</h1>
              <p className="text-blue-200 text-sm">Logged in as: {mySacco?.name} Fleet</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-xs text-blue-200 uppercase font-semibold">My Deliveries</p>
              <p className="text-3xl font-black">{myParcels.length}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-xs text-blue-200 uppercase font-semibold">Total Earned (45%)</p>
              <p className="text-3xl font-black">KES {myGrossEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl border-2 border-white/30 backdrop-blur-sm">
              <p className="text-xs text-blue-100 uppercase font-semibold">Available Balance</p>
              <p className="text-3xl font-black text-green-300">KES {myAvailableBalance.toLocaleString()}</p>
              {myAvailableBalance > 0 && (
                <button onClick={() => setShowWithdrawModal(true)} className="mt-2 w-full bg-[#00A651] hover:bg-[#008F45] text-white text-xs font-bold py-2 rounded-lg transition shadow-lg">
                  💸 Withdraw to M-Pesa
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STAFF VIEW
  if (currentRole === 'STAFF') {
    return (
      <div className="space-y-6 animate-slide-up max-w-2xl mx-auto text-center pt-10">
        <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-3xl font-black mb-2 text-gray-900">Counter Staff Portal</h1>
          <p className="text-gray-500 mb-8">Fast intake and M-Pesa integration.</p>
          <Link href="/new" className="block w-full bg-[#0047AB] text-white text-xl py-4 rounded-xl font-bold shadow-lg hover:bg-[#003380] transition">+ Book New Parcel</Link>
        </div>
      </div>
    );
  }

  // CLIENT VIEW
  if (currentRole === 'CLIENT') {
    const currentStep = searchResult && searchResult !== 'NOT_FOUND' ? getTimelineStep(searchResult.status) : 0;
    const steps = [{ id: 'PAID', label: 'Booked & Paid' }, { id: 'IN_TRANSIT', label: 'In Transit' }, { id: 'ARRIVED', label: 'Arrived at Hub' }, { id: 'COLLECTED', label: 'Collected' }];
    return (
      <div className="space-y-6 animate-slide-up max-w-2xl mx-auto text-center pt-5">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
          <div className="text-5xl mb-2"></div>
          <h1 className="text-3xl font-black mb-2 text-gray-900">Client Tracking</h1>
          <p className="text-gray-500 mb-6">Enter your tracking ID to see live status.</p>
          <form onSubmit={handleTrack} className="flex gap-2 mb-8">
            <input type="text" placeholder="Enter ID (e.g., PAK-1001)" value={searchId} onChange={(e) => setSearchId(e.target.value)} className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0047AB] focus:ring-2 focus:ring-[#0047AB]/20" />
            <button type="submit" className="bg-[#00A651] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#008F45] transition shadow-lg">Track</button>
          </form>
          {searchResult && searchResult !== 'NOT_FOUND' && (
            <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-2xl text-left">
              <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-200">
                <div><p className="text-xs text-gray-500 uppercase font-bold">Tracking ID</p><p className="text-2xl font-black text-[#0047AB]">{searchResult.id}</p></div>
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-[#0047AB] text-white">{searchResult.status.replace('_', ' ')}</span>
              </div>
              <div className="relative pl-8 border-l-2 border-gray-200 space-y-8 my-8">
                {steps.map((step, index) => {
                  const isCompleted = index < currentStep; const isCurrent = index === currentStep;
                  return (
                    <div key={step.id} className="relative">
                      <div className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${isCompleted ? 'bg-[#00A651] border-[#00A651] text-white' : isCurrent ? 'bg-white border-[#0047AB] text-[#0047AB] animate-pulse' : 'bg-white border-gray-300 text-gray-300'}`}>{isCompleted ? '✓' : index + 1}</div>
                      <div className={isCurrent || isCompleted ? 'opacity-100' : 'opacity-40'}><p className={`font-bold ${isCurrent ? 'text-[#0047AB]' : 'text-gray-900'}`}>{step.label}</p><p className="text-xs text-gray-500">{isCompleted ? 'Completed' : isCurrent ? 'Current Status' : 'Pending'}</p></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {searchResult === 'NOT_FOUND' && <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl text-left text-[#ED1C24] font-semibold">❌ Parcel not found</div>}
        </div>
      </div>
    );
  }
  return null;
}
