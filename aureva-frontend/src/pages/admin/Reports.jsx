import { useState, useEffect } from 'react';
// Example: import charts when ready
// import { LineChart, PieChart, BarChart } from 'recharts';
// import { fetchReportsData } from '../../api/reportsApi';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState({
    sales: [],
    topProducts: [],
    revenueByCategory: [],
    customerGrowth: []
  });

  useEffect(() => {
    // Simulate API call for now
    const loadData = async () => {
      setLoading(true);
      try {
        // const data = await fetchReportsData();
        // setReportsData(data);
        await new Promise(res => setTimeout(res, 1000)); // simulate delay
      } catch (error) {
        console.error('Error loading reports:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const chartPlaceholder = (text) => (
    <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
      <p>{text}</p>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sales Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Sales Overview</h2>
            {chartPlaceholder('Sales chart will be displayed here')}
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 Top Products</h2>
            {chartPlaceholder('Top products chart will be displayed here')}
          </div>

          {/* Revenue by Category */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">💰 Revenue by Category</h2>
            {chartPlaceholder('Category revenue chart will be displayed here')}
          </div>

          {/* Customer Growth */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📈 Customer Growth</h2>
            {chartPlaceholder('Customer growth chart will be displayed here')}
          </div>
        </div>
      )}
    </div>
  );
}
