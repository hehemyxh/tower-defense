## ADDED Requirements

### Requirement: Buff 由 JSON 描述符定义
系统 SHALL 用 JSON 描述符表示所有 Buff/Debuff，描述符包含 id、stat（影响属性）、op（additive/multiply/override）、value、duration（-1 为永久）、stackRule（replace/stack/cap）字段。

#### Scenario: 羁绊 Buff 描述符合法
- **WHEN** 加载 `data/synergies.json`
- **THEN** 每个羁绊 tier 的 fx 字段可映射为合法的 BuffDefinition，包含 stat 和 op 字段

#### Scenario: 非法描述符被拒绝
- **WHEN** 注册一个缺少 stat 字段的 BuffDefinition
- **THEN** BuffSystem 抛出异常或记录错误，不应用该 Buff

### Requirement: BuffManager 管理实体的活跃 Buff 列表
系统 SHALL 在 Worker 内为每个塔（tower entity）维护 `buffs[]` 数组，通过 `BuffManager.apply(entity, buffDef)`、`BuffManager.remove(entity, buffId)`、`BuffManager.tick(entity)` 进行生命周期管理。

#### Scenario: 应用永久 Buff
- **WHEN** 羁绊条件满足，对实体调用 `BuffManager.apply(tower, synergyBuffDef)`（duration: -1）
- **THEN** `tower.buffs` 包含该 Buff，且该 Buff 不因 tick 而过期

#### Scenario: 应用临时 Buff
- **WHEN** 对实体应用 duration 为 N ticks 的临时 Buff
- **THEN** 经过 N 次 tick 后，`BuffManager.tick(entity)` 将该 Buff 从 `buffs[]` 移除

#### Scenario: replace stackRule 防止重复叠加
- **WHEN** 对已有 stackRule: "replace" Buff 的实体再次应用同 id 的 Buff
- **THEN** 旧 Buff 被新 Buff 替换，不产生双重效果

### Requirement: calcEffectiveStat 按规则计算最终属性
系统 SHALL 提供 `BuffManager.calcEffectiveStat(entity, stat)` 方法，按 additive → multiply 顺序叠加所有活跃 Buff，返回计算后的最终属性值。

#### Scenario: additive Buff 累加
- **WHEN** 实体有两个 stat: "dmg", op: "additive" 的 Buff，value 分别为 10 和 5
- **THEN** `calcEffectiveStat(entity, "dmg")` 返回 `entity.baseDmg + 10 + 5`

#### Scenario: multiply Buff 乘算
- **WHEN** 实体有 stat: "dmg", op: "multiply", value: 1.20 的 Buff
- **THEN** `calcEffectiveStat(entity, "dmg")` 返回 `entity.baseDmg * 1.20`

#### Scenario: additive 先于 multiply 计算
- **WHEN** 实体同时有 additive +10 和 multiply 1.20 的 dmg Buff，baseDmg 为 100
- **THEN** 最终 dmg = (100 + 10) * 1.20 = 132

### Requirement: 羁绊激活/失效时自动注入/撤销 Buff
系统 SHALL 在 SynergySystem 检测到羁绊数量变化时，自动对所有相关塔调用 BuffManager.apply 或 BuffManager.remove，不需要手动维护 synergyBufs 字段。

#### Scenario: 上阵 2 个奥术角色触发羁绊
- **WHEN** 玩家在地图上放置第 2 个奥术角色
- **THEN** SynergySystem 检测到 arcane 羁绊达到 2 件套，对所有奥术塔注入 dmg multiply 1.20 的 Buff

#### Scenario: 撤回角色解除羁绊
- **WHEN** 玩家从地图撤回 1 个奥术角色，奥术数量降为 1
- **THEN** SynergySystem 移除所有奥术塔的 arcane_dmg_2 Buff
