import { useEffect, useRef } from 'react';

interface DataPoint {
  timestamp: string;
  value: number;
  anomalyScore: number;
}

interface TrafficGraphProps {
  data: DataPoint[];
}

export default function TrafficGraph({ data }: TrafficGraphProps) {
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
    const padding = 40;

    ctx.clearRect(0, 0, width, height);

    const maxValue = Math.max(...data.map(d => d.value));
    const xStep = (width - padding * 2) / (data.length - 1);

    ctx.strokeStyle = '#0EA5E9';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, i) => {
      const x = padding + i * xStep;
      const y = height - padding - ((point.value / maxValue) * (height - padding * 2));

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(14, 165, 233, 0.2)');
    gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);

    data.forEach((point, i) => {
      const x = padding + i * xStep;
      const y = height - padding - ((point.value / maxValue) * (height - padding * 2));
      ctx.lineTo(x, y);
    });

    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fill();

    data.forEach((point, i) => {
      if (point.anomalyScore > 0.7) {
        const x = padding + i * xStep;
        const y = height - padding - ((point.value / maxValue) * (height - padding * 2));

        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = padding + (i * (height - padding * 2)) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    ctx.fillStyle = '#64748B';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i < 5; i++) {
      const value = maxValue - (i * maxValue) / 4;
      const y = padding + (i * (height - padding * 2)) / 4;
      ctx.fillText(value.toFixed(0), padding - 10, y + 4);
    }

  }, [data]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 col-span-2">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Real-Time Traffic</h3>
      <div className="relative" style={{ height: '300px' }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="flex items-center justify-center mt-4 space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
          <span className="text-gray-600">Normal Traffic</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">Anomaly Spike</span>
        </div>
      </div>
    </div>
  );
}
