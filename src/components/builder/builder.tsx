"use client";

import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ComponentPanel } from "@/components/builder/component-panel";
import { CanvasArea } from "@/components/builder/canvas-area";
import { ConfigPanel } from "@/components/builder/config-panel";
import { ModernCodeViewer } from "../code/modern-code-viewer";
import { ChartElement } from "@/types/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, Code } from "lucide-react";

export function Builder() {
  const [selectedChart, setSelectedChart] = useState<ChartElement | null>(null);
  const [charts, setCharts] = useState<ChartElement[]>([]);
  const [rightPanelTab, setRightPanelTab] = useState<string>("config");

  const handleAddChart = (chart: ChartElement) => {
    setCharts((prev) => [...prev, chart]);
  };

  const handleSelectChart = (chartId: string) => {
    const chart = charts.find((c) => c.id === chartId);
    setSelectedChart(chart || null);
  };

  const handleUpdateChart = (updatedChart: ChartElement) => {
    setCharts((prev) =>
      prev.map((chart) => (chart.id === updatedChart.id ? updatedChart : chart))
    );
    
    if (selectedChart?.id === updatedChart.id) {
      setSelectedChart(updatedChart);
    }
  };

  return (
    <ResizablePanelGroup 
      direction="horizontal" 
      className="h-full rounded-lg"
    >
      {/* 左侧组件面板 */}
      <ResizablePanel 
        defaultSize={18} 
        minSize={16} 
        maxSize={25}
        className="border-r"
      >
        <ComponentPanel onAddChart={handleAddChart} />
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      {/* 中间画布区域 */}
      <ResizablePanel 
        defaultSize={60}
        minSize={50}
        className="border-r"
      >
        <CanvasArea 
          charts={charts} 
          onSelectChart={handleSelectChart} 
          selectedChartId={selectedChart?.id} 
          onUpdateChart={handleUpdateChart}
        />
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      {/* 右侧面板(配置和代码) */}
      <ResizablePanel 
        defaultSize={22} 
        minSize={20} 
        maxSize={30}
        className="flex flex-col"
      >
        <div className="border-b bg-card px-4 py-2">
          <Tabs 
            defaultValue="config" 
            value={rightPanelTab} 
            onValueChange={setRightPanelTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="config" className="flex items-center gap-1.5 text-xs">
                <Settings2 className="h-3.5 w-3.5" />
                <span>配置</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-1.5 text-xs">
                <Code className="h-3.5 w-3.5" />
                <span>代码</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 overflow-hidden">
          {rightPanelTab === "config" ? (
            <ConfigPanel 
              selectedChart={selectedChart} 
              onUpdateChart={handleUpdateChart} 
            />
          ) : (
            <ModernCodeViewer chart={selectedChart} />
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
} 