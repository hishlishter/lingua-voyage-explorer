
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SearchResult {
  type: string;
  id: string;
  title: string;
  subtitle: string;
  category: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isSearching: boolean;
  onClear: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  isSearching, 
  onClear 
}) => {
  if (isSearching) {
    return <div className="text-center py-12">Поиск...</div>;
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Результаты поиска</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((result) => (
          <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">
                {result.category}
              </div>
              <h3 className="font-medium text-lg">{result.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">
                {result.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <button 
        className="text-primary hover:underline"
        onClick={onClear}
      >
        Вернуться на главную
      </button>
    </div>
  );
};

export default SearchResults;
