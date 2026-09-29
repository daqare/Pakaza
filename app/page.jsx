'use client';
import usePakazaStore from '../lib/store';
import { saccos } from '../lib/saccos';

export default function Home() {
  const { parcels, ledger } = usePakazaStore();
  
  const totalRevenue = ledger.reduce((sum, entry) => sum + entry.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pakaza-blue">PAKAZA Dashboard</h1>
        <button className="bg-pakaza-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-pakaza-darkBlue transition shadow-md">
          + New Parcel
        </button>
      </div>

      {/* Stats Grid */}
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

      {/* SACCO Partners */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Partner SACCOs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {saccos.map((sacco) => (
            <div key={sacco.id} className="border border-gray-200 rounded-lg p-4">
              <div className={`w-10 h-10 ${sacco.color} rounded-lg mb-2`}></div>
              <h3 className="font-semibold text-gray-900">{sacco.name}</h3>
              <p className="text-sm text-gray-500">{sacco.route}</p>
              <p className="text-xs text-gray-400 mt-1">ID: {sacco.id}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {parcels.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            System ready. No parcels yet. Stage 2 complete!
          </p>
        ) : (
          <div className="space-y-3">
            {parcels.slice(0, 5).map((parcel) => (
              <div key={parcel.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{parcel.id}</p>
                  <p className="text-sm text-gray-500">{parcel.senderName} → {parcel.receiverName}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                  {parcel.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
