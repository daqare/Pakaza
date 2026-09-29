'use client';
import { usePakazaStore } from '../lib/store';
import { saccos } from '../lib/saccos';

export default function ParcelDetailModal() {
  const { selectedParcel, setSelectedParcel, updateStatus } = usePakazaStore();

  if (!selectedParcel) return null;

  const sacco = saccos.find((s) => s.id === selectedParcel.saccoId);
  const split = {
    pakaza: Math.round(selectedParcel.price * 0.50),
    operator: Math.round(selectedParcel.price * 0.45),
    sacco: Math.round(selectedParcel.price * 0.05),
  };

  const statusColors = {
    INITIATED: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-blue-100 text-blue-800',
    IN_TRANSIT: 'bg-purple-100 text-purple-800',
    ARRIVED: 'bg-green-100 text-green-800',
    COLLECTED: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedParcel(null)}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Modal Header */}
        <div className="bg-pakaza-blue text-white p-6 flex justify-between items-start">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Tracking ID</p>
            <h2 className="text-3xl font-black tracking-tight">{selectedParcel.id}</h2>
          </div>
          <button 
            onClick={() => setSelectedParcel(null)}
            className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Status & SACCO */}
          <div className="flex justify-between items-center">
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${statusColors[selectedParcel.status]}`}>
              {selectedParcel.status.replace('_', ' ')}
            </span>
            <span className="text-sm font-semibold text-gray-600">{sacco?.name}</span>
          </div>

          {/* Route Details */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-pakaza-blue"></div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Sender</p>
                <p className="font-semibold text-gray-900">{selectedParcel.senderName}</p>
              </div>
            </div>
            <div className="w-0.5 h-6 bg-gray-300 ml-1"></div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-pakaza-green"></div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Receiver</p>
                <p className="font-semibold text-gray-900">{selectedParcel.receiverName}</p>
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Financial Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Weight</span>
                <span className="font-semibold">{selectedParcel.weightKg} kg</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Price</span>
                <span className="font-bold text-gray-900">KES {selectedParcel.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-pakaza-blue">PAKAZA Share (50%)</span>
                <span className="font-semibold text-pakaza-blue">KES {split.pakaza.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-green-600">Operator Share (45%)</span>
                <span className="font-semibold text-green-600">KES {split.operator.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-purple-600">SACCO Share (5%)</span>
                <span className="font-semibold text-purple-600">KES {split.sacco.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Actions (Only for Admin/Staff) */}
          <div className="pt-4 border-t border-gray-200">
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Update Status</label>
            <select 
              value={selectedParcel.status}
              onChange={(e) => {
                updateStatus(selectedParcel.id, e.target.value);
                // Update the local selectedParcel state to reflect change immediately
                usePakazaStore.setState({ 
                  selectedParcel: { ...selectedParcel, status: e.target.value } 
                });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakaza-blue focus:border-transparent font-medium"
            >
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
