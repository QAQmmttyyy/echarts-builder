"use client";

import { useState, useEffect } from "react";
import { ChartElement } from "@/types/chart";
import { RadarChartOptions } from "@/types/chart-options";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Circle,
  RadarIcon,
  Axis3D,
  PanelTopClose,
  Hexagon
} from "lucide-react";
import { BaseConfigPanel } from "./base-config";

interface RadarConfigPanelProps {
  chart: ChartElement;
  onUpdateChart: (chart: ChartElement) => void;
}

export function RadarConfigPanel({ chart, onUpdateChart }: RadarConfigPanelProps) {
  // 雷达图特有配置
  const [shape, setShape] = useState<string>("polygon");
  const [radius, setRadius] = useState<string>("75%");
  const [startAngle, setStartAngle] = useState<number>(90);
  const [splitNumber, setSplitNumber] = useState<number>(5);
  
  // 线条样式
  const [lineWidth, setLineWidth] = useState<number>(2);
  const [lineType, setLineType] = useState<string>("solid");
  const [showSymbol, setShowSymbol] = useState<boolean>(true);
  const [symbolSize, setSymbolSize] = useState<number>(4);
  const [symbol, setSymbol] = useState<string>("circle");
  
  // 区域填充
  const [showAreaStyle, setShowAreaStyle] = useState<boolean>(true);
  const [areaStyleOpacity, setAreaStyleOpacity] = useState<number>(0.3);
  
  // 标签配置
  const [showLabel, setShowLabel] = useState<boolean>(false);
  const [labelPosition, setLabelPosition] = useState<string>("top");
  
  // 雷达坐标系名称配置
  const [showAxisName, setShowAxisName] = useState<boolean>(true);
  const [nameGap, setNameGap] = useState<number>(15);
  const [nameSize, setNameSize] = useState<number>(12);
  
  // 初始化配置
  useEffect(() => {
    if (chart && chart.options) {
      const options = chart.options as RadarChartOptions;
      
      // 雷达坐标系配置
      if (options.radar) {
        if (options.radar.shape) {
          setShape(options.radar.shape);
        }
        
        if (options.radar.radius) {
          setRadius(options.radar.radius.toString());
        }
        
        if (options.radar.startAngle !== undefined) {
          setStartAngle(options.radar.startAngle);
        }
        
        if (options.radar.splitNumber !== undefined) {
          setSplitNumber(options.radar.splitNumber);
        }
        
        // 坐标系名称配置
        if (options.radar.axisName) {
          setShowAxisName(options.radar.axisName.show !== false);
          
          if (options.radar.axisName.nameGap !== undefined) {
            setNameGap(options.radar.axisName.nameGap);
          }
          
          if (options.radar.axisName.fontSize !== undefined) {
            setNameSize(options.radar.axisName.fontSize);
          }
        }
      }
      
      // 获取系列配置（取第一个雷达图系列）
      const series = options.series && options.series.length > 0 
        ? options.series[0] 
        : undefined;
      
      if (series) {
        // 符号样式
        setShowSymbol(series.showSymbol !== false);
        
        if (series.symbol) {
          setSymbol(series.symbol);
        }
        
        if (series.symbolSize !== undefined) {
          setSymbolSize(series.symbolSize as number);
        }
        
        // 线宽和类型
        if (series.lineStyle) {
          if (series.lineStyle.width !== undefined) {
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
    }
  }, [chart]);
  
  // 更新雷达图配置
  const updateRadarOptions = () => {
    const updatedOptions = { ...chart.options } as RadarChartOptions;
    
    // 更新雷达坐标系配置
    if (!updatedOptions.radar) {
      updatedOptions.radar = {};
    }
    
    updatedOptions.radar.shape = shape;
    updatedOptions.radar.radius = radius;
    updatedOptions.radar.startAngle = startAngle;
    updatedOptions.radar.splitNumber = splitNumber;
    
    // 坐标系名称配置
    if (!updatedOptions.radar.axisName) {
      updatedOptions.radar.axisName = {};
    }
    
    updatedOptions.radar.axisName.show = showAxisName;
    updatedOptions.radar.axisName.nameGap = nameGap;
    updatedOptions.radar.axisName.fontSize = nameSize;
    
    // 确保 series 存在
    if (!updatedOptions.series || !updatedOptions.series.length) {
      updatedOptions.series = [{
        type: 'radar',
        data: [{ value: [0, 0, 0, 0, 0], name: '示例数据' }]
      }];
    }
    
    // 更新系列配置
    const series = updatedOptions.series[0];
    
    // 更新符号设置
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
          <TabsTrigger value="radar" className="text-xs py-1.5">
            雷达图配置
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="common">
          {/* 使用通用配置面板 */}
          <div className="mt-4">
            <BaseConfigPanel chart={chart} onUpdateChart={onUpdateChart} />
          </div>
        </TabsContent>
        
        <TabsContent value="radar" className="space-y-4 mt-4">
          <Accordion type="single" collapsible defaultValue="radar-shape">
            {/* 雷达图形状设置 */}
            <AccordionItem value="radar-shape">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <Hexagon className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">雷达图形状设置</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1 px-0.5">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">形状</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        type="button"
                        variant={shape === 'polygon' ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setShape('polygon')}
                      >
                        多边形
                      </Button>
                      <Button 
                        type="button"
                        variant={shape === 'circle' ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setShape('circle')}
                      >
                        圆形
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs">半径</Label>
                    <Input 
                      value={radius}
                      onChange={(e) => setRadius(e.target.value)}
                      placeholder="例如：75%"
                      className="h-8 text-xs"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">起始角度</Label>
                      <span className="text-xs text-muted-foreground">{startAngle}°</span>
                    </div>
                    <Slider
                      value={[startAngle]}
                      min={0}
                      max={360}
                      step={15}
                      onValueChange={(values) => setStartAngle(values[0])}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">分割段数</Label>
                      <span className="text-xs text-muted-foreground">{splitNumber}</span>
                    </div>
                    <Slider
                      value={[splitNumber]}
                      min={3}
                      max={10}
                      step={1}
                      onValueChange={(values) => setSplitNumber(values[0])}
                    />
                  </div>
                  
                  <Button 
                    onClick={updateRadarOptions} 
                    size="sm"
                    className="w-full h-8 mt-2 text-xs"
                  >
                    应用形状设置
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* 线条样式设置 */}
            <AccordionItem value="line-style">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <RadarIcon className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">线条样式设置</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1 px-0.5">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">线宽</Label>
                      <span className="text-xs text-muted-foreground">{lineWidth}px</span>
                    </div>
                    <Slider
                      value={[lineWidth]}
                      min={1}
                      max={5}
                      step={0.5}
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
                        <span className="text-xs text-muted-foreground">{Math.round(areaStyleOpacity * 100)}%</span>
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
                    onClick={updateRadarOptions} 
                    size="sm"
                    className="w-full h-8 mt-2 text-xs"
                  >
                    应用线条样式
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
                          max={10}
                          step={0.5}
                          onValueChange={(values) => setSymbolSize(values[0])}
                        />
                      </div>
                    </>
                  )}
                  
                  <Button 
                    onClick={updateRadarOptions} 
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
                    onClick={updateRadarOptions} 
                    size="sm"
                    className="w-full h-8 mt-2 text-xs"
                  >
                    应用标签设置
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* 坐标轴名称设置 */}
            <AccordionItem value="axis-name">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <Axis3D className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">坐标轴名称设置</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1 px-0.5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">显示坐标轴名称</Label>
                    <Switch 
                      checked={showAxisName} 
                      onCheckedChange={setShowAxisName} 
                    />
                  </div>
                  
                  {showAxisName && (
                    <>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <Label className="text-xs">名称与轴线距离</Label>
                          <span className="text-xs text-muted-foreground">{nameGap}px</span>
                        </div>
                        <Slider
                          value={[nameGap]}
                          min={0}
                          max={50}
                          step={1}
                          onValueChange={(values) => setNameGap(values[0])}
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <Label className="text-xs">名称字体大小</Label>
                          <span className="text-xs text-muted-foreground">{nameSize}px</span>
                        </div>
                        <Slider
                          value={[nameSize]}
                          min={8}
                          max={20}
                          step={1}
                          onValueChange={(values) => setNameSize(values[0])}
                        />
                      </div>
                    </>
                  )}
                  
                  <Button 
                    onClick={updateRadarOptions} 
                    size="sm"
                    className="w-full h-8 mt-2 text-xs"
                  >
                    应用坐标轴名称设置
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