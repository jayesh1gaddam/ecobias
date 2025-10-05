# MVP Cost Calculator

A modern, React-based web application that helps founders estimate the cost and timeline for building their Minimum Viable Product (MVP).

## 🎯 Overview

The MVP Cost Calculator is a founder-facing tool that generates qualified leads for Mati Studios by educating founders about realistic MVP costs and timelines. It provides transparent cost breakdowns and helps standardize internal scoping for quick, consistent proposals.

## ✨ Features

- **Multi-step Form**: Intuitive 3-step process to collect MVP requirements
- **Smart Calculations**: Industry-standard cost estimates based on MVP type, features, and complexity
- **Feature Selection**: Comprehensive library of common MVP features with complexity indicators
- **Cost Breakdown**: Detailed breakdown by development, features, branding, and infrastructure
- **Timeline Planning**: Realistic development timelines with AI-assisted estimates
- **PDF Export**: Email capture for detailed PDF reports
- **Lead Generation**: Built-in consultation booking and lead capture
- **Responsive Design**: Mobile-first design that works on all devices

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS 3
- **Icons**: Heroicons
- **Routing**: React Router DOM
- **State Management**: React Context + useReducer
- **Build Tool**: Vite
- **Deployment**: Vercel/Netlify ready

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mvp-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── LandingPage.jsx  # Landing page with hero section
│   ├── Calculator.jsx   # Main calculator with multi-step form
│   ├── Results.jsx      # Results display and PDF export
│   └── calculator/      # Calculator step components
│       ├── Step1BasicInputs.jsx
│       ├── Step2FeatureSelection.jsx
│       └── Step3Review.jsx
├── context/             # React context for state management
│   └── CalculatorContext.jsx
├── App.jsx              # Main app component with routing
├── main.jsx             # Application entry point
└── index.css            # Global styles and TailwindCSS
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

## 🎨 Customization

### Styling
The application uses TailwindCSS with custom color schemes. You can modify:
- `tailwind.config.js` - Custom colors, spacing, and theme
- `src/index.css` - Custom component classes and global styles

### Features
Add or modify features in `Step2FeatureSelection.jsx`:
```javascript
const features = [
  {
    id: 'NewFeature',
    name: 'New Feature',
    description: 'Feature description',
    complexity: 'Medium',
    cost: '₹25,000',
    timeline: '2 weeks'
  }
  // ... more features
];
```

### Cost Calculations
Modify the calculation logic in `Calculator.jsx`:
```javascript
const calculateResults = (data) => {
  // Custom calculation logic here
  return {
    breakdown: { /* cost breakdown */ },
    total: totalCost,
    timeline: totalTimeline
  };
};
```

## 📱 Responsive Design

The application is built with a mobile-first approach and includes:
- Responsive grid layouts
- Touch-friendly form controls
- Optimized spacing for mobile devices
- Progressive enhancement for larger screens

## 🔒 Security Considerations

- Form validation on both client and server side
- Secure email capture and storage
- No sensitive data stored in localStorage
- HTTPS enforcement for production

## 🚀 Deployment

### Vercel
1. Connect your GitHub repository
2. Vercel will auto-detect React + Vite
3. Deploy with zero configuration

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Deploy from Git or drag & drop

### Manual Deployment
1. Run `npm run build`
2. Upload `dist` folder to your web server
3. Configure routing for SPA (all routes serve `index.html`)

## 📊 Analytics & Tracking

The application is ready for analytics integration:
- Google Analytics 4
- Mixpanel
- Custom event tracking
- Conversion funnel analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software developed for Mati Studios.

## 📞 Support

For support or questions:
- Email: [contact@matistudios.com]
- Website: [matistudios.com]

## 🔮 Future Enhancements

- **Phase 2**: Premium calculator with advanced infrastructure assumptions
- **Admin Panel**: Backend for managing feature weights and configurations
- **CRM Integration**: Direct integration with HubSpot, Notion, or custom CRM
- **API Access**: REST API for third-party integrations
- **Multi-language**: Internationalization support
- **Advanced Analytics**: Detailed user behavior tracking and insights

---

Built with ❤️ for founders by Mati Studios
