"use client";

import { useState, useEffect } from "react";
import { ChartElement } from "@/types/chart";
import { LineChartOptions } from "@/types/chart-options";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  LineChart,
  Circle,
  Axis3D,
  PanelTopClose
} from "lucide-react";
import { BaseConfigPanel } from "./base-config";

interface LineConfigPanelProps {
  chart: ChartElement;
  onUpdateChart: (chart: ChartElement) => void;
}

export function LineConfigPanel({ chart, onUpdateChart }: LineConfigPanelProps) {
  // 折线图特有配置
  const [smooth, setSmooth] = useState<boolean>(false);
  const [showSymbol, setShowSymbol] = useState<boolean>(true);
  const [symbol, setSymbol] = useState<string>("circle");
  const [symbolSize, setSymbolSize] = useState<number>(4);
  const [lineWidth, setLineWidth] = useState<number>(2);
  const [lineType, setLineType] = useState<string>("solid");
  
  // 区域填充
  const [showAreaStyle, setShowAreaStyle] = useState<boolean>(false);
  const [areaStyleOpacity, setAreaStyleOpacity] = useState<number>(0.7);
  
  // 标签配置
  const [showLabel, setShowLabel] = useState<boolean>(false);
  const [labelPosition, setLabelPosition] = useState<string>("top");
  
  // 坐标轴配置
  const [xAxisShow, setXAxisShow] = useState<boolean>(true);
  const [xAxisName, setXAxisName] = useState<string>("");
  const [yAxisShow, setYAxisShow] = useState<boolean>(true);
  const [yAxisName, setYAxisName] = useState<string>("");
  const [yAxisMin, setYAxisMin] = useState<string | undefined>(undefined);
  const [yAxisMax, setYAxisMax] = useState<string | undefined>(undefined);
  
  // 初始化配置
  useEffect(() => {
    if (chart && chart.options) {
      const options = chart.options as LineChartOptions;
      
      // 获取系列配置（取第一个折线图系列）
      const series = options.series && options.series.length > 0 
        ? options.series[0] 
        : undefined;
      
      if (series) {
        // 折线样式
        setSmooth(series.smooth === true);
        setShowSymbol(series.showSymbol !== false);
        
        if (series.symbol) {
          setSymbol(series.symbol);
        }
        
        if (series.symbolSize) {
          setSymbolSize(series.symbolSize as number);
        }
        
        // 线宽和类型
        if (series.lineStyle) {
          if (series.lineStyle.width) {
            setLineWidth(series.lineStyle.width);
          }
          
          if (series.lineStyle.type) {
            setLineType(series.lineStyle.type);
          }
        }
        
        // 区域填充
        if (series.areaStyle) {
          setShowAreaStyle(true);
          
          if (series.areaStyle.opacity !== undefined) {
            setAreaStyleOpacity(series.areaStyle.opacity);
          }
        } else {
          setShowAreaStyle(false);
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
  
  // 更新折线图配置
  const updateLineOptions = () => {
    const updatedOptions = { ...chart.options } as LineChartOptions;
    
    // 确保 series 存在
    if (!updatedOptions.series || !updatedOptions.series.length) {
      updatedOptions.series = [{
        type: 'line',
        data: []
      }];
    }
    
    // 更新系列配置
    const series = updatedOptions.series[0];
    
    // 更新折线基本设置
    series.smooth = smooth;
    series.showSymbol = showSymbol;
    series.symbol = symbol;
    series.symbolSize = symbolSize;
    
    // 更新线样式
    if (!series.lineStyle) {
      series.lineStyle = {};
    }
    
    series.lineStyle.width = lineWidth;
    series.lineStyle.type = lineType;
    
    // 更新区域填充
    if (showAreaStyle) {
      if (!series.areaStyle) {
        series.areaStyle = {};
      }
      
      series.areaStyle.opacity = areaStyleOpacity;
    } else {
      series.areaStyle = undefined;
    }
    
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
          <TabsTrigger value="line" className="text-xs py-1.5">
            折线图配置
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="common">
          {/* 使用通用配置面板 */}
          <div className="mt-4">
            <BaseConfigPanel chart={chart} onUpdateChart={onUpdateChart} />
          </div>
        </TabsContent>
        
        <TabsContent value="line" className="space-y-4 mt-4">
          <Accordion type="single" collapsible defaultValue="line-style">
            {/* 折线样式设置 */}
            <AccordionItem value="line-style">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">折线样式设置</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1 px-0.5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">平滑曲线</Label>
                    <Switch 
                      checked={smooth} 
                      onCheckedChange={setSmooth} 
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">线宽</Label>
                      <span className="text-xs text-muted-foreground">{lineWidth}px</span>
                    </div>
                    <Slider
                      value={[lineWidth]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(values) => setLineWidth(values[0])}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs">线条类型</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        type="button"
                        variant={lineType === 'solid' ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setLineType('solid')}
                      >
                        实线
                      </Button>
                      <Button 
                        type="button"
                        variant={lineType === 'dashed' ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setLineType('dashed')}
                      >
                        虚线
                      </Button>
                      <Button 
                        type="button"
                        variant={lineType === 'dotted' ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setLineType('dotted')}
                      >
                        点线
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">区域填充</Label>
                    <Switch 
                      checked={showAreaStyle} 
                      onCheckedChange={setShowAreaStyle} 
                    />
                  </div>
                  
                  {showAreaStyle && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs">填充透明度</Label>
                        <span className="text-xs text-muted-foreground">{areaStyleOpacity}</span>
                      </div>
                      <Slider
                        value={[areaStyleOpacity * 100]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(values) => setAreaStyleOpacity(values[0] / 100)}
                      />
                    </div>
                  )}
                  
                  <Button 
                    onClick={updateLineOptions} 
                    size="sm"
                    className="w-full h-8 mt-2 text-xs"
                  >
                    应用样式设置
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* 数据点设置 */}
            <AccordionItem value="symbol-settings">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">数据点设置</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1 px-0.5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">显示数据点</Label>
                    <Switch 
                      checked={showSymbol} 
                      onCheckedChange={setShowSymbol} 
                    />
                  </div>
                  
                  {showSymbol && (
                    <>
                      <div className="space-y-1.5">
                        <Label className="text-xs">数据点形状</Label>
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
                          <Label className="text-xs">数据点大小</Label>
                          <span className="text-xs text-muted-foreground">{symbolSize}px</span>
                        </div>
                        <Slider
                          value={[symbolSize]}
                          min={1}
                          max={20}
                          step={1}
                          onValueChange={(values) => setSymbolSize(values[0])}
                        />
                      </div>
                    </>
                  )}
                  
                  <Button 
                    onClick={updateLineOptions} 
                    size="sm"
                    className="w-full h-8 mt-2 text-xs"
                  >
                    应用数据点设置
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
                    onClick={updateLineOptions} 
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
                    onClick={updateLineOptions} 
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