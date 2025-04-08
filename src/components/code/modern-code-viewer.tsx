"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChartElement } from "@/types/chart";
import { CodeGeneratorOptions, defaultOptions, generateJavaScriptCode, generateHtmlCode } from "@/lib/code-generator";
import { highlightCode } from "@/lib/shiki-highlighter";
import { Copy, Check, Code2, FileCode, Settings2, HelpCircle } from "lucide-react";

interface ModernCodeViewerProps {
  chart: ChartElement | null;
}

export function ModernCodeViewer({ chart }: ModernCodeViewerProps) {
  const [options, setOptions] = useState<CodeGeneratorOptions>({...defaultOptions});
  const [jsCode, setJsCode] = useState<string>("");
  const [htmlCode, setHtmlCode] = useState<string>("");
  const [jsHighlighted, setJsHighlighted] = useState<string>("");
  const [htmlHighlighted, setHtmlHighlighted] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("js");
  const [isLoading, setIsLoading] = useState(false);

  // 当图表变化或选项变化时重新生成代码
  useEffect(() => {
    if (!chart) {
      setJsCode("");
      setHtmlCode("");
      setJsHighlighted("");
      setHtmlHighlighted("");
      return;
    }
    
    // 生成代码
    const newJsCode = generateJavaScriptCode(chart, options);
    const newHtmlCode = generateHtmlCode(chart, options);
    
    setJsCode(newJsCode);
    setHtmlCode(newHtmlCode);
    
    // 使用Shiki进行高亮处理
    setIsLoading(true);
    
    Promise.all([
      highlightCode(newJsCode, 'javascript'),
      highlightCode(newHtmlCode, 'html')
    ]).then(([jsHtml, htmlHtml]) => {
      setJsHighlighted(jsHtml);
      setHtmlHighlighted(htmlHtml);
      setIsLoading(false);
    }).catch(error => {
      console.error('Error highlighting code:', error);
      setIsLoading(false);
    });
  }, [chart, options]);

  // 复制代码功能
  const handleCopyCode = () => {
    const codeToCopy = activeTab === "js" ? jsCode : htmlCode;
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 处理选项变更
  const handleOptionChange = (key: keyof CodeGeneratorOptions, value: boolean | string) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 如果没有选中图表，显示提示信息
  if (!chart) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-muted/60 p-6 mb-4 shadow-sm">
          <Code2 className="h-10 w-10 text-primary/70" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">未选择图表</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs">
          请先从画布中选择一个图表，以查看生成的代码实现
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background/50">
      <div className="py-3 px-4 border-b bg-card shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              <span>代码生成器</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              查看并自定义图表的代码实现
            </p>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCopyCode}
            className="h-8 gap-1.5 bg-background/80 hover:bg-background transition-colors"
            disabled={isLoading}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-500" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>复制代码</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 上下布局 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部：选项区域 */}
        <div className="border-b bg-muted/10 p-3">
          <div className="flex flex-wrap gap-3 mb-3">
            <div className="flex items-center justify-between gap-2 bg-card px-3 py-2 rounded-md shadow-sm flex-1 min-w-[180px]">
              <Label htmlFor="includeCDN" className="text-xs font-normal cursor-pointer flex items-center gap-1">
                <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
                包含CDN引用
              </Label>
              <Switch 
                id="includeCDN" 
                checked={options.includeCDN}
                onCheckedChange={(checked) => handleOptionChange("includeCDN", checked)}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <div className="flex items-center justify-between gap-2 bg-card px-3 py-2 rounded-md shadow-sm flex-1 min-w-[180px]">
              <Label htmlFor="responsive" className="text-xs font-normal cursor-pointer flex items-center gap-1">
                <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
                响应式布局
              </Label>
              <Switch 
                id="responsive" 
                checked={options.responsive}
                onCheckedChange={(checked) => handleOptionChange("responsive", checked)}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <div className="flex items-center justify-between gap-2 bg-card px-3 py-2 rounded-md shadow-sm flex-1 min-w-[180px]">
              <Label htmlFor="commentStyle" className="text-xs font-normal cursor-pointer flex items-center gap-1">
                <Settings2 className="h-3.5 w-3.5 text-muted-foreground" />
                详细注释
              </Label>
              <Switch 
                id="commentStyle" 
                checked={options.commentStyle === 'detailed'}
                onCheckedChange={(checked) => 
                  handleOptionChange("commentStyle", checked ? 'detailed' : 'minimal')
                }
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
          
          <div className="bg-card/50 rounded-md p-2 border border-muted/50 text-xs text-muted-foreground flex gap-4">
            <div className="flex items-start gap-1">
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground text-xs mb-0.5">使用指南</p>
                <p className="leading-tight">选择选项定制代码生成，可复制生成的代码用于您的项目</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 底部：代码查看区域 */}
        <div className="flex-1 overflow-hidden min-h-0">
          <Tabs defaultValue="js" value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="border-b bg-muted/30 px-3">
              <TabsList className="h-9">
                <TabsTrigger 
                  value="js" 
                  className="flex items-center gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>JavaScript</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="html" 
                  className="flex items-center gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>HTML页面</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="js" className="flex-1 overflow-hidden m-0 p-0">
              <div className="h-full overflow-auto p-4 bg-card">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">加载中...</div>
                  </div>
                ) : (
                  <div 
                    className="code-block rounded-md overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: jsHighlighted }} 
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="html" className="flex-1 overflow-hidden m-0 p-0">
              <div className="h-full overflow-auto p-4 bg-card">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">加载中...</div>
                  </div>
                ) : (
                  <div 
                    className="code-block rounded-md overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: htmlHighlighted }} 
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Shiki 代码样式调整 */}
      <style jsx global>{`
        .code-block .shiki {
          margin: 0;
          border-radius: 0.375rem;
          overflow: auto;
          font-family: 'Menlo', 'Monaco', 'Consolas', 'Courier New', monospace;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        
        .code-block pre {
          margin: 0;
        }
        
        .code-block code {
          counter-reset: line;
        }
        
        .code-block .line {
          display: inline-block;
          width: 100%;
        }
      `}</style>
    </div>
  );
} 