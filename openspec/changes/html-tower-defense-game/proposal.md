## Why
构建一款基于 HTML5 Canvas 的多人联机塔防游戏，融合塔防、自走棋与 Roguelike 玩法。游戏以**纯浏览器方式运行，零安装**：房主在浏览器中创建房间并获得分享链接，其他玩家点击链接即可加入，无需安装任何程序。采用 **WebRTC + Web Worker** 的"浏览器内宿主服务器"架构——房主浏览器的 Web Worker 承担服务端逻辑，客户端仅负责渲染与输入；支持 1-4 人联机协作防守。项目基于完整的 v2.0.0 设计文档实现，包含 105 种天命符咒、15 个角色羁绊、135+ 角色、60 种装备、70 种怪物等核心系统。

## What Changes

- 新增完整的 HTML5 前端游戏客户端（Canvas 渲染 + UI 界面，纯原生 JS）
- 新增 Web Worker 游戏逻辑引擎（跑在房主浏览器中，承担服务端职责）
- 新增 WebRTC DataChannel 联机通信层（PeerJS 处理信令与 NAT 穿透）
- 新增房间系统（创建房间→生成链接→玩家加入→房主开局）
- 新增 18 张配置表体系（5 层级依赖结构，JSON 格式，内嵌于客户端）
- 新增天命符咒系统（105 种符咒，4 种稀有度，5/10/15/20 波触发）
- 新增角色羁绊系统（15 大羁绊，3 阶段激活，双/三羁绊支持）
- 新增角色配置系统（135 个角色，5 星稀有度体系）
- 新增防御塔配置系统（30+ 种塔，5 级升级体系）
- 新增技能与效果系统（200+ 种技能，100+ 种效果定义）
- 新增怪物系统（70 种怪物：普通/精英/Boss/特殊，含特殊机制）
- 新增关卡与波次系统（5+ 关卡，Boss 波次，难度成长曲线）
- 新增经济系统（金币、利息、击杀奖励、商店消费）
- 新增商店系统（角色/塔/装备/道具购买，随机刷新）
- 新增装备系统（60 种装备：散件 20 + 套装 25 + 专属 15，合成升级）

## Capabilities

### New Capabilities

- `config-system`：18 张配置表体系（JSON），5 层级加载与校验，内嵌于客户端
- `game-loop`：游戏主循环，Web Worker 内定时 Tick 驱动逻辑，主线程 requestAnimationFrame 驱动渲染
- `talisman-system`：天命符咒系统，105 种符咒，稀有度概率池，符咒互斥与技能替换逻辑
- `archetype-system`：角色羁绊系统，15 大羁绊，3 阶段激活，双/三羁绊归属计算
- `hero-system`：角色配置与部署系统，135 角色，5 星稀有度，属性成长，上场/备用席位管理
- `tower-system`：防御塔建造、升级与攻击系统，30+ 种塔，5 级升级，攻击目标选取
- `skill-system`：技能与效果系统，主动/被动/自动技能，Buff/Debuff 效果栈管理
- `enemy-system`：怪物生成、移动与特殊机制系统，70 种怪物，飞行/隐身/召唤/免疫等机制
- `level-wave-system`：关卡与波次系统，5+ 关卡，Boss 波次，难度成长曲线，符咒触发波次
- `economy-system`：经济系统，金币收入/利息/击杀奖励/消费，利息上限规则
- `shop-system`：商店系统，5 种商品类型，稀有度权重刷新，波次解锁，羁绊倾向推荐
- `equipment-system`：装备系统，散件/套装/专属三类，2/3/4 件套激活，合成升级规则
- `multiplayer-system`：WebRTC + PeerJS 联机系统，房间创建与链接分享，游戏状态广播，符咒共享投票
- `render-ui-system`：HTML5 Canvas 渲染系统与 HUD，地图网格、路径可视化、塔/角色/怪物渲染
- `host-server-architecture`：浏览器内宿主服务器架构，Web Worker 承担服务端逻辑，主线程与 Worker 消息通信，PeerJS 信令

### Modified Capabilities
<!-- 无，全新项目 -->

## Impact

- 全新项目，无现有代码影响
- **产物**：单一 HTML 入口 + JS/CSS 资源包（可作为静态文件托管或直接双击打开）
- **前端**：`index.html` + `css/` + `js/`（纯原生 HTML5/CSS3/JavaScript，无框架）
- **游戏逻辑**：`js/worker/game-worker.js`（Web Worker，运行于房主浏览器）
- **联机层**：`js/network/`（WebRTC DataChannel，PeerJS 信令）
- **配置表**：`config/`（18 张 JSON 配置文件，5 层级目录，随客户端一起分发）
- **外部依赖**：仅 `PeerJS`（CDN 加载，约 30KB，处理 WebRTC 信令与 NAT 穿透）
- **目标运行环境**：现代浏览器（Chrome 80+ / Firefox 75+ / Edge 80+），无需安装任何程序
- **联机协议**：WebRTC DataChannel（P2P），房主 Web Worker 权威，其他客户端接收状态快照渲染
- **房间链接格式**：`index.html?room=<PeerID>`，分享即加入