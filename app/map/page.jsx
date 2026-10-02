'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';

// Dynamically import the map to prevent Server-Side Rendering (SSR) errors with Leaflet
const LiveMap = dynamic(() => import('../../components/LiveMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-2xl">
      <p className="text-gray-500 font-medium animate-pulse">Loading Map Engine...</p>
    </div>
  )
});

export default function MapPage() {
  const [status, setStatus] = useState('IN_TRANSIT');

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <Link href="/dashboard" className="text-[#0047AB] hover:underline text-sm font-bold flex items-center gap-1">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-black text-[#0047AB] mt-1">Live Fleet Tracking</h1>
        </div>
        
        {/* Demo Controls for Investors */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setStatus('PAID')} 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${status === 'PAID' ? 'bg-white text-[#0047AB] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Parked at Hub
          </button>
          <button 
            onClick={() => setStatus('IN_TRANSIT')} 
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${status === 'IN_TRANSIT' ? 'bg-[#00A651] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            In Transit (Live)
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-grow rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative z-0 bg-gray-100">
        <LiveMap parcelStatus={status} />
        
        {/* Overlay Info Card */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg z-[1000] max-w-xs border border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm">Route: Nairobi → Machakos</h3>
          <p className="text-xs text-gray-600 mb-3">Operator: Kina SACCO (KDA 123A)</p>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${status === 'IN_TRANSIT' ? 'bg-[#00A651] animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-xs font-bold uppercase tracking-wide text-gray-700">{status.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
