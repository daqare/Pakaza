'use client';
import { usePakazaStore } from '../lib/store';

export default function ParcelDetailModal() {
  const { selectedParcel, setSelectedParcel, updateStatus, saccos } = usePakazaStore();
  if (!selectedParcel) return null;

  const safeSaccos = Array.isArray(saccos) ? saccos : [];
  const sacco = safeSaccos.find(s => s.id === selectedParcel.saccoId);
  const price = selectedParcel.price || 0;
  const status = selectedParcel.status || 'UNKNOWN';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={() => setSelectedParcel(null)}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-8" onClick={(e) => e.stopPropagation()}>
        <div className="bg-pakaza-blue text-white p-6 flex justify-between items-start">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Tracking ID</p>
            <h2 className="text-3xl font-black">{selectedParcel.id}</h2>
          </div>
          <button onClick={() => setSelectedParcel(null)} className="text-white/70 hover:text-white text-2xl">✕</button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${status === 'PAID' ? 'bg-blue-100 text-blue-800' : status === 'IN_TRANSIT' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
              {status.replace('_', ' ')}
            </span>
            <span className="text-sm font-semibold text-gray-600">{sacco?.name || 'Unknown SACCO'}</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-pakaza-blue"></div>
              <div><p className="text-xs text-gray-500 uppercase">Sender</p><p className="font-semibold">{selectedParcel.senderName || 'N/A'}</p></div>
            </div>
            <div className="w-0.5 h-6 bg-gray-300 ml-1"></div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-pakaza-green"></div>
              <div><p className="text-xs text-gray-500 uppercase">Receiver</p><p className="font-semibold">{selectedParcel.receiverName || 'N/A'}</p></div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">Financial Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-600">Total Price</span><span className="font-bold">KES {price.toLocaleString()}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-pakaza-blue">PAKAZA (50%)</span><span className="font-semibold text-pakaza-blue">KES {Math.round(price * 0.5).toLocaleString()}</span></div>
              <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-green-600">Operator (45%)</span><span className="font-semibold text-green-600">KES {Math.round(price * 0.45).toLocaleString()}</span></div>
              <div className="flex justify-between py-2"><span className="text-purple-600">SACCO (5%)</span><span className="font-semibold text-purple-600">KES {Math.round(price * 0.05).toLocaleString()}</span></div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Update Status</label>
            <select value={status} onChange={(e) => { updateStatus(selectedParcel.id, e.target.value); setSelectedParcel({ ...selectedParcel, status: e.target.value }); }} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
              <option value="INITIATED">Initiated</option>
              <option value="PAID">Paid</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="ARRIVED">Arrived</option>
              <option value="COLLECTED">Collected</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
