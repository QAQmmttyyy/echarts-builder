"use client";

import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectEditorProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SelectEditor({ 
  label, 
  value, 
  options, 
  onChange, 
  placeholder = "选择一个选项" 
}: SelectEditorProps) {
  return (
    <div className="space-y-2">
      {label && <Label className="text-xs">{label}</Label>}
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger className="h-9 text-xs">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="text-xs"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 