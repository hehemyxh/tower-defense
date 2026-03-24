## Why

现有游戏所有逻辑、配置数据（角色/敌人/波次/技能/装备）全部硬编码在单个 `index.html` 超过 10,000 行，导致维护成本极高、数据与逻辑严重耦合，无法做到策划配置与程序逻辑分离。参考微信文章的 Buff 系统架构和 GitHub 源码 `Buff-In-TopDownShooter` 的战斗系统设计，对代码进行系统性重构以实现可扩展、可维护的架构。

## What Changes

- **BREAKING** 将所有配置数据（角色、敌人、波次、装备、符咒、羁绊）从代码中抽离为独立 JSON 文件
- 将单文件 `index.html` 拆分为多个职责单一的 JS 模块（战斗/UI/Gacha/波次/Buff 等）
- 引入数据驱动的 Buff/Debuff 系统，替换现有散落在各处的属性修改逻辑
- Worker 游戏服务端同步接收 JSON 配置，彻底消除主线程/Worker 数据不一致问题
- 提供 `build.js` 打包脚本，将所有模块 + JSON 内联合并为单一可分发的 `dist/index.html`
- **游戏所有现有玩法内容（角色、羁绊效果、波次数值）保持完全不变**

## Capabilities

### New Capabilities

- `data-config-layer`: JSON 配置表体系 —— 每类游戏数据一个 JSON 文件（chars.json, enemies.json, waves.json, synergies.json, items.json, talismans.json），通过统一的 `DataLoader` 异步加载
- `buff-system`: 数据驱动的 Buff/Debuff 系统 —— Buff 由 JSON 描述（类型/数值/持续时间/叠加规则），Worker 内统一计算，替换现有散落的属性加成逻辑
- `module-system`: 模块化 JS 架构 —— 拆分为 `src/systems/` 目录下多个模块，包含 BattleSystem、GachaSystem、WaveSystem、UISystem、SynergySystem、WorkerBridge
- `build-pipeline`: 打包流水线 —— `npm run build` 将所有 JS 模块 + JSON 数据 inline 合并为单一 `dist/index.html`

### Modified Capabilities

- `gacha-system`: Gacha 池改为从 `chars.json` 动态读取，消除 Worker 内 CHARS 未定义导致的卡死 bug
- `synergy-system`: 羁绊效果改为从 JSON 配置读取并注入 Worker，保持 Worker/主线程数据一致

## Impact

- **文件结构**：新增 `src/`（JS 模块）、`data/`（JSON 配置）、`build.js`（打包脚本）目录
- **现有 index.html**：重构后作为遗留参考，最终由 `dist/index.html` 替代
- **Worker**：不再内联在 `WK` 字符串中，改为独立 `src/worker.js`，构建时内联
- **依赖**：仅新增 Node.js 开发依赖（构建工具），运行时零外部依赖
- **玩法数据**：18 角色、2 敌人、50 波次、3 羁绊、装备和符咒数值完全迁移保留
