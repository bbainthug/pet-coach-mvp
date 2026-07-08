# 陪训 PetCoach · AI 宠物行为训练教练（MVP）

免费训狗教程铺天盖地，但新手养狗人往往坚持不到训练见效。本项目用 AI 把用户的口语描述转成**行为诊断 → 严重度分级 → 分周训练计划 → 每日任务**，并用打卡与次日提示帮主人「陪跑」坚持下去。当前 MVP 已跑通「诊断 → 分级 → 计划 → 本地打卡」主线。

**在线 Demo**：https://pet-coach-mvp.vercel.app/

> ⚠️ 在线 Demo 为稳定演示走 **mock 模式**：无论输入什么，都返回同一份确定性样例（柯基分离焦虑 6 周计划）。想看真实 AI 生成，请按下方「本地运行」填入自己的 key。

## 截图

![桌面结果页](./output-result.png)

![移动端结果页](./output-mobile.png)

## 它做什么

用户输入宠物类型、品种、年龄、绝育状态、问题行为描述（可上传一张照片预览），应用通过三段式 AI 工作流输出：

- **Stage 1**：把口语描述结构化为宠物画像与问题行为
- **Stage 2**：行为根因诊断、严重度分级、医疗边界提醒
- **Stage 3**：4–8 周训练计划，含每日任务、成功标准、所需道具、安全红线

结果页还包含本地打卡进度、`localStorage` 持久化、基于完成率的规则化次日提示——这是「陪跑闭环」的最小演示。

## 已完成 / 下一步

**已完成**

- Next.js App Router + TypeScript + Tailwind CSS 单页应用
- `/api/coach` 串行编排 Stage1 → Stage2 → Stage3
- DeepSeek live / 确定性 mock 双模式
- Zod 输入校验 + live 输出结构兜底
- 结果页：诊断卡、严重度刻度、训练计划、红线、免责声明
- 本地打卡进度、`localStorage` 持久化、规则化次日提示
- Vitest + Testing Library 覆盖核心逻辑与组件交互

**下一步（尚未做）**

- 把打卡反馈回传给 AI，真正生成次日任务微调（当前是前端规则演示，非 AI 闭环）
- 接入视觉 / 短视频模型，判断训练动作与宠物压力信号（当前 `deepseek-chat` 不读取图片）
- 账号、数据库、真实进度追踪、支付
- 用 10 位真实用户做 14 天试用，验证 D7/D14 留存与打卡完成率

## 本地运行

```bash
npm install
cp .env.local.example .env.local   # 留空 key 即走 mock，可离线预览
npm run dev                         # http://localhost:3000
```

打开后点「填入样例」→「生成训练计划」。

## 运行模式与配置

模式由环境变量自动判定：**留空 key → mock（稳定、免费、离线）；填入 key → live（真实调用 DeepSeek）**。

| `DEEPSEEK_USE_MOCK` | `DEEPSEEK_API_KEY` | 实际模式 |
|---|---|---|
| `true` | 任意 | mock |
| `false` | 任意 | live |
| 空 | 已填 | live |
| 空 | 空 | mock |

`.env.local`（已被 `.gitignore` 忽略，不入仓库）可配置项：

```bash
DEEPSEEK_API_KEY=                          # 留空走 mock；填入走 live
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_USE_MOCK=                          # 强制 true/false，留空则按有无 key 自动判断
DEEPSEEK_SEND_IMAGE=false                   # deepseek-chat 无视觉能力，图片仅前端预览、不发给模型
```

## 目录结构

```text
app/
  page.tsx              输入表单 + 结果页
  api/coach/route.ts    串行编排 Stage1→2→3
components/             IntakeForm / DiagnosisCard / TrainingPlan / RedLineAlert ...
lib/                    coach / llm / prompts / schemas / sample ...
tests/                  Vitest + Testing Library
```

## 测试与构建

```bash
npm test
npm run build
```

## 文档

- [A4 提交正文](./A4-提交正文.md) —— 机会判断 / 用户证据 / MVP / 商业判断 / 2 周验证计划
- [产品与 AI 工作流规格](./pet-behavior-coach-spec.md) —— 三段式 Prompt 设计
