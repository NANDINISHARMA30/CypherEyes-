import { useEffect, useRef } from 'react';
import { ProtocolDistribution } from '../types';

interface ProtocolChartProps {
  data: ProtocolDistribution[];
}

const COLORS = ['#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

export default function ProtocolChart({ data }: ProtocolChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    ctx.clearRect(0, 0, width, height);

    let currentAngle = -Math.PI / 2;

    data.forEach((item, index) => {
      const sliceAngle = (item.percentage / 100) * 2 * Math.PI;

      ctx.fillStyle = COLORS[index % COLORS.length];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      currentAngle += sliceAngle;
    });

  }, [data]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Protocol Distribution</h3>
      <div className="flex items-center justify-between">
        <div style={{ width: '200px', height: '200px' }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
        <div className="flex flex-col space-y-3">
          {data.map((item, index) => (
            <div key={item.protocol} className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{item.protocol}</p>
                <p className="text-xs text-gray-500">{item.count.toLocaleString()} packets</p>
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {item.percentage.toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
