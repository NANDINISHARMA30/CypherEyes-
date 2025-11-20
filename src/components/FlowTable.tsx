import { FlowData } from '../types';

interface FlowTableProps {
  flows: FlowData[];
  onSelectFlow?: (flow: FlowData) => void;
}

export default function FlowTable({ flows, onSelectFlow }: FlowTableProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getAnomalyColor = (score: number) => {
    if (score > 0.8) return 'text-red-600 bg-red-50';
    if (score > 0.6) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 col-span-4">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Network Flows</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Timestamp
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Source IP
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Destination IP
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Protocol
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Duration (ms)
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Bytes Sent
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                Anomaly Score
              </th>
            </tr>
          </thead>
          <tbody>
            {flows.slice(0, 10).map((flow) => (
              <tr
                key={flow.id}
                onClick={() => onSelectFlow?.(flow)}
                className="border-b border-gray-100 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <td className="py-3 px-4 text-sm text-gray-600">
                  {formatTimestamp(flow.timestamp)}
                </td>
                <td className="py-3 px-4 text-sm font-mono text-gray-800">
                  {flow.sourceIp}
                </td>
                <td className="py-3 px-4 text-sm font-mono text-gray-800">
                  {flow.destinationIp}
                </td>
                <td className="py-3 px-4">
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded">
                    {flow.protocol}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 text-right">
                  {flow.flowDuration.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 text-right">
                  {flow.bytesSent.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getAnomalyColor(
                      flow.anomalyScore
                    )}`}
                  >
                    {flow.anomalyScore.toFixed(3)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
