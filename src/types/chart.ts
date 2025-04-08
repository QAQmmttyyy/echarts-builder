// 图表位置和大小
export interface ChartPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 图表类型枚举
export enum ChartType {
  BAR = "bar",
  LINE = "line",
  PIE = "pie",
  SCATTER = "scatter",
  RADAR = "radar",
  HEATMAP = "heatmap",
  TREE = "tree",
  TREEMAP = "treemap",
  SUNBURST = "sunburst",
  BOXPLOT = "boxplot",
  CANDLESTICK = "candlestick",
  GAUGE = "gauge",
  FUNNEL = "funnel",
  SANKEY = "sankey",
  GRAPH = "graph",
}

// 图表元素接口
export interface ChartElement {
  id: string;
  type: ChartType;
  title: string;
  position: ChartPosition;
  options: Record<string, unknown>; // ECharts 配置项
  data: unknown; // 图表数据可能是数组或对象
}

// 支持拖放的预设图表类型
export interface ChartTemplate {
  type: ChartType;
  title: string;
  icon: string;
  description: string;
  defaultOptions: Record<string, unknown>;
  defaultData: unknown;
} 