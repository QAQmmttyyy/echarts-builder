"use client";

import { useState, useEffect } from "react";
import { ChartElement } from "@/types/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Settings2, 
  Type, 
  Layout, 
  MousePointer, 
  LineChart, 
  Circle, 
  Palette
} from "lucide-react";

interface BaseConfigPanelProps {
  chart: ChartElement;
  onUpdateChart: (chart: ChartElement) => void;
}

export function BaseConfigPanel({ chart, onUpdateChart }: BaseConfigPanelProps) {
  // 标题配置
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  
  // 提示框配置
  const [showTooltip, setShowTooltip] = useState(true);
  const [tooltipTrigger, setTooltipTrigger] = useState<'item' | 'axis' | 'none'>('item');
  
  // 图例配置
  const [showLegend, setShowLegend] = useState(true);
  const [legendPosition, setLegendPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('top');
  
  // 动画配置
  const [enableAnimation, setEnableAnimation] = useState(true);
  const [animationDuration, setAnimationDuration] = useState(1000);

  // 初始化配置
  useEffect(() => {
    if (chart && chart.options) {
      // 标题
      if (chart.options.title) {
        setTitle(chart.options.title.text || "");
        setSubTitle(chart.options.title.subtext || "");
      }
      
      // 提示框
      if (chart.options.tooltip) {
        setShowTooltip(chart.options.tooltip.show !== false);
        setTooltipTrigger((chart.options.tooltip.trigger || 'item') as 'item' | 'axis' | 'none');
      }
      
      // 图例
      if (chart.options.legend) {
        setShowLegend(chart.options.legend.show !== false);
        
        // 确定图例位置
        if (chart.options.legend.top === '0' || chart.options.legend.top === 0 || chart.options.legend.top === 'top') {
          setLegendPosition('top');
        } else if (chart.options.legend.bottom === '0' || chart.options.legend.bottom === 0 || chart.options.legend.bottom === 'bottom') {
          setLegendPosition('bottom');
        } else if (chart.options.legend.left === '0' || chart.options.legend.left === 0 || chart.options.legend.left === 'left') {
          setLegendPosition('left');
        } else if (chart.options.legend.right === '0' || chart.options.legend.right === 0 || chart.options.legend.right === 'right') {
          setLegendPosition('right');
        }
      }
      
      // 动画
      setEnableAnimation(chart.options.animation !== false);
      setAnimationDuration(chart.options.animationDuration || 1000);
    }
  }, [chart]);

  // 更新图表配置
  const updateChartOptions = () => {
    const updatedOptions = { ...chart.options };
    
    // 更新标题
    if (!updatedOptions.title) {
      updatedOptions.title = {};
    }
    updatedOptions.title.text = title;
    updatedOptions.title.subtext = subTitle;
    
    // 更新提示框
    if (!updatedOptions.tooltip) {
      updatedOptions.tooltip = {};
    }
    updatedOptions.tooltip.show = showTooltip;
    updatedOptions.tooltip.trigger = tooltipTrigger;
    
    // 更新图例
    if (!updatedOptions.legend) {
      updatedOptions.legend = {};
    }
    updatedOptions.legend.show = showLegend;
    
    // 根据选择设置图例位置
    updatedOptions.legend.top = undefined;
    updatedOptions.legend.bottom = undefined;
    updatedOptions.legend.left = undefined;
    updatedOptions.legend.right = undefined;
    
    switch (legendPosition) {
      case 'top':
        updatedOptions.legend.top = 0;
        break;
      case 'bottom':
        updatedOptions.legend.bottom = 0;
        break;
      case 'left':
        updatedOptions.legend.left = 0;
        break;
      case 'right':
        updatedOptions.legend.right = 0;
        break;
    }
    
    // 更新动画
    updatedOptions.animation = enableAnimation;
    updatedOptions.animationDuration = animationDuration;
    
    // 更新图表
    onUpdateChart({
      ...chart,
      options: updatedOptions
    });
  };

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general" className="flex items-center gap-1.5 text-xs py-1.5">
          <Settings2 className="h-3.5 w-3.5" />
          <span>常规</span>
        </TabsTrigger>
        <TabsTrigger value="appearance" className="flex items-center gap-1.5 text-xs py-1.5">
          <Palette className="h-3.5 w-3.5" />
          <span>外观</span>
        </TabsTrigger>
        <TabsTrigger value="interaction" className="flex items-center gap-1.5 text-xs py-1.5">
          <MousePointer className="h-3.5 w-3.5" />
          <span>交互</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="space-y-4 mt-4">
        <Accordion type="single" collapsible defaultValue="title">
          {/* 标题设置 */}
          <AccordionItem value="title">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">标题与描述</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 pt-1 px-0.5">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">标题</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="输入图表标题"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">副标题</Label>
                  <Input
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    placeholder="输入副标题（可选）"
                    className="h-8 text-xs"
                  />
                </div>
                <Button 
                  onClick={updateChartOptions} 
                  size="sm"
                  className="w-full h-8 mt-2 text-xs"
                >
                  应用更改
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          {/* 图例设置 */}
          <AccordionItem value="legend">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2">
                <Layout className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">图例</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 pt-1 px-0.5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">显示图例</Label>
                  <Switch 
                    checked={showLegend} 
                    onCheckedChange={setShowLegend} 
                  />
                </div>
                
                {showLegend && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">图例位置</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        type="button"
                        variant={legendPosition === 'top' ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setLegendPosition('top')}
                      >
                        顶部
                      </Button>
                      <Button 
                        type="button"
                        variant={legendPosition === 'bottom' ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setLegendPosition('bottom')}
                      >
                        底部
                      </Button>
                      <Button 
                        type="button"
                        variant={legendPosition === 'left' ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setLegendPosition('left')}
                      >
                        左侧
                      </Button>
                      <Button 
                        type="button"
                        variant={legendPosition === 'right' ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setLegendPosition('right')}
                      >
                        右侧
                      </Button>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={updateChartOptions} 
                  size="sm"
                  className="w-full h-8 mt-2 text-xs"
                >
                  应用更改
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>
      
      <TabsContent value="appearance" className="space-y-4 mt-4">
        <Accordion type="single" collapsible defaultValue="animation">
          {/* 动画设置 */}
          <AccordionItem value="animation">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2">
                <LineChart className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">动画</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 pt-1 px-0.5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">启用动画</Label>
                  <Switch 
                    checked={enableAnimation} 
                    onCheckedChange={setEnableAnimation} 
                  />
                </div>
                
                {enableAnimation && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs">动画持续时间</Label>
                      <div className="flex items-center">
                        <span className="text-xs text-muted-foreground mr-2">{animationDuration}ms</span>
                      </div>
                    </div>
                    <Slider
                      value={[animationDuration]}
                      min={0}
                      max={5000}
                      step={100}
                      onValueChange={(values) => setAnimationDuration(values[0])}
                    />
                  </div>
                )}
                
                <Button 
                  onClick={updateChartOptions} 
                  size="sm"
                  className="w-full h-8 mt-2 text-xs"
                >
                  应用更改
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>
      
      <TabsContent value="interaction" className="space-y-4 mt-4">
        <Accordion type="single" collapsible defaultValue="tooltip">
          {/* 提示框设置 */}
          <AccordionItem value="tooltip">
            <AccordionTrigger className="py-3">
              <div className="flex items-center gap-2">
                <Circle className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">提示框</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-3 pt-1 px-0.5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">显示提示框</Label>
                  <Switch 
                    checked={showTooltip} 
                    onCheckedChange={setShowTooltip} 
                  />
                </div>
                
                {showTooltip && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">触发类型</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        type="button"
                        variant={tooltipTrigger === 'item' ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setTooltipTrigger('item')}
                      >
                        数据项
                      </Button>
                      <Button 
                        type="button"
                        variant={tooltipTrigger === 'axis' ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setTooltipTrigger('axis')}
                      >
                        坐标轴
                      </Button>
                      <Button 
                        type="button"
                        variant={tooltipTrigger === 'none' ? "default" : "outline"}
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setTooltipTrigger('none')}
                      >
                        无
                      </Button>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={updateChartOptions} 
                  size="sm"
                  className="w-full h-8 mt-2 text-xs"
                >
                  应用更改
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>
    </Tabs>
  );
} 