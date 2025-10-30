'use client';

import { useEffect, useState } from 'react';
import FiBox from '@/components/icons/FiBox';
import FiBriefcase from '@/components/icons/FiBriefcase';
import FiBookOpen from '@/components/icons/FiBookOpen';
import FiUsers from '@/components/icons/FiUsers';
import FiPlusCircle from '@/components/icons/FiPlusCircle';
import StudentTrendChart from './components/Charts/StudentTrendChart';

interface Activity {
  id: string;
  description: string;
  time: string;
  createdAt: string;
}

interface SummaryItem {
  name: string;
  value: number;
  icon: React.ComponentType;
}

interface TrendData {
  month: string;
  students: number;
}

interface SummaryResponse {
  services: number;
  projects: number;
  courses: number;
  students: number;
}

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState<SummaryItem[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, activityRes, trendRes] = await Promise.all([
          fetch('/api/admin/summary'),
          fetch('/api/admin/activity'),
          fetch('/api/admin/student-trend'),
        ]);

        const summary: SummaryResponse = await summaryRes.json();
        const activity: Activity[] = await activityRes.json();
        const trend: TrendData[] = await trendRes.json();

        setSummaryData([
          { name: 'Services', value: summary.services, icon: FiBox },
          { name: 'Projects', value: summary.projects, icon: FiBriefcase },
          { name: 'Courses', value: summary.courses, icon: FiBookOpen },
          { name: 'Students', value: summary.students, icon: FiUsers },
        ]);

        setRecentActivity(activity);
        setTrendData(trend);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-gray-800">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Dashboard</h1>
        {/* Action buttons will wrap on smaller screens */}
        <div className="flex flex-wrap space-x-2 sm:space-x-4">
          <button className="flex items-center bg-indigo-500 text-white px-3 sm:px-4 py-2 rounded-lg shadow hover:bg-indigo-600 transition-colors text-sm sm:text-base">
            <FiPlusCircle className="mr-2" />
            Add Course
          </button>
          <button className="flex items-center bg-gray-800 text-white px-3 sm:px-4 py-2 rounded-lg shadow hover:bg-gray-900 transition-colors text-sm sm:text-base">
            <FiPlusCircle className="mr-2" />
            Add Project
          </button>
        </div>
      </div>

      {/* Summary Cards - already responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryData.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Icon />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-600">{item.name}</h3>
                <p className="text-3xl md:text-4xl font-bold text-gray-800 mt-1">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid - already responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart - container is responsive */}
        <StudentTrendChart data={trendData} />

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start">
                <div className="bg-indigo-500 h-2 w-2 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="text-gray-800">{activity.description}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
