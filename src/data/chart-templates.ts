import { ChartTemplate, ChartType } from "@/types/chart";

export const chartTemplates: ChartTemplate[] = [
  {
    type: ChartType.BAR,
    title: "柱状图",
    icon: "bar-chart",
    description: "用于展示分类数据之间的比较",
    defaultOptions: {
      title: {
        text: "柱状图示例",
      },
      xAxis: {
        type: "category",
        data: ["一月", "二月", "三月", "四月", "五月"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [120, 200, 150, 80, 70],
          type: "bar",
        },
      ],
    },
    defaultData: [
      { name: "一月", value: 120 },
      { name: "二月", value: 200 },
      { name: "三月", value: 150 },
      { name: "四月", value: 80 },
      { name: "五月", value: 70 },
    ],
  },
  {
    type: ChartType.LINE,
    title: "折线图",
    icon: "line-chart",
    description: "用于展示数据随时间的变化趋势",
    defaultOptions: {
      title: {
        text: "折线图示例",
      },
      xAxis: {
        type: "category",
        data: ["一月", "二月", "三月", "四月", "五月"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [120, 132, 101, 134, 90],
          type: "line",
        },
      ],
    },
    defaultData: [
      { name: "一月", value: 120 },
      { name: "二月", value: 132 },
      { name: "三月", value: 101 },
      { name: "四月", value: 134 },
      { name: "五月", value: 90 },
    ],
  },
  {
    type: ChartType.PIE,
    title: "饼图",
    icon: "pie-chart",
    description: "用于展示部分与整体的关系",
    defaultOptions: {
      title: {
        text: "饼图示例",
      },
      series: [
        {
          type: "pie",
          radius: "50%",
          data: [
            { value: 335, name: "直接访问" },
            { value: 310, name: "邮件营销" },
            { value: 234, name: "联盟广告" },
            { value: 135, name: "视频广告" },
            { value: 1548, name: "搜索引擎" },
          ],
        },
      ],
    },
    defaultData: [
      { name: "直接访问", value: 335 },
      { name: "邮件营销", value: 310 },
      { name: "联盟广告", value: 234 },
      { name: "视频广告", value: 135 },
      { name: "搜索引擎", value: 1548 },
    ],
  },
  {
    type: ChartType.SCATTER,
    title: "散点图",
    icon: "scatter-chart",
    description: "用于展示数据之间的相关性",
    defaultOptions: {
      title: {
        text: "散点图示例",
      },
      xAxis: {},
      yAxis: {},
      series: [
        {
          type: "scatter",
          data: [
            [10, 8.04],
            [8, 6.95],
            [13, 7.58],
            [9, 8.81],
            [11, 8.33],
            [14, 9.96],
            [6, 7.24],
            [4, 4.26],
            [12, 10.84],
            [7, 4.82],
            [5, 5.68],
          ],
        },
      ],
    },
    defaultData: [
      { x: 10, y: 8.04 },
      { x: 8, y: 6.95 },
      { x: 13, y: 7.58 },
      { x: 9, y: 8.81 },
      { x: 11, y: 8.33 },
      { x: 14, y: 9.96 },
      { x: 6, y: 7.24 },
      { x: 4, y: 4.26 },
      { x: 12, y: 10.84 },
      { x: 7, y: 4.82 },
      { x: 5, y: 5.68 },
    ],
  },
  {
    type: ChartType.RADAR,
    title: "雷达图",
    icon: "radar-chart",
    description: "用于展示多变量数据",
    defaultOptions: {
      title: {
        text: "雷达图示例",
      },
      radar: {
        indicator: [
          { name: "销售", max: 6500 },
          { name: "管理", max: 16000 },
          { name: "信息技术", max: 30000 },
          { name: "客服", max: 38000 },
          { name: "研发", max: 52000 },
          { name: "市场", max: 25000 },
        ],
      },
      series: [
        {
          type: "radar",
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: "预算分配",
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: "实际开销",
            },
          ],
        },
      ],
    },
    defaultData: {
      indicator: [
        { name: "销售", max: 6500 },
        { name: "管理", max: 16000 },
        { name: "信息技术", max: 30000 },
        { name: "客服", max: 38000 },
        { name: "研发", max: 52000 },
        { name: "市场", max: 25000 },
      ],
      series: [
        {
          name: "预算分配",
          values: [4200, 3000, 20000, 35000, 50000, 18000],
        },
        {
          name: "实际开销",
          values: [5000, 14000, 28000, 26000, 42000, 21000],
        },
      ],
    },
  },
]; 