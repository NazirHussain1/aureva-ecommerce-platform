export default function Reports() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sales Overview</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <p>Sales chart will be displayed here</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Products</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <p>Top products chart will be displayed here</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Revenue by Category</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <p>Category revenue chart will be displayed here</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Growth</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <p>Customer growth chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
