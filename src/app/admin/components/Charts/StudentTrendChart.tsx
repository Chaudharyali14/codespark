'use client';

import { LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

interface TrendData {
  month: string;
  students: number;
}

interface StudentTrendChartProps {
  data: TrendData[];
}

const StudentTrendChart: React.FC<StudentTrendChartProps> = ({ data }) => {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Student Enrollment Trend</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="students" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StudentTrendChart;
