'use client';
import { usePakazaStore } from '../lib/store';

export default function SmsToast() {
  const { smsToast } = usePakazaStore();

  if (!smsToast) return null;

  return (
    <div className="fixed top-24 right-6 z-50 max-w-sm w-full">
      <div className="bg-gray-900 text-white p-4 rounded-xl shadow-2xl border-l-4 border-green-500 flex items-start gap-3 animate-bounce">
        <div className="text-2xl">📱</div>
        <div>
          <p className="text-xs text-gray-400 font-bold mb-1">NEW SMS FROM PAKAZA</p>
          <p className="text-sm font-medium leading-snug">{smsToast}</p>
        </div>
      </div>
    </div>
  );
}
