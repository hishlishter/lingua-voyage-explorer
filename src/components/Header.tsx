
import React, { useState } from 'react';
import { Search, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ title, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoForward = () => {
    navigate(1);
  };

  return (
    <div className="flex items-center justify-between py-4 px-6">
      <div className="flex items-center gap-4">
        <button 
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={handleGoBack}
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          className="p-2 rounded-full hover:bg-gray-100"
          onClick={handleGoForward}
        >
          <ChevronRight size={20} />
        </button>
        {title && <h1 className="text-xl font-semibold ml-2">{title}</h1>}
      </div>

      <div className="w-96">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Поиск"
            className="w-full pl-10 pr-4 py-2 rounded-full border-0 bg-gray-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div>
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </div>
  );
};

export default Header;
