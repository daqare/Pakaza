'use client';
import { usePakazaStore } from '../lib/store';

export default function RoleSwitcher() {
  const { currentRole, setRole } = usePakazaStore();

  const roles = [
    { id: 'ADMIN', label: 'Admin', icon: '🛡️' },
    { id: 'STAFF', label: 'Staff', icon: '📦' },
    { id: 'CLIENT', label: 'Client', icon: '📱' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white p-2 rounded-full shadow-2xl border border-gray-200 flex gap-2 animate-slide-up">
      {roles.map((role) => (
        <button
          key={role.id}
          onClick={() => setRole(role.id)}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
            currentRole === role.id
              ? 'bg-pakaza-blue text-white shadow-md scale-105'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          <span>{role.icon}</span>
          <span>{role.label}</span>
        </button>
      ))}
    </div>
  );
}
