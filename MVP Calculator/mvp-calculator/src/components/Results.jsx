import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalculator } from '../context/CalculatorContext';
import { 
  ArrowLeftIcon, 
  ArrowDownTrayIcon, 
  CalendarIcon, 
  CheckIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Results = () => {
  const navigate = useNavigate();
  const { formData, reset } = useCalculator();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock results for now - in real app this would come from calculation
  const results = {
    breakdown: {
      base: 80000,
      features: 45000,
      branding: formData.branding ? 25000 : 0,
      socialMedia: formData.socialMedia ? 15000 : 0
    },
    total: 165000,
    timeline: 12,
    infrastructure: {
      monthly: 5000,
      yearly: 60000
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const handleDownloadPDF = () => {
    // In real app, this would generate and download a PDF
    alert('PDF download functionality would be implemented here');
  };

  const handleBookConsultation = () => {
    // In real app, this would open a booking system
    window.open('https://calendly.com', '_blank');
  };

  const handleStartOver = () => {
    reset();
    navigate('/calculator');
  };

  return (
    <div className="min-h-screen bg-amber-50 text-gray-900">
      {/* Gradient Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-15"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-15"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent">
            Your MVP Cost Estimate
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Here's your personalized cost breakdown and timeline
          </p>
        </div>

        {/* Main Results Card */}
        <div className="bg-white/80 border border-amber-200 rounded-2xl p-8 mb-8 backdrop-blur-sm shadow-lg">
          <div className="text-center mb-10">
            <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 mb-3">
              {formatCurrency(results.total)}
            </div>
            <p className="text-xl text-gray-700">
              Total estimated cost for your MVP
            </p>
          </div>

          {/* Cost Breakdown */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Cost Breakdown</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                  <span className="text-gray-700">Base Development</span>
                  <span className="font-medium text-gray-900">{formatCurrency(results.breakdown.base)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                  <span className="text-gray-700">Selected Features</span>
                  <span className="font-medium text-gray-900">{formatCurrency(results.breakdown.features)}</span>
                </div>
                {results.breakdown.branding > 0 && (
                  <div className="flex justify-between items-center p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                    <span className="text-gray-700">Branding & Identity</span>
                    <span className="font-medium text-gray-900">{formatCurrency(results.breakdown.branding)}</span>
                  </div>
                )}
                {results.breakdown.socialMedia > 0 && (
                  <div className="flex justify-between items-center p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                    <span className="text-gray-700">Social Media Setup</span>
                    <span className="font-medium text-gray-900">{formatCurrency(results.breakdown.socialMedia)}</span>
                  </div>
                )}
                <div className="border-t border-amber-300 pt-4">
                  <div className="flex justify-between items-center font-semibold text-xl">
                    <span className="text-gray-900">Total</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                      {formatCurrency(results.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Timeline & Infrastructure</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-100/50 rounded-xl border border-orange-200">
                  <div className="flex items-center">
                    <ClockIcon className="w-6 h-6 text-orange-600 mr-3" />
                    <span className="text-gray-700">Development Timeline</span>
                  </div>
                  <span className="font-semibold text-orange-600 text-lg">{results.timeline} weeks</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-amber-100/50 rounded-xl border border-amber-200">
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="w-6 h-6 text-amber-600 mr-3" />
                    <span className="text-gray-700">Monthly Infrastructure</span>
                  </div>
                  <span className="font-semibold text-amber-600 text-lg">{formatCurrency(results.infrastructure.monthly)}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-orange-100/50 rounded-xl border border-orange-200">
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="w-6 h-6 text-orange-600 mr-3" />
                    <span className="text-gray-700">Yearly Infrastructure</span>
                  </div>
                  <span className="font-semibold text-orange-600 text-lg">{formatCurrency(results.infrastructure.yearly)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Summary */}
          <div className="bg-amber-50/50 rounded-xl p-6 mb-8 border border-amber-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Project Summary</h3>
            <div className="grid md:grid-cols-2 gap-6 text-base">
              <div>
                <p className="text-gray-600 mb-2">Industry: <span className="font-medium text-gray-900">{formData.industry}</span></p>
                <p className="text-gray-600 mb-2">MVP Type: <span className="font-medium text-gray-900">{formData.mvpType}</span></p>
                <p className="text-gray-600 mb-2">Platforms: <span className="font-medium text-gray-900">{formData.platforms.join(', ')}</span></p>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Features Selected: <span className="font-medium text-gray-900">{formData.features.length}</span></p>
                <p className="text-gray-600 mb-2">Branding: <span className="font-medium text-gray-900">{formData.branding ? 'Yes' : 'No'}</span></p>
                <p className="text-gray-600 mb-2">Social Media: <span className="font-medium text-gray-900">{formData.socialMedia ? 'Yes' : 'No'}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Capture for PDF */}
        {!isSubmitted ? (
          <div className="bg-white/80 border border-amber-200 rounded-2xl p-8 mb-8 backdrop-blur-sm shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Get Your Detailed Report
              </h3>
              <p className="text-lg text-gray-700">
                Enter your email to receive a comprehensive PDF report with detailed breakdown
              </p>
            </div>
            
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
              <div className="mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-4 bg-white border border-amber-200 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                    Send PDF Report
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 rounded-2xl p-8 mb-8">
            <div className="text-center">
              <CheckIcon className="w-16 h-16 text-green-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-green-700 mb-3">
                Report Sent Successfully!
              </h3>
              <p className="text-green-600 text-lg">
                Check your email for the detailed PDF report. It may take a few minutes to arrive.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
          <button
            onClick={handleBookConsultation}
            className="px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
          >
            <CalendarIcon className="w-5 h-5 mr-2" />
            Book Free Consultation
          </button>
          
          <button
            onClick={handleDownloadPDF}
            className="px-8 py-4 rounded-xl font-semibold border-2 border-amber-300 text-gray-700 hover:border-orange-500 hover:text-gray-900 transition-all duration-200 flex items-center justify-center"
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Download PDF
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-center">
          <button
            onClick={handleStartOver}
            className="px-6 py-3 rounded-xl font-medium bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200 flex items-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Calculate Another MVP
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center text-gray-600">
          <p>
            This estimate is based on industry standards and may vary based on specific requirements. 
            For a detailed quote, please book a consultation with our team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Results;
