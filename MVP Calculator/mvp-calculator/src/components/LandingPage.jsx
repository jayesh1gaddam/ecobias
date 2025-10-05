import { useCalculator } from '../context/CalculatorContext';
import { 
  ArrowRightIcon, 
  CalculatorIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  StarIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  CloudIcon,
  BuildingStorefrontIcon,
  ShoppingCartIcon,
  UsersIcon,
  CurrencyRupeeIcon,
  AcademicCapIcon,
  CpuChipIcon,
  LinkIcon,
  WifiIcon,
  RocketLaunchIcon,
  PaintBrushIcon,
  LightBulbIcon,
  HeartIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  BookOpenIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import ProfessionalCalculator from './ProfessionalCalculator';

const LandingPage = () => {

  const handleScrollToCalculator = () => {
    const calculatorSection = document.getElementById('mvp-calculator');
    if (calculatorSection) {
      calculatorSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };


  return (
    <div className="min-h-screen bg-amber-50 text-gray-900 noise-bg m-0 p-0">
      {/* Gradient Background */}
      <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 3 }}>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 paper-texture-header border-b border-amber-200">
        {/* Navigation */}
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center">
            <img
              src="/MS_wordmark_b.png"
              alt="MS Logo"
              className="h-10 w-auto object-contain"
            />
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-orange-600 transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-700 hover:text-orange-600 transition-colors">Testimonials</a>
            <a href="#about" className="text-gray-700 hover:text-orange-600 transition-colors">About</a>
            <a href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors">Contact</a>
          </nav>
          <button
            onClick={handleScrollToCalculator}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25"
          >
            Start Calculator
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 pt-8 pb-8 lg:pt-12 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border border-orange-300 mb-4">
              <StarIcon className="w-4 h-4 mr-2" />
              #1 MVP Development Cost Calculator India 2025
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent">MVP Cost Calculator</span>
              <br />
              <span className="metallic-text-glow">
                Instant. Accurate. Free.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
              Get transparent pricing for your startup idea in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <button 
                onClick={handleScrollToCalculator}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-orange-500/25 relative overflow-hidden"
              >
                Get Started
                <ArrowRightIcon className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-16 text-center">
            <h3 className="text-sm font-medium text-gray-500 mb-8">Built with modern technologies</h3>
            
            {/* Auto-running carousel of tech logos */}
            <div className="relative overflow-hidden py-8 mask-gradient">
              <div className="flex animate-infinite-scroll items-center">
                {/* First set of logos */}
                <div className="flex items-center whitespace-nowrap min-w-max">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" alt="Supabase" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" alt="AWS" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg" alt="Vercel" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg" alt="Prisma" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/strapi/strapi-original.svg" alt="Strapi" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/stripe/stripe-original.svg" alt="Stripe" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" alt="Redis" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                </div>
                
                {/* Duplicate set for seamless loop */}
                <div className="flex items-center whitespace-nowrap min-w-max">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" alt="Supabase" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" alt="AWS" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg" alt="Vercel" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg" alt="Prisma" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/strapi/strapi-original.svg" alt="Strapi" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/stripe/stripe-original.svg" alt="Stripe" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" alt="Redis" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                </div>

                {/* Third set for better continuity */}
                <div className="flex items-center whitespace-nowrap min-w-max">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" alt="Supabase" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" alt="AWS" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg" alt="Vercel" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg" alt="Prisma" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/strapi/strapi-original.svg" alt="Strapi" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/stripe/stripe-original.svg" alt="Stripe" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" alt="Redis" className="w-16 h-16 filter drop-shadow-lg font-bold mx-8" />
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-6">
              Enterprise-grade • Scalable • Secure
            </p>
          </div>
        </div>
      </main>

      {/* Calculator Section - Direct Integration */}
      <section className="relative z-10 py-12" id="mvp-calculator">
        <ProfessionalCalculator />
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Expert team • Founder-friendly pricing • Fast delivery
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl paper-texture-card border border-amber-200 hover:border-orange-300 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/25">
                <CalculatorIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Accurate Estimates
              </h3>
              <p className="text-gray-600 text-center">
                AI-powered calculator with market data and technology analysis.
              </p>
            </div>
            <div className="group p-8 rounded-2xl paper-texture-card border border-amber-200 hover:border-orange-300 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/25">
                <ClockIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Fast Delivery
              </h3>
              <p className="text-gray-600 text-center">
                Flexible timelines with milestone-based payments.
              </p>
            </div>
            <div className="group p-8 rounded-2xl paper-texture-card border border-amber-200 hover:border-orange-300 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-purple-500/25">
                <CurrencyDollarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Transparent Pricing
              </h3>
              <p className="text-gray-600 text-center">
                No hidden costs. Premium quality at startup-friendly rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MVP Cost Ranges Section */}
      <section className="relative z-10 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Transparent costs with no hidden fees
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="paper-texture-card border border-amber-200 rounded-2xl p-8 text-center hover:border-orange-300 transition-all duration-300">
              <div className="text-4xl font-bold text-purple-400 mb-4">₹35K - ₹1.5L</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic MVP</h3>
              <p className="text-gray-600 mb-4">
                Essential features • 4-12 weeks
              </p>
            </div>
            <div className="paper-texture-card border border-amber-200 rounded-2xl p-8 text-center hover:border-orange-300 transition-all duration-300">
              <div className="text-4xl font-bold text-pink-400 mb-4">₹1.5L - ₹4L</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Standard MVP</h3>
              <p className="text-gray-600 mb-4">
                Advanced features • 12-24 weeks
              </p>
            </div>
            <div className="paper-texture-card border border-amber-200 rounded-2xl p-8 text-center hover:border-orange-300 transition-all duration-300">
              <div className="text-4xl font-bold text-green-400 mb-4">₹4L - ₹8L+</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enterprise MVP</h3>
              <p className="text-gray-600 mb-4">
                Enterprise-grade • 24+ weeks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-orange-50 to-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by 1000+ Founders
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="paper-texture-card border border-amber-200 rounded-2xl p-8 hover:border-orange-300 transition-all duration-300">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Delivered in 8 weeks. Exceeded expectations."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  RS
                </div>
                <div>
                  <div className="text-gray-900 font-semibold">Rahul Sharma</div>
                  <div className="text-gray-400 text-sm">Founder, TechStartup</div>
                </div>
              </div>
            </div>
            <div className="paper-texture-card border border-amber-200 rounded-2xl p-8 hover:border-orange-300 transition-all duration-300">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Made development simple. Perfect for non-tech founders."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  AP
                </div>
                <div>
                  <div className="text-gray-900 font-semibold">Anjali Patel</div>
                  <div className="text-gray-400 text-sm">CEO, HealthTech</div>
                </div>
              </div>
            </div>
            <div className="paper-texture-card border border-amber-200 rounded-2xl p-8 hover:border-orange-300 transition-all duration-300">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Exceptional code quality. Production-ready MVP."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  MK
                </div>
                <div>
                  <div className="text-gray-900 font-semibold">Mohan Kumar</div>
                  <div className="text-gray-400 text-sm">CTO, FinTech</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-20 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="paper-texture-card border border-amber-200 rounded-2xl p-6 hover:border-orange-300 transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How accurate are the cost estimates?</h3>
              <p className="text-gray-600">
                Based on real market data. Typically within 10-15% accuracy.
              </p>
            </div>
            <div className="paper-texture-card border border-amber-200 rounded-2xl p-6 hover:border-orange-300 transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What's included in the MVP development cost?</h3>
              <p className="text-gray-600">
                Design, development, testing, deployment + 3 months support.
              </p>
            </div>
            <div className="paper-texture-card border border-amber-200 rounded-2xl p-6 hover:border-orange-300 transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How long does MVP development take?</h3>
              <p className="text-gray-600">
                4-8 weeks for basic MVPs, 16-24 weeks for complex applications.
              </p>
            </div>
            <div className="paper-texture-card border border-amber-200 rounded-2xl p-6 hover:border-orange-300 transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you offer payment plans?</h3>
              <p className="text-gray-600">
                30% upfront, 40% at milestone, 30% on completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-amber-100 to-orange-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Build Your MVP?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Get started with transparent pricing and expert guidance.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={handleScrollToCalculator}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-orange-500/25"
            >
              Start Calculator
              <ArrowRightIcon className="w-5 h-5 ml-2 inline-block" />
            </button>
          </div>
        </div>
      </section>

      {/* Professional 6-Column Footer */}
      <footer className="bg-amber-50 text-gray-900 border-t border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Minimal Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Column 1: Services */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#mvp" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">MVP Development</a></li>
                <li><a href="#web" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">Web Applications</a></li>
                <li><a href="#mobile" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">Mobile Apps</a></li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#mvp-calculator" onClick={handleScrollToCalculator} className="text-gray-600 hover:text-orange-600 transition-colors text-sm cursor-pointer">Calculator</a></li>
                <li><a href="#case-studies" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">Case Studies</a></li>
                <li><a href="#consultation" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">Free Consultation</a></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">About Us</a></li>
                <li><a href="#team" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">Team</a></li>
                <li><a href="#contact" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            {/* Column 4: Support */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#help" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">Help Center</a></li>
                <li><a href="#documentation" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">Documentation</a></li>
                <li><a href="#status" className="text-gray-600 hover:text-orange-600 transition-colors text-sm">Status</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Privacy Bar */}
          <div className="border-t border-amber-300 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <a href="#privacy" className="hover:text-orange-600 transition-colors">Privacy</a>
                <a href="#terms" className="hover:text-orange-600 transition-colors">Terms</a>
                <a href="#contact" className="hover:text-orange-600 transition-colors">Contact</a>
              </div>
              <span className="text-sm text-gray-500">© 2025 Mati Studios</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
