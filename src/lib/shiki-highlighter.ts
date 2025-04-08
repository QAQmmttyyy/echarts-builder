import { codeToHtml } from 'shiki';

/**
 * 使用Shiki对代码进行高亮处理
 * @param code 要高亮的代码
 * @param language 代码语言
 * @returns 高亮处理后的HTML代码的Promise
 */
export function highlightCode(code: string, language: string): Promise<string> {
  // 规范化语言名称
  let lang = language.toLowerCase();
  if (lang === 'js') lang = 'javascript';
  if (lang === 'ts') lang = 'typescript';
  if (lang === 'markup') lang = 'html';

  // 使用Shiki的codeToHtml方法进行高亮
  return codeToHtml(code, {
    lang,
    theme: 'one-light',
  }).catch(error => {
    console.error('Error highlighting code with Shiki:', error);
    // 出错时返回未高亮的代码
    return `<pre class="shiki" style="background-color:#ffffff;color:#24292e"><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
  });
} 