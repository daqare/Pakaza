import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { initialSaccos } from './saccos';

const demoParcelsData = [
  { id: 'PAK-1001', senderName: 'John Kamau', receiverName: 'Mary Wanjiku', saccoId: 'SAC-001', weightKg: 5.5, status: 'IN_TRANSIT', date: '2 hours ago' },
  { id: 'PAK-1002', senderName: 'Tech Solutions Ltd', receiverName: 'David Ochieng', saccoId: 'SAC-002', weightKg: 12.0, status: 'ARRIVED', date: '5 hours ago' },
  { id: 'PAK-1003', senderName: 'Sarah Auma', receiverName: 'Peter Mwangi', saccoId: 'SAC-001', weightKg: 2.3, status: 'PAID', date: '1 day ago' },
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
    type: 'REVENUE'
  };
});

const initialVehicles = [
  { id: 'V-001', plate: 'KDA 123A', saccoId: 'SAC-001', driver: 'John Kamau' },
  { id: 'V-002', plate: 'KDC 456B', saccoId: 'SAC-002', driver: 'David Ochieng' },
];

const safeStorage = {
  getItem: (name) => typeof window !== 'undefined' ? localStorage.getItem(name) : null,
  setItem: (name, value) => typeof window !== 'undefined' ? localStorage.setItem(name, value) : null,
  removeItem: (name) => typeof window !== 'undefined' ? localStorage.removeItem(name) : null,
};

export const usePakazaStore = create(
  persist(
    (set, get) => ({
      parcels: initialParcels,
      ledger: initialLedger,
      saccos: initialSaccos, 
      vehicles: initialVehicles,
      withdrawals: [], 
      currentRole: 'ADMIN',
      operatorSaccoId: 'SAC-001', 
      smsToast: null,
      selectedParcel: null,

      setRole: (role) => set({ currentRole: role }),
      setSelectedParcel: (parcel) => set({ selectedParcel: parcel }),
      setOperatorSaccoId: (id) => set({ operatorSaccoId: id }),

      addSacco: (saccoData) => set((state) => ({
        saccos: [...(state.saccos || []), { ...saccoData, id: `SAC-${Date.now().toString().slice(-3)}` }]
      })),
      addVehicle: (vehicleData) => set((state) => ({
        vehicles: [...(state.vehicles || []), { ...vehicleData, id: `V-${Date.now().toString().slice(-3)}` }]
      })),

      requestPayout: (saccoId, amount, phone) => {
        const withdrawal = {
          id: `WTH-${Date.now().toString().slice(-6)}`,
          saccoId,
          amount,
          phone,
          date: new Date().toLocaleString(),
          status: 'COMPLETED',
          type: 'PAYOUT'
        };
        
        set((state) => ({
          withdrawals: [withdrawal, ...(state.withdrawals || [])],
          ledger: [{
             id: `TXN-${Date.now()}`,
             parcelId: 'N/A',
             saccoId,
             total: -amount,
             pakazaShare: 0, operatorShare: -amount, saccoShare: 0,
             date: withdrawal.date,
             type: 'PAYOUT'
          }, ...(state.ledger || [])]
        }));
        
        get().showSms(`PAKAZA: KES ${amount.toLocaleString()} has been sent to M-Pesa ${phone}. Ref: ${withdrawal.id}`);
      },

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
          type: 'REVENUE'
        };
        
        set((state) => ({
          parcels: [newParcel, ...(state.parcels || [])],
          ledger: [newLedgerEntry, ...(state.ledger || [])],
        }));
        
        get().showSms(`PAKAZA: Your parcel ${newParcel.id} has been received.`);
        return newParcel;
      },
      
      updateStatus: (id, status) => {
        const parcel = (get().parcels || []).find(p => p && p.id === id);
        if (parcel) {
          let smsText = '';
          if (status === 'IN_TRANSIT') smsText = `PAKAZA: Parcel ${id} is now IN TRANSIT.`;
          if (status === 'ARRIVED') smsText = `PAKAZA: Parcel ${id} has ARRIVED.`;
          if (status === 'COLLECTED') smsText = `PAKAZA: Parcel ${id} has been COLLECTED.`;
          if (smsText) get().showSms(smsText);
        }
        set((state) => ({
          parcels: (state.parcels || []).map((p) => p && p.id === id ? { ...p, status } : p),
        }));
      },

      hardResetApp: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('pakaza-storage');
          window.location.reload();
        }
      },

      resetDemoData: () => set({ parcels: initialParcels, ledger: initialLedger, saccos: initialSaccos, vehicles: initialVehicles, withdrawals: [] }),
    }),
    { 
      name: 'pakaza-storage', 
      storage: createJSONStorage(() => safeStorage),
      // THE BRAIN: If old cache is missing data, force it to use the new initial data
      merge: (persistedState, currentState) => {
        const p = persistedState || {};
        return {
          ...currentState,
          ...p,
          saccos: Array.isArray(p.saccos) ? p.saccos : initialSaccos,
          parcels: Array.isArray(p.parcels) ? p.parcels : initialParcels,
          ledger: Array.isArray(p.ledger) ? p.ledger : initialLedger,
          vehicles: Array.isArray(p.vehicles) ? p.vehicles : initialVehicles,
          withdrawals: Array.isArray(p.withdrawals) ? p.withdrawals : [],
        };
      }
    }
  )
);

export default usePakazaStore;
