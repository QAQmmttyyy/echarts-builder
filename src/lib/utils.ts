import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 生成唯一ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// 计算默认位置，使新图表放置在画布中心
export function calculateDefaultPosition(canvasWidth: number, canvasHeight: number): { x: number, y: number, width: number, height: number } {
  const defaultWidth = 400;
  const defaultHeight = 300;
  
  return {
    x: Math.max(0, (canvasWidth - defaultWidth) / 2),
    y: Math.max(0, (canvasHeight - defaultHeight) / 2),
    width: defaultWidth,
    height: defaultHeight
  };
}
