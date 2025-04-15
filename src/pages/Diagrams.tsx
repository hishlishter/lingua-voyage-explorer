
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DiagramViewer from '@/components/DiagramViewer';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Diagrams: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="mr-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              На главную
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-center flex-1">Диаграммы проекта MarGO</h1>
        </div>
        
        <div className="mb-6 p-4 bg-muted rounded-md">
          <p>
            Эти диаграммы представляют собой концептуальную модель и архитектуру образовательного веб-приложения MarGO для изучения английского языка. 
            Они иллюстрируют основные сущности системы, бизнес-процессы и потоки данных.
          </p>
        </div>
        
        <Tabs defaultValue="conceptual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="conceptual">Концептуальная модель</TabsTrigger>
            <TabsTrigger value="domain">Предметная область</TabsTrigger>
            <TabsTrigger value="usecase">Use Case</TabsTrigger>
            <TabsTrigger value="bpmn">BPMN</TabsTrigger>
            <TabsTrigger value="dfd">DFD</TabsTrigger>
          </TabsList>
          
          <TabsContent value="conceptual">
            <DiagramViewer 
              title="Концептуальная модель предметной области" 
              svgPath="/src/diagrams/ConceptualModel.svg"
              description="Диаграмма показывает основные сущности системы MarGO и связи между ними. Центральным элементом является пользователь, который взаимодействует с уроками, словарем и тестами. Модель отражает структуру данных и основные объекты, с которыми работает система."
            />
          </TabsContent>
          
          <TabsContent value="domain">
            <DiagramViewer 
              title="Концептуальная модель предметной области (расширенная)" 
              svgPath="/src/diagrams/ConceptualDomain.svg"
              description="Расширенная концептуальная модель предметной области детально показывает взаимосвязи между различными аспектами обучения: учеником, учебными материалами, тестированием, прогрессом и адаптивным обучением. Эта диаграмма демонстрирует информационные объекты и их атрибуты в контексте образовательного процесса."
            />
          </TabsContent>
          
          <TabsContent value="usecase">
            <DiagramViewer 
              title="Диаграмма вариантов использования (Use Case)" 
              svgPath="/src/diagrams/UseCase.svg"
              description="Диаграмма демонстрирует различные варианты использования системы MarGO разными типами пользователей: учеником, преподавателем и администратором. На ней отображены основные функции системы и их взаимосвязи с пользователями, что позволяет понять, кто и какие действия может выполнять в системе."
            />
          </TabsContent>
          
          <TabsContent value="bpmn">
            <DiagramViewer 
              title="Диаграмма бизнес-процессов (BPMN)" 
              svgPath="/src/diagrams/BPMN.svg"
              description="Диаграмма отображает основной бизнес-процесс изучения языка в системе MarGO, включая регистрацию, выбор курса, прохождение уроков и тестирование. BPMN позволяет визуализировать последовательность действий, точки принятия решений и потоки данных в рамках процесса обучения."
            />
          </TabsContent>
          
          <TabsContent value="dfd">
            <DiagramViewer 
              title="Диаграмма потоков данных (DFD)" 
              svgPath="/src/diagrams/DFD.svg"
              description="Диаграмма представляет потоки данных между пользователями, функциональными компонентами и хранилищами данных в системе MarGO на концептуальном и логическом уровнях. DFD помогает понять, как информация перемещается между различными частями системы и какие трансформации она претерпевает."
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Diagrams;
