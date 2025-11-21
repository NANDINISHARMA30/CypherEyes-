import React, { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, Shield, Clock, Eye } from 'lucide-react';
import XAITicket from './XAITicket';

interface FlaggedPacket {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  protocol: string;
  classification: string;
  confidence: number;
  isViewed: boolean;
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
}

// Demo data for XAI explanations
const demoFlaggedPackets: FlaggedPacket[] = [
  {
    id: 'XAI-2024-001',
    timestamp: new Date().toISOString(),
    sourceIp: '192.168.1.100',
    destIp: '10.0.0.5',
    protocol: 'TCP',
    classification: 'SQL Injection Attack',
    confidence: 0.94,
    isViewed: false,
    xaiExplanation: {
      type: 'known_attack',
      title: 'SQL Injection Attack Detected',
      confidence: 0.94,
      keyFactors: [
        {
          factor: 'Payload Content',
          value: "'; DROP TABLE users; --",
          impact: 0.85,
          description: 'Classic SQL injection pattern detected in HTTP POST payload targeting database tables'
        },
        {
          factor: 'Request Frequency',
          value: '23 requests/min',
          impact: 0.42,
          description: 'Unusually high request frequency from same source IP suggesting automated attack'
        },
        {
          factor: 'URL Pattern',
          value: '/admin/login.php',
          impact: 0.38,
          description: 'Target endpoint commonly vulnerable to SQL injection attacks'
        },
        {
          factor: 'User-Agent',
          value: 'sqlmap/1.6.12',
          impact: 0.76,
          description: 'Known penetration testing tool user-agent string detected'
        }
      ],
      modelAnalysis: {
        supervisedProbability: 0.94,
        unsupervisedScore: 0.31,
        boostingFactor: 1.8
      }
    }
  },
  {
    id: 'XAI-2024-002',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    sourceIp: '203.45.67.89',
    destIp: '10.0.0.12',
    protocol: 'HTTP',
    classification: 'Potential Zero-Day',
    confidence: 0.78,
    isViewed: false,
    xaiExplanation: {
      type: 'zero_day',
      title: 'Potential Zero-Day Exploit',
      confidence: 0.78,
      keyFactors: [
        {
          factor: 'Novel Payload Structure',
          value: 'Unknown binary pattern',
          impact: 0.67,
          description: 'Payload structure not matching any known attack signatures in threat intelligence database'
        },
        {
          factor: 'Exploitation Technique',
          value: 'Buffer overflow attempt',
          impact: 0.73,
          description: 'Memory corruption attempt using previously unseen technique targeting application vulnerabilities'
        },
        {
          factor: 'Target Service',
          value: 'Custom web application',
          impact: 0.45,
          description: 'Attack targeting proprietary application with no known public vulnerabilities'
        },
        {
          factor: 'Evasion Techniques',
          value: 'Polymorphic encoding',
          impact: 0.82,
          description: 'Advanced evasion using code mutation to avoid signature-based detection'
        }
      ],
      modelAnalysis: {
        supervisedProbability: 0.23,
        unsupervisedScore: 0.89
      }
    }
  },
  {
    id: 'XAI-2024-003',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    sourceIp: '10.0.1.45',
    destIp: '172.16.0.100',
    protocol: 'HTTPS',
    classification: 'Suspicious Data Exfiltration',
    confidence: 0.82,
    isViewed: false,
    xaiExplanation: {
      type: 'high_confidence_anomaly',
      title: 'High-Confidence Anomaly Detected',
      confidence: 0.82,
      keyFactors: [
        {
          factor: 'Data Volume',
          value: '2.3 GB transferred',
          impact: 0.78,
          description: 'Unusually large data transfer volume during off-hours from internal system'
        },
        {
          factor: 'Transfer Pattern',
          value: 'Encrypted chunks',
          impact: 0.65,
          description: 'Data being transferred in small encrypted chunks to avoid detection thresholds'
        },
        {
          factor: 'Destination Analysis',
          value: 'Unknown external server',
          impact: 0.71,
          description: 'Data being sent to previously unknown external IP not in approved destination list'
        },
        {
          factor: 'Time Pattern',
          value: '02:30 AM - Off hours',
          impact: 0.58,
          description: 'Transfer occurring during off-business hours when minimal legitimate activity expected'
        }
      ],
      modelAnalysis: {
        supervisedProbability: 0.45,
        unsupervisedScore: 0.82,
        boostingFactor: 1.4
      }
    }
  }
];

interface XAITicketManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const XAITicketManager: React.FC<XAITicketManagerProps> = ({ isOpen, onClose }) => {
  const [flaggedPackets, setFlaggedPackets] = useState<FlaggedPacket[]>(demoFlaggedPackets);
  const [selectedPacket, setSelectedPacket] = useState<FlaggedPacket | null>(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);

  // Simulate new packets being flagged
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new flagged packets (demo purposes)
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const newPacket: FlaggedPacket = {
          id: `XAI-2024-${String(Date.now()).slice(-3)}`,
          timestamp: new Date().toISOString(),
          sourceIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          destIp: `10.0.0.${Math.floor(Math.random() * 255)}`,
          protocol: Math.random() > 0.5 ? 'TCP' : 'HTTP',
          classification: ['Port Scan', 'Brute Force', 'DDoS Attempt', 'Malware C&C'][Math.floor(Math.random() * 4)],
          confidence: 0.6 + Math.random() * 0.4,
          isViewed: false,
          xaiExplanation: {
            type: ['known_attack', 'high_confidence_anomaly'][Math.floor(Math.random() * 2)] as any,
            title: 'Automated Detection',
            confidence: 0.6 + Math.random() * 0.4,
            keyFactors: [
              {
                factor: 'Pattern Analysis',
                value: 'Suspicious behavior',
                impact: Math.random() * 0.8,
                description: 'Automated analysis detected suspicious network behavior pattern'
              }
            ],
            modelAnalysis: {
              supervisedProbability: Math.random(),
              unsupervisedScore: Math.random()
            }
          }
        };
        
        setFlaggedPackets(prev => [newPacket, ...prev.slice(0, 9)]); // Keep only 10 most recent
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleViewTicket = (packet: FlaggedPacket) => {
    setSelectedPacket(packet);
    setShowTicketDetails(true);
    
    // Mark as viewed
    setFlaggedPackets(prev => 
      prev.map(p => p.id === packet.id ? { ...p, isViewed: true } : p)
    );
  };

  const getClassificationColor = (type: string) => {
    switch (type) {
      case 'known_attack':
        return 'bg-red-500';
      case 'zero_day':
        return 'bg-orange-500';
      case 'high_confidence_anomaly':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const unviewedCount = flaggedPackets.filter(p => !p.isViewed).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Ticket Manager Panel */}
      <div className="fixed top-20 right-4 w-96 bg-white rounded-xl shadow-2xl border z-40 max-h-[calc(100vh-100px)] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <h3 className="font-semibold">XAI Security Tickets</h3>
              {unviewedCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unviewedCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ticket List */}
        <div className="max-h-96 overflow-y-auto">
          {flaggedPackets.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No flagged packets detected</p>
              <p className="text-sm">Your network is secure</p>
            </div>
          ) : (
            <div className="divide-y">
              {flaggedPackets.map((packet) => (
                <div
                  key={packet.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !packet.isViewed ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => handleViewTicket(packet)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getClassificationColor(packet.xaiExplanation.type)}`} />
                        <span className="font-medium text-sm">{packet.classification}</span>
                        {!packet.isViewed && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">New</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>From: {packet.sourceIp} → {packet.destIp}</div>
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(packet.timestamp).toLocaleTimeString()}
                          </span>
                          <span>Confidence: {(packet.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="text-center text-xs text-gray-500">
            Real-time XAI analysis powered by CypherEyes
          </div>
        </div>
      </div>

      {/* XAI Ticket Details Modal */}
      {showTicketDetails && selectedPacket && (
        <XAITicket
          isOpen={showTicketDetails}
          onClose={() => setShowTicketDetails(false)}
          packetData={selectedPacket}
        />
      )}
    </>
  );
};

export default XAITicketManager;