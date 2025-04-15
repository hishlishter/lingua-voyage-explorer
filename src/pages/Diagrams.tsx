
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DiagramViewer from '@/components/DiagramViewer';

const Diagrams: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Диаграммы проекта MarGO</h1>
      
      <Tabs defaultValue="conceptual">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conceptual">Концептуальная модель</TabsTrigger>
          <TabsTrigger value="usecase">Use Case</TabsTrigger>
          <TabsTrigger value="bpmn">BPMN</TabsTrigger>
          <TabsTrigger value="dfd">DFD</TabsTrigger>
        </TabsList>
        
        <TabsContent value="conceptual">
          <DiagramViewer 
            title="Концептуальная модель предметной области" 
            svgPath="/src/diagrams/ConceptualModel.svg"
            description="Диаграмма показывает основные сущности системы MarGO и связи между ними. Центральным элементом является пользователь, который взаимодействует с уроками, словарем и тестами."
          />
        </TabsContent>
        
        <TabsContent value="usecase">
          <DiagramViewer 
            title="Диаграмма вариантов использования (Use Case)" 
            svgPath="/src/diagrams/UseCase.svg"
            description="Диаграмма демонстрирует различные варианты использования системы MarGO разными типами пользователей: учеником, преподавателем и администратором."
          />
        </TabsContent>
        
        <TabsContent value="bpmn">
          <DiagramViewer 
            title="Диаграмма бизнес-процессов (BPMN)" 
            svgPath="/src/diagrams/BPMN.svg"
            description="Диаграмма отображает основной бизнес-процесс изучения языка в системе MarGO, включая регистрацию, выбор курса, прохождение уроков и тестирование."
          />
        </TabsContent>
        
        <TabsContent value="dfd">
          <DiagramViewer 
            title="Диаграмма потоков данных (DFD)" 
            svgPath="/src/diagrams/DFD.svg"
            description="Диаграмма представляет потоки данных между пользователями, функциональными компонентами и хранилищами данных в системе MarGO на концептуальном и логическом уровнях."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Diagrams;
