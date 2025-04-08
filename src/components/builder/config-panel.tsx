"use client";

import { useState, useEffect } from "react";
import { ChartElement } from "@/types/chart";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings2, Database, Paintbrush, Type, Move, BoxSelect, Maximize, Layers } from "lucide-react";

interface ConfigPanelProps {
  selectedChart: ChartElement | null;
  onUpdateChart: (chart: ChartElement) => void;
}

export function ConfigPanel({ selectedChart, onUpdateChart }: ConfigPanelProps) {
  // 对配置进行存储和跟踪，避免直接修改原始配置
  const [titleInput, setTitleInput] = useState("");

  // 当选中的图表变化时，更新表单状态
  useEffect(() => {
    if (selectedChart) {
      setTitleInput(selectedChart.title);
    }
  }, [selectedChart]);

  // 更新图表标题
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInput(e.target.value);
  };

  // 应用标题更改
  const handleTitleUpdate = () => {
    if (selectedChart) {
      // 更新标题
      const updatedChart = {
        ...selectedChart,
        title: titleInput,
        options: {
          ...selectedChart.options,
          title: {
            ...selectedChart.options.title,
            text: titleInput,
          },
        },
      };
      onUpdateChart(updatedChart);
    }
  };

  // 更新图表尺寸
  const handleSizeChange = (dimension: "width" | "height", value: number) => {
    if (selectedChart) {
      const updatedChart = {
        ...selectedChart,
        position: {
          ...selectedChart.position,
          [dimension]: value,
        },
      };
      onUpdateChart(updatedChart);
    }
  };

  // 更新图表位置
  const handlePositionChange = (axis: "x" | "y", value: number) => {
    if (selectedChart) {
      const updatedChart = {
        ...selectedChart,
        position: {
          ...selectedChart.position,
          [axis]: value,
        },
      };
      onUpdateChart(updatedChart);
    }
  };

  // 处理按键输入更新值
  const handleInputChange = (type: "width" | "height" | "x" | "y", value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      if (type === "width" || type === "height") {
        handleSizeChange(type, numValue);
      } else {
        handlePositionChange(type, numValue);
      }
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-muted/30">
      <div className="py-3.5 px-4 border-b bg-card">
        <h2 className="text-base font-semibold">配置面板</h2>
        {selectedChart ? (
          <p className="text-xs text-muted-foreground mt-1">编辑 "{selectedChart.title}" 属性</p>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">选择一个图表进行配置</p>
        )}
      </div>

      {selectedChart ? (
        <Tabs defaultValue="basic" className="flex-1 overflow-hidden">
          <div className="px-3 pt-2.5">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="flex items-center gap-1.5 text-xs py-1.5">
                <Settings2 className="h-3.5 w-3.5" />
                <span>基础</span>
              </TabsTrigger>
              <TabsTrigger value="style" className="flex items-center gap-1.5 text-xs py-1.5">
                <Paintbrush className="h-3.5 w-3.5" />
                <span>样式</span>
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-1.5 text-xs py-1.5">
                <Database className="h-3.5 w-3.5" />
                <span>数据</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <TabsContent value="basic" className="mt-0 space-y-3">
              {/* 标题配置 */}
              <div className="bg-card rounded-md border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Type className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-medium">标题与描述</h3>
                </div>
                
                <div>
                  <div className="grid grid-cols-[2fr,1fr] gap-2 items-start">
                    <Input
                      value={titleInput}
                      onChange={handleTitleChange}
                      placeholder="输入图表标题"
                      className="h-8 text-xs"
                    />
                    <Button 
                      onClick={handleTitleUpdate} 
                      size="sm"
                      variant="secondary"
                      className="h-8 px-2 text-xs"
                    >
                      应用
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* 尺寸与位置 */}
              <div className="bg-card rounded-md border p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Maximize className="h-4 w-4 text-primary" />
                    <h3 className="text-xs font-medium">尺寸与位置</h3>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="text-xs text-muted-foreground">{selectedChart.position.width}×{selectedChart.position.height}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {/* 宽度控制 */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs text-muted-foreground">宽度</label>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          value={selectedChart.position.width}
                          onChange={(e) => handleInputChange("width", e.target.value)}
                          className="h-6 w-14 text-xs text-right py-0 px-1.5"
                        />
                        <span className="text-xs text-muted-foreground ml-1">px</span>
                      </div>
                    </div>
                    <Slider
                      value={[selectedChart.position.width]}
                      min={200}
                      max={1000}
                      step={10}
                      onValueChange={(values) => handleSizeChange("width", values[0])}
                      className="py-1.5"
                    />
                  </div>
                  
                  {/* 高度控制 */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs text-muted-foreground">高度</label>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          value={selectedChart.position.height}
                          onChange={(e) => handleInputChange("height", e.target.value)}
                          className="h-6 w-14 text-xs text-right py-0 px-1.5"
                        />
                        <span className="text-xs text-muted-foreground ml-1">px</span>
                      </div>
                    </div>
                    <Slider
                      value={[selectedChart.position.height]}
                      min={150}
                      max={800}
                      step={10}
                      onValueChange={(values) => handleSizeChange("height", values[0])}
                      className="py-1.5"
                    />
                  </div>
                  
                  {/* X轴位置控制 */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs text-muted-foreground">X轴位置</label>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          value={selectedChart.position.x}
                          onChange={(e) => handleInputChange("x", e.target.value)}
                          className="h-6 w-14 text-xs text-right py-0 px-1.5"
                        />
                        <span className="text-xs text-muted-foreground ml-1">px</span>
                      </div>
                    </div>
                    <Slider
                      value={[selectedChart.position.x]}
                      min={0}
                      max={1000}
                      step={10}
                      onValueChange={(values) => handlePositionChange("x", values[0])}
                      className="py-1.5"
                    />
                  </div>
                  
                  {/* Y轴位置控制 */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs text-muted-foreground">Y轴位置</label>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          value={selectedChart.position.y}
                          onChange={(e) => handleInputChange("y", e.target.value)}
                          className="h-6 w-14 text-xs text-right py-0 px-1.5"
                        />
                        <span className="text-xs text-muted-foreground ml-1">px</span>
                      </div>
                    </div>
                    <Slider
                      value={[selectedChart.position.y]}
                      min={0}
                      max={1000}
                      step={10}
                      onValueChange={(values) => handlePositionChange("y", values[0])}
                      className="py-1.5"
                    />
                  </div>
                </div>
              </div>
              
              {/* 图层设置 */}
              <div className="bg-card rounded-md border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-medium">图层</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    上移图层
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    下移图层
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="style" className="mt-0">
              <div className="bg-card rounded-md border p-5 text-center">
                <Paintbrush className="h-8 w-8 mx-auto mb-2.5 text-muted-foreground opacity-50" />
                <p className="text-xs text-muted-foreground mb-1.5">样式编辑功能开发中</p>
                <p className="text-xs text-muted-foreground">即将推出更多自定义样式选项...</p>
              </div>
            </TabsContent>

            <TabsContent value="data" className="mt-0">
              <div className="bg-card rounded-md border p-5 text-center">
                <Database className="h-8 w-8 mx-auto mb-2.5 text-muted-foreground opacity-50" />
                <p className="text-xs text-muted-foreground mb-1.5">数据编辑功能开发中</p>
                <p className="text-xs text-muted-foreground">即将推出数据导入和编辑功能...</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        <div className="flex flex-1 items-center justify-center p-5">
          <div className="bg-card rounded-lg border border-dashed p-6 text-center max-w-xs">
            <Settings2 className="h-8 w-8 mx-auto mb-2.5 text-muted-foreground opacity-50" />
            <h3 className="text-sm font-medium mb-1.5">未选择图表</h3>
            <p className="text-xs text-muted-foreground">
              请从画布中选择一个图表元素进行配置
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 