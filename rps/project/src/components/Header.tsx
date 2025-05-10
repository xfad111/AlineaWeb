import React from 'react';
import { Menu, X, Bell, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="text-neutral-500 hover:text-neutral-700 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
          
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-primary-700">
              Alinea.MMTC
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="p-1 text-neutral-500 hover:text-neutral-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Bell className="h-5 w-5" />
            </button>
            
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-700" />
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {currentUser?.displayName}
                </span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-10 animate-fade-in">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium">{currentUser?.displayName}</p>
                    <p className="text-xs text-neutral-500">{currentUser?.division}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;