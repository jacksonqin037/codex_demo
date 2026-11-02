# codex_demo

## 实验工坊：文本驱动的可交互实验界面

可直接交给 Codex 继续开发的项目。中文界面、可调参数、SVG 仪表、动态指针、装置点击操作、实时曲线和 CSV 数据记录。

### 首版已实现

| 场景 | 文本示例 | 实时交互 |
|---|---|---|
| 欧姆定律 | 6V直流电源，100Ω电阻，电压表和电流表 | 点击开关、点击电源旋钮、调节电压和电阻 |
| RC充放电 | RC电路，12V，1kΩ，1000μF，电压表、电流表、示波器 | 充放电切换、连续电容电压、正负电流、时间常数 |
| 弹簧振子 | 质量1kg，刚度20N/m，阻尼系数0.5，初始位移0.15m | 暂停拖动质量块（或左右方向键）、释放、阻尼调节 |

**范围说明：** 默认使用确定性规则识别上述三类实验，尚未实现任意学科、任意设备的通用智能生成。遇到未知实验或已知不支持的仪器会明确报错。仪表为符合模型量程、单位、连接关系的教学示意，不是某厂商仪器的外观复刻。真实设备需要另建组件并依据官方手册校验。预留服务端语言模型场景规划接口，详见 [扩展说明](docs/ARCHITECTURE.md)。

### 启动

```bash
# Node.js 24（最低22）
bash scripts/setup.sh
npm run dev
# 打开 http://localhost:3000
```

项目无外部 npm 依赖，不需要 API 密钥、CUDA、GPU 或数据库。`npm run build` 输出 dist；生产运行 `node dist/server.mjs`。界面需要通过本项目服务器打开，以支持场景生成接口。

### 接入 Codex 云端环境

仓库代码与 Codex 云端环境是两层：本仓库准备好代码和安装脚本；仍需在你账号的 Codex 环境页面选中仓库并创建/发布环境。

完整点击步骤、旧版/新版环境字段、开发任务提示词见 [CODEX_SETUP.md](docs/CODEX_SETUP.md)。建议仓库 `jacksonqin037/codex_demo`，分支 `main`，Node.js 24，安装命令 `bash scripts/setup.sh`，开发命令 `npm run dev`，端口 3000。

### 验证

```bash
npm run check
npm test
npm run build
```

自动检查覆盖文本参数解析、量程/仪表验证、欧姆定律、RC 时间常数与放电符号、阻尼振子能量、HTTP 场景接口和敏感文件隔离。GitHub Actions 对 push 与 PR 运行相同检查。

### 文件组织

- `src/engine.mjs`：场景注册、单位与参数校验、物理模型。
- `public/`：中文实验台、SVG 装置、仪表指针、实时曲线。
- `server.mjs`：静态资源、场景生成、可选远程规划代理。
- `AGENTS.md`：Codex 项目约定与验证命令。
- `scripts/setup.sh`、`.devcontainer/`、`.github/workflows/`：环境与持续集成。
