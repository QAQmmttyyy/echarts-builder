"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from "@hello-pangea/dnd";
import { Plus, GripVertical, X, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// 引入配置树组件
import { ConfigTree } from "./config-tree";

interface ArrayEditorProps {
  label?: string;
  value: any[];
  onChange: (value: any[]) => void;
  renderItem?: (value: any, index: number, onChange: (newValue: any) => void) => React.ReactNode;
  getNewItem?: () => any;
}

export function ArrayEditor({
  label,
  value = [],
  onChange,
  renderItem,
  getNewItem = () => ""
}: ArrayEditorProps) {
  // 折叠状态管理
  const [collapsedItems, setCollapsedItems] = useState<Record<number, boolean>>({});
  
  // 切换折叠状态
  const toggleCollapse = (index: number) => {
    setCollapsedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // 添加新项
  const handleAddItem = () => {
    const newItem = getNewItem();
    onChange([...value, newItem]);
  };

  // 删除项
  const handleRemoveItem = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  // 更新数组中的项
  const handleItemChange = (index: number, newValue: any) => {
    const newArray = [...value];
    newArray[index] = newValue;
    onChange(newArray);
  };

  // 处理拖拽排序结果
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorder = (list: any[], startIndex: number, endIndex: number) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    const newItems = reorder(
      value,
      result.source.index,
      result.destination.index
    );

    onChange(newItems);
  };

  // 检查是否应该显示折叠图标 (对象或数组类型应该可折叠)
  const shouldShowCollapse = (item: any): boolean => {
    return typeof item === 'object' && item !== null;
  };

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <Label className="text-xs">{label}</Label>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs hover:bg-muted/60"
            onClick={handleAddItem}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            添加项
          </Button>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {value.map((item, index) => {
                const isCollapsed = collapsedItems[index] || false;
                const isCollapsible = shouldShowCollapse(item);
                
                return (
                  <Draggable 
                    key={`item-${index}`} 
                    draggableId={`item-${index}`} 
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-muted/40 hover:bg-muted/80 rounded-md p-2 relative group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div 
                              {...provided.dragHandleProps}
                              className="flex items-center mr-2 cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            
                            {isCollapsible && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 p-0 mr-1 hover:bg-muted/60"
                                onClick={() => toggleCollapse(index)}
                              >
                                {isCollapsed ? (
                                  <ChevronRight className="h-3.5 w-3.5" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            )}
                            
                            <span className="text-xs font-medium">项 {index + 1}</span>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted/60"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>
                        
                        <div className={cn(
                          "pl-6",
                          isCollapsed && isCollapsible ? "hidden" : "block"
                        )}>
                          {renderItem ? (
                            renderItem(item, index, (newValue) => handleItemChange(index, newValue))
                          ) : (
                            <div className="text-xs text-muted-foreground italic">
                              请提供renderItem函数来自定义渲染
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {value.length === 0 && (
        <div className="text-center p-4 border border-dashed rounded-md bg-muted/40 hover:bg-muted/80 transition-colors">
          <p className="text-xs text-muted-foreground mb-3">
            暂无项目
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs hover:bg-muted/60"
            onClick={handleAddItem}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            添加第一项
          </Button>
        </div>
      )}
    </div>
  );
} 