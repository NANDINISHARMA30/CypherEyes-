import React, { useState } from 'react';
import { X, Download, AlertTriangle, Shield, Clock, FileText } from 'lucide-react';

interface XAITicketProps {
  isOpen: boolean;
  onClose: () => void;
  packetData: {
    id: string;
    timestamp: string;
    sourceIp: string;
    destIp: string;
    protocol: string;
    classification: string;
    confidence: number;
    xaiExplanation: {
      type: 'known_attack' | 'zero_day' | 'high_confidence_anomaly' | 'normal';
      title: string;
      confidence: number;
      keyFactors: Array<{
        factor: string;
        value: string | number;
        impact: number;
        description: string;
      }>;
      modelAnalysis: {
        supervisedProbability: number;
        unsupervisedScore: number;
        boostingFactor?: number;
      };
    };
  };
}

const XAITicket: React.FC<XAITicketProps> = ({ isOpen, onClose, packetData }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'recommendations'>('overview');

  if (!isOpen) return null;

  const getClassificationColor = (type: string) => {
    switch (type) {
      case 'known_attack':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'zero_day':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'high_confidence_anomaly':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'known_attack':
      case 'zero_day':
        return <AlertTriangle className="w-6 h-6" />;
      case 'high_confidence_anomaly':
        return <Shield className="w-6 h-6" />;
      default:
        return <Shield className="w-6 h-6" />;
    }
  };

  const downloadSummary = () => {
    const summary = {
      ticketId: packetData.id,
      timestamp: packetData.timestamp,
      classification: packetData.classification,
      confidence: packetData.confidence,
      explanation: packetData.xaiExplanation,
      networkDetails: {
        sourceIp: packetData.sourceIp,
        destIp: packetData.destIp,
        protocol: packetData.protocol,
      },
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `xai-ticket-${packetData.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              {getIcon(packetData.xaiExplanation.type)}
              <div>
                <h2 className="text-2xl font-bold">XAI Security Analysis</h2>
                <p className="text-blue-100">Ticket ID: {packetData.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={downloadSummary}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                title="Download Summary"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Classification Badge */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div className={`px-4 py-2 rounded-full border ${getClassificationColor(packetData.xaiExplanation.type)}`}>
              <span className="font-semibold">{packetData.xaiExplanation.title}</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(packetData.timestamp).toLocaleString()}
              </div>
              <div className="font-semibold">
                Confidence: {(packetData.xaiExplanation.confidence * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {['overview', 'technical', 'recommendations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Contributing Factors */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Key Contributing Factors</h3>
                <div className="space-y-3">
                  {packetData.xaiExplanation.keyFactors.map((factor, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">{factor.factor}</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          factor.impact > 0 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          Impact: {factor.impact > 0 ? '+' : ''}{factor.impact.toFixed(3)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        Value: <span className="font-mono">{factor.value}</span>
                      </div>
                      <p className="text-sm text-gray-700">{factor.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Analysis */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Model Analysis</h3>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {(packetData.xaiExplanation.modelAnalysis.supervisedProbability * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Supervised Models</div>
                      <div className="text-xs text-gray-500">(RF + XGBoost)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        {(packetData.xaiExplanation.modelAnalysis.unsupervisedScore * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Unsupervised Models</div>
                      <div className="text-xs text-gray-500">(AE + IF)</div>
                    </div>
                    {packetData.xaiExplanation.modelAnalysis.boostingFactor && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {packetData.xaiExplanation.modelAnalysis.boostingFactor.toFixed(2)}x
                        </div>
                        <div className="text-sm text-gray-600">Boosting Factor</div>
                        <div className="text-xs text-gray-500">Applied</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="space-y-6">
              {/* Network Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Network Details</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Source IP:</span>
                      <span className="ml-2 font-mono">{packetData.sourceIp}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Destination IP:</span>
                      <span className="ml-2 font-mono">{packetData.destIp}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Protocol:</span>
                      <span className="ml-2">{packetData.protocol}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Timestamp:</span>
                      <span className="ml-2">{new Date(packetData.timestamp).toISOString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Detailed Technical Analysis</h3>
                <div className="space-y-4">
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Classification Logic</h4>
                    <p className="text-sm text-gray-700">
                      The hybrid IDS system analyzed this packet using both supervised learning models 
                      (Random Forest and XGBoost) trained on known attack patterns, and unsupervised 
                      models (Autoencoder and Isolation Forest) for anomaly detection.
                    </p>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Feature Importance</h4>
                    <p className="text-sm text-gray-700">
                      The model identified key features that contributed most significantly to the 
                      classification decision, ranked by their impact on the final prediction score.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Recommended Actions</h3>
                <div className="space-y-4">
                  {packetData.xaiExplanation.type === 'known_attack' && (
                    <>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-medium text-red-800 mb-2">Immediate Actions</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• Block source IP immediately</li>
                          <li>• Investigate affected systems</li>
                          <li>• Check for lateral movement</li>
                          <li>• Update firewall rules</li>
                        </ul>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-800 mb-2">Follow-up Actions</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• Conduct forensic analysis</li>
                          <li>• Update threat intelligence</li>
                          <li>• Review security policies</li>
                        </ul>
                      </div>
                    </>
                  )}
                  
                  {packetData.xaiExplanation.type === 'zero_day' && (
                    <>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <h4 className="font-medium text-orange-800 mb-2">Critical Actions</h4>
                        <ul className="text-sm text-orange-700 space-y-1">
                          <li>• Isolate affected systems immediately</li>
                          <li>• Collect evidence for analysis</li>
                          <li>• Alert security team</li>
                          <li>• Document novel attack patterns</li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 mb-2">Analysis Required</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Deep packet inspection</li>
                          <li>• Behavioral analysis</li>
                          <li>• Create new detection rules</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {packetData.xaiExplanation.type === 'high_confidence_anomaly' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-800 mb-2">Investigation Required</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Monitor source for patterns</li>
                        <li>• Check user behavior context</li>
                        <li>• Verify business justification</li>
                        <li>• Consider temporary restrictions</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="w-4 h-4 mr-1" />
            Generated by CypherEyes XAI Engine
          </div>
          <button
            onClick={downloadSummary}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Full Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default XAITicket;