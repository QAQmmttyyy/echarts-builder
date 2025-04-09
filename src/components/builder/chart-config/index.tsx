"use client";

import { ChartElement, ChartType } from "@/types/chart";
import { BaseConfigPanel } from "./base-config";
import { BarConfigPanel } from "./bar-config";
import { LineConfigPanel } from "./line-config";
import { PieConfigPanel } from "./pie-config";
import { ScatterConfigPanel } from "./scatter-config";
import { RadarConfigPanel } from "./radar-config";
import { HeatmapConfigPanel } from "./heatmap-config";

interface ChartConfigProps {
  chart: ChartElement;
  onUpdateChart: (chart: ChartElement) => void;
}

export function ChartConfig({ chart, onUpdateChart }: ChartConfigProps) {
  // 根据图表类型渲染对应的配置面板
  const renderConfigPanel = () => {
    switch (chart.type) {
      case ChartType.BAR:
        return <BarConfigPanel chart={chart} onUpdateChart={onUpdateChart} />;
      case ChartType.LINE:
        return <LineConfigPanel chart={chart} onUpdateChart={onUpdateChart} />;
      case ChartType.PIE:
        return <PieConfigPanel chart={chart} onUpdateChart={onUpdateChart} />;
      case ChartType.SCATTER:
        return <ScatterConfigPanel chart={chart} onUpdateChart={onUpdateChart} />;
      case ChartType.RADAR:
        return <RadarConfigPanel chart={chart} onUpdateChart={onUpdateChart} />;
      case ChartType.HEATMAP:
        return <HeatmapConfigPanel chart={chart} onUpdateChart={onUpdateChart} />;
      default:
        // 对于未特别处理的图表类型，使用基础配置面板
        return <BaseConfigPanel chart={chart} onUpdateChart={onUpdateChart} />;
    }
  };

  return <div className="space-y-4">{renderConfigPanel()}</div>;
} 