import React from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import {
  GlobeAltIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  CloudIcon,
  BuildingStorefrontIcon,
  ShoppingCartIcon,
  UsersIcon,
  BanknotesIcon,
  HeartIcon,
  AcademicCapIcon,
  CpuChipIcon,
  LinkIcon,
  WifiIcon
} from '@heroicons/react/24/outline';

const Step1BasicInputs = () => {
  const { formData, updateFormData } = useCalculator();

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const projectTypes = [
    { id: 'website', name: 'Website', icon: GlobeAltIcon, description: 'Basic website with essential features' },
    { id: 'webapp', name: 'Web Application', icon: ComputerDesktopIcon, description: 'Complex web application with user management' },
    { id: 'mobile_android', name: 'Android App', icon: DevicePhoneMobileIcon, description: 'Native Android mobile application' },
    { id: 'mobile_ios', name: 'iOS App', icon: DevicePhoneMobileIcon, description: 'Native iOS mobile application' },
    { id: 'mobile_cross', name: 'Cross-Platform App', icon: DevicePhoneMobileIcon, description: 'React Native/Flutter app for both platforms' },
    { id: 'saas', name: 'SaaS Platform', icon: CloudIcon, description: 'Software as a Service with subscription model' },
    { id: 'marketplace', name: 'Marketplace', icon: BuildingStorefrontIcon, description: 'Multi-vendor marketplace platform' },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCartIcon, description: 'Online store with payment processing' },
    { id: 'social', name: 'Social Platform', icon: UsersIcon, description: 'Social networking or community platform' },
    { id: 'fintech', name: 'FinTech App', icon: BanknotesIcon, description: 'Financial technology application' },
    { id: 'healthtech', name: 'HealthTech', icon: HeartIcon, description: 'Healthcare technology application' },
    { id: 'edtech', name: 'EdTech', icon: AcademicCapIcon, description: 'Educational technology platform' },
    { id: 'ai_ml', name: 'AI/ML Application', icon: CpuChipIcon, description: 'Artificial Intelligence or Machine Learning app' },
    { id: 'blockchain', name: 'Blockchain App', icon: LinkIcon, description: 'Decentralized application (DApp)' },
    { id: 'iot', name: 'IoT Application', icon: WifiIcon, description: 'Internet of Things application' }
  ];

  const complexityLevels = [
    { id: 'basic', name: 'Basic', description: 'Simple features, basic UI, minimal integrations', multiplier: 1.0 },
    { id: 'standard', name: 'Standard', description: 'Moderate features, good UI, some integrations', multiplier: 1.5 },
    { id: 'advanced', name: 'Advanced', description: 'Complex features, premium UI, many integrations', multiplier: 2.2 },
    { id: 'enterprise', name: 'Enterprise', description: 'Enterprise-grade features, custom UI, extensive integrations', multiplier: 3.0 }
  ];

  const targetAudience = [
    { id: 'b2c', name: 'B2C (Business to Consumer)', description: 'Direct to end users' },
    { id: 'b2b', name: 'B2B (Business to Business)', description: 'Business customers' },
    { id: 'b2b2c', name: 'B2B2C (Business to Business to Consumer)', description: 'Platform connecting businesses and consumers' },
    { id: 'enterprise', name: 'Enterprise', description: 'Large corporate clients' }
  ];

  const userScale = [
    { id: 'small', name: 'Small Scale (1K-10K users)', description: 'Startup or small business' },
    { id: 'medium', name: 'Medium Scale (10K-100K users)', description: 'Growing business' },
    { id: 'large', name: 'Large Scale (100K-1M users)', description: 'Established business' },
    { id: 'enterprise', name: 'Enterprise Scale (1M+ users)', description: 'Large enterprise' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">MVP Development Cost Calculator - Free Instant Estimates</h2>
        <p className="text-lg text-gray-700 mb-4">
          Calculate your minimum viable product development costs instantly. Get expert estimates from best minds of the nation for startup-friendly pricing.
        </p>
        <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          <span className="text-green-400 text-sm font-medium">Trusted by 1000+ founders</span>
        </div>
      </div>
      {/* Project Type Selection */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Select Your MVP Type - Web App, Mobile App, or SaaS</h3>
        <p className="text-gray-700 mb-6">Choose your startup application type for accurate Indian market pricing estimates</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectTypes.map((type) => (
            <div
              key={type.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                formData.projectType === type.id
                  ? 'border-orange-500 bg-orange-100 shadow-md transform scale-105'
                  : 'border-amber-300 bg-white hover:border-orange-400 hover:bg-orange-50'
              }`}
              onClick={() => handleInputChange('projectType', type.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <type.icon className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{type.name}</h4>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Name */}
        <div>
          <label className="block text-gray-900 font-medium mb-2">Project Name</label>
          <input
            type="text"
            value={formData.projectName || ''}
            onChange={(e) => handleInputChange('projectName', e.target.value)}
            placeholder="Enter your project name"
            className="w-full px-4 py-3 paper-texture-subtle border-2 border-amber-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 shadow-sm hover:border-orange-400"
          />
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-gray-900 font-medium mb-2">Project Description</label>
          <textarea
            value={formData.projectDescription || ''}
            onChange={(e) => handleInputChange('projectDescription', e.target.value)}
            placeholder="Brief description of your project"
            rows="3"
            className="w-full px-4 py-3 paper-texture-subtle border-2 border-amber-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none shadow-sm hover:border-orange-400"
          />
        </div>
      </div>

      {/* Complexity Level */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">2. MVP Development Complexity - Basic to Enterprise</h3>
        <p className="text-gray-700 mb-6">Select complexity level for accurate startup development cost calculations in India</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {complexityLevels.map((level) => (
            <div
              key={level.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                formData.complexityLevel === level.id
                  ? 'border-orange-500 bg-orange-100 shadow-md transform scale-105'
                  : 'border-amber-300 bg-white hover:border-orange-400 hover:bg-orange-50'
              }`}
              onClick={() => handleInputChange('complexityLevel', level.id)}
            >
              <h4 className="font-semibold text-gray-900 mb-2">{level.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{level.description}</p>
              <div className="text-xs text-orange-600">Cost Multiplier: {level.multiplier}x</div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Audience & User Scale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target Audience */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">3. Startup Target Market - B2B or B2C</h3>
          <div className="space-y-3">
            {targetAudience.map((audience) => (
              <div
                key={audience.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                  formData.targetAudience === audience.id
                    ? 'border-orange-500 bg-orange-100 shadow-md'
                    : 'border-amber-300 bg-white hover:border-orange-400 hover:bg-orange-50'
                }`}
                onClick={() => handleInputChange('targetAudience', audience.id)}
              >
                <h4 className="font-semibold text-gray-900">{audience.name}</h4>
                <p className="text-sm text-gray-600">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* User Scale */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">4. MVP User Scale - Startup to Enterprise</h3>
          <div className="space-y-3">
            {userScale.map((scale) => (
              <div
                key={scale.id}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                  formData.userScale === scale.id
                    ? 'border-orange-500 bg-orange-100 shadow-md'
                    : 'border-amber-300 bg-white hover:border-orange-400 hover:bg-orange-50'
                }`}
                onClick={() => handleInputChange('userScale', scale.id)}
              >
                <h4 className="font-semibold text-gray-900">{scale.name}</h4>
                <p className="text-sm text-gray-600">{scale.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Requirements */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">5. MVP Development Timeline & Budget Range</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-900 font-medium mb-2">Preferred Timeline</label>
            <select
              value={formData.timeline || ''}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              className="w-full px-4 py-3 paper-texture-subtle border-2 border-amber-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 shadow-sm hover:border-orange-400"
            >
              <option value="">Select timeline</option>
              <option value="urgent">Urgent (2-4 weeks)</option>
              <option value="fast">Fast (4-8 weeks)</option>
              <option value="standard">Standard (8-12 weeks)</option>
              <option value="flexible">Flexible (12+ weeks)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-900 font-medium mb-2">Budget Range (₹)</label>
            <select
              value={formData.budgetRange || ''}
              onChange={(e) => handleInputChange('budgetRange', e.target.value)}
              className="w-full px-4 py-3 paper-texture-subtle border-2 border-amber-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 shadow-sm hover:border-orange-400"
            >
              <option value="">Select budget range</option>
              <option value="low">₹50,000 - ₹1,00,000</option>
              <option value="medium">₹1,00,000 - ₹2,50,000</option>
              <option value="high">₹2,50,000 - ₹5,00,000</option>
              <option value="enterprise">₹5,00,000+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Additional Requirements */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">6. Design & Security Requirements for Your MVP</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-900 font-medium mb-2">Design Requirements</label>
            <select
              value={formData.designRequirements || ''}
              onChange={(e) => handleInputChange('designRequirements', e.target.value)}
              className="w-full px-4 py-3 paper-texture-subtle border-2 border-amber-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 shadow-sm hover:border-orange-400"
            >
              <option value="">Select design level</option>
              <option value="basic">Basic Design</option>
              <option value="standard">Standard Design</option>
              <option value="premium">Premium Design</option>
              <option value="custom">Custom Design</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-900 font-medium mb-2">Security Level</label>
            <select
              value={formData.securityLevel || ''}
              onChange={(e) => handleInputChange('securityLevel', e.target.value)}
              className="w-full px-4 py-3 paper-texture-subtle border-2 border-amber-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 shadow-sm hover:border-orange-400"
            >
              <option value="">Select security level</option>
              <option value="basic">Basic Security</option>
              <option value="standard">Standard Security</option>
              <option value="high">High Security</option>
              <option value="enterprise">Enterprise Security</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInputs;
