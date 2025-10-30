'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DashboardIcon from '@/components/icons/DashboardIcon';
import UsersIcon from '@/components/icons/UsersIcon';
import SettingsIcon from '@/components/icons/SettingsIcon';
import LogoIcon from '@/components/icons/LogoIcon';
import { FiX } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    // In a real app, you'd probably want to redirect to the login page
    // using the router, but for now, we'll just remove the session storage.
    window.location.href = '/login';
  };

  return (
    // The sidebar is positioned fixed on mobile and slides in from the left.
    // On medium screens and larger, it becomes a static part of the layout.
    <div className={`bg-gray-900 text-gray-300 w-64 pt-6 pr-6 pb-6 flex flex-col justify-between shadow-lg
                    fixed md:static md:translate-x-0 h-full z-40
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div>
        <div className="flex items-center justify-between mb-10 pl-4">
          <div className="flex items-center">
            <div className="bg-indigo-500 rounded-md p-1">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <h1 className="text-xl font-bold ml-3 text-white">Admin Panel</h1>
          </div>
          {/* Close button for mobile, hidden on medium screens and larger */}
          <button className="md:hidden text-gray-400 hover:text-white" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>
        <ul>
          {/* When a link is clicked, close the sidebar on mobile */}
          <li className="mb-4">
            <Link href="/admin" onClick={onClose} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${pathname === '/admin' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <DashboardIcon />
              <span className="ml-4">Dashboard</span>
            </Link>
          </li>


          <li className="mb-4">
            <Link href="/admin/logo" onClick={onClose} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${pathname === '/admin/logo' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <LogoIcon />
              <span className="ml-4">Logo</span>
            </Link>
          </li>
           <li className="mb-4">
            <Link href="/admin/hero" onClick={onClose} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${pathname === '/admin/hero' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <LogoIcon />
              <span className="ml-4">Hero</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/vision" onClick={onClose} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${pathname === '/admin/vision' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <SettingsIcon />
              <span className="ml-4">Vision</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/mission" onClick={onClose} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${pathname === '/admin/mission' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <SettingsIcon />
              <span className="ml-4">Mission</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/services" onClick={onClose} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${pathname === '/admin/services' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <SettingsIcon />
              <span className="ml-4">Services</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/courses" onClick={onClose} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${pathname === '/admin/courses' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <SettingsIcon />
              <span className="ml-4">Courses</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/projects" onClick={onClose} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${pathname === '/admin/projects' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <SettingsIcon />
              <span className="ml-4">Projects</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/testimonials" onClick={onClose} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${pathname === '/admin/testimonials' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <UsersIcon />
              <span className="ml-4">Testimonials</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/contact" onClick={onClose} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${pathname === '/admin/contact' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <UsersIcon />
              <span className="ml-4">Contact Us</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/admin/students" onClick={onClose} className={`w-full flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${pathname === '/admin/students' ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <UsersIcon />
              <span className="ml-4">Students</span>
            </Link>
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
  );
};

export default Sidebar;
