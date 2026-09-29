export default function Home() {
  return (
    <div className="min-h-screen bg-pakaza-light">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-pakaza-blue mb-8">
          PAKAZA Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Parcels in Network</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Revenue Collected</p>
            <p className="text-3xl font-bold text-pakaza-blue">KES 0</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Active Routes</p>
            <p className="text-3xl font-bold text-pakaza-green">3</p>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-500 text-center py-8">
            System ready. No parcels yet.
          </p>
        </div>
      </div>
    </div>
  );
}
