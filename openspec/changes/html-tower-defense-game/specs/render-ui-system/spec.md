## ADDED Requirements

### Requirement: Canvas 游戏世界渲染
系统 SHALL 使用 HTML5 Canvas 渲染游戏地图网格、怪物路径、防御塔、角色、怪物和特效，基于最新 StateSnapshot 每帧重绘。

#### Scenario: 地图网格渲染
- **WHEN** 游戏场景加载完成
- **THEN** Canvas 绘制地图网格，路径格子显示路径指示色，可建造格子显示绿色高亮，已建塔格子显示塔的图标

#### Scenario: 怪物位置插值渲染
- **WHEN** 渲染帧率(60fps)高于逻辑Tick率(20tps)
- **THEN** 怪物在当前帧位置与目标位置之间进行线性插值，保证移动视觉流畅

### Requirement: HUD 游戏信息显示
系统 SHALL 在游戏画面上层绘制 HUD，实时显示当前波次、玩家金币、基地血量、符咒倒计时等信息。

#### Scenario: HUD 金币更新
- **WHEN** 玩家击杀怪物获得金币
- **THEN** HUD 金币数值在 200ms 内动画更新到新值

#### Scenario: Boss 血条显示
- **WHEN** Boss 波次开始，Boss 生成
- **THEN** 屏幕顶部出现 Boss 专属血条，显示 Boss 名称和当前血量百分比

### Requirement: 角色与塔的交互 UI
系统 SHALL 在玩家点击地图上的角色或塔时，显示详细信息面板（属性、技能、升级、卸装等操作入口）。

#### Scenario: 点击塔显示操作面板
- **WHEN** 玩家点击地图上已建造的塔
- **THEN** 显示塔的信息面板：当前等级、属性、升级预览、出售按钮
- **AND** 面板上的升级按钮显示升级所需金币，若不足则置灰

#### Scenario: 塔的攻击范围可视化
- **WHEN** 玩家鼠标悬停在塔上或选中塔
- **THEN** Canvas 绘制以塔为圆心的攻击范围圆圈（半透明蓝色）
