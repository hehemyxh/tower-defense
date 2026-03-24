## ADDED Requirements

### Requirement: Worker Tick 驱动游戏逻辑
房主浏览器的 Game Worker SHALL 以固定 50ms 间隔（20 tick/s）驱动游戏逻辑更新，与渲染帧率解耦。

#### Scenario: 正常 Tick 运行
- **WHEN** 游戏开始运行
- **THEN** Game Worker 每 50ms 执行一次逻辑更新（移动、战斗、效果）
- **AND** Tick 结束后向所有连接的客户端广播 StateSnapshot

#### Scenario: Tick 超时保护
- **WHEN** 某次 Tick 逻辑计算耗时超过 40ms
- **THEN** 系统记录警告日志，不跳过该 Tick，下次 Tick 正常执行

### Requirement: 主线程 60fps 渲染
客户端主线程 SHALL 使用 requestAnimationFrame 以目标 60fps 驱动 Canvas 渲染，基于最新收到的 StateSnapshot 插值绘制。

#### Scenario: 正常渲染循环
- **WHEN** 客户端已连接并接收到 StateSnapshot
- **THEN** 主线程每帧（约 16ms）调用 renderer.render(snapshot) 绘制当前游戏状态
- **AND** 实体位置在两帧 snapshot 之间进行线性插值，确保视觉流畅

#### Scenario: 长时间未收到快照
- **WHEN** 客户端超过 500ms 未收到 StateSnapshot
- **THEN** 渲染层显示"连接中..."遮罩，暂停游戏交互

### Requirement: 主线程与 Worker 消息通信
主线程与 Game Worker 之间 SHALL 通过 postMessage 传递消息，Worker 处理输入指令，主线程接收状态快照。

#### Scenario: 玩家操作上报
- **WHEN** 玩家在主线程执行操作（放置塔/购买角色等）
- **THEN** 主线程向 Worker postMessage({type:'INPUT', payload:{...}})
- **AND** Worker 在下一 Tick 处理该指令并更新游戏状态

#### Scenario: 状态快照下发
- **WHEN** Worker 完成一次 Tick
- **THEN** Worker 向主线程 postMessage({type:'STATE_SNAPSHOT', state:{...}})
- **AND** 同时通过 WebRTC DataChannel 向所有其他客户端广播同一快照
