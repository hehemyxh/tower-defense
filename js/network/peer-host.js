/**
 * PeerHost — 房主端 P2P 网络管理
 *
 * 职责：
 * - 初始化 PeerJS 并监听远程连接
 * - 维护最多 MAX_PLAYERS-1 条 DataChannel
 * - 向所有客户端广播 STATE_SNAPSHOT
 * - 接收客户端 INPUT 并通过回调转发至 Worker
 * - 检测断线，广播房间成员更新
 */

const MAX_PLAYERS = 4;

export class PeerHost {
  /**
   * @param {object} options
   * @param {function(object):void} options.onClientInput   收到客户端输入
   * @param {function(object[]):void} options.onRoomUpdate  房间成员变化
   * @param {function(string):void}  options.onError        错误信息
   */
  constructor({ onClientInput, onRoomUpdate, onError }) {
    this._onClientInput = onClientInput;
    this._onRoomUpdate  = onRoomUpdate;
    this._onError       = onError;

    /** @type {Map<string, { conn: any, playerId: string, name: string }>} */
    this._clients = new Map();

    /** @type {any} PeerJS Peer 实例 */
    this._peer = null;

    /** @type {string|null} */
    this.peerId = null;

    this._hostPlayer = null; // 房主自身信息
  }

  /**
   * 初始化并获取 PeerID
   * @param {string} hostName 房主昵称
   * @returns {Promise<string>} peerId
   */
  init(hostName) {
    return new Promise((resolve, reject) => {
      if (typeof Peer === 'undefined') {
        reject(new Error('PeerJS 未加载'));
        return;
      }

      // 使用随机 ID（6位字母数字）作为房间码
      const roomId = Math.random().toString(36).slice(2, 8).toUpperCase();

      this._peer = new Peer(roomId, {
        debug: 0,
      });

      // 超时检测
      const timeout = setTimeout(() => {
        reject(new Error('PeerJS 连接超时，可能无网络'));
      }, 8000);

      this._peer.on('open', (id) => {
        clearTimeout(timeout);
        this.peerId = id;
        this._hostPlayer = { id: 'host', peerId: id, name: hostName, isHost: true };
        this._broadcastRoomUpdate();
        resolve(id);
      });

      this._peer.on('connection', (conn) => {
        this._handleIncoming(conn);
      });

      this._peer.on('error', (err) => {
        clearTimeout(timeout);
        this._onError(`PeerJS 错误: ${err.type}`);
        reject(err);
      });
    });
  }

  /** 处理新连接请求 */
  _handleIncoming(conn) {
    // 超过人数上限则拒绝
    if (this._clients.size >= MAX_PLAYERS - 1) {
      conn.on('open', () => {
        conn.send({ type: 'ROOM_FULL' });
        conn.close();
      });
      return;
    }

    conn.on('open', () => {
      const playerId = `p${Date.now().toString(36)}`;
      const entry = { conn, playerId, name: '玩家' };
      this._clients.set(conn.peer, entry);

      // 通知新玩家其分配的ID
      conn.send({ type: 'WELCOME', playerId, roomId: this.peerId });

      this._broadcastRoomUpdate();

      conn.on('data', (msg) => {
        this._handleClientMessage(conn.peer, msg);
      });

      conn.on('close', () => {
        this._clients.delete(conn.peer);
        this._broadcastRoomUpdate();
      });

      conn.on('error', (err) => {
        console.warn('[PeerHost] 连接错误:', conn.peer, err);
        this._clients.delete(conn.peer);
        this._broadcastRoomUpdate();
      });
    });
  }

  /** 处理客户端消息 */
  _handleClientMessage(peerId, msg) {
    if (!msg || !msg.type) return;
    const entry = this._clients.get(peerId);
    if (!entry) return;

    switch (msg.type) {
      case 'INPUT':
        // 附加玩家ID后转发给 Worker
        this._onClientInput({ ...msg, playerId: entry.playerId });
        break;

      case 'SET_NAME':
        entry.name = String(msg.name).slice(0, 16);
        this._broadcastRoomUpdate();
        break;

      default:
        console.warn('[PeerHost] 未知消息类型:', msg.type);
    }
  }

  /**
   * 广播游戏状态快照给所有客户端
   * @param {object} snapshot
   */
  broadcast(snapshot) {
    const msg = { type: 'STATE_SNAPSHOT', snapshot };
    for (const { conn } of this._clients.values()) {
      if (conn.open) {
        try { conn.send(msg); } catch (_) { /* 忽略发送失败 */ }
      }
    }
  }

  /**
   * 向特定客户端发送消息
   * @param {string} peerId
   * @param {object} msg
   */
  sendTo(peerId, msg) {
    const entry = this._clients.get(peerId);
    if (entry && entry.conn.open) {
      try { entry.conn.send(msg); } catch (_) {}
    }
  }

  /** 广播房间成员列表更新 */
  _broadcastRoomUpdate() {
    const players = this._getRoomPlayers();
    this._onRoomUpdate(players);
    const msg = { type: 'ROOM_UPDATE', players };
    for (const { conn } of this._clients.values()) {
      if (conn.open) {
        try { conn.send(msg); } catch (_) {}
      }
    }
  }

  /** 获取当前房间所有玩家列表 */
  _getRoomPlayers() {
    const list = [this._hostPlayer];
    for (const { playerId, name } of this._clients.values()) {
      list.push({ id: playerId, name, isHost: false });
    }
    return list;
  }

  /** 获取已连接客户端数量（不含房主） */
  get clientCount() {
    return this._clients.size;
  }

  /** 销毁，断开所有连接 */
  destroy() {
    if (this._peer) {
      this._peer.destroy();
      this._peer = null;
    }
    this._clients.clear();
  }
}
