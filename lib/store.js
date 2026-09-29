import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculatePrice, calculateSplit, generateTrackingId } from './pricing';

export const usePakazaStore = create(
  persist(
    (set, get) => ({
      parcels: [],
      ledger: [],
      currentRole: 'ADMIN',
      smsToast: null,

      setRole: (role) => set({ currentRole: role }),

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
          price: price,
          status: 'PAID', 
          createdAt: new Date().toLocaleString(),
        };
        
        const newLedgerEntry = {
          id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
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
        
        get().showSms(`PAKAZA: Your parcel ${newParcel.id} from ${newParcel.senderName} has been received. Tracking: ${newParcel.id}`);
        
        return newParcel;
      },
      
      updateStatus: (id, status) => {
        const parcel = get().parcels.find(p => p.id === id);
        if (parcel) {
           let smsText = "";
           if(status === 'IN_TRANSIT') smsText = `PAKAZA: Good news! Parcel ${id} is now IN TRANSIT to ${parcel.receiverName}.`;
           if(status === 'ARRIVED') smsText = `PAKAZA: Parcel ${id} has ARRIVED at the destination office. Ready for pickup.`;
           if(status === 'COLLECTED') smsText = `PAKAZA: Parcel ${id} has been successfully COLLECTED. Thank you!`;
           
           if(smsText) get().showSms(smsText);
        }

        set((state) => ({
          parcels: state.parcels.map((p) => p.id === id ? { ...p, status } : p),
        }));
      },

      // NEW: Seed realistic demo data
      seedDemoData: () => {
        const demoParcels = [
          { senderName: 'John Kamau', receiverName: 'Mary Wanjiku', saccoId: 'SAC-001', weightKg: 5.5, status: 'IN_TRANSIT', date: '2 hours ago' },
          { senderName: 'Tech Solutions Ltd', receiverName: 'David Ochieng', saccoId: 'SAC-002', weightKg: 12.0, status: 'ARRIVED', date: '5 hours ago' },
          { senderName: 'Sarah Auma', receiverName: 'Peter Mwangi', saccoId: 'SAC-003', weightKg: 2.3, status: 'PAID', date: '1 day ago' },
          { senderName: 'Nairobi Electronics', receiverName: 'Makueni Traders', saccoId: 'SAC-003', weightKg: 25.0, status: 'COLLECTED', date: '2 days ago' },
          { senderName: 'Grace Njeri', receiverName: 'James Mutua', saccoId: 'SAC-001', weightKg: 1.5, status: 'IN_TRANSIT', date: '3 days ago' },
        ];

        const newParcels = [];
        const newLedger = [];

        demoParcels.forEach((data, index) => {
          const price = calculatePrice(data.weightKg);
          const split = calculateSplit(price);
          const id = `PAK-${1000 + index}`;
          const dateStr = new Date(Date.now() - index * 86400000).toLocaleString();

          newParcels.push({
            id,
            senderName: data.senderName,
            senderPhone: '0712345678',
            receiverName: data.receiverName,
            receiverPhone: '0723456789',
            saccoId: data.saccoId,
            weightKg: data.weightKg,
            description: 'General Goods',
            price,
            status: data.status,
            createdAt: dateStr,
          });

          newLedger.push({
            id: `TXN-DEMO-${1000 + index}`,
            parcelId: id,
            saccoId: data.saccoId,
            total: price,
            pakazaShare: split.pakaza,
            operatorShare: split.operator,
            saccoShare: split.sacco,
            date: dateStr,
          });
        });

        set((state) => ({
          parcels: [...newParcels, ...state.parcels],
          ledger: [...newLedger, ...state.ledger],
        }));
        
        get().showSms("PAKAZA: Demo data loaded successfully!");
      },

      resetDemoData: () => {
        set({ parcels: [], ledger: [] });
      },
    }),
    { name: 'pakaza-storage' }
  )
);

export default usePakazaStore;
