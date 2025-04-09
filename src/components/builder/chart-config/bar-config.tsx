"use client";

import { useState, useEffect } from "react";
import { ChartElement } from "@/types/chart";
import { BarChartOptions } from "@/types/chart-options";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  BarChart,
  LayoutGrid,
  Axis3D,
  PanelTopClose 
} from "lucide-react";
import { BaseConfigPanel } from "./base-config";

interface BarConfigPanelProps {
  chart: ChartElement;
  onUpdateChart: (chart: ChartElement) => void;
}

export function BarConfigPanel({ chart, onUpdateChart }: BarConfigPanelProps) {
  // 柱状图特有配置
  const [barWidth, setBarWidth] = useState<number>(30);
  const [barMaxWidth, setBarMaxWidth] = useState<number>(30);
  const [barGap, setBarGap] = useState<string>("30%");
  const [barCategoryGap, setBarCategoryGap] = useState<string>("20%");
  
  const [showBarBorder, setShowBarBorder] = useState(false);
  const [barBorderWidth, setBarBorderWidth] = useState(1);
  const [barBorderRadius, setBarBorderRadius] = useState<number[]>([0, 0, 0, 0]);
  
  const [showLabel, setShowLabel] = useState(false);
  const [labelPosition, setLabelPosition] = useState<string>("top");
  
  // X轴配置
  const [xAxisShow, setXAxisShow] = useState(true);
  const [xAxisName, setXAxisName] = useState("");
  
  // Y轴配置
  const [yAxisShow, setYAxisShow] = useState(true);
  const [yAxisName, setYAxisName] = useState("");
  const [yAxisMin, setYAxisMin] = useState<string | undefined>(undefined);
  const [yAxisMax, setYAxisMax] = useState<string | undefined>(undefined);

  // 初始化配置
  useEffect(() => {
    if (chart && chart.options) {
      const options = chart.options as BarChartOptions;

      // 获取系列配置（取第一个柱状图系列）
      const series = options.series && options.series.length > 0 
        ? options.series[0] 
        : undefined;
      
      if (series) {
        // 柱宽度
        if (typeof series.barWidth === 'number') {
          setBarWidth(series.barWidth);
        } else if (typeof series.barWidth === 'string') {
          setBarWidth(parseInt(series.barWidth));
        }
        
        // 柱间距
        if (series.barGap) {
          setBarGap(series.barGap.toString());
        }
        
        // 类目间距
        if (series.barCategoryGap) {
          setBarCategoryGap(series.barCategoryGap.toString());
        }
        
        // 柱样式
        if (series.itemStyle) {
          setShowBarBorder(series.itemStyle.borderWidth !== 0);
          if (series.itemStyle.borderWidth) {
            setBarBorderWidth(series.itemStyle.borderWidth);
          }
          
          if (series.itemStyle.borderRadius) {
            if (Array.isArray(series.itemStyle.borderRadius)) {
              setBarBorderRadius(series.itemStyle.borderRadius);
            } else {
              setBarBorderRadius([
                series.itemStyle.borderRadius,
                series.itemStyle.borderRadius,
                series.itemStyle.borderRadius,
                series.itemStyle.borderRadius
              ]);
            }
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

  // 更新柱状图配置
  const updateBarOptions = () => {
    const updatedOptions = { ...chart.options } as BarChartOptions;
    
    // 确保 series 存在
    if (!updatedOptions.series || !updatedOptions.series.length) {
      updatedOptions.series = [{
        type: 'bar',
        data: []
      }];
    }
    
    // 更新系列配置
    const series = updatedOptions.series[0];
    series.barWidth = barWidth;
    series.barGap = barGap;
    series.barCategoryGap = barCategoryGap;
    
    // 更新柱样式
    if (!series.itemStyle) {
      series.itemStyle = {};
    }
    
    if (showBarBorder) {
      series.itemStyle.borderWidth = barBorderWidth;
      series.itemStyle.borderColor = series.itemStyle.borderColor || '#000';
    } else {
      series.itemStyle.borderWidth = 0;
    }
    
    series.itemStyle.borderRadius = barBorderRadius;
    
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

  // 渲染配置标签页
  return (
    <>
      <Tabs defaultValue="common">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="common" className="text-xs py-1.5">
            通用配置
          </TabsTrigger>
          <TabsTrigger value="bar" className="text-xs py-1.5">
            柱状图配置
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="common">
          {/* 使用通用配置面板 */}
          <div className="mt-4">
            <BaseConfigPanel chart={chart} onUpdateChart={onUpdateChart} />
          </div>
        </TabsContent>
        
        <TabsContent value="bar" className="space-y-4 mt-4">
          <Accordion type="single" collapsible defaultValue="bar-style">
            {/* 柱样式设置 */}
            <AccordionItem value="bar-style">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">柱样式设置</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1 px-0.5">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">柱宽度 (像素)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[barWidth]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(values) => setBarWidth(values[0])}
                        className="flex-1"
                      />
                      <Input 
                        type="number"
                        value={barWidth}
                        onChange={(e) => setBarWidth(parseInt(e.target.value) || 0)}
                        className="w-16 h-8 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">柱间距 (%, 正值为间隔, 负值为重叠)</Label>
                    <Input 
                      value={barGap}
                      onChange={(e) => setBarGap(e.target.value)}
                      placeholder="例如：30%"
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">类目间距</Label>
                    <Input 
                      value={barCategoryGap}
                      onChange={(e) => setBarCategoryGap(e.target.value)}
                      placeholder="例如：20%"
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-xs">显示边框</Label>
                    <Switch 
                      checked={showBarBorder} 
                      onCheckedChange={setShowBarBorder} 
                    />
                  </div>

                  {showBarBorder && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">边框宽度</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[barBorderWidth]}
                          min={0}
                          max={10}
                          step={1}
                          onValueChange={(values) => setBarBorderWidth(values[0])}
                          className="flex-1"
                        />
                        <Input 
                          type="number"
                          value={barBorderWidth}
                          onChange={(e) => setBarBorderWidth(parseInt(e.target.value) || 0)}
                          className="w-16 h-8 text-xs"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label className="text-xs">圆角半径 [左上, 右上, 右下, 左下]</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[0, 1, 2, 3].map((index) => (
                        <Input 
                          key={index}
                          type="number"
                          value={barBorderRadius[index]}
                          onChange={(e) => {
                            const newRadius = [...barBorderRadius];
                            newRadius[index] = parseInt(e.target.value) || 0;
                            setBarBorderRadius(newRadius);
                          }}
                          className="h-8 text-xs"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={updateBarOptions} 
                    size="sm"
                    className="w-full h-8 mt-2 text-xs"
                  >
                    应用样式更改
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
                      <div className="grid grid-cols-3 gap-2">
                        {['top', 'inside', 'bottom', 'left', 'right', 'insideTop'].map((pos) => (
                          <Button 
                            key={pos}
                            type="button"
                            variant={labelPosition === pos ? "default" : "outline"}
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => setLabelPosition(pos)}
                          >
                            {pos === 'top' ? '顶部' : 
                             pos === 'inside' ? '内部' : 
                             pos === 'bottom' ? '底部' : 
                             pos === 'left' ? '左侧' : 
                             pos === 'right' ? '右侧' : 
                             pos === 'insideTop' ? '内部顶' : pos}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={updateBarOptions} 
                    size="sm"
                    className="w-full h-8 mt-2 text-xs"
                  >
                    应用标签更改
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
                    onClick={updateBarOptions} 
                    size="sm"
                    className="w-full h-8 mt-2 text-xs"
                  >
                    应用坐标轴更改
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