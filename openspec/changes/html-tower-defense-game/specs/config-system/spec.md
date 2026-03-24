## ADDED Requirements

### Requirement: 配置表按层级加载
系统 SHALL 在游戏启动时按 Level1→Level5 的依赖顺序加载 18 张 JSON 配置文件，确保低层级配置先于高层级配置就绪。

#### Scenario: 正常启动加载所有配置
- **WHEN** 游戏页面加载完成
- **THEN** 系统按顺序加载 Level1（effect、economy）→ Level2（skill、enemy-skill、talisman、equipment、equipment-set）→ Level3（hero、tower、enemy）→ Level4（archetype、shop、talisman-pool）→ Level5（level、wave、boss-wave）
- **AND** 全部加载完成后显示主菜单

#### Scenario: 配置文件加载失败
- **WHEN** 某张配置文件网络请求失败
- **THEN** 系统显示错误提示，指明失败的文件名
- **AND** 游戏不进入主菜单

### Requirement: 配置数据外键校验
系统 SHALL 在所有配置加载完成后，校验所有外键引用的合法性（如 Hero.SkillID 必须存在于 skill.json 中）。

#### Scenario: 外键引用有效
- **WHEN** 所有配置加载完成
- **THEN** 系统遍历所有外键字段，验证引用 ID 均存在于目标配置表中
- **AND** 校验通过后游戏正常启动

#### Scenario: 外键引用无效
- **WHEN** 校验发现某条记录的外键 ID 不存在于目标配置表
- **THEN** 系统在控制台输出警告信息，指明具体配置表、记录 ID 和缺失的外键值
- **AND** 游戏仍可启动（降级处理，不崩溃）

### Requirement: 配置数据索引与快速查询
系统 SHALL 为每张配置表建立以主键 ID 为 key 的 Map 索引，支持 O(1) 查询。

#### Scenario: 按 ID 查询配置
- **WHEN** 游戏逻辑需要查询某个 HeroID 的配置
- **THEN** ConfigLoader.getHero(heroId) 在 1ms 内返回对应配置对象
- **AND** 若 ID 不存在则返回 null
