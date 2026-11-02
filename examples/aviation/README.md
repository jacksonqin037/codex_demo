# 航空交互实验室 · Aviation Interactive Lab

用于 Codex 云端开发的原创航空实验项目起点。已初始化 Node.js 24 环境、安装脚本、自动检查和可操作的 ADF 教学示例。

## 已实现
- ADF 固定刻度仪表：指针依据飞机航向和向台方位实时计算。
- 可调航向、真空速、风向、风速、飞机位置；点击平面移动飞机，Shift+点击移动 NDB。
- 运行/暂停/重置、地速、航迹方向与轨迹显示；支持窄屏布局。
- 纯 JavaScript ES Modules + 原创 SVG，Node 原生开发服务器和测试工具。零第三方运行/开发依赖，首版无需 API 密钥、数据库或 GPU。
- Codex 开发说明、云环境步骤、GitHub Actions 检查。

这是可运行的环境验证骨架。**尚未实现任意文本生成实验、VOR/HSI/RMI、高度表或完整飞行模拟。**

## 本地 / 云端启动
```bash
cd examples/aviation
bash scripts/setup.sh
npm run dev
```
打开 http://localhost:5173 。云端请使用平台提供的预览或端口转发。`localhost` 指运行程序的云端机器。

```bash
npm run verify    # 语法检查、物理/HTTP测试、静态构建
npm run preview   # 预览 dist 构建产物
```
修改代码后刷新浏览器；服务器代码修改后重新启动服务。复制 `.env.example` 为 `.env` 可修改 HOST/PORT。

## 配置 Codex
详见 [Codex 云环境配置指南](docs/CODEX_CLOUD_SETUP.md)。仓库保存代码与配置；实际云计算环境需要在 Codex 页面选择本仓库后创建并发布。

## 项目结构
- `public/`：页面、样式及后续原创图形素材。
- `src/physics.js`：方位、风三角与平面运动计算。
- `src/app.js`：SVG 仪表、参数与实时操作。
- `scripts/`：安装、维护、开发服务器、构建和检查。
- `tests/`：模型与 HTTP 接口测试。
- `docs/`：Codex 配置和后续开发要求。

## 科学假设与来源
采用局部平面、恒定真空速和恒定风；磁差为零，忽略地球曲率、无线电传播、天波/海岸/山地效应、姿态和仪表延迟。位置单位 NM，速度 kt，时间 s。到台距离小于 0.01 NM 时不显示确定方位；超出平面边界自动暂停。运行时间为 ×10。

固定盘 ADF：相对方位 = 归一化（向台方位 − 航向）；地速向量 = 空速向量 + 风速向量，风向输入为来向。

交互参考：https://luizmonteiro.com/Index.aspx 。功能与美术独立实现，不使用该站的源代码或素材。

ADF 方位关系参考 FAA [Aircraft Orientation §3-3-4](https://www.faa.gov/air_traffic/publications/atpubs/fs_html/chap3_section_3.html)。Codex 配置参考 [当前云环境指南](https://learn.chatgpt.com/docs/environments/cloud-environments) 与 [旧版说明](https://learn.chatgpt.com/docs/environments/cloud-environment)，核对日期 2026-11-02。

## 后续开发
见 [开发路线与验收](docs/ROADMAP.md)。本教学原型不用于实际飞行导航。
