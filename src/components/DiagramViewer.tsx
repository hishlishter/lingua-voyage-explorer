
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface DiagramViewerProps {
  title: string;
  svgPath: string;
  description?: string;
}

const DiagramViewer: React.FC<DiagramViewerProps> = ({ title, svgPath, description }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className={`w-full overflow-auto transition-all duration-300 ${isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'}`}
          onClick={toggleZoom}
        >
          <object 
            data={svgPath} 
            type="image/svg+xml" 
            className="w-full mx-auto" 
            style={{ minHeight: '500px' }}
          >
            Ваш браузер не поддерживает SVG
          </object>
        </div>
        {description && <p className="mt-4 text-sm text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default DiagramViewer;
