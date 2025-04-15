
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Download, ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';

interface DiagramViewerProps {
  title: string;
  svgPath: string;
  description?: string;
}

const DiagramViewer: React.FC<DiagramViewerProps> = ({ title, svgPath, description }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setZoomLevel(1.25);
    } else {
      setZoomLevel(1);
    }
  };

  const downloadSvg = () => {
    const link = document.createElement('a');
    link.href = svgPath;
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className={`mb-8 transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={downloadSvg}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={svgContainerRef}
          className="w-full overflow-auto bg-white rounded-md"
          style={{ 
            minHeight: isFullscreen ? 'calc(100vh - 160px)' : '500px',
            transition: 'all 0.3s ease'
          }}
        >
          <div 
            style={{ 
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left',
              transition: 'transform 0.3s ease'
            }}
          >
            <object 
              data={svgPath} 
              type="image/svg+xml" 
              className="w-full mx-auto" 
              aria-label={`Диаграмма: ${title}`}
            >
              Ваш браузер не поддерживает SVG
            </object>
          </div>
        </div>
        {description && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiagramViewer;
