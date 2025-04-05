
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  // Wrap the hook in a check to ensure it's only called in a component context
  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    console.warn('useNavigate hook failed, navigation may not work');
    // Provide a fallback function that does nothing
    navigate = () => {};
  }
  
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoForward = () => {
    navigate(1);
  };

  return (
    <div className="flex items-center justify-between py-4 px-6 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-gray-100"
          onClick={handleGoBack}
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-gray-100"
          onClick={handleGoForward}
          aria-label="Go forward"
        >
          <ChevronRight size={20} />
        </Button>
        {title && <h1 className="text-xl font-semibold ml-2">{title}</h1>}
      </div>
    </div>
  );
};

export default Header;
