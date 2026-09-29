export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <button className="bg-pakaza-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-pakaza-darkBlue transition shadow-md">
          + New Parcel
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Parcels in Network</p>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Revenue Collected</p>
          <p className="text-3xl font-bold text-pakaza-blue">KES 0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Active Routes</p>
          <p className="text-3xl font-bold text-pakaza-green">3</p>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h3>
        <div className="text-center py-12 text-gray-400">
          <p>System initialized. Ready for Stage 2.</p>
        </div>
      </div>
    </div>
  );
}
