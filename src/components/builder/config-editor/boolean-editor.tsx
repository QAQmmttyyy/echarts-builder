"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface BooleanEditorProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function BooleanEditor({ label, value, onChange }: BooleanEditorProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <Label className="text-xs">{label}</Label>
      <Switch 
        checked={!!value} 
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
} 