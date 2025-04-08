"use client";

import { useEffect, useRef } from "react";
import { ChartElement } from "@/types/chart";
import * as echarts from "echarts";

interface ChartNodeProps {
  chart: ChartElement;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent, x: number, y: number) => void;
  onDrag: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onResize: (width: number, height: number) => void;
}

export function ChartNode({
  chart,
  isSelected,
  onSelect,
  onDragStart,
  onDrag,
  onDragEnd,
  onResize,
}: ChartNodeProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const resizingRef = useRef<{ direction: string; startX: number; startY: number } | null>(null);

  // 初始化图表
  useEffect(() => {
    if (chartRef.current) {
      // 创建或获取图表实例
      if (!chartInstanceRef.current) {
        chartInstanceRef.current = echarts.init(chartRef.current);
      }
      
      // 设置图表配置
      chartInstanceRef.current.setOption(chart.options);
      
      // 清理函数
      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.dispose();
          chartInstanceRef.current = null;
        }
      };
    }
  }, [chart.options]);

  // 当图表尺寸变化时重新调整
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.resize();
    }
  }, [chart.position.width, chart.position.height]);

  // 处理拖拽开始
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    
    if (!resizingRef.current) {
      // 获取元素的起始位置
      const rect = e.currentTarget.getBoundingClientRect();
      onDragStart(e, rect.left, rect.top);
    }
  };

  // 处理调整大小
  const handleResizeStart = (
    e: React.MouseEvent,
    direction: string
  ) => {
    e.stopPropagation();
    e.preventDefault();
    
    // 记录调整大小的起始状态
    resizingRef.current = {
      direction,
      startX: e.clientX,
      startY: e.clientY,
    };
    
    // 添加鼠标移动和松开事件
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  };

  // 处理调整大小过程中的鼠标移动
  const handleResizeMove = (e: MouseEvent) => {
    if (resizingRef.current) {
      e.preventDefault();
      
      const { direction, startX, startY } = resizingRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = chart.position.width;
      let newHeight = chart.position.height;
      
      // 根据不同方向调整大小
      if (direction.includes("e")) {
        newWidth = Math.max(200, chart.position.width + deltaX);
      }
      if (direction.includes("s")) {
        newHeight = Math.max(150, chart.position.height + deltaY);
      }
      if (direction.includes("w")) {
        const widthChange = -deltaX;
        newWidth = Math.max(200, chart.position.width + widthChange);
      }
      if (direction.includes("n")) {
        const heightChange = -deltaY;
        newHeight = Math.max(150, chart.position.height + heightChange);
      }
      
      // 更新调整大小的起始位置
      resizingRef.current = {
        ...resizingRef.current,
        startX: e.clientX,
        startY: e.clientY,
      };
      
      // 调用父组件的回调函数
      onResize(newWidth, newHeight);
    }
  };

  // 处理调整大小结束
  const handleResizeEnd = () => {
    resizingRef.current = null;
    
    // 移除事件监听器
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleResizeEnd);
  };

  return (
    <div
      className={`absolute bg-card shadow-lg rounded-lg overflow-hidden 
        transition-shadow duration-150 ease-in-out
        ${isSelected ? "ring-2 ring-primary shadow-md" : "hover:shadow-md"}
      `}
      style={{
        left: `${chart.position.x}px`,
        top: `${chart.position.y}px`,
        width: `${chart.position.width}px`,
        height: `${chart.position.height}px`,
        zIndex: isSelected ? 10 : 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      draggable
      onDragStart={handleDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
    >
      {/* 图表标题栏 */}
      <div 
        className="px-3 py-2 font-medium text-sm border-b bg-card/95 backdrop-blur-sm cursor-move flex justify-between items-center"
        draggable
        onDragStart={handleDragStart}
      >
        <span className="truncate">{chart.title}</span>
        
        {/* 展示图表类型 */}
        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary-foreground ml-2 whitespace-nowrap">
          {chart.type}
        </span>
      </div>
      
      {/* 图表内容 */}
      <div 
        ref={chartRef} 
        className="w-full h-[calc(100%-40px)]"
      />
      
      {/* 调整大小的把手 - 只在选中时显示 */}
      {isSelected && (
        <>
          {/* 四个角 */}
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize group"
            onMouseDown={(e) => handleResizeStart(e, "ne")}
          >
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary rounded-tr opacity-0 group-hover:opacity-100" />
          </div>
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize group"
            onMouseDown={(e) => handleResizeStart(e, "nw")}
          >
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary rounded-tl opacity-0 group-hover:opacity-100" />
          </div>
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize group"
            onMouseDown={(e) => handleResizeStart(e, "se")}
          >
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary rounded-br opacity-0 group-hover:opacity-100" />
          </div>
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize group"
            onMouseDown={(e) => handleResizeStart(e, "sw")}
          >
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary rounded-bl opacity-0 group-hover:opacity-100" />
          </div>
          
          {/* 四条边 */}
          <div
            className="absolute top-0 left-1/2 w-8 h-3 -translate-x-1/2 cursor-n-resize group"
            onMouseDown={(e) => handleResizeStart(e, "n")}
          >
            <div className="absolute top-0 left-0 right-0 h-2 border-t-2 border-primary opacity-0 group-hover:opacity-100" />
          </div>
          <div
            className="absolute bottom-0 left-1/2 w-8 h-3 -translate-x-1/2 cursor-s-resize group"
            onMouseDown={(e) => handleResizeStart(e, "s")}
          >
            <div className="absolute bottom-0 left-0 right-0 h-2 border-b-2 border-primary opacity-0 group-hover:opacity-100" />
          </div>
          <div
            className="absolute top-1/2 left-0 h-8 w-3 -translate-y-1/2 cursor-w-resize group"
            onMouseDown={(e) => handleResizeStart(e, "w")}
          >
            <div className="absolute top-0 bottom-0 left-0 w-2 border-l-2 border-primary opacity-0 group-hover:opacity-100" />
          </div>
          <div
            className="absolute top-1/2 right-0 h-8 w-3 -translate-y-1/2 cursor-e-resize group"
            onMouseDown={(e) => handleResizeStart(e, "e")}
          >
            <div className="absolute top-0 bottom-0 right-0 w-2 border-r-2 border-primary opacity-0 group-hover:opacity-100" />
          </div>
        </>
      )}
    </div>
  );
} 