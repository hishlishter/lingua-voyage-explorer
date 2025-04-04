
import React from 'react';
import { Bell, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMobileDevice } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onSearch?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { user, profile, signOut } = useAuth();
  const isMobile = useMobileDevice();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b py-3 px-6">
      <div className="flex items-center justify-between">
        {/* Mobile menu trigger */}
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 max-w-[250px]">
              <div className="sidebar-gradient h-full w-full flex flex-col text-slate-800">
                <div className="flex items-center justify-between p-4">
                  <h2 className="font-semibold text-xl">Меню</h2>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-slate-800 hover:bg-purple-300/20">
                      <X size={20} />
                    </Button>
                  </SheetTrigger>
                </div>
                
                <nav className="mt-4 flex-1">
                  {/* Mobile navigation items here */}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        )}
        
        {/* Search bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Button 
              variant="outline" 
              className="w-full justify-start text-muted-foreground font-normal"
              onClick={onSearch}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Поиск...</span>
            </Button>
          </div>
        </div>
        
        {/* User menu */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell size={18} />
            <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"></span>
          </Button>
          
          {user && profile ? (
            <Avatar 
              className="h-8 w-8 cursor-pointer" 
              onClick={() => navigate('/settings')}
            >
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
            </Avatar>
          ) : (
            <Button 
              size="sm" 
              variant="default"
              onClick={() => navigate('/auth')}
            >
              Войти
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
