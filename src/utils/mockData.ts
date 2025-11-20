import { FlowData, AnomalyData, UserActivity, ProtocolDistribution } from '../types';

export const generateMockFlowData = (): FlowData[] => {
  const flows: FlowData[] = [];
  const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'];

  for (let i = 0; i < 20; i++) {
    const anomalyScore = Math.random();
    flows.push({
      id: `flow-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      sourceIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      destinationIp: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      flowDuration: Math.floor(Math.random() * 10000),
      bytesSent: Math.floor(Math.random() * 1000000),
      anomalyScore: anomalyScore,
      isAnomaly: anomalyScore > 0.7
    });
  }

  return flows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const generateMockAnomalies = (): AnomalyData[] => {
  const types = ['Port Scan', 'DDoS Attack', 'SQL Injection', 'Brute Force', 'Data Exfiltration'];
  const severities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];

  return Array.from({ length: 15 }, (_, i) => ({
    id: `anomaly-${i}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    sourceIp: `203.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    destinationIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    anomalyType: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    anomalyScore: 0.7 + Math.random() * 0.3,
    description: 'Suspicious activity detected based on traffic patterns',
    features: [
      { name: 'Packet Rate', contribution: Math.random() },
      { name: 'Byte Count', contribution: Math.random() },
      { name: 'Flow Duration', contribution: Math.random() },
      { name: 'Protocol Anomaly', contribution: Math.random() }
    ].sort((a, b) => b.contribution - a.contribution)
  }));
};

export const generateMockUsers = (): UserActivity[] => {
  const usernames = ['alice.smith', 'bob.jones', 'charlie.brown', 'diana.prince', 'eve.wilson'];
  const riskLevels: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];

  return usernames.map((username, i) => ({
    userId: `user-${i}`,
    username,
    activityScore: Math.random() * 100,
    riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
    lastActivity: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    suspiciousActions: Math.floor(Math.random() * 10)
  }));
};

export const generateProtocolDistribution = (): ProtocolDistribution[] => {
  const data = [
    { protocol: 'TCP', count: 4520 },
    { protocol: 'UDP', count: 2340 },
    { protocol: 'HTTP', count: 1890 },
    { protocol: 'HTTPS', count: 3210 },
    { protocol: 'ICMP', count: 450 }
  ];

  const total = data.reduce((sum, item) => sum + item.count, 0);
  return data.map(item => ({
    ...item,
    percentage: (item.count / total) * 100
  }));
};

export const generateTrafficTimeSeries = (points: number = 50) => {
  const data = [];
  const now = Date.now();

  for (let i = points; i >= 0; i--) {
    data.push({
      timestamp: new Date(now - i * 60000).toISOString(),
      value: 50 + Math.random() * 50 + Math.sin(i / 5) * 20,
      anomalyScore: Math.random() * 0.3 + (Math.random() > 0.9 ? 0.5 : 0)
    });
  }

  return data;
};
