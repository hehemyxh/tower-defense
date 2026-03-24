/**
 * Renderer — Canvas 渲染器
 * 运行在主线程，接收来自 Worker 的 snapshot 进行插值渲染
 */

export class Renderer {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} gameConfig  ConfigLoader 返回的配置
   */
  constructor(canvas, gameConfig) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.config = gameConfig;

    /** 当前快照（来自 Worker） */
    this.snapshot = null;
    /** 上一帧快照（用于插值） */
    this.prevSnapshot = null;

    /** 地图配置 */
    this.mapCfg = null;
    /** 路径格子 Set，用于快速判断 */
    this.pathSet = new Set();

    /** 选中塔的ID（用于显示范围圆） */
    this.selectedTowerId = null;

    /** 鼠标悬停格子 */
    this.hoverCell = null;
    /** 当前正在放置的塔类型 */
    this.pendingTowerType = null;

    /** 飘字特效列表 */
    this._floatingTexts = [];

    /** rAF ID */
    this._rafId = null;

    this._bindEvents();
  }

  // ─── 初始化 ────────────────────────────────────────────────
  setMap(mapId) {
    this.mapCfg = this.config.maps.get(mapId);
    if (!this.mapCfg) return;
    this.pathSet.clear();
    for (const [c, r] of this.mapCfg.path) {
      this.pathSet.add(`${c},${r}`);
    }
    this._resizeCanvas();
  }

  _resizeCanvas() {
    if (!this.mapCfg) return;
    const { cols, rows, tileSize } = this.mapCfg.grid;
    this.canvas.width  = cols * tileSize;
    this.canvas.height = rows * tileSize;
  }

  // ─── 快照更新 ──────────────────────────────────────────────
  onSnapshot(snapshot) {
    this.prevSnapshot = this.snapshot;
    this.snapshot = snapshot;
  }

  // ─── 主渲染循环 ────────────────────────────────────────────
  start() {
    const loop = (ts) => {
      this._rafId = requestAnimationFrame(loop);
      this._render(ts);
    };
    this._rafId = requestAnimationFrame(loop);
  }

  stop() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this._rafId = null;
  }

  _render(ts) {
    const ctx = this.ctx;
    const snap = this.snapshot;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.mapCfg) return;

    this._drawMap();
    if (snap) {
      this._drawTowers(snap);
      this._drawEnemies(snap);
      this._drawProjectiles(snap);
    }
    this._drawHoverCell();
    this._drawFloatingTexts(ts);
  }

  // ─── 地图渲染 ──────────────────────────────────────────────
  _drawMap() {
    const { cols, rows, tileSize: ts } = this.mapCfg.grid;
    const ctx = this.ctx;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isPath = this.pathSet.has(`${c},${r}`);
        ctx.fillStyle = isPath ? '#6b4c2a' : '#2d4a1e';
        ctx.fillRect(c * ts, r * ts, ts, ts);

        // 网格线
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(c * ts, r * ts, ts, ts);
      }
    }

    // 路径高亮（边界线）
    ctx.strokeStyle = '#a0723a';
    ctx.lineWidth = 2;
    const path = this.mapCfg.path;
    if (path.length > 1) {
      ctx.beginPath();
      ctx.moveTo(path[0][0] * ts + ts / 2, path[0][1] * ts + ts / 2);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i][0] * ts + ts / 2, path[i][1] * ts + ts / 2);
      }
      ctx.stroke();
    }

    // 起点/终点标记
    const sp = path[0];
    const ep = path[path.length - 1];
    ctx.fillStyle = '#27ae60';
    ctx.font = `${ts * 0.6}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('→', sp[0] * ts + ts / 2, sp[1] * ts + ts / 2);
    ctx.fillStyle = '#e74c3c';
    ctx.fillText('⚑', ep[0] * ts + ts / 2, ep[1] * ts + ts / 2);
  }

  // ─── 塔渲染 ────────────────────────────────────────────────
  _drawTowers(snap) {
    const ctx = this.ctx;
    const ts = this.mapCfg.grid.tileSize;

    for (const t of snap.towers) {
      const tCfg = this.config.towers.get(t.towerType);
      const color = tCfg?.color || '#888';
      const icon  = tCfg?.icon  || '🗼';

      // 塔背景
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(t.col * ts + 4, t.row * ts + 4, ts - 8, ts - 8, 6);
      ctx.fill();

      // 图标
      ctx.font = `${ts * 0.55}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(icon, t.x, t.y);

      // 等级标记
      if (t.level > 1) {
        ctx.font = 'bold 9px sans-serif';
        ctx.fillStyle = '#ffd43b';
        ctx.fillText(`Lv${t.level}`, t.x, t.row * ts + ts - 8);
      }

      // 攻击范围圆（选中或悬停时）
      if (t.id === this.selectedTowerId) {
        const range = tCfg?.stats?.range || 120;
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(t.x, t.y, range, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  // ─── 敌人渲染 ──────────────────────────────────────────────
  _drawEnemies(snap) {
    const ctx = this.ctx;

    for (const e of snap.enemies) {
      const eCfg = this.config.enemies.get(e.enemyType);
      const color  = eCfg?.color  || '#c0392b';
      const icon   = eCfg?.icon   || '👾';
      const radius = e.size || 14;

      // 敌人本体
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(e.x, e.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // 图标
      ctx.font = `${radius * 1.2}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(icon, e.x, e.y);

      // 血条
      const barW = radius * 2.5;
      const barH = 4;
      const bx = e.x - barW / 2;
      const by = e.y - radius - 8;
      ctx.fillStyle = '#333';
      ctx.fillRect(bx, by, barW, barH);
      const hpPct = Math.max(0, e.hp / e.maxHp);
      ctx.fillStyle = hpPct > 0.5 ? '#2ecc71' : hpPct > 0.25 ? '#f1c40f' : '#e74c3c';
      ctx.fillRect(bx, by, barW * hpPct, barH);

      // 护盾条
      if (e.shieldHp > 0) {
        ctx.strokeStyle = '#74b9ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(e.x, e.y, radius + 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 效果图标
      if (e.effects && e.effects.length) {
        let ex = e.x - (e.effects.length - 1) * 8;
        for (const effId of e.effects) {
          const effCfg = this.config.effects.get(effId);
          if (effCfg) {
            ctx.font = '10px serif';
            ctx.fillText(effCfg.icon, ex, e.y + radius + 8);
          }
          ex += 14;
        }
      }
    }
  }

  // ─── 抛射物渲染 ────────────────────────────────────────────
  _drawProjectiles(snap) {
    const ctx = this.ctx;
    ctx.fillStyle = '#ffd43b';
    for (const p of snap.projectiles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ─── 悬停格子 ──────────────────────────────────────────────
  _drawHoverCell() {
    if (!this.hoverCell || !this.pendingTowerType) return;
    const { col, row } = this.hoverCell;
    const ts = this.mapCfg.grid.tileSize;
    const onPath = this.pathSet.has(`${col},${row}`);

    this.ctx.fillStyle = onPath ? 'rgba(231,76,60,0.4)' : 'rgba(46,213,115,0.3)';
    this.ctx.fillRect(col * ts, row * ts, ts, ts);

    // 显示范围圆
    if (!onPath) {
      const tCfg = this.config.towers.get(this.pendingTowerType);
      if (tCfg) {
        const range = tCfg.stats.range;
        this.ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([4, 4]);
        this.ctx.beginPath();
        this.ctx.arc(col * ts + ts / 2, row * ts + ts / 2, range, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }
    }
  }

  // ─── 飘字特效 ──────────────────────────────────────────────
  addFloatingText(x, y, text, color = '#fff') {
    this._floatingTexts.push({ x, y, text, color, life: 1.0, vy: -60 });
  }

  _drawFloatingTexts(ts) {
    const dt = 1 / 60;
    const ctx = this.ctx;
    for (let i = this._floatingTexts.length - 1; i >= 0; i--) {
      const ft = this._floatingTexts[i];
      ft.life -= dt * 1.5;
      ft.y += ft.vy * dt;
      if (ft.life <= 0) { this._floatingTexts.splice(i, 1); continue; }
      ctx.globalAlpha = ft.life;
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.globalAlpha = 1;
  }

  // ─── 鼠标事件 ──────────────────────────────────────────────
  _bindEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.mapCfg) return;
      const rect = this.canvas.getBoundingClientRect();
      const ts = this.mapCfg.grid.tileSize;
      const col = Math.floor((e.clientX - rect.left) / ts);
      const row = Math.floor((e.clientY - rect.top) / ts);
      this.hoverCell = { col, row };
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.hoverCell = null;
    });
  }

  /**
   * 根据像素坐标获取格子
   * @param {number} px @param {number} py
   * @returns {{ col, row }}
   */
  getCellAt(px, py) {
    if (!this.mapCfg) return null;
    const rect = this.canvas.getBoundingClientRect();
    const ts = this.mapCfg.grid.tileSize;
    return {
      col: Math.floor((px - rect.left) / ts),
      row: Math.floor((py - rect.top)  / ts),
    };
  }
}
