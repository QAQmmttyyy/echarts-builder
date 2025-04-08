"use client";

import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ComponentPanel } from "./component-panel";
import { CanvasArea } from "./canvas-area";
import { ConfigPanel } from "./config-panel";
import { ChartElement } from "@/types/chart";

export function Builder() {
  const [selectedChart, setSelectedChart] = useState<ChartElement | null>(null);
  const [charts, setCharts] = useState<ChartElement[]>([]);

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
      
      {/* 右侧配置面板 */}
      <ResizablePanel 
        defaultSize={22} 
        minSize={20} 
        maxSize={30}
      >
        <ConfigPanel 
          selectedChart={selectedChart} 
          onUpdateChart={handleUpdateChart} 
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
} 