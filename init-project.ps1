# 项目初始化脚本 - PowerShell版本
Write-Host "开始初始化数独游戏项目..."

# 检查pnpm是否安装
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "错误: 未找到pnpm，请先安装pnpm。"
    Write-Host "可以使用以下命令安装pnpm: npm install -g pnpm"
    exit 1
}

Write-Host "安装项目依赖..."
pnpm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "错误: 安装依赖失败。"
    exit 1
}

Write-Host "设置husky..."
pnpm run prepare

if ($LASTEXITCODE -ne 0) {
    Write-Host "警告: 设置husky失败，可能需要手动配置。"
}

Write-Host "初始化完成！"
Write-Host "你可以使用以下命令开始开发:"
Write-Host "  pnpm dev      # 启动开发服务器"
Write-Host "  pnpm build    # 构建生产版本"
Write-Host "  pnpm lint     # 运行代码检查"
Write-Host "  pnpm prettier # 运行代码格式化检查"
