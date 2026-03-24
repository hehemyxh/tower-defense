/**
 * WorkerBridge.js
 * 封装主线程与 Worker 的通信，提供类型安全的消息发送/接收接口
 */
'use strict';

const WorkerBridge = {
  _worker: null,
  _handlers: {},   // type → [handler, ...]
  _netClient: null,
  _isHost: false,

  /**
   * 初始化 WorkerBridge
   * @param {Worker} worker       - Web Worker 实例
   * @param {boolean} isHost      - 是否为 Host
   * @param {object} [netClient]  - 联机客户端（可选）
   */
  init(worker, isHost, netClient) {
    this._worker = worker;
    this._isHost = isHost;
    this._netClient = netClient || null;

    if (worker) {
      worker.onmessage = (ev) => {
        const msg = ev.data;
        this._dispatch(msg);
      };
      worker.onerror = (e) => {
        console.error('[WorkerBridge] Worker 错误:', e.message, e);
      };
    }
  },

  /**
   * 发送消息到 Worker 或服务器
   * @param {string} type   - 消息类型
   * @param {object} data   - 消息数据
   */
  send(type, data) {
    const msg = { type, d: data };
    if (this._isHost || !this._netClient) {
      if (this._worker) this._worker.postMessage(msg);
    } else {
      if (this._netClient) this._netClient.send(msg);
    }
  },

  /**
   * 注册消息类型处理器
   * @param {string}   type     - 消息类型
   * @param {Function} handler  - 处理函数 (msg) => void
   * @returns {Function} 取消注册的函数
   */
  on(type, handler) {
    if (!this._handlers[type]) this._handlers[type] = [];
    this._handlers[type].push(handler);
    // 返回取消注册函数
    return () => {
      this._handlers[type] = this._handlers[type].filter(h => h !== handler);
    };
  },

  /**
   * 移除某类型的所有处理器
   */
  off(type) {
    delete this._handlers[type];
  },

  /**
   * 分发收到的消息到对应处理器
   */
  _dispatch(msg) {
    const type = msg.type;
    const handlers = this._handlers[type];
    if (handlers && handlers.length > 0) {
      for (const h of handlers) {
        try { h(msg); } catch (e) { console.error(`[WorkerBridge] 处理 ${type} 出错:`, e); }
      }
    }
    // 兜底：调用全局 '_all' 处理器（用于 debug 监听）
    const allHandlers = this._handlers['_all'];
    if (allHandlers) {
      for (const h of allHandlers) {
        try { h(msg); } catch (_) {}
      }
    }
  },

  /**
   * 从外部注入 NetClient 收到的消息（联机模式下由 netClient.onmessage 调用）
   */
  injectNetMessage(msg) {
    this._dispatch(msg);
  },

  /** 销毁 Worker */
  terminate() {
    if (this._worker) { this._worker.terminate(); this._worker = null; }
    this._handlers = {};
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WorkerBridge };
} else {
  window.WorkerBridge = WorkerBridge;
}
