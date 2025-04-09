"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { StringEditor } from "./string-editor";
import { NumberEditor } from "./number-editor";
import { BooleanEditor } from "./boolean-editor";
import { ColorEditor } from "./color-editor";
import { SelectEditor } from "./select-editor";
import { ArrayEditor } from "./array-editor";
import { ChevronRight, ChevronDown, Plus, X, ChevronUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// 获取值的类型
function getValueType(value: any): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  
  // 检测颜色值
  if (typeof value === 'string' && /^#([0-9A-F]{3}){1,2}$/i.test(value)) {
    return 'color';
  }
  
  return typeof value;
}

// 根据ECharts配置项名称获取默认类型和值
export function getEChartsDefaultConfig(key: string): { type: string, value: any } {
  // 顶级配置项的默认值映射
  const configDefaults: Record<string, { type: string, value: any }> = {
    // 标题相关
    title: { type: 'object', value: { text: '标题' } },
    
    // 坐标轴相关
    xAxis: { type: 'object', value: { type: 'category', data: [] } },
    yAxis: { type: 'object', value: { type: 'value' } },
    grid: { type: 'object', value: { containLabel: true } },
    
    // 图例相关
    legend: { type: 'object', value: { show: true } },
    
    // 提示框相关
    tooltip: { type: 'object', value: { trigger: 'item', show: true } },
    
    // 工具箱相关
    toolbox: { type: 'object', value: { show: true, feature: {} } },
    
    // 系列相关
    series: { type: 'array', value: [] },
    
    // 视觉映射相关
    visualMap: { type: 'object', value: { show: true, min: 0, max: 100 } },
    
    // 数据区域缩放相关
    dataZoom: { type: 'array', value: [] },
    
    // 极坐标系相关
    polar: { type: 'object', value: {} },
    radiusAxis: { type: 'object', value: {} },
    angleAxis: { type: 'object', value: {} },
    
    // 雷达图相关
    radar: { type: 'object', value: { indicator: [] } },
    
    // 地图相关
    geo: { type: 'object', value: {} },
    
    // 颜色配置
    color: { type: 'array', value: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'] },
    
    // 样式相关
    textStyle: { type: 'object', value: {} },
    
    // 动画相关
    animation: { type: 'boolean', value: true },
    animationDuration: { type: 'number', value: 1000 },
    animationEasing: { type: 'string', value: 'cubicOut' },
    
    // 默认配置，如果配置项名称不在预设列表中
    default: { type: 'string', value: '' }
  };

  return configDefaults[key] || configDefaults.default;
}

// 创建新配置项对话框
function AddPropertyDialog({
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
          className="h-7 text-xs w-full bg-background/50 hover:bg-background border-dashed"
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

// 配置项标题组件，用于所有类型
function ConfigItemHeader({ 
  label, 
  type, 
  count, 
  onDelete, 
  isCollapsible = false,
  isCollapsed = false,
  onToggle,
  onAddChild,
  canAddChild = false
}: { 
  label: string; 
  type: string;
  count?: number;
  onDelete: () => void;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  onToggle?: () => void;
  onAddChild?: () => void;
  canAddChild?: boolean;
}) {
  return (
    <div className="flex items-center py-1.5 group">
      {isCollapsible && (
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 p-0 mr-1"
          onClick={onToggle}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </Button>
      )}
      <span className="text-xs font-medium flex-1 truncate">{label}</span>
      {count !== undefined && (
        <span className="text-[10px] text-muted-foreground mx-1">
          {count} 项
        </span>
      )}
      {canAddChild && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onAddChild}
          title="添加子项"
        >
          <Plus className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 p-0 rounded-full ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onDelete}
      >
        <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
      </Button>
    </div>
  );
}

interface ConfigTreeProps {
  data: Record<string, any>;
  path?: string;
  onChange: (path: string, value: any) => void;
  onDelete?: (path: string) => void;
  suggestedKeys?: string[];
  level?: number;
  hideAddButton?: boolean;
}

export function ConfigTree({
  data,
  path = '',
  onChange,
  onDelete,
  suggestedKeys = [],
  level = 0,
  hideAddButton = false
}: ConfigTreeProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [dialogParentPath, setDialogParentPath] = useState<string>("");
  const [dialogSuggestions, setDialogSuggestions] = useState<string[]>([]);
  const [collapsedItems, setCollapsedItems] = useState<Record<string, boolean>>({});
  
  // 处理值的修改
  const handleValueChange = (key: string, value: any) => {
    const newPath = path ? `${path}.${key}` : key;
    onChange(newPath, value);
  };
  
  // 处理添加新配置项
  const handleAddProperty = (key: string, value: any) => {
    const newPath = path ? `${path}.${key}` : key;
    onChange(newPath, value);
  };
  
  // 处理删除配置项
  const handleDeleteProperty = (key: string) => {
    const newPath = path ? `${path}.${key}` : key;
    if (onDelete) {
      onDelete(newPath);
    } else {
      onChange(newPath, undefined);
    }
  };
  
  // 切换折叠状态
  const toggleCollapse = (key: string) => {
    setCollapsedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // 处理添加子项的对话框
  const openAddChildDialog = useCallback((parentPath: string, suggestions: string[] = []) => {
    setDialogParentPath(parentPath);
    setDialogSuggestions(suggestions);
    setAddDialogOpen(true);
  }, []);

  // 处理添加子项
  const handleAddChildProperty = useCallback((key: string, value: any) => {
    const newPath = dialogParentPath ? `${dialogParentPath}.${key}` : key;
    onChange(newPath, value);
    setAddDialogOpen(false);
  }, [dialogParentPath, onChange]);
  
  // 渲染特定类型的编辑器
  const renderEditor = (key: string, value: any) => {
    const type = getValueType(value);
    const itemPath = path ? `${path}.${key}` : key;
    const isCollapsed = collapsedItems[key] || false;
    
    // 判断是否需要折叠
    const isCollapsible = type === 'object' || type === 'array';
    
    // 配置项的公共头部
    const headerComponent = (
      <ConfigItemHeader
        label={key}
        type={type}
        count={type === 'object' ? Object.keys(value).length : (type === 'array' ? value.length : undefined)}
        onDelete={() => handleDeleteProperty(key)}
        isCollapsible={isCollapsible}
        isCollapsed={isCollapsed}
        onToggle={() => toggleCollapse(key)}
        onAddChild={() => {
          // 为对象或数组类型打开添加子项对话框
          const pathParts = itemPath.split('.');
          const suggestions = getEChartsOptionSuggestions(pathParts);
          openAddChildDialog(itemPath, suggestions);
        }}
        canAddChild={type === 'object' || type === 'array'}
      />
    );
    
    let content: React.ReactNode;
    
    switch (type) {
      case 'string':
        content = (
          <div className="ml-6">
            <StringEditor
              value={value}
              onChange={(newValue) => handleValueChange(key, newValue)}
            />
          </div>
        );
        break;
        
      case 'number':
        content = (
          <div className="ml-6">
            <NumberEditor
              value={value}
              onChange={(newValue) => handleValueChange(key, newValue)}
            />
          </div>
        );
        break;
        
      case 'boolean':
        // 布尔值特殊处理，不需要缩进
        return (
          <div className="flex items-center justify-between py-1">
            <BooleanEditor
              label={key}
              value={value}
              onChange={(newValue) => handleValueChange(key, newValue)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDeleteProperty(key)}
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        );
        
      case 'color':
        content = (
          <div className="ml-6">
            <ColorEditor
              value={value}
              onChange={(newValue) => handleValueChange(key, newValue)}
            />
          </div>
        );
        break;
        
      case 'array':
        content = (
          <div className={cn("mt-1", isCollapsed ? "hidden" : "block")}>
            <ArrayEditor
              value={value}
              onChange={(newValue) => handleValueChange(key, newValue)}
              renderItem={(item, index, onItemChange) => {
                const itemType = getValueType(item);
                
                if (itemType === 'object') {
                  return (
                    <ConfigTree
                      data={item}
                      path={`${itemPath}[${index}]`}
                      onChange={onChange}
                      level={level + 1}
                    />
                  );
                }
                
                switch (itemType) {
                  case 'string':
                    return <StringEditor value={item} onChange={onItemChange} />;
                  case 'number':
                    return <NumberEditor value={item} onChange={onItemChange} />;
                  case 'boolean':
                    return <BooleanEditor label="值" value={item} onChange={onItemChange} />;
                  case 'color':
                    return <ColorEditor value={item} onChange={onItemChange} />;
                  default:
                    return <div>不支持的类型: {itemType}</div>;
                }
              }}
              getNewItem={() => {
                // 根据数组中第一项的类型返回新项
                if (value.length > 0) {
                  const firstItem = value[0];
                  const firstItemType = getValueType(firstItem);
                  
                  switch (firstItemType) {
                    case 'string': return '';
                    case 'number': return 0;
                    case 'boolean': return false;
                    case 'object': return {};
                    case 'color': return '#1677ff';
                    default: return '';
                  }
                }
                
                return '';
              }}
            />
          </div>
        );
        break;
        
      case 'object':
        if (Object.keys(value).length === 0) {
          content = (
            <div className="mt-1 ml-6">
              <AddPropertyDialog
                onAdd={(subKey, subValue) => onChange(`${itemPath}.${subKey}`, subValue)}
              />
            </div>
          );
        } else {
          content = (
            <div className={cn(
              "pl-5 border-l border-muted-foreground/10 space-y-3 ml-1.5 pt-1",
              isCollapsed ? "hidden" : "block"
            )}>
              <ConfigTree
                data={value}
                path={itemPath}
                onChange={onChange}
                onDelete={onDelete}
                level={level + 1}
              />
            </div>
          );
        }
        break;
        
      default:
        content = <div className="ml-6">不支持的类型: {type}</div>;
        break;
    }
    
    // 布尔类型已经单独处理
    if (type === 'boolean') return content;
    
    // 对于可折叠的类型（对象和数组），使用自定义的折叠逻辑
    if (isCollapsible) {
      return (
        <div className="bg-muted/40 hover:bg-muted/60 rounded-md p-2 transition-colors">
          {headerComponent}
          {content}
        </div>
      );
    }
    
    // 其他类型使用简单布局
    return (
      <div className="hover:bg-muted/30 rounded-md p-2 transition-colors group">
        {headerComponent}
        {content}
      </div>
    );
  };

  // 过滤掉undefined值
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined)
  );

  return (
    <div className="space-y-2">
      {Object.entries(filteredData).map(([key, value]) => (
        <div key={key}>
          {renderEditor(key, value)}
        </div>
      ))}
      
      {level === 0 && !hideAddButton && (
        <div className="mt-3 pt-3 border-t border-border">
          <AddPropertyDialog
            onAdd={handleAddProperty}
            suggestedKeys={suggestedKeys}
          />
        </div>
      )}

      {/* 添加子项对话框 */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加子配置项</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <AddPropertyDialog
              onAdd={handleAddChildProperty}
              suggestedKeys={dialogSuggestions}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 获取ECharts选项的建议属性
function getEChartsOptionSuggestions(pathParts: string[]): string[] {
  // 导入ECharts选项定义
  const { EChartsOptions } = require('@/lib/echarts-options');
  
  // 根据路径获取当前节点的定义
  let currentNode = EChartsOptions;
  for (let i = 0; i < pathParts.length; i++) {
    const part = pathParts[i];
    if (part && currentNode.children && currentNode.children[part]) {
      currentNode = currentNode.children[part];
    } else if (part && currentNode.items) {
      // 处理数组的情况
      currentNode = currentNode.items;
    } else {
      // 找不到对应的节点，返回空数组
      return [];
    }
  }

  // 返回当前节点的子属性作为建议
  if (currentNode.children) {
    return Object.keys(currentNode.children);
  }
  
  // 如果是数组节点，返回数组项的子属性
  if (currentNode.items && currentNode.items.children) {
    return Object.keys(currentNode.items.children);
  }
  
  return [];
} 