## ADDED Requirements

### Requirement: Web Worker 承担权威游戏逻辑
系统 SHALL 将所有游戏状态与计算逻辑（战斗、移动、经济、技能）封装在 game-worker.js 中运行，主线程不做任何游戏逻辑判断。

#### Scenario: 输入指令在 Worker 中处理
- **WHEN** 玩家在主线程点击"建造塔"
- **THEN** 主线程仅发送 INPUT 消息至 Worker，Worker 验证合法性并更新游戏状态
- **AND** Worker 将更新后的状态通过 StateSnapshot 广播，主线程基于快照重渲染

#### Scenario: Worker 异常不影响主线程渲染
- **WHEN** Worker 内发生 JS 错误
- **THEN** 主线程捕获 Worker 的 error 事件，显示"游戏发生错误"提示
- **AND** 主线程 Canvas 渲染不崩溃

### Requirement: PeerJS 连接管理
系统 SHALL 使用 PeerJS 管理 WebRTC 连接，房主维护 1-3 个 DataChannel 连接（对应最多3个其他玩家），连接断开时通知其他玩家并移除该玩家席位。

#### Scenario: 玩家中途断线
- **WHEN** 某个客户端的 WebRTC DataChannel 连接断开
- **THEN** 房主检测到 connection close 事件，将该玩家从房间移除
- **AND** 向其余在线玩家广播房间更新信息（玩家X已断线）
- **AND** 游戏继续（不暂停）

#### Scenario: 超过4人尝试加入
- **WHEN** 房间已有 4 名玩家，第 5 名玩家尝试连接
- **THEN** 房主拒绝该连接，向其发送"房间已满"消息
- **AND** 已有玩家的游戏不受影响

### Requirement: 单人离线降级模式
系统 SHALL 在检测到无网络连接或 PeerJS 信令服务不可用时，自动降级为单人离线模式，游戏逻辑正常运行。

#### Scenario: 无网络环境启动
- **WHEN** 玩家在无网络环境下打开游戏
- **THEN** PeerJS 初始化超时（5秒），系统显示"离线模式，联机功能不可用"提示
- **AND** "创建房间"按钮置灰，"单人游戏"按钮正常可用
