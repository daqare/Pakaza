'use client';
import { useState } from 'react';
import Link from 'next/link';
import usePakazaStore from '../../lib/store';

export default function SettingsPage() {
  const { saccos, vehicles, addSacco, addVehicle } = usePakazaStore();
  const [activeTab, setActiveTab] = useState('saccos');
  
  // Form States
  const [newSacco, setNewSacco] = useState({ name: '', route: '', color: 'bg-blue-500' });
  const [newVehicle, setNewVehicle] = useState({ plate: '', driver: '', saccoId: saccos[0]?.id || '' });

  const handleAddSacco = (e) => {
    e.preventDefault();
    if (newSacco.name && newSacco.route) {
      addSacco(newSacco);
      setNewSacco({ name: '', route: '', color: 'bg-blue-500' });
    }
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (newVehicle.plate && newVehicle.driver) {
      addVehicle(newVehicle);
      setNewVehicle({ plate: '', driver: '', saccoId: saccos[0]?.id || '' });
    }
  };

  return (
    <div className="space-y-6 animate-slide-up max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/" className="text-pakaza-blue hover:underline text-sm">← Back to Dashboard</Link>
          <h1 className="text-3xl font-bold text-pakaza-blue mt-2">Network & Fleet Management</h1>
          <p className="text-sm text-gray-500">Register new partners and assign vehicles.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('saccos')}
          className={`px-6 py-3 font-semibold transition ${activeTab === 'saccos' ? 'text-pakaza-blue border-b-2 border-pakaza-blue' : 'text-gray-500 hover:text-gray-700'}`}
        >
          SACCO Partners
        </button>
        <button 
          onClick={() => setActiveTab('vehicles')}
          className={`px-6 py-3 font-semibold transition ${activeTab === 'vehicles' ? 'text-pakaza-blue border-b-2 border-pakaza-blue' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Fleet Registry
        </button>
      </div>

      {/* SACCO Tab */}
      {activeTab === 'saccos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Register New SACCO</h2>
            <form onSubmit={handleAddSacco} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SACCO Name</label>
                <input type="text" required value={newSacco.name} onChange={(e) => setNewSacco({...newSacco, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakaza-blue" placeholder="e.g., Easy Coach" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                <input type="text" required value={newSacco.route} onChange={(e) => setNewSacco({...newSacco, route: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakaza-blue" placeholder="e.g., Nairobi - Kisumu" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Color</label>
                <select value={newSacco.color} onChange={(e) => setNewSacco({...newSacco, color: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="bg-blue-500">Blue</option>
                  <option value="bg-green-500">Green</option>
                  <option value="bg-purple-500">Purple</option>
                  <option value="bg-red-500">Red</option>
                  <option value="bg-orange-500">Orange</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-pakaza-blue text-white py-2 rounded-lg font-semibold hover:bg-pakaza-darkBlue transition">Add SACCO</button>
            </form>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Active Partners ({saccos.length})</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {saccos.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 ${s.color} rounded-lg`}></div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.route}</p>
                  </div>
                  <span className="text-xs font-mono text-gray-400">{s.id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Tab */}
      {activeTab === 'vehicles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Register New Vehicle</h2>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
                <input type="text" required value={newVehicle.plate} onChange={(e) => setNewVehicle({...newVehicle, plate: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakaza-blue" placeholder="e.g., KDA 123A" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
                <input type="text" required value={newVehicle.driver} onChange={(e) => setNewVehicle({...newVehicle, driver: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakaza-blue" placeholder="e.g., James Mutua" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to SACCO</label>
                <select value={newVehicle.saccoId} onChange={(e) => setNewVehicle({...newVehicle, saccoId: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  {saccos.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-pakaza-blue text-white py-2 rounded-lg font-semibold hover:bg-pakaza-darkBlue transition">Add Vehicle</button>
            </form>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Fleet Registry ({vehicles.length})</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {vehicles.map(v => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-bold text-gray-900">{v.plate}</p>
                    <p className="text-xs text-gray-500">Driver: {v.driver}</p>
                  </div>
                  <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded">{v.saccoId}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
