import { ChartElement } from "@/types/chart";

// 代码生成器选项
export interface CodeGeneratorOptions {
  includeCDN: boolean;
  responsive: boolean;
  commentStyle: 'minimal' | 'detailed';
}

// 默认选项
export const defaultOptions: CodeGeneratorOptions = {
  includeCDN: true,
  responsive: true,
  commentStyle: 'detailed'
};

/**
 * 生成ECharts基本HTML模板
 */
function generateHtmlTemplate(
  options: CodeGeneratorOptions,
  chartId: string
): string {
  const cdnImport = options.includeCDN
    ? `  <!-- 引入 ECharts -->
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>`
    : '  <!-- 请确保已经引入 ECharts 库 -->';

  const containerStyle = options.responsive
    ? 'style="width: 100%; height: 100%; min-height: 400px;"'
    : 'style="width: 600px; height: 400px;"';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ECharts 图表</title>
${cdnImport}
</head>
<body>
  <!-- 图表容器 -->
  <div id="${chartId}" ${containerStyle}></div>

  <script type="text/javascript">
    // 图表代码将在这里插入
  </script>
</body>
</html>`;
}

/**
 * 生成初始化ECharts的JavaScript代码
 */
function generateInitCode(
  chartElement: ChartElement,
  options: CodeGeneratorOptions,
  chartId: string = 'chart-container'
): string {
  // 提取并格式化选项对象
  const echartOptions = JSON.stringify(chartElement.options, null, 2);

  const responsiveCode = options.responsive
    ? `
    // 窗口大小变化时，重置图表大小
    window.addEventListener('resize', function() {
      myChart.resize();
    });`
    : '';

  const comments = options.commentStyle === 'detailed'
    ? `  // 初始化ECharts实例
  // 参数是DOM元素，表示图表的容器
  var myChart = echarts.init(document.getElementById('${chartId}'));

  // 指定图表的配置项和数据
  var option = ${echartOptions};

  // 使用刚指定的配置项和数据显示图表
  myChart.setOption(option);${responsiveCode}`
    : `  var myChart = echarts.init(document.getElementById('${chartId}'));
  var option = ${echartOptions};
  myChart.setOption(option);${responsiveCode}`;

  return comments;
}

/**
 * 生成完整的ECharts JavaScript代码
 */
export function generateJavaScriptCode(
  chartElement: ChartElement,
  options: CodeGeneratorOptions = defaultOptions
): string {
  const chartId = 'chart-container';
  
  // 生成JavaScript初始化代码
  const jsCode = generateInitCode(chartElement, options, chartId);
  
  // 如果只需要JavaScript代码部分
  return jsCode;
}

/**
 * 生成完整的HTML页面代码
 */
export function generateHtmlCode(
  chartElement: ChartElement,
  options: CodeGeneratorOptions = defaultOptions
): string {
  const chartId = 'chart-container';
  
  // 获取HTML模板
  let htmlTemplate = generateHtmlTemplate(options, chartId);
  
  // 生成JavaScript初始化代码
  const jsCode = generateInitCode(chartElement, options, chartId);
  
  // 将JS代码插入HTML模板
  htmlTemplate = htmlTemplate.replace('    // 图表代码将在这里插入', jsCode);
  
  return htmlTemplate;
} 