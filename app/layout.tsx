import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 宠物行为训练教练",
  description: "输入行为描述，生成根因诊断、训练计划和安全红线的 MVP Demo。"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
