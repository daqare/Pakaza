import { create } from 'zustand';
import { calculatePrice, calculateSplit } from './pricing';

const demoParcelsData = [
  { id: 'PAK-1001', senderName: 'John Kamau', receiverName: 'Mary Wanjiku', saccoId: 'SAC-001', weightKg: 5.5, status: 'IN_TRANSIT', date: '2 hours ago' },
  { id: 'PAK-1002', senderName: 'Tech Solutions Ltd', receiverName: 'David Ochieng', saccoId: 'SAC-002', weightKg: 12.0, status: 'ARRIVED', date: '5 hours ago' },
  { id: 'PAK-1003', senderName: 'Sarah Auma', receiverName: 'Peter Mwangi', saccoId: 'SAC-003', weightKg: 2.3, status: 'PAID', date: '1 day ago' },
];

const initialParcels = demoParcelsData.map((data) => {
  const price = calculatePrice(data.weightKg);
  return {
    ...data,
    senderPhone: '0712345678',
    receiverPhone: '0723456789',
    description: 'General Goods',
    price,
    createdAt: data.date,
  };
});

const initialLedger = initialParcels.map((p) => {
  const split = calculateSplit(p.price);
  return {
    id: `TXN-DEMO-${p.id.split('-')[1]}`,
    parcelId: p.id,
    saccoId: p.saccoId,
    total: p.price,
    pakazaShare: split.pakaza,
    operatorShare: split.operator,
    saccoShare: split.sacco,
    date: p.createdAt,
  };
});

export const usePakazaStore = create((set, get) => ({
  parcels: initialParcels,
  ledger: initialLedger,
  currentRole: 'ADMIN',
  smsToast: null,
  selectedParcel: null,

  setRole: (role) => set({ currentRole: role }),
  setSelectedParcel: (parcel) => set({ selectedParcel: parcel }),

  showSms: (message) => {
    set({ smsToast: message });
    setTimeout(() => set({ smsToast: null }), 4000);
  },

  addParcel: (parcelData) => {
    const price = calculatePrice(parseFloat(parcelData.weightKg));
    const split = calculateSplit(price);
    
    const newParcel = {
      id: `PAK-${Math.floor(1000 + Math.random() * 9000)}`,
      senderName: parcelData.senderName,
      senderPhone: parcelData.senderPhone,
      receiverName: parcelData.receiverName,
      receiverPhone: parcelData.receiverPhone,
      saccoId: parcelData.saccoId,
      weightKg: parseFloat(parcelData.weightKg),
      description: parcelData.description || '',
      price: price,
      status: 'PAID', 
      createdAt: 'Just now',
    };
    
    const newLedgerEntry = {
      id: `TXN-${Date.now()}`,
      parcelId: newParcel.id,
      saccoId: newParcel.saccoId,
      total: price,
      pakazaShare: split.pakaza,
      operatorShare: split.operator,
      saccoShare: split.sacco,
      date: newParcel.createdAt,
    };
    
    set((state) => ({
      parcels: [newParcel, ...state.parcels],
      ledger: [newLedgerEntry, ...state.ledger],
    }));
    
    get().showSms(`PAKAZA: Your parcel ${newParcel.id} has been received.`);
    return newParcel;
  },
  
  updateStatus: (id, status) => {
    set((state) => ({
      parcels: state.parcels.map((p) => p && p.id === id ? { ...p, status } : p),
    }));
  },

  resetDemoData: () => {
    set({ parcels: initialParcels, ledger: initialLedger });
  },
}));

export default usePakazaStore;
