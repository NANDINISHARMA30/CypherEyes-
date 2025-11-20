import { Activity, AlertTriangle, Network, TrendingUp } from 'lucide-react';
import { TrafficMetrics } from '../types';

interface SummaryCardsProps {
  metrics: TrafficMetrics;
}

export default function SummaryCards({ metrics }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Packets',
      value: metrics.totalPackets.toLocaleString(),
      icon: Activity,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Anomalies Detected',
      value: metrics.anomaliesDetected.toString(),
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      title: 'Active Connections',
      value: metrics.activeConnections.toString(),
      icon: Network,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Avg Throughput',
      value: `${metrics.avgThroughput.toFixed(1)} MB/s`,
      icon: TrendingUp,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-2">{card.title}</p>
              <p className="text-3xl font-bold text-slate-900">{card.value}</p>
            </div>
            <div className={`${card.iconBg} p-3 rounded-full`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
