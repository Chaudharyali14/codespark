'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import LogoSettings from './LogoSettings';

// Icons
const DashboardIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
  </svg>
);

const LogoIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path></svg>
);

const FiBox = () => (
    <svg className="h-6 w-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);

const FiBriefcase = () => (
    <svg className="h-6 w-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"></path></svg>
);

const FiBookOpen = () => (
    <svg className="h-6 w-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"></path><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"></path></svg>
);

const FiUsers = () => (
    <svg className="h-6 w-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>
);

const FiPlusCircle = () => (
    <svg className="mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for now, as we don't have the API endpoints
        const messages = [
          { id: 1, name: 'John Doe', createdAt: new Date(Date.now() - 3600 * 1000).toISOString() },
          { id: 2, name: 'Jane Smith', createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
        ];
        const students = [
          { id: 1, name: 'Alice', createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString() },
          { id: 2, name: 'Bob', createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString() },
        ];
        const projects = [
          { id: 1, title: 'Project A', createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString() },
          { id: 2, title: 'Project B', createdAt: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString() },
        ];
        const courses = [
          { id: 1, name: 'Course 1', createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString() },
          { id: 2, name: 'Course 2', createdAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString() },
        ];
        const services = [{}, {}, {}];

        // Create activity items
        const activities: any[] = [];

        // Add recent messages
        messages.slice(-2).forEach((msg: any) => {
          activities.push({
            id: `msg-${msg.id}`,
            description: `New message from: ${msg.name}`,
            time: getRelativeTime(msg.createdAt),
            createdAt: msg.createdAt,
          });
        });

        // Add recent students
        students.slice(-2).forEach((stu: any) => {
          activities.push({
            id: `stu-${stu.id}`,
            description: `New student enrolled: ${stu.name}`,
            time: getRelativeTime(stu.createdAt),
            createdAt: stu.createdAt,
          });
        });

        // Add recent projects
        projects.slice(-2).forEach((proj: any) => {
          activities.push({
            id: `proj-${proj.id}`,
            description: `New project added: ${proj.title}`,
            time: getRelativeTime(proj.createdAt),
            createdAt: proj.createdAt,
          });
        });

        // Add recent courses
        courses.slice(-2).forEach((course: any) => {
          activities.push({
            id: `course-${course.id}`,
            description: `New course added: ${course.name}`,
            time: getRelativeTime(course.createdAt),
            createdAt: course.createdAt,
          });
        });

        // Sort by createdAt desc and take top 4
        activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentActivity(activities.slice(0, 4));

        // Set summary data
        setSummaryData([
          { name: 'Services', value: Array.isArray(services) ? services.length : 0, icon: FiBox },
          { name: 'Projects', value: Array.isArray(projects) ? projects.length : 0, icon: FiBriefcase },
          { name: 'Courses', value: Array.isArray(courses) ? courses.length : 0, icon: FiBookOpen },
          { name: 'Students', value: Array.isArray(students) ? students.length : 0, icon: FiUsers },
        ]);

        // Calculate trend data for last 6 months
        const now = new Date();
        const months: any[] = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthName = date.toLocaleString('default', { month: 'short' });
          const start = new Date(date.getFullYear(), date.getMonth(), 1);
          const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
          const count = students.filter((stu: any) => {
            const created = new Date(stu.createdAt);
            return created >= start && created <= end;
          }).length;
          months.push({ month: monthName, students: count });
        }
        setTrendData(months);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="text-gray-800">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex space-x-4">
          <button className="flex items-center bg-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-600 transition-colors">
            <FiPlusCircle />
            Add Course
          </button>
          <button className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-900 transition-colors">
            <FiPlusCircle />
            Add Project
          </button>
        </div>
      </div>

      {/* Summary Cards */}
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
                <p className="text-4xl font-bold text-gray-800 mt-1">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Student Enrollment Trend</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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


export default function AdminPage() {
  const router = useRouter();
  const [activeComponent, setActiveComponent] = useState('Dashboard');

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Users':
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Users</h2>
            <p className="mt-2 text-gray-600">Manage your users here.</p>
          </div>
        );
      case 'Settings':
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
            <p className="mt-2 text-gray-600">Configure your application settings here.</p>
          </div>
        );
      case 'Logo':
        return <LogoSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="bg-gray-900 text-gray-300 w-64 pt-6 pr-6 pb-6 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex items-center mb-10">
            <div className="bg-indigo-500 rounded-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <h1 className="text-xl font-bold ml-3 text-white">Admin Panel</h1>
          </div>
          <ul>
            <li className="mb-4">
              <button
                onClick={() => setActiveComponent('Dashboard')}
                className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${activeComponent === 'Dashboard' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              >
                <DashboardIcon />
                <span className="ml-4">Dashboard</span>
              </button>
            </li>
            <li className="mb-4">
              <button
                onClick={() => setActiveComponent('Users')}
                className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${activeComponent === 'Users' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              >
                <UsersIcon />
                <span className="ml-4">Users</span>
              </button>
            </li>
            <li className="mb-4">
              <button
                onClick={() => setActiveComponent('Settings')}
                className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${activeComponent === 'Settings' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              >
                <SettingsIcon />
                <span className="ml-4">Settings</span>
              </button>
            </li>
            <li className="mb-4">
              <button
                onClick={() => setActiveComponent('Logo')}
                className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${activeComponent === 'Logo' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              >
                <LogoIcon />
                <span className="ml-4">Logo</span>
              </button>
            </li>
          </ul>
        </div>
        <div>
          <button
            className="w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200"
            onClick={handleLogout}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Welcome, Admin!</h1>
          <p className="mt-2 text-gray-600">Here's what's happening with your application today.</p>
        </header>
        <main>
          {renderComponent()}
        </main>
      </div>
    </div>
  );
}