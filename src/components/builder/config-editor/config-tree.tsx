"use client";

import React, { useState, useCallback, useEffect } from "react";
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
import { getAvailableChildrenByPath, getEChartsOptionByPath, EChartsOptions } from '@/lib/echarts-options';

// 定义我们需要的类型
type OptionType = 'string' | 'number' | 'boolean' | 'color' | 'object' | 'array' | 'select';

// 配置项类型定义，与 echarts-options.ts 中的定义匹配
interface OptionItemType {
  type: OptionType;
  default?: any;
  options?: Array<{value: string; label: string}>;
  children?: Record<string, any>;
  itemType?: any;
}

// 获取值的类型
function getValueType(value: any): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  
  // 检测颜色值
  if (typeof value === 'string' && /^#([0-9A-F]{3}){1,2}$/i.test(value)) {
    return 'color';
  }
  
  // 我们不能在这里检测 select 类型，因为它依赖于路径信息
  // select 类型的检测将在 renderEditor 函数中处理
  
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
  parentPath = '',
  triggerButtonText = "添加配置项",
  inDialog = false
}: {
  onAdd: (key: string, value: any) => void;
  suggestedKeys?: string[];
  parentPath?: string;
  triggerButtonText?: string;
  inDialog?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [availableItems, setAvailableItems] = useState<Array<{key: string; type: string; description?: string}>>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // 加载可用配置项
  useEffect(() => {
    // 如果是在已打开的对话框中使用，或者当前对话框已打开
    if (inDialog || isOpen) {
      try {
        // 尝试从 ECharts 选项定义中获取可用子项
        const children = getAvailableChildrenByPath(parentPath);
        
        // 转换为界面显示格式
        const items = children.map(({ key, option }: { key: string; option: any }) => ({
          key,
          type: option.type,
          description: getTypeDescription(option.type)
        }));
        
        setAvailableItems(items);
        
        // 如果有建议键，也添加到可用项中
        if (suggestedKeys.length > 0) {
          const extraItems = suggestedKeys
            .filter(k => !items.some((item: {key: string}) => item.key === k))
            .map(k => {
              const { type } = getEChartsDefaultConfig(k);
              return {
                key: k,
                type,
                description: getTypeDescription(type)
              };
            });
          
          setAvailableItems([...items, ...extraItems]);
        }
      } catch (error) {
        console.error("加载可用配置项失败", error);
        // 备用方案：使用建议键
        if (suggestedKeys.length > 0) {
          const items = suggestedKeys.map(k => {
            const { type } = getEChartsDefaultConfig(k);
            return {
              key: k,
              type,
              description: getTypeDescription(type)
            };
          });
          setAvailableItems(items);
        }
      }
    }
  }, [isOpen, parentPath, suggestedKeys, inDialog]);
  
  // 获取类型的描述
  const getTypeDescription = (type: string): string => {
    const typeMap: Record<string, string> = {
      'string': '文本',
      'number': '数值',
      'boolean': '布尔值',
      'color': '颜色值',
      'object': '对象',
      'array': '数组',
      'select': '选择项'
    };
    return typeMap[type] || type;
  };
  
  const handleAdd = () => {
    if (!key.trim()) return;
    
    // 根据配置项名称获取默认类型和值
    const { type, value } = getEChartsDefaultConfig(key.trim());
    
    onAdd(key, value);
    setKey("");
    setSearchTerm("");
    
    // 只有在独立对话框模式下才关闭对话框
    if (!inDialog) {
      setIsOpen(false);
    }
  };
  
  // 过滤可用项
  const filteredItems = searchTerm
    ? availableItems.filter(item => 
        item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : availableItems;
  
  // 对话框内的内容
  const dialogContent = (
    <>
      <div className="space-y-1.5">
        <label className="text-xs font-medium">配置项键名</label>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索配置项..."
          className="h-8 text-xs"
          autoComplete="off"
        />
        <Input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="输入配置项键名"
          className="h-8 text-xs mt-2"
          autoComplete="off"
        />
      </div>
      
      {filteredItems.length > 0 && (
        <div className="max-h-[250px] overflow-y-auto mt-3">
          <ScrollArea className="h-full w-full rounded-md border p-2">
            <div className="space-y-1">
              {filteredItems.map((item) => (
                <div
                  key={item.key}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted",
                    key === item.key && "bg-muted"
                  )}
                  onClick={() => setKey(item.key)}
                >
                  <div className="flex items-center">
                    <span className="text-xs font-medium">{item.key}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full",
                      item.type === 'object' && "bg-blue-100 text-blue-800",
                      item.type === 'array' && "bg-green-100 text-green-800",
                      item.type === 'string' && "bg-purple-100 text-purple-800",
                      item.type === 'number' && "bg-orange-100 text-orange-800",
                      item.type === 'boolean' && "bg-yellow-100 text-yellow-800",
                      item.type === 'color' && "bg-pink-100 text-pink-800",
                      item.type === 'select' && "bg-indigo-100 text-indigo-800",
                    )}>
                      {item.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground mt-3">
        根据 ECharts 的配置项名称，将自动确定其值类型。例如，添加 "title" 将创建对象类型，而 "series" 将创建数组类型。
      </p>
      
      {inDialog && (
        <div className="flex justify-end mt-4">
          <Button 
            type="submit" 
            size="sm"
            onClick={handleAdd}
            disabled={!key.trim()}
          >
            添加
          </Button>
        </div>
      )}
    </>
  );
  
  // 如果是在父对话框中使用，直接返回内容
  if (inDialog) {
    return dialogContent;
  }
  
  // 否则返回带有触发器的对话框
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 text-xs w-full bg-background/50 hover:bg-background border-dashed"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          {triggerButtonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加新配置项</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          {dialogContent}
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
    
    // 检查是否为 select 类型
    let effectiveType = type;
    let selectOptions: Array<{value: string; label: string}> = [];
    
    try {
      const option = getEChartsOptionByPath(itemPath);
      if (option && option.type === 'select' && option.options) {
        effectiveType = 'select';
        selectOptions = option.options;
      }
    } catch (error) {
      console.error("检测 select 类型失败", error);
    }
    
    // 配置项的公共头部
    const headerComponent = (
      <ConfigItemHeader
        label={key}
        type={effectiveType}
        count={type === 'object' ? Object.keys(value).length : (type === 'array' ? value.length : undefined)}
        onDelete={() => handleDeleteProperty(key)}
        isCollapsible={isCollapsible}
        isCollapsed={isCollapsed}
        onToggle={() => toggleCollapse(key)}
        onAddChild={() => {
          // 为对象或数组类型直接打开添加子项对话框
          const pathParts = itemPath.split('.');
          const suggestions = getEChartsOptionSuggestions(pathParts);
          // 直接设置状态并打开对话框
          setDialogParentPath(itemPath);
          setDialogSuggestions(suggestions);
          setAddDialogOpen(true);
        }}
        canAddChild={type === 'object' || type === 'array'}
      />
    );
    
    let content: React.ReactNode;
    
    switch (effectiveType) {
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
      
      case 'select':
        content = (
          <div className="ml-6">
            <SelectEditor
              value={value}
              options={selectOptions}
              onChange={(newValue) => handleValueChange(key, newValue)}
            />
          </div>
        );
        break;
        
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
                  case 'select':
                    // 尝试获取选项信息
                    try {
                      const arrayPath = itemPath;
                      const option = getEChartsOptionByPath(arrayPath);
                      
                      if (option && option.itemType && option.itemType.options) {
                        return (
                          <SelectEditor
                            value={item}
                            options={option.itemType.options}
                            onChange={onItemChange}
                          />
                        );
                      }
                    } catch (error) {
                      console.error("渲染数组内的选择项失败", error);
                    }
                    // 降级为字符串编辑器
                    return <StringEditor value={item} onChange={onItemChange} />;
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
                    case 'select': 
                      // 尝试获取第一个选项的值作为默认值
                      try {
                        const option = getEChartsOptionByPath(itemPath);
                        if (option && option.itemType && option.itemType.options && option.itemType.options.length > 0) {
                          return option.itemType.options[0].value;
                        }
                      } catch (error) {
                        console.error("获取 select 默认值失败", error);
                      }
                      return '';
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
                parentPath={itemPath}
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
        content = <div className="ml-6">不支持的类型: {effectiveType}</div>;
        break;
    }
    
    // 布尔类型已经单独处理
    if (effectiveType === 'boolean') return content;
    
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
            parentPath={path}
          />
        </div>
      )}

      {/* 添加子项对话框 */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加子配置项</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <AddPropertyDialog
              onAdd={handleAddChildProperty}
              suggestedKeys={dialogSuggestions}
              parentPath={dialogParentPath}
              inDialog={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 获取ECharts选项的建议属性
function getEChartsOptionSuggestions(pathParts: string[]): string[] {
  // 根据路径获取当前节点的定义
  let currentNode: any = EChartsOptions;
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