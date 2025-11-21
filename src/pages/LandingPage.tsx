import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, Brain, TrendingUp, Lock, Users } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <nav className="bg-gray-900/50 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">CypherEyes</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-purple-300 hover:text-white transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Next-Generation
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {' '}Intrusion Detection
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            AI-powered hybrid IDS that detects both known and zero-day threats with explainable insights. 
            Protect your organization from evolving cyber threats and insider attacks.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            Start Free Trial
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Eye className="w-12 h-12 text-purple-400" />}
            title="Zero-Day Detection"
            description="Advanced ML ensemble models detect unknown threats that signature-based systems miss"
          />
          <FeatureCard
            icon={<Brain className="w-12 h-12 text-pink-400" />}
            title="Explainable AI"
            description="Understand the 'why' behind every alert with transparent, interpretable AI insights"
          />
          <FeatureCard
            icon={<Users className="w-12 h-12 text-purple-400" />}
            title="Insider Threat Detection"
            description="Identify anomalous user behaviors that indicate potential insider threats"
          />
          <FeatureCard
            icon={<TrendingUp className="w-12 h-12 text-pink-400" />}
            title="Low False Positives"
            description="Intelligent model fusion minimizes alert fatigue and improves SOC efficiency"
          />
          <FeatureCard
            icon={<Lock className="w-12 h-12 text-purple-400" />}
            title="Hybrid Approach"
            description="Combines signature-based detection with supervised and unsupervised ML models"
          />
          <FeatureCard
            icon={<Shield className="w-12 h-12 text-pink-400" />}
            title="Real-Time Monitoring"
            description="Continuous network traffic analysis with instant threat alerts and visualization"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-12 text-center backdrop-blur-sm border border-purple-500/20">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Secure Your Network?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join leading organizations using CypherEyes to protect their infrastructure 
            from evolving cyber threats with AI-powered detection.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-white text-purple-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-purple-500/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 CypherEyes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}