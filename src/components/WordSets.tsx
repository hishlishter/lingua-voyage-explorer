
import React from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

interface WordSetProps {
  title: string;
  icon: string;
  isFavorite?: boolean;
  gradientClass: string;
}

const WordSetCard: React.FC<WordSetProps> = ({ 
  title, 
  icon, 
  isFavorite = false,
  gradientClass 
}) => {
  const [favorite, setFavorite] = React.useState(isFavorite);
  
  return (
    <Card className={cn("overflow-hidden h-36 border-none shadow-md", gradientClass)}>
      <CardContent className="p-0 h-full">
        <div className="p-4 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="text-4xl mb-2">{icon}</div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-white/30 hover:bg-white/50 text-white"
              onClick={() => setFavorite(!favorite)}
            >
              <Heart size={16} className={cn(favorite ? "fill-white" : "")} />
            </Button>
          </div>
          <h3 className="text-white font-medium text-lg">{title}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

interface WordSetsProps {
  title: string;
}

const WordSets: React.FC<WordSetsProps> = ({ title }) => {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <WordSetCard 
          title="Английские идиомы" 
          icon="📚" 
          gradientClass="card-gradient-pink"
          isFavorite={true}
        />
        <WordSetCard 
          title="Страны и города" 
          icon="🌎" 
          gradientClass="card-gradient-purple"
          isFavorite={true}
        />
        <WordSetCard 
          title="Который час?" 
          icon="🕒" 
          gradientClass="card-gradient-blue" 
        />
      </div>
    </div>
  );
};

export default WordSets;
