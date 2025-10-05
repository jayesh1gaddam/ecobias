import React, { useState } from 'react';
import { useCalculator } from '../context/CalculatorContext';
import { calculatorEngine } from '../utils/calculatorEngine';
import Step3Review from './calculator/Step3Review';
import { 
  CalculatorIcon, 
  ChartBarIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ScaleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  StarIcon,
  SparklesIcon,
  RocketLaunchIcon,
  UsersIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';

const ProfessionalCalculator = () => {
  const { currentStep, nextStep, prevStep, formData, updateFormData } = useCalculator();
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResults, setCalculationResults] = useState(null);
  const steps = [
    { id: 1, name: 'Project', description: 'What are you building?', icon: RocketLaunchIcon },
    { id: 2, name: 'Features', description: 'Select what you need', icon: SparklesIcon },
    { id: 3, name: 'Results', description: 'Your estimate', icon: ChartBarIcon }
  ];

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const handleFeatureToggle = (category, featureId) => {
    const currentFeatures = formData[category] || [];
    const updatedFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter(id => id !== featureId)
      : [...currentFeatures, featureId];
    
    updateFormData({ [category]: updatedFeatures });
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    try {
      // Use the professional calculator engine
      const results = calculatorEngine.calculateMVPCost(formData);
      
      if (results.success) {
        setCalculationResults(results.data);
        
        // Auto-advance to results after a brief delay
        setTimeout(() => {
          nextStep();
        }, 1000);
      } else {
        throw new Error(results.error);
      }
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Project Type Selection - Footer Inspired Cards */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <RocketLaunchIcon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Project Type</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(calculatorEngine.marketData.projectTypes).map(([key, project]) => (
            <div
              key={key}
              className={`group relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                formData.projectType === key
                  ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg shadow-orange-500/25'
                  : 'border-orange-200 bg-white hover:border-orange-400 hover:bg-orange-50 hover:shadow-lg'
              }`}
              onClick={() => handleInputChange('projectType', key)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-semibold text-gray-900 capitalize">
                  {key.replace(/_/g, ' ')}
                </div>
                {formData.projectType === key && (
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Base Cost:</span>
                  <span className="text-sm font-semibold text-orange-600">₹{project.baseCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Market Demand:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.marketDemand === 'very_high' ? 'bg-green-100 text-green-700' :
                    project.marketDemand === 'high' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {project.marketDemand.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">ROI Potential:</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.roiPotential === 'very_high' ? 'bg-green-100 text-green-700' :
                    project.roiPotential === 'high' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {project.roiPotential.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              {/* Hover effect overlay */}
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                formData.projectType === key ? 'opacity-100' : ''
              }`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Configuration - Footer Inspired Design */}
      <div className="paper-texture-card border border-orange-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <ScaleIcon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Complexity</label>
            <select
              value={formData.complexityLevel || ''}
              onChange={(e) => handleInputChange('complexityLevel', e.target.value)}
              className="w-full p-4 paper-texture-subtle border-2 border-orange-200 rounded-xl text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 hover:border-orange-300"
            >
              <option value="">Select complexity level</option>
              <option value="basic">🟢 Basic</option>
              <option value="standard">🟡 Standard</option>
              <option value="advanced">🟠 Advanced</option>
              <option value="enterprise">🔴 Enterprise</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Audience</label>
            <select
              value={formData.targetAudience || ''}
              onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              className="w-full p-4 paper-texture-subtle border-2 border-orange-200 rounded-xl text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 hover:border-orange-300"
            >
              <option value="">Select target audience</option>
              <option value="consumer">👥 Consumer</option>
              <option value="b2b">🏢 Business</option>
              <option value="enterprise">🏭 Enterprise</option>
              <option value="government">🏛️ Government</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">User Scale</label>
            <select
              value={formData.userScale || ''}
              onChange={(e) => handleInputChange('userScale', e.target.value)}
              className="w-full p-4 paper-texture-subtle border-2 border-orange-200 rounded-xl text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 hover:border-orange-300"
            >
              <option value="">Select expected user scale</option>
              <option value="startup">🚀 Startup</option>
              <option value="growth">📈 Growth</option>
              <option value="large_scale">📊 Large Scale</option>
              <option value="enterprise">🌐 Enterprise</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Timeline</label>
            <select
              value={formData.timeline || ''}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              className="w-full p-4 paper-texture-subtle border-2 border-orange-200 rounded-xl text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 hover:border-orange-300"
            >
              <option value="">Select preferred timeline</option>
              <option value="urgent">⚡ Urgent</option>
              <option value="standard">⏱️ Standard</option>
              <option value="flexible">📅 Flexible</option>
              <option value="extended">📆 Extended</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Design</label>
            <select
              value={formData.designRequirements || ''}
              onChange={(e) => handleInputChange('designRequirements', e.target.value)}
              className="w-full p-4 paper-texture-subtle border-2 border-orange-200 rounded-xl text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 hover:border-orange-300"
            >
              <option value="">Select design level</option>
              <option value="basic">🎨 Basic</option>
              <option value="standard">✨ Standard</option>
              <option value="premium">💎 Premium</option>
              <option value="enterprise">👑 Enterprise</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Security</label>
            <select
              value={formData.securityLevel || ''}
              onChange={(e) => handleInputChange('securityLevel', e.target.value)}
              className="w-full p-4 paper-texture-subtle border-2 border-orange-200 rounded-xl text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 hover:border-orange-300"
            >
              <option value="">Select security level</option>
              <option value="basic">🔒 Basic</option>
              <option value="enhanced">🛡️ Enhanced</option>
              <option value="high">🔐 High</option>
              <option value="enterprise">🏛️ Enterprise</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      {Object.entries(calculatorEngine.featureCosts).map(([category, categoryData]) => (
        <div key={category} className="paper-texture-card border border-orange-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 capitalize">
              {category.replace(/([A-Z])/g, ' $1')} Features
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent"></div>
            <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
              {formData[category]?.length || 0} selected
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryData.features).map(([featureId, feature]) => (
              <div
                key={featureId}
                className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  formData[category]?.includes(featureId)
                    ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg shadow-orange-500/25'
                    : 'border-orange-200 bg-white hover:border-orange-400 hover:bg-orange-50 hover:shadow-lg'
                }`}
                onClick={() => handleFeatureToggle(category, featureId)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold text-gray-900 capitalize">
                    {featureId.replace(/_/g, ' ')}
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    formData[category]?.includes(featureId)
                      ? 'bg-orange-500 border-orange-500'
                      : 'border-gray-300 group-hover:border-orange-400'
                  }`}>
                    {formData[category]?.includes(featureId) && (
                      <CheckIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Complexity:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      feature.complexity === 'low' ? 'bg-green-100 text-green-700' :
                      feature.complexity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      feature.complexity === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {feature.complexity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Timeline:</span>
                    <span className="text-xs text-blue-600 font-medium">{feature.time} weeks</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Cost:</span>
                    <span className="text-xs text-orange-600 font-semibold">₹{feature.cost.toLocaleString()}</span>
                  </div>
                </div>

                {/* Selection indicator */}
                <div className={`absolute top-2 right-2 w-3 h-3 rounded-full transition-all duration-300 ${
                  formData[category]?.includes(featureId) ? 'bg-orange-500' : 'bg-gray-200 group-hover:bg-orange-300'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Custom Features - Footer Inspired */}
      <div className="paper-texture-card border border-orange-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <LightBulbIcon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Custom Features</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
        </div>
        
        <textarea
          value={formData.customFeatureDescription || ''}
          onChange={(e) => handleInputChange('customFeatureDescription', e.target.value)}
          placeholder="Describe any custom features..."
          className="w-full p-4 paper-texture-subtle border-2 border-orange-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 hover:border-orange-300"
          rows={4}
        />
        
      </div>
    </div>
  );

  const renderStep3 = () => {
    if (isCalculating) {
      return (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Calculating...</h3>
          <p className="text-gray-600">Please wait a moment</p>
        </div>
      );
    }

    if (calculationResults) {
      return <Step3Review calculationResults={calculationResults} />;
    }

    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Complete the steps above</p>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <div id="professional-calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Step Content - Footer Inspired Design */}
      <div className="grid lg:grid-cols-12 gap-8 mb-12">
        {/* Main Calculator Content */}
        <div className="lg:col-span-8">
          <div className="paper-texture-card border border-orange-200 rounded-2xl p-8 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  {React.createElement(steps[currentStep - 1]?.icon || CalculatorIcon, { 
                    className: "w-6 h-6 text-white" 
                  })}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{steps[currentStep - 1]?.name}</h3>
                  <p className="text-gray-600 text-sm">{steps[currentStep - 1]?.description}</p>
                </div>
              </div>
              <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                Step {currentStep} of {steps.length}
              </div>
            </div>
            
            <div className="border-t border-orange-100 pt-6">
              {renderCurrentStep()}
            </div>
          </div>
        </div>

        {/* Progress Sidebar - Footer Inspired */}
        <div className="lg:col-span-4">
          <div className="paper-texture-card border border-orange-200 rounded-2xl p-6 shadow-lg sticky top-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 animate-pulse"></span>
              Your Progress
            </h4>
            
            {/* Steps Progress */}
            <div className="space-y-4 mb-6">
              {steps.map((step) => (
                <div key={step.id} className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                  step.id === currentStep 
                    ? 'bg-orange-100 border border-orange-300' 
                    : step.id < currentStep 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-white/50 border border-gray-200'
                }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    step.id === currentStep 
                      ? 'bg-orange-500 text-white' 
                      : step.id < currentStep 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step.id < currentStep ? (
                      <CheckIcon className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${
                      step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </div>
                    <div className={`text-xs ${
                      step.id <= currentStep ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Tips */}
            <div className="paper-texture-subtle border border-orange-200 rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <LightBulbIcon className="w-4 h-4 text-orange-500" />
                <span className="font-semibold text-gray-900 text-sm">Pro Tip</span>
              </div>
              <p className="text-xs text-gray-700">
                {currentStep === 1 && "Choose your project type"}
                {currentStep === 2 && "Select essential features only"}
                {currentStep === 3 && "Review and book consultation"}
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-white text-xs">
                <span className="text-orange-400">1000+</span> founders trust us
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Footer Inspired Design */}
      <div className="paper-texture-card border border-orange-200 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`group flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'paper-texture-card border-2 border-gray-300 text-gray-700 hover:border-orange-300 hover:bg-orange-50 hover:scale-105 hover:shadow-lg'
            }`}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Previous Step
          </button>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-orange-100 to-amber-100 border border-orange-300 rounded-full px-4 py-2">
              <span className="text-orange-700 text-sm font-medium">
                Step {currentStep} of {steps.length}
              </span>
            </div>
          </div>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="group relative flex items-center px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Continue
                <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-y-3 group-hover:animate-shimmer"></div>
            </button>
          ) : currentStep === 2 ? (
            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className={`group relative flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform shadow-lg overflow-hidden ${
                isCalculating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-105 hover:shadow-green-500/25'
              }`}
            >
              <span className="relative z-10 flex items-center">
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Calculating Your MVP...
                  </>
                ) : (
                  <>
                    <CalculatorIcon className="w-4 h-4 mr-2" />
                    Calculate MVP Cost
                    <SparklesIcon className="w-4 h-4 ml-2 group-hover:rotate-12 transition-transform duration-300" />
                  </>
                )}
              </span>
              {!isCalculating && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-y-3 group-hover:animate-shimmer"></div>
              )}
            </button>
          ) : (
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-full px-6 py-3">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                <span className="text-green-700 font-medium text-sm">Analysis Complete!</span>
              </div>
            </div>
          )}
        </div>

        {/* Additional Helper Text */}
        <div className="mt-4 pt-4 border-t border-orange-100">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Free</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>Accurate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCalculator;
