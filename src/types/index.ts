export interface FlowData {
  id: string;
  timestamp: string;
  sourceIp: string;
  destinationIp: string;
  protocol: string;
  flowDuration: number;
  bytesSent: number;
  anomalyScore: number;
  isAnomaly: boolean;
}

export interface AnomalyData {
  id: string;
  timestamp: string;
  sourceIp: string;
  destinationIp: string;
  anomalyType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  anomalyScore: number;
  description: string;
  features: { name: string; contribution: number }[];
}

export interface UserActivity {
  userId: string;
  username: string;
  activityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastActivity: string;
  suspiciousActions: number;
}

export interface TrafficMetrics {
  totalPackets: number;
  anomaliesDetected: number;
  activeConnections: number;
  avgThroughput: number;
}

export interface ProtocolDistribution {
  protocol: string;
  count: number;
  percentage: number;
}
