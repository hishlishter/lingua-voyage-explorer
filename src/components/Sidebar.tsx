
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Book, BookOpen, Brain, Settings, LogOut, Home, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { user, signOut, supabaseInitialized } = useAuth();

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const handleLogout = async () => {
    try {
      console.log('Attempting to sign out user:', user?.id);
      await signOut();
      // We don't need to show toast here as it's already shown in the signOut function
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Ошибка при выходе из системы');
    }
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="sidebar-gradient min-h-screen w-60 flex flex-col py-6 px-4 text-sidebar-foreground">
      <div className="flex justify-center mb-8">
        <Link to="/" className="flex flex-col items-center">
          <div className="relative">
            <h1 className="text-4xl font-display font-bold mb-1">Margo</h1>
            <span className="absolute -top-4 -left-6 text-xl">🌸</span>
            <span className="absolute -top-4 -right-6 text-xl">🌸</span>
          </div>
        </Link>
      </div>

      {!supabaseInitialized && (
        <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-md mb-4 text-xs flex items-center">
          <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
          <span>Режим разработки</span>
        </div>
      )}

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-white/80 text-gray-800 shadow-md font-medium' 
                  : 'hover:bg-white/20'
              }`}
            >
              <Home size={20} />
              <span>Главная</span>
            </Link>
          </li>
          <li>
            <Link
              to="/courses"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/courses') 
                  ? 'bg-white/80 text-gray-800 shadow-md font-medium' 
                  : 'hover:bg-white/20'
              }`}
            >
              <BookOpen size={20} />
              <span>Курсы</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dictionary"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/dictionary') 
                  ? 'bg-white/80 text-gray-800 shadow-md font-medium' 
                  : 'hover:bg-white/20'
              }`}
            >
              <Book size={20} />
              <span>Словарь</span>
            </Link>
          </li>
          <li>
            <Link
              to="/tests"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/tests') 
                  ? 'bg-white/80 text-gray-800 shadow-md font-medium' 
                  : 'hover:bg-white/20'
              }`}
            >
              <Brain size={20} />
              <span>Тесты</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto pt-6 border-t border-white/20">
        <ul className="space-y-2">
          <li>
            <Link
              to="/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/settings') 
                  ? 'bg-white/80 text-gray-800 shadow-md font-medium' 
                  : 'hover:bg-white/20'
              }`}
            >
              <Settings size={20} />
              <span>Настройки</span>
            </Link>
          </li>
          <li>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/20 transition-colors"
              onClick={user ? handleLogout : handleLogin}
            >
              {user ? (
                <>
                  <LogOut size={20} />
                  <span>Выйти</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Войти</span>
                </>
              )}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
