# 数独游戏项目

一个基于 React + TypeScript + Vite 的数独游戏，采用 monorepo 结构管理。

## 技术栈

- **构建工具**: Vite 7
- **开发语言**: TypeScript
- **前端框架**: React 19
- **路由管理**: React Router
- **CSS 框架**: Tailwind CSS
- **组件库**: shadcn/ui (基于 Radix UI)
- **代码规范**: ESLint, Prettier, Stylelint, Commitlint (Airbnb 规范)
- **提交检查**: Husky + lint-staged
- **包管理**: pnpm
- **项目结构**: monorepo (pnpm workspace)

## 项目结构

```
ai-frontend/
├── packages/
│   ├── utils/           # 通用工具函数
│   ├── hooks/           # React hooks 集合
│   ├── ui/              # UI 组件库
│   └── sudoku-game/     # 主应用 - 数独游戏
├── .eslintrc.json       # ESLint 配置
├── .prettierrc.json     # Prettier 配置
├── .stylelintrc.json    # Stylelint 配置
├── commitlint.config.js # Commitlint 配置
├── package.json         # 根项目配置
├── pnpm-workspace.yaml  # pnpm workspace 配置
├── tsconfig.json        # TypeScript 配置
└── init-project.ps1     # 初始化脚本
```

## 快速开始

### 前置要求

- Node.js 18+
- pnpm

### 初始化项目

```bash
# 克隆仓库后，进入项目目录
cd ai-frontend

# 运行初始化脚本（PowerShell）
./init-project.ps1

# 或者手动执行
pnpm install
pnpm run prepare
```

### 开发命令

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 运行代码检查
pnpm lint

# 运行代码格式化检查
pnpm prettier

# 运行 CSS 检查
pnpm stylelint
```

## 功能特性

- 数独游戏界面展示
- 简单的游戏逻辑（选择格子、填入数字、清除数字）
- 游戏计时器
- 难度选择（预留接口）
- 重新开始功能
- 响应式设计

## 开发说明

### 添加新组件

在 `packages/ui/src/components` 中创建新组件，并在 `packages/ui/src/index.ts` 中导出。

### 添加新工具函数

在 `packages/utils/src` 中添加新的工具函数，并在 `packages/utils/src/index.ts` 中导出。

### 添加新 Hooks

在 `packages/hooks/src` 中添加新的 React Hooks，并在 `packages/hooks/src/index.ts` 中导出。

## 注意事项

- 代码提交前会自动运行 lint 和 prettier 检查
- 提交信息需要符合 conventional commit 规范
- 使用 pnpm 作为包管理工具，避免使用 npm 或 yarn

