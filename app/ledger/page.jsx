'use client';
import Link from 'next/link';
import usePakazaStore from '../../lib/store';
import { saccos } from '../../lib/saccos';

export default function LedgerPage() {
  const { ledger, parcels } = usePakazaStore();

  const getSaccoName = (id) => {
    const sacco = saccos.find((s) => s.id === id);
    return sacco ? sacco.name : 'Unknown';
  };

  const totalRevenue = ledger.reduce((sum, entry) => sum + entry.total, 0);
  const totalPakaza = ledger.reduce((sum, entry) => sum + entry.pakazaShare, 0);
  const totalOperator = ledger.reduce((sum, entry) => sum + entry.operatorShare, 0);
  const totalSacco = ledger.reduce((sum, entry) => sum + entry.saccoShare, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/" className="text-pakaza-blue hover:underline text-sm">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold text-pakaza-blue mt-2">Revenue Ledger</h1>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">KES {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-pakaza-blue">
          <p className="text-sm text-gray-500 mb-1">PAKAZA (50%)</p>
          <p className="text-2xl font-bold text-pakaza-blue">KES {totalPakaza.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-500">
          <p className="text-sm text-gray-500 mb-1">Operators (45%)</p>
          <p className="text-2xl font-bold text-green-600">KES {totalOperator.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-purple-500">
          <p className="text-sm text-gray-500 mb-1">SACCOs (5%)</p>
          <p className="text-2xl font-bold text-purple-600">KES {totalSacco.toLocaleString()}</p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {ledger.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No transactions yet. Revenue will appear here after payments.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Transaction ID</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Parcel ID</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">SACCO</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Total</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">PAKAZA (50%)</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Operator (45%)</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">SACCO (5%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ledger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{entry.id}</td>
                    <td className="px-6 py-4 font-bold text-pakaza-blue">{entry.parcelId}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{getSaccoName(entry.saccoId)}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">KES {entry.total.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-pakaza-blue">KES {entry.pakazaShare.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-green-600">KES {entry.operatorShare.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-purple-600">KES {entry.saccoShare.toLocaleString()}</td>
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
