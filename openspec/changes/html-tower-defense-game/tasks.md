## 1. 项目初始化与目录结构

- [x] 1.1 创建项目根目录结构：`index.html`、`css/`、`js/`、`config/`
- [x] 1.2 创建 `js/` 子目录：`lobby/`、`network/`、`worker/`、`game/`、`config/`
- [x] 1.3 创建 `config/` 子目录：`effects/`、`skills/`、`towers/`、`enemies/`、`waves/`、`maps/`
- [x] 1.4 创建 `index.html` 基础骨架（引入 PeerJS CDN、CSS、JS 入口）
- [x] 1.5 创建 `css/main.css`、`css/lobby.css`、`css/game.css` 基础样式文件

## 2. 配置表 JSON 文件（Level 1-2）

- [x] 2.1 创建 `config/effects/effects.json`（基础效果定义）
- [x] 2.2 创建 `config/skills/skills.json`（技能/法阵定义）
- [x] 2.3 创建 `config/towers/towers.json`（防御塔定义）
- [x] 2.4 创建 `config/enemies/enemies.json`（怪物定义）
- [x] 2.5 创建 `config/maps/maps.json`（地图配置）
- [x] 2.6 创建 `config/waves/waves_map001.json`（火焰山道波次配置）

## 3. 配置表 JSON 文件（已合并简化）

- [x] 3.1 塔/敌人/地图/波次均已在 Phase 2 中创建

## 4. 配置加载器（ConfigLoader）

- [x] 4.1 实现 `js/config/ConfigLoader.js`：按层级顺序 fetch 加载所有 JSON 文件
- [x] 4.2 实现加载进度回调，支持显示加载进度百分比
- [x] 4.3 建立 Map 索引（id→配置对象），O(1) 查询

## 5. 游戏主循环（Game Loop）

- [ ] 5.1 实现 `js/worker/game-worker.js` 骨架：Worker 消息协议定义（INPUT/STATE_SNAPSHOT/EVENT/ROOM_INFO）
- [ ] 5.2 实现 Worker 内 `setInterval` 50ms Tick 循环驱动逻辑更新
- [ ] 5.3 实现 Tick 超时保护（记录警告日志，不跳过 Tick）
- [ ] 5.4 实现主线程 `requestAnimationFrame` 渲染循环（60fps）
- [ ] 5.5 实现主线程与 Worker 的 `postMessage` 双向通信桥接

## 6. 核心游戏系统（Worker 内）

- [ ] 6.1 实现效果系统（EffectManager）：Buff/Debuff 栈管理、叠加上限、持续时间倒计时
- [ ] 6.2 实现技能系统（SkillManager）：冷却计时、能量消耗、AOE/Line/Single 伤害计算
- [ ] 6.3 实现角色系统（HeroManager）：部署/撤下、属性成长、升级消耗计算
- [ ] 6.4 实现防御塔系统（TowerManager）：建造/升级/拆除、目标选取、攻击触发
- [ ] 6.5 实现怪物系统（EnemyManager）：沿路径移动、飞行单位直线移动、特殊机制触发
- [ ] 6.6 实现波次管理器（WaveManager）：按配置定时生成怪物、波次完成检测、Boss 波次处理
- [ ] 6.7 实现羁绊计算器（ArchetypeCalculator）：实时统计羁绊人数、阶段激活/失效
- [ ] 6.8 实现经济系统（EconomyManager）：波次金币结算、利息计算、击杀奖励分配
- [ ] 6.9 实现天命符咒系统（TalismanManager）：概率抽取、互斥检查、效果即时应用
- [ ] 6.10 实现商店系统（ShopManager）：稀有度权重刷新、羁绊倾向调权、购买逻辑
- [ ] 6.11 实现装备系统（EquipmentManager）：装备/卸装、套装激活计算、专属效果检测、合成逻辑

## 7. 联机网络层

- [ ] 7.1 实现 `js/network/peer-host.js`：PeerJS 初始化、监听连接、维护最多3条 DataChannel
- [ ] 7.2 实现房主广播 StateSnapshot 到所有已连接客户端
- [ ] 7.3 实现房主处理客户端 INPUT 消息并转发至 Worker
- [ ] 7.4 实现超4人连接拒绝逻辑
- [ ] 7.5 实现玩家断线检测与房间成员列表更新广播
- [ ] 7.6 实现 `js/network/peer-client.js`：通过 URL `?room=PeerID` 参数自动连接房主
- [ ] 7.7 实现客户端接收 StateSnapshot 并更新本地渲染状态
- [ ] 7.8 实现客户端发送 INPUT 消息至房主

## 8. 大厅与房间系统

- [ ] 8.1 实现 `js/lobby/room-manager.js`：创建房间（生成 PeerID）、加入房间（识别 URL 参数）
- [ ] 8.2 实现 `js/lobby/lobby-ui.js`：大厅 UI（创建房间按钮、单人游戏按钮、玩家列表）
- [ ] 8.3 实现房间链接生成与复制到剪贴板功能
- [ ] 8.4 实现房主"开始游戏"按钮（等待至少1人就绪后可点击）
- [ ] 8.5 实现离线降级检测（PeerJS 超时5秒→显示离线模式提示，禁用联机按钮）
- [ ] 8.6 实现连接失败错误提示（房间不存在/已关闭）

## 9. Canvas 渲染层

- [ ] 9.1 实现 `js/game/renderer.js`：地图网格绘制（路径/可建造/已占用格子区分显示）
- [ ] 9.2 实现怪物渲染（位置插值、血条、状态效果图标）
- [ ] 9.3 实现防御塔渲染（图标、等级标记、悬停时攻击范围圆圈）
- [ ] 9.4 实现角色渲染（部署格子、角色图标、等级/装备标记）
- [ ] 9.5 实现特效渲染（技能特效、伤害数字飘字）
- [ ] 9.6 实现 `js/game/hud.js`：波次数、金币、基地血量、倒计时、符咒选择面板
- [ ] 9.7 实现 Boss 专属血条（顶部显示，带动画）
- [ ] 9.8 实现 `js/game/input-handler.js`：鼠标点击/拖拽交互，生成 INPUT 消息

## 10. 符咒选择 UI

- [ ] 10.1 实现符咒选择面板（全屏遮罩，3个选项卡片显示名称/稀有度/效果描述）
- [ ] 10.2 实现倒计时 15 秒显示（联机时显示所有玩家投票进度）
- [ ] 10.3 实现联机投票同步（玩家点击后向房主发送投票，房主广播票数更新）
- [ ] 10.4 实现倒计时结束后自动选择最高票符咒并激活，广播给所有客户端

## 11. 联调与收尾

- [ ] 11.1 单人离线模式全流程测试（大厅→关卡选择→全20波→通关/失败）
- [ ] 11.2 双人联机测试（房主+1玩家，验证状态同步一致性）
- [ ] 11.3 四人联机压力测试（验证20波次大量怪物下帧率与延迟）
- [ ] 11.4 验证所有 15 个系统 spec 的核心 Scenario（逐一对照 specs/ 目录）
- [ ] 11.5 实现加载进度条页面（启动时显示 18 张配置表加载进度）
- [ ] 11.6 发布为静态文件，验证可通过 GitHub Pages / 本地双击 index.html 正常运行
