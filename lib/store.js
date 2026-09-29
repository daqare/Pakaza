import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculatePrice, calculateSplit, generateTrackingId } from './pricing';

const usePakazaStore = create(
  persist(
    (set, get) => ({
      parcels: [],
      ledger: [],
      currentRole: 'ADMIN', // Default view
      smsToast: null, // Stores the current SMS message to show

      setRole: (role) => set({ currentRole: role }),

      showSms: (message) => {
        set({ smsToast: message });
        // Hide the toast after 4 seconds
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
        
        // Trigger SMS to Receiver
        get().showSms(`PAKAZA: Your parcel ${newParcel.id} from ${newParcel.senderName} has been received and paid. Tracking: ${newParcel.id}`);
        
        return newParcel;
      },
      
      updateStatus: (id, status) => {
        const parcel = get().parcels.find(p => p.id === id);
        if (parcel) {
           let smsText = "";
           if(status === 'IN_TRANSIT') smsText = `PAKAZA: Good news! Parcel ${id} is now IN TRANSIT to ${parcel.receiverName}.`;
           if(status === 'ARRIVED') smsText = `PAKAZA: Parcel ${id} has ARRIVED at the destination office. Ready for pickup.`;
           if(status === 'COLLECTED') smsText = `PAKAZA: Parcel ${id} has been successfully COLLECTED. Thank you for choosing us!`;
           
           if(smsText) get().showSms(smsText);
        }

        set((state) => ({
          parcels: state.parcels.map((p) =>
            p.id === id ? { ...p, status } : p
          ),
        }));
      },

      resetDemoData: () => {
        set({ parcels: [], ledger: [] });
      },
    }),
    { name: 'pakaza-storage' }
  )
);

export default usePakazaStore;
