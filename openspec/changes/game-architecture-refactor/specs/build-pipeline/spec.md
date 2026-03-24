## ADDED Requirements

### Requirement: build.js 脚本将所有模块和 JSON 内联为单文件
系统 SHALL 提供 `build.js` Node.js 脚本，读取 `src/*.js` 模块、`data/*.json` 配置、原始 HTML 模板，输出完整可运行的 `dist/index.html`。

#### Scenario: 脚本无需安装额外依赖
- **WHEN** 执行 `node build.js`（仅需 Node.js 标准库）
- **THEN** 构建成功，不需要 npm install 任何外部包

#### Scenario: JSON 数据以 script 标签形式内联
- **WHEN** 构建完成后打开 `dist/index.html`
- **THEN** 文件中包含 `<script type="application/json" id="data-chars">...</script>` 等标签，每个 JSON 文件对应一个标签

#### Scenario: Worker 代码内联为 Blob
- **WHEN** 构建完成后打开 `dist/index.html`
- **THEN** `src/worker.js` 内容被内联为字符串，通过 `Blob + createObjectURL` 创建 Worker，不需要外部 worker.js 文件

#### Scenario: 构建产物可直接双击运行
- **WHEN** 在 Windows 资源管理器中双击 `dist/index.html`
- **THEN** 游戏在浏览器中正常打开，不因 file:// 协议限制而崩溃

### Requirement: package.json 提供 build 和 dev 脚本
系统 SHALL 在 `package.json` 中提供 `build`（生成产物）和 `dev`（启动本地服务器开发模式）两个 npm scripts。

#### Scenario: npm run build
- **WHEN** 执行 `npm run build`
- **THEN** 等价于 `node build.js`，生成 `dist/index.html`

#### Scenario: npm run dev
- **WHEN** 执行 `npm run dev`
- **THEN** 启动本地 HTTP 服务器（端口 3000），在浏览器中打开开发版游戏（直接读取 src/ 和 data/）
