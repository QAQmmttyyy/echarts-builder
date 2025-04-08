"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { chartTemplates } from "@/data/chart-templates";
import { ChartElement, ChartTemplate } from "@/types/chart";
import { calculateDefaultPosition, generateId } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  LineChart,
  PieChart,
  ScatterChart,
  Radar,
  Activity,
  ListPlus,
  LayoutTemplate,
} from "lucide-react";

// 图表图标映射
const chartIcons: Record<string, React.ReactNode> = {
  "bar-chart": <BarChart3 className="h-6 w-6 text-primary" />,
  "line-chart": <LineChart className="h-6 w-6 text-primary" />,
  "pie-chart": <PieChart className="h-6 w-6 text-primary" />,
  "scatter-chart": <ScatterChart className="h-6 w-6 text-primary" />,
  "radar-chart": <Radar className="h-6 w-6 text-primary" />,
  "default": <Activity className="h-6 w-6 text-primary" />,
};

interface ComponentPanelProps {
  onAddChart: (chart: ChartElement) => void;
}

export function ComponentPanel({ onAddChart }: ComponentPanelProps) {
  const handleDragStart = (e: React.DragEvent, chartTemplate: ChartTemplate) => {
    e.dataTransfer.setData("chart-type", chartTemplate.type);
  };

  const handleChartClick = (chartTemplate: ChartTemplate) => {
    // 创建一个新的图表元素
    const newChart: ChartElement = {
      id: generateId(),
      type: chartTemplate.type,
      title: chartTemplate.title,
      position: calculateDefaultPosition(800, 600), // 使用默认的画布尺寸
      options: { ...chartTemplate.defaultOptions },
      data: { ...chartTemplate.defaultData },
    };

    onAddChart(newChart);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-muted/30">
      <div className="py-3 px-4 border-b bg-card">
        <h2 className="text-base font-semibold">图表组件</h2>
        <p className="text-xs text-muted-foreground mt-0.5">拖拽或点击添加到画布</p>
      </div>
      
      <Tabs defaultValue="charts" className="flex-1 overflow-hidden">
        <div className="px-3 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="charts" className="flex items-center gap-1.5 text-xs py-1.5">
              <ListPlus className="h-3.5 w-3.5" />
              <span>图表</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-1.5 text-xs py-1.5">
              <LayoutTemplate className="h-3.5 w-3.5" />
              <span>模板</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="charts" className="h-[calc(100%-48px)] overflow-y-auto p-2">
          <div className="grid grid-cols-1 gap-2">
            {chartTemplates.map((template) => (
              <Card 
                key={template.type} 
                className="cursor-pointer hover:border-primary transition-all hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0"
                draggable
                onDragStart={(e) => handleDragStart(e, template)}
                onClick={() => handleChartClick(template)}
              >
                <div className="flex items-center p-2.5">
                  <div className="flex-shrink-0 mr-3">
                    {chartIcons[template.icon] || chartIcons.default}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{template.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{template.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="h-[calc(100%-48px)] overflow-y-auto p-2">
          <Card className="border-dashed">
            <div className="flex items-center justify-center p-4">
              <div className="flex-shrink-0 mr-3">
                <LayoutTemplate className="h-6 w-6 text-muted-foreground opacity-50" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">暂无可用模板</p>
                <p className="text-xs text-muted-foreground mt-0.5">敬请期待...</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 