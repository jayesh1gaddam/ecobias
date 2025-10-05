import React from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import { calculatorEngine } from '../../utils/calculatorEngine';

const Step2FeatureSelection = () => {
  const { formData, updateFormData } = useCalculator();

  const handleFeatureToggle = (category, featureId) => {
    const currentFeatures = formData[category] || [];
    let newFeatures;
    
    if (currentFeatures.includes(featureId)) {
      newFeatures = currentFeatures.filter(id => id !== featureId);
    } else {
      newFeatures = [...currentFeatures, featureId];
    }
    
    updateFormData({ [category]: newFeatures });
  };

  const handleFeatureChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  // Core Features
  const coreFeatures = [
    { id: 'user_registration', name: 'User Registration & Login', description: 'Email/password, social login, OTP verification', complexity: 'medium' },
    { id: 'user_profiles', name: 'User Profiles', description: 'Personalized user profiles with customization', complexity: 'medium' },
    { id: 'dashboard', name: 'User Dashboard', description: 'Main user interface with key metrics', complexity: 'high' },
    { id: 'notifications', name: 'Push Notifications', description: 'In-app and push notifications', complexity: 'medium' },
    { id: 'search', name: 'Search Functionality', description: 'Advanced search with filters', complexity: 'high' },
    { id: 'file_upload', name: 'File Upload & Management', description: 'Document, image, and media upload', complexity: 'high' },
    { id: 'real_time_chat', name: 'Real-time Chat', description: 'Live messaging and communication', complexity: 'high' },
    { id: 'analytics', name: 'Analytics Dashboard', description: 'User behavior and business metrics', complexity: 'high' }
  ];

  // Authentication & Security
  const authFeatures = [
    { id: 'multi_factor_auth', name: 'Multi-Factor Authentication', description: '2FA, SMS, email verification', complexity: 'high' },
    { id: 'sso_integration', name: 'SSO Integration', description: 'Single Sign-On with Google, Microsoft', complexity: 'high' },
    { id: 'role_based_access', name: 'Role-Based Access Control', description: 'User permissions and roles', complexity: 'medium' },
    { id: 'data_encryption', name: 'Data Encryption', description: 'End-to-end encryption', complexity: 'high' },
    { id: 'audit_logs', name: 'Audit Logs', description: 'Activity tracking and compliance', complexity: 'medium' }
  ];

  // Payment & E-commerce
  const paymentFeatures = [
    { id: 'payment_gateway', name: 'Payment Gateway Integration', description: 'Razorpay, Stripe, PayPal', complexity: 'high' },
    { id: 'subscription_billing', name: 'Subscription Billing', description: 'Recurring payments and plans', complexity: 'high' },
    { id: 'inventory_management', name: 'Inventory Management', description: 'Stock tracking and management', complexity: 'high' },
    { id: 'order_management', name: 'Order Management', description: 'Order processing and tracking', complexity: 'high' },
    { id: 'shipping_integration', name: 'Shipping Integration', description: 'Courier and logistics APIs', complexity: 'medium' },
    { id: 'tax_calculation', name: 'Tax Calculation', description: 'GST, VAT, and tax compliance', complexity: 'medium' }
  ];

  // Social & Community
  const socialFeatures = [
    { id: 'social_feed', name: 'Social Feed', description: 'Content sharing and timeline', complexity: 'high' },
    { id: 'friend_connections', name: 'Friend Connections', description: 'User networking and relationships', complexity: 'medium' },
    { id: 'groups_communities', name: 'Groups & Communities', description: 'Community management', complexity: 'high' },
    { id: 'content_moderation', name: 'Content Moderation', description: 'AI-powered content filtering', complexity: 'high' },
    { id: 'gamification', name: 'Gamification', description: 'Points, badges, leaderboards', complexity: 'medium' }
  ];

  // AI & Machine Learning
  const aiFeatures = [
    { id: 'chatbot', name: 'AI Chatbot', description: 'Intelligent customer support', complexity: 'very_high' },
    { id: 'recommendation_engine', name: 'Recommendation Engine', description: 'Personalized content suggestions', complexity: 'very_high' },
    { id: 'image_recognition', name: 'Image Recognition', description: 'AI-powered image analysis', complexity: 'very_high' },
    { id: 'natural_language', name: 'Natural Language Processing', description: 'Text analysis and understanding', complexity: 'very_high' },
    { id: 'predictive_analytics', name: 'Predictive Analytics', description: 'Data-driven predictions', complexity: 'very_high' }
  ];

  // Third-party Integrations
  const integrationFeatures = [
    { id: 'google_services', name: 'Google Services', description: 'Maps, Calendar, Drive integration', complexity: 'medium' },
    { id: 'social_media', name: 'Social Media Integration', description: 'Facebook, Twitter, Instagram', complexity: 'medium' },
    { id: 'email_marketing', name: 'Email Marketing', description: 'Mailchimp, SendGrid integration', complexity: 'medium' },
    { id: 'crm_integration', name: 'CRM Integration', description: 'HubSpot, Salesforce, Zoho', complexity: 'high' },
    { id: 'accounting_software', name: 'Accounting Software', description: 'Tally, QuickBooks integration', complexity: 'medium' },
    { id: 'sms_gateway', name: 'SMS Gateway', description: 'Text messaging services', complexity: 'low' }
  ];

  // Mobile-Specific Features
  const mobileFeatures = [
    { id: 'offline_mode', name: 'Offline Mode', description: 'App functionality without internet', complexity: 'high' },
    { id: 'push_notifications', name: 'Push Notifications', description: 'Mobile push alerts', complexity: 'medium' },
    { id: 'location_services', name: 'Location Services', description: 'GPS and location tracking', complexity: 'medium' },
    { id: 'camera_integration', name: 'Camera Integration', description: 'Photo and video capture', complexity: 'medium' },
    { id: 'biometric_auth', name: 'Biometric Authentication', description: 'Fingerprint and face recognition', complexity: 'high' },
    { id: 'deep_linking', name: 'Deep Linking', description: 'App-to-app navigation', complexity: 'medium' }
  ];

  // Performance & Scalability
  const performanceFeatures = [
    { id: 'cdn_integration', name: 'CDN Integration', description: 'Content delivery network', complexity: 'medium' },
    { id: 'caching_system', name: 'Caching System', description: 'Redis, Memcached integration', complexity: 'medium' },
    { id: 'load_balancing', name: 'Load Balancing', description: 'Traffic distribution', complexity: 'high' },
    { id: 'auto_scaling', name: 'Auto Scaling', description: 'Automatic resource management', complexity: 'high' },
    { id: 'database_optimization', name: 'Database Optimization', description: 'Performance tuning', complexity: 'high' }
  ];

  const getFeatureCost = (featureId, category) => {
    const categoryMapping = {
      'coreFeatures': 'coreFeatures',
      'authFeatures': 'authFeatures', 
      'paymentFeatures': 'paymentFeatures',
      'socialFeatures': 'socialFeatures',
      'aiFeatures': 'aiFeatures',
      'integrationFeatures': 'integrationFeatures',
      'mobileFeatures': 'mobileFeatures',
      'performanceFeatures': 'performanceFeatures'
    };
    
    const engineCategory = categoryMapping[category];
    const featureData = calculatorEngine.featureCosts[engineCategory]?.features[featureId];
    return featureData?.cost || 0;
  };

  const renderFeatureCard = (feature, category) => {
    const isSelected = formData[category]?.includes(feature.id);
    const featureCost = getFeatureCost(feature.id, category);
    const complexityColors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      very_high: 'text-red-600'
    };

    return (
      <div
        key={feature.id}
        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
          isSelected
            ? 'border-orange-500 bg-orange-100 shadow-md transform scale-105'
            : 'border-amber-300 paper-texture-card hover:border-orange-400 hover:bg-orange-50'
        }`}
        onClick={() => handleFeatureToggle(category, feature.id)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{feature.name}</h4>
            <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${complexityColors[feature.complexity]}`}>
              {feature.complexity.replace('_', ' ').toUpperCase()}
            </div>
            {featureCost > 0 && (
              <div className="text-xs text-orange-600 font-semibold mt-1">
                ₹{featureCost.toLocaleString()}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isSelected ? 'bg-orange-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm text-gray-600">
              {isSelected ? 'Selected' : 'Click to select'}
            </span>
          </div>
          {featureCost > 0 && (
            <div className="text-sm text-gray-500">
              Est. Cost
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your MVP Features</h2>
        <p className="text-lg text-gray-700 mb-4">
          Select the features you need for your MVP. We'll provide comprehensive cost estimates by development phases and sectors.
        </p>
        <div className="inline-flex items-center space-x-2 bg-orange-100/80 border border-orange-300 rounded-full px-4 py-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          <span className="text-orange-700 text-sm font-medium">Professional feature analysis included</span>
        </div>
      </div>

      {/* Core Features */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Core Features</h3>
        <p className="text-gray-700 mb-6">Essential features for basic functionality</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coreFeatures.map(feature => renderFeatureCard(feature, 'coreFeatures'))}
        </div>
      </div>

      {/* Authentication & Security */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Authentication & Security</h3>
        <p className="text-gray-700 mb-6">Security features and user authentication</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {authFeatures.map(feature => renderFeatureCard(feature, 'authFeatures'))}
        </div>
      </div>

      {/* Payment & E-commerce */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Payment & E-commerce</h3>
        <p className="text-gray-700 mb-6">Payment processing and e-commerce functionality</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentFeatures.map(feature => renderFeatureCard(feature, 'paymentFeatures'))}
        </div>
      </div>

      {/* Social & Community */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Social & Community</h3>
        <p className="text-gray-700 mb-6">Social networking and community features</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialFeatures.map(feature => renderFeatureCard(feature, 'socialFeatures'))}
        </div>
      </div>

      {/* AI & Machine Learning */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">AI & Machine Learning</h3>
        <p className="text-gray-700 mb-6">Advanced AI-powered features</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiFeatures.map(feature => renderFeatureCard(feature, 'aiFeatures'))}
        </div>
      </div>

      {/* Third-party Integrations */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Third-party Integrations</h3>
        <p className="text-gray-700 mb-6">External service integrations</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrationFeatures.map(feature => renderFeatureCard(feature, 'integrationFeatures'))}
        </div>
      </div>

      {/* Mobile-Specific Features */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Mobile-Specific Features</h3>
        <p className="text-gray-700 mb-6">Features specific to mobile applications</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mobileFeatures.map(feature => renderFeatureCard(feature, 'mobileFeatures'))}
        </div>
      </div>

      {/* Performance & Scalability */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Performance & Scalability</h3>
        <p className="text-gray-700 mb-6">Performance optimization and scaling features</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {performanceFeatures.map(feature => renderFeatureCard(feature, 'performanceFeatures'))}
        </div>
      </div>

      {/* Custom Features */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Custom Features</h3>
        <p className="text-gray-700 mb-6">Add any custom features not listed above</p>
        <div>
          <label className="block text-gray-900 font-medium mb-2">Custom Feature Description</label>
          <textarea
            value={formData.customFeatures || ''}
            onChange={(e) => handleFeatureChange('customFeatures', e.target.value)}
            placeholder="Describe any custom features you need..."
            rows="4"
            className="w-full px-4 py-3 bg-white border-2 border-amber-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none shadow-sm hover:border-orange-400"
          />
        </div>
      </div>
    </div>
  );
};

export default Step2FeatureSelection;
