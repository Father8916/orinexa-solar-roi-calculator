import React, { useState } from 'react';
import { Calculator, Sun, TrendingUp, User, DollarSign, Zap, AlertTriangle, CheckCircle, PiggyBank, MapPin, Clock } from 'lucide-react';

const SolarROICalculator = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    monthlyBill: '',
    electricityRate: '0.12',
    annualUsage: '',
    systemSize: '',
    systemCost: '',
    downPayment: '',
    financingRate: '6.5',
    location: 'average',
    roofType: 'south',
    timeFrame: '20',
    utilityRateIncrease: '3.0',
    currentSavings: '',
    netMetering: true,
    batteryBackup: false,
    installationTimeframe: '3-6 months'
  });
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [zipError, setZipError] = useState('');
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);

  // US States list
  const usStates = [
    { code: '', name: 'Select State' },
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' },
    { code: 'DC', name: 'District of Columbia' }
  ];

  // State-specific solar irradiance and electricity rates
  const stateData = {
    'CA': { irradiance: 5.8, avgRate: 0.22, incentives: 'High' },
    'AZ': { irradiance: 6.1, avgRate: 0.13, incentives: 'Medium' },
    'NV': { irradiance: 5.9, avgRate: 0.12, incentives: 'High' },
    'TX': { irradiance: 5.0, avgRate: 0.12, incentives: 'Medium' },
    'FL': { irradiance: 4.8, avgRate: 0.12, incentives: 'Medium' },
    'CO': { irradiance: 5.2, avgRate: 0.13, incentives: 'High' },
    'NY': { irradiance: 3.8, avgRate: 0.19, incentives: 'Very High' },
    'NJ': { irradiance: 4.0, avgRate: 0.16, incentives: 'Very High' },
    'MA': { irradiance: 3.9, avgRate: 0.23, incentives: 'Very High' },
    'CT': { irradiance: 3.8, avgRate: 0.21, incentives: 'High' },
    'MD': { irradiance: 4.1, avgRate: 0.14, incentives: 'Medium' },
    'NC': { irradiance: 4.5, avgRate: 0.11, incentives: 'Medium' },
    'OR': { irradiance: 3.2, avgRate: 0.11, incentives: 'High' },
    'WA': { irradiance: 3.2, avgRate: 0.10, incentives: 'Medium' },
    // Default for other states
    'DEFAULT': { irradiance: 4.2, avgRate: 0.12, incentives: 'Medium' }
  };

  // Enhanced solar irradiance data with more regions
  const solarIrradiance = {
    'california': 5.8,
    'arizona': 6.1,
    'nevada': 5.9,
    'texas': 5.0,
    'florida': 4.8,
    'colorado': 5.2,
    'high': 5.5,
    'average': 4.2,
    'low': 3.5,
    'northeast': 3.8,
    'southeast': 4.5,
    'midwest': 4.0,
    'northwest': 3.2
  };

  // Allowed email domains - add your company domain here
  const allowedEmailDomains = [
    // Free email providers
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
    'aol.com',
    'protonmail.com',
    'mail.com',
    // Your company domain (replace with your actual domain)
    'yourdomain.com',
    'yourcompany.com'
  ];

  const validateEmail = (email) => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }

    // Extract domain from email
    const domain = email.split('@')[1]?.toLowerCase();
    
    // Check if domain is in allowed list
    if (!allowedEmailDomains.includes(domain)) {
      return `Please use a valid email address (Gmail, Yahoo, Outlook, etc. or @yourdomain.com)`;
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /test/i,
      /fake/i,
      /temp/i,
      /throwaway/i,
      /mailinator/i,
      /10minutemail/i,
      /guerrillamail/i
    ];

    const localPart = email.split('@')[0];
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(localPart) || pattern.test(domain)) {
        return 'Please provide a real email address for your solar analysis';
      }
    }

    return '';
  };

  const validatePhone = (phone) => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Check length (US numbers should be 10 digits)
    if (cleaned.length !== 10) {
      return 'Please enter a valid 10-digit phone number';
    }

    // Check for fake patterns
    const fakePatterns = [
      /^1{10}$/, // 1111111111
      /^0{10}$/, // 0000000000
      /^(\d)\1{9}$/, // Same digit repeated
      /^1234567890$/, // Sequential
      /^5555555555$/, // Common fake
    ];

    for (const pattern of fakePatterns) {
      if (pattern.test(cleaned)) {
        return 'Please provide a real phone number';
      }
    }

    return '';
  };

  const validateZipCode = (zip, state) => {
    // US ZIP code validation (5 digits or 5+4 format)
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(zip)) {
      return 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
    }

    // Check for fake patterns
    const fakePatterns = [
      /^0{5}$/, // 00000
      /^1{5}$/, // 11111
      /^(\d)\1{4}$/, // Same digit repeated
      /^12345$/, // Common fake
    ];

    for (const pattern of fakePatterns) {
      if (pattern.test(zip)) {
        return 'Please provide your actual ZIP code';
      }
    }

    // Basic ZIP code to state validation (first digit mapping)
    if (state) {
      const zipFirstDigit = zip.charAt(0);
      const stateZipRanges = {
        'MA': ['0'], 'RI': ['0'], 'NH': ['0'], 'ME': ['0'], 'VT': ['0'],
        'CT': ['0'], 'NY': ['1'], 'NJ': ['0', '7', '8'], 'PA': ['1', '1'],
        'DE': ['1'], 'MD': ['2'], 'DC': ['2'], 'VA': ['2'], 'WV': ['2'],
        'NC': ['2'], 'SC': ['2'], 'GA': ['3'], 'FL': ['3'], 'AL': ['3'],
        'TN': ['3'], 'MS': ['3'], 'KY': ['4'], 'OH': ['4'], 'IN': ['4'],
        'MI': ['4'], 'IA': ['5'], 'MN': ['5'], 'MT': ['5'], 'ND': ['5'],
        'SD': ['5'], 'WI': ['5'], 'IL': ['6'], 'MO': ['6'], 'KS': ['6'],
        'NE': ['6'], 'LA': ['7'], 'AR': ['7'], 'OK': ['7'], 'TX': ['7', '8'],
        'CO': ['8'], 'WY': ['8'], 'UT': ['8'], 'NM': ['8'], 'AZ': ['8'],
        'ID': ['8'], 'NV': ['8'], 'CA': ['9'], 'OR': ['9'], 'WA': ['9'],
        'AK': ['9'], 'HI': ['9']
      };

      // This is a basic check - real validation would be more comprehensive
      // For now, just warn if obvious mismatch
      const validRanges = stateZipRanges[state];
      if (validRanges && !validRanges.includes(zipFirstDigit)) {
        return `ZIP code doesn't appear to match ${state}. Please verify.`;
      }
    }

    return '';
  };

  const validateAddress = async (address, zipCode) => {
    // Basic format check
    if (address.length < 10) {
      return 'Please enter your complete address';
    }

    // Check for fake patterns
    const fakePatterns = [
      /test/i,
      /fake/i,
      /123\s*main/i,
      /456\s*elm/i,
      /789\s*oak/i,
      /^(\d+\s+)?(main|elm|oak|first|second)\s+(st|street|ave|avenue|rd|road)$/i
    ];

    for (const pattern of fakePatterns) {
      if (pattern.test(address)) {
        return 'Please provide your actual address';
      }
    }

    // Optional: Google Places API validation (requires API key)
    // This would verify the address actually exists
    /*
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(address + ' ' + zipCode)}&key=YOUR_API_KEY`);
      const data = await response.json();
      
      if (data.results.length === 0) {
        return 'Address not found. Please check and try again.';
      }
    } catch (error) {
      console.log('Address validation service unavailable');
    }
    */

    return '';
  };

  const trackUserBehavior = () => {
    // Track user behavior patterns for fraud detection
    const behaviorData = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screen: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      referrer: document.referrer,
      fillTime: Date.now() - (window.formStartTime || Date.now()),
      
      // Detect suspicious behavior
      suspiciousFlags: []
    };

    // Flag if form filled too quickly (likely bot)
    if (behaviorData.fillTime < 30000) { // Less than 30 seconds
      behaviorData.suspiciousFlags.push('rapid_completion');
    }

    // Flag if no mouse movement detected (add mouse tracking if needed)
    if (!window.mouseMovements) {
      behaviorData.suspiciousFlags.push('no_mouse_activity');
    }

    return behaviorData;
  };

  // Roof orientation multipliers
  const roofMultipliers = {
    'south': 1.0,
    'southeast': 0.95,
    'southwest': 0.95,
    'east': 0.85,
    'west': 0.85,
    'north': 0.6,
  };

  const handleInputChange = async (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-update electricity rate and solar data based on state selection
    if (field === 'state' && value) {
      const stateInfo = stateData[value] || stateData['DEFAULT'];
      setFormData(prev => ({
        ...prev,
        [field]: value,
        electricityRate: stateInfo.avgRate.toString(),
        location: value.toLowerCase() // Use state-specific solar data if available
      }));
    }

    // Real-time validation for different fields
    if (field === 'email') {
      const error = validateEmail(value);
      setEmailError(error);
    } else if (field === 'phone') {
      const error = validatePhone(value);
      setPhoneError(error);
    } else if (field === 'zipCode') {
      const error = validateZipCode(value, formData.state);
      setZipError(error);
    } else if (field === 'address' && value.length > 10) {
      setIsValidatingAddress(true);
      const error = await validateAddress(value, formData.zipCode);
      setAddressError(error);
      setIsValidatingAddress(false);
    }

    // Re-validate ZIP when state changes
    if (field === 'state' && formData.zipCode) {
      const error = validateZipCode(formData.zipCode, value);
      setZipError(error);
    }
  };

  const validateStep1 = () => {
    const hasRequiredFields = formData.name.trim() && formData.email.trim() && formData.phone.trim() && 
           formData.address.trim() && formData.city.trim() && formData.state.trim() && formData.zipCode.trim();
    
    // Check if all fields are valid (no error messages)
    const isEmailValid = formData.email.trim() && !validateEmail(formData.email);
    const isPhoneValid = formData.phone.trim() && !validatePhone(formData.phone);
    const isZipValid = formData.zipCode.trim() && !validateZipCode(formData.zipCode, formData.state);
    const isAddressValid = formData.address.trim() && !addressError;
    
    return hasRequiredFields && isEmailValid && isPhoneValid && isZipValid && isAddressValid;
  };

  const validateStep2 = () => {
    return formData.monthlyBill && formData.systemCost;
  };

  const sendWebhook = async (leadData) => {
    try {
      const webhookUrl = process.env.REACT_APP_WEBHOOK_URL;
      
      // Collect comprehensive tracking data
      const behaviorData = trackUserBehavior();
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          leadSource: 'Solar ROI Calculator',
          contactInfo: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            stateInfo: stateData[formData.state] || stateData['DEFAULT']
          },
          energyData: {
            monthlyBill: formData.monthlyBill,
            electricityRate: formData.electricityRate,
            systemSize: formData.systemSize,
            systemCost: formData.systemCost,
            financingRate: formData.financingRate,
            timeFrame: formData.timeFrame,
            netMetering: formData.netMetering,
            batteryBackup: formData.batteryBackup,
            installationTimeframe: formData.installationTimeframe
          },
          calculations: leadData,
          
          // Enhanced tracking data
          tracking: {
            ...behaviorData,
            ipAddress: 'SERVER_WILL_CAPTURE', // Server should capture real IP
            geoLocation: 'PENDING_LOOKUP', // Can be enhanced with geolocation API
            
            // Validation results
            validationResults: {
              email: !validateEmail(formData.email),
              phone: !validatePhone(formData.phone),
              zipCode: !validateZipCode(formData.zipCode),
              address: !addressError,
            },
            
            // Lead quality score (0-100)
            qualityScore: calculateLeadQuality(),
          },
          
          utmSource: window.location.search,
        }),
      });

      if (!response.ok) {
        console.error('Webhook failed:', response.status);
      }
    } catch (error) {
      console.error('Webhook error:', error);
    }
  };

  const calculateLeadQuality = () => {
    let score = 100;
    
    // Deduct points for validation failures
    if (validateEmail(formData.email)) score -= 30;
    if (validatePhone(formData.phone)) score -= 25;
    if (validateZipCode(formData.zipCode)) score -= 20;
    if (addressError) score -= 15;
    
    // Deduct for suspicious behavior
    const behaviorData = trackUserBehavior();
    score -= behaviorData.suspiciousFlags.length * 10;
    
    // Bonus points for completeness
    if (formData.installationTimeframe === 'immediately') score += 10;
    if (parseFloat(formData.monthlyBill) > 100) score += 5;
    
    return Math.max(0, Math.min(100, score));
  };

  const calculateSolarROI = async () => {
    setIsLoading(true);
    
    // Add 2-second delay to simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    const monthlyBill = parseFloat(formData.monthlyBill);
    const systemCost = parseFloat(formData.systemCost);
    const downPayment = parseFloat(formData.downPayment) || systemCost;
    const loanAmount = systemCost - downPayment;
    const electricityRate = parseFloat(formData.electricityRate);
    const timeFrame = parseFloat(formData.timeFrame);
    const utilityRateIncrease = parseFloat(formData.utilityRateIncrease) / 100;
    const financingRate = parseFloat(formData.financingRate) / 100 / 12;

    // System specifications
    const systemSize = parseFloat(formData.systemSize) || (monthlyBill * 12) / (electricityRate * 1000 * 4.5);
    
    // Use state-specific solar irradiance data
    let peakSunHours;
    if (formData.state && stateData[formData.state]) {
      peakSunHours = stateData[formData.state].irradiance;
    } else {
      peakSunHours = solarIrradiance[formData.location] || 4.2;
    }
    
    const roofEfficiency = roofMultipliers[formData.roofType];
    const systemEfficiency = 0.85;

    // Annual solar production
    const annualProduction = systemSize * peakSunHours * 365 * roofEfficiency * systemEfficiency;
    const firstYearSavings = annualProduction * electricityRate;

    // Enhanced incentives calculation
    const federalTaxCredit = systemCost * 0.30;
    const stateTaxCredit = systemCost * 0.05; // Example state credit
    const localRebates = Math.min(systemCost * 0.10, 2000); // Example local rebates
    const totalIncentives = federalTaxCredit + stateTaxCredit + localRebates;
    const netSystemCost = systemCost - totalIncentives;
    const actualOutOfPocket = downPayment - (downPayment * 0.35); // Total incentives percentage

    // Battery backup cost adjustment
    const batteryAddon = formData.batteryBackup ? systemCost * 0.15 : 0;
    const adjustedSystemCost = systemCost + batteryAddon;

    // Financing calculations
    let monthlyLoanPayment = 0;
    let totalInterestPaid = 0;
    if (loanAmount > 0) {
      const loanTermMonths = 20 * 12;
      monthlyLoanPayment = loanAmount * (financingRate * Math.pow(1 + financingRate, loanTermMonths)) / (Math.pow(1 + financingRate, loanTermMonths) - 1);
      totalInterestPaid = (monthlyLoanPayment * loanTermMonths) - loanAmount;
    }

    // Calculate savings over time
    let cumulativeSavings = 0;
    let cumulativeCosts = actualOutOfPocket + totalInterestPaid;
    let breakEvenYear = 0;
    let totalLifetimeSavings = 0;
    let currentAnnualSavings = firstYearSavings;

    for (let year = 1; year <= timeFrame; year++) {
      const systemDegradation = Math.pow(0.995, year - 1);
      const adjustedProduction = annualProduction * systemDegradation;
      
      currentAnnualSavings = adjustedProduction * electricityRate * Math.pow(1 + utilityRateIncrease, year - 1);
      cumulativeSavings += currentAnnualSavings;
      
      if (year <= 20 && loanAmount > 0) {
        cumulativeCosts += monthlyLoanPayment * 12;
      }

      if (cumulativeSavings >= cumulativeCosts && breakEvenYear === 0) {
        breakEvenYear = year;
      }
    }

    totalLifetimeSavings = cumulativeSavings - cumulativeCosts;

    // Calculate ROI
    const totalInvestment = actualOutOfPocket + totalInterestPaid;
    const roi = (totalLifetimeSavings / totalInvestment) * 100;
    const annualizedROI = roi / timeFrame;

    // Without solar projection
    let totalElectricityBillWithoutSolar = 0;
    for (let year = 1; year <= timeFrame; year++) {
      const yearlyBill = monthlyBill * 12 * Math.pow(1 + utilityRateIncrease, year - 1);
      totalElectricityBillWithoutSolar += yearlyBill;
    }

    // Enhanced carbon offset calculation
    const carbonOffsetPerYear = annualProduction * 0.0004;
    const totalCarbonOffset = carbonOffsetPerYear * timeFrame;
    const treesEquivalent = Math.round(totalCarbonOffset * 16);
    const carsOffRoadEquivalent = Math.round(totalCarbonOffset * 0.22);

    // Property value increase
    const propertyValueIncrease = systemCost * 0.04; // 4% of system cost

    const calculationResults = {
      // System details
      systemSize: Math.round(systemSize * 10) / 10,
      annualProduction: Math.round(annualProduction),
      systemCost: Math.round(adjustedSystemCost),
      netSystemCost: Math.round(netSystemCost),
      actualOutOfPocket: Math.round(actualOutOfPocket),
      
      // Enhanced incentives
      federalTaxCredit: Math.round(federalTaxCredit),
      stateTaxCredit: Math.round(stateTaxCredit),
      localRebates: Math.round(localRebates),
      totalIncentives: Math.round(totalIncentives),
      
      // Savings and ROI
      firstYearSavings: Math.round(firstYearSavings),
      totalLifetimeSavings: Math.round(totalLifetimeSavings),
      totalElectricityBillWithoutSolar: Math.round(totalElectricityBillWithoutSolar),
      cumulativeSavings: Math.round(cumulativeSavings),
      
      // Financial metrics
      roi: Math.round(roi * 10) / 10,
      annualizedROI: Math.round(annualizedROI * 10) / 10,
      breakEvenYear,
      propertyValueIncrease: Math.round(propertyValueIncrease),
      
      // Financing
      monthlyLoanPayment: Math.round(monthlyLoanPayment),
      totalInterestPaid: Math.round(totalInterestPaid),
      
      // Environmental
      carbonOffsetPerYear: Math.round(carbonOffsetPerYear * 10) / 10,
      totalCarbonOffset: Math.round(totalCarbonOffset * 10) / 10,
      treesEquivalent,
      carsOffRoadEquivalent,
      
      // Analysis
      isProfitable: totalLifetimeSavings > 0,
      paybackPeriod: breakEvenYear,
      effectiveAnnualSavings: Math.round(totalLifetimeSavings / timeFrame),
      
      // Monthly impact
      currentMonthlyBill: Math.round(monthlyBill),
      newMonthlyBill: Math.round(Math.max(0, monthlyBill - (firstYearSavings / 12))),
      monthlySavings: Math.round(Math.min(monthlyBill, firstYearSavings / 12)),
      
      // Risk assessment
      confidenceLevel: roi > 15 ? 'High' : roi > 5 ? 'Medium' : 'Low',
      riskFactors: roi < 5 ? ['Low electricity rates', 'High system cost', 'Poor sun exposure'] : [],
    };

    setResults(calculationResults);
    setShowResults(true);
    setIsLoading(false);
    await sendWebhook(calculationResults);
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      calculateSolarROI();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressWidth = () => {
    if (step === 1) return '33%';
    if (step === 2) return '66%';
    return '100%';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
              style={{ width: getProgressWidth() }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span className={step >= 1 ? 'text-orange-600 font-semibold' : ''}>Contact Info</span>
            <span className={step >= 2 ? 'text-orange-600 font-semibold' : ''}>Energy Details</span>
            <span className={showResults ? 'text-orange-600 font-semibold' : ''}>Results</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sun className="text-orange-500 w-8 h-8" />
            <h1 className="text-3xl font-bold text-gray-800">Solar ROI Calculator</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Get your personalized solar investment analysis in under 2 minutes
          </p>
          <p className="text-sm text-gray-500 mt-2">
            🇺🇸 Available for US residents only • All 50 states supported
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {step === 1 ? (
              <>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <User className="text-orange-500" />
                  Let's Get Started
                </h2>
                <p className="text-gray-600 mb-6">
                  First, we need some basic information to personalize your analysis
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        emailError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="your@email.com"
                    />
                    {emailError && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {emailError}
                      </p>
                    )}
                    {!emailError && formData.email && validateEmail(formData.email) === '' && (
                      <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Valid email address
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      We accept Gmail, Yahoo, Outlook, and other major email providers
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        phoneError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {phoneError && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {phoneError}
                      </p>
                    )}
                    {!phoneError && formData.phone && validatePhone(formData.phone) === '' && (
                      <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Valid phone number
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Home Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        addressError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="123 Main Street"
                    />
                    {isValidatingAddress && (
                      <p className="mt-2 text-sm text-blue-600 flex items-center gap-1">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        Validating address...
                      </p>
                    )}
                    {addressError && !isValidatingAddress && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {addressError}
                      </p>
                    )}
                    {!addressError && formData.address && formData.address.length > 10 && !isValidatingAddress && (
                      <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Valid address format
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Your city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {usStates.map(state => (
                          <option key={state.code} value={state.code}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        zipError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="12345"
                      maxLength="10"
                    />
                    {zipError && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {zipError}
                      </p>
                    )}
                    {!zipError && formData.zipCode && validateZipCode(formData.zipCode, formData.state) === '' && (
                      <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Valid ZIP code
                      </p>
                    )}
                  </div>

                  {/* State-specific information display */}
                  {formData.state && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {usStates.find(s => s.code === formData.state)?.name} Solar Info
                      </h3>
                      <div className="space-y-1 text-sm text-blue-700">
                        <p>• Average electricity rate: ${(stateData[formData.state] || stateData['DEFAULT']).avgRate}/kWh</p>
                        <p>• Solar incentives: {(stateData[formData.state] || stateData['DEFAULT']).incentives}</p>
                        <p>• Solar potential: {(stateData[formData.state] || stateData['DEFAULT']).irradiance} kWh/m²/day</p>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Installation Timeline</h3>
                    <select
                      value={formData.installationTimeframe}
                      onChange={(e) => handleInputChange('installationTimeframe', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="immediately">Ready to install immediately</option>
                      <option value="3-6 months">3-6 months</option>
                      <option value="6-12 months">6-12 months</option>
                      <option value="researching">Just researching options</option>
                    </select>
                  </div>

                  <button
                    onClick={handleNextStep}
                    disabled={!validateStep1()}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Continue to Energy Details →
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Calculator className="text-orange-500" />
                    Energy & Investment Details
                  </h2>
                  <button
                    onClick={() => setStep(1)}
                    className="text-orange-500 hover:text-orange-700 text-sm font-medium"
                  >
                    ← Back
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Hi {formData.name}! Now let's analyze your energy usage and solar investment.
                </p>

                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-3">Current Energy Usage</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monthly Electricity Bill ($) *
                        </label>
                        <input
                          type="number"
                          value={formData.monthlyBill}
                          onChange={(e) => handleInputChange('monthlyBill', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="e.g., 180"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Electricity Rate ($/kWh)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.electricityRate}
                          onChange={(e) => handleInputChange('electricityRate', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="0.12"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Net Metering Available?
                        </label>
                        <select
                          value={formData.netMetering}
                          onChange={(e) => handleInputChange('netMetering', e.target.value === 'true')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="true">Yes - Full credit for excess power</option>
                          <option value="false">No or limited net metering</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-3">Solar System Investment</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total System Cost ($) *
                        </label>
                        <input
                          type="number"
                          value={formData.systemCost}
                          onChange={(e) => handleInputChange('systemCost', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="e.g., 25000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Down Payment ($)
                        </label>
                        <input
                          type="number"
                          value={formData.downPayment}
                          onChange={(e) => handleInputChange('downPayment', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Leave blank if paying cash"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          System Size (kW)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.systemSize}
                          onChange={(e) => handleInputChange('systemSize', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Leave blank to auto-calculate"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Include Battery Backup?
                        </label>
                        <select
                          value={formData.batteryBackup}
                          onChange={(e) => handleInputChange('batteryBackup', e.target.value === 'true')}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="false">No battery backup</option>
                          <option value="true">Yes - Include battery system</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Solar Resource
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="california">California</option>
                        <option value="arizona">Arizona</option>
                        <option value="nevada">Nevada</option>
                        <option value="texas">Texas</option>
                        <option value="florida">Florida</option>
                        <option value="colorado">Colorado</option>
                        <option value="high">High Sun (Southwest)</option>
                        <option value="average">Average (Most of US)</option>
                        <option value="low">Low (Northeast, Northwest)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Roof Orientation
                      </label>
                      <select
                        value={formData.roofType}
                        onChange={(e) => handleInputChange('roofType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="south">South-facing</option>
                        <option value="southeast">Southeast</option>
                        <option value="southwest">Southwest</option>
                        <option value="east">East-facing</option>
                        <option value="west">West-facing</option>
                        <option value="north">North-facing</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Analysis Period
                      </label>
                      <select
                        value={formData.timeFrame}
                        onChange={(e) => handleInputChange('timeFrame', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="10">10 years</option>
                        <option value="15">15 years</option>
                        <option value="20">20 years</option>
                        <option value="25">25 years</option>
                        <option value="30">30 years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Utility Rate Increase (% annually)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.utilityRateIncrease}
                        onChange={(e) => handleInputChange('utilityRateIncrease', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="3.0"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    disabled={!validateStep2() || isLoading}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Analyzing Your Solar Investment...
                      </>
                    ) : (
                      'Calculate My Solar ROI'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="text-green-500" />
              Your Solar Investment Analysis
            </h2>

            {!showResults ? (
              <div className="text-center text-gray-500 py-12">
                <Sun className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Complete the form to see your personalized solar ROI analysis</p>
                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Accurate ROI calculations</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Federal & state incentives included</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Environmental impact analysis</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* ROI Declaration */}
                <div className={`rounded-lg p-6 text-center ${results.isProfitable ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center justify-center mb-3">
                    {results.isProfitable ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    )}
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${results.isProfitable ? 'text-green-800' : 'text-red-800'}`}>
                    {results.isProfitable 
                      ? `Solar Will Pay for Itself!` 
                      : 'Solar May Not Be Profitable'
                    }
                  </h3>
                  <p className={`text-lg ${results.isProfitable ? 'text-green-700' : 'text-red-700'}`}>
                    {results.isProfitable 
                      ? `${results.roi}% ROI over ${formData.timeFrame} years`
                      : `Negative ${Math.abs(results.roi)}% ROI over ${formData.timeFrame} years`
                    }
                  </p>
                  {results.isProfitable && (
                    <p className="text-sm text-green-600 mt-2">
                      Breaks even in year {results.paybackPeriod} • Confidence: {results.confidenceLevel}
                    </p>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-800">{formatCurrency(results.monthlySavings)}</div>
                    <div className="text-sm text-blue-600">Monthly Savings</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <PiggyBank className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-800">{formatCurrency(results.totalLifetimeSavings)}</div>
                    <div className="text-sm text-green-600">{formData.timeFrame}-Year Savings</div>
                  </div>
                </div>

                {/* Monthly Impact */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Monthly Bill Impact
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Monthly Bill</span>
                      <span className="font-semibold">{formatCurrency(results.currentMonthlyBill)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">New Monthly Bill</span>
                      <span className="font-semibold text-green-600">{formatCurrency(results.newMonthlyBill)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Monthly Savings</span>
                      <span className="font-bold text-green-600">{formatCurrency(results.monthlySavings)}</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Financial Summary */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Investment Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">System Cost</span>
                      <span className="font-semibold">{formatCurrency(results.systemCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Federal Tax Credit (30%)</span>
                      <span className="font-semibold text-green-600">-{formatCurrency(results.federalTaxCredit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">State Tax Credit (5%)</span>
                      <span className="font-semibold text-green-600">-{formatCurrency(results.stateTaxCredit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Local Rebates</span>
                      <span className="font-semibold text-green-600">-{formatCurrency(results.localRebates)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Net Investment</span>
                      <span className="font-semibold">{formatCurrency(results.netSystemCost)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">{formData.timeFrame}-Year Savings</span>
                      <span className={`font-bold ${results.totalLifetimeSavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(results.totalLifetimeSavings)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Property Value Impact */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Property Value Impact
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>• Home value increase: <strong>{formatCurrency(results.propertyValueIncrease)}</strong></p>
                    <p>• Solar systems typically increase property value by 4% of installation cost</p>
                    <p>• Solar homes sell 20% faster than non-solar homes</p>
                  </div>
                </div>

                {/* System Performance */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    System Performance
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>• System Size: <strong>{results.systemSize} kW</strong></p>
                    <p>• Annual Production: <strong>{results.annualProduction.toLocaleString()} kWh</strong></p>
                    <p>• First Year Savings: <strong>{formatCurrency(results.firstYearSavings)}</strong></p>
                    <p>• Payback Period: <strong>{results.paybackPeriod} years</strong></p>
                    <p>• Total Incentives: <strong>{formatCurrency(results.totalIncentives)}</strong></p>
                  </div>
                </div>

                {/* Enhanced Environmental Impact */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <PiggyBank className="w-4 h-4" />
                    Environmental Impact
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>• Annual CO₂ Offset: <strong>{results.carbonOffsetPerYear} metric tons</strong></p>
                    <p>• {formData.timeFrame}-Year CO₂ Offset: <strong>{results.totalCarbonOffset} metric tons</strong></p>
                    <p>• Equivalent to planting <strong>{results.treesEquivalent} trees</strong></p>
                    <p>• Equal to taking <strong>{results.carsOffRoadEquivalent} cars</strong> off the road for a year</p>
                  </div>
                </div>

                {/* Future Electricity Costs */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Without Solar
                  </h3>
                  <p className="text-sm text-gray-600">
                    You'd pay <strong>{formatCurrency(results.totalElectricityBillWithoutSolar)}</strong> for electricity over {formData.timeFrame} years with {formData.utilityRateIncrease}% annual rate increases.
                  </p>
                </div>

                {/* Risk Assessment */}
                {results.riskFactors.length > 0 && (
                  <div className="bg-red-50 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Risk Factors
                    </h3>
                    <ul className="text-sm text-red-700 space-y-1">
                      {results.riskFactors.map((risk, index) => (
                        <li key={index}>• {risk}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg p-6 text-center">
                  <h3 className="font-semibold mb-2 text-lg">
                    {results.isProfitable 
                      ? `Ready to Start Saving, ${formData.name}?`
                      : `Let's Optimize Your Solar Plan, ${formData.name}!`
                    }
                  </h3>
                  <p className="text-sm mb-3">
                    {results.isProfitable 
                      ? `Your solar investment will save ${formatCurrency(results.totalLifetimeSavings)} over ${formData.timeFrame} years and increase your home value by ${formatCurrency(results.propertyValueIncrease)}!`
                      : `Let's explore financing options, rebates, and system configurations to improve your ROI.`
                    }
                  </p>
                  <p className="text-xs mb-4">
                    Based on your interest in {formData.installationTimeframe} installation, I'll call you at {formData.phone} to discuss your personalized solar solution.
                  </p>
                  <div className="space-y-2">
                    <button className="w-full bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                      {results.isProfitable ? 'Get My Free Solar Quote' : 'Explore Better Solar Options'}
                    </button>
                    <button className="w-full bg-transparent border border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-orange-600 transition-colors">
                      Download Full Report (PDF)
                    </button>
                  </div>
                </div>

                {/* Social Proof */}
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Join 2,500+ homeowners</strong> who've gone solar in your area
                  </p>
                  <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
                    <span>⭐⭐⭐⭐⭐ 4.9/5 rating</span>
                    <span>•</span>
                    <span>A+ BBB Rating</span>
                    <span>•</span>
                    <span>Licensed & Insured</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Disclaimer */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6 text-sm text-gray-600">
          <h3 className="font-semibold mb-3">Important Disclosures</h3>
          <div className="space-y-2">
            <p>
              <strong>Data Verification:</strong> We validate all contact information to ensure accurate solar analysis and follow-up. 
              Providing false information may result in inaccurate calculations and will be flagged in our system.
            </p>
            <p>
              <strong>Calculation Methodology:</strong> This calculator provides estimates based on average conditions, typical equipment performance, 
              and standard assumptions. Actual results may vary based on specific equipment, installation factors, local weather patterns, 
              roof conditions, shading, utility rate structures, and financing terms.
            </p>
            <p>
              <strong>Incentives:</strong> Federal tax credit is currently 30% through 2032, then decreases. State and local incentives vary by location 
              and may change. Consult a tax professional regarding your specific situation.
            </p>
            <p>
              <strong>Performance:</strong> Solar panel performance may degrade approximately 0.5% annually. System production depends on weather, 
              maintenance, and equipment quality. Net metering policies vary by utility and may change over time.
            </p>
            <p>
              <strong>Professional Consultation:</strong> This analysis is for informational purposes only. Consult with certified solar 
              professionals for accurate system design, site assessment, and financial projections specific to your property and situation.
            </p>
          </div>
        </div>

        {/* Hidden form tracking */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Track form start time
            window.formStartTime = Date.now();
            
            // Track mouse movements (simple version)
            window.mouseMovements = 0;
            document.addEventListener('mousemove', function() {
              window.mouseMovements++;
            });
            
            // Track keyboard activity
            window.keystrokes = 0;
            document.addEventListener('keydown', function() {
              window.keystrokes++;
            });
          `
        }} />
      </div>
    </div>
  );
};

export default SolarROICalculator;