"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ColorEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorEditor({ label, value, onChange }: ColorEditorProps) {
  const [colorValue, setColorValue] = useState<string>(value || "#1677ff");
  
  // 当外部值改变时更新内部状态
  useEffect(() => {
    if (value) {
      setColorValue(value);
    }
  }, [value]);

  // 处理输入框变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setColorValue(newValue);
    onChange(newValue);
  };

  // 处理颜色选择器变化
  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setColorValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-xs">{label}</Label>}
      <div className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <div 
              className="w-9 h-9 rounded-md cursor-pointer border border-border shadow-sm"
              style={{ backgroundColor: colorValue }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3">
            <input
              type="color"
              value={colorValue}
              onChange={handlePickerChange}
              className="w-36 h-36"
            />
          </PopoverContent>
        </Popover>
        
        <Input
          type="text"
          value={colorValue}
          onChange={handleInputChange}
          className={cn(
            "h-9 text-xs",
            "pl-2.5 font-mono",
            "flex-1"
          )}
        />
      </div>
    </div>
  );
} 