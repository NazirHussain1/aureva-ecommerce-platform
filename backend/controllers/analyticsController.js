const AnalyticsService = require('../services/analyticsService');

// Get dashboard summary
const getDashboardSummary = async (req, res) => {
  try {
    const summary = await AnalyticsService.getDashboardSummary();
    res.json(summary);
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Failed to generate dashboard summary' });
  }
};

// Get sales report
const getSalesReport = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      groupBy = 'day' 
    } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Start date and end date are required' 
      });
    }

    const validGroupBy = ['hour', 'day', 'week', 'month', 'year'];
    if (!validGroupBy.includes(groupBy)) {
      return res.status(400).json({ 
        message: 'Invalid groupBy parameter. Must be one of: ' + validGroupBy.join(', ') 
      });
    }

    const report = await AnalyticsService.getSalesReport(
      new Date(startDate), 
      new Date(endDate), 
      groupBy
    );

    res.json({
      period: { startDate, endDate, groupBy },
      ...report
    });
  } catch (error) {
    console.error('Sales report error:', error);
    res.status(500).json({ message: 'Failed to generate sales report' });
  }
};

// Get product performance report
const getProductPerformance = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      limit = 10 
    } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Start date and end date are required' 
      });
    }

    const report = await AnalyticsService.getProductPerformance(
      new Date(startDate), 
      new Date(endDate), 
      limit
    );

    res.json({
      period: { startDate, endDate },
      ...report
    });
  } catch (error) {
    console.error('Product performance error:', error);
    res.status(500).json({ message: 'Failed to generate product performance report' });
  }
};

// Get customer analytics
const getCustomerAnalytics = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate 
    } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Start date and end date are required' 
      });
    }

    const analytics = await AnalyticsService.getCustomerAnalytics(
      new Date(startDate), 
      new Date(endDate)
    );

    res.json({
      period: { startDate, endDate },
      ...analytics
    });
  } catch (error) {
    console.error('Customer analytics error:', error);
    res.status(500).json({ message: 'Failed to generate customer analytics' });
  }
};

// Get category performance
const getCategoryPerformance = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate 
    } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Start date and end date are required' 
      });
    }

    const performance = await AnalyticsService.getCategoryPerformance(
      new Date(startDate), 
      new Date(endDate)
    );

    res.json({
      period: { startDate, endDate },
      categories: performance
    });
  } catch (error) {
    console.error('Category performance error:', error);
    res.status(500).json({ message: 'Failed to generate category performance report' });
  }
};

// Get revenue tracking
const getRevenueTracking = async (req, res) => {
  try {
    const { 
      period = 'month', 
      limit = 12 
    } = req.query;

    const validPeriods = ['day', 'week', 'month', 'year'];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({ 
        message: 'Invalid period parameter. Must be one of: ' + validPeriods.join(', ') 
      });
    }

    const tracking = await AnalyticsService.getRevenueTracking(period, limit);

    res.json({
      period,
      limit: parseInt(limit),
      data: tracking
    });
  } catch (error) {
    console.error('Revenue tracking error:', error);
    res.status(500).json({ message: 'Failed to generate revenue tracking report' });
  }
};

// Get comprehensive analytics report
const getComprehensiveReport = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate 
    } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Start date and end date are required' 
      });
    }

    const [
      salesReport,
      productPerformance,
      customerAnalytics,
      categoryPerformance,
      revenueTracking
    ] = await Promise.all([
      AnalyticsService.getSalesReport(new Date(startDate), new Date(endDate), 'day'),
      AnalyticsService.getProductPerformance(new Date(startDate), new Date(endDate), 10),
      AnalyticsService.getCustomerAnalytics(new Date(startDate), new Date(endDate)),
      AnalyticsService.getCategoryPerformance(new Date(startDate), new Date(endDate)),
      AnalyticsService.getRevenueTracking('day', 30)
    ]);

    res.json({
      period: { startDate, endDate },
      sales: salesReport,
      products: productPerformance,
      customers: customerAnalytics,
      categories: categoryPerformance,
      revenue: revenueTracking
    });
  } catch (error) {
    console.error('Comprehensive report error:', error);
    res.status(500).json({ message: 'Failed to generate comprehensive report' });
  }
};

// Export analytics data
const exportAnalyticsData = async (req, res) => {
  try {
    const { 
      type = 'sales',
      startDate, 
      endDate,
      format = 'csv'
    } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Start date and end date are required' 
      });
    }

    let data;
    let filename;

    switch (type) {
      case 'sales':
        data = await AnalyticsService.getSalesReport(new Date(startDate), new Date(endDate), 'day');
        filename = `sales-report-${startDate}-to-${endDate}`;
        break;
      case 'products':
        data = await AnalyticsService.getProductPerformance(new Date(startDate), new Date(endDate), 50);
        filename = `product-performance-${startDate}-to-${endDate}`;
        break;
      case 'customers':
        data = await AnalyticsService.getCustomerAnalytics(new Date(startDate), new Date(endDate));
        filename = `customer-analytics-${startDate}-to-${endDate}`;
        break;
      default:
        return res.status(400).json({ message: 'Invalid export type' });
    }

    if (format === 'csv') {
      // Convert to CSV
      let csvContent = '';
      
      if (type === 'sales') {
        csvContent = 'Period,Total Orders,Total Revenue,Average Order Value\n';
        data.salesData.forEach(row => {
          csvContent += `${row.period},${row.totalOrders},${row.totalRevenue},${row.averageOrderValue}\n`;
        });
      } else if (type === 'products') {
        csvContent = 'Product Name,Category,Brand,Total Sold,Total Revenue,Order Count\n';
        data.topProducts.forEach(row => {
          csvContent += `"${row.product.name}","${row.product.category}","${row.product.brand || ''}",${row.totalSold},${row.totalRevenue},${row.orderCount}\n`;
        });
      } else if (type === 'customers') {
        csvContent = 'Customer Name,Email,Total Orders,Total Spent,Average Order Value\n';
        data.customerLTV.forEach(row => {
          csvContent += `"${row.name}","${row.email}",${row.totalOrders},${row.totalSpent},${row.averageOrderValue}\n`;
        });
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send(csvContent);
    } else {
      // Return JSON
      res.json(data);
    }
  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({ message: 'Failed to export analytics data' });
  }
};

module.exports = {
  getDashboardSummary,
  getSalesReport,
  getProductPerformance,
  getCustomerAnalytics,
  getCategoryPerformance,
  getRevenueTracking,
  getComprehensiveReport,
  exportAnalyticsData
};