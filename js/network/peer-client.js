/**
 * PeerClient — 玩家客户端 P2P 网络
 *
 * 职责：
 * - 从 URL ?room=XXXXX 参数中读取房主 PeerID
 * - 连接到房主
 * - 接收 STATE_SNAPSHOT / ROOM_UPDATE / GAME_EVENT 并触发回调
 * - 发送玩家 INPUT 给房主
 */

export class PeerClient {
  /**
   * @param {object} options
   * @param {function(object):void}   options.onSnapshot    收到状态快照
   * @param {function(object[]):void} options.onRoomUpdate  房间成员变化
   * @param {function(object):void}   options.onGameEvent   收到游戏事件
   * @param {function(string):void}   options.onError       错误信息
   * @param {function():void}         options.onDisconnect  断开连接
   */
  constructor({ onSnapshot, onRoomUpdate, onGameEvent, onError, onDisconnect }) {
    this._onSnapshot    = onSnapshot;
    this._onRoomUpdate  = onRoomUpdate;
    this._onGameEvent   = onGameEvent;
    this._onError       = onError;
    this._onDisconnect  = onDisconnect;

    /** @type {any} PeerJS Peer 实例 */
    this._peer = null;
    /** @type {any} DataConnection 到房主 */
    this._conn = null;
    /** @type {string|null} 自身分配的 playerId */
    this.playerId = null;
    /** @type {string|null} */
    this.hostPeerId = null;
  }

  /**
   * 从 URL 参数中读取房间码并连接
   * @returns {Promise<string>} playerId
   */
  connectFromURL() {
    const params = new URLSearchParams(window.location.search);
    const roomId = params.get('room');
    if (!roomId) {
      return Promise.reject(new Error('URL 中没有 room 参数'));
    }
    return this.connect(roomId);
  }

  /**
   * 连接到指定房间
   * @param {string} roomId 房主的 PeerID
   * @returns {Promise<string>} playerId
   */
  connect(roomId) {
    return new Promise((resolve, reject) => {
      if (typeof Peer === 'undefined') {
        reject(new Error('PeerJS 未加载'));
        return;
      }

      this.hostPeerId = roomId;
      // 客户端使用随机 PeerID
      this._peer = new Peer(undefined, { debug: 0 });

      const timeout = setTimeout(() => {
        reject(new Error('连接超时'));
      }, 10000);

      this._peer.on('open', () => {
        this._conn = this._peer.connect(roomId, {
          reliable: true,
          serialization: 'json',
        });

        this._conn.on('open', () => {
          clearTimeout(timeout);
          // 发送昵称
          const storedName = localStorage.getItem('playerName') || '玩家';
          this._conn.send({ type: 'SET_NAME', name: storedName });
        });

        this._conn.on('data', (msg) => {
          this._handleMessage(msg, resolve);
        });

        this._conn.on('close', () => {
          this._onDisconnect && this._onDisconnect();
        });

        this._conn.on('error', (err) => {
          clearTimeout(timeout);
          this._onError(`连接错误: ${err}`);
          reject(err);
        });
      });

      this._peer.on('error', (err) => {
        clearTimeout(timeout);
        const msg = err.type === 'peer-unavailable'
          ? '房间不存在或已关闭'
          : `网络错误: ${err.type}`;
        this._onError(msg);
        reject(new Error(msg));
      });
    });
  }

  /** 处理来自房主的消息 */
  _handleMessage(msg, resolveConnect) {
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case 'WELCOME':
        this.playerId = msg.playerId;
        resolveConnect && resolveConnect(msg.playerId);
        resolveConnect = null; // 只 resolve 一次
        break;

      case 'ROOM_FULL':
        this._onError('房间已满（最多4人）');
        this._conn && this._conn.close();
        break;

      case 'STATE_SNAPSHOT':
        this._onSnapshot && this._onSnapshot(msg.snapshot);
        break;

      case 'ROOM_UPDATE':
        this._onRoomUpdate && this._onRoomUpdate(msg.players);
        break;

      case 'GAME_EVENT':
        this._onGameEvent && this._onGameEvent(msg.event);
        break;

      default:
        console.warn('[PeerClient] 未知消息:', msg.type);
    }
  }

  /**
   * 发送输入事件到房主
   * @param {object} inputPayload  { action, ...data }
   */
  sendInput(inputPayload) {
    if (!this._conn || !this._conn.open) return;
    try {
      this._conn.send({ type: 'INPUT', ...inputPayload });
    } catch (_) {}
  }

  /** 是否已连接 */
  get connected() {
    return !!(this._conn && this._conn.open);
  }

  /** 销毁 */
  destroy() {
    if (this._conn) { try { this._conn.close(); } catch (_) {} }
    if (this._peer) { try { this._peer.destroy(); } catch (_) {} }
    this._conn = null;
    this._peer = null;
  }
}
