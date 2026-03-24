## Context

《cardTD》是一款在纯浏览器环境中运行的多人塔防游戏，融合塔防、自走棋与 Roguelike 玩法。核心约束是**零安装**——所有玩家（包括房主）只需打开一个 HTML 链接即可游玩，无需安装任何客户端或运行时环境。

游戏包含 15 个核心系统、18 张配置表、135 个角色、70 种怪物，逻辑复杂度接近中型游戏服务端。这要求架构在"纯浏览器"约束下，仍能保证：
- 游戏逻辑权威性（防止客户端作弊）
- 低延迟的多人同步（4 人实时联机）
- 复杂配置数据的高效加载与查询

---

## Goals / Non-Goals

**Goals:**
- 纯浏览器运行，零安装，双击 HTML 或访问静态链接即可游戏
- 房主浏览器承担权威服务端职责，其他客户端仅渲染
- WebRTC P2P 联机，支持 1-4 人协作，无需自建服务器
- 所有游戏系统（符咒/羁绊/装备/技能/怪物）均由配置表驱动
- 支持单人离线模式（房主无需联网也可单人游玩）

**Non-Goals:**
- 不实现排行榜、账号系统、云存档（无服务端）
- 不支持超过 4 人联机（PeerJS 连接数限制与游戏设计上限）
- 不实现移动端适配（优先桌面浏览器）
- 不实现防外挂系统（无权威服务端，PvP 场景不适用，协作模式可接受）
- 不支持断线重连（当前版本，后续可考虑）

---

## Decisions

### 决策 1：游戏逻辑运行在 Web Worker（房主浏览器）

**选择**：将所有游戏状态与逻辑（战斗计算、波次管理、经济系统等）放在房主浏览器的 **Web Worker** 中运行。

**原因**：
- Web Worker 独立线程，不阻塞房主的 Canvas 渲染（保证 60fps）
- 与主线程通过 `postMessage` 通信，隔离清晰
- 充当"权威服务端"，其他客户端只接收状态快照

**备选方案**：
| 方案 | 问题 |
|------|------|
| 主线程运行逻辑 | 复杂计算卡帧，房主体验差 |
| 云服务器（Node.js） | 需要安装 Node.js 或付费服务器 |
| 多个客户端各自运算 | 状态不一致，无权威来源 |

```
房主浏览器
┌─────────────────────────────────────────┐
│  Main Thread                            │
│  ├── Canvas 渲染（60fps rAF）            │
│  ├── 用户输入处理                        │
│  └── postMessage ↕ Worker               │
│                                         │
│  Game Worker (game-worker.js)           │
│  ├── 游戏状态 (GameState)               │
│  ├── 逻辑 Tick（20tick/s，50ms 间隔）    │
│  ├── 配置表查询                          │
│  └── 向所有玩家广播 StateSnapshot        │
└─────────────────────────────────────────┘
```

---

### 决策 2：联机使用 WebRTC DataChannel + PeerJS 信令

**选择**：使用 **WebRTC DataChannel** 传输游戏数据，**PeerJS** 处理信令与 NAT 穿透。

**原因**：
- WebRTC DataChannel 是浏览器原生 P2P 通信，延迟低（相比 WebSocket 中转）
- PeerJS 提供免费公共信令服务器，无需自建
- 房间链接即 PeerID：`index.html?room=<PeerID>`，玩家点击直接连接

**消息流程**：
```
玩家B浏览器                          房主浏览器(Worker)
  │                                       │
  │── 用户操作（放塔/购买/选符咒）──────────►│
  │                                       │ 逻辑处理
  │◄── StateSnapshot（每帧或事件触发）──────│
  │                                       │
```

**消息类型**（二进制 ArrayBuffer 提升性能）：
| 类型 | 方向 | 说明 |
|------|------|------|
| `INPUT` | 客户端→房主 | 玩家操作指令 |
| `STATE_SNAPSHOT` | 房主→所有客户端 | 完整游戏状态（每 50ms） |
| `EVENT` | 房主→所有客户端 | 离散事件（击杀/符咒选择等） |
| `ROOM_INFO` | 双向 | 房间玩家列表变更 |

---

### 决策 3：配置表以 JSON 内嵌，按层级懒加载

**选择**：18 张配置表以 JSON 文件形式存放在 `config/` 目录，游戏启动时按 5 层依赖顺序加载，不内联在 JS 中。

**原因**：
- JSON 文件便于独立修改、版本管理
- 按层级加载（Level1→Level5）确保外键引用时依赖已就绪
- 与设计文档中的配置表体系完全对应

**加载顺序**：
```
Level1: effect.json, economy.json
  ↓
Level2: skill.json, enemy-skill.json, talisman.json, equipment.json, equipment-set.json
  ↓
Level3: hero.json, tower.json, enemy.json
  ↓
Level4: archetype.json, shop.json, talisman-pool.json
  ↓
Level5: level.json, wave.json, boss-wave.json
```

---

### 决策 4：状态同步采用"全量快照"而非"增量差异"

**选择**：房主 Worker 每 50ms（20 tick/s）向所有客户端广播**完整游戏状态快照**，而非只发送变化量。

**原因**：
- 实现简单，不需要处理丢包补偿与状态回溯
- 4 人游戏场景下，单帧快照大小可控（估算 5-20KB）
- WebRTC DataChannel 不保证有序，全量快照无需序号依赖

**备选方案**：
| 方案 | 问题 |
|------|------|
| 增量差异（Delta） | 实现复杂，丢包需补偿，调试困难 |
| 事件驱动 | 需要精确事件序列，乱序处理复杂 |

**快照结构（简化）**：
```json
{
  "tick": 12345,
  "wave": 5,
  "gold": { "p1": 200, "p2": 180 },
  "heroes": [...],
  "towers": [...],
  "enemies": [...],
  "effects": [...]
}
```

---

### 决策 5：项目文件结构

```
/
├── index.html                    # 单一入口（大厅+游戏）
├── config/                       # 18 张 JSON 配置表
│   ├── level1/effect.json
│   ├── level1/economy.json
│   ├── level2/skill.json
│   ├── ...（按层级组织）
├── css/
│   ├── main.css                  # 全局样式
│   ├── lobby.css                 # 大厅/房间样式
│   └── game.css                  # 游戏 HUD 样式
└── js/
    ├── main.js                   # 入口，场景切换
    ├── lobby/
    │   ├── room-manager.js       # 创建/加入房间
    │   └── lobby-ui.js           # 大厅 UI
    ├── network/
    │   ├── peer-host.js          # 房主端 PeerJS 连接管理
    │   └── peer-client.js        # 客户端 PeerJS 连接
    ├── worker/
    │   └── game-worker.js        # 游戏逻辑 Worker（权威服务端）
    ├── game/
    │   ├── renderer.js           # Canvas 渲染
    │   ├── input-handler.js      # 键鼠输入
    │   └── hud.js                # HUD 界面
    └── config/
        └── config-loader.js      # 配置表加载与索引
```

---

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|---------|
| 房主关闭标签页→所有玩家断线 | UI 明确提示房主"关闭将结束游戏"；后续可考虑房主转让 |
| PeerJS 免费服务器不稳定 | 提供 PeerJS 自托管选项的配置项；降级为本地回环测试 |
| 严格企业网络阻断 WebRTC | 文档说明；PeerJS 默认使用 TURN 中继作为降级方案 |
| Web Worker 与主线程消息序列化开销 | 使用 `Transferable`（ArrayBuffer）零拷贝传输状态快照 |
| 全量快照在大波次（50 个敌人+角色）时包体过大 | 客户端视野裁剪；只传输屏幕内实体的完整数据，屏幕外仅传位置 |
| 配置表全量加载初始化慢 | 启动时显示 loading 进度条；Level1-2 优先加载，Level4-5 异步加载 |

---

## Migration Plan

1. 初始化项目目录与文件结构
2. 实现配置表 JSON 文件（18 张，填入设计文档数据）
3. 实现 ConfigLoader，按层级加载与校验
4. 实现 game-worker.js 骨架（Tick 循环 + 消息协议）
5. 实现核心游戏系统（按依赖顺序：效果→技能→角色→塔→怪物→关卡→经济）
6. 实现 PeerJS 联机层（PeerHost + PeerClient）
7. 实现大厅 UI 与房间系统
8. 实现 Canvas 渲染层与 HUD
9. 系统联调（单人模式→双人→四人）
10. 发布为静态文件（可托管于 GitHub Pages / Gitee Pages）

## Open Questions

- **符咒共享投票**：4 人联机时，每次符咒选择是全队共同投票还是房主单独决定？（建议：倒计时 15 秒，超时默认选第一项）
- **大厅 UI 语言**：纯中文还是支持中英双语？
- **离线单人模式**：是否需要在无网络环境下也能游玩？（PeerJS 离线时降级为单机）
- **存档**：是否需要 localStorage 保存游戏进度/设置？