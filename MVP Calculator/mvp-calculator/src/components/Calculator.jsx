import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculator } from '../context/CalculatorContext';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import Step1BasicInputs from './calculator/Step1BasicInputs';
import Step2FeatureSelection from './calculator/Step2FeatureSelection';
import Step3Review from './calculator/Step3Review';

const Calculator = () => {
  const navigate = useNavigate();
  const { currentStep, nextStep, prevStep, formData, updateFormData } = useCalculator();
  const [isCalculating, setIsCalculating] = useState(false);

  const steps = [
    { id: 1, name: 'Basic Inputs', description: 'Project overview' },
    { id: 2, name: 'Features', description: 'Select functionality' },
    { id: 3, name: 'Review', description: 'Confirm & calculate' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      nextStep();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      prevStep();
    }
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // Simulate calculation time
    setTimeout(() => {
      const results = calculateResults(formData);
      updateFormData({ results });
      setIsCalculating(false);
      navigate('/results');
    }, 2000);
  };

  const calculateResults = (data) => {
    // Base costs
    let baseCost = 0;
    let baseTimeline = 0;

    // MVP Type costs
    const mvpTypeCosts = {
      'App': { cost: 80000, timeline: 8 },
      'Website': { cost: 40000, timeline: 6 },
      'SaaS tool': { cost: 120000, timeline: 10 },
      'Social platform': { cost: 150000, timeline: 12 },
      'Marketplace': { cost: 180000, timeline: 14 },
      'Content platform': { cost: 100000, timeline: 10 }
    };

    if (data.mvpType && mvpTypeCosts[data.mvpType]) {
      baseCost = mvpTypeCosts[data.mvpType].cost;
      baseTimeline = mvpTypeCosts[data.mvpType].timeline;
    }

    // Platform multiplier
    if (data.platforms.includes('All')) {
      baseCost *= 1.8;
      baseTimeline *= 1.5;
    } else if (data.platforms.length > 1) {
      baseCost *= 1.4;
      baseTimeline *= 1.3;
    }

    // Feature costs
    let featureCost = 0;
    let featureTimeline = 0;
    
    const featureWeights = {
      'Authentication': { cost: 15000, timeline: 1 },
      'Profiles': { cost: 20000, timeline: 1.5 },
      'Payments': { cost: 25000, timeline: 2 },
      'Content': { cost: 30000, timeline: 2.5 },
      'Marketplace': { cost: 35000, timeline: 3 },
      'Analytics': { cost: 15000, timeline: 1 },
      'Notifications': { cost: 10000, timeline: 1 },
      'Integrations': { cost: 20000, timeline: 1.5 }
    };

    data.features.forEach(feature => {
      if (featureWeights[feature]) {
        featureCost += featureWeights[feature].cost;
        featureTimeline += featureWeights[feature].timeline;
      }
    });

    // Additional services
    let brandingCost = data.branding ? 25000 : 0;
    let socialMediaCost = data.socialMedia ? 15000 : 0;

    const totalCost = baseCost + featureCost + brandingCost + socialMediaCost;
    const totalTimeline = baseTimeline + featureTimeline;

    return {
      breakdown: {
        base: baseCost,
        features: featureCost,
        branding: brandingCost,
        socialMedia: socialMediaCost
      },
      total: totalCost,
      timeline: totalTimeline,
      infrastructure: {
        monthly: 5000,
        yearly: 60000
      }
    };
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInputs />;
      case 2:
        return <Step2FeatureSelection />;
      case 3:
        return <Step3Review />;
      default:
        return <Step1BasicInputs />;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-gray-900 noise-bg">
      {/* Gradient Background */}
      <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 3 }}>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-15"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-15"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Card with Progress Bar and Content */}
        <div className="bg-white/90 border border-amber-200 rounded-2xl p-8 mb-8 backdrop-blur-sm shadow-lg">
          {/* Progress Steps - Inside Card */}
          <div className="mb-8">
            <nav aria-label="Progress">
              <ol className="flex items-center justify-center">
                {steps.map((step, stepIdx) => (
                  <li key={step.name} className={`flex items-center ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-10' : ''}`}>
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        step.id < currentStep
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-500 text-white'
                          : step.id === currentStep
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-500 text-white'
                          : 'bg-amber-50 border-amber-300 text-gray-600'
                      }`}>
                        {step.id < currentStep ? (
                          <CheckIcon className="w-6 h-6" />
                        ) : (
                          <span className="text-sm font-medium">{step.id}</span>
                        )}
                      </div>
                      <div className="ml-4">
                        <p className={`text-sm font-medium ${
                          step.id <= currentStep ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {step.name}
                        </p>
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </div>
                    </div>
                    {stepIdx !== steps.length - 1 && (
                      <div className={`w-16 h-0.5 ml-4 ${
                        step.id < currentStep ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-amber-300'
                      }`} />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
          
          {/* Step Content */}
          <div className="border-t border-amber-200 pt-8">
            {renderStep()}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center ${
              currentStep === 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-800 text-white hover:bg-gray-700 hover:scale-105'
            }`}
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Previous
          </button>

          <div className="flex gap-4">
            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-full font-medium bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transition-all duration-200 hover:scale-105 flex items-center"
              >
                Next
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="px-8 py-3 rounded-full font-medium bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transition-all duration-200 hover:scale-105 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </>
                ) : (
                  'Calculate MVP Cost'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
