"use client";

import { useState, useEffect } from "react";
import { ChartElement } from "@/types/chart";
import { PieChartOptions } from "@/types/chart-options";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  PieChart,
  PanelTopClose,
  CircleDashed,
  Sliders
} from "lucide-react";
import { BaseConfigPanel } from "./base-config";

interface PieConfigPanelProps {
  chart: ChartElement;
  onUpdateChart: (chart: ChartElement) => void;
}

export function PieConfigPanel({ chart, onUpdateChart }: PieConfigPanelProps) {
  // 饼图特有配置
  const [radiusInner, setRadiusInner] = useState(0);
  const [radiusOuter, setRadiusOuter] = useState(75);
  const [roseType, setRoseType] = useState<boolean | string>(false);
  const [centerX, setCenterX] = useState(50);
  const [centerY, setCenterY] = useState(50);
  const [startAngle, setStartAngle] = useState(90);
  const [selectedMode, setSelectedMode] = useState<boolean | string>(false);
  const [clockwise, setClockwise] = useState(true);
  const [avoidLabelOverlap, setAvoidLabelOverlap] = useState(true);
  
  // 标签配置
  const [showLabel, setShowLabel] = useState(true);
  const [labelPosition, setLabelPosition] = useState<string>("outside");
  
  // 引导线配置
  const [showLabelLine, setShowLabelLine] = useState(true);
  const [labelLineLength, setLabelLineLength] = useState(15);
  const [labelLineLength2, setLabelLineLength2] = useState(10);
  const [labelLineSmooth, setLabelLineSmooth] = useState(false);

  // 初始化配置
  useEffect(() => {
    if (chart && chart.options) {
      const options = chart.options as PieChartOptions;

      // 获取系列配置（取第一个饼图系列）
      const series = options.series && options.series.length > 0 
        ? options.series[0] 
        : undefined;
      
      if (series) {
        // 饼图半径
        if (series.radius) {
          if (Array.isArray(series.radius)) {
            // 如果是数组 [内半径, 外半径]
            const innerStr = series.radius[0].toString();
            const outerStr = series.radius[1].toString();
            
            // 移除百分号并转换为数字
            setRadiusInner(parseInt(innerStr.replace('%', '')));
            setRadiusOuter(parseInt(outerStr.replace('%', '')));
          } else {
            // 单一值，视为外半径
            const radiusStr = series.radius.toString();
            setRadiusOuter(parseInt(radiusStr.replace('%', '')));
          }
        }
        
        // 中心点位置
        if (series.center && Array.isArray(series.center) && series.center.length === 2) {
          const xStr = series.center[0].toString();
          const yStr = series.center[1].toString();
          
          setCenterX(parseInt(xStr.replace('%', '')));
          setCenterY(parseInt(yStr.replace('%', '')));
        }
        
        // 南丁格尔玫瑰图
        if (series.roseType !== undefined) {
          setRoseType(series.roseType);
        }
        
        // 起始角度
        if (series.startAngle !== undefined) {
          setStartAngle(series.startAngle);
        }
        
        // 选择模式
        if (series.selectedMode !== undefined) {
          setSelectedMode(series.selectedMode);
        }
        
        // 是否顺时针
        if (series.clockwise !== undefined) {
          setClockwise(series.clockwise);
        }
        
        // 是否避免标签重叠
        if (series.avoidLabelOverlap !== undefined) {
          setAvoidLabelOverlap(series.avoidLabelOverlap);
        }
        
        // 标签
        if (series.label) {
          setShowLabel(series.label.show !== false);
          if (series.label.position) {
            setLabelPosition(series.label.position);
          }
        }
        
        // 引导线
        if (series.labelLine) {
          setShowLabelLine(series.labelLine.show !== false);
          
          if (series.labelLine.length !== undefined) {
            setLabelLineLength(series.labelLine.length);
          }
          
          if (series.labelLine.length2 !== undefined) {
            setLabelLineLength2(series.labelLine.length2);
          }
          
          if (series.labelLine.smooth !== undefined) {
            setLabelLineSmooth(series.labelLine.smooth);
          }
        }
      }
    }
  }, [chart]);

  // 更新饼图配置
  const updatePieOptions = () => {
    const updatedOptions = { ...chart.options } as PieChartOptions;
    
    // 确保 series 存在
    if (!updatedOptions.series || !updatedOptions.series.length) {
      updatedOptions.series = [{
        type: 'pie',
        data: []
      }];
    }
    
    // 更新系列配置
    const series = updatedOptions.series[0];
    
    // 设置半径
    series.radius = radiusInner > 0 
      ? [`${radiusInner}%`, `${radiusOuter}%`] 
      : `${radiusOuter}%`;
    
    // 设置中心点
    series.center = [`${centerX}%`, `${centerY}%`];
    
    // 设置玫瑰图类型
    series.roseType = roseType;
    
    // 设置起始角度
    series.startAngle = startAngle;
    
    // 设置选择模式
    series.selectedMode = selectedMode;
    
    // 设置顺时针方向
    series.clockwise = clockwise;
    
    // 设置是否避免标签重叠
    series.avoidLabelOverlap = avoidLabelOverlap;
    
    // 更新标签
    if (!series.label) {
      series.label = {};
    }
    
    series.label.show = showLabel;
    if (showLabel) {
      series.label.position = labelPosition;
    }
    
    // 更新引导线
    if (!series.labelLine) {
      series.labelLine = {};
    }
    
    series.labelLine.show = showLabelLine;
    if (showLabelLine) {
      series.labelLine.length = labelLineLength;
      series.labelLine.length2 = labelLineLength2;
      series.labelLine.smooth = labelLineSmooth;
    }
    
    // 更新图表
    onUpdateChart({
      ...chart,
      options: updatedOptions
    });
  };

  // 计算选择模式的按钮状态
  const getSelectedModeButtonVariant = (value: boolean | string) => {
    if (typeof selectedMode === 'boolean' && typeof value === 'boolean') {
      return selectedMode === value ? "default" : "outline";
    } else if (typeof selectedMode === 'string' && typeof value === 'string') {
      return selectedMode === value ? "default" : "outline";
    }
    return "outline";
  };

  // 计算玫瑰图类型的按钮状态
  const getRoseTypeButtonVariant = (value: boolean | string) => {
    if (typeof roseType === 'boolean' && typeof value === 'boolean') {
      return roseType === value ? "default" : "outline";
    } else if (typeof roseType === 'string' && typeof value === 'string') {
      return roseType === value ? "default" : "outline";
    }
    return "outline";
  };

  return (
    <>
      <Tabs defaultValue="common">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="common" className="text-xs py-1.5">
            通用配置
          </TabsTrigger>
          <TabsTrigger value="pie" className="text-xs py-1.5">
            饼图配置
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="common">
          {/* 使用通用配置面板 */}
          <div className="mt-4">
            <BaseConfigPanel chart={chart} onUpdateChart={onUpdateChart} />
          </div>
        </TabsContent>
        
        <TabsContent value="pie" className="space-y-4 mt-4">
          <Accordion type="single" collapsible defaultValue="pie-style">
            {/* 饼图基本设置 */}
            <AccordionItem value="pie-style">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">饼图基本设置</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1 px-0.5">
                <div className="space-y-3">
                  {/* 半径设置 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <Label className="text-xs">外半径: {radiusOuter}%</Label>
                      <Label className="text-xs">内半径: {radiusInner}%</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[radiusInner, radiusOuter]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(values) => {
                          setRadiusInner(values[0]);
                          setRadiusOuter(values[1]);
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* 中心点设置 */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">中心点位置 (X: {centerX}%, Y: {centerY}%)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">X轴位置</Label>
                        <Slider
                          value={[centerX]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(values) => setCenterX(values[0])}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Y轴位置</Label>
                        <Slider
                          value={[centerY]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(values) => setCenterY(values[0])}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 起始角度 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">起始角度</Label>
                      <div className="flex items-center">
                        <span className="text-xs text-muted-foreground mr-2">{startAngle}°</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[startAngle]}
                        min={0}
                        max={360}
                        step={5}
                        onValueChange={(values) => setStartAngle(values[0])}
                        className="flex-1"
                      />
                      <Input 
                        type="number"
                        value={startAngle}
                        onChange={(e) => setStartAngle(parseInt(e.target.value) || 0)}
                        className="w-16 h-8 text-xs"
                      />
                    </div>
                  </div>
                  
                  {/* 南丁格尔玫瑰图 */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">南丁格尔玫瑰图</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        type="button"
                        variant={getRoseTypeButtonVariant(false)}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setRoseType(false)}
                      >
                        关闭
                      </Button>
                      <Button 
                        type="button"
                        variant={getRoseTypeButtonVariant('radius')}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setRoseType('radius')}
                      >
                        半径模式
                      </Button>
                      <Button 
                        type="button"
                        variant={getRoseTypeButtonVariant('area')}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setRoseType('area')}
                      >
                        面积模式
                      </Button>
                    </div>
                  </div>
                  
                  {/* 其他设置 */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">顺时针方向</Label>
                      <Switch 
                        checked={clockwise} 
                        onCheckedChange={setClockwise} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">避免标签重叠</Label>
                      <Switch 
                        checked={avoidLabelOverlap} 
                        onCheckedChange={setAvoidLabelOverlap} 
                      />
                    </div>
                  </div>
                  
                  {/* 选择模式 */}
                  <div className="space-y-1.5">
                    <Label className="text-xs">选择模式</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        type="button"
                        variant={getSelectedModeButtonVariant(false)}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setSelectedMode(false)}
                      >
                        禁用
                      </Button>
                      <Button 
                        type="button"
                        variant={getSelectedModeButtonVariant('single')}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setSelectedMode('single')}
                      >
                        单选
                      </Button>
                      <Button 
                        type="button"
                        variant={getSelectedModeButtonVariant('multiple')}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setSelectedMode('multiple')}
                      >
                        多选
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={updatePieOptions} 
                    size="sm"
                    className="w-full h-8 mt-2 text-xs"
                  >
                    应用基本设置
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
                        {['outside', 'inside', 'center'].map((pos) => (
                          <Button 
                            key={pos}
                            type="button"
                            variant={labelPosition === pos ? "default" : "outline"}
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => setLabelPosition(pos)}
                          >
                            {pos === 'outside' ? '外部' : 
                             pos === 'inside' ? '内部' : 
                             pos === 'center' ? '中心' : pos}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={updatePieOptions} 
                    size="sm"
                    className="w-full h-8 mt-2 text-xs"
                  >
                    应用标签设置
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 引导线设置 */}
            <AccordionItem value="label-line-settings">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <CircleDashed className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">引导线设置</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1 px-0.5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">显示引导线</Label>
                    <Switch 
                      checked={showLabelLine} 
                      onCheckedChange={setShowLabelLine} 
                    />
                  </div>

                  {showLabelLine && (
                    <>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <Label className="text-xs">第一段长度</Label>
                          <span className="text-xs text-muted-foreground">{labelLineLength}</span>
                        </div>
                        <Slider
                          value={[labelLineLength]}
                          min={0}
                          max={50}
                          step={1}
                          onValueChange={(values) => setLabelLineLength(values[0])}
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <Label className="text-xs">第二段长度</Label>
                          <span className="text-xs text-muted-foreground">{labelLineLength2}</span>
                        </div>
                        <Slider
                          value={[labelLineLength2]}
                          min={0}
                          max={50}
                          step={1}
                          onValueChange={(values) => setLabelLineLength2(values[0])}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">平滑曲线</Label>
                        <Switch 
                          checked={labelLineSmooth} 
                          onCheckedChange={setLabelLineSmooth} 
                        />
                      </div>
                    </>
                  )}
                  
                  <Button 
                    onClick={updatePieOptions} 
                    size="sm"
                    className="w-full h-8 mt-2 text-xs"
                  >
                    应用引导线设置
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