'use client';
import { usePakazaStore } from '../lib/store';

export default function RoleSwitcher() {
  const { currentRole, setRole } = usePakazaStore();

  const roles = [
    { id: 'ADMIN', label: 'Admin', icon: '🛡️' },
    { id: 'STAFF', label: 'Staff', icon: '📦' },
    { id: 'OPERATOR', label: 'Driver', icon: '🚐' },
    { id: 'CLIENT', label: 'Client', icon: '📱' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white p-2 rounded-2xl shadow-2xl border-2 border-gray-200 flex gap-2 animate-slide-up">
      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => setRole(role.id)}
          className={`px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            currentRole === role.id
              ? 'bg-[#0047AB] text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="text-lg">{role.icon}</span>
          <span className="hidden sm:inline">{role.label}</span>
        </button>
      ))}
    </div>
  );
}
