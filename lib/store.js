import { create } from 'zustand';

// Data is built-in so it never fails to load
const initialSaccos = [
  { id: 'SAC-001', name: 'Kina SACCO', route: 'Nairobi - Machakos', color: 'bg-blue-500' },
  { id: 'SAC-002', name: 'Prestige SACCO', route: 'Nairobi - Mwingi', color: 'bg-purple-500' },
  { id: 'SAC-003', name: 'Makos SACCO', route: 'Nairobi - Makueni', color: 'bg-green-500' },
];

const initialParcels = [
  { id: 'PAK-1001', senderName: 'John Kamau', receiverName: 'Mary Wanjiku', saccoId: 'SAC-001', weightKg: 5.5, status: 'IN_TRANSIT', price: 1200, senderPhone: '0712345678', receiverPhone: '0723456789', createdAt: '2 hours ago' },
  { id: 'PAK-1002', senderName: 'Tech Solutions', receiverName: 'David Ochieng', saccoId: 'SAC-002', weightKg: 12.0, status: 'ARRIVED', price: 2400, senderPhone: '0712345678', receiverPhone: '0723456789', createdAt: '5 hours ago' },
  { id: 'PAK-1003', senderName: 'Sarah Auma', receiverName: 'Peter Mwangi', saccoId: 'SAC-001', weightKg: 2.3, status: 'PAID', price: 600, senderPhone: '0712345678', receiverPhone: '0723456789', createdAt: '1 day ago' },
];

const initialLedger = initialParcels.map(p => ({
  id: `TXN-${p.id.split('-')[1]}`, parcelId: p.id, saccoId: p.saccoId, total: p.price,
  pakazaShare: Math.round(p.price * 0.5), operatorShare: Math.round(p.price * 0.45), saccoShare: Math.round(p.price * 0.05), date: p.createdAt
}));

export const usePakazaStore = create((set, get) => ({
  parcels: initialParcels,
  ledger: initialLedger,
  saccos: initialSaccos,
  currentRole: 'ADMIN',
  operatorSaccoId: 'SAC-001',
  smsToast: null,
  selectedParcel: null,

  setRole: (role) => set({ currentRole: role }),
  setSelectedParcel: (parcel) => set({ selectedParcel: parcel }),
  setOperatorSaccoId: (id) => set({ operatorSaccoId: id }),

  showSms: (msg) => { set({ smsToast: msg }); setTimeout(() => set({ smsToast: null }), 4000); },

  addParcel: (data) => {
    const price = Math.ceil(data.weightKg) * 200;
    const newParcel = { id: `PAK-${Math.floor(1000 + Math.random() * 9000)}`, ...data, price, status: 'PAID', createdAt: 'Just now' };
    const newLedger = { id: `TXN-${Date.now()}`, parcelId: newParcel.id, saccoId: data.saccoId, total: price, pakazaShare: Math.round(price*0.5), operatorShare: Math.round(price*0.45), saccoShare: Math.round(price*0.05), date: 'Just now' };
    set(state => ({ parcels: [newParcel, ...state.parcels], ledger: [newLedger, ...state.ledger] }));
    get().showSms(`PAKAZA: Parcel ${newParcel.id} received.`);
    return newParcel;
  },

  updateStatus: (id, status) => {
    const p = get().parcels.find(x => x.id === id);
    if (p) {
      let msg = '';
      if (status === 'IN_TRANSIT') msg = `Parcel ${id} is IN TRANSIT.`;
      if (status === 'ARRIVED') msg = `Parcel ${id} has ARRIVED.`;
      if (msg) get().showSms(`PAKAZA: ${msg}`);
    }
    set(state => ({ parcels: state.parcels.map(x => x.id === id ? { ...x, status } : x) }));
  },

  resetDemoData: () => set({ parcels: initialParcels, ledger: initialLedger, saccos: initialSaccos })
}));

export default usePakazaStore;
