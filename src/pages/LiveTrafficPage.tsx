import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import Layout from '../components/Layout';
import { FlowData } from '../types';
import { generateMockFlowData } from '../utils/mockData';

export default function LiveTrafficPage() {
  const [liveFeeds, setLiveFeeds] = useState<FlowData[]>([]);

  useEffect(() => {
    // Generate initial flows inside useEffect to avoid re-running on every render
    const initialFlows = generateMockFlowData();
    setLiveFeeds(initialFlows.slice(0, 50));

    const interval = setInterval(() => {
      setLiveFeeds((prev) => {
        const newFlow: FlowData = {
          id: `flow-${Date.now()}`,
          timestamp: new Date().toISOString(),
          sourceIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          destinationIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          protocol: ['TCP', 'UDP', 'HTTP', 'HTTPS'][Math.floor(Math.random() * 4)],
          flowDuration: Math.floor(Math.random() * 5000),
          bytesSent: Math.floor(Math.random() * 50000),
          anomalyScore: Math.random(),
          isAnomaly: Math.random() > 0.9
        };
        return [newFlow, ...prev.slice(0, 49)];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only once on mount

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getProtocolColor = (protocol: string) => {
    switch (protocol) {
      case 'TCP':
        return 'bg-blue-500';
      case 'UDP':
        return 'bg-green-500';
      case 'HTTP':
        return 'bg-purple-500';
      case 'HTTPS':
        return 'bg-sky-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Layout currentPage="Live Traffic">
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-sky-500 animate-pulse" />
              <h2 className="text-2xl font-bold text-slate-900">Live Network Traffic</h2>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">Live Feed Active</span>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 h-[600px] overflow-y-auto font-mono text-sm">
            {liveFeeds.map((flow) => (
              <div
                key={flow.id}
                className={`mb-2 p-3 rounded transition-all duration-300 ${
                  flow.isAnomaly
                    ? 'bg-red-900 bg-opacity-30 border-l-4 border-red-500'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-400 text-xs">{formatTimestamp(flow.timestamp)}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold text-white ${getProtocolColor(
                        flow.protocol
                      )}`}
                    >
                      {flow.protocol}
                    </span>
                    <span className="text-sky-400">{flow.sourceIp}</span>
                    <span className="text-gray-500">→</span>
                    <span className="text-green-400">{flow.destinationIp}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-gray-400">{flow.bytesSent.toLocaleString()} bytes</span>
                    {flow.isAnomaly && (
                      <span className="text-red-400 font-bold">ANOMALY DETECTED</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Packets/Second</h3>
            <p className="text-3xl font-bold text-slate-900">
              {Math.floor(Math.random() * 1000 + 500)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Active Streams</h3>
            <p className="text-3xl font-bold text-slate-900">
              {Math.floor(Math.random() * 100 + 50)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Bandwidth Usage</h3>
            <p className="text-3xl font-bold text-slate-900">
              {(Math.random() * 50 + 20).toFixed(1)} MB/s
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}