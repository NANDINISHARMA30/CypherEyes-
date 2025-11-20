import { UserActivity } from '../types';

interface UserBehaviourPageProps {
  users: UserActivity[];
}

export default function UserBehaviourPage({ users }: UserBehaviourPageProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRiskDot = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const sortedUsers = [...users].sort((a, b) => b.activityScore - a.activityScore);

  const generateHeatmapData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return days.map((day) => ({
      day,
      hours: hours.map(() => Math.random())
    }));
  };

  const heatmapData = generateHeatmapData();

  const getHeatmapColor = (value: number) => {
    if (value > 0.8) return 'bg-red-500';
    if (value > 0.6) return 'bg-orange-400';
    if (value > 0.4) return 'bg-yellow-400';
    if (value > 0.2) return 'bg-blue-300';
    return 'bg-blue-100';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">User Activity Heatmap</h2>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="flex">
              <div className="flex flex-col justify-around pr-2">
                {heatmapData.map((row) => (
                  <div key={row.day} className="text-xs text-gray-600 h-6 flex items-center">
                    {row.day}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex space-x-1 mb-2">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="text-xs text-gray-600 w-6 text-center">
                      {i % 4 === 0 ? i : ''}
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  {heatmapData.map((row) => (
                    <div key={row.day} className="flex space-x-1">
                      {row.hours.map((value, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded ${getHeatmapColor(value)} transition-all hover:scale-110 cursor-pointer`}
                          title={`${row.day} ${i}:00 - Activity: ${(value * 100).toFixed(0)}%`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center mt-6 space-x-4 text-sm">
          <span className="text-gray-600">Low Activity</span>
          <div className="flex space-x-1">
            <div className="w-4 h-4 bg-blue-100 rounded"></div>
            <div className="w-4 h-4 bg-blue-300 rounded"></div>
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
            <div className="w-4 h-4 bg-red-500 rounded"></div>
          </div>
          <span className="text-gray-600">High Activity</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Top Suspicious Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Username
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Risk Level
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  Activity Score
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  Suspicious Actions
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user) => (
                <tr
                  key={user.userId}
                  className="border-b border-gray-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className={`w-3 h-3 rounded-full ${getRiskDot(user.riskLevel)}`} />
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">
                    {user.username}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getRiskColor(
                        user.riskLevel
                      )}`}
                    >
                      {user.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right font-semibold">
                    {user.activityScore.toFixed(1)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right">
                    {user.suspiciousActions}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatTimestamp(user.lastActivity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
