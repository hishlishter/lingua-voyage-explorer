
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface DiagramViewerProps {
  title: string;
  svgPath: string;
  description?: string;
}

const DiagramViewer: React.FC<DiagramViewerProps> = ({ title, svgPath, description }) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-auto">
          <object data={svgPath} type="image/svg+xml" className="w-full" style={{ minHeight: '500px' }}>
            Ваш браузер не поддерживает SVG
          </object>
        </div>
        {description && <p className="mt-4 text-sm text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default DiagramViewer;
