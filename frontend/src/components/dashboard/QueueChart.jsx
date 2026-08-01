import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const defaultData = [
  { name: 'Wed', created: 1, resolved: 0 },
  { name: 'Thu', created: 0, resolved: 0 },
  { name: 'Fri', created: 0, resolved: 0 },
  { name: 'Sat', created: 0, resolved: 0 },
  { name: 'Sun', created: 0, resolved: 0 },
  { name: 'Mon', created: 0, resolved: 0 },
  { name: 'Tue', created: 0, resolved: 0 },
];

const QueueChart = ({ data }) => {
  const chartData = data?.length > 0 ? data : defaultData;
  return (
    <div className="w-full h-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: '#94A3B8', fontWeight: 600 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: '#94A3B8', fontWeight: 600 }}
            ticks={[0, 1, 2, 3, 4]}
            domain={[0, 4]}
          />
          <Area
            type="linear"
            dataKey="created"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCreated)"
            activeDot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#3B82F6' }}
            dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#3B82F6' }}
          />
          <Area
            type="linear"
            dataKey="resolved"
            stroke="#22C55E"
            strokeWidth={2}
            fill="none"
            activeDot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#22C55E' }}
            dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#22C55E' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QueueChart;
