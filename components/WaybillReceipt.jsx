'use client';
import { saccos } from '../lib/saccos';

export default function WaybillReceipt({ parcel, onClose }) {
  const sacco = saccos.find((s) => s && s.id === parcel.saccoId);
  const price = parcel.price || 0;
  const split = {
    pakaza: Math.round(price * 0.50),
    operator: Math.round(price * 0.45),
    sacco: Math.round(price * 0.05),
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    // Outer wrapper: Allows scrolling on small screens
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm no-print overflow-y-auto">
      {/* Inner card: Has margin top/bottom to allow scrolling */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8 overflow-hidden animate-slide-up relative">
        
        {/* Header */}
        <div className="bg-pakaza-blue text-white p-6 text-center relative no-print-header">
          <h2 className="text-2xl font-black tracking-tight mb-1">PAKAZA WAYBILL</h2>
          <p className="text-blue-200 text-sm">Official Proof of Consignment</p>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition z-10"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Printable Area */}
        <div id="waybill-print-area" className="p-6 space-y-6">
          
          {/* Stable QR Code (No flickering) */}
          <div className="flex flex-col items-center border-b-2 border-dashed border-gray-300 pb-6">
            <div className="w-32 h-32 bg-gray-900 rounded-lg mb-3 flex items-center justify-center p-2">
               {/* Static SVG QR Placeholder */}
               <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                 <rect x="10" y="10" width="30" height="30" fill="currentColor"/>
                 <rect x="60" y="10" width="30" height="30" fill="currentColor"/>
                 <rect x="10" y="60" width="30" height="30" fill="currentColor"/>
                 <rect x="50" y="50" width="10" height="10" fill="currentColor"/>
                 <rect x="70" y="70" width="20" height="20" fill="currentColor"/>
                 <rect x="50" y="10" width="10" height="10" fill="currentColor"/>
                 <rect x="10" y="50" width="10" height="10" fill="currentColor"/>
               </svg>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Tracking ID</p>
            <p className="text-3xl font-black text-pakaza-blue tracking-tight">{parcel.id}</p>
          </div>

          {/* Route Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase font-bold">From (Sender)</p>
                <p className="font-bold text-gray-900">{parcel.senderName}</p>
                <p className="text-sm text-gray-600">{parcel.senderPhone}</p>
              </div>
              <div className="px-2 pt-6 text-gray-400">→</div>
              <div className="flex-1 text-right">
                <p className="text-xs text-gray-500 uppercase font-bold">To (Receiver)</p>
                <p className="font-bold text-gray-900">{parcel.receiverName}</p>
                <p className="text-sm text-gray-600">{parcel.receiverPhone}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Assigned SACCO</p>
                <p className="font-semibold text-gray-900">{sacco?.name || 'Unknown'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-bold">Weight</p>
                <p className="font-semibold text-gray-900">{parcel.weightKg} kg</p>
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="border-t-2 border-dashed border-gray-300 pt-4">
            <p className="text-xs text-gray-500 uppercase font-bold mb-3">Payment Breakdown</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount Paid</span>
                <span className="font-black text-lg text-gray-900">KES {price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>PAKAZA (50%)</span>
                <span>KES {split.pakaza.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Operator (45%)</span>
                <span>KES {split.operator.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>SACCO Admin (5%)</span>
                <span>KES {split.sacco.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-400">Generated on: {parcel.createdAt}</p>
            <p className="text-xs text-pakaza-green font-semibold mt-1">✓ Payment Confirmed via M-Pesa</p>
          </div>
        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3 no-print sticky bottom-0">
          <button 
            onClick={handlePrint}
            className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            ️ Print
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-pakaza-blue text-white py-3 rounded-xl font-bold hover:bg-pakaza-darkBlue transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
