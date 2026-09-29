import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculatePrice, calculateSplit, generateTrackingId } from './pricing';

const usePakazaStore = create(
  persist(
    (set, get) => ({
      parcels: [],
      ledger: [],
      
      // Add a new parcel and its ledger entry simultaneously
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
          price: price,
          status: 'PAID', 
          createdAt: new Date().toLocaleString(),
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
        
        return newParcel;
      },
      
      // Update parcel status
      updateStatus: (id, status) => {
        set((state) => ({
          parcels: state.parcels.map((p) =>
            p.id === id ? { ...p, status } : p
          ),
        }));
      },

      // NEW: Reset all demo data
      resetDemoData: () => {
        set({ parcels: [], ledger: [] });
      },
    }),
    { name: 'pakaza-storage' }
  )
);

export default usePakazaStore;
