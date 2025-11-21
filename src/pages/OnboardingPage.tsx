import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Database, Link, CheckCircle, Server, Cloud } from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    networkSize: '',
    dataSource: '',
    apiEndpoint: '',
    apiKey: '',
    trafficVolume: '',
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-amber-400 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Shield className="w-12 h-12 text-orange-600" />
            <span className="text-3xl font-bold text-gray-900">CypherEyes</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome! Let's Set Up Your Account</h2>
          <p className="text-gray-700">This will only take a few minutes</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step
                    ? 'bg-orange-600 text-white'
                    : 'bg-white/50 text-gray-600'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? 'bg-orange-600' : 'bg-white/40'
                  }`} />
                )}
              </div>
              <div className="mt-2 text-sm text-gray-700 text-center font-medium">
                {step === 1 && 'Network Info'}
                {step === 2 && 'Data Source'}
                {step === 3 && 'Configuration'}
              </div>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-white/80 backdrop-blur-sm border border-orange-200/40 rounded-xl p-8 shadow-2xl">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Server className="w-6 h-6 mr-2 text-orange-600" />
                  Network Information
                </h3>
                <p className="text-gray-700 mb-6">Tell us about your network infrastructure</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Network Size
                </label>
                <select
                  value={formData.networkSize}
                  onChange={(e) => setFormData({ ...formData, networkSize: e.target.value })}
                  className="w-full px-4 py-3 bg-white/60 border border-orange-200/60 rounded-lg text-gray-900 focus:outline-none focus:border-orange-500/60 focus:bg-white/80"
                >
                  <option value="">Select network size</option>
                  <option value="small">Small (1-50 devices)</option>
                  <option value="medium">Medium (51-500 devices)</option>
                  <option value="large">Large (501-5000 devices)</option>
                  <option value="enterprise">Enterprise (5000+ devices)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Daily Traffic Volume
                </label>
                <select
                  value={formData.trafficVolume}
                  onChange={(e) => setFormData({ ...formData, trafficVolume: e.target.value })}
                  className="w-full px-4 py-3 bg-white/60 border border-orange-200/60 rounded-lg text-gray-900 focus:outline-none focus:border-orange-500/60 focus:bg-white/80"
                >
                  <option value="">Select traffic volume</option>
                  <option value="low">Low (&lt; 1 GB/day)</option>
                  <option value="medium">Medium (1-10 GB/day)</option>
                  <option value="high">High (10-100 GB/day)</option>
                  <option value="very-high">Very High (&gt; 100 GB/day)</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Database className="w-6 h-6 mr-2 text-orange-600" />
                  Connect Your Data Source
                </h3>
                <p className="text-gray-700 mb-6">Choose how you want to send network data to CypherEyes</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setFormData({ ...formData, dataSource: 'api' })}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    formData.dataSource === 'api'
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-orange-300/40 bg-white/60 hover:border-orange-400/60'
                  }`}
                >
                  <Cloud className="w-12 h-12 text-orange-600 mb-3" />
                  <h4 className="text-gray-900 font-semibold mb-2">API Integration</h4>
                  <p className="text-sm text-gray-700">Send data via REST API</p>
                </button>

                <button
                  onClick={() => setFormData({ ...formData, dataSource: 'syslog' })}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    formData.dataSource === 'syslog'
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-orange-300/40 bg-white/60 hover:border-orange-400/60'
                  }`}
                >
                  <Server className="w-12 h-12 text-orange-600 mb-3" />
                  <h4 className="text-gray-900 font-semibold mb-2">Syslog/PCAP</h4>
                  <p className="text-sm text-gray-700">Forward logs directly</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Link className="w-6 h-6 mr-2 text-orange-600" />
                  API Configuration
                </h3>
                <p className="text-gray-700 mb-6">Connect your network monitoring tools</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Endpoint (Optional)
                </label>
                <input
                  type="text"
                  value={formData.apiEndpoint}
                  onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                  className="w-full px-4 py-3 bg-white/60 border border-orange-200/60 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500/60 focus:bg-white/80"
                  placeholder="https://your-network-monitor.com/api"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key (Optional)
                </label>
                <input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full px-4 py-3 bg-white/60 border border-orange-200/60 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500/60 focus:bg-white/80"
                  placeholder="Enter your API key"
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-400/50 rounded-lg p-4">
                <p className="text-blue-700 text-sm">
                  <strong>Note:</strong> You can configure this later. For now, we'll use mock data to demonstrate the dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                currentStep === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white/70 text-gray-700 hover:bg-white/90 border border-orange-200'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg font-semibold transition-all shadow-lg"
            >
              {currentStep === 3 ? 'Complete Setup' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}