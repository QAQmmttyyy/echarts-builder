"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NumberEditorProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export function NumberEditor({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit
}: NumberEditorProps) {
  const [inputValue, setInputValue] = useState<string>(value?.toString() || "0");

  // 当外部值改变时更新内部状态
  useEffect(() => {
    setInputValue(value?.toString() || "0");
  }, [value]);

  // 处理输入框变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // 确保输入值是有效数字
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-xs">{label}</Label>}
      
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          className="h-9 text-xs"
        />
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
} 