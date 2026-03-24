## ADDED Requirements

### Requirement: 代码按职责拆分为独立 JS 模块
系统 SHALL 将游戏逻辑按职责拆分到 `src/` 目录下的独立 JS 文件，每个文件只负责一个系统域。

#### Scenario: 模块文件存在
- **WHEN** 项目初始化完成
- **THEN** 以下文件均存在：`src/data/DataLoader.js`、`src/systems/BuffSystem.js`、`src/systems/BattleSystem.js`、`src/systems/WaveSystem.js`、`src/systems/GachaSystem.js`、`src/systems/SynergySystem.js`、`src/systems/UISystem.js`、`src/systems/VFXRenderer.js`、`src/worker.js`、`src/main.js`

#### Scenario: 无循环依赖
- **WHEN** 分析各模块的依赖关系
- **THEN** 依赖方向为单向：Data → Systems → Worker/Main，不存在循环引用

### Requirement: Worker 独立为 src/worker.js
系统 SHALL 将 Worker 逻辑从主文件的模板字符串 `WK` 中迁出，独立为 `src/worker.js` 文件，构建时自动内联。

#### Scenario: Worker 通过 init 消息接收完整配置
- **WHEN** 主线程向 Worker 发送 type: "init" 消息
- **THEN** 消息中包含 charList、enemyMap、wavesDef、synergiesDef 字段，Worker 接收后建立本地索引，不再需要任何硬编码数据

#### Scenario: Worker 内 CHARS 不再 undefined
- **WHEN** 玩家发起五连抽（type: "gacha", n: 5）
- **THEN** Worker 从 init 时接收的 charList 构建 POOLS，抽卡逻辑正常执行，不抛出 ReferenceError

### Requirement: WorkerBridge 封装主线程与 Worker 的通信
系统 SHALL 提供 `WorkerBridge` 模块，封装所有 `worker.postMessage` 和 `worker.onmessage` 逻辑，主线程其他模块通过 WorkerBridge 的方法与 Worker 通信。

#### Scenario: 发送消息
- **WHEN** GachaSystem 需要抽卡
- **THEN** 调用 `WorkerBridge.send('gacha', {pid, n, tierId})`，不直接访问 worker 对象

#### Scenario: 注册消息处理器
- **WHEN** UISystem 需要处理 gachaResult
- **THEN** 调用 `WorkerBridge.on('gachaResult', handler)`，不直接设置 worker.onmessage

### Requirement: npm run build 生成可分发单文件
系统 SHALL 提供 `build.js` 脚本，执行后生成 `dist/index.html`，包含所有 JS 模块代码和 JSON 数据，可在浏览器中直接运行。

#### Scenario: 构建成功
- **WHEN** 执行 `node build.js`
- **THEN** `dist/index.html` 生成，文件大小合理（< 500KB），不报错

#### Scenario: 构建产物功能完整
- **WHEN** 在浏览器中打开 `dist/index.html`
- **THEN** 游戏正常启动，单人模式可进行抽卡、部署、开始波次、战斗全流程
