## ADDED Requirements

### Requirement: 所有游戏配置数据以 JSON 文件形式存储
系统 SHALL 将角色、敌人、波次、羁绊、装备、符咒数据分别存储在 `data/` 目录下的独立 JSON 文件中，与游戏逻辑代码完全分离。

#### Scenario: 数据文件存在且结构正确
- **WHEN** 游戏启动时
- **THEN** `data/chars.json`、`data/enemies.json`、`data/waves.json`、`data/synergies.json`、`data/items.json`、`data/talismans.json` 六个文件均存在，且每个文件为合法 JSON

#### Scenario: 角色数据完整性
- **WHEN** 解析 `data/chars.json`
- **THEN** 包含恰好 18 个角色条目（c11001~c13006），每个条目包含 id、name、emoji、rarity、syns、dmg、range、rate、hp 字段

#### Scenario: 敌人数据完整性
- **WHEN** 解析 `data/enemies.json`
- **THEN** 包含 goblin 和 wolf 两个条目，每个条目包含 id、name、hp、speed、reward 字段

#### Scenario: 波次数据完整性
- **WHEN** 解析 `data/waves.json`
- **THEN** 包含恰好 50 个波次定义，每个波次包含 w（波次号）和 eg（敌人组）字段

### Requirement: DataLoader 统一异步加载所有配置
系统 SHALL 提供 `DataLoader.loadAll()` 方法，并行 fetch 所有 JSON 文件，返回 Promise，加载完成后所有数据可通过 `GameData` 全局对象访问。

#### Scenario: 并行加载成功
- **WHEN** 调用 `DataLoader.loadAll()`
- **THEN** 六个 JSON 文件并行请求，全部成功后 `GameData.chars`、`GameData.enemies`、`GameData.waves`、`GameData.synergies`、`GameData.items`、`GameData.talismans` 均已填充

#### Scenario: 加载失败处理
- **WHEN** 某个 JSON 文件 fetch 失败
- **THEN** `DataLoader.loadAll()` reject，游戏显示错误提示而不是静默崩溃

### Requirement: 构建产物内联所有 JSON 数据
系统 SHALL 提供 `build.js` 脚本，将 `data/*.json` 以 `<script type="application/json">` 标签形式内联到 `dist/index.html`，使构建产物无需 HTTP 服务器即可直接在浏览器中运行。

#### Scenario: 构建脚本生成单文件产物
- **WHEN** 执行 `node build.js`
- **THEN** 生成 `dist/index.html`，该文件包含所有 JSON 数据内联，可在浏览器中直接双击打开运行

#### Scenario: 内联数据读取
- **WHEN** `dist/index.html` 在 `file://` 协议下运行
- **THEN** DataLoader 从 `<script type="application/json" id="data-chars">` 等标签读取数据，游戏正常启动
