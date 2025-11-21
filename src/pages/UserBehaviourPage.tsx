import Layout from '../components/Layout';
import { UserActivity } from '../types';
import { generateMockUsers } from '../utils/mockData';

export default function UserBehaviourPage() {
  const users = generateMockUsers();
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



  return (
    <Layout currentPage="User Behaviour">
      <div className="space-y-6">

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
    </Layout>
  );
}
