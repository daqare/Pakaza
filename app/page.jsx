'use client';
import Link from 'next/link';
import usePakazaStore from '../lib/store';
import { saccos } from '../lib/saccos';

export default function Home() {
  const { parcels, ledger, currentRole, resetDemoData } = usePakazaStore();
  
  const totalRevenue = ledger ? ledger.reduce((sum, entry) => sum + (entry.total || 0), 0) : 0;

  const handleReset = () => {
    if (window.confirm('Reset all data to default demo state?')) {
      resetDemoData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-pakaza-blue">Admin Control Tower</h1>
          <p className="text-sm text-gray-500">Full oversight of network and revenue.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/track" className="bg-white text-pakaza-blue border border-pakaza-blue px-4 py-2 rounded-lg font-medium">Track Parcels</Link>
          <Link href="/ledger" className="bg-white text-pakaza-blue border border-pakaza-blue px-4 py-2 rounded-lg font-medium">View Ledger</Link>
          <Link href="/new" className="bg-pakaza-blue text-white px-6 py-2 rounded-lg font-medium shadow-md">+ New Parcel</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Parcels in Network</p>
          <p className="text-3xl font-bold text-gray-900">{parcels ? parcels.length : 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Revenue Collected</p>
          <p className="text-3xl font-bold text-pakaza-blue">KES {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Active Routes</p>
          <p className="text-3xl font-bold text-pakaza-green">{saccos ? saccos.length : 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <button onClick={handleReset} className="text-xs text-red-500 hover:underline">Reset Data</button>
        </div>
        <div className="space-y-3">
          {parcels && parcels.length > 0 ? parcels.slice(0, 5).map((parcel) => (
            <div key={parcel.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="font-bold text-pakaza-blue">{parcel.id}</p>
                <p className="text-sm text-gray-600">{parcel.senderName} → {parcel.receiverName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                parcel.status === 'PAID' ? 'bg-blue-100 text-blue-700' :
                parcel.status === 'IN_TRANSIT' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
              }`}>
                {parcel.status ? parcel.status.replace('_', ' ') : 'UNKNOWN'}
              </span>
            </div>
          )) : <p className="text-gray-500 text-center py-4">No parcels yet.</p>}
        </div>
      </div>
    </div>
  );
}
