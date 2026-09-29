'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import usePakazaStore from '../../lib/store';
import { saccos } from '../../lib/saccos';
import { calculatePrice } from '../../lib/pricing';
import WaybillReceipt from '../../components/WaybillReceipt';

function NewParcelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addParcel } = usePakazaStore();
  
  const saccoParam = searchParams.get('sacco');

  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    receiverName: '',
    receiverPhone: '',
    saccoId: saccoParam || '',
    weightKg: '',
    description: '',
  });
  
  const [showPayment, setShowPayment] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [generatedParcel, setGeneratedParcel] = useState(null);
  
  const price = calculatePrice(parseFloat(formData.weightKg) || 0);
  const selectedSacco = saccos.find(s => s.id === formData.saccoId);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handlePayment = async () => {
    setIsPaying(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newParcel = addParcel({
      ...formData,
      weightKg: parseFloat(formData.weightKg),
    });
    
    setIsPaying(false);
    setShowPayment(false);
    setGeneratedParcel(newParcel);
  };

  const handleReceiptClose = () => {
    setGeneratedParcel(null);
    router.push('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {generatedParcel && (
        <WaybillReceipt parcel={generatedParcel} onClose={handleReceiptClose} />
      )}

      <div className="mb-6">
        <button onClick={() => router.back()} className="text-pakaza-blue hover:underline flex items-center gap-1">
          ← Back to Dashboard
        </button>
      </div>

      {selectedSacco && (
        <div className="bg-pakaza-blue/10 border border-pakaza-blue/20 text-pakaza-blue px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-slide-up">
          <span className="text-2xl">📱</span>
          <div>
            <p className="font-bold text-sm">Client Self-Service Mode</p>
            <p className="text-xs">Booking via {selectedSacco.name} QR Code. SACCO is pre-selected.</p>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-pakaza-blue mb-6">New Parcel</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Your Details (Sender)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakaza-blue" value={formData.senderName} onChange={(e) => setFormData({...formData, senderName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input type="tel" required placeholder="07XX XXX XXX" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakaza-blue" value={formData.senderPhone} onChange={(e) => setFormData({...formData, senderPhone: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Receiver Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakaza-blue" value={formData.receiverName} onChange={(e) => setFormData({...formData, receiverName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input type="tel" required placeholder="07XX XXX XXX" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakaza-blue" value={formData.receiverPhone} onChange={(e) => setFormData({...formData, receiverPhone: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Parcel Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select SACCO *</label>
              <select
                required
                disabled={!!saccoParam}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakaza-blue ${saccoParam ? 'bg-gray-100 text-gray-600' : ''}`}
                value={formData.saccoId}
                onChange={(e) => setFormData({...formData, saccoId: e.target.value})}
              >
                <option value="">Choose a SACCO...</option>
                {saccos.map((sacco) => (
                  <option key={sacco.id} value={sacco.id}>{sacco.name} ({sacco.route})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg) *</label>
              <input type="number" step="0.1" min="0.1" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakaza-blue" value={formData.weightKg} onChange={(e) => setFormData({...formData, weightKg: e.target.value})} />
              {formData.weightKg && (
                <p className="mt-2 text-sm text-pakaza-blue font-semibold">Price: KES {price.toLocaleString()} ({Math.ceil(parseFloat(formData.weightKg))}kg × 200)</p>
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-pakaza-blue text-white py-3 rounded-lg font-semibold hover:bg-pakaza-darkBlue transition shadow-md">
          Proceed to Payment
        </button>
      </form>

      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full animate-slide-up my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">M-Pesa Payment</h2>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600 mb-1">Amount to Pay:</p>
              <p className="text-3xl font-bold text-pakaza-blue">KES {price.toLocaleString()}</p>
            </div>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">PAKAZA (50%):</span><span className="font-semibold">KES {Math.round(price * 0.50)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Operator (45%):</span><span className="font-semibold">KES {Math.round(price * 0.45)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">SACCO (5%):</span><span className="font-semibold">KES {Math.round(price * 0.05)}</span></div>
            </div>
            <div className="space-y-3">
              <button onClick={handlePayment} disabled={isPaying} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50">
                {isPaying ? 'Processing STK Push...' : 'Pay with M-Pesa'}
              </button>
              <button onClick={() => setShowPayment(false)} className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewParcel() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading booking form...</div>}>
      <NewParcelContent />
    </Suspense>
  );
}
