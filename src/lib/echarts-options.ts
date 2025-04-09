// 根据ECharts官方文档定义的配置项子项结构
// 这个文件用于提供ECharts各配置项的子项定义

type OptionType = 'string' | 'number' | 'boolean' | 'color' | 'object' | 'array' | 'select';

// 配置项类型定义
interface OptionItem {
  type: OptionType;
  default?: any;
  options?: Array<{value: string; label: string}>;  // 用于select类型
  children?: Record<string, OptionItem>;  // 用于object类型的子项
  itemType?: OptionItem;  // 用于array类型的子项模板
}

// 顶级配置项定义
export const EChartsOptions: Record<string, OptionItem> = {
  title: {
    type: 'object',
    children: {
      show: { type: 'boolean', default: true },
      text: { type: 'string', default: '' },
      link: { type: 'string', default: '' },
      target: { type: 'select', default: 'blank', options: [
        { value: 'self', label: '当前窗口' },
        { value: 'blank', label: '新窗口' }
      ]},
      textStyle: { 
        type: 'object',
        children: {
          color: { type: 'color', default: '#333' },
          fontStyle: { type: 'select', default: 'normal', options: [
            { value: 'normal', label: '普通' },
            { value: 'italic', label: '斜体' },
            { value: 'oblique', label: '倾斜' }
          ]},
          fontWeight: { type: 'select', default: 'normal', options: [
            { value: 'normal', label: '普通' },
            { value: 'bold', label: '粗体' },
            { value: 'bolder', label: '更粗' },
            { value: 'lighter', label: '更细' }
          ]},
          fontSize: { type: 'number', default: 18 },
          lineHeight: { type: 'number', default: 24 }
        }
      },
      subtext: { type: 'string', default: '' },
      subtextStyle: { 
        type: 'object',
        children: {
          color: { type: 'color', default: '#aaa' },
          fontStyle: { type: 'select', default: 'normal', options: [
            { value: 'normal', label: '普通' },
            { value: 'italic', label: '斜体' },
            { value: 'oblique', label: '倾斜' }
          ]},
          fontSize: { type: 'number', default: 12 }
        }
      },
      left: { type: 'string', default: 'auto' },
      top: { type: 'string', default: 'auto' },
      right: { type: 'string', default: 'auto' },
      bottom: { type: 'string', default: 'auto' },
      padding: { type: 'number', default: 5 },
      backgroundColor: { type: 'color', default: 'transparent' },
      borderColor: { type: 'color', default: '#ccc' },
      borderWidth: { type: 'number', default: 0 },
      borderRadius: { type: 'number', default: 0 },
      shadowBlur: { type: 'number', default: 0 },
      shadowColor: { type: 'color', default: 'rgba(0, 0, 0, 0.2)' },
      shadowOffsetX: { type: 'number', default: 0 },
      shadowOffsetY: { type: 'number', default: 0 }
    }
  },
  
  legend: {
    type: 'object',
    children: {
      show: { type: 'boolean', default: true },
      type: { type: 'select', default: 'plain', options: [
        { value: 'plain', label: '普通图例' },
        { value: 'scroll', label: '可滚动图例' }
      ]},
      data: {
        type: 'array',
        itemType: {
          type: 'object',
          children: {
            name: { type: 'string', default: '图例名称' },
            icon: { type: 'select', default: 'circle', options: [
              { value: 'circle', label: '圆形' },
              { value: 'rect', label: '矩形' },
              { value: 'roundRect', label: '圆角矩形' },
              { value: 'triangle', label: '三角形' },
              { value: 'diamond', label: '菱形' },
              { value: 'pin', label: '针形' },
              { value: 'arrow', label: '箭头' },
              { value: 'none', label: '无' }
            ]},
            textStyle: {
              type: 'object',
              children: {
                color: { type: 'color', default: '#333' },
                fontStyle: { type: 'select', default: 'normal', options: [
                  { value: 'normal', label: '普通' },
                  { value: 'italic', label: '斜体' },
                  { value: 'oblique', label: '倾斜' }
                ]}
              }
            }
          }
        }
      },
      left: { type: 'string', default: 'auto' },
      top: { type: 'string', default: 'auto' },
      right: { type: 'string', default: 'auto' },
      bottom: { type: 'string', default: 'auto' },
      width: { type: 'string', default: 'auto' },
      height: { type: 'string', default: 'auto' },
      orient: { type: 'select', default: 'horizontal', options: [
        { value: 'horizontal', label: '水平' },
        { value: 'vertical', label: '垂直' }
      ]},
      align: { type: 'select', default: 'auto', options: [
        { value: 'auto', label: '自动' },
        { value: 'left', label: '左对齐' },
        { value: 'right', label: '右对齐' }
      ]},
      padding: { type: 'number', default: 5 },
      itemGap: { type: 'number', default: 10 },
      itemWidth: { type: 'number', default: 25 },
      itemHeight: { type: 'number', default: 14 },
      backgroundColor: { type: 'color', default: 'transparent' },
      borderColor: { type: 'color', default: '#ccc' },
      borderWidth: { type: 'number', default: 0 },
      borderRadius: { type: 'number', default: 0 },
      shadowBlur: { type: 'number', default: 0 },
      shadowColor: { type: 'color', default: 'rgba(0, 0, 0, 0.2)' }
    }
  },
  
  grid: {
    type: 'object',
    children: {
      show: { type: 'boolean', default: false },
      left: { type: 'string', default: '10%' },
      top: { type: 'string', default: '60' },
      right: { type: 'string', default: '10%' },
      bottom: { type: 'string', default: '60' },
      width: { type: 'string', default: 'auto' },
      height: { type: 'string', default: 'auto' },
      containLabel: { type: 'boolean', default: true },
      backgroundColor: { type: 'color', default: 'transparent' },
      borderColor: { type: 'color', default: '#ccc' },
      borderWidth: { type: 'number', default: 1 },
      shadowBlur: { type: 'number', default: 0 },
      shadowColor: { type: 'color', default: 'rgba(0, 0, 0, 0.2)' }
    }
  },
  
  xAxis: {
    type: 'object',
    children: {
      show: { type: 'boolean', default: true },
      type: { type: 'select', default: 'category', options: [
        { value: 'value', label: '数值轴' },
        { value: 'category', label: '类目轴' },
        { value: 'time', label: '时间轴' },
        { value: 'log', label: '对数轴' }
      ]},
      name: { type: 'string', default: '' },
      nameLocation: { type: 'select', default: 'end', options: [
        { value: 'start', label: '起点' },
        { value: 'middle', label: '中间' },
        { value: 'end', label: '终点' }
      ]},
      nameTextStyle: {
        type: 'object',
        children: {
          color: { type: 'color', default: '#333' },
          fontSize: { type: 'number', default: 12 }
        }
      },
      position: { type: 'select', default: 'bottom', options: [
        { value: 'top', label: '顶部' },
        { value: 'bottom', label: '底部' }
      ]},
      data: { type: 'array', itemType: { type: 'string' } },
      axisLine: {
        type: 'object',
        children: {
          show: { type: 'boolean', default: true },
          lineStyle: {
            type: 'object',
            children: {
              color: { type: 'color', default: '#333' },
              width: { type: 'number', default: 1 },
              type: { type: 'select', default: 'solid', options: [
                { value: 'solid', label: '实线' },
                { value: 'dashed', label: '虚线' },
                { value: 'dotted', label: '点线' }
              ]}
            }
          }
        }
      }
    }
  },
  
  yAxis: {
    type: 'object',
    children: {
      show: { type: 'boolean', default: true },
      type: { type: 'select', default: 'value', options: [
        { value: 'value', label: '数值轴' },
        { value: 'category', label: '类目轴' },
        { value: 'time', label: '时间轴' },
        { value: 'log', label: '对数轴' }
      ]},
      name: { type: 'string', default: '' },
      nameLocation: { type: 'select', default: 'end', options: [
        { value: 'start', label: '起点' },
        { value: 'middle', label: '中间' },
        { value: 'end', label: '终点' }
      ]},
      min: { type: 'number' },
      max: { type: 'number' },
      position: { type: 'select', default: 'left', options: [
        { value: 'left', label: '左侧' },
        { value: 'right', label: '右侧' }
      ]},
      axisLine: {
        type: 'object',
        children: {
          show: { type: 'boolean', default: true }
        }
      }
    }
  },
  
  tooltip: {
    type: 'object',
    children: {
      show: { type: 'boolean', default: true },
      trigger: { type: 'select', default: 'item', options: [
        { value: 'item', label: '数据项' },
        { value: 'axis', label: '坐标轴' },
        { value: 'none', label: '不触发' }
      ]},
      formatter: { type: 'string', default: '' },
      backgroundColor: { type: 'color', default: 'rgba(50, 50, 50, 0.7)' },
      borderColor: { type: 'color', default: '#333' },
      borderWidth: { type: 'number', default: 0 },
      padding: { type: 'number', default: 5 },
      textStyle: {
        type: 'object',
        children: {
          color: { type: 'color', default: '#fff' },
          fontSize: { type: 'number', default: 14 }
        }
      }
    }
  },
  
  series: {
    type: 'array',
    itemType: {
      type: 'object',
      children: {
        type: { type: 'select', default: 'line', options: [
          { value: 'line', label: '折线图' },
          { value: 'bar', label: '柱状图' },
          { value: 'pie', label: '饼图' },
          { value: 'scatter', label: '散点图' },
          { value: 'effectScatter', label: '涟漪散点图' },
          { value: 'radar', label: '雷达图' },
          { value: 'tree', label: '树图' },
          { value: 'treemap', label: '矩形树图' },
          { value: 'sunburst', label: '旭日图' },
          { value: 'boxplot', label: '箱型图' },
          { value: 'candlestick', label: '烛形图' },
          { value: 'heatmap', label: '热力图' },
          { value: 'map', label: '地图' },
          { value: 'parallel', label: '平行坐标图' },
          { value: 'lines', label: '线图' },
          { value: 'graph', label: '关系图' },
          { value: 'sankey', label: '桑基图' },
          { value: 'funnel', label: '漏斗图' },
          { value: 'gauge', label: '仪表盘' },
          { value: 'pictorialBar', label: '象形柱图' },
          { value: 'themeRiver', label: '主题河流图' }
        ]},
        name: { type: 'string', default: '系列名称' },
        data: { type: 'array', itemType: { type: 'number' } },
        itemStyle: {
          type: 'object',
          children: {
            color: { type: 'color', default: '#5470c6' },
            borderColor: { type: 'color', default: '#fff' },
            borderWidth: { type: 'number', default: 0 },
            borderType: { type: 'select', default: 'solid', options: [
              { value: 'solid', label: '实线' },
              { value: 'dashed', label: '虚线' },
              { value: 'dotted', label: '点线' }
            ]},
            opacity: { type: 'number', default: 1 }
          }
        },
        lineStyle: {
          type: 'object',
          children: {
            color: { type: 'color', default: '#5470c6' },
            width: { type: 'number', default: 2 },
            type: { type: 'select', default: 'solid', options: [
              { value: 'solid', label: '实线' },
              { value: 'dashed', label: '虚线' },
              { value: 'dotted', label: '点线' }
            ]},
            opacity: { type: 'number', default: 1 }
          }
        },
        areaStyle: {
          type: 'object',
          children: {
            color: { type: 'color', default: '#5470c6' },
            opacity: { type: 'number', default: 0.7 }
          }
        },
        label: {
          type: 'object',
          children: {
            show: { type: 'boolean', default: false },
            position: { type: 'select', default: 'top', options: [
              { value: 'top', label: '上方' },
              { value: 'left', label: '左侧' },
              { value: 'right', label: '右侧' },
              { value: 'bottom', label: '下方' },
              { value: 'inside', label: '内部' }
            ]},
            color: { type: 'color', default: '#333' },
            fontSize: { type: 'number', default: 12 }
          }
        }
      }
    }
  },
  
  color: {
    type: 'array',
    itemType: { type: 'color' }
  },
  
  backgroundColor: { type: 'color', default: 'transparent' },
  
  textStyle: {
    type: 'object',
    children: {
      color: { type: 'color', default: '#333' },
      fontSize: { type: 'number', default: 12 },
      fontFamily: { type: 'string', default: 'sans-serif' }
    }
  },
  
  animation: { type: 'boolean', default: true },
  animationDuration: { type: 'number', default: 1000 },
  animationEasing: { type: 'select', default: 'cubicOut', options: [
    { value: 'linear', label: '线性' },
    { value: 'quadraticIn', label: '二次方缓入' },
    { value: 'quadraticOut', label: '二次方缓出' },
    { value: 'quadraticInOut', label: '二次方缓入缓出' },
    { value: 'cubicIn', label: '三次方缓入' },
    { value: 'cubicOut', label: '三次方缓出' },
    { value: 'cubicInOut', label: '三次方缓入缓出' }
  ]}
};

// 查找ECharts配置项路径对应的子项定义
export function getEChartsOptionByPath(path: string): OptionItem | undefined {
  if (!path) return undefined;
  
  const parts = path.split('.');
  let currentOption: OptionItem | undefined = EChartsOptions[parts[0]];
  
  if (!currentOption) return undefined;
  
  // 从第二个部分开始，逐层查找
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    
    // 处理数组下标，如series[0]
    if (part.includes('[') && part.includes(']')) {
      const arrayName = part.substring(0, part.indexOf('['));
      
      // 当前是数组类型，我们需要找到数组项的类型
      if (currentOption.children && currentOption.children[arrayName]) {
        currentOption = currentOption.children[arrayName];
        
        // 获取数组项的类型
        if (currentOption.type === 'array' && currentOption.itemType) {
          currentOption = currentOption.itemType;
        } else {
          return undefined;
        }
      } else {
        return undefined;
      }
    } 
    // 普通属性
    else if (currentOption.children && currentOption.children[part]) {
      currentOption = currentOption.children[part];
    } 
    // 数组项的类型
    else if (currentOption.type === 'array' && currentOption.itemType) {
      currentOption = currentOption.itemType;
      
      // 递归查找当前部分
      i--;
    } else {
      return undefined;
    }
  }
  
  return currentOption;
}

// 获取指定路径下的可用子项
export function getAvailableChildrenByPath(path: string): { key: string; option: OptionItem }[] {
  const option = getEChartsOptionByPath(path);
  
  if (!option || option.type !== 'object' || !option.children) {
    return [];
  }
  
  return Object.entries(option.children)
    .map(([key, childOption]) => ({ key, option: childOption }));
}

// 生成数组的新项示例
export function generateArrayItemExample(path: string): any {
  const option = getEChartsOptionByPath(path);
  
  if (!option || option.type !== 'array' || !option.itemType) {
    return '';
  }
  
  switch (option.itemType.type) {
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
    case 'color':
      return '#5470c6';
    case 'object':
      return generateObjectExample(option.itemType);
    default:
      return '';
  }
}

// 生成对象示例
function generateObjectExample(option: OptionItem): any {
  if (option.type !== 'object' || !option.children) {
    return {};
  }
  
  const result: Record<string, any> = {};
  
  // 添加基本的必要字段
  for (const [key, childOption] of Object.entries(option.children)) {
    if (childOption.default !== undefined) {
      result[key] = childOption.default;
    }
  }
  
  return result;
} 