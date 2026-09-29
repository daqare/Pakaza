'use client';
import { useState } from 'react';
import Link from 'next/link';
import usePakazaStore from '../../lib/store';
import { saccos } from '../../lib/saccos';

export default function TrackPage() {
  const { parcels, updateStatus } = usePakazaStore();
  const [filter, setFilter] = useState('ALL');

  const getSaccoName = (id) => {
    const sacco = saccos.find((s) => s.id === id);
    return sacco ? sacco.name : 'Unknown SACCO';
  };

  const filteredParcels = filter === 'ALL' 
    ? parcels 
    : parcels.filter((p) => p.saccoId === filter);

  const statusColors = {
    INITIATED: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-blue-100 text-blue-800',
    IN_TRANSIT: 'bg-purple-100 text-purple-800',
    ARRIVED: 'bg-green-100 text-green-800',
    COLLECTED: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/" className="text-pakaza-blue hover:underline text-sm">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold text-pakaza-blue mt-2">Track & Manage Parcels</h1>
        </div>
        <Link href="/new" className="bg-pakaza-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-pakaza-darkBlue transition shadow-md">
          + New Parcel
        </Link>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by SACCO:</label>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakaza-blue"
        >
          <option value="ALL">All SACCOs</option>
          {saccos.map((sacco) => (
            <option key={sacco.id} value={sacco.id}>{sacco.name}</option>
          ))}
        </select>
      </div>

      {/* Parcels List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredParcels.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No parcels found. <Link href="/new" className="text-pakaza-blue hover:underline">Create one now</Link>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Tracking ID</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Route / SACCO</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Details</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredParcels.map((parcel) => (
                  <tr key={parcel.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-pakaza-blue">{parcel.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{getSaccoName(parcel.saccoId)}</p>
                      <p className="text-sm text-gray-500">{parcel.weightKg} kg • KES {parcel.price}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <p>{parcel.senderName} → {parcel.receiverName}</p>
                      <p className="text-xs text-gray-400">{parcel.createdAt}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[parcel.status]}`}>
                        {parcel.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={parcel.status}
                        onChange={(e) => updateStatus(parcel.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-pakaza-blue"
                      >
                        <option value="INITIATED">Initiated</option>
                        <option value="PAID">Paid</option>
                        <option value="IN_TRANSIT">In Transit</option>
                        <option value="ARRIVED">Arrived</option>
                        <option value="COLLECTED">Collected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
