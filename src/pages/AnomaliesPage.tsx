import { useState } from 'react';
import { X } from 'lucide-react';
import { AnomalyData } from '../types';

interface AnomaliesPageProps {
  anomalies: AnomalyData[];
}

export default function AnomaliesPage({ anomalies }: AnomaliesPageProps) {
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyData | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = ['all', 'critical', 'high', 'medium', 'low'];

  const filteredAnomalies = anomalies.filter(
    (a) => activeFilter === 'all' || a.severity === activeFilter
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Anomaly Detection</h2>
          <div className="flex space-x-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Timestamp
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Source IP
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Destination IP
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Severity
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Score
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAnomalies.map((anomaly) => (
                <tr
                  key={anomaly.id}
                  className="border-b border-gray-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatTimestamp(anomaly.timestamp)}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">
                    {anomaly.anomalyType}
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-gray-800">
                    {anomaly.sourceIp}
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-gray-800">
                    {anomaly.destinationIp}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${getSeverityColor(
                        anomaly.severity
                      )}`}
                    >
                      {anomaly.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm font-semibold text-gray-700">
                    {anomaly.anomalyScore.toFixed(3)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedAnomaly(anomaly)}
                      className="text-sky-500 hover:text-sky-700 font-medium text-sm"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAnomaly && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl overflow-y-auto animate-slide-in">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Anomaly Details</h2>
                <button
                  onClick={() => setSelectedAnomaly(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Type</h3>
                  <p className="text-lg font-medium text-slate-900">
                    {selectedAnomaly.anomalyType}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Source IP</h3>
                    <p className="text-base font-mono text-slate-900">
                      {selectedAnomaly.sourceIp}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">
                      Destination IP
                    </h3>
                    <p className="text-base font-mono text-slate-900">
                      {selectedAnomaly.destinationIp}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Severity</h3>
                  <span
                    className={`inline-block px-4 py-2 text-sm font-bold rounded-full ${getSeverityColor(
                      selectedAnomaly.severity
                    )}`}
                  >
                    {selectedAnomaly.severity.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Anomaly Score</h3>
                  <p className="text-2xl font-bold text-slate-900">
                    {selectedAnomaly.anomalyScore.toFixed(3)}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Description</h3>
                  <p className="text-base text-gray-700">{selectedAnomaly.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-4">
                    Feature Contributions
                  </h3>
                  <div className="space-y-3">
                    {selectedAnomaly.features.map((feature) => (
                      <div key={feature.name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {feature.name}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {(feature.contribution * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-red-500"
                            style={{ width: `${feature.contribution * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
