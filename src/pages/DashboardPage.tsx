import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import SummaryCards from '../components/SummaryCards';
import TrafficGraph from '../components/TrafficGraph';
import ProtocolChart from '../components/ProtocolChart';
import FlowTable from '../components/FlowTable';
import { FlowData, TrafficMetrics, ProtocolDistribution } from '../types';
import {
  generateMockFlowData,
  generateProtocolDistribution,
  generateTrafficTimeSeries
} from '../utils/mockData';

export default function DashboardPage() {
  const [metrics] = useState<TrafficMetrics>({
    totalPackets: 12410,
    anomaliesDetected: 23,
    activeConnections: 145,
    avgThroughput: 38.7
  });

  const [flows, setFlows] = useState<FlowData[]>([]);
  const [protocols] = useState<ProtocolDistribution[]>(generateProtocolDistribution());
  const [trafficData, setTrafficData] = useState(generateTrafficTimeSeries());

  useEffect(() => {
    setFlows(generateMockFlowData());

    const interval = setInterval(() => {
      setTrafficData((prev) => {
        const newPoint = {
          timestamp: new Date().toISOString(),
          value: 50 + Math.random() * 50 + Math.sin(Date.now() / 60000) * 20,
          anomalyScore: Math.random() * 0.3 + (Math.random() > 0.9 ? 0.5 : 0)
        };
        return [...prev.slice(1), newPoint];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout currentPage="Dashboard">
      <div className="space-y-6">
        <SummaryCards metrics={metrics} />

        <div className="grid grid-cols-3 gap-6">
          <TrafficGraph data={trafficData} />
          <ProtocolChart data={protocols} />
        </div>

        <FlowTable flows={flows} />
      </div>
    </Layout>
  );
}
