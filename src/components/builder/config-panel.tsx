"use client";

import { ChartElement } from "@/types/chart";
import { EchartsConfigPanel } from "./config-editor";

interface ConfigPanelProps {
  selectedChart: ChartElement | null;
  onUpdateChart: (chart: ChartElement) => void;
}

export function ConfigPanel({ selectedChart, onUpdateChart }: ConfigPanelProps) {
  return (
    <EchartsConfigPanel 
      selectedChart={selectedChart} 
      onUpdateChart={onUpdateChart} 
    />
  );
} 