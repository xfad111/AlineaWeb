import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Plus, 
  Users, 
  Settings,
  LayoutDashboard,
  FileBarChart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  
  if (!currentUser) return null;
  
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-neutral-200">
      <div className="h-16 flex items-center justify-center border-b border-neutral-200">
        <h2 className="text-xl font-bold text-primary-700">Sistem Pelaporan</h2>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
        <nav className="flex-1 px-2 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-50'
              }`
            }
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </NavLink>
          
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-50'
              }`
            }
          >
            <FileText className="mr-3 h-5 w-5" />
            Daftar Laporan
          </NavLink>
          
          <NavLink
            to="/reports/create"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-50'
              }`
            }
          >
            <Plus className="mr-3 h-5 w-5" />
            Buat Laporan
          </NavLink>
          
          {isAdmin() && (
            <>
              <NavLink
                to="/reports/summary"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`
                }
              >
                <FileBarChart className="mr-3 h-5 w-5" />
                Rekap Laporan
              </NavLink>
              
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`
                }
              >
                <Users className="mr-3 h-5 w-5" />
                Pengguna
              </NavLink>
            </>
          )}
        </nav>
      </div>
      
      <div className="flex-shrink-0 flex border-t border-neutral-200 p-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center">
            <span className="text-sm font-medium text-primary-700">
              {currentUser.displayName.charAt(0)}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral-700">{currentUser.displayName}</p>
            <p className="text-xs text-neutral-500">{currentUser.division}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;