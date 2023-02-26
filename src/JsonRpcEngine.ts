export class Engine {
  private _isDestroyed = false;

  private _middleware;
  constructor() {
    this._middleware = [];
  }
  private _assertIsNotDestoryed() {
    if (this._isDestroyed) {
      throw new Error("");
    }
  }
  destroy() {
    this._middleware.forEach((middleware) => {
      if (Reflect.has(middleware, "destroy") && typeof middleware.destroy === "function") {
        middleware.destroy();
      }
    });

    this._middleware = [];
    this._isDestroyed = true;
  }
  push(middleware) {
    this._assertIsNotDestoryed();
    this._middleware.push(middleware);
  }

  hanlde(req, callback) {
    this._assertIsNotDestoryed();
    if (callback && typeof callback !== "function") throw new Error("");

    if (Array.isArray(req)) {
      if (callback) {
        return this._handleBatch(req, callback);
      }
      return this._handleBatch(req);
    }

    if (callback) return this._handle(req, callback);
    return this._handle(req);
  }

  asMiddleware() {}

  private async _handleBatch(reqs, callback) {
    try {
      const responses = (await Promise.all(reqs.map(this._promiseHandle.bind(this)))).filter((response) => response !== undefined);

      if (callback) {
        return callback(null, responses);
      }
      return responses;
    } catch (error) {
      if (callback) return callback(error);
      throw error;
    }
  }

  private _promiseHandle(req) {
    return new Promise((resolve, reject) => {
      this._handle(req, (error, res) => {
        if (error && res === undefined) reject(error);
        resolve(res);
      });
    });
  }

  private async _handle(callerReq, callback) {}

  private static async _processRequest() {}

  private static async _runAllMiddleware() {}

  private static _runMiddleware() {}

  private static async _runReturnHanlders() {}

  private static _checkForCompletion() {}
}
