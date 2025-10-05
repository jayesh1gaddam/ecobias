import React, { useState, useEffect } from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import { 
  ChartBarIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

const Step3Review = ({ calculationResults: propResults }) => {
  const { formData } = useCalculator();
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (propResults) {
      // Use the calculation results passed as props
      setReportData(transformResults(propResults));
      setIsGenerating(false);
    } else if (formData) {
      generateReport();
    }
  }, [formData, propResults]);

  const transformResults = (results) => {
    // Transform the calculator engine results to match the expected format
    return {
      projectType: formData?.projectType || 'webapp',
      complexityLevel: results.complexity?.level || 'standard',
      totalCost: results.costBreakdown?.total || 0,
      developmentCost: results.costBreakdown?.development || 0,
      designCost: results.costBreakdown?.design || 0,
      testingCost: results.costBreakdown?.testing || 0,
      deploymentCost: results.costBreakdown?.deployment || 0,
      timeline: results.timeline || 16,
      riskFactors: results.riskAssessment?.riskFactors || [],
      marketComparison: results.marketComparison || {
        india: { min: 0, max: 0, avg: 0 },
        global: { min: 0, max: 0, avg: 0 },
        enterprise: { min: 0, max: 0, avg: 0 }
      },
      roiProjections: results.roiProjections || {
        conservative: 0,
        moderate: 0,
        aggressive: 0
      },
      featureBreakdown: results.features?.breakdown || {},
      recommendations: results.recommendations || []
    };
  };

  const generateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      const report = calculateComprehensiveReport(formData);
      setReportData(report);
      setIsGenerating(false);
    }, 2000);
  };

  const calculateComprehensiveReport = (data) => {
    // Base costs by project type
    const baseCosts = {
      website: 35000,
      webapp: 70000,
      mobile_android: 80000,
      mobile_ios: 90000,
      mobile_cross: 120000,
      saas: 150000,
      marketplace: 200000,
      ecommerce: 180000,
      social: 160000,
      fintech: 250000,
      healthtech: 220000,
      edtech: 140000,
      ai_ml: 300000,
      blockchain: 350000,
      iot: 280000
    };

    // Complexity multipliers
    const complexityMultipliers = {
      basic: 1.0,
      standard: 1.5,
      advanced: 2.2,
      enterprise: 3.0
    };

    // Feature category costs
    const featureCosts = {
      coreFeatures: 80000,
      authFeatures: 60000,
      paymentFeatures: 120000,
      socialFeatures: 100000,
      aiFeatures: 200000,
      integrationFeatures: 80000,
      mobileFeatures: 70000,
      performanceFeatures: 60000
    };

    // Calculate base cost
    const baseCost = baseCosts[data.projectType] || 100000;
    const complexityMultiplier = complexityMultipliers[data.complexityLevel] || 1.5;
    
    // Calculate feature costs
    let totalFeatureCost = 0;
    Object.keys(featureCosts).forEach(category => {
      if (data[category] && data[category].length > 0) {
        totalFeatureCost += featureCosts[category] * (data[category].length / 5); // Proportional to number of features
      }
    });

    // Calculate final costs
    const developmentCost = (baseCost + totalFeatureCost) * complexityMultiplier;
    const designCost = developmentCost * 0.15;
    const testingCost = developmentCost * 0.10;
    const deploymentCost = developmentCost * 0.05;
    const totalCost = developmentCost + designCost + testingCost + deploymentCost;

    // Timeline calculation
    const baseTimeline = {
      website: 6,
      webapp: 10,
      mobile_android: 12,
      mobile_ios: 14,
      mobile_cross: 16,
      saas: 18,
      marketplace: 20,
      ecommerce: 16,
      social: 18,
      fintech: 24,
      healthtech: 22,
      edtech: 16,
      ai_ml: 28,
      blockchain: 32,
      iot: 26
    };

    const timeline = baseTimeline[data.projectType] || 16;
    const adjustedTimeline = timeline * (complexityMultipliers[data.complexityLevel] || 1.5);

    // Risk assessment
    const riskFactors = [];
    if (data.complexityLevel === 'enterprise') riskFactors.push('High complexity increases development risk');
    if (data.aiFeatures && data.aiFeatures.length > 0) riskFactors.push('AI/ML features require specialized expertise');
    if (data.blockchain === 'blockchain') riskFactors.push('Blockchain development has regulatory considerations');
    if (data.fintech === 'fintech') riskFactors.push('Financial apps require compliance and security measures');

    // Market comparison
    const marketComparison = {
      india: { min: totalCost * 0.7, max: totalCost * 1.2, avg: totalCost * 0.9 },
      global: { min: totalCost * 1.5, max: totalCost * 3.0, avg: totalCost * 2.2 },
      enterprise: { min: totalCost * 2.0, max: totalCost * 4.0, avg: totalCost * 3.0 }
    };

    // ROI projections
    const roiProjections = {
      conservative: totalCost * 2.5,
      moderate: totalCost * 4.0,
      aggressive: totalCost * 6.0
    };

    return {
      projectType: data.projectType,
      complexityLevel: data.complexityLevel,
      totalCost: Math.round(totalCost),
      developmentCost: Math.round(developmentCost),
      designCost: Math.round(designCost),
      testingCost: Math.round(testingCost),
      deploymentCost: Math.round(deploymentCost),
      timeline: Math.round(adjustedTimeline),
      riskFactors,
      marketComparison,
      roiProjections,
      featureBreakdown: {
        core: data.coreFeatures?.length || 0,
        auth: data.authFeatures?.length || 0,
        payment: data.paymentFeatures?.length || 0,
        social: data.socialFeatures?.length || 0,
        ai: data.aiFeatures?.length || 0,
        integration: data.integrationFeatures?.length || 0,
        mobile: data.mobileFeatures?.length || 0,
        performance: data.performanceFeatures?.length || 0
      },
      recommendations: generateRecommendations(data, totalCost, adjustedTimeline)
    };
  };

  const generateRecommendations = (data, cost, timeline) => {
    const recommendations = [];
    
    if (cost > 500000) {
      recommendations.push('Consider phased development approach to manage budget');
    }
    
    if (timeline > 20) {
      recommendations.push('Break project into milestones for better progress tracking');
    }
    
    if (data.aiFeatures && data.aiFeatures.length > 0) {
      recommendations.push('AI features require specialized team and longer development time');
    }
    
    if (data.complexityLevel === 'enterprise') {
      recommendations.push('Enterprise projects benefit from dedicated project management');
    }
    
    return recommendations;
  };

  if (isGenerating) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Calculating...</h3>
        <p className="text-gray-600">Please wait</p>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No data available for report generation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Report Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your MVP Estimate</h2>
        <p className="text-gray-600">Professional analysis complete</p>
      </div>

      {/* Executive Summary */}
      <div className="paper-texture-card bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-300 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">₹{reportData.totalCost.toLocaleString()}</div>
            <div className="text-gray-700">Total Investment</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">{reportData.timeline} weeks</div>
            <div className="text-gray-700">Development Timeline</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{reportData.complexityLevel.toUpperCase()}</div>
            <div className="text-gray-700">Complexity Level</div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="paper-texture-card border border-amber-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Development</span>
                <span className="text-gray-900 font-semibold">₹{reportData.developmentCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Design & UI/UX</span>
                <span className="text-gray-900 font-semibold">₹{reportData.designCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Testing & QA</span>
                <span className="text-gray-900 font-semibold">₹{reportData.testingCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Deployment</span>
                <span className="text-gray-900 font-semibold">₹{reportData.deploymentCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Feature Distribution</h4>
            <div className="space-y-2">
              {Object.entries(reportData.featureBreakdown).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize">{category.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-gray-900 font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market Comparison */}
      <div className="paper-texture-card border border-amber-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Market Rates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-100 to-green-200 border border-green-300 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-green-600 mb-3">India Market</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Min:</span>
                <span className="text-gray-900">₹{reportData.marketComparison.india.min.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max:</span>
                <span className="text-gray-900">₹{reportData.marketComparison.india.max.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg:</span>
                <span className="text-gray-900">₹{reportData.marketComparison.india.avg.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-amber-600 mb-3">Global Market</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Min:</span>
                <span className="text-gray-900">₹{reportData.marketComparison.global.min.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max:</span>
                <span className="text-gray-900">₹{reportData.marketComparison.global.max.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg:</span>
                <span className="text-gray-900">₹{reportData.marketComparison.global.avg.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-300 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-orange-600 mb-3">Enterprise</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Min:</span>
                <span className="text-gray-900">₹{reportData.marketComparison.enterprise.min.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max:</span>
                <span className="text-gray-900">₹{reportData.marketComparison.enterprise.max.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg:</span>
                <span className="text-gray-900">₹{reportData.marketComparison.enterprise.avg.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

             {/* ROI Projections */}
       <div className="paper-texture-card border border-amber-200 rounded-2xl p-6 shadow-sm">
         <h3 className="text-lg font-bold text-gray-900 mb-4">ROI Potential</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 border border-yellow-300 rounded-xl p-4 text-center">
            <h4 className="text-lg font-semibold text-yellow-600 mb-2">Conservative</h4>
            <div className="text-2xl font-bold text-gray-900">₹{reportData.roiProjections.conservative.toLocaleString()}</div>
            <div className="text-sm text-gray-500">2.5x return</div>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-300 rounded-xl p-4 text-center">
            <h4 className="text-lg font-semibold text-orange-600 mb-2">Moderate</h4>
            <div className="text-2xl font-bold text-gray-900">₹{reportData.roiProjections.moderate.toLocaleString()}</div>
            <div className="text-sm text-gray-500">4.0x return</div>
          </div>
          <div className="bg-gradient-to-br from-red-100 to-red-200 border border-red-300 rounded-xl p-4 text-center">
            <h4 className="text-lg font-semibold text-red-600 mb-2">Aggressive</h4>
            <div className="text-2xl font-bold text-gray-900">₹{reportData.roiProjections.aggressive.toLocaleString()}</div>
            <div className="text-sm text-gray-500">6.0x return</div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="paper-texture-card border border-amber-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Risks</h3>
        {reportData.riskFactors.length > 0 ? (
          <div className="space-y-3">
            {reportData.riskFactors.map((risk, index) => (
              <div key={index} className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">{risk}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center space-x-3 text-green-600">
            <CheckCircleIcon className="w-5 h-5" />
            <span>Low risk project with standard development requirements</span>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="paper-texture-card border border-amber-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recommendations</h3>
        <div className="space-y-3">
          {reportData.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-3">
              <LightBulbIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">{rec}</span>
            </div>
          ))}
        </div>
      </div>


      {/* Call to Action */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">Ready to Build?</h3>
        <p className="text-orange-100 mb-6">Get expert guidance for your MVP</p>
        
        <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
          Book Free Consultation
        </button>
        
        <p className="text-orange-200 text-sm mt-4">
          Trusted by 1000+ founders
        </p>
      </div>
    </div>
  );
};

export default Step3Review;
