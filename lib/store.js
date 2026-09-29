import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculatePrice, calculateSplit, generateTrackingId } from './pricing';

const usePakazaStore = create(
  persist(
    (set) => ({
      parcels: [],
      ledger: [],
      
      // Add a new parcel
      addParcel: (parcelData) => {
        const price = calculatePrice(parcelData.weightKg);
        const split = calculateSplit(price);
        
        const newParcel = {
          id: generateTrackingId(),
          ...parcelData,
          price,
          split,
          status: 'INITIATED',
          createdAt: new Date().toLocaleString(),
        };
        
        set((state) => ({
          parcels: [newParcel, ...state.parcels],
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
      
      // Get total revenue
      getTotalRevenue: () => {
        return usePakazaStore.getState().ledger.reduce((sum, entry) => sum + entry.total, 0);
      },
    }),
    { name: 'pakaza-storage' }
  )
);

export default usePakazaStore;
