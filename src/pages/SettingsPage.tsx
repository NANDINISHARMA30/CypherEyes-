import { useState } from 'react';
import { Settings as SettingsIcon, Database, Shield, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const [zeroDay, setZeroDay] = useState(true);
  const [liveCapture, setLiveCapture] = useState(true);
  const [dataSource, setDataSource] = useState('pcap');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-8 h-8 text-sky-500" />
          <h2 className="text-2xl font-bold text-slate-900">Detection Settings</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Zero-Day Detection</h3>
              <p className="text-sm text-gray-600 mt-1">
                Enable advanced heuristics for detecting unknown threats
              </p>
            </div>
            <button
              onClick={() => setZeroDay(!zeroDay)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                zeroDay ? 'bg-sky-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  zeroDay ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <SettingsIcon className="w-8 h-8 text-sky-500" />
          <h2 className="text-2xl font-bold text-slate-900">Model Configuration</h2>
        </div>

        <div className="space-y-6">
          <div className="bg-sky-50 rounded-lg p-4 border border-sky-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Current Model Version</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1">v2.3.1</p>
                <p className="text-xs text-gray-600 mt-2">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors font-medium">
                <RefreshCw className="w-4 h-4" />
                <span>Reload Model</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Model Performance</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-slate-900">98.7%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600">False Positive Rate</p>
                <p className="text-2xl font-bold text-slate-900">1.2%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600">Detection Time</p>
                <p className="text-2xl font-bold text-slate-900">45ms</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Database className="w-8 h-8 text-sky-500" />
          <h2 className="text-2xl font-bold text-slate-900">Data Source Settings</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block">
              Traffic Source
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDataSource('pcap')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  dataSource === 'pcap'
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-slate-900">PCAP File</p>
                <p className="text-xs text-gray-600 mt-1">Load from captured packet file</p>
              </button>
              <button
                onClick={() => setDataSource('live')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  dataSource === 'live'
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-slate-900">Live Capture</p>
                <p className="text-xs text-gray-600 mt-1">Monitor network in real-time</p>
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Live Capture</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Continuously monitor network traffic in real-time
                </p>
              </div>
              <button
                onClick={() => setLiveCapture(!liveCapture)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  liveCapture ? 'bg-sky-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    liveCapture ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
