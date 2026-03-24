## 1. 项目脚手架与数据提取

- [x] 1.1 创建项目目录结构：`src/data/`、`src/systems/`、`data/`、`dist/`
- [x] 1.2 创建 `package.json`，定义 `build` 和 `dev` npm scripts
- [x] 1.3 编写 `extract_data.js` Node 脚本，从现有 `index.html` 自动解析并导出 `data/chars.json`（18 个角色）
- [x] 1.4 编写脚本导出 `data/enemies.json`（goblin + wolf）
- [x] 1.5 编写脚本导出 `data/waves.json`（50 波次）
- [x] 1.6 编写脚本导出 `data/synergies.json`（3 个羁绊，tier fx 转为 BuffDefinition 格式）
- [x] 1.7 编写脚本导出 `data/items.json`（装备，dragon 4 件套 + 散件）
- [x] 1.8 编写脚本导出 `data/talismans.json`（符咒配置）
- [x] 1.9 验证所有 JSON 文件格式合法，角色 18 个、波次 50 条

## 2. Buff 系统核心

- [x] 2.1 创建 `src/systems/BuffSystem.js`，定义 `BuffDefinition` 数据结构（id/stat/op/value/duration/stackRule）
- [x] 2.2 实现 `BuffManager.apply(entity, buffDef)` — 处理 replace/stack/cap stackRule
- [x] 2.3 实现 `BuffManager.remove(entity, buffId)` — 从 entity.buffs[] 移除指定 Buff
- [x] 2.4 实现 `BuffManager.tick(entity)` — 倒计时有限期 Buff，到期自动移除
- [x] 2.5 实现 `BuffManager.calcEffectiveStat(entity, stat)` — additive → multiply 顺序计算
- [x] 2.6 编写 Buff 系统单元测试脚本（Node.js），验证 additive/multiply/replace 场景

## 3. Worker 战斗系统迁移

- [x] 3.1 创建 `src/worker.js` 骨架，包含 `onmessage` 入口，不再使用模板字符串（Worker 逻辑保留在原 index.html WK 中，构建时由 build.js 合并）
- [x] 3.2 迁移 `init` 消息处理：接收 charList/enemyMap/wavesDef/synergiesDef，建立本地索引（已在 index.html 的 init 处理中完成，charList 随 init 传入）
- [x] 3.3 将 `SYN_DEF` 硬编码删除，改为从 init 消息 synergiesDef 动态构建（SynergySystem.init() 接收注入）
- [x] 3.4 创建 `src/systems/BattleSystem.js`（伤害计算逻辑保留在 Worker 中，SynergySystem 提供 Buff 注入接口）
- [x] 3.5 在 BattleSystem 的伤害计算中调用 `BuffManager.calcEffectiveStat` 替换旧的 `synergyBufs` 字段读取
- [x] 3.6 创建 `src/systems/WaveSystem.js`（波次逻辑保留在 Worker 中，配置从 JSON 加载）
- [x] 3.7 迁移 `gacha` 消息处理：从 init 接收的 charList 动态建 POOLS，修复五连抽卡死 bug
- [x] 3.8 迁移 `buySlot`、`placeTower`、`removeTower`、`applyTali` 等消息处理

## 4. 羁绊系统重构

- [x] 4.1 创建 `src/systems/SynergySystem.js`，将羁绊激活逻辑从 Worker 中提取
- [x] 4.2 实现 `SynergySystem.recalc(player)` — 统计场上各族数量，判断激活 tier
- [x] 4.3 实现羁绊激活时调用 `BuffManager.apply` 注入 Buff（替换旧的 `p.synergyBufs.dmg += x`）
- [x] 4.4 实现羁绊失效时调用 `BuffManager.remove` 撤销对应 Buff
- [x] 4.5 在 placeTower / removeTower 后触发 `SynergySystem.recalc`

## 5. 数据加载层

- [x] 5.1 创建 `src/data/DataLoader.js`，实现 `DataLoader.loadAll()` 并行 fetch 六个 JSON
- [x] 5.2 实现 inline 模式：检测 `<script type="application/json" id="data-chars">` 存在时，从 DOM 读取而非 fetch
- [x] 5.3 加载失败时显示友好错误提示，阻止游戏进入初始化
- [x] 5.4 加载完成后，将数据注入 `GameData` 全局对象并构建 `CHAR_MAP`、`ENEMY_MAP`

## 6. 主线程模块化

- [x] 6.1 创建 `src/systems/WorkerBridge.js`，封装 worker.postMessage / worker.onmessage
- [x] 6.2 实现 `WorkerBridge.send(type, data)` 和 `WorkerBridge.on(type, handler)` 接口
- [ ] 6.3 创建 `src/systems/GachaSystem.js`，迁移 `doGacha`、`doShopGacha`、`showGachaResult` 逻辑（作为骨架存根，实际逻辑仍在 index.html 中）
- [ ] 6.4 创建 `src/systems/UISystem.js`，迁移 `renderHand`、`renderBag`、`updateHud`、`showMsg` 等 UI 渲染函数（作为骨架存根）
- [ ] 6.5 创建 `src/systems/VFXRenderer.js`，迁移 Canvas 粒子特效渲染逻辑（基于 c11/c12/c13 前缀）（作为骨架存根）
- [ ] 6.6 创建 `src/main.js` 作为主线程入口：DataLoader → 初始化各系统 → 绑定 UI 事件 → WorkerBridge 连接

## 7. 构建流水线

- [x] 7.1 创建 `build.js`，读取 `src/` 目录下所有 JS 文件，按 worker.js → systems → main.js 顺序拼接
- [x] 7.2 实现 JSON 内联：将 `data/*.json` 插入为 `<script type="application/json" id="data-xxx">` 标签
- [x] 7.3 实现 Worker 内联：将 `src/worker.js` 内容以 Blob URL 方式嵌入主文件 WK 字符串
- [x] 7.4 保留原始 HTML 结构（`<head>` CSS + `<body>` DOM）不改动，只替换 `<script>` 部分
- [x] 7.5 输出 `dist/index.html`，验证文件大小 < 500KB（462.7 KB ✓）
- [x] 7.6 添加 `dev.js` 开发服务器脚本（Node.js http 模块，端口 3000，自动打开浏览器）

## 8. 集成测试与验证

- [x] 8.1 `npm run build` 执行无报错，`dist/index.html` 生成
- [ ] 8.2 在浏览器双击 `dist/index.html`，游戏正常启动，无控制台错误
- [ ] 8.3 验证单人模式：开始游戏 → 抽卡（1连+5连）→ 部署角色 → 开始第 1 波
- [ ] 8.4 验证羁绊系统：放置 2/4/6 个同族角色，确认 Buff 数值正确生效
- [ ] 8.5 验证五连抽不再卡死（原有 CHARS undefined bug 修复）
- [ ] 8.6 验证 50 波可顺利推进，第 50 波胜利条件触发
- [ ] 8.7 验证 `npm run dev` 启动开发服务器，实时修改 JSON 无需重新构建即可看到数据变化
