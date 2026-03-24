/**
 * main.js — 应用入口
 * 职责：
 *  1. 加载配置（显示进度条）
 *  2. 检测 URL 参数，决定进入大厅还是直接加入房间
 *  3. 管理界面切换（loading → lobby → game）
 *  4. 协调 PeerHost / PeerClient / GameWorker / Renderer
 */

import { loadAllConfigs }  from './config/ConfigLoader.js';
import { PeerHost }        from './network/peer-host.js';
import { PeerClient }      from './network/peer-client.js';
import { Renderer }        from './game/renderer.js';

// ─── DOM 引用 ────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

const screens = {
  loading: $('screen-loading'),
  lobby:   $('screen-lobby'),
  game:    $('screen-game'),
};

const loadingBar  = $('loading-bar');
const loadingText = $('loading-text');

// 大厅
const btnCreateRoom = $('btn-create-room');
const btnSoloPlay   = $('btn-solo-play');
const roomCodeInput = $('room-code-input');
const btnJoinRoom   = $('btn-join-room');
const roomPanel     = $('room-panel');
const roomCodeDisp  = $('room-code-display');
const btnCopyLink   = $('btn-copy-link');
const playerList    = $('player-list');
const mapSelect     = $('map-select');
const btnStart      = $('btn-start-game');
const btnReady      = $('btn-ready');
const lobbyStatus   = $('lobby-status');

// 游戏 HUD
const hudGold       = $('hud-gold');
const hudLives      = $('hud-lives');
const hudWave       = $('hud-wave');
const btnStartWave  = $('btn-start-wave');
const btnPause      = $('btn-pause');
const shopPanes     = document.querySelectorAll('.shop-tab-pane');
const shopTabs      = document.querySelectorAll('.shop-tab');

// 覆盖层
const overlayResult = $('overlay-result');
const resultTitle   = $('result-title');
const overlayPause  = $('overlay-pause');
const btnResume     = $('btn-resume');
const btnQuitGame   = $('btn-quit-game');

// ─── 应用状态 ────────────────────────────────────────────────────────────────
let GameConfig  = null;
let gameWorker  = null;
let renderer    = null;
let peerHost    = null;
let peerClient  = null;
let isHost      = false;
let currentMapId = 'map_001';
let selectedTowerType = null;

// ─── 界面切换 ────────────────────────────────────────────────────────────────
function showScreen(name) {
  for (const [k, el] of Object.entries(screens)) {
    el.classList.toggle('active', k === name);
  }
}

// ─── 启动流程 ────────────────────────────────────────────────────────────────
async function boot() {
  showScreen('loading');

  try {
    GameConfig = await loadAllConfigs((pct) => {
      loadingBar.style.width = `${Math.round(pct * 100)}%`;
      loadingText.textContent = `加载配置… ${Math.round(pct * 100)}%`;
    });
    loadingBar.style.width = '100%';
    loadingText.textContent = '加载完成！';
  } catch (err) {
    loadingText.textContent = `❌ 配置加载失败: ${err.message}`;
    console.error(err);
    return;
  }

  // 填充地图选择下拉
  for (const map of GameConfig.raw.maps) {
    const opt = document.createElement('option');
    opt.value = map.id;
    opt.textContent = `${map.thumbnail} ${map.name}`;
    mapSelect?.appendChild(opt);
  }

  // 填充塔商店
  buildShop();

  // 检查是否是通过房间链接进入
  const params = new URLSearchParams(window.location.search);
  const roomId = params.get('room');

  if (roomId) {
    // 作为客户端加入
    await joinAsClient(roomId);
  } else {
    showScreen('lobby');
    await checkOfflineMode();
  }
}

// ─── 离线模式检测 ─────────────────────────────────────────────────────────────
async function checkOfflineMode() {
  // 5s 内尝试创建 PeerJS 实例，失败则禁用联机按钮
  if (typeof Peer === 'undefined') {
    setLobbyStatus('PeerJS 未加载，联机功能不可用', 'error');
    btnCreateRoom.disabled = true;
    btnJoinRoom.disabled = true;
  }
}

// ─── 大厅按钮 ────────────────────────────────────────────────────────────────
btnCreateRoom?.addEventListener('click', async () => {
  btnCreateRoom.disabled = true;
  setLobbyStatus('正在创建房间…', '');

  isHost = true;
  peerHost = new PeerHost({
    onClientInput: handleClientInput,
    onRoomUpdate:  updatePlayerList,
    onError:       (msg) => setLobbyStatus(msg, 'error'),
  });

  const playerName = localStorage.getItem('playerName') || '房主';
  try {
    const peerId = await peerHost.init(playerName);
    roomCodeDisp.textContent = peerId;
    showRoomPanel(true);
    setLobbyStatus('房间已创建，等待玩家加入…', 'ok');
  } catch (err) {
    setLobbyStatus(`创建失败: ${err.message}`, 'error');
    btnCreateRoom.disabled = false;
  }
});

btnSoloPlay?.addEventListener('click', () => {
  isHost = true;
  currentMapId = mapSelect?.value || 'map_001';
  startGame(currentMapId, null);
});

btnJoinRoom?.addEventListener('click', async () => {
  const roomId = roomCodeInput?.value.trim().toUpperCase();
  if (!roomId) { setLobbyStatus('请输入房间码', 'error'); return; }
  await joinAsClient(roomId);
});

btnCopyLink?.addEventListener('click', () => {
  if (!peerHost?.peerId) return;
  const url = `${location.origin}${location.pathname}?room=${peerHost.peerId}`;
  navigator.clipboard.writeText(url).then(() => {
    setLobbyStatus('链接已复制！发给朋友吧 🎮', 'ok');
  });
});

mapSelect?.addEventListener('change', () => {
  currentMapId = mapSelect.value;
});

btnStart?.addEventListener('click', () => {
  if (!isHost) return;
  const mapId = mapSelect?.value || 'map_001';
  // 广播开始游戏
  if (peerHost) {
    peerHost.broadcast({ type: 'GAME_START', mapId });
  }
  startGame(mapId, peerHost);
});

btnReady?.addEventListener('click', () => {
  if (peerClient) {
    peerClient.sendInput({ action: 'READY' });
    btnReady.textContent = '✓ 已准备';
    btnReady.disabled = true;
  }
});

// ─── 加入房间（客户端） ────────────────────────────────────────────────────────
async function joinAsClient(roomId) {
  showScreen('lobby');
  setLobbyStatus(`正在连接到房间 ${roomId}…`, '');
  isHost = false;

  peerClient = new PeerClient({
    onSnapshot:   (snap) => renderer?.onSnapshot(snap),
    onRoomUpdate: updatePlayerList,
    onGameEvent:  handleGameEvent,
    onError:      (msg) => setLobbyStatus(msg, 'error'),
    onDisconnect: () => setLobbyStatus('与房主断开连接', 'error'),
  });

  // 监听游戏开始
  const origOnSnapshot = peerClient._onSnapshot;
  peerClient._onGameEvent = (event) => {
    if (event.kind === 'GAME_START') {
      startGame(event.mapId, null, peerClient);
    } else {
      handleGameEvent(event);
    }
  };

  try {
    await peerClient.connect(roomId);
    showRoomPanel(false);
    setLobbyStatus('已加入房间！', 'ok');
  } catch (err) {
    setLobbyStatus(`连接失败: ${err.message}`, 'error');
  }
}

// ─── 启动游戏 ────────────────────────────────────────────────────────────────
function startGame(mapId, host, client) {
  currentMapId = mapId;
  showScreen('game');

  const canvas = $('game-canvas');
  renderer = new Renderer(canvas, GameConfig);
  renderer.setMap(mapId);
  renderer.start();

  // Canvas 点击事件
  canvas.addEventListener('click', onCanvasClick);

  // 只有房主才启动 Worker
  // 使用 Blob URL 方式创建 Worker，兼容 file:// 协议
  if (isHost) {
    const workerUrl = new URL('./js/worker/game-worker.js', location.href).href;
    try {
      gameWorker = new Worker(workerUrl, { type: 'module' });
    } catch (e) {
      // 部分浏览器 file:// 下 module worker 也受限，fallback 提示
      console.error('[main] Worker 创建失败:', e);
      alert('请通过本地服务器访问游戏（推荐）：\n在项目目录运行 npx serve . 后访问 http://localhost:3000\n\n或直接用 Chrome 并添加启动参数 --allow-file-access-from-files');
      showScreen('lobby');
      return;
    }

    gameWorker.onmessage = ({ data: msg }) => {
      if (!msg) return;
      switch (msg.type) {
        case 'READY':
          updateHUD({ gold: GameConfig.maps.get(mapId)?.startGold, lives: GameConfig.maps.get(mapId)?.startLives, wave: 0, totalWaves: 0, phase: 'prep' });
          break;
        case 'STATE_SNAPSHOT':
          renderer.onSnapshot(msg.snapshot);
          updateHUD(msg.snapshot);
          // 广播给客户端
          host?.broadcast(msg.snapshot);
          break;
        case 'GAME_EVENT':
          handleGameEvent(msg.event);
          // 广播事件给客户端
          host?.broadcast({ type: 'GAME_EVENT', event: msg.event });
          break;
      }
    };

    // 传递可序列化配置给 Worker（Map → plain object）
    const serializableConfig = {
      effects: Object.fromEntries(GameConfig.effects),
      skills:  Object.fromEntries(GameConfig.skills),
      towers:  Object.fromEntries(GameConfig.towers),
      enemies: Object.fromEntries(GameConfig.enemies),
      maps:    Object.fromEntries(GameConfig.maps),
      waves:   GameConfig.waves,
    };

    gameWorker.postMessage({ type: 'INIT', config: serializableConfig, mapId });
  }
}

// ─── HUD 更新 ────────────────────────────────────────────────────────────────
function updateHUD(snap) {
  if (!snap) return;
  if (hudGold)  hudGold.textContent  = snap.gold  ?? '--';
  if (hudLives) hudLives.textContent = snap.lives ?? '--';
  if (hudWave)  hudWave.textContent  = snap.wave != null ? `第 ${snap.wave} / ${snap.totalWaves} 波` : '';

  if (btnStartWave) {
    btnStartWave.disabled = snap.phase !== 'prep';
  }
}

// ─── 游戏事件 ────────────────────────────────────────────────────────────────
function handleGameEvent(event) {
  if (!event) return;
  switch (event.kind) {
    case 'WAVE_START':
      showWaveAnnouncement(`第 ${event.wave} 波！`);
      break;
    case 'WAVE_COMPLETE':
      showWaveAnnouncement(`第 ${event.wave} 波清除！`);
      break;
    case 'GAME_WIN':
      overlayResult?.classList.remove('hidden');
      if (resultTitle) { resultTitle.textContent = '胜 利'; resultTitle.className = 'result-title win'; }
      break;
    case 'GAME_OVER':
      overlayResult?.classList.remove('hidden');
      if (resultTitle) { resultTitle.textContent = '失 败'; resultTitle.className = 'result-title lose'; }
      break;
    case 'ENEMY_KILLED':
      // 可以在这里做飘字，但需要知道坐标，简化处理
      break;
    case 'INSUFFICIENT_GOLD':
      setLobbyStatus('金币不足！', 'error');
      break;
  }
}

// ─── 客户端输入处理（房主收到） ──────────────────────────────────────────────
function handleClientInput(msg) {
  if (!gameWorker) return;
  gameWorker.postMessage({ type: 'INPUT', ...msg });
}

// ─── Canvas 点击 ─────────────────────────────────────────────────────────────
function onCanvasClick(e) {
  if (!renderer || !selectedTowerType) return;
  const cell = renderer.getCellAt(e.clientX, e.clientY);
  if (!cell) return;

  const input = { action: 'BUILD_TOWER', data: { col: cell.col, row: cell.row, towerType: selectedTowerType } };

  if (isHost && gameWorker) {
    gameWorker.postMessage({ type: 'INPUT', playerId: 'host', ...input });
  } else if (peerClient) {
    peerClient.sendInput(input);
  }
}

// ─── 商店 ────────────────────────────────────────────────────────────────────
function buildShop() {
  const pane = document.getElementById('shop-towers');
  if (!pane || !GameConfig) return;
  pane.innerHTML = '';

  // 只显示一级塔
  const baseTowers = GameConfig.raw.towers.filter(t => !t.id.match(/_\d+$/i) || t.id.endsWith('_archer') || !t.id.match(/_\d/));
  const primary = GameConfig.raw.towers.filter(t => {
    // 筛选基础塔（没有 _2 _3 后缀的即为基础）
    return !/_(2|3)$/.test(t.id);
  });

  for (const tower of primary) {
    const card = document.createElement('div');
    card.className = 'tower-card';
    card.dataset.towerId = tower.id;
    card.innerHTML = `
      <div class="tower-card-header">
        <span class="tower-card-name">${tower.icon} ${tower.name}</span>
        <span class="tower-card-cost">💰${tower.cost}</span>
      </div>
      <div class="tower-card-desc">${tower.desc}</div>
    `;
    card.addEventListener('click', () => {
      document.querySelectorAll('.tower-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedTowerType = tower.id;
      if (renderer) renderer.pendingTowerType = tower.id;
    });
    pane.appendChild(card);
  }
}

// ─── 商店标签切换 ─────────────────────────────────────────────────────────────
shopTabs?.forEach(tab => {
  tab.addEventListener('click', () => {
    shopTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;
    shopPanes?.forEach(p => p.classList.toggle('active', p.id === `shop-${target}`));
  });
});

// ─── 波次控制 ────────────────────────────────────────────────────────────────
btnStartWave?.addEventListener('click', () => {
  if (!isHost || !gameWorker) return;
  gameWorker.postMessage({ type: 'START_WAVE' });
});

btnPause?.addEventListener('click', () => {
  if (!isHost || !gameWorker) return;
  gameWorker.postMessage({ type: 'PAUSE' });
  overlayPause?.classList.remove('hidden');
});

btnResume?.addEventListener('click', () => {
  if (!isHost || !gameWorker) return;
  gameWorker.postMessage({ type: 'RESUME' });
  overlayPause?.classList.add('hidden');
});

btnQuitGame?.addEventListener('click', () => {
  location.href = location.pathname; // 去掉 room 参数，回到大厅
});

// ─── 辅助 ────────────────────────────────────────────────────────────────────
function showRoomPanel(asHost) {
  roomPanel?.classList.remove('hidden');
  btnStart && (btnStart.style.display = asHost ? '' : 'none');
  btnReady && (btnReady.style.display = asHost ? 'none' : '');
}

function updatePlayerList(players) {
  if (!playerList) return;
  playerList.innerHTML = '';
  for (const p of players) {
    const li = document.createElement('li');
    const initials = (p.name || '?').charAt(0).toUpperCase();
    li.innerHTML = `
      <div class="player-avatar">${initials}</div>
      <span>${p.name || '玩家'}</span>
      ${p.isHost ? '<span class="player-badge-host">房主</span>' : ''}
    `;
    playerList.appendChild(li);
  }
}

function setLobbyStatus(msg, type = '') {
  if (!lobbyStatus) return;
  lobbyStatus.textContent = msg;
  lobbyStatus.className = 'status-text' + (type ? ` status-${type}` : '');
}

function showWaveAnnouncement(text) {
  const el = document.querySelector('.wave-announcement');
  if (!el) return;
  el.textContent = text;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

// ─── 启动 ─────────────────────────────────────────────────────────────────────
boot();
