"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StringEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function StringEditor({ 
  label, 
  value, 
  onChange, 
  placeholder = "输入文本值" 
}: StringEditorProps) {
  return (
    <div className="space-y-2">
      {label && <Label className="text-xs">{label}</Label>}
      <Input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 text-xs"
      />
    </div>
  );
} 