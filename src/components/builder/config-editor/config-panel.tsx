"use client";

import React, { useState } from "react";
import { ChartElement } from "@/types/chart";
import { ConfigTree } from "./config-tree";
import { get, set, unset } from "lodash-es";
import { Settings2, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getEChartsDefaultConfig } from "./config-tree"; // 导入配置获取函数

interface ConfigPanelProps {
  selectedChart: ChartElement | null;
  onUpdateChart: (chart: ChartElement) => void;
}

// 添加新配置项对话框
function AddTopLevelPropertyDialog({
  onAdd,
  suggestedKeys = [],
}: {
  onAdd: (key: string, value: any) => void;
  suggestedKeys?: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState("");
  
  const handleAdd = () => {
    if (!key.trim()) return;
    
    // 根据配置项名称获取默认类型和值
    const { type, value } = getEChartsDefaultConfig(key.trim());
    
    onAdd(key, value);
    setKey("");
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 text-xs"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          添加配置项
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加新配置项</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium">配置项键名</label>
            <Input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="输入配置项键名"
              className="h-8 text-xs"
              autoComplete="off"
            />
            {suggestedKeys.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {suggestedKeys.map((suggestedKey) => (
                  <Button
                    key={suggestedKey}
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setKey(suggestedKey)}
                  >
                    {suggestedKey}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            根据 ECharts 的配置项名称，将自动确定其值类型。例如，添加 "title" 将创建对象类型，而 "series" 将创建数组类型。
          </p>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            size="sm"
            onClick={handleAdd}
            disabled={!key.trim()}
          >
            添加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EchartsConfigPanel({ selectedChart, onUpdateChart }: ConfigPanelProps) {
  // 建议的顶级配置项
  const suggestedTopLevelKeys = [
    // 核心配置
    'title', 'legend', 'grid', 'xAxis', 'yAxis', 'series',
    'tooltip', 'toolbox', 'dataZoom', 'visualMap', 'color',
    
    // 坐标系配置
    'radar', 'radiusAxis', 'angleAxis', 'polar', 'geo', 'dataset',
    
    // 交互配置
    'axisPointer', 'brush', 'parallel', 'parallelAxis', 'singleAxis',
    
    // 其他配置
    'timeline', 'graphic', 'calendar', 'aria', 'textStyle', 'animation'
  ];

  // 如果没有选中的图表，显示空状态
  if (!selectedChart) {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-background">
        <div className="py-3.5 px-4 border-b bg-card">
          <h2 className="text-base font-semibold">配置面板</h2>
          <p className="text-xs text-muted-foreground mt-1">选择一个图表进行配置</p>
        </div>
        <div className="flex flex-1 items-center justify-center p-5">
          <div className="bg-card/50 rounded-lg border border-dashed p-6 text-center max-w-xs">
            <Settings2 className="h-8 w-8 mx-auto mb-2.5 text-muted-foreground opacity-50" />
            <h3 className="text-sm font-medium mb-1.5">未选择图表</h3>
            <p className="text-xs text-muted-foreground">
              请从画布中选择一个图表元素进行配置
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 处理配置项变更
  const handleConfigChange = (path: string, value: any) => {
    if (selectedChart) {
      const newOptions = { ...selectedChart.options };
      
      if (value === undefined) {
        // 删除属性
        unset(newOptions, path);
      } else {
        // 设置属性
        set(newOptions, path, value);
      }
      
      const updatedChart = {
        ...selectedChart,
        options: newOptions
      };
      
      onUpdateChart(updatedChart);
    }
  };

  // 处理添加新配置项
  const handleAddProperty = (key: string, value: any) => {
    handleConfigChange(key, value);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <div className="py-3.5 px-4 border-b bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">ECharts 配置</h2>
            <p className="text-xs text-muted-foreground mt-1">
              编辑 &quot;{selectedChart.title}&quot; 的配置项
            </p>
          </div>
          <AddTopLevelPropertyDialog 
            onAdd={handleAddProperty}
            suggestedKeys={suggestedTopLevelKeys}
          />
        </div>
      </div>

      <ScrollArea className="h-1 flex-1">
        <div className="p-4">
          <ConfigTree
            data={selectedChart.options || {}}
            onChange={handleConfigChange}
            suggestedKeys={suggestedTopLevelKeys}
            hideAddButton={true}
          />
        </div>
      </ScrollArea>
    </div>
  );
} 