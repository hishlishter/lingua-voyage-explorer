
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, BookOpen, Calendar, Settings, LogOut, Home } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path;
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
              to="/lessons"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/lessons') 
                  ? 'bg-white/80 text-gray-800 shadow-md font-medium' 
                  : 'hover:bg-white/20'
              }`}
            >
              <Calendar size={20} />
              <span>Доступные уроки</span>
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
            >
              <LogOut size={20} />
              <span>Выйти</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
