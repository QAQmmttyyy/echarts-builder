"use client";

import { useRef, useState, useEffect } from "react";
import { ChartElement } from "@/types/chart";
import { ChartNode } from "./chart-node";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { generateId } from "@/lib/utils";
import { chartTemplates } from "@/data/chart-templates";
import { Separator } from "@/components/ui/separator";

interface CanvasAreaProps {
  charts: ChartElement[];
  selectedChartId: string | undefined;
  onSelectChart: (chartId: string) => void;
  onUpdateChart: (chart: ChartElement) => void;
}

export function CanvasArea({
  charts,
  selectedChartId,
  onSelectChart,
  onUpdateChart,
}: CanvasAreaProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(100);

  // 计算并更新画布尺寸
  useEffect(() => {
    if (canvasRef.current) {
      const updateSize = () => {
        const { clientWidth, clientHeight } = canvasRef.current!;
        setCanvasSize({ width: clientWidth, height: clientHeight });
      };

      updateSize();
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);

  // 处理图表拖动
  const handleChartDragStart = (
    e: React.DragEvent,
    chartId: string,
    initialX: number,
    initialY: number
  ) => {
    e.stopPropagation();
    onSelectChart(chartId);
    setIsDragging(true);
    
    // 计算鼠标位置与图表左上角的偏移量
    const chart = charts.find((c) => c.id === chartId);
    if (chart) {
      const offsetX = e.clientX - initialX;
      const offsetY = e.clientY - initialY;
      setDragOffset({ x: offsetX, y: offsetY });
    }
  };

  // 处理图表拖动中
  const handleChartDrag = (e: React.DragEvent, chartId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isDragging) {
      const chart = charts.find((c) => c.id === chartId);
      if (chart) {
        // 获取鼠标相对于画布的位置
        const canvasRect = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - canvasRect.left - dragOffset.x;
        const y = e.clientY - canvasRect.top - dragOffset.y;
        
        // 更新图表位置
        const updatedChart = {
          ...chart,
          position: {
            ...chart.position,
            x: Math.max(0, x),
            y: Math.max(0, y),
          },
        };
        
        onUpdateChart(updatedChart);
      }
    }
  };

  // 处理图表拖动结束
  const handleChartDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // 处理画布单击，用于取消选择图表
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('bg-grid-pattern')) {
      // 只有当点击的是画布本身时才取消选择
      onSelectChart("");
    }
  };

  // 处理画布拖放，用于接收从组件面板拖拽的图表
  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const chartType = e.dataTransfer.getData("chart-type");
    if (chartType) {
      const canvasRect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;
      
      // 查找拖拽的图表类型对应的模板
      const chartTemplate = chartTemplates.find((t) => t.type === chartType);
      if (chartTemplate) {
        // 创建新图表并传递给父组件 - 使用深克隆方式
        const newChart: ChartElement = {
          id: generateId(),
          type: chartTemplate.type,
          title: chartTemplate.title,
          position: {
            x: Math.max(0, x - 200), // 放置在鼠标位置，居中
            y: Math.max(0, y - 150),
            width: 400,
            height: 300,
          },
          options: JSON.parse(JSON.stringify(chartTemplate.defaultOptions)),
          data: JSON.parse(JSON.stringify(chartTemplate.defaultData)),
        };
        
        // 调用父组件传递的添加图表方法
        onUpdateChart(newChart);
      }
    }
  };

  // 删除选中的图表
  const handleDeleteChart = () => {
    if (selectedChartId) {
      // 使用一个新的没有选中图表的数组更新父组件
      const updatedCharts = charts.filter(chart => chart.id !== selectedChartId);
      // 更新每一个剩余的图表
      updatedCharts.forEach(chart => onUpdateChart(chart));
      // 取消选择
      onSelectChart("");
    }
  };

  // 缩放控制
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleZoomReset = () => {
    setZoom(100);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b p-4 flex justify-between items-center bg-card">
        <h2 className="text-lg font-semibold">画布</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-1">{zoom}%</span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            className="h-8 w-8"
            disabled={zoom <= 50}
          >
            <ZoomOut className="h-4 w-4" />
            <span className="sr-only">缩小</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomReset}
            className="h-8 w-8"
          >
            <Maximize className="h-4 w-4" />
            <span className="sr-only">重置缩放</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            className="h-8 w-8"
            disabled={zoom >= 150}
          >
            <ZoomIn className="h-4 w-4" />
            <span className="sr-only">放大</span>
          </Button>
          
          {selectedChartId && (
            <>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button
                variant="outline"
                size="icon"
                onClick={handleDeleteChart}
                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">删除图表</span>
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="relative bg-muted/10 flex-1 overflow-auto">
        <div
          ref={canvasRef}
          className="absolute inset-0 min-h-full min-w-full"
          onClick={handleCanvasClick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleCanvasDrop}
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top left',
            width: `${zoom <= 100 ? 100 : (10000 / zoom)}%`,
            height: `${zoom <= 100 ? 100 : (10000 / zoom)}%`
          }}
        >
          {/* 网格背景 */}
          <div className="absolute inset-0 bg-grid-pattern" />
          
          {/* 图表组件 */}
          {charts.map((chart) => (
            <ChartNode
              key={chart.id}
              chart={chart}
              isSelected={chart.id === selectedChartId}
              onSelect={() => onSelectChart(chart.id)}
              onDragStart={(e, x, y) => handleChartDragStart(e, chart.id, x, y)}
              onDrag={(e) => handleChartDrag(e, chart.id)}
              onDragEnd={handleChartDragEnd}
              onResize={(width, height) => {
                const updatedChart = {
                  ...chart,
                  position: {
                    ...chart.position,
                    width,
                    height,
                  },
                };
                onUpdateChart(updatedChart);
              }}
            />
          ))}
        </div>
        
        {/* 空画布提示 */}
        {charts.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="bg-card p-8 rounded-lg shadow-sm border border-dashed text-center max-w-md">
              <PlusCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">画布为空</h3>
              <p className="text-muted-foreground mb-4">从左侧拖拽图表组件或点击添加到此处</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 