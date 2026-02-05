const ReportingService = require('../services/reportingService');

// Get advanced sales report with comparison
const getAdvancedSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, compareStartDate, compareEndDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    let compareWith = null;
    if (compareStartDate && compareEndDate) {
      compareWith = {
        startDate: new Date(compareStartDate),
        endDate: new Date(compareEndDate)
      };
    }

    const report = await ReportingService.getAdvancedSalesReport(
      new Date(startDate),
      new Date(endDate),
      compareWith
    );

    res.json(report);
  } catch (error) {
    console.error('Advanced sales report error:', error);
    res.status(500).json({ message: 'Failed to generate advanced sales report' });
  }
};

// Get customer segmentation report
const getCustomerSegmentationReport = async (req, res) => {
  try {
    const report = await ReportingService.getCustomerSegmentationReport();
    res.json({ segments: report });
  } catch (error) {
    console.error('Customer segmentation report error:', error);
    res.status(500).json({ message: 'Failed to generate customer segmentation report' });
  }
};

// Get product profitability report
const getProductProfitabilityReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const report = await ReportingService.getProductProfitabilityReport(
      new Date(startDate),
      new Date(endDate)
    );

    res.json({
      period: { startDate, endDate },
      products: report
    });
  } catch (error) {
    console.error('Product profitability report error:', error);
    res.status(500).json({ message: 'Failed to generate product profitability report' });
  }
};

// Get inventory analysis report
const getInventoryAnalysisReport = async (req, res) => {
  try {
    const report = await ReportingService.getInventoryAnalysisReport();
    res.json(report);
  } catch (error) {
    console.error('Inventory analysis report error:', error);
    res.status(500).json({ message: 'Failed to generate inventory analysis report' });
  }
};

// Get customer LTV report
const getCustomerLTVReport = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const report = await ReportingService.getCustomerLTVReport(limit);
    res.json({ customers: report });
  } catch (error) {
    console.error('Customer LTV report error:', error);
    res.status(500).json({ message: 'Failed to generate customer LTV report' });
  }
};

module.exports = {
  getAdvancedSalesReport,
  getCustomerSegmentationReport,
  getProductProfitabilityReport,
  getInventoryAnalysisReport,
  getCustomerLTVReport
};