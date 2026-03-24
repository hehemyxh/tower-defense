## ADDED Requirements

### Requirement: Buff/Debuff 效果栈管理
系统 SHALL 管理每个单位上的所有 Buff/Debuff 效果，支持可叠加（按最大层数）和不可叠加（覆盖/刷新）两种模式。

#### Scenario: 可叠加效果达到最大层数
- **WHEN** 一个已有 3 层"燃烧"效果（maxStack=3）的敌人再次受到燃烧
- **THEN** 燃烧层数保持在 3 层（上限），刷新持续时间

#### Scenario: 不可叠加效果被刷新
- **WHEN** 一个已有"减速"效果的敌人再次受到减速
- **THEN** 减速效果持续时间重置为新值，效果不重复叠加

### Requirement: 技能冷却与能量消耗
系统 SHALL 追踪每个单位的技能冷却时间和能量值，在满足条件时自动/手动触发技能。

#### Scenario: 自动技能触发
- **WHEN** 单位的技能冷却归零且能量 ≥ ManaCost
- **THEN** 技能自动释放，扣除 ManaCost 能量，冷却重置为 Cooldown 值

#### Scenario: 能量不足无法释放技能
- **WHEN** 单位技能冷却归零但能量 < ManaCost
- **THEN** 技能不释放，等待能量恢复至足够值

### Requirement: AOE 技能范围伤害
系统 SHALL 对 AOE 类技能，计算以施法目标为圆心、Radius 为半径范围内的所有敌方单位，对其施加伤害或效果。

#### Scenario: 范围伤害命中多个目标
- **WHEN** AOE 技能（如迫击轰炸，Radius=5）在目标位置爆炸
- **THEN** 以目标点为圆心，半径 5 格内所有敌方单位均受到伤害
- **AND** 同时应用技能携带的效果（如眩晕）
