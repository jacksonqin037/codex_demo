# Codex 云端环境配置

## 新版环境界面

依据 OpenAI 官方文档：https://learn.chatgpt.com/docs/environments/cloud-environments

1. 在 Codex 新任务中选择 **Work in → Cloud → Select environment → Create environment**；也可在 **Settings → Codex Cloud → Environments → Create environment** 进入。
2. 选择 GitHub 仓库 **jacksonqin037/codex_demo**，默认分支 **main**。若未显示，在 GitHub 连接/应用授权中允许访问该仓库。
3. 点击 **Get started**，将下方环境要求发送给配置助手。
4. 核对配置报告与测试，保存后点击 **Publish**。只有出现环境已发布，才能认为云端环境建立完成。
5. 点击 **Start a new task**，选择该环境继续开发。

环境要求（可直接复制）：

```text
请为 jacksonqin037/codex_demo 配置环境。使用 Node.js 24，仓库根目录为工作目录。
安装和验证命令：bash scripts/setup.sh
开发服务：npm run dev，监听 0.0.0.0:3000。
检查 HTTP /api/health 返回 ok=true，首页可以访问。
按 AGENTS.md 执行项目验证。无需 GPU、CUDA、数据库或 API 密钥。
如配置安装脚本，请使用 bash scripts/setup.sh；启动说明使用 npm run dev。
允许所需包管理器域名。首版应用运行无需外网。
```

## 如果看到旧版 Setup script 表单

官方旧版文档：https://learn.chatgpt.com/docs/environments/cloud-environment

| 字段 | 建议值 |
|---|---|
| 仓库 | jacksonqin037/codex_demo |
| 分支 | main |
| 环境名称 | interactive-experiment-lab |
| Node.js | 24；若不可选，使用22及以上 |
| Setup script | `bash scripts/setup.sh` |
| Maintenance script（可选） | `bash scripts/setup.sh` |
| 运行期网络 | 本地模型无需外网 |
| 环境变量 | 可选 `PORT=3000`、`HOST=0.0.0.0` |
| 密钥 | 首版无需配置 |

`.devcontainer/devcontainer.json` 供 GitHub Codespaces / VS Code 使用，**不是 Codex 网页环境的自动配置文件**。`scripts/setup.sh` 需在相应环境界面选用。不要把 Codex 当成公开网站托管服务；公开访问需另行部署。

## 下一次开发任务提示词

```text
阅读 README.md、AGENTS.md 和 docs/ARCHITECTURE.md，启动并检查实验工坊。
目标是文本描述生成可交互实验台：参数调节、设备点击、动态指针、实时曲线。
目前已有欧姆定律、RC充放电、弹簧阻尼振子。先保持现有功能通过验证。
要新增实验时，先定义结构化场景、物理方程、仪器规格与交互事件，再实现界面。
对指定厂商仪器必须依据官方手册核对外观、量程、接口、旋钮和操作逻辑。
不得用静态图片或任意指针动画代替真实数值联动，也不得把未知场景伪装为已支持。
运行 npm run check、npm test、npm run build，并检查浏览器交互。
```

## 可选远程规划服务

只在已有服务时设置 `SCENE_PLANNER_URL` 和可选 `SCENE_PLANNER_TOKEN`。它们属于本项目运行服务的环境变量，不能放在浏览器代码或 GitHub 仓库里。不同 Codex 版本的 secrets 生命周期不同，需依据实际界面配置；旧版 setup-only secrets 不能直接当作运行期密钥。
