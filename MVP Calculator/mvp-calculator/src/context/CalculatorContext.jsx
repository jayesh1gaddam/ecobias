import { createContext, useContext, useReducer } from 'react';

const CalculatorContext = createContext();

const initialState = {
  currentStep: 1,
  formData: {
    projectType: '',
    complexityLevel: '',
    targetAudience: '',
    userScale: '',
    timeline: '',
    budgetRange: '',
    designRequirements: '',
    securityLevel: '',
    coreFeatures: [],
    authFeatures: [],
    paymentFeatures: [],
    socialFeatures: [],
    aiFeatures: [],
    integrationFeatures: [],
    mobileFeatures: [],
    performanceFeatures: [],
    customFeatureDescription: '',
    // Legacy fields for backward compatibility
    industry: '',
    mvpType: '',
    platforms: [],
    branding: false,
    socialMedia: false,
    features: [],
  },
  results: null,
  isLoading: false,
};

const calculatorReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_FORM_DATA':
      return { 
        ...state, 
        formData: { ...state.formData, ...action.payload } 
      };
    case 'SET_RESULTS':
      return { ...state, results: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const CalculatorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const scrollToCalculator = () => {
    const calculatorElement = document.getElementById('professional-calculator');
    if (calculatorElement) {
      calculatorElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const value = {
    ...state,
    dispatch,
    nextStep: () => {
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
      // Add a small delay to ensure the step change is rendered first
      setTimeout(() => {
        scrollToCalculator();
      }, 100);
    },
    prevStep: () => {
      dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
      setTimeout(() => {
        scrollToCalculator();
      }, 100);
    },
    updateFormData: (data) => dispatch({ type: 'UPDATE_FORM_DATA', payload: data }),
    setResults: (results) => dispatch({ type: 'SET_RESULTS', payload: results }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    reset: () => dispatch({ type: 'RESET' }),
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};
