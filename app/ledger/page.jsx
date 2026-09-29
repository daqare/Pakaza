'use client';
import { useState } from 'react';
import Link from 'next/link';
import usePakazaStore from '../../lib/store';
import { saccos } from '../../lib/saccos';

export default function LedgerPage() {
  const { ledger, parcels, currentRole, operatorSaccoId } = usePakazaStore();
  const [filter, setFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL'); // NEW: Filter by Revenue vs Payout

  const revenueLedger = ledger ? ledger.filter(l => l.type === 'REVENUE') : [];
  const totalRevenue = revenueLedger.reduce((sum, e) => sum + (e.total || 0), 0);
  const totalPakaza = revenueLedger.reduce((sum, e) => sum + (e.pakazaShare || 0), 0);
  const totalOperator = revenueLedger.reduce((sum, e) => sum + (e.operatorShare || 0), 0);
  const totalSacco = revenueLedger.reduce((sum, e) => sum + (e.saccoShare || 0), 0);

  const filteredLedger = ledger ? ledger.filter(e => {
    const saccoMatch = filter === 'ALL' || e.saccoId === filter;
    const typeMatch = typeFilter === 'ALL' || e.type === typeFilter;
    return saccoMatch && typeMatch;
  }) : [];

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
          <p className="text-sm text-gray-500">Real-time revenue distribution and payouts.</p>
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="font-semibold text-gray-700">Transaction History</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakaza-blue">
            <option value="ALL">All SACCOs</option>
            {saccos && saccos.map((sacco) => (<option key={sacco.id} value={sacco.id}>{sacco.name}</option>))}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakaza-blue">
            <option value="ALL">All Types</option>
            <option value="REVENUE">Revenue</option>
            <option value="PAYOUT">Payouts</option>
          </select>
        </div>
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
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Ref ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Details</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase">SACCO</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLedger.map((entry) => {
                  const isPayout = entry.type === 'PAYOUT';
                  return (
                    <tr key={entry.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${isPayout ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                          {isPayout ? 'PAYOUT' : 'REVENUE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-500">{entry.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {isPayout ? `Withdrawal to M-Pesa` : `Parcel ${entry.parcelId}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{getSaccoName(entry.saccoId)}</td>
                      <td className={`px-6 py-4 text-sm font-bold text-right ${isPayout ? 'text-orange-600' : 'text-gray-900'}`}>
                        {isPayout ? '-' : ''}KES {Math.abs(entry.total || 0).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
