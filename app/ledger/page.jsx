'use client';
import { useState } from 'react';
import Link from 'next/link';
import usePakazaStore from '../../lib/store';
import { saccos } from '../../lib/saccos';

export default function LedgerPage() {
  const { ledger, parcels, currentRole, operatorSaccoId } = usePakazaStore();
  const [filter, setFilter] = useState('ALL');

  const totalRevenue = ledger ? ledger.reduce((sum, e) => sum + (e.total || 0), 0) : 0;
  const totalPakaza = ledger ? ledger.reduce((sum, e) => sum + (e.pakazaShare || 0), 0) : 0;
  const totalOperator = ledger ? ledger.reduce((sum, e) => sum + (e.operatorShare || 0), 0) : 0;
  const totalSacco = ledger ? ledger.reduce((sum, e) => sum + (e.saccoShare || 0), 0) : 0;

  // Filter logic
  const filteredLedger = ledger ? (filter === 'ALL' ? ledger : ledger.filter(e => e.saccoId === filter)) : [];

  const getSaccoName = (id) => {
    if (!saccos || !id) return 'Unknown';
    const found = saccos.find(s => s && s.id === id);
    return found ? found.name : 'Unknown';
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/" className="text-pakaza-blue hover:underline text-sm">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold text-pakaza-blue mt-2">Financial Ledger</h1>
          <p className="text-sm text-gray-500">Real-time revenue distribution tracking.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">KES {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-pakaza-blue">
          <p className="text-sm text-gray-500 mb-1">PAKAZA (50%)</p>
          <p className="text-2xl font-bold text-pakaza-blue">KES {totalPakaza.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <p className="text-sm text-gray-500 mb-1">Operators (45%)</p>
          <p className="text-2xl font-bold text-green-600">KES {totalOperator.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <p className="text-sm text-gray-500 mb-1">SACCO Admins (5%)</p>
          <p className="text-2xl font-bold text-purple-600">KES {totalSacco.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="font-semibold text-gray-700">Transaction History</h2>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakaza-blue"
        >
          <option value="ALL">All SACCOs</option>
          {saccos && saccos.map((sacco) => (
            <option key={sacco.id} value={sacco.id}>{sacco.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredLedger.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Txn ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Parcel</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">SACCO</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Total</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">PAKAZA</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Operator</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">SACCO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLedger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">{entry.id}</td>
                    <td className="px-6 py-4 font-bold text-pakaza-blue">{entry.parcelId}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{getSaccoName(entry.saccoId)}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">KES {(entry.total || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-pakaza-blue">KES {(entry.pakazaShare || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-green-600">KES {(entry.operatorShare || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-purple-600">KES {(entry.saccoShare || 0).toLocaleString()}</td>
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
