import { formatPrice } from '../../utils/formatters';

export default function Reports() {
  const salesData = [
    { month: 'January', revenue: 12500, orders: 45 },
    { month: 'February', revenue: 15200, orders: 52 },
    { month: 'March', revenue: 18900, orders: 67 },
    { month: 'April', revenue: 16700, orders: 58 },
    { month: 'May', revenue: 21300, orders: 75 },
    { month: 'June', revenue: 19800, orders: 69 },
  ];

  const topProducts = [
    { name: 'Hydrating Serum', sales: 234, revenue: 10746 },
    { name: 'Matte Lipstick', sales: 189, revenue: 3777 },
    { name: 'Hair Mask', sales: 156, revenue: 5142 },
    { name: 'Face Cream', sales: 145, revenue: 7250 },
    { name: 'Eye Shadow Palette', sales: 123, revenue: 6150 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Reports & Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>
          <div className="space-y-3">
            {salesData.map((data) => (
              <div key={data.month} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">{data.month}</p>
                  <p className="text-sm text-gray-600">{data.orders} orders</p>
                </div>
                <p className="font-bold text-pink-600">{formatPrice(data.revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Top Products</h2>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center">
                  <span className="bg-pink-100 text-pink-600 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} sold</p>
                  </div>
                </div>
                <p className="font-bold">{formatPrice(product.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-pink-600">{formatPrice(104400)}</p>
          <p className="text-sm text-green-600 mt-2">↑ 15% from last period</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 mb-2">Average Order Value</h3>
          <p className="text-3xl font-bold text-pink-600">{formatPrice(285.75)}</p>
          <p className="text-sm text-green-600 mt-2">↑ 8% from last period</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 mb-2">Conversion Rate</h3>
          <p className="text-3xl font-bold text-pink-600">3.2%</p>
          <p className="text-sm text-green-600 mt-2">↑ 0.5% from last period</p>
        </div>
      </div>
    </div>
  );
}
