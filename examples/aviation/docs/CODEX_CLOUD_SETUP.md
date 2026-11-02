# Codex 云环境配置指南

目标仓库：`jacksonqin037/codex_demo`，分支：`main`。
航空子项目目录：`examples/aviation`。根目录现有通用实验应用保持独立（端口 3000）。

环境建议名称：`aviation-interactive-lab`。

## 当前 Codex 云环境
1. 在 Codex 网页端选择 Work in → Cloud → Select environment → Create environment；也可从 Settings → Codex Cloud → Environments → Create environment 进入。界面语言可能不同。
2. 选择 GitHub 仓库 `jacksonqin037/codex_demo`，选择 Get started。如列表没有仓库，在 GitHub 的 ChatGPT/Codex 应用授权中授予该仓库访问权。
3. 将下列配置要求发给环境设置助手：

```text
请配置本仓库的航空交互实验开发环境：使用 Node.js 24.x 和 npm；先进入 examples/aviation，在该子目录运行 bash scripts/setup.sh，确保 npm run verify 通过。启动服务使用 npm run dev，监听 0.0.0.0:5173；GET /healthz 应返回 HTTP 200 和 {"ok":true}。请提供浏览器预览并记录启动方法。本初始版本没有第三方依赖，不需要 API 密钥、数据库或 GPU。请读取 examples/aviation/AGENTS.md 和 examples/aviation/docs/CODEX_CLOUD_SETUP.md。
```

4. 检查环境报告：安装命令为 `bash examples/aviation/scripts/setup.sh`；启动方式为 `npm --prefix examples/aviation run dev`，探针为 `http://127.0.0.1:5173/healthz`。安装脚本是有限时检查，不要在安装脚本中前台运行长期服务。
5. 审查并保存设置，选择 Publish。出现 Environment published 后开始新任务，选择该环境。

## 看到旧版 Setup script / Maintenance script 时
- 容器：默认 universal；在语言版本设置中选择 Node.js 24。
- Setup script：`bash examples/aviation/scripts/setup.sh`
- Maintenance script（可选）：`bash examples/aviation/scripts/maintenance.sh`
- 开发命令：`npm --prefix examples/aviation run dev`
- 变量（可选）：`HOST=0.0.0.0`、`PORT=5173`
- 密钥：当前无需。
- 网络：初始项目没有远程调用，无需开放公网；以后添加 npm 依赖再开启包管理器域名权限。不要通过修改代理绕过环境限制。

仓库脚本并不会自动在 Codex 账户内创建、授权或发布环境；需在上述界面保存并发布。根目录 `.devcontainer/devcontainer.json` 属于已有通用实验项目，不是 Codex 云环境的自动导入文件；运行航空子项目时请额外转发端口 5173。

## 第一条开发任务
```text
请阅读 examples/aviation/AGENTS.md，在 examples/aviation 航空交互实验骨架上实现可复用的 VOR 教学实验。提供可调 OBS 航道、飞机航向、位置、风向与风速；绘制原创 SVG VOR 仪表，正确计算 CDI 左右偏差和 TO/FROM 状态，支持飞机移动、开始/暂停/重置。物理模型与渲染分离，增加有意义的模型测试，并在 examples/aviation 内执行 npm run verify。完成后说明假设、已实现功能和验证结果。
```

## 常见问题
- Node 版本检查失败：在环境配置选择 24.x 后重新准备环境；安装脚本不擅自安装系统运行时。
- 端口被占用：更换 PORT 并更新预览/探针端口。
- 无法访问网页：先检查 `/healthz`，再打开云端预览或转发 5173 端口。
- Codespaces 首次创建需要访问容器镜像服务；Codex 默认容器不需要此镜像。航空子项目使用 5173 端口。
- 文本生成实验尚在路线中；当前示例用于验证环境与交互基础。

官方参考（2026-11-02）：
- https://learn.chatgpt.com/docs/environments/cloud-environments
- https://learn.chatgpt.com/docs/environments/cloud-environment
