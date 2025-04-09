"use client";

import { useState, useEffect } from "react";
import { ChartElement } from "@/types/chart";
import { ScatterChartOptions } from "@/types/chart-options";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Circle,
  ScatterChart,
  Axis3D,
  PanelTopClose
} from "lucide-react";
import { BaseConfigPanel } from "./base-config";

interface ScatterConfigPanelProps {
  chart: ChartElement;
  onUpdateChart: (chart: ChartElement) => void;
}

export function ScatterConfigPanel({ chart, onUpdateChart }: ScatterConfigPanelProps) {
  // 散点图特有配置
  const [symbolSize, setSymbolSize] = useState<number>(10);
  const [symbol, setSymbol] = useState<string>("circle");
  const [symbolOpacity, setSymbolOpacity] = useState<number>(0.8);
  const [symbolBorderWidth, setSymbolBorderWidth] = useState<number>(0);
  
  // 标签配置
  const [showLabel, setShowLabel] = useState<boolean>(false);
  const [labelPosition, setLabelPosition] = useState<string>("top");
  
  // 坐标轴配置
  const [xAxisShow, setXAxisShow] = useState<boolean>(true);
  const [xAxisName, setXAxisName] = useState<string>("");
  const [xAxisMin, setXAxisMin] = useState<string | undefined>(undefined);
  const [xAxisMax, setXAxisMax] = useState<string | undefined>(undefined);
  
  const [yAxisShow, setYAxisShow] = useState<boolean>(true);
  const [yAxisName, setYAxisName] = useState<string>("");
  const [yAxisMin, setYAxisMin] = useState<string | undefined>(undefined);
  const [yAxisMax, setYAxisMax] = useState<string | undefined>(undefined);
  
  // 初始化配置
  useEffect(() => {
    if (chart && chart.options) {
      const options = chart.options as ScatterChartOptions;
      
      // 获取系列配置（取第一个散点图系列）
      const series = options.series && options.series.length > 0 
        ? options.series[0] 
        : undefined;
      
      if (series) {
        // 符号样式
        if (series.symbolSize !== undefined) {
          setSymbolSize(series.symbolSize as number);
        }
        
        if (series.symbol) {
          setSymbol(series.symbol);
        }
        
        if (series.itemStyle) {
          if (series.itemStyle.opacity !== undefined) {
            setSymbolOpacity(series.itemStyle.opacity);
          }
          
          if (series.itemStyle.borderWidth !== undefined) {
            setSymbolBorderWidth(series.itemStyle.borderWidth);
          }
        }
        
        // 标签
        if (series.label) {
          setShowLabel(series.label.show === true);
          
          if (series.label.position) {
            setLabelPosition(series.label.position);
          }
        }
      }
      
      // X轴
      if (options.xAxis) {
        setXAxisShow(options.xAxis.show !== false);
        
        if (options.xAxis.name) {
          setXAxisName(options.xAxis.name);
        }
        
        if (options.xAxis.min !== undefined && options.xAxis.min !== null) {
          setXAxisMin(options.xAxis.min.toString());
        }
        
        if (options.xAxis.max !== undefined && options.xAxis.max !== null) {
          setXAxisMax(options.xAxis.max.toString());
        }
      }
      
      // Y轴
      if (options.yAxis) {
        setYAxisShow(options.yAxis.show !== false);
        
        if (options.yAxis.name) {
          setYAxisName(options.yAxis.name);
        }
        
        if (options.yAxis.min !== undefined && options.yAxis.min !== null) {
          setYAxisMin(options.yAxis.min.toString());
        }
        
        if (options.yAxis.max !== undefined && options.yAxis.max !== null) {
          setYAxisMax(options.yAxis.max.toString());
        }
      }
    }
  }, [chart]);
  
  // 更新散点图配置
  const updateScatterOptions = () => {
    const updatedOptions = { ...chart.options } as ScatterChartOptions;
    
    // 确保 series 存在
    if (!updatedOptions.series || !updatedOptions.series.length) {
      updatedOptions.series = [{
        type: 'scatter',
        data: []
      }];
    }
    
    // 更新系列配置
    const series = updatedOptions.series[0];
    
    // 更新符号设置
    series.symbol = symbol;
    series.symbolSize = symbolSize;
    
    // 更新样式
    if (!series.itemStyle) {
      series.itemStyle = {};
    }
    
    series.itemStyle.opacity = symbolOpacity;
    series.itemStyle.borderWidth = symbolBorderWidth;
    
    // 更新标签
    if (!series.label) {
      series.label = {};
    }
    
    series.label.show = showLabel;
    
    if (showLabel) {
      series.label.position = labelPosition;
    }
    
    // 更新X轴
    if (!updatedOptions.xAxis) {
      updatedOptions.xAxis = {};
    }
    
    updatedOptions.xAxis.show = xAxisShow;
    updatedOptions.xAxis.name = xAxisName;
    
    if (xAxisMin !== undefined && xAxisMin !== "") {
      updatedOptions.xAxis.min = parseFloat(xAxisMin);
    } else {
      updatedOptions.xAxis.min = undefined;
    }
    
    if (xAxisMax !== undefined && xAxisMax !== "") {
      updatedOptions.xAxis.max = parseFloat(xAxisMax);
    } else {
      updatedOptions.xAxis.max = undefined;
    }
    
    // 更新Y轴
    if (!updatedOptions.yAxis) {
      updatedOptions.yAxis = {};
    }
    
    updatedOptions.yAxis.show = yAxisShow;
    updatedOptions.yAxis.name = yAxisName;
    
    if (yAxisMin !== undefined && yAxisMin !== "") {
      updatedOptions.yAxis.min = parseFloat(yAxisMin);
    } else {
      updatedOptions.yAxis.min = undefined;
    }
    
    if (yAxisMax !== undefined && yAxisMax !== "") {
      updatedOptions.yAxis.max = parseFloat(yAxisMax);
    } else {
      updatedOptions.yAxis.max = undefined;
    }
    
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
          <TabsTrigger value="scatter" className="text-xs py-1.5">
            散点图配置
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="common">
          {/* 使用通用配置面板 */}
          <div className="mt-4">
            <BaseConfigPanel chart={chart} onUpdateChart={onUpdateChart} />
          </div>
        </TabsContent>
        
        <TabsContent value="scatter" className="space-y-4 mt-4">
          <Accordion type="single" collapsible defaultValue="symbol-settings">
            {/* 散点样式设置 */}
            <AccordionItem value="symbol-settings">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">散点样式设置</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1 px-0.5">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">散点形状</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {['circle', 'rect', 'triangle', 'diamond', 'pin', 'arrow'].map((s) => (
                        <Button 
                          key={s}
                          type="button"
                          variant={symbol === s ? "default" : "outline"}
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => setSymbol(s)}
                        >
                          {s === 'circle' ? '圆形' : 
                           s === 'rect' ? '方形' : 
                           s === 'triangle' ? '三角形' : 
                           s === 'diamond' ? '菱形' : 
                           s === 'pin' ? '标记' : 
                           s === 'arrow' ? '箭头' : s}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">散点大小</Label>
                      <span className="text-xs text-muted-foreground">{symbolSize}px</span>
                    </div>
                    <Slider
                      value={[symbolSize]}
                      min={1}
                      max={30}
                      step={1}
                      onValueChange={(values) => setSymbolSize(values[0])}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">不透明度</Label>
                      <span className="text-xs text-muted-foreground">{Math.round(symbolOpacity * 100)}%</span>
                    </div>
                    <Slider
                      value={[symbolOpacity * 100]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(values) => setSymbolOpacity(values[0] / 100)}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">边框宽度</Label>
                      <span className="text-xs text-muted-foreground">{symbolBorderWidth}px</span>
                    </div>
                    <Slider
                      value={[symbolBorderWidth]}
                      min={0}
                      max={5}
                      step={0.5}
                      onValueChange={(values) => setSymbolBorderWidth(values[0])}
                    />
                  </div>
                  
                  <Button 
                    onClick={updateScatterOptions} 
                    size="sm"
                    className="w-full h-8 mt-2 text-xs"
                  >
                    应用散点样式
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* 标签设置 */}
            <AccordionItem value="label-settings">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <PanelTopClose className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">标签设置</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1 px-0.5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">显示数据标签</Label>
                    <Switch 
                      checked={showLabel} 
                      onCheckedChange={setShowLabel} 
                    />
                  </div>
                  
                  {showLabel && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">标签位置</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {['top', 'bottom', 'left', 'right'].map((pos) => (
                          <Button 
                            key={pos}
                            type="button"
                            variant={labelPosition === pos ? "default" : "outline"}
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => setLabelPosition(pos)}
                          >
                            {pos === 'top' ? '顶部' : 
                             pos === 'bottom' ? '底部' : 
                             pos === 'left' ? '左侧' : 
                             pos === 'right' ? '右侧' : pos}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={updateScatterOptions} 
                    size="sm"
                    className="w-full h-8 mt-2 text-xs"
                  >
                    应用标签设置
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
                      <>
                        <div className="space-y-1.5">
                          <Label className="text-xs">X轴名称</Label>
                          <Input 
                            value={xAxisName}
                            onChange={(e) => setXAxisName(e.target.value)}
                            placeholder="X轴名称"
                            className="h-8 text-xs"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1.5">
                            <Label className="text-xs">最小值</Label>
                            <Input 
                              value={xAxisMin}
                              onChange={(e) => setXAxisMin(e.target.value)}
                              placeholder="自动"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">最大值</Label>
                            <Input 
                              value={xAxisMax}
                              onChange={(e) => setXAxisMax(e.target.value)}
                              placeholder="自动"
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                      </>
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
                      <>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Y轴名称</Label>
                          <Input 
                            value={yAxisName}
                            onChange={(e) => setYAxisName(e.target.value)}
                            placeholder="Y轴名称"
                            className="h-8 text-xs"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1.5">
                            <Label className="text-xs">最小值</Label>
                            <Input 
                              value={yAxisMin}
                              onChange={(e) => setYAxisMin(e.target.value)}
                              placeholder="自动"
                              className="h-8 text-xs"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs">最大值</Label>
                            <Input 
                              value={yAxisMax}
                              onChange={(e) => setYAxisMax(e.target.value)}
                              placeholder="自动"
                              className="h-8 text-xs"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <Button 
                    onClick={updateScatterOptions} 
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