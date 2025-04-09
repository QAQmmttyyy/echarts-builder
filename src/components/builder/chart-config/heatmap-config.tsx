"use client";

import { useState, useEffect } from "react";
import { ChartElement } from "@/types/chart";
import { HeatmapChartOptions } from "@/types/chart-options";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Grid, 
  Axis3D,
  Palette
} from "lucide-react";
import { BaseConfigPanel } from "./base-config";

interface HeatmapConfigPanelProps {
  chart: ChartElement;
  onUpdateChart: (chart: ChartElement) => void;
}

export function HeatmapConfigPanel({ chart, onUpdateChart }: HeatmapConfigPanelProps) {
  // 视觉映射配置
  const [visualMapMin, setVisualMapMin] = useState<number>(0);
  const [visualMapMax, setVisualMapMax] = useState<number>(100);
  const [visualMapCalculable, setVisualMapCalculable] = useState<boolean>(true);
  const [visualMapOrient, setVisualMapOrient] = useState<'horizontal' | 'vertical'>('vertical');
  const [visualMapLeft, setVisualMapLeft] = useState<string>("right");
  const [visualMapBottom, setVisualMapBottom] = useState<string>("center");
  
  // 坐标轴配置
  const [xAxisShow, setXAxisShow] = useState(true);
  const [xAxisName, setXAxisName] = useState("");
  const [yAxisShow, setYAxisShow] = useState(true);
  const [yAxisName, setYAxisName] = useState("");

  // 初始化配置
  useEffect(() => {
    if (chart && chart.options) {
      const options = chart.options as HeatmapChartOptions;
      
      // 视觉映射配置
      if (options.visualMap) {
        if (options.visualMap.min !== undefined) {
          setVisualMapMin(options.visualMap.min);
        }
        if (options.visualMap.max !== undefined) {
          setVisualMapMax(options.visualMap.max);
        }
        setVisualMapCalculable(options.visualMap.calculable !== false);
        if (options.visualMap.orient) {
          setVisualMapOrient(options.visualMap.orient);
        }
        if (options.visualMap.left !== undefined) {
          setVisualMapLeft(options.visualMap.left.toString());
        }
        if (options.visualMap.bottom !== undefined) {
          setVisualMapBottom(options.visualMap.bottom.toString());
        }
      }
      
      // X轴
      if (options.xAxis) {
        setXAxisShow(options.xAxis.show !== false);
        setXAxisName(options.xAxis.name || "");
      }
      
      // Y轴
      if (options.yAxis) {
        setYAxisShow(options.yAxis.show !== false);
        setYAxisName(options.yAxis.name || "");
      }
    }
  }, [chart]);

  // 更新热力图配置
  const updateHeatmapOptions = () => {
    const updatedOptions = { ...chart.options } as HeatmapChartOptions;
    
    // 更新视觉映射
    if (!updatedOptions.visualMap) {
      updatedOptions.visualMap = {};
    }
    
    updatedOptions.visualMap.min = visualMapMin;
    updatedOptions.visualMap.max = visualMapMax;
    updatedOptions.visualMap.calculable = visualMapCalculable;
    updatedOptions.visualMap.orient = visualMapOrient;
    updatedOptions.visualMap.left = visualMapLeft;
    updatedOptions.visualMap.bottom = visualMapBottom;
    
    // 确保系列存在
    if (!updatedOptions.series || !updatedOptions.series.length) {
      updatedOptions.series = [{
        type: 'heatmap',
        data: []
      }];
    }
    
    // 更新坐标轴
    if (!updatedOptions.xAxis) {
      updatedOptions.xAxis = {};
    }
    updatedOptions.xAxis.show = xAxisShow;
    updatedOptions.xAxis.name = xAxisName;
    
    if (!updatedOptions.yAxis) {
      updatedOptions.yAxis = {};
    }
    updatedOptions.yAxis.show = yAxisShow;
    updatedOptions.yAxis.name = yAxisName;
    
    // 更新图表
    onUpdateChart({
      ...chart,
      options: updatedOptions
    });
  };

  return (
    <>
      <Tabs defaultValue="common">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="common" className="text-xs py-1.5">
            通用配置
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="text-xs py-1.5">
            热力图配置
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="common">
          {/* 使用通用配置面板 */}
          <div className="mt-4">
            <BaseConfigPanel chart={chart} onUpdateChart={onUpdateChart} />
          </div>
        </TabsContent>
        
        <TabsContent value="heatmap" className="space-y-4 mt-4">
          <Accordion type="single" collapsible defaultValue="visual-map">
            {/* 视觉映射设置 */}
            <AccordionItem value="visual-map">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">视觉映射设置</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1 px-0.5">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">最小值</Label>
                      <Input 
                        type="number"
                        value={visualMapMin}
                        onChange={(e) => setVisualMapMin(parseFloat(e.target.value) || 0)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">最大值</Label>
                      <Input 
                        type="number"
                        value={visualMapMax}
                        onChange={(e) => setVisualMapMax(parseFloat(e.target.value) || 100)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">可以拖拽的手柄</Label>
                    <Switch 
                      checked={visualMapCalculable} 
                      onCheckedChange={setVisualMapCalculable} 
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs">方向</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        type="button"
                        variant={visualMapOrient === 'horizontal' ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setVisualMapOrient('horizontal')}
                      >
                        水平
                      </Button>
                      <Button 
                        type="button"
                        variant={visualMapOrient === 'vertical' ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setVisualMapOrient('vertical')}
                      >
                        垂直
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">左侧位置</Label>
                      <Input 
                        value={visualMapLeft}
                        onChange={(e) => setVisualMapLeft(e.target.value)}
                        placeholder="例如：right"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">底部位置</Label>
                      <Input 
                        value={visualMapBottom}
                        onChange={(e) => setVisualMapBottom(e.target.value)}
                        placeholder="例如：center"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={updateHeatmapOptions} 
                    size="sm"
                    className="w-full h-8 mt-2 text-xs"
                  >
                    应用视觉映射设置
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* 坐标轴设置 */}
            <AccordionItem value="axis-settings">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <Axis3D className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">坐标轴设置</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1 px-0.5">
                <div className="space-y-4">
                  {/* X轴 */}
                  <div className="space-y-3 pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">X轴</Label>
                      <Switch 
                        checked={xAxisShow} 
                        onCheckedChange={setXAxisShow} 
                      />
                    </div>

                    {xAxisShow && (
                      <div className="space-y-1.5">
                        <Label className="text-xs">X轴名称</Label>
                        <Input 
                          value={xAxisName}
                          onChange={(e) => setXAxisName(e.target.value)}
                          placeholder="X轴名称"
                          className="h-8 text-xs"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Y轴 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Y轴</Label>
                      <Switch 
                        checked={yAxisShow} 
                        onCheckedChange={setYAxisShow} 
                      />
                    </div>

                    {yAxisShow && (
                      <div className="space-y-1.5">
                        <Label className="text-xs">Y轴名称</Label>
                        <Input 
                          value={yAxisName}
                          onChange={(e) => setYAxisName(e.target.value)}
                          placeholder="Y轴名称"
                          className="h-8 text-xs"
                        />
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={updateHeatmapOptions} 
                    size="sm"
                    className="w-full h-8 mt-2 text-xs"
                  >
                    应用坐标轴设置
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </>
  );
} 