import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const demoParcelsData = [
  { id: 'PAK-1001', senderName: 'John Kamau', receiverName: 'Mary Wanjiku', saccoId: 'SAC-001', weightKg: 5.5, status: 'IN_TRANSIT', date: '2 hours ago' },
  { id: 'PAK-1002', senderName: 'Tech Solutions Ltd', receiverName: 'David Ochieng', saccoId: 'SAC-002', weightKg: 12.0, status: 'ARRIVED', date: '5 hours ago' },
  { id: 'PAK-1003', senderName: 'Sarah Auma', receiverName: 'Peter Mwangi', saccoId: 'SAC-003', weightKg: 2.3, status: 'PAID', date: '1 day ago' },
  { id: 'PAK-1004', senderName: 'Nairobi Electronics', receiverName: 'Makueni Traders', saccoId: 'SAC-003', weightKg: 25.0, status: 'COLLECTED', date: '2 days ago' },
  { id: 'PAK-1005', senderName: 'Grace Njeri', receiverName: 'James Mutua', saccoId: 'SAC-001', weightKg: 1.5, status: 'IN_TRANSIT', date: '3 days ago' },
];

const calculatePrice = (weight) => Math.ceil(weight) * 200;
const calculateSplit = (total) => ({
  pakaza: Math.round(total * 0.50),
  operator: Math.round(total * 0.45),
  sacco: Math.round(total * 0.05),
});
const generateTrackingId = () => `PAK-${Math.floor(1000 + Math.random() * 9000)}`;

const initialParcels = demoParcelsData.map((data) => ({
  ...data,
  senderPhone: '0712345678',
  receiverPhone: '0723456789',
  description: 'General Goods',
  price: calculatePrice(data.weightKg),
  createdAt: data.date,
}));

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

// SSR-safe storage
const safeStorage = {
  getItem: (name) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(name);
    }
    return null;
  },
  setItem: (name, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name);
    }
  },
};

export const usePakazaStore = create(
  persist(
    (set, get) => ({
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
          id: generateTrackingId(),
          senderName: parcelData.senderName,
          senderPhone: parcelData.senderPhone,
          receiverName: parcelData.receiverName,
          receiverPhone: parcelData.receiverPhone,
          saccoId: parcelData.saccoId,
          weightKg: parseFloat(parcelData.weightKg),
          description: parcelData.description || '',
          price,
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
        
        get().showSms(`PAKAZA: Your parcel ${newParcel.id} has been received. Tracking: ${newParcel.id}`);
        return newParcel;
      },
      
      updateStatus: (id, status) => {
        const parcel = get().parcels.find(p => p && p.id === id);
        if (parcel) {
          let smsText = '';
          if (status === 'IN_TRANSIT') smsText = `PAKAZA: Good news! Parcel ${id} is now IN TRANSIT.`;
          if (status === 'ARRIVED') smsText = `PAKAZA: Parcel ${id} has ARRIVED at the destination office.`;
          if (status === 'COLLECTED') smsText = `PAKAZA: Parcel ${id} has been successfully COLLECTED.`;
          if (smsText) get().showSms(smsText);
        }

        set((state) => ({
          parcels: state.parcels.map((p) => p && p.id === id ? { ...p, status } : p),
        }));
      },

      resetDemoData: () => {
        set({ parcels: initialParcels, ledger: initialLedger });
      },
    }),
    {
      name: 'pakaza-storage',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);

export default usePakazaStore;
