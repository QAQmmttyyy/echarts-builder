import { ChartType } from "./chart";

// 基础配置接口，适用于所有图表类型
export interface BaseChartOptions {
  title?: {
    text?: string;
    subtext?: string;
    left?: string | number;
    top?: string | number;
    textStyle?: {
      color?: string;
      fontStyle?: 'normal' | 'italic' | 'oblique';
      fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
      fontFamily?: string;
      fontSize?: number;
    };
    subtextStyle?: {
      color?: string;
      fontStyle?: 'normal' | 'italic' | 'oblique';
      fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
      fontFamily?: string;
      fontSize?: number;
    };
  };
  tooltip?: {
    show?: boolean;
    trigger?: 'item' | 'axis' | 'none';
    formatter?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    padding?: number | number[];
    textStyle?: {
      color?: string;
      fontSize?: number;
    };
  };
  legend?: {
    show?: boolean;
    type?: 'plain' | 'scroll';
    orient?: 'horizontal' | 'vertical';
    left?: string | number;
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    data?: string[];
    textStyle?: {
      color?: string;
      fontSize?: number;
    };
  };
  grid?: {
    show?: boolean;
    left?: string | number;
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    containLabel?: boolean;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  };
  color?: string[];
  backgroundColor?: string;
  animation?: boolean;
  animationDuration?: number;
  animationEasing?: string;
}

// 坐标轴配置接口
export interface AxisOptions {
  show?: boolean;
  type?: 'value' | 'category' | 'time' | 'log';
  name?: string;
  nameLocation?: 'start' | 'middle' | 'end';
  nameTextStyle?: {
    color?: string;
    fontSize?: number;
    fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
  };
  nameGap?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
  axisLine?: {
    show?: boolean;
    lineStyle?: {
      color?: string;
      width?: number;
      type?: 'solid' | 'dashed' | 'dotted';
    };
  };
  axisTick?: {
    show?: boolean;
    alignWithLabel?: boolean;
    length?: number;
    lineStyle?: {
      color?: string;
      width?: number;
      type?: 'solid' | 'dashed' | 'dotted';
    };
  };
  axisLabel?: {
    show?: boolean;
    formatter?: string;
    rotate?: number;
    margin?: number;
    textStyle?: {
      color?: string;
      fontSize?: number;
    };
  };
  splitLine?: {
    show?: boolean;
    lineStyle?: {
      color?: string;
      width?: number;
      type?: 'solid' | 'dashed' | 'dotted';
    };
  };
  data?: (string | number)[];
}

// 柱状图配置接口
export interface BarChartOptions extends BaseChartOptions {
  xAxis?: AxisOptions;
  yAxis?: AxisOptions;
  series?: {
    type: 'bar';
    name?: string;
    stack?: string;
    barWidth?: string | number;
    barGap?: string | number;
    barCategoryGap?: string | number;
    itemStyle?: {
      color?: string;
      borderColor?: string;
      borderWidth?: number;
      borderType?: 'solid' | 'dashed' | 'dotted';
      borderRadius?: number | number[];
      opacity?: number;
    };
    emphasis?: {
      itemStyle?: {
        color?: string;
        borderColor?: string;
        borderWidth?: number;
        borderType?: 'solid' | 'dashed' | 'dotted';
        borderRadius?: number | number[];
        opacity?: number;
      };
    };
    label?: {
      show?: boolean;
      position?: 'top' | 'left' | 'right' | 'bottom' | 'inside' | 'insideLeft' | 'insideRight' | 'insideTop' | 'insideBottom';
      formatter?: string;
      fontSize?: number;
      color?: string;
    };
    data?: (number | { value: number; name: string })[];
  }[];
}

// 折线图配置接口
export interface LineChartOptions extends BaseChartOptions {
  xAxis?: AxisOptions;
  yAxis?: AxisOptions;
  series?: {
    type: 'line';
    name?: string;
    symbol?: 'circle' | 'rect' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow' | 'none';
    symbolSize?: number;
    showSymbol?: boolean;
    smooth?: boolean;
    lineStyle?: {
      color?: string;
      width?: number;
      type?: 'solid' | 'dashed' | 'dotted';
      opacity?: number;
    };
    areaStyle?: {
      color?: string;
      opacity?: number;
    };
    emphasis?: {
      lineStyle?: {
        color?: string;
        width?: number;
        type?: 'solid' | 'dashed' | 'dotted';
        opacity?: number;
      };
    };
    label?: {
      show?: boolean;
      position?: 'top' | 'left' | 'right' | 'bottom';
      formatter?: string;
      fontSize?: number;
      color?: string;
    };
    data?: (number | { value: number; name: string })[];
  }[];
}

// 饼图配置接口
export interface PieChartOptions extends BaseChartOptions {
  series?: {
    type: 'pie';
    name?: string;
    radius?: string | number | (string | number)[];
    center?: (string | number)[];
    roseType?: boolean | 'radius' | 'area';
    selectedMode?: boolean | 'single' | 'multiple';
    clockwise?: boolean;
    startAngle?: number;
    minAngle?: number;
    avoidLabelOverlap?: boolean;
    label?: {
      show?: boolean;
      position?: 'outside' | 'inside' | 'center';
      formatter?: string;
      fontSize?: number;
      color?: string;
    };
    labelLine?: {
      show?: boolean;
      length?: number;
      length2?: number;
      smooth?: boolean;
    };
    itemStyle?: {
      color?: string;
      borderColor?: string;
      borderWidth?: number;
      borderType?: 'solid' | 'dashed' | 'dotted';
      borderRadius?: number;
      opacity?: number;
    };
    emphasis?: {
      scale?: boolean;
      scaleSize?: number;
      itemStyle?: {
        color?: string;
        borderColor?: string;
        borderWidth?: number;
        borderType?: 'solid' | 'dashed' | 'dotted';
        borderRadius?: number;
        opacity?: number;
      };
    };
    data?: { value: number; name: string }[];
  }[];
}

// 散点图配置接口
export interface ScatterChartOptions extends BaseChartOptions {
  xAxis?: AxisOptions;
  yAxis?: AxisOptions;
  series?: {
    type: 'scatter';
    name?: string;
    symbol?: 'circle' | 'rect' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow';
    symbolSize?: number | ((value: any) => number);
    symbolRotate?: number;
    large?: boolean;
    largeThreshold?: number;
    itemStyle?: {
      color?: string;
      opacity?: number;
    };
    emphasis?: {
      itemStyle?: {
        color?: string;
        opacity?: number;
        borderColor?: string;
        borderWidth?: number;
      }
    };
    data?: [number, number][] | { x: number; y: number }[];
  }[];
}

// 雷达图配置接口
export interface RadarChartOptions extends BaseChartOptions {
  radar?: {
    indicator: { name: string; max: number }[];
    center?: (string | number)[];
    radius?: number | string;
    startAngle?: number;
    shape?: 'polygon' | 'circle';
    splitNumber?: number;
    axisName?: {
      show?: boolean;
      formatter?: string;
    };
    axisLine?: {
      show?: boolean;
      lineStyle?: {
        color?: string;
        width?: number;
        type?: 'solid' | 'dashed' | 'dotted';
      };
    };
    splitLine?: {
      show?: boolean;
      lineStyle?: {
        color?: string;
        width?: number;
        type?: 'solid' | 'dashed' | 'dotted';
      };
    };
  };
  series?: {
    type: 'radar';
    name?: string;
    symbol?: 'circle' | 'rect' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow' | 'none';
    symbolSize?: number;
    lineStyle?: {
      color?: string;
      width?: number;
      type?: 'solid' | 'dashed' | 'dotted';
    };
    areaStyle?: {
      color?: string;
      opacity?: number;
    };
    itemStyle?: {
      color?: string;
      borderColor?: string;
      borderWidth?: number;
      opacity?: number;
    };
    emphasis?: {
      itemStyle?: {
        color?: string;
        borderColor?: string;
        borderWidth?: number;
        opacity?: number;
      };
    };
    data?: {
      value: number[];
      name: string;
    }[];
  }[];
}

// 热力图配置接口
export interface HeatmapChartOptions extends BaseChartOptions {
  xAxis?: AxisOptions;
  yAxis?: AxisOptions;
  visualMap?: {
    min?: number;
    max?: number;
    calculable?: boolean;
    orient?: 'horizontal' | 'vertical';
    left?: string | number;
    bottom?: string | number;
    inRange?: {
      color?: string[];
    };
  };
  series?: {
    type: 'heatmap';
    name?: string;
    data?: [number, number, number][];
    emphasis?: {
      itemStyle?: {
        shadowBlur?: number;
        shadowColor?: string;
      };
    };
  }[];
}

// 根据图表类型获取对应的配置项接口
export type ChartOptionsType = 
  | BarChartOptions
  | LineChartOptions
  | PieChartOptions
  | ScatterChartOptions
  | RadarChartOptions
  | HeatmapChartOptions;

// 获取图表类型对应的配置项接口
export function getChartOptionsInterface(type: ChartType): ChartOptionsType {
  switch (type) {
    case ChartType.BAR:
      return {} as BarChartOptions;
    case ChartType.LINE:
      return {} as LineChartOptions;
    case ChartType.PIE:
      return {} as PieChartOptions;
    case ChartType.SCATTER:
      return {} as ScatterChartOptions;
    case ChartType.RADAR:
      return {} as RadarChartOptions;
    case ChartType.HEATMAP:
      return {} as HeatmapChartOptions;
    default:
      return {} as BaseChartOptions;
  }
} 