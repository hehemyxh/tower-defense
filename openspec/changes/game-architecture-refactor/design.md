## Context

当前游戏是一个单文件 `index.html`（~11,000 行），包含：
- **配置数据**：18 个角色、2 种敌人、50 波次、3 个羁绊、装备、符咒全部硬编码为 JS 对象字面量
- **Worker**：以模板字符串 `WK = \`...\`` 内联在主文件中，导致主/Worker 作用域隔离困难
- **战斗逻辑**：散落在 Worker 字符串内部，Buff 效果直接 `p.gold += x` 式修改
- **已知 Bug**：Worker 内 `CHARS` 未定义，五连抽永久卡在"祈愿中"

参考来源：
- **微信文章** Buff 系统架构：强调 Buff 数据化（描述符驱动）、叠加策略（override/additive/multiply）、事件钩子机制
- **GitHub `Buff-In-TopDownShooter`**：战斗实体 Entity + BuffManager + BuffDefinition 分层，Buff 通过 tick 驱动

## Goals / Non-Goals

**Goals:**
- 将所有配置数据（角色/敌人/波次/装备/符咒/羁绊）抽离为 `data/*.json`
- Worker 独立为 `src/worker.js`，通过 `init` 消息接收完整 JSON 配置
- 引入 `BuffSystem`：Buff 由 JSON 描述符驱动，Worker 内统一 tick 计算
- 拆分主线程为模块：DataLoader / GachaSystem / UISystem / WaveSystem / SynergySystem / WorkerBridge / VFXRenderer
- `npm run build` → `dist/index.html` 单文件，零外部运行时依赖
- **所有现有玩法数值和内容不变**

**Non-Goals:**
- 不修改游戏玩法规则、数值平衡
- 不引入框架（React/Vue）或打包工具（Webpack/Vite）
- 不修改现有 CSS 样式和 HTML 结构
- 不新增游戏内容（角色/装备/波次）

## 核心设计规则

### R1：角色 = 防御塔（Tower）
- 角色部署后**固定不动**，不会移动、不会被攻击、没有生命值
- 角色只做一件事：**自动攻击射程内的敌人**
- 所有技能设计必须基于"固定炮台"前提：
  - ✅ 合理：攻速加成、伤害加成、弹射、溅射、减速、破甲、DOT、暴击、追踪标记
  - ❌ 不合理：闪避、格挡、受击反击、生命回复、生命低于X%触发、移动冲锋
- 技能触发条件只能是：每次攻击时、每N次攻击、概率触发、蓝满释放
- 技能效果只能作用于：敌人（伤害/控制/Debuff）、自身塔（攻速/伤害Buff）、友方塔（光环）

### R4：联机架构（Host-Client 权威模型）
- **Host 权威**：游戏逻辑全部在 Host 端 Worker 中运行，Worker 是唯一状态权威
- **Client 纯渲染**：Client 只接收 snap 快照并渲染，不运行任何战斗逻辑
- **PeerJS 通信**：Host 通过 `netHost.broadcast({type:'snap', snap})` 同步状态给所有 Client
- **所有技能逻辑必须在 Worker 中执行**：不允许在主线程或 Client 端计算技能效果
- **`Math.random()` 安全**：因为只有 Host Worker 运行，不存在客户端各自独立计算的同步问题
- **snap 中需要包含所有可渲染状态**：如果技能产生了可见效果（光环、叠层数等），对应字段必须加入 `mkSnap()`
- **输入同步**：Client 的操作（放塔、卖塔、抽卡）通过 NetClient 发送给 Host，Host 转发给 Worker 处理

### R2：所有数据必须基于配置表（JSON）
- **零硬编码数据**：角色属性、技能参数、敌人属性、波次配置、羁绊定义、装备、符咒，全部存放在 `data/*.json`
- 主线程和 Worker 通过 `init` 消息接收配置数据，不允许在代码中 `if(id==='c11001')` 式的硬编码判断
- 新增/修改角色只需编辑 JSON 配置表，不需改动任何 JS 代码
- 配置表结构变更需同步更新对应的 JSON Schema 说明

### R3：Buff/技能系统严格遵循数据驱动架构（参考微信文章）
**架构原则：**
1. **BuffDefinition 驱动**：所有 Buff 效果由 JSON 描述符定义（id/source/stat/op/value/duration/stackRule），不允许在代码中直接 `entity.dmg += x`
2. **统一 BuffManager 管理**：
   - `BuffManager.apply(entity, buffDef)` — 应用 Buff
   - `BuffManager.remove(entity, buffId)` — 移除 Buff
   - `BuffManager.tick(entity)` — 每帧衰减有限期 Buff
   - `BuffManager.calcEffectiveStat(entity, stat)` — 计算最终属性
3. **计算顺序**：`(base + additive) × multiply`，override 最优先
4. **叠加策略**：
   - `replace` — 同 id 新覆盖旧
   - `stack` — 同 id 可多层叠加
   - `cap` — 同 id 最多 N 层，超出替换最旧
5. **来源追踪**：每个 Buff 有 source 字段（synergy/talisman/skill），移除某来源的所有效果用 `removeBySource`
6. **技能参数配置化**：技能的触发概率、伤害倍率、范围、持续时间等数值必须定义在角色配置表或技能配置表中，代码只读取参数执行通用逻辑

**当前差距（待迁移）：**
- ⚠️ Worker 中 18 个角色独有技能目前按 `cid` 硬编码在战斗循环中，直接操作数值（如 `dealDmg(best, t.dmg*0.8)`），未使用 BuffManager
- ⚠️ 系族通用技能（arcane/ranger/warrior）也是按 syn 名称硬编码分支，未走 BuffDefinition
- ✅ BuffSystem.js 已实现且通过 15 个单元测试
- ✅ SynergySystem.js 已实现 Buff 注入接口
- 🎯 下一步：将所有技能参数提取到 `data/skills.json`，Worker 中改为通用处理器读取配置执行

## Decisions

### D1：数据层 —— JSON + fetch（vs 硬编码 JS 对象）
**选择**：每类数据一个 JSON 文件，游戏启动时 `DataLoader.loadAll()` 并行 fetch  
**理由**：JSON 可被策划直接编辑，无需接触 JS 代码；fetch 在本地和 HTTP 服务器均可用  
**替代方案**：ES Module import（需要 HTTP 服务器，不支持直接打开 .html）→ 排除  
**构建时处理**：`build.js` 将 JSON 内联为 `<script type="application/json" id="data-xxx">` 标签，fetch 用 `document.getElementById` 替代，实现单文件可玩

### D2：Buff 系统架构（参考文章 + GitHub 源码）
```
BuffDefinition (JSON):
{
  "id": "arcane_dmg_2",
  "source": "synergy",
  "stat": "dmg",           // 影响的属性
  "op": "multiply",        // additive | multiply | override
  "value": 1.20,           // 乘以 1.20 = +20%
  "duration": -1,          // -1 = 永久（羁绊类）
  "stackRule": "replace"   // replace | stack | cap
}
```
Worker 内 `BuffManager`：
- `entity.buffs[]` 存活跃 Buff 描述符实例
- 每 tick 调用 `BuffManager.tick(entity)` 处理持续时间
- `calcEffectiveStat(entity, stat)` 按 additive → multiply 顺序计算最终属性
- 羁绊激活/失效时 `BuffManager.apply/remove(entity, buffDef)`

**替代方案**：保留现有 `synergyBufs.dmg += x` → 太散，难以扩展，排除

### D3：Worker 通信 —— 配置随 init 传入（vs Worker 内硬编码）
**选择**：`init` 消息携带完整 JSON 数据（chars、enemies、waves、synergies 等），Worker 接收后建立本地索引  
**理由**：消除 Worker/主线程数据二义性；Worker 不再需要自己维护 SYN_DEF 副本  
**现有 Bug 修复**：`CHARS` 未定义问题自动消除

### D4：模块文件结构
```
src/
  data/
    DataLoader.js         # fetch + 解析，暴露 GameData 全局
  systems/
    BuffSystem.js         # BuffDefinition + BuffManager
    BattleSystem.js       # 伤害计算、子弹、碰撞（原 Worker 逻辑）
    WaveSystem.js         # 出怪调度（原 Worker 逻辑）
    GachaSystem.js        # 抽卡池构建与抽取
    SynergySystem.js      # 羁绊激活判断与 Buff 注入
    UISystem.js           # renderHand/renderBag/HUD 等 UI 更新
    VFXRenderer.js        # Canvas 粒子特效
  worker.js               # Worker 入口，import 战斗/波次/Buff 系统
  main.js                 # 主线程入口
data/
  chars.json
  enemies.json
  waves.json
  synergies.json
  items.json
  talismans.json
build.js                  # Node.js 打包脚本
dist/
  index.html              # 构建产物（可直接双击运行）
```

### D5：构建打包策略
**选择**：纯 Node.js 脚本 `build.js`，不依赖 Webpack/Rollup  
**策略**：
1. 读取所有 `src/*.js` 按依赖顺序拼接
2. 将 `data/*.json` 以 `<script type="application/json" id="data-xxx">` 形式内联
3. Worker 代码以 `Blob URL` 方式内联（现有方案延续）
4. 输出 `dist/index.html`，保留原有 HTML/CSS 结构

## Risks / Trade-offs

| 风险 | 缓解措施 |
|---|---|
| JSON fetch 在本地 file:// 协议下可能被浏览器阻止 | 构建产物内联 JSON，开发模式用 Live Server 或 Node http-server |
| 模块拆分后循环依赖 | 明确依赖方向：Data → Systems → Worker/Main，禁止反向引用 |
| Worker Blob URL 体积增大 | Worker 只内联战斗必要代码，UI 逻辑不进 Worker |
| 重构过程中游戏不可玩 | 保留原 `index.html` 不删除，重构在新目录进行，完成后替换 |
| Buff 系统与现有 synergyBufs 双写冲突 | 迁移阶段保留双写，全部 Buff 迁移后删除旧字段 |

## Migration Plan

1. **Phase 1**：提取数据 —— 从 `index.html` 读取所有配置对象，生成 `data/*.json`（用 Node 脚本自动化）
2. **Phase 2**：搭建模块骨架 —— 创建 `src/` 目录结构，空模块 + 接口定义
3. **Phase 3**：迁移 Worker 战斗逻辑 —— BattleSystem + WaveSystem + BuffSystem
4. **Phase 4**：迁移主线程逻辑 —— DataLoader + UISystem + GachaSystem + SynergySystem
5. **Phase 5**：接通 WorkerBridge —— 替换现有 `worker.postMessage` 调用
6. **Phase 6**：打包验证 —— `npm run build` → 浏览器测试全流程

## Open Questions

- Worker 模块能否使用 `importScripts`？（Blob Worker 支持，但内联后需特殊处理）→ 决策：构建时将 Worker 依赖直接拼接，不用 importScripts
- 现有多人联机（NetHost/NetClient）是否纳入本次重构范围？→ 决策：保持现有接口不变，WorkerBridge 适配即可
