(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn2, res) => function __init() {
    return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/@rails/actioncable/src/adapters.js
  var adapters_default;
  var init_adapters = __esm({
    "node_modules/@rails/actioncable/src/adapters.js"() {
      adapters_default = {
        logger: self.console,
        WebSocket: self.WebSocket
      };
    }
  });

  // node_modules/@rails/actioncable/src/logger.js
  var logger_default;
  var init_logger = __esm({
    "node_modules/@rails/actioncable/src/logger.js"() {
      init_adapters();
      logger_default = {
        log(...messages) {
          if (this.enabled) {
            messages.push(Date.now());
            adapters_default.logger.log("[ActionCable]", ...messages);
          }
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/connection_monitor.js
  var now, secondsSince, ConnectionMonitor, connection_monitor_default;
  var init_connection_monitor = __esm({
    "node_modules/@rails/actioncable/src/connection_monitor.js"() {
      init_logger();
      now = () => (/* @__PURE__ */ new Date()).getTime();
      secondsSince = (time) => (now() - time) / 1e3;
      ConnectionMonitor = class {
        constructor(connection) {
          this.visibilityDidChange = this.visibilityDidChange.bind(this);
          this.connection = connection;
          this.reconnectAttempts = 0;
        }
        start() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            addEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log(`ConnectionMonitor started. stale threshold = ${this.constructor.staleThreshold} s`);
          }
        }
        stop() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            removeEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log("ConnectionMonitor stopped");
          }
        }
        isRunning() {
          return this.startedAt && !this.stoppedAt;
        }
        recordPing() {
          this.pingedAt = now();
        }
        recordConnect() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          logger_default.log("ConnectionMonitor recorded connect");
        }
        recordDisconnect() {
          this.disconnectedAt = now();
          logger_default.log("ConnectionMonitor recorded disconnect");
        }
        // Private
        startPolling() {
          this.stopPolling();
          this.poll();
        }
        stopPolling() {
          clearTimeout(this.pollTimeout);
        }
        poll() {
          this.pollTimeout = setTimeout(
            () => {
              this.reconnectIfStale();
              this.poll();
            },
            this.getPollInterval()
          );
        }
        getPollInterval() {
          const { staleThreshold, reconnectionBackoffRate } = this.constructor;
          const backoff = Math.pow(1 + reconnectionBackoffRate, Math.min(this.reconnectAttempts, 10));
          const jitterMax = this.reconnectAttempts === 0 ? 1 : reconnectionBackoffRate;
          const jitter = jitterMax * Math.random();
          return staleThreshold * 1e3 * backoff * (1 + jitter);
        }
        reconnectIfStale() {
          if (this.connectionIsStale()) {
            logger_default.log(`ConnectionMonitor detected stale connection. reconnectAttempts = ${this.reconnectAttempts}, time stale = ${secondsSince(this.refreshedAt)} s, stale threshold = ${this.constructor.staleThreshold} s`);
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              logger_default.log(`ConnectionMonitor skipping reopening recent disconnect. time disconnected = ${secondsSince(this.disconnectedAt)} s`);
            } else {
              logger_default.log("ConnectionMonitor reopening");
              this.connection.reopen();
            }
          }
        }
        get refreshedAt() {
          return this.pingedAt ? this.pingedAt : this.startedAt;
        }
        connectionIsStale() {
          return secondsSince(this.refreshedAt) > this.constructor.staleThreshold;
        }
        disconnectedRecently() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        }
        visibilityDidChange() {
          if (document.visibilityState === "visible") {
            setTimeout(
              () => {
                if (this.connectionIsStale() || !this.connection.isOpen()) {
                  logger_default.log(`ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = ${document.visibilityState}`);
                  this.connection.reopen();
                }
              },
              200
            );
          }
        }
      };
      ConnectionMonitor.staleThreshold = 6;
      ConnectionMonitor.reconnectionBackoffRate = 0.15;
      connection_monitor_default = ConnectionMonitor;
    }
  });

  // node_modules/@rails/actioncable/src/internal.js
  var internal_default;
  var init_internal = __esm({
    "node_modules/@rails/actioncable/src/internal.js"() {
      internal_default = {
        "message_types": {
          "welcome": "welcome",
          "disconnect": "disconnect",
          "ping": "ping",
          "confirmation": "confirm_subscription",
          "rejection": "reject_subscription"
        },
        "disconnect_reasons": {
          "unauthorized": "unauthorized",
          "invalid_request": "invalid_request",
          "server_restart": "server_restart"
        },
        "default_mount_path": "/cable",
        "protocols": [
          "actioncable-v1-json",
          "actioncable-unsupported"
        ]
      };
    }
  });

  // node_modules/@rails/actioncable/src/connection.js
  var message_types, protocols, supportedProtocols, indexOf, Connection, connection_default;
  var init_connection = __esm({
    "node_modules/@rails/actioncable/src/connection.js"() {
      init_adapters();
      init_connection_monitor();
      init_internal();
      init_logger();
      ({ message_types, protocols } = internal_default);
      supportedProtocols = protocols.slice(0, protocols.length - 1);
      indexOf = [].indexOf;
      Connection = class {
        constructor(consumer2) {
          this.open = this.open.bind(this);
          this.consumer = consumer2;
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new connection_monitor_default(this);
          this.disconnected = true;
        }
        send(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        }
        open() {
          if (this.isActive()) {
            logger_default.log(`Attempted to open WebSocket, but existing socket is ${this.getState()}`);
            return false;
          } else {
            logger_default.log(`Opening WebSocket, current state is ${this.getState()}, subprotocols: ${protocols}`);
            if (this.webSocket) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new adapters_default.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        }
        close({ allowReconnect } = { allowReconnect: true }) {
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isOpen()) {
            return this.webSocket.close();
          }
        }
        reopen() {
          logger_default.log(`Reopening WebSocket, current state is ${this.getState()}`);
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error2) {
              logger_default.log("Failed to reopen WebSocket", error2);
            } finally {
              logger_default.log(`Reopening WebSocket in ${this.constructor.reopenDelay}ms`);
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        }
        getProtocol() {
          if (this.webSocket) {
            return this.webSocket.protocol;
          }
        }
        isOpen() {
          return this.isState("open");
        }
        isActive() {
          return this.isState("open", "connecting");
        }
        // Private
        isProtocolSupported() {
          return indexOf.call(supportedProtocols, this.getProtocol()) >= 0;
        }
        isState(...states) {
          return indexOf.call(states, this.getState()) >= 0;
        }
        getState() {
          if (this.webSocket) {
            for (let state in adapters_default.WebSocket) {
              if (adapters_default.WebSocket[state] === this.webSocket.readyState) {
                return state.toLowerCase();
              }
            }
          }
          return null;
        }
        installEventHandlers() {
          for (let eventName in this.events) {
            const handler = this.events[eventName].bind(this);
            this.webSocket[`on${eventName}`] = handler;
          }
        }
        uninstallEventHandlers() {
          for (let eventName in this.events) {
            this.webSocket[`on${eventName}`] = function() {
            };
          }
        }
      };
      Connection.reopenDelay = 500;
      Connection.prototype.events = {
        message(event) {
          if (!this.isProtocolSupported()) {
            return;
          }
          const { identifier, message, reason, reconnect, type } = JSON.parse(event.data);
          switch (type) {
            case message_types.welcome:
              this.monitor.recordConnect();
              return this.subscriptions.reload();
            case message_types.disconnect:
              logger_default.log(`Disconnecting. Reason: ${reason}`);
              return this.close({ allowReconnect: reconnect });
            case message_types.ping:
              return this.monitor.recordPing();
            case message_types.confirmation:
              this.subscriptions.confirmSubscription(identifier);
              return this.subscriptions.notify(identifier, "connected");
            case message_types.rejection:
              return this.subscriptions.reject(identifier);
            default:
              return this.subscriptions.notify(identifier, "received", message);
          }
        },
        open() {
          logger_default.log(`WebSocket onopen event, using '${this.getProtocol()}' subprotocol`);
          this.disconnected = false;
          if (!this.isProtocolSupported()) {
            logger_default.log("Protocol is unsupported. Stopping monitor and disconnecting.");
            return this.close({ allowReconnect: false });
          }
        },
        close(event) {
          logger_default.log("WebSocket onclose event");
          if (this.disconnected) {
            return;
          }
          this.disconnected = true;
          this.monitor.recordDisconnect();
          return this.subscriptions.notifyAll("disconnected", { willAttemptReconnect: this.monitor.isRunning() });
        },
        error() {
          logger_default.log("WebSocket onerror event");
        }
      };
      connection_default = Connection;
    }
  });

  // node_modules/@rails/actioncable/src/subscription.js
  var extend, Subscription;
  var init_subscription = __esm({
    "node_modules/@rails/actioncable/src/subscription.js"() {
      extend = function(object, properties) {
        if (properties != null) {
          for (let key in properties) {
            const value = properties[key];
            object[key] = value;
          }
        }
        return object;
      };
      Subscription = class {
        constructor(consumer2, params = {}, mixin) {
          this.consumer = consumer2;
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }
        // Perform a channel action with the optional data passed as an attribute
        perform(action, data = {}) {
          data.action = action;
          return this.send(data);
        }
        send(data) {
          return this.consumer.send({ command: "message", identifier: this.identifier, data: JSON.stringify(data) });
        }
        unsubscribe() {
          return this.consumer.subscriptions.remove(this);
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/subscription_guarantor.js
  var SubscriptionGuarantor, subscription_guarantor_default;
  var init_subscription_guarantor = __esm({
    "node_modules/@rails/actioncable/src/subscription_guarantor.js"() {
      init_logger();
      SubscriptionGuarantor = class {
        constructor(subscriptions) {
          this.subscriptions = subscriptions;
          this.pendingSubscriptions = [];
        }
        guarantee(subscription) {
          if (this.pendingSubscriptions.indexOf(subscription) == -1) {
            logger_default.log(`SubscriptionGuarantor guaranteeing ${subscription.identifier}`);
            this.pendingSubscriptions.push(subscription);
          } else {
            logger_default.log(`SubscriptionGuarantor already guaranteeing ${subscription.identifier}`);
          }
          this.startGuaranteeing();
        }
        forget(subscription) {
          logger_default.log(`SubscriptionGuarantor forgetting ${subscription.identifier}`);
          this.pendingSubscriptions = this.pendingSubscriptions.filter((s) => s !== subscription);
        }
        startGuaranteeing() {
          this.stopGuaranteeing();
          this.retrySubscribing();
        }
        stopGuaranteeing() {
          clearTimeout(this.retryTimeout);
        }
        retrySubscribing() {
          this.retryTimeout = setTimeout(
            () => {
              if (this.subscriptions && typeof this.subscriptions.subscribe === "function") {
                this.pendingSubscriptions.map((subscription) => {
                  logger_default.log(`SubscriptionGuarantor resubscribing ${subscription.identifier}`);
                  this.subscriptions.subscribe(subscription);
                });
              }
            },
            500
          );
        }
      };
      subscription_guarantor_default = SubscriptionGuarantor;
    }
  });

  // node_modules/@rails/actioncable/src/subscriptions.js
  var Subscriptions;
  var init_subscriptions = __esm({
    "node_modules/@rails/actioncable/src/subscriptions.js"() {
      init_subscription();
      init_subscription_guarantor();
      init_logger();
      Subscriptions = class {
        constructor(consumer2) {
          this.consumer = consumer2;
          this.guarantor = new subscription_guarantor_default(this);
          this.subscriptions = [];
        }
        create(channelName, mixin) {
          const channel = channelName;
          const params = typeof channel === "object" ? channel : { channel };
          const subscription = new Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        }
        // Private
        add(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.subscribe(subscription);
          return subscription;
        }
        remove(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        }
        reject(identifier) {
          return this.findAll(identifier).map((subscription) => {
            this.forget(subscription);
            this.notify(subscription, "rejected");
            return subscription;
          });
        }
        forget(subscription) {
          this.guarantor.forget(subscription);
          this.subscriptions = this.subscriptions.filter((s) => s !== subscription);
          return subscription;
        }
        findAll(identifier) {
          return this.subscriptions.filter((s) => s.identifier === identifier);
        }
        reload() {
          return this.subscriptions.map((subscription) => this.subscribe(subscription));
        }
        notifyAll(callbackName, ...args) {
          return this.subscriptions.map((subscription) => this.notify(subscription, callbackName, ...args));
        }
        notify(subscription, callbackName, ...args) {
          let subscriptions;
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          return subscriptions.map((subscription2) => typeof subscription2[callbackName] === "function" ? subscription2[callbackName](...args) : void 0);
        }
        subscribe(subscription) {
          if (this.sendCommand(subscription, "subscribe")) {
            this.guarantor.guarantee(subscription);
          }
        }
        confirmSubscription(identifier) {
          logger_default.log(`Subscription confirmed ${identifier}`);
          this.findAll(identifier).map((subscription) => this.guarantor.forget(subscription));
        }
        sendCommand(subscription, command) {
          const { identifier } = subscription;
          return this.consumer.send({ command, identifier });
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/consumer.js
  function createWebSocketURL(url) {
    if (typeof url === "function") {
      url = url();
    }
    if (url && !/^wss?:/i.test(url)) {
      const a = document.createElement("a");
      a.href = url;
      a.href = a.href;
      a.protocol = a.protocol.replace("http", "ws");
      return a.href;
    } else {
      return url;
    }
  }
  var Consumer;
  var init_consumer = __esm({
    "node_modules/@rails/actioncable/src/consumer.js"() {
      init_connection();
      init_subscriptions();
      Consumer = class {
        constructor(url) {
          this._url = url;
          this.subscriptions = new Subscriptions(this);
          this.connection = new connection_default(this);
        }
        get url() {
          return createWebSocketURL(this._url);
        }
        send(data) {
          return this.connection.send(data);
        }
        connect() {
          return this.connection.open();
        }
        disconnect() {
          return this.connection.close({ allowReconnect: false });
        }
        ensureActiveConnection() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/index.js
  var src_exports = {};
  __export(src_exports, {
    Connection: () => connection_default,
    ConnectionMonitor: () => connection_monitor_default,
    Consumer: () => Consumer,
    INTERNAL: () => internal_default,
    Subscription: () => Subscription,
    SubscriptionGuarantor: () => subscription_guarantor_default,
    Subscriptions: () => Subscriptions,
    adapters: () => adapters_default,
    createConsumer: () => createConsumer,
    createWebSocketURL: () => createWebSocketURL,
    getConfig: () => getConfig,
    logger: () => logger_default
  });
  function createConsumer(url = getConfig("url") || internal_default.default_mount_path) {
    return new Consumer(url);
  }
  function getConfig(name) {
    const element = document.head.querySelector(`meta[name='action-cable-${name}']`);
    if (element) {
      return element.getAttribute("content");
    }
  }
  var init_src = __esm({
    "node_modules/@rails/actioncable/src/index.js"() {
      init_connection();
      init_connection_monitor();
      init_consumer();
      init_internal();
      init_subscription();
      init_subscriptions();
      init_subscription_guarantor();
      init_adapters();
      init_logger();
    }
  });

  // node_modules/jquery/dist/jquery.js
  var require_jquery = __commonJS({
    "node_modules/jquery/dist/jquery.js"(exports, module) {
      (function(global, factory) {
        "use strict";
        if (typeof module === "object" && typeof module.exports === "object") {
          module.exports = global.document ? factory(global, true) : function(w) {
            if (!w.document) {
              throw new Error("jQuery requires a window with a document");
            }
            return factory(w);
          };
        } else {
          factory(global);
        }
      })(typeof window !== "undefined" ? window : exports, function(window2, noGlobal) {
        "use strict";
        var arr = [];
        var getProto = Object.getPrototypeOf;
        var slice = arr.slice;
        var flat = arr.flat ? function(array) {
          return arr.flat.call(array);
        } : function(array) {
          return arr.concat.apply([], array);
        };
        var push = arr.push;
        var indexOf2 = arr.indexOf;
        var class2type = {};
        var toString = class2type.toString;
        var hasOwn = class2type.hasOwnProperty;
        var fnToString = hasOwn.toString;
        var ObjectFunctionString = fnToString.call(Object);
        var support = {};
        var isFunction = function isFunction2(obj) {
          return typeof obj === "function" && typeof obj.nodeType !== "number" && typeof obj.item !== "function";
        };
        var isWindow = function isWindow2(obj) {
          return obj != null && obj === obj.window;
        };
        var document2 = window2.document;
        var preservedScriptAttributes = {
          type: true,
          src: true,
          nonce: true,
          noModule: true
        };
        function DOMEval(code, node, doc) {
          doc = doc || document2;
          var i, val, script = doc.createElement("script");
          script.text = code;
          if (node) {
            for (i in preservedScriptAttributes) {
              val = node[i] || node.getAttribute && node.getAttribute(i);
              if (val) {
                script.setAttribute(i, val);
              }
            }
          }
          doc.head.appendChild(script).parentNode.removeChild(script);
        }
        function toType(obj) {
          if (obj == null) {
            return obj + "";
          }
          return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
        }
        var version = "3.7.1", rhtmlSuffix = /HTML$/i, jQuery = function(selector, context) {
          return new jQuery.fn.init(selector, context);
        };
        jQuery.fn = jQuery.prototype = {
          // The current version of jQuery being used
          jquery: version,
          constructor: jQuery,
          // The default length of a jQuery object is 0
          length: 0,
          toArray: function() {
            return slice.call(this);
          },
          // Get the Nth element in the matched element set OR
          // Get the whole matched element set as a clean array
          get: function(num) {
            if (num == null) {
              return slice.call(this);
            }
            return num < 0 ? this[num + this.length] : this[num];
          },
          // Take an array of elements and push it onto the stack
          // (returning the new matched element set)
          pushStack: function(elems) {
            var ret = jQuery.merge(this.constructor(), elems);
            ret.prevObject = this;
            return ret;
          },
          // Execute a callback for every element in the matched set.
          each: function(callback) {
            return jQuery.each(this, callback);
          },
          map: function(callback) {
            return this.pushStack(jQuery.map(this, function(elem, i) {
              return callback.call(elem, i, elem);
            }));
          },
          slice: function() {
            return this.pushStack(slice.apply(this, arguments));
          },
          first: function() {
            return this.eq(0);
          },
          last: function() {
            return this.eq(-1);
          },
          even: function() {
            return this.pushStack(jQuery.grep(this, function(_elem, i) {
              return (i + 1) % 2;
            }));
          },
          odd: function() {
            return this.pushStack(jQuery.grep(this, function(_elem, i) {
              return i % 2;
            }));
          },
          eq: function(i) {
            var len = this.length, j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
          },
          end: function() {
            return this.prevObject || this.constructor();
          },
          // For internal use only.
          // Behaves like an Array's method, not like a jQuery method.
          push,
          sort: arr.sort,
          splice: arr.splice
        };
        jQuery.extend = jQuery.fn.extend = function() {
          var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
          if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
          }
          if (typeof target !== "object" && !isFunction(target)) {
            target = {};
          }
          if (i === length) {
            target = this;
            i--;
          }
          for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
              for (name in options) {
                copy = options[name];
                if (name === "__proto__" || target === copy) {
                  continue;
                }
                if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                  src = target[name];
                  if (copyIsArray && !Array.isArray(src)) {
                    clone = [];
                  } else if (!copyIsArray && !jQuery.isPlainObject(src)) {
                    clone = {};
                  } else {
                    clone = src;
                  }
                  copyIsArray = false;
                  target[name] = jQuery.extend(deep, clone, copy);
                } else if (copy !== void 0) {
                  target[name] = copy;
                }
              }
            }
          }
          return target;
        };
        jQuery.extend({
          // Unique for each copy of jQuery on the page
          expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
          // Assume jQuery is ready without the ready module
          isReady: true,
          error: function(msg) {
            throw new Error(msg);
          },
          noop: function() {
          },
          isPlainObject: function(obj) {
            var proto, Ctor;
            if (!obj || toString.call(obj) !== "[object Object]") {
              return false;
            }
            proto = getProto(obj);
            if (!proto) {
              return true;
            }
            Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
            return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
          },
          isEmptyObject: function(obj) {
            var name;
            for (name in obj) {
              return false;
            }
            return true;
          },
          // Evaluates a script in a provided context; falls back to the global one
          // if not specified.
          globalEval: function(code, options, doc) {
            DOMEval(code, { nonce: options && options.nonce }, doc);
          },
          each: function(obj, callback) {
            var length, i = 0;
            if (isArrayLike(obj)) {
              length = obj.length;
              for (; i < length; i++) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                  break;
                }
              }
            } else {
              for (i in obj) {
                if (callback.call(obj[i], i, obj[i]) === false) {
                  break;
                }
              }
            }
            return obj;
          },
          // Retrieve the text value of an array of DOM nodes
          text: function(elem) {
            var node, ret = "", i = 0, nodeType = elem.nodeType;
            if (!nodeType) {
              while (node = elem[i++]) {
                ret += jQuery.text(node);
              }
            }
            if (nodeType === 1 || nodeType === 11) {
              return elem.textContent;
            }
            if (nodeType === 9) {
              return elem.documentElement.textContent;
            }
            if (nodeType === 3 || nodeType === 4) {
              return elem.nodeValue;
            }
            return ret;
          },
          // results is for internal usage only
          makeArray: function(arr2, results) {
            var ret = results || [];
            if (arr2 != null) {
              if (isArrayLike(Object(arr2))) {
                jQuery.merge(
                  ret,
                  typeof arr2 === "string" ? [arr2] : arr2
                );
              } else {
                push.call(ret, arr2);
              }
            }
            return ret;
          },
          inArray: function(elem, arr2, i) {
            return arr2 == null ? -1 : indexOf2.call(arr2, elem, i);
          },
          isXMLDoc: function(elem) {
            var namespace = elem && elem.namespaceURI, docElem = elem && (elem.ownerDocument || elem).documentElement;
            return !rhtmlSuffix.test(namespace || docElem && docElem.nodeName || "HTML");
          },
          // Support: Android <=4.0 only, PhantomJS 1 only
          // push.apply(_, arraylike) throws on ancient WebKit
          merge: function(first, second) {
            var len = +second.length, j = 0, i = first.length;
            for (; j < len; j++) {
              first[i++] = second[j];
            }
            first.length = i;
            return first;
          },
          grep: function(elems, callback, invert) {
            var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert;
            for (; i < length; i++) {
              callbackInverse = !callback(elems[i], i);
              if (callbackInverse !== callbackExpect) {
                matches.push(elems[i]);
              }
            }
            return matches;
          },
          // arg is for internal usage only
          map: function(elems, callback, arg) {
            var length, value, i = 0, ret = [];
            if (isArrayLike(elems)) {
              length = elems.length;
              for (; i < length; i++) {
                value = callback(elems[i], i, arg);
                if (value != null) {
                  ret.push(value);
                }
              }
            } else {
              for (i in elems) {
                value = callback(elems[i], i, arg);
                if (value != null) {
                  ret.push(value);
                }
              }
            }
            return flat(ret);
          },
          // A global GUID counter for objects
          guid: 1,
          // jQuery.support is not used in Core but other projects attach their
          // properties to it so it needs to exist.
          support
        });
        if (typeof Symbol === "function") {
          jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
        }
        jQuery.each(
          "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
          function(_i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
          }
        );
        function isArrayLike(obj) {
          var length = !!obj && "length" in obj && obj.length, type = toType(obj);
          if (isFunction(obj) || isWindow(obj)) {
            return false;
          }
          return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
        }
        function nodeName(elem, name) {
          return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        }
        var pop = arr.pop;
        var sort = arr.sort;
        var splice = arr.splice;
        var whitespace = "[\\x20\\t\\r\\n\\f]";
        var rtrimCSS = new RegExp(
          "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
          "g"
        );
        jQuery.contains = function(a, b) {
          var bup = b && b.parentNode;
          return a === bup || !!(bup && bup.nodeType === 1 && // Support: IE 9 - 11+
          // IE doesn't have `contains` on SVG.
          (a.contains ? a.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
        };
        var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
        function fcssescape(ch, asCodePoint) {
          if (asCodePoint) {
            if (ch === "\0") {
              return "\uFFFD";
            }
            return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
          }
          return "\\" + ch;
        }
        jQuery.escapeSelector = function(sel) {
          return (sel + "").replace(rcssescape, fcssescape);
        };
        var preferredDoc = document2, pushNative = push;
        (function() {
          var i, Expr, outermostContext, sortInput, hasDuplicate, push2 = pushNative, document3, documentElement2, documentIsHTML, rbuggyQSA, matches, expando = jQuery.expando, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), nonnativeSelectorCache = createCache(), sortOrder = function(a, b) {
            if (a === b) {
              hasDuplicate = true;
            }
            return 0;
          }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace + // Operator (capture 2)
          "*([*^$|!~]?=)" + whitespace + // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
          `*(?:'((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)"|(` + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + identifier + `)(?:\\((('((?:\\\\.|[^\\\\'])*)'|"((?:\\\\.|[^\\\\"])*)")|((?:\\\\.|[^\\\\()[\\]]|` + attributes + ")*)|.*)\\)|)", rwhitespace = new RegExp(whitespace + "+", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rleadingCombinator = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rdescend = new RegExp(whitespace + "|>"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
            ID: new RegExp("^#(" + identifier + ")"),
            CLASS: new RegExp("^\\.(" + identifier + ")"),
            TAG: new RegExp("^(" + identifier + "|[*])"),
            ATTR: new RegExp("^" + attributes),
            PSEUDO: new RegExp("^" + pseudos),
            CHILD: new RegExp(
              "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)",
              "i"
            ),
            bool: new RegExp("^(?:" + booleans + ")$", "i"),
            // For use in libraries implementing .is()
            // We use this for POS matching in `select`
            needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
          }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rquickExpr2 = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, runescape = new RegExp("\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g"), funescape = function(escape, nonHex) {
            var high = "0x" + escape.slice(1) - 65536;
            if (nonHex) {
              return nonHex;
            }
            return high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
          }, unloadHandler = function() {
            setDocument();
          }, inDisabledFieldset = addCombinator(
            function(elem) {
              return elem.disabled === true && nodeName(elem, "fieldset");
            },
            { dir: "parentNode", next: "legend" }
          );
          function safeActiveElement() {
            try {
              return document3.activeElement;
            } catch (err) {
            }
          }
          try {
            push2.apply(
              arr = slice.call(preferredDoc.childNodes),
              preferredDoc.childNodes
            );
            arr[preferredDoc.childNodes.length].nodeType;
          } catch (e) {
            push2 = {
              apply: function(target, els) {
                pushNative.apply(target, slice.call(els));
              },
              call: function(target) {
                pushNative.apply(target, slice.call(arguments, 1));
              }
            };
          }
          function find(selector, context, results, seed) {
            var m, i2, elem, nid, match, groups, newSelector, newContext = context && context.ownerDocument, nodeType = context ? context.nodeType : 9;
            results = results || [];
            if (typeof selector !== "string" || !selector || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
              return results;
            }
            if (!seed) {
              setDocument(context);
              context = context || document3;
              if (documentIsHTML) {
                if (nodeType !== 11 && (match = rquickExpr2.exec(selector))) {
                  if (m = match[1]) {
                    if (nodeType === 9) {
                      if (elem = context.getElementById(m)) {
                        if (elem.id === m) {
                          push2.call(results, elem);
                          return results;
                        }
                      } else {
                        return results;
                      }
                    } else {
                      if (newContext && (elem = newContext.getElementById(m)) && find.contains(context, elem) && elem.id === m) {
                        push2.call(results, elem);
                        return results;
                      }
                    }
                  } else if (match[2]) {
                    push2.apply(results, context.getElementsByTagName(selector));
                    return results;
                  } else if ((m = match[3]) && context.getElementsByClassName) {
                    push2.apply(results, context.getElementsByClassName(m));
                    return results;
                  }
                }
                if (!nonnativeSelectorCache[selector + " "] && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                  newSelector = selector;
                  newContext = context;
                  if (nodeType === 1 && (rdescend.test(selector) || rleadingCombinator.test(selector))) {
                    newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                    if (newContext != context || !support.scope) {
                      if (nid = context.getAttribute("id")) {
                        nid = jQuery.escapeSelector(nid);
                      } else {
                        context.setAttribute("id", nid = expando);
                      }
                    }
                    groups = tokenize2(selector);
                    i2 = groups.length;
                    while (i2--) {
                      groups[i2] = (nid ? "#" + nid : ":scope") + " " + toSelector(groups[i2]);
                    }
                    newSelector = groups.join(",");
                  }
                  try {
                    push2.apply(
                      results,
                      newContext.querySelectorAll(newSelector)
                    );
                    return results;
                  } catch (qsaError) {
                    nonnativeSelectorCache(selector, true);
                  } finally {
                    if (nid === expando) {
                      context.removeAttribute("id");
                    }
                  }
                }
              }
            }
            return select(selector.replace(rtrimCSS, "$1"), context, results, seed);
          }
          function createCache() {
            var keys = [];
            function cache2(key, value) {
              if (keys.push(key + " ") > Expr.cacheLength) {
                delete cache2[keys.shift()];
              }
              return cache2[key + " "] = value;
            }
            return cache2;
          }
          function markFunction(fn2) {
            fn2[expando] = true;
            return fn2;
          }
          function assert(fn2) {
            var el = document3.createElement("fieldset");
            try {
              return !!fn2(el);
            } catch (e) {
              return false;
            } finally {
              if (el.parentNode) {
                el.parentNode.removeChild(el);
              }
              el = null;
            }
          }
          function createInputPseudo(type) {
            return function(elem) {
              return nodeName(elem, "input") && elem.type === type;
            };
          }
          function createButtonPseudo(type) {
            return function(elem) {
              return (nodeName(elem, "input") || nodeName(elem, "button")) && elem.type === type;
            };
          }
          function createDisabledPseudo(disabled) {
            return function(elem) {
              if ("form" in elem) {
                if (elem.parentNode && elem.disabled === false) {
                  if ("label" in elem) {
                    if ("label" in elem.parentNode) {
                      return elem.parentNode.disabled === disabled;
                    } else {
                      return elem.disabled === disabled;
                    }
                  }
                  return elem.isDisabled === disabled || // Where there is no isDisabled, check manually
                  elem.isDisabled !== !disabled && inDisabledFieldset(elem) === disabled;
                }
                return elem.disabled === disabled;
              } else if ("label" in elem) {
                return elem.disabled === disabled;
              }
              return false;
            };
          }
          function createPositionalPseudo(fn2) {
            return markFunction(function(argument) {
              argument = +argument;
              return markFunction(function(seed, matches2) {
                var j, matchIndexes = fn2([], seed.length, argument), i2 = matchIndexes.length;
                while (i2--) {
                  if (seed[j = matchIndexes[i2]]) {
                    seed[j] = !(matches2[j] = seed[j]);
                  }
                }
              });
            });
          }
          function testContext(context) {
            return context && typeof context.getElementsByTagName !== "undefined" && context;
          }
          function setDocument(node) {
            var subWindow, doc = node ? node.ownerDocument || node : preferredDoc;
            if (doc == document3 || doc.nodeType !== 9 || !doc.documentElement) {
              return document3;
            }
            document3 = doc;
            documentElement2 = document3.documentElement;
            documentIsHTML = !jQuery.isXMLDoc(document3);
            matches = documentElement2.matches || documentElement2.webkitMatchesSelector || documentElement2.msMatchesSelector;
            if (documentElement2.msMatchesSelector && // Support: IE 11+, Edge 17 - 18+
            // IE/Edge sometimes throw a "Permission denied" error when strict-comparing
            // two documents; shallow comparisons work.
            // eslint-disable-next-line eqeqeq
            preferredDoc != document3 && (subWindow = document3.defaultView) && subWindow.top !== subWindow) {
              subWindow.addEventListener("unload", unloadHandler);
            }
            support.getById = assert(function(el) {
              documentElement2.appendChild(el).id = jQuery.expando;
              return !document3.getElementsByName || !document3.getElementsByName(jQuery.expando).length;
            });
            support.disconnectedMatch = assert(function(el) {
              return matches.call(el, "*");
            });
            support.scope = assert(function() {
              return document3.querySelectorAll(":scope");
            });
            support.cssHas = assert(function() {
              try {
                document3.querySelector(":has(*,:jqfake)");
                return false;
              } catch (e) {
                return true;
              }
            });
            if (support.getById) {
              Expr.filter.ID = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                  return elem.getAttribute("id") === attrId;
                };
              };
              Expr.find.ID = function(id, context) {
                if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                  var elem = context.getElementById(id);
                  return elem ? [elem] : [];
                }
              };
            } else {
              Expr.filter.ID = function(id) {
                var attrId = id.replace(runescape, funescape);
                return function(elem) {
                  var node2 = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
                  return node2 && node2.value === attrId;
                };
              };
              Expr.find.ID = function(id, context) {
                if (typeof context.getElementById !== "undefined" && documentIsHTML) {
                  var node2, i2, elems, elem = context.getElementById(id);
                  if (elem) {
                    node2 = elem.getAttributeNode("id");
                    if (node2 && node2.value === id) {
                      return [elem];
                    }
                    elems = context.getElementsByName(id);
                    i2 = 0;
                    while (elem = elems[i2++]) {
                      node2 = elem.getAttributeNode("id");
                      if (node2 && node2.value === id) {
                        return [elem];
                      }
                    }
                  }
                  return [];
                }
              };
            }
            Expr.find.TAG = function(tag, context) {
              if (typeof context.getElementsByTagName !== "undefined") {
                return context.getElementsByTagName(tag);
              } else {
                return context.querySelectorAll(tag);
              }
            };
            Expr.find.CLASS = function(className, context) {
              if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
                return context.getElementsByClassName(className);
              }
            };
            rbuggyQSA = [];
            assert(function(el) {
              var input;
              documentElement2.appendChild(el).innerHTML = "<a id='" + expando + "' href='' disabled='disabled'></a><select id='" + expando + "-\r\\' disabled='disabled'><option selected=''></option></select>";
              if (!el.querySelectorAll("[selected]").length) {
                rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
              }
              if (!el.querySelectorAll("[id~=" + expando + "-]").length) {
                rbuggyQSA.push("~=");
              }
              if (!el.querySelectorAll("a#" + expando + "+*").length) {
                rbuggyQSA.push(".#.+[+~]");
              }
              if (!el.querySelectorAll(":checked").length) {
                rbuggyQSA.push(":checked");
              }
              input = document3.createElement("input");
              input.setAttribute("type", "hidden");
              el.appendChild(input).setAttribute("name", "D");
              documentElement2.appendChild(el).disabled = true;
              if (el.querySelectorAll(":disabled").length !== 2) {
                rbuggyQSA.push(":enabled", ":disabled");
              }
              input = document3.createElement("input");
              input.setAttribute("name", "");
              el.appendChild(input);
              if (!el.querySelectorAll("[name='']").length) {
                rbuggyQSA.push("\\[" + whitespace + "*name" + whitespace + "*=" + whitespace + `*(?:''|"")`);
              }
            });
            if (!support.cssHas) {
              rbuggyQSA.push(":has");
            }
            rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
            sortOrder = function(a, b) {
              if (a === b) {
                hasDuplicate = true;
                return 0;
              }
              var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
              if (compare) {
                return compare;
              }
              compare = (a.ownerDocument || a) == (b.ownerDocument || b) ? a.compareDocumentPosition(b) : (
                // Otherwise we know they are disconnected
                1
              );
              if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {
                if (a === document3 || a.ownerDocument == preferredDoc && find.contains(preferredDoc, a)) {
                  return -1;
                }
                if (b === document3 || b.ownerDocument == preferredDoc && find.contains(preferredDoc, b)) {
                  return 1;
                }
                return sortInput ? indexOf2.call(sortInput, a) - indexOf2.call(sortInput, b) : 0;
              }
              return compare & 4 ? -1 : 1;
            };
            return document3;
          }
          find.matches = function(expr, elements) {
            return find(expr, null, null, elements);
          };
          find.matchesSelector = function(elem, expr) {
            setDocument(elem);
            if (documentIsHTML && !nonnativeSelectorCache[expr + " "] && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
              try {
                var ret = matches.call(elem, expr);
                if (ret || support.disconnectedMatch || // As well, disconnected nodes are said to be in a document
                // fragment in IE 9
                elem.document && elem.document.nodeType !== 11) {
                  return ret;
                }
              } catch (e) {
                nonnativeSelectorCache(expr, true);
              }
            }
            return find(expr, document3, null, [elem]).length > 0;
          };
          find.contains = function(context, elem) {
            if ((context.ownerDocument || context) != document3) {
              setDocument(context);
            }
            return jQuery.contains(context, elem);
          };
          find.attr = function(elem, name) {
            if ((elem.ownerDocument || elem) != document3) {
              setDocument(elem);
            }
            var fn2 = Expr.attrHandle[name.toLowerCase()], val = fn2 && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn2(elem, name, !documentIsHTML) : void 0;
            if (val !== void 0) {
              return val;
            }
            return elem.getAttribute(name);
          };
          find.error = function(msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
          };
          jQuery.uniqueSort = function(results) {
            var elem, duplicates = [], j = 0, i2 = 0;
            hasDuplicate = !support.sortStable;
            sortInput = !support.sortStable && slice.call(results, 0);
            sort.call(results, sortOrder);
            if (hasDuplicate) {
              while (elem = results[i2++]) {
                if (elem === results[i2]) {
                  j = duplicates.push(i2);
                }
              }
              while (j--) {
                splice.call(results, duplicates[j], 1);
              }
            }
            sortInput = null;
            return results;
          };
          jQuery.fn.uniqueSort = function() {
            return this.pushStack(jQuery.uniqueSort(slice.apply(this)));
          };
          Expr = jQuery.expr = {
            // Can be adjusted by the user
            cacheLength: 50,
            createPseudo: markFunction,
            match: matchExpr,
            attrHandle: {},
            find: {},
            relative: {
              ">": { dir: "parentNode", first: true },
              " ": { dir: "parentNode" },
              "+": { dir: "previousSibling", first: true },
              "~": { dir: "previousSibling" }
            },
            preFilter: {
              ATTR: function(match) {
                match[1] = match[1].replace(runescape, funescape);
                match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);
                if (match[2] === "~=") {
                  match[3] = " " + match[3] + " ";
                }
                return match.slice(0, 4);
              },
              CHILD: function(match) {
                match[1] = match[1].toLowerCase();
                if (match[1].slice(0, 3) === "nth") {
                  if (!match[3]) {
                    find.error(match[0]);
                  }
                  match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                  match[5] = +(match[7] + match[8] || match[3] === "odd");
                } else if (match[3]) {
                  find.error(match[0]);
                }
                return match;
              },
              PSEUDO: function(match) {
                var excess, unquoted = !match[6] && match[2];
                if (matchExpr.CHILD.test(match[0])) {
                  return null;
                }
                if (match[3]) {
                  match[2] = match[4] || match[5] || "";
                } else if (unquoted && rpseudo.test(unquoted) && // Get excess from tokenize (recursively)
                (excess = tokenize2(unquoted, true)) && // advance to the next closing parenthesis
                (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                  match[0] = match[0].slice(0, excess);
                  match[2] = unquoted.slice(0, excess);
                }
                return match.slice(0, 3);
              }
            },
            filter: {
              TAG: function(nodeNameSelector) {
                var expectedNodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                return nodeNameSelector === "*" ? function() {
                  return true;
                } : function(elem) {
                  return nodeName(elem, expectedNodeName);
                };
              },
              CLASS: function(className) {
                var pattern = classCache[className + " "];
                return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                  return pattern.test(
                    typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || ""
                  );
                });
              },
              ATTR: function(name, operator, check) {
                return function(elem) {
                  var result = find.attr(elem, name);
                  if (result == null) {
                    return operator === "!=";
                  }
                  if (!operator) {
                    return true;
                  }
                  result += "";
                  if (operator === "=") {
                    return result === check;
                  }
                  if (operator === "!=") {
                    return result !== check;
                  }
                  if (operator === "^=") {
                    return check && result.indexOf(check) === 0;
                  }
                  if (operator === "*=") {
                    return check && result.indexOf(check) > -1;
                  }
                  if (operator === "$=") {
                    return check && result.slice(-check.length) === check;
                  }
                  if (operator === "~=") {
                    return (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1;
                  }
                  if (operator === "|=") {
                    return result === check || result.slice(0, check.length + 1) === check + "-";
                  }
                  return false;
                };
              },
              CHILD: function(type, what, _argument, first, last) {
                var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last", ofType = what === "of-type";
                return first === 1 && last === 0 ? (
                  // Shortcut for :nth-*(n)
                  function(elem) {
                    return !!elem.parentNode;
                  }
                ) : function(elem, _context, xml) {
                  var cache2, outerCache, node, nodeIndex, start3, dir2 = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType, diff = false;
                  if (parent) {
                    if (simple) {
                      while (dir2) {
                        node = elem;
                        while (node = node[dir2]) {
                          if (ofType ? nodeName(node, name) : node.nodeType === 1) {
                            return false;
                          }
                        }
                        start3 = dir2 = type === "only" && !start3 && "nextSibling";
                      }
                      return true;
                    }
                    start3 = [forward ? parent.firstChild : parent.lastChild];
                    if (forward && useCache) {
                      outerCache = parent[expando] || (parent[expando] = {});
                      cache2 = outerCache[type] || [];
                      nodeIndex = cache2[0] === dirruns && cache2[1];
                      diff = nodeIndex && cache2[2];
                      node = nodeIndex && parent.childNodes[nodeIndex];
                      while (node = ++nodeIndex && node && node[dir2] || // Fallback to seeking `elem` from the start
                      (diff = nodeIndex = 0) || start3.pop()) {
                        if (node.nodeType === 1 && ++diff && node === elem) {
                          outerCache[type] = [dirruns, nodeIndex, diff];
                          break;
                        }
                      }
                    } else {
                      if (useCache) {
                        outerCache = elem[expando] || (elem[expando] = {});
                        cache2 = outerCache[type] || [];
                        nodeIndex = cache2[0] === dirruns && cache2[1];
                        diff = nodeIndex;
                      }
                      if (diff === false) {
                        while (node = ++nodeIndex && node && node[dir2] || (diff = nodeIndex = 0) || start3.pop()) {
                          if ((ofType ? nodeName(node, name) : node.nodeType === 1) && ++diff) {
                            if (useCache) {
                              outerCache = node[expando] || (node[expando] = {});
                              outerCache[type] = [dirruns, diff];
                            }
                            if (node === elem) {
                              break;
                            }
                          }
                        }
                      }
                    }
                    diff -= last;
                    return diff === first || diff % first === 0 && diff / first >= 0;
                  }
                };
              },
              PSEUDO: function(pseudo, argument) {
                var args, fn2 = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || find.error("unsupported pseudo: " + pseudo);
                if (fn2[expando]) {
                  return fn2(argument);
                }
                if (fn2.length > 1) {
                  args = [pseudo, pseudo, "", argument];
                  return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches2) {
                    var idx, matched = fn2(seed, argument), i2 = matched.length;
                    while (i2--) {
                      idx = indexOf2.call(seed, matched[i2]);
                      seed[idx] = !(matches2[idx] = matched[i2]);
                    }
                  }) : function(elem) {
                    return fn2(elem, 0, args);
                  };
                }
                return fn2;
              }
            },
            pseudos: {
              // Potentially complex pseudos
              not: markFunction(function(selector) {
                var input = [], results = [], matcher = compile(selector.replace(rtrimCSS, "$1"));
                return matcher[expando] ? markFunction(function(seed, matches2, _context, xml) {
                  var elem, unmatched = matcher(seed, null, xml, []), i2 = seed.length;
                  while (i2--) {
                    if (elem = unmatched[i2]) {
                      seed[i2] = !(matches2[i2] = elem);
                    }
                  }
                }) : function(elem, _context, xml) {
                  input[0] = elem;
                  matcher(input, null, xml, results);
                  input[0] = null;
                  return !results.pop();
                };
              }),
              has: markFunction(function(selector) {
                return function(elem) {
                  return find(selector, elem).length > 0;
                };
              }),
              contains: markFunction(function(text) {
                text = text.replace(runescape, funescape);
                return function(elem) {
                  return (elem.textContent || jQuery.text(elem)).indexOf(text) > -1;
                };
              }),
              // "Whether an element is represented by a :lang() selector
              // is based solely on the element's language value
              // being equal to the identifier C,
              // or beginning with the identifier C immediately followed by "-".
              // The matching of C against the element's language value is performed case-insensitively.
              // The identifier C does not have to be a valid language name."
              // https://www.w3.org/TR/selectors/#lang-pseudo
              lang: markFunction(function(lang) {
                if (!ridentifier.test(lang || "")) {
                  find.error("unsupported lang: " + lang);
                }
                lang = lang.replace(runescape, funescape).toLowerCase();
                return function(elem) {
                  var elemLang;
                  do {
                    if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                      elemLang = elemLang.toLowerCase();
                      return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                    }
                  } while ((elem = elem.parentNode) && elem.nodeType === 1);
                  return false;
                };
              }),
              // Miscellaneous
              target: function(elem) {
                var hash3 = window2.location && window2.location.hash;
                return hash3 && hash3.slice(1) === elem.id;
              },
              root: function(elem) {
                return elem === documentElement2;
              },
              focus: function(elem) {
                return elem === safeActiveElement() && document3.hasFocus() && !!(elem.type || elem.href || ~elem.tabIndex);
              },
              // Boolean properties
              enabled: createDisabledPseudo(false),
              disabled: createDisabledPseudo(true),
              checked: function(elem) {
                return nodeName(elem, "input") && !!elem.checked || nodeName(elem, "option") && !!elem.selected;
              },
              selected: function(elem) {
                if (elem.parentNode) {
                  elem.parentNode.selectedIndex;
                }
                return elem.selected === true;
              },
              // Contents
              empty: function(elem) {
                for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                  if (elem.nodeType < 6) {
                    return false;
                  }
                }
                return true;
              },
              parent: function(elem) {
                return !Expr.pseudos.empty(elem);
              },
              // Element/input types
              header: function(elem) {
                return rheader.test(elem.nodeName);
              },
              input: function(elem) {
                return rinputs.test(elem.nodeName);
              },
              button: function(elem) {
                return nodeName(elem, "input") && elem.type === "button" || nodeName(elem, "button");
              },
              text: function(elem) {
                var attr;
                return nodeName(elem, "input") && elem.type === "text" && // Support: IE <10 only
                // New HTML5 attribute values (e.g., "search") appear
                // with elem.type === "text"
                ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
              },
              // Position-in-collection
              first: createPositionalPseudo(function() {
                return [0];
              }),
              last: createPositionalPseudo(function(_matchIndexes, length) {
                return [length - 1];
              }),
              eq: createPositionalPseudo(function(_matchIndexes, length, argument) {
                return [argument < 0 ? argument + length : argument];
              }),
              even: createPositionalPseudo(function(matchIndexes, length) {
                var i2 = 0;
                for (; i2 < length; i2 += 2) {
                  matchIndexes.push(i2);
                }
                return matchIndexes;
              }),
              odd: createPositionalPseudo(function(matchIndexes, length) {
                var i2 = 1;
                for (; i2 < length; i2 += 2) {
                  matchIndexes.push(i2);
                }
                return matchIndexes;
              }),
              lt: createPositionalPseudo(function(matchIndexes, length, argument) {
                var i2;
                if (argument < 0) {
                  i2 = argument + length;
                } else if (argument > length) {
                  i2 = length;
                } else {
                  i2 = argument;
                }
                for (; --i2 >= 0; ) {
                  matchIndexes.push(i2);
                }
                return matchIndexes;
              }),
              gt: createPositionalPseudo(function(matchIndexes, length, argument) {
                var i2 = argument < 0 ? argument + length : argument;
                for (; ++i2 < length; ) {
                  matchIndexes.push(i2);
                }
                return matchIndexes;
              })
            }
          };
          Expr.pseudos.nth = Expr.pseudos.eq;
          for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
            Expr.pseudos[i] = createInputPseudo(i);
          }
          for (i in { submit: true, reset: true }) {
            Expr.pseudos[i] = createButtonPseudo(i);
          }
          function setFilters() {
          }
          setFilters.prototype = Expr.filters = Expr.pseudos;
          Expr.setFilters = new setFilters();
          function tokenize2(selector, parseOnly) {
            var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
            if (cached) {
              return parseOnly ? 0 : cached.slice(0);
            }
            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;
            while (soFar) {
              if (!matched || (match = rcomma.exec(soFar))) {
                if (match) {
                  soFar = soFar.slice(match[0].length) || soFar;
                }
                groups.push(tokens = []);
              }
              matched = false;
              if (match = rleadingCombinator.exec(soFar)) {
                matched = match.shift();
                tokens.push({
                  value: matched,
                  // Cast descendant combinators to space
                  type: match[0].replace(rtrimCSS, " ")
                });
                soFar = soFar.slice(matched.length);
              }
              for (type in Expr.filter) {
                if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
                  matched = match.shift();
                  tokens.push({
                    value: matched,
                    type,
                    matches: match
                  });
                  soFar = soFar.slice(matched.length);
                }
              }
              if (!matched) {
                break;
              }
            }
            if (parseOnly) {
              return soFar.length;
            }
            return soFar ? find.error(selector) : (
              // Cache the tokens
              tokenCache(selector, groups).slice(0)
            );
          }
          function toSelector(tokens) {
            var i2 = 0, len = tokens.length, selector = "";
            for (; i2 < len; i2++) {
              selector += tokens[i2].value;
            }
            return selector;
          }
          function addCombinator(matcher, combinator, base) {
            var dir2 = combinator.dir, skip = combinator.next, key = skip || dir2, checkNonElements = base && key === "parentNode", doneName = done++;
            return combinator.first ? (
              // Check against closest ancestor/preceding element
              function(elem, context, xml) {
                while (elem = elem[dir2]) {
                  if (elem.nodeType === 1 || checkNonElements) {
                    return matcher(elem, context, xml);
                  }
                }
                return false;
              }
            ) : (
              // Check against all ancestor/preceding elements
              function(elem, context, xml) {
                var oldCache, outerCache, newCache = [dirruns, doneName];
                if (xml) {
                  while (elem = elem[dir2]) {
                    if (elem.nodeType === 1 || checkNonElements) {
                      if (matcher(elem, context, xml)) {
                        return true;
                      }
                    }
                  }
                } else {
                  while (elem = elem[dir2]) {
                    if (elem.nodeType === 1 || checkNonElements) {
                      outerCache = elem[expando] || (elem[expando] = {});
                      if (skip && nodeName(elem, skip)) {
                        elem = elem[dir2] || elem;
                      } else if ((oldCache = outerCache[key]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                        return newCache[2] = oldCache[2];
                      } else {
                        outerCache[key] = newCache;
                        if (newCache[2] = matcher(elem, context, xml)) {
                          return true;
                        }
                      }
                    }
                  }
                }
                return false;
              }
            );
          }
          function elementMatcher(matchers) {
            return matchers.length > 1 ? function(elem, context, xml) {
              var i2 = matchers.length;
              while (i2--) {
                if (!matchers[i2](elem, context, xml)) {
                  return false;
                }
              }
              return true;
            } : matchers[0];
          }
          function multipleContexts(selector, contexts, results) {
            var i2 = 0, len = contexts.length;
            for (; i2 < len; i2++) {
              find(selector, contexts[i2], results);
            }
            return results;
          }
          function condense(unmatched, map, filter, context, xml) {
            var elem, newUnmatched = [], i2 = 0, len = unmatched.length, mapped = map != null;
            for (; i2 < len; i2++) {
              if (elem = unmatched[i2]) {
                if (!filter || filter(elem, context, xml)) {
                  newUnmatched.push(elem);
                  if (mapped) {
                    map.push(i2);
                  }
                }
              }
            }
            return newUnmatched;
          }
          function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            if (postFilter && !postFilter[expando]) {
              postFilter = setMatcher(postFilter);
            }
            if (postFinder && !postFinder[expando]) {
              postFinder = setMatcher(postFinder, postSelector);
            }
            return markFunction(function(seed, results, context, xml) {
              var temp, i2, elem, matcherOut, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(
                selector || "*",
                context.nodeType ? [context] : context,
                []
              ), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems;
              if (matcher) {
                matcherOut = postFinder || (seed ? preFilter : preexisting || postFilter) ? (
                  // ...intermediate processing is necessary
                  []
                ) : (
                  // ...otherwise use results directly
                  results
                );
                matcher(matcherIn, matcherOut, context, xml);
              } else {
                matcherOut = matcherIn;
              }
              if (postFilter) {
                temp = condense(matcherOut, postMap);
                postFilter(temp, [], context, xml);
                i2 = temp.length;
                while (i2--) {
                  if (elem = temp[i2]) {
                    matcherOut[postMap[i2]] = !(matcherIn[postMap[i2]] = elem);
                  }
                }
              }
              if (seed) {
                if (postFinder || preFilter) {
                  if (postFinder) {
                    temp = [];
                    i2 = matcherOut.length;
                    while (i2--) {
                      if (elem = matcherOut[i2]) {
                        temp.push(matcherIn[i2] = elem);
                      }
                    }
                    postFinder(null, matcherOut = [], temp, xml);
                  }
                  i2 = matcherOut.length;
                  while (i2--) {
                    if ((elem = matcherOut[i2]) && (temp = postFinder ? indexOf2.call(seed, elem) : preMap[i2]) > -1) {
                      seed[temp] = !(results[temp] = elem);
                    }
                  }
                }
              } else {
                matcherOut = condense(
                  matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut
                );
                if (postFinder) {
                  postFinder(null, results, matcherOut, xml);
                } else {
                  push2.apply(results, matcherOut);
                }
              }
            });
          }
          function matcherFromTokens(tokens) {
            var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i2 = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
              return elem === checkContext;
            }, implicitRelative, true), matchAnyContext = addCombinator(function(elem) {
              return indexOf2.call(checkContext, elem) > -1;
            }, implicitRelative, true), matchers = [function(elem, context, xml) {
              var ret = !leadingRelative && (xml || context != outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
              checkContext = null;
              return ret;
            }];
            for (; i2 < len; i2++) {
              if (matcher = Expr.relative[tokens[i2].type]) {
                matchers = [addCombinator(elementMatcher(matchers), matcher)];
              } else {
                matcher = Expr.filter[tokens[i2].type].apply(null, tokens[i2].matches);
                if (matcher[expando]) {
                  j = ++i2;
                  for (; j < len; j++) {
                    if (Expr.relative[tokens[j].type]) {
                      break;
                    }
                  }
                  return setMatcher(
                    i2 > 1 && elementMatcher(matchers),
                    i2 > 1 && toSelector(
                      // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                      tokens.slice(0, i2 - 1).concat({ value: tokens[i2 - 2].type === " " ? "*" : "" })
                    ).replace(rtrimCSS, "$1"),
                    matcher,
                    i2 < j && matcherFromTokens(tokens.slice(i2, j)),
                    j < len && matcherFromTokens(tokens = tokens.slice(j)),
                    j < len && toSelector(tokens)
                  );
                }
                matchers.push(matcher);
              }
            }
            return elementMatcher(matchers);
          }
          function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
              var elem, j, matcher, matchedCount = 0, i2 = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find.TAG("*", outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || 0.1, len = elems.length;
              if (outermost) {
                outermostContext = context == document3 || context || outermost;
              }
              for (; i2 !== len && (elem = elems[i2]) != null; i2++) {
                if (byElement && elem) {
                  j = 0;
                  if (!context && elem.ownerDocument != document3) {
                    setDocument(elem);
                    xml = !documentIsHTML;
                  }
                  while (matcher = elementMatchers[j++]) {
                    if (matcher(elem, context || document3, xml)) {
                      push2.call(results, elem);
                      break;
                    }
                  }
                  if (outermost) {
                    dirruns = dirrunsUnique;
                  }
                }
                if (bySet) {
                  if (elem = !matcher && elem) {
                    matchedCount--;
                  }
                  if (seed) {
                    unmatched.push(elem);
                  }
                }
              }
              matchedCount += i2;
              if (bySet && i2 !== matchedCount) {
                j = 0;
                while (matcher = setMatchers[j++]) {
                  matcher(unmatched, setMatched, context, xml);
                }
                if (seed) {
                  if (matchedCount > 0) {
                    while (i2--) {
                      if (!(unmatched[i2] || setMatched[i2])) {
                        setMatched[i2] = pop.call(results);
                      }
                    }
                  }
                  setMatched = condense(setMatched);
                }
                push2.apply(results, setMatched);
                if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                  jQuery.uniqueSort(results);
                }
              }
              if (outermost) {
                dirruns = dirrunsUnique;
                outermostContext = contextBackup;
              }
              return unmatched;
            };
            return bySet ? markFunction(superMatcher) : superMatcher;
          }
          function compile(selector, match) {
            var i2, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
            if (!cached) {
              if (!match) {
                match = tokenize2(selector);
              }
              i2 = match.length;
              while (i2--) {
                cached = matcherFromTokens(match[i2]);
                if (cached[expando]) {
                  setMatchers.push(cached);
                } else {
                  elementMatchers.push(cached);
                }
              }
              cached = compilerCache(
                selector,
                matcherFromGroupMatchers(elementMatchers, setMatchers)
              );
              cached.selector = selector;
            }
            return cached;
          }
          function select(selector, context, results, seed) {
            var i2, tokens, token, type, find2, compiled = typeof selector === "function" && selector, match = !seed && tokenize2(selector = compiled.selector || selector);
            results = results || [];
            if (match.length === 1) {
              tokens = match[0] = match[0].slice(0);
              if (tokens.length > 2 && (token = tokens[0]).type === "ID" && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
                context = (Expr.find.ID(
                  token.matches[0].replace(runescape, funescape),
                  context
                ) || [])[0];
                if (!context) {
                  return results;
                } else if (compiled) {
                  context = context.parentNode;
                }
                selector = selector.slice(tokens.shift().value.length);
              }
              i2 = matchExpr.needsContext.test(selector) ? 0 : tokens.length;
              while (i2--) {
                token = tokens[i2];
                if (Expr.relative[type = token.type]) {
                  break;
                }
                if (find2 = Expr.find[type]) {
                  if (seed = find2(
                    token.matches[0].replace(runescape, funescape),
                    rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
                  )) {
                    tokens.splice(i2, 1);
                    selector = seed.length && toSelector(tokens);
                    if (!selector) {
                      push2.apply(results, seed);
                      return results;
                    }
                    break;
                  }
                }
              }
            }
            (compiled || compile(selector, match))(
              seed,
              context,
              !documentIsHTML,
              results,
              !context || rsibling.test(selector) && testContext(context.parentNode) || context
            );
            return results;
          }
          support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
          setDocument();
          support.sortDetached = assert(function(el) {
            return el.compareDocumentPosition(document3.createElement("fieldset")) & 1;
          });
          jQuery.find = find;
          jQuery.expr[":"] = jQuery.expr.pseudos;
          jQuery.unique = jQuery.uniqueSort;
          find.compile = compile;
          find.select = select;
          find.setDocument = setDocument;
          find.tokenize = tokenize2;
          find.escape = jQuery.escapeSelector;
          find.getText = jQuery.text;
          find.isXML = jQuery.isXMLDoc;
          find.selectors = jQuery.expr;
          find.support = jQuery.support;
          find.uniqueSort = jQuery.uniqueSort;
        })();
        var dir = function(elem, dir2, until) {
          var matched = [], truncate = until !== void 0;
          while ((elem = elem[dir2]) && elem.nodeType !== 9) {
            if (elem.nodeType === 1) {
              if (truncate && jQuery(elem).is(until)) {
                break;
              }
              matched.push(elem);
            }
          }
          return matched;
        };
        var siblings = function(n, elem) {
          var matched = [];
          for (; n; n = n.nextSibling) {
            if (n.nodeType === 1 && n !== elem) {
              matched.push(n);
            }
          }
          return matched;
        };
        var rneedsContext = jQuery.expr.match.needsContext;
        var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
        function winnow(elements, qualifier, not) {
          if (isFunction(qualifier)) {
            return jQuery.grep(elements, function(elem, i) {
              return !!qualifier.call(elem, i, elem) !== not;
            });
          }
          if (qualifier.nodeType) {
            return jQuery.grep(elements, function(elem) {
              return elem === qualifier !== not;
            });
          }
          if (typeof qualifier !== "string") {
            return jQuery.grep(elements, function(elem) {
              return indexOf2.call(qualifier, elem) > -1 !== not;
            });
          }
          return jQuery.filter(qualifier, elements, not);
        }
        jQuery.filter = function(expr, elems, not) {
          var elem = elems[0];
          if (not) {
            expr = ":not(" + expr + ")";
          }
          if (elems.length === 1 && elem.nodeType === 1) {
            return jQuery.find.matchesSelector(elem, expr) ? [elem] : [];
          }
          return jQuery.find.matches(expr, jQuery.grep(elems, function(elem2) {
            return elem2.nodeType === 1;
          }));
        };
        jQuery.fn.extend({
          find: function(selector) {
            var i, ret, len = this.length, self2 = this;
            if (typeof selector !== "string") {
              return this.pushStack(jQuery(selector).filter(function() {
                for (i = 0; i < len; i++) {
                  if (jQuery.contains(self2[i], this)) {
                    return true;
                  }
                }
              }));
            }
            ret = this.pushStack([]);
            for (i = 0; i < len; i++) {
              jQuery.find(selector, self2[i], ret);
            }
            return len > 1 ? jQuery.uniqueSort(ret) : ret;
          },
          filter: function(selector) {
            return this.pushStack(winnow(this, selector || [], false));
          },
          not: function(selector) {
            return this.pushStack(winnow(this, selector || [], true));
          },
          is: function(selector) {
            return !!winnow(
              this,
              // If this is a positional/relative selector, check membership in the returned set
              // so $("p:first").is("p:last") won't return true for a doc with two "p".
              typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [],
              false
            ).length;
          }
        });
        var rootjQuery, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, init = jQuery.fn.init = function(selector, context, root) {
          var match, elem;
          if (!selector) {
            return this;
          }
          root = root || rootjQuery;
          if (typeof selector === "string") {
            if (selector[0] === "<" && selector[selector.length - 1] === ">" && selector.length >= 3) {
              match = [null, selector, null];
            } else {
              match = rquickExpr.exec(selector);
            }
            if (match && (match[1] || !context)) {
              if (match[1]) {
                context = context instanceof jQuery ? context[0] : context;
                jQuery.merge(this, jQuery.parseHTML(
                  match[1],
                  context && context.nodeType ? context.ownerDocument || context : document2,
                  true
                ));
                if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                  for (match in context) {
                    if (isFunction(this[match])) {
                      this[match](context[match]);
                    } else {
                      this.attr(match, context[match]);
                    }
                  }
                }
                return this;
              } else {
                elem = document2.getElementById(match[2]);
                if (elem) {
                  this[0] = elem;
                  this.length = 1;
                }
                return this;
              }
            } else if (!context || context.jquery) {
              return (context || root).find(selector);
            } else {
              return this.constructor(context).find(selector);
            }
          } else if (selector.nodeType) {
            this[0] = selector;
            this.length = 1;
            return this;
          } else if (isFunction(selector)) {
            return root.ready !== void 0 ? root.ready(selector) : (
              // Execute immediately if ready is not present
              selector(jQuery)
            );
          }
          return jQuery.makeArray(selector, this);
        };
        init.prototype = jQuery.fn;
        rootjQuery = jQuery(document2);
        var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
          children: true,
          contents: true,
          next: true,
          prev: true
        };
        jQuery.fn.extend({
          has: function(target) {
            var targets = jQuery(target, this), l = targets.length;
            return this.filter(function() {
              var i = 0;
              for (; i < l; i++) {
                if (jQuery.contains(this, targets[i])) {
                  return true;
                }
              }
            });
          },
          closest: function(selectors, context) {
            var cur, i = 0, l = this.length, matched = [], targets = typeof selectors !== "string" && jQuery(selectors);
            if (!rneedsContext.test(selectors)) {
              for (; i < l; i++) {
                for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
                  if (cur.nodeType < 11 && (targets ? targets.index(cur) > -1 : (
                    // Don't pass non-elements to jQuery#find
                    cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors)
                  ))) {
                    matched.push(cur);
                    break;
                  }
                }
              }
            }
            return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
          },
          // Determine the position of an element within the set
          index: function(elem) {
            if (!elem) {
              return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
            }
            if (typeof elem === "string") {
              return indexOf2.call(jQuery(elem), this[0]);
            }
            return indexOf2.call(
              this,
              // If it receives a jQuery object, the first element is used
              elem.jquery ? elem[0] : elem
            );
          },
          add: function(selector, context) {
            return this.pushStack(
              jQuery.uniqueSort(
                jQuery.merge(this.get(), jQuery(selector, context))
              )
            );
          },
          addBack: function(selector) {
            return this.add(
              selector == null ? this.prevObject : this.prevObject.filter(selector)
            );
          }
        });
        function sibling(cur, dir2) {
          while ((cur = cur[dir2]) && cur.nodeType !== 1) {
          }
          return cur;
        }
        jQuery.each({
          parent: function(elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
          },
          parents: function(elem) {
            return dir(elem, "parentNode");
          },
          parentsUntil: function(elem, _i, until) {
            return dir(elem, "parentNode", until);
          },
          next: function(elem) {
            return sibling(elem, "nextSibling");
          },
          prev: function(elem) {
            return sibling(elem, "previousSibling");
          },
          nextAll: function(elem) {
            return dir(elem, "nextSibling");
          },
          prevAll: function(elem) {
            return dir(elem, "previousSibling");
          },
          nextUntil: function(elem, _i, until) {
            return dir(elem, "nextSibling", until);
          },
          prevUntil: function(elem, _i, until) {
            return dir(elem, "previousSibling", until);
          },
          siblings: function(elem) {
            return siblings((elem.parentNode || {}).firstChild, elem);
          },
          children: function(elem) {
            return siblings(elem.firstChild);
          },
          contents: function(elem) {
            if (elem.contentDocument != null && // Support: IE 11+
            // <object> elements with no `data` attribute has an object
            // `contentDocument` with a `null` prototype.
            getProto(elem.contentDocument)) {
              return elem.contentDocument;
            }
            if (nodeName(elem, "template")) {
              elem = elem.content || elem;
            }
            return jQuery.merge([], elem.childNodes);
          }
        }, function(name, fn2) {
          jQuery.fn[name] = function(until, selector) {
            var matched = jQuery.map(this, fn2, until);
            if (name.slice(-5) !== "Until") {
              selector = until;
            }
            if (selector && typeof selector === "string") {
              matched = jQuery.filter(selector, matched);
            }
            if (this.length > 1) {
              if (!guaranteedUnique[name]) {
                jQuery.uniqueSort(matched);
              }
              if (rparentsprev.test(name)) {
                matched.reverse();
              }
            }
            return this.pushStack(matched);
          };
        });
        var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;
        function createOptions(options) {
          var object = {};
          jQuery.each(options.match(rnothtmlwhite) || [], function(_, flag) {
            object[flag] = true;
          });
          return object;
        }
        jQuery.Callbacks = function(options) {
          options = typeof options === "string" ? createOptions(options) : jQuery.extend({}, options);
          var firing, memory, fired, locked, list = [], queue = [], firingIndex = -1, fire = function() {
            locked = locked || options.once;
            fired = firing = true;
            for (; queue.length; firingIndex = -1) {
              memory = queue.shift();
              while (++firingIndex < list.length) {
                if (list[firingIndex].apply(memory[0], memory[1]) === false && options.stopOnFalse) {
                  firingIndex = list.length;
                  memory = false;
                }
              }
            }
            if (!options.memory) {
              memory = false;
            }
            firing = false;
            if (locked) {
              if (memory) {
                list = [];
              } else {
                list = "";
              }
            }
          }, self2 = {
            // Add a callback or a collection of callbacks to the list
            add: function() {
              if (list) {
                if (memory && !firing) {
                  firingIndex = list.length - 1;
                  queue.push(memory);
                }
                (function add2(args) {
                  jQuery.each(args, function(_, arg) {
                    if (isFunction(arg)) {
                      if (!options.unique || !self2.has(arg)) {
                        list.push(arg);
                      }
                    } else if (arg && arg.length && toType(arg) !== "string") {
                      add2(arg);
                    }
                  });
                })(arguments);
                if (memory && !firing) {
                  fire();
                }
              }
              return this;
            },
            // Remove a callback from the list
            remove: function() {
              jQuery.each(arguments, function(_, arg) {
                var index;
                while ((index = jQuery.inArray(arg, list, index)) > -1) {
                  list.splice(index, 1);
                  if (index <= firingIndex) {
                    firingIndex--;
                  }
                }
              });
              return this;
            },
            // Check if a given callback is in the list.
            // If no argument is given, return whether or not list has callbacks attached.
            has: function(fn2) {
              return fn2 ? jQuery.inArray(fn2, list) > -1 : list.length > 0;
            },
            // Remove all callbacks from the list
            empty: function() {
              if (list) {
                list = [];
              }
              return this;
            },
            // Disable .fire and .add
            // Abort any current/pending executions
            // Clear all callbacks and values
            disable: function() {
              locked = queue = [];
              list = memory = "";
              return this;
            },
            disabled: function() {
              return !list;
            },
            // Disable .fire
            // Also disable .add unless we have memory (since it would have no effect)
            // Abort any pending executions
            lock: function() {
              locked = queue = [];
              if (!memory && !firing) {
                list = memory = "";
              }
              return this;
            },
            locked: function() {
              return !!locked;
            },
            // Call all callbacks with the given context and arguments
            fireWith: function(context, args) {
              if (!locked) {
                args = args || [];
                args = [context, args.slice ? args.slice() : args];
                queue.push(args);
                if (!firing) {
                  fire();
                }
              }
              return this;
            },
            // Call all the callbacks with the given arguments
            fire: function() {
              self2.fireWith(this, arguments);
              return this;
            },
            // To know if the callbacks have already been called at least once
            fired: function() {
              return !!fired;
            }
          };
          return self2;
        };
        function Identity(v) {
          return v;
        }
        function Thrower(ex) {
          throw ex;
        }
        function adoptValue(value, resolve, reject, noValue) {
          var method;
          try {
            if (value && isFunction(method = value.promise)) {
              method.call(value).done(resolve).fail(reject);
            } else if (value && isFunction(method = value.then)) {
              method.call(value, resolve, reject);
            } else {
              resolve.apply(void 0, [value].slice(noValue));
            }
          } catch (value2) {
            reject.apply(void 0, [value2]);
          }
        }
        jQuery.extend({
          Deferred: function(func) {
            var tuples = [
              // action, add listener, callbacks,
              // ... .then handlers, argument index, [final state]
              [
                "notify",
                "progress",
                jQuery.Callbacks("memory"),
                jQuery.Callbacks("memory"),
                2
              ],
              [
                "resolve",
                "done",
                jQuery.Callbacks("once memory"),
                jQuery.Callbacks("once memory"),
                0,
                "resolved"
              ],
              [
                "reject",
                "fail",
                jQuery.Callbacks("once memory"),
                jQuery.Callbacks("once memory"),
                1,
                "rejected"
              ]
            ], state = "pending", promise = {
              state: function() {
                return state;
              },
              always: function() {
                deferred.done(arguments).fail(arguments);
                return this;
              },
              "catch": function(fn2) {
                return promise.then(null, fn2);
              },
              // Keep pipe for back-compat
              pipe: function() {
                var fns = arguments;
                return jQuery.Deferred(function(newDefer) {
                  jQuery.each(tuples, function(_i, tuple) {
                    var fn2 = isFunction(fns[tuple[4]]) && fns[tuple[4]];
                    deferred[tuple[1]](function() {
                      var returned = fn2 && fn2.apply(this, arguments);
                      if (returned && isFunction(returned.promise)) {
                        returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
                      } else {
                        newDefer[tuple[0] + "With"](
                          this,
                          fn2 ? [returned] : arguments
                        );
                      }
                    });
                  });
                  fns = null;
                }).promise();
              },
              then: function(onFulfilled, onRejected, onProgress) {
                var maxDepth = 0;
                function resolve(depth, deferred2, handler, special) {
                  return function() {
                    var that = this, args = arguments, mightThrow = function() {
                      var returned, then;
                      if (depth < maxDepth) {
                        return;
                      }
                      returned = handler.apply(that, args);
                      if (returned === deferred2.promise()) {
                        throw new TypeError("Thenable self-resolution");
                      }
                      then = returned && // Support: Promises/A+ section 2.3.4
                      // https://promisesaplus.com/#point-64
                      // Only check objects and functions for thenability
                      (typeof returned === "object" || typeof returned === "function") && returned.then;
                      if (isFunction(then)) {
                        if (special) {
                          then.call(
                            returned,
                            resolve(maxDepth, deferred2, Identity, special),
                            resolve(maxDepth, deferred2, Thrower, special)
                          );
                        } else {
                          maxDepth++;
                          then.call(
                            returned,
                            resolve(maxDepth, deferred2, Identity, special),
                            resolve(maxDepth, deferred2, Thrower, special),
                            resolve(
                              maxDepth,
                              deferred2,
                              Identity,
                              deferred2.notifyWith
                            )
                          );
                        }
                      } else {
                        if (handler !== Identity) {
                          that = void 0;
                          args = [returned];
                        }
                        (special || deferred2.resolveWith)(that, args);
                      }
                    }, process = special ? mightThrow : function() {
                      try {
                        mightThrow();
                      } catch (e) {
                        if (jQuery.Deferred.exceptionHook) {
                          jQuery.Deferred.exceptionHook(
                            e,
                            process.error
                          );
                        }
                        if (depth + 1 >= maxDepth) {
                          if (handler !== Thrower) {
                            that = void 0;
                            args = [e];
                          }
                          deferred2.rejectWith(that, args);
                        }
                      }
                    };
                    if (depth) {
                      process();
                    } else {
                      if (jQuery.Deferred.getErrorHook) {
                        process.error = jQuery.Deferred.getErrorHook();
                      } else if (jQuery.Deferred.getStackHook) {
                        process.error = jQuery.Deferred.getStackHook();
                      }
                      window2.setTimeout(process);
                    }
                  };
                }
                return jQuery.Deferred(function(newDefer) {
                  tuples[0][3].add(
                    resolve(
                      0,
                      newDefer,
                      isFunction(onProgress) ? onProgress : Identity,
                      newDefer.notifyWith
                    )
                  );
                  tuples[1][3].add(
                    resolve(
                      0,
                      newDefer,
                      isFunction(onFulfilled) ? onFulfilled : Identity
                    )
                  );
                  tuples[2][3].add(
                    resolve(
                      0,
                      newDefer,
                      isFunction(onRejected) ? onRejected : Thrower
                    )
                  );
                }).promise();
              },
              // Get a promise for this deferred
              // If obj is provided, the promise aspect is added to the object
              promise: function(obj) {
                return obj != null ? jQuery.extend(obj, promise) : promise;
              }
            }, deferred = {};
            jQuery.each(tuples, function(i, tuple) {
              var list = tuple[2], stateString = tuple[5];
              promise[tuple[1]] = list.add;
              if (stateString) {
                list.add(
                  function() {
                    state = stateString;
                  },
                  // rejected_callbacks.disable
                  // fulfilled_callbacks.disable
                  tuples[3 - i][2].disable,
                  // rejected_handlers.disable
                  // fulfilled_handlers.disable
                  tuples[3 - i][3].disable,
                  // progress_callbacks.lock
                  tuples[0][2].lock,
                  // progress_handlers.lock
                  tuples[0][3].lock
                );
              }
              list.add(tuple[3].fire);
              deferred[tuple[0]] = function() {
                deferred[tuple[0] + "With"](this === deferred ? void 0 : this, arguments);
                return this;
              };
              deferred[tuple[0] + "With"] = list.fireWith;
            });
            promise.promise(deferred);
            if (func) {
              func.call(deferred, deferred);
            }
            return deferred;
          },
          // Deferred helper
          when: function(singleValue) {
            var remaining = arguments.length, i = remaining, resolveContexts = Array(i), resolveValues = slice.call(arguments), primary = jQuery.Deferred(), updateFunc = function(i2) {
              return function(value) {
                resolveContexts[i2] = this;
                resolveValues[i2] = arguments.length > 1 ? slice.call(arguments) : value;
                if (!--remaining) {
                  primary.resolveWith(resolveContexts, resolveValues);
                }
              };
            };
            if (remaining <= 1) {
              adoptValue(
                singleValue,
                primary.done(updateFunc(i)).resolve,
                primary.reject,
                !remaining
              );
              if (primary.state() === "pending" || isFunction(resolveValues[i] && resolveValues[i].then)) {
                return primary.then();
              }
            }
            while (i--) {
              adoptValue(resolveValues[i], updateFunc(i), primary.reject);
            }
            return primary.promise();
          }
        });
        var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
        jQuery.Deferred.exceptionHook = function(error2, asyncError) {
          if (window2.console && window2.console.warn && error2 && rerrorNames.test(error2.name)) {
            window2.console.warn(
              "jQuery.Deferred exception: " + error2.message,
              error2.stack,
              asyncError
            );
          }
        };
        jQuery.readyException = function(error2) {
          window2.setTimeout(function() {
            throw error2;
          });
        };
        var readyList = jQuery.Deferred();
        jQuery.fn.ready = function(fn2) {
          readyList.then(fn2).catch(function(error2) {
            jQuery.readyException(error2);
          });
          return this;
        };
        jQuery.extend({
          // Is the DOM ready to be used? Set to true once it occurs.
          isReady: false,
          // A counter to track how many items to wait for before
          // the ready event fires. See trac-6781
          readyWait: 1,
          // Handle when the DOM is ready
          ready: function(wait) {
            if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
              return;
            }
            jQuery.isReady = true;
            if (wait !== true && --jQuery.readyWait > 0) {
              return;
            }
            readyList.resolveWith(document2, [jQuery]);
          }
        });
        jQuery.ready.then = readyList.then;
        function completed() {
          document2.removeEventListener("DOMContentLoaded", completed);
          window2.removeEventListener("load", completed);
          jQuery.ready();
        }
        if (document2.readyState === "complete" || document2.readyState !== "loading" && !document2.documentElement.doScroll) {
          window2.setTimeout(jQuery.ready);
        } else {
          document2.addEventListener("DOMContentLoaded", completed);
          window2.addEventListener("load", completed);
        }
        var access = function(elems, fn2, key, value, chainable, emptyGet, raw) {
          var i = 0, len = elems.length, bulk = key == null;
          if (toType(key) === "object") {
            chainable = true;
            for (i in key) {
              access(elems, fn2, i, key[i], true, emptyGet, raw);
            }
          } else if (value !== void 0) {
            chainable = true;
            if (!isFunction(value)) {
              raw = true;
            }
            if (bulk) {
              if (raw) {
                fn2.call(elems, value);
                fn2 = null;
              } else {
                bulk = fn2;
                fn2 = function(elem, _key, value2) {
                  return bulk.call(jQuery(elem), value2);
                };
              }
            }
            if (fn2) {
              for (; i < len; i++) {
                fn2(
                  elems[i],
                  key,
                  raw ? value : value.call(elems[i], i, fn2(elems[i], key))
                );
              }
            }
          }
          if (chainable) {
            return elems;
          }
          if (bulk) {
            return fn2.call(elems);
          }
          return len ? fn2(elems[0], key) : emptyGet;
        };
        var rmsPrefix = /^-ms-/, rdashAlpha = /-([a-z])/g;
        function fcamelCase(_all, letter) {
          return letter.toUpperCase();
        }
        function camelCase(string) {
          return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        }
        var acceptData = function(owner) {
          return owner.nodeType === 1 || owner.nodeType === 9 || !+owner.nodeType;
        };
        function Data() {
          this.expando = jQuery.expando + Data.uid++;
        }
        Data.uid = 1;
        Data.prototype = {
          cache: function(owner) {
            var value = owner[this.expando];
            if (!value) {
              value = {};
              if (acceptData(owner)) {
                if (owner.nodeType) {
                  owner[this.expando] = value;
                } else {
                  Object.defineProperty(owner, this.expando, {
                    value,
                    configurable: true
                  });
                }
              }
            }
            return value;
          },
          set: function(owner, data, value) {
            var prop, cache2 = this.cache(owner);
            if (typeof data === "string") {
              cache2[camelCase(data)] = value;
            } else {
              for (prop in data) {
                cache2[camelCase(prop)] = data[prop];
              }
            }
            return cache2;
          },
          get: function(owner, key) {
            return key === void 0 ? this.cache(owner) : (
              // Always use camelCase key (gh-2257)
              owner[this.expando] && owner[this.expando][camelCase(key)]
            );
          },
          access: function(owner, key, value) {
            if (key === void 0 || key && typeof key === "string" && value === void 0) {
              return this.get(owner, key);
            }
            this.set(owner, key, value);
            return value !== void 0 ? value : key;
          },
          remove: function(owner, key) {
            var i, cache2 = owner[this.expando];
            if (cache2 === void 0) {
              return;
            }
            if (key !== void 0) {
              if (Array.isArray(key)) {
                key = key.map(camelCase);
              } else {
                key = camelCase(key);
                key = key in cache2 ? [key] : key.match(rnothtmlwhite) || [];
              }
              i = key.length;
              while (i--) {
                delete cache2[key[i]];
              }
            }
            if (key === void 0 || jQuery.isEmptyObject(cache2)) {
              if (owner.nodeType) {
                owner[this.expando] = void 0;
              } else {
                delete owner[this.expando];
              }
            }
          },
          hasData: function(owner) {
            var cache2 = owner[this.expando];
            return cache2 !== void 0 && !jQuery.isEmptyObject(cache2);
          }
        };
        var dataPriv = new Data();
        var dataUser = new Data();
        var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /[A-Z]/g;
        function getData(data) {
          if (data === "true") {
            return true;
          }
          if (data === "false") {
            return false;
          }
          if (data === "null") {
            return null;
          }
          if (data === +data + "") {
            return +data;
          }
          if (rbrace.test(data)) {
            return JSON.parse(data);
          }
          return data;
        }
        function dataAttr(elem, key, data) {
          var name;
          if (data === void 0 && elem.nodeType === 1) {
            name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
            data = elem.getAttribute(name);
            if (typeof data === "string") {
              try {
                data = getData(data);
              } catch (e) {
              }
              dataUser.set(elem, key, data);
            } else {
              data = void 0;
            }
          }
          return data;
        }
        jQuery.extend({
          hasData: function(elem) {
            return dataUser.hasData(elem) || dataPriv.hasData(elem);
          },
          data: function(elem, name, data) {
            return dataUser.access(elem, name, data);
          },
          removeData: function(elem, name) {
            dataUser.remove(elem, name);
          },
          // TODO: Now that all calls to _data and _removeData have been replaced
          // with direct calls to dataPriv methods, these can be deprecated.
          _data: function(elem, name, data) {
            return dataPriv.access(elem, name, data);
          },
          _removeData: function(elem, name) {
            dataPriv.remove(elem, name);
          }
        });
        jQuery.fn.extend({
          data: function(key, value) {
            var i, name, data, elem = this[0], attrs = elem && elem.attributes;
            if (key === void 0) {
              if (this.length) {
                data = dataUser.get(elem);
                if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
                  i = attrs.length;
                  while (i--) {
                    if (attrs[i]) {
                      name = attrs[i].name;
                      if (name.indexOf("data-") === 0) {
                        name = camelCase(name.slice(5));
                        dataAttr(elem, name, data[name]);
                      }
                    }
                  }
                  dataPriv.set(elem, "hasDataAttrs", true);
                }
              }
              return data;
            }
            if (typeof key === "object") {
              return this.each(function() {
                dataUser.set(this, key);
              });
            }
            return access(this, function(value2) {
              var data2;
              if (elem && value2 === void 0) {
                data2 = dataUser.get(elem, key);
                if (data2 !== void 0) {
                  return data2;
                }
                data2 = dataAttr(elem, key);
                if (data2 !== void 0) {
                  return data2;
                }
                return;
              }
              this.each(function() {
                dataUser.set(this, key, value2);
              });
            }, null, value, arguments.length > 1, null, true);
          },
          removeData: function(key) {
            return this.each(function() {
              dataUser.remove(this, key);
            });
          }
        });
        jQuery.extend({
          queue: function(elem, type, data) {
            var queue;
            if (elem) {
              type = (type || "fx") + "queue";
              queue = dataPriv.get(elem, type);
              if (data) {
                if (!queue || Array.isArray(data)) {
                  queue = dataPriv.access(elem, type, jQuery.makeArray(data));
                } else {
                  queue.push(data);
                }
              }
              return queue || [];
            }
          },
          dequeue: function(elem, type) {
            type = type || "fx";
            var queue = jQuery.queue(elem, type), startLength = queue.length, fn2 = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function() {
              jQuery.dequeue(elem, type);
            };
            if (fn2 === "inprogress") {
              fn2 = queue.shift();
              startLength--;
            }
            if (fn2) {
              if (type === "fx") {
                queue.unshift("inprogress");
              }
              delete hooks.stop;
              fn2.call(elem, next, hooks);
            }
            if (!startLength && hooks) {
              hooks.empty.fire();
            }
          },
          // Not public - generate a queueHooks object, or return the current one
          _queueHooks: function(elem, type) {
            var key = type + "queueHooks";
            return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
              empty: jQuery.Callbacks("once memory").add(function() {
                dataPriv.remove(elem, [type + "queue", key]);
              })
            });
          }
        });
        jQuery.fn.extend({
          queue: function(type, data) {
            var setter = 2;
            if (typeof type !== "string") {
              data = type;
              type = "fx";
              setter--;
            }
            if (arguments.length < setter) {
              return jQuery.queue(this[0], type);
            }
            return data === void 0 ? this : this.each(function() {
              var queue = jQuery.queue(this, type, data);
              jQuery._queueHooks(this, type);
              if (type === "fx" && queue[0] !== "inprogress") {
                jQuery.dequeue(this, type);
              }
            });
          },
          dequeue: function(type) {
            return this.each(function() {
              jQuery.dequeue(this, type);
            });
          },
          clearQueue: function(type) {
            return this.queue(type || "fx", []);
          },
          // Get a promise resolved when queues of a certain type
          // are emptied (fx is the type by default)
          promise: function(type, obj) {
            var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function() {
              if (!--count) {
                defer.resolveWith(elements, [elements]);
              }
            };
            if (typeof type !== "string") {
              obj = type;
              type = void 0;
            }
            type = type || "fx";
            while (i--) {
              tmp = dataPriv.get(elements[i], type + "queueHooks");
              if (tmp && tmp.empty) {
                count++;
                tmp.empty.add(resolve);
              }
            }
            resolve();
            return defer.promise(obj);
          }
        });
        var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
        var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");
        var cssExpand = ["Top", "Right", "Bottom", "Left"];
        var documentElement = document2.documentElement;
        var isAttached = function(elem) {
          return jQuery.contains(elem.ownerDocument, elem);
        }, composed = { composed: true };
        if (documentElement.getRootNode) {
          isAttached = function(elem) {
            return jQuery.contains(elem.ownerDocument, elem) || elem.getRootNode(composed) === elem.ownerDocument;
          };
        }
        var isHiddenWithinTree = function(elem, el) {
          elem = el || elem;
          return elem.style.display === "none" || elem.style.display === "" && // Otherwise, check computed style
          // Support: Firefox <=43 - 45
          // Disconnected elements can have computed display: none, so first confirm that elem is
          // in the document.
          isAttached(elem) && jQuery.css(elem, "display") === "none";
        };
        function adjustCSS(elem, prop, valueParts, tween) {
          var adjusted, scale, maxIterations = 20, currentValue = tween ? function() {
            return tween.cur();
          } : function() {
            return jQuery.css(elem, prop, "");
          }, initial = currentValue(), unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"), initialInUnit = elem.nodeType && (jQuery.cssNumber[prop] || unit !== "px" && +initial) && rcssNum.exec(jQuery.css(elem, prop));
          if (initialInUnit && initialInUnit[3] !== unit) {
            initial = initial / 2;
            unit = unit || initialInUnit[3];
            initialInUnit = +initial || 1;
            while (maxIterations--) {
              jQuery.style(elem, prop, initialInUnit + unit);
              if ((1 - scale) * (1 - (scale = currentValue() / initial || 0.5)) <= 0) {
                maxIterations = 0;
              }
              initialInUnit = initialInUnit / scale;
            }
            initialInUnit = initialInUnit * 2;
            jQuery.style(elem, prop, initialInUnit + unit);
            valueParts = valueParts || [];
          }
          if (valueParts) {
            initialInUnit = +initialInUnit || +initial || 0;
            adjusted = valueParts[1] ? initialInUnit + (valueParts[1] + 1) * valueParts[2] : +valueParts[2];
            if (tween) {
              tween.unit = unit;
              tween.start = initialInUnit;
              tween.end = adjusted;
            }
          }
          return adjusted;
        }
        var defaultDisplayMap = {};
        function getDefaultDisplay(elem) {
          var temp, doc = elem.ownerDocument, nodeName2 = elem.nodeName, display = defaultDisplayMap[nodeName2];
          if (display) {
            return display;
          }
          temp = doc.body.appendChild(doc.createElement(nodeName2));
          display = jQuery.css(temp, "display");
          temp.parentNode.removeChild(temp);
          if (display === "none") {
            display = "block";
          }
          defaultDisplayMap[nodeName2] = display;
          return display;
        }
        function showHide(elements, show) {
          var display, elem, values = [], index = 0, length = elements.length;
          for (; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
              continue;
            }
            display = elem.style.display;
            if (show) {
              if (display === "none") {
                values[index] = dataPriv.get(elem, "display") || null;
                if (!values[index]) {
                  elem.style.display = "";
                }
              }
              if (elem.style.display === "" && isHiddenWithinTree(elem)) {
                values[index] = getDefaultDisplay(elem);
              }
            } else {
              if (display !== "none") {
                values[index] = "none";
                dataPriv.set(elem, "display", display);
              }
            }
          }
          for (index = 0; index < length; index++) {
            if (values[index] != null) {
              elements[index].style.display = values[index];
            }
          }
          return elements;
        }
        jQuery.fn.extend({
          show: function() {
            return showHide(this, true);
          },
          hide: function() {
            return showHide(this);
          },
          toggle: function(state) {
            if (typeof state === "boolean") {
              return state ? this.show() : this.hide();
            }
            return this.each(function() {
              if (isHiddenWithinTree(this)) {
                jQuery(this).show();
              } else {
                jQuery(this).hide();
              }
            });
          }
        });
        var rcheckableType = /^(?:checkbox|radio)$/i;
        var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i;
        var rscriptType = /^$|^module$|\/(?:java|ecma)script/i;
        (function() {
          var fragment = document2.createDocumentFragment(), div = fragment.appendChild(document2.createElement("div")), input = document2.createElement("input");
          input.setAttribute("type", "radio");
          input.setAttribute("checked", "checked");
          input.setAttribute("name", "t");
          div.appendChild(input);
          support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
          div.innerHTML = "<textarea>x</textarea>";
          support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
          div.innerHTML = "<option></option>";
          support.option = !!div.lastChild;
        })();
        var wrapMap = {
          // XHTML parsers do not magically insert elements in the
          // same way that tag soup parsers do. So we cannot shorten
          // this by omitting <tbody> or other required elements.
          thead: [1, "<table>", "</table>"],
          col: [2, "<table><colgroup>", "</colgroup></table>"],
          tr: [2, "<table><tbody>", "</tbody></table>"],
          td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
          _default: [0, "", ""]
        };
        wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
        wrapMap.th = wrapMap.td;
        if (!support.option) {
          wrapMap.optgroup = wrapMap.option = [1, "<select multiple='multiple'>", "</select>"];
        }
        function getAll(context, tag) {
          var ret;
          if (typeof context.getElementsByTagName !== "undefined") {
            ret = context.getElementsByTagName(tag || "*");
          } else if (typeof context.querySelectorAll !== "undefined") {
            ret = context.querySelectorAll(tag || "*");
          } else {
            ret = [];
          }
          if (tag === void 0 || tag && nodeName(context, tag)) {
            return jQuery.merge([context], ret);
          }
          return ret;
        }
        function setGlobalEval(elems, refElements) {
          var i = 0, l = elems.length;
          for (; i < l; i++) {
            dataPriv.set(
              elems[i],
              "globalEval",
              !refElements || dataPriv.get(refElements[i], "globalEval")
            );
          }
        }
        var rhtml = /<|&#?\w+;/;
        function buildFragment(elems, context, scripts, selection, ignored) {
          var elem, tmp, tag, wrap, attached, j, fragment = context.createDocumentFragment(), nodes = [], i = 0, l = elems.length;
          for (; i < l; i++) {
            elem = elems[i];
            if (elem || elem === 0) {
              if (toType(elem) === "object") {
                jQuery.merge(nodes, elem.nodeType ? [elem] : elem);
              } else if (!rhtml.test(elem)) {
                nodes.push(context.createTextNode(elem));
              } else {
                tmp = tmp || fragment.appendChild(context.createElement("div"));
                tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                wrap = wrapMap[tag] || wrapMap._default;
                tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];
                j = wrap[0];
                while (j--) {
                  tmp = tmp.lastChild;
                }
                jQuery.merge(nodes, tmp.childNodes);
                tmp = fragment.firstChild;
                tmp.textContent = "";
              }
            }
          }
          fragment.textContent = "";
          i = 0;
          while (elem = nodes[i++]) {
            if (selection && jQuery.inArray(elem, selection) > -1) {
              if (ignored) {
                ignored.push(elem);
              }
              continue;
            }
            attached = isAttached(elem);
            tmp = getAll(fragment.appendChild(elem), "script");
            if (attached) {
              setGlobalEval(tmp);
            }
            if (scripts) {
              j = 0;
              while (elem = tmp[j++]) {
                if (rscriptType.test(elem.type || "")) {
                  scripts.push(elem);
                }
              }
            }
          }
          return fragment;
        }
        var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;
        function returnTrue() {
          return true;
        }
        function returnFalse() {
          return false;
        }
        function on(elem, types, selector, data, fn2, one) {
          var origFn, type;
          if (typeof types === "object") {
            if (typeof selector !== "string") {
              data = data || selector;
              selector = void 0;
            }
            for (type in types) {
              on(elem, type, selector, data, types[type], one);
            }
            return elem;
          }
          if (data == null && fn2 == null) {
            fn2 = selector;
            data = selector = void 0;
          } else if (fn2 == null) {
            if (typeof selector === "string") {
              fn2 = data;
              data = void 0;
            } else {
              fn2 = data;
              data = selector;
              selector = void 0;
            }
          }
          if (fn2 === false) {
            fn2 = returnFalse;
          } else if (!fn2) {
            return elem;
          }
          if (one === 1) {
            origFn = fn2;
            fn2 = function(event) {
              jQuery().off(event);
              return origFn.apply(this, arguments);
            };
            fn2.guid = origFn.guid || (origFn.guid = jQuery.guid++);
          }
          return elem.each(function() {
            jQuery.event.add(this, types, fn2, data, selector);
          });
        }
        jQuery.event = {
          global: {},
          add: function(elem, types, handler, data, selector) {
            var handleObjIn, eventHandle, tmp, events2, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.get(elem);
            if (!acceptData(elem)) {
              return;
            }
            if (handler.handler) {
              handleObjIn = handler;
              handler = handleObjIn.handler;
              selector = handleObjIn.selector;
            }
            if (selector) {
              jQuery.find.matchesSelector(documentElement, selector);
            }
            if (!handler.guid) {
              handler.guid = jQuery.guid++;
            }
            if (!(events2 = elemData.events)) {
              events2 = elemData.events = /* @__PURE__ */ Object.create(null);
            }
            if (!(eventHandle = elemData.handle)) {
              eventHandle = elemData.handle = function(e) {
                return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ? jQuery.event.dispatch.apply(elem, arguments) : void 0;
              };
            }
            types = (types || "").match(rnothtmlwhite) || [""];
            t = types.length;
            while (t--) {
              tmp = rtypenamespace.exec(types[t]) || [];
              type = origType = tmp[1];
              namespaces = (tmp[2] || "").split(".").sort();
              if (!type) {
                continue;
              }
              special = jQuery.event.special[type] || {};
              type = (selector ? special.delegateType : special.bindType) || type;
              special = jQuery.event.special[type] || {};
              handleObj = jQuery.extend({
                type,
                origType,
                data,
                handler,
                guid: handler.guid,
                selector,
                needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                namespace: namespaces.join(".")
              }, handleObjIn);
              if (!(handlers = events2[type])) {
                handlers = events2[type] = [];
                handlers.delegateCount = 0;
                if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                  if (elem.addEventListener) {
                    elem.addEventListener(type, eventHandle);
                  }
                }
              }
              if (special.add) {
                special.add.call(elem, handleObj);
                if (!handleObj.handler.guid) {
                  handleObj.handler.guid = handler.guid;
                }
              }
              if (selector) {
                handlers.splice(handlers.delegateCount++, 0, handleObj);
              } else {
                handlers.push(handleObj);
              }
              jQuery.event.global[type] = true;
            }
          },
          // Detach an event or set of events from an element
          remove: function(elem, types, handler, selector, mappedTypes) {
            var j, origCount, tmp, events2, t, handleObj, special, handlers, type, namespaces, origType, elemData = dataPriv.hasData(elem) && dataPriv.get(elem);
            if (!elemData || !(events2 = elemData.events)) {
              return;
            }
            types = (types || "").match(rnothtmlwhite) || [""];
            t = types.length;
            while (t--) {
              tmp = rtypenamespace.exec(types[t]) || [];
              type = origType = tmp[1];
              namespaces = (tmp[2] || "").split(".").sort();
              if (!type) {
                for (type in events2) {
                  jQuery.event.remove(elem, type + types[t], handler, selector, true);
                }
                continue;
              }
              special = jQuery.event.special[type] || {};
              type = (selector ? special.delegateType : special.bindType) || type;
              handlers = events2[type] || [];
              tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
              origCount = j = handlers.length;
              while (j--) {
                handleObj = handlers[j];
                if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                  handlers.splice(j, 1);
                  if (handleObj.selector) {
                    handlers.delegateCount--;
                  }
                  if (special.remove) {
                    special.remove.call(elem, handleObj);
                  }
                }
              }
              if (origCount && !handlers.length) {
                if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                  jQuery.removeEvent(elem, type, elemData.handle);
                }
                delete events2[type];
              }
            }
            if (jQuery.isEmptyObject(events2)) {
              dataPriv.remove(elem, "handle events");
            }
          },
          dispatch: function(nativeEvent) {
            var i, j, ret, matched, handleObj, handlerQueue, args = new Array(arguments.length), event = jQuery.event.fix(nativeEvent), handlers = (dataPriv.get(this, "events") || /* @__PURE__ */ Object.create(null))[event.type] || [], special = jQuery.event.special[event.type] || {};
            args[0] = event;
            for (i = 1; i < arguments.length; i++) {
              args[i] = arguments[i];
            }
            event.delegateTarget = this;
            if (special.preDispatch && special.preDispatch.call(this, event) === false) {
              return;
            }
            handlerQueue = jQuery.event.handlers.call(this, event, handlers);
            i = 0;
            while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
              event.currentTarget = matched.elem;
              j = 0;
              while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
                if (!event.rnamespace || handleObj.namespace === false || event.rnamespace.test(handleObj.namespace)) {
                  event.handleObj = handleObj;
                  event.data = handleObj.data;
                  ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
                  if (ret !== void 0) {
                    if ((event.result = ret) === false) {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }
                }
              }
            }
            if (special.postDispatch) {
              special.postDispatch.call(this, event);
            }
            return event.result;
          },
          handlers: function(event, handlers) {
            var i, handleObj, sel, matchedHandlers, matchedSelectors, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
            if (delegateCount && // Support: IE <=9
            // Black-hole SVG <use> instance trees (trac-13180)
            cur.nodeType && // Support: Firefox <=42
            // Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
            // https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
            // Support: IE 11 only
            // ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
            !(event.type === "click" && event.button >= 1)) {
              for (; cur !== this; cur = cur.parentNode || this) {
                if (cur.nodeType === 1 && !(event.type === "click" && cur.disabled === true)) {
                  matchedHandlers = [];
                  matchedSelectors = {};
                  for (i = 0; i < delegateCount; i++) {
                    handleObj = handlers[i];
                    sel = handleObj.selector + " ";
                    if (matchedSelectors[sel] === void 0) {
                      matchedSelectors[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) > -1 : jQuery.find(sel, this, null, [cur]).length;
                    }
                    if (matchedSelectors[sel]) {
                      matchedHandlers.push(handleObj);
                    }
                  }
                  if (matchedHandlers.length) {
                    handlerQueue.push({ elem: cur, handlers: matchedHandlers });
                  }
                }
              }
            }
            cur = this;
            if (delegateCount < handlers.length) {
              handlerQueue.push({ elem: cur, handlers: handlers.slice(delegateCount) });
            }
            return handlerQueue;
          },
          addProp: function(name, hook) {
            Object.defineProperty(jQuery.Event.prototype, name, {
              enumerable: true,
              configurable: true,
              get: isFunction(hook) ? function() {
                if (this.originalEvent) {
                  return hook(this.originalEvent);
                }
              } : function() {
                if (this.originalEvent) {
                  return this.originalEvent[name];
                }
              },
              set: function(value) {
                Object.defineProperty(this, name, {
                  enumerable: true,
                  configurable: true,
                  writable: true,
                  value
                });
              }
            });
          },
          fix: function(originalEvent) {
            return originalEvent[jQuery.expando] ? originalEvent : new jQuery.Event(originalEvent);
          },
          special: {
            load: {
              // Prevent triggered image.load events from bubbling to window.load
              noBubble: true
            },
            click: {
              // Utilize native event to ensure correct state for checkable inputs
              setup: function(data) {
                var el = this || data;
                if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                  leverageNative(el, "click", true);
                }
                return false;
              },
              trigger: function(data) {
                var el = this || data;
                if (rcheckableType.test(el.type) && el.click && nodeName(el, "input")) {
                  leverageNative(el, "click");
                }
                return true;
              },
              // For cross-browser consistency, suppress native .click() on links
              // Also prevent it if we're currently inside a leveraged native-event stack
              _default: function(event) {
                var target = event.target;
                return rcheckableType.test(target.type) && target.click && nodeName(target, "input") && dataPriv.get(target, "click") || nodeName(target, "a");
              }
            },
            beforeunload: {
              postDispatch: function(event) {
                if (event.result !== void 0 && event.originalEvent) {
                  event.originalEvent.returnValue = event.result;
                }
              }
            }
          }
        };
        function leverageNative(el, type, isSetup) {
          if (!isSetup) {
            if (dataPriv.get(el, type) === void 0) {
              jQuery.event.add(el, type, returnTrue);
            }
            return;
          }
          dataPriv.set(el, type, false);
          jQuery.event.add(el, type, {
            namespace: false,
            handler: function(event) {
              var result, saved = dataPriv.get(this, type);
              if (event.isTrigger & 1 && this[type]) {
                if (!saved) {
                  saved = slice.call(arguments);
                  dataPriv.set(this, type, saved);
                  this[type]();
                  result = dataPriv.get(this, type);
                  dataPriv.set(this, type, false);
                  if (saved !== result) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    return result;
                  }
                } else if ((jQuery.event.special[type] || {}).delegateType) {
                  event.stopPropagation();
                }
              } else if (saved) {
                dataPriv.set(this, type, jQuery.event.trigger(
                  saved[0],
                  saved.slice(1),
                  this
                ));
                event.stopPropagation();
                event.isImmediatePropagationStopped = returnTrue;
              }
            }
          });
        }
        jQuery.removeEvent = function(elem, type, handle) {
          if (elem.removeEventListener) {
            elem.removeEventListener(type, handle);
          }
        };
        jQuery.Event = function(src, props) {
          if (!(this instanceof jQuery.Event)) {
            return new jQuery.Event(src, props);
          }
          if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
            this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === void 0 && // Support: Android <=2.3 only
            src.returnValue === false ? returnTrue : returnFalse;
            this.target = src.target && src.target.nodeType === 3 ? src.target.parentNode : src.target;
            this.currentTarget = src.currentTarget;
            this.relatedTarget = src.relatedTarget;
          } else {
            this.type = src;
          }
          if (props) {
            jQuery.extend(this, props);
          }
          this.timeStamp = src && src.timeStamp || Date.now();
          this[jQuery.expando] = true;
        };
        jQuery.Event.prototype = {
          constructor: jQuery.Event,
          isDefaultPrevented: returnFalse,
          isPropagationStopped: returnFalse,
          isImmediatePropagationStopped: returnFalse,
          isSimulated: false,
          preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue;
            if (e && !this.isSimulated) {
              e.preventDefault();
            }
          },
          stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = returnTrue;
            if (e && !this.isSimulated) {
              e.stopPropagation();
            }
          },
          stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = returnTrue;
            if (e && !this.isSimulated) {
              e.stopImmediatePropagation();
            }
            this.stopPropagation();
          }
        };
        jQuery.each({
          altKey: true,
          bubbles: true,
          cancelable: true,
          changedTouches: true,
          ctrlKey: true,
          detail: true,
          eventPhase: true,
          metaKey: true,
          pageX: true,
          pageY: true,
          shiftKey: true,
          view: true,
          "char": true,
          code: true,
          charCode: true,
          key: true,
          keyCode: true,
          button: true,
          buttons: true,
          clientX: true,
          clientY: true,
          offsetX: true,
          offsetY: true,
          pointerId: true,
          pointerType: true,
          screenX: true,
          screenY: true,
          targetTouches: true,
          toElement: true,
          touches: true,
          which: true
        }, jQuery.event.addProp);
        jQuery.each({ focus: "focusin", blur: "focusout" }, function(type, delegateType) {
          function focusMappedHandler(nativeEvent) {
            if (document2.documentMode) {
              var handle = dataPriv.get(this, "handle"), event = jQuery.event.fix(nativeEvent);
              event.type = nativeEvent.type === "focusin" ? "focus" : "blur";
              event.isSimulated = true;
              handle(nativeEvent);
              if (event.target === event.currentTarget) {
                handle(event);
              }
            } else {
              jQuery.event.simulate(
                delegateType,
                nativeEvent.target,
                jQuery.event.fix(nativeEvent)
              );
            }
          }
          jQuery.event.special[type] = {
            // Utilize native event if possible so blur/focus sequence is correct
            setup: function() {
              var attaches;
              leverageNative(this, type, true);
              if (document2.documentMode) {
                attaches = dataPriv.get(this, delegateType);
                if (!attaches) {
                  this.addEventListener(delegateType, focusMappedHandler);
                }
                dataPriv.set(this, delegateType, (attaches || 0) + 1);
              } else {
                return false;
              }
            },
            trigger: function() {
              leverageNative(this, type);
              return true;
            },
            teardown: function() {
              var attaches;
              if (document2.documentMode) {
                attaches = dataPriv.get(this, delegateType) - 1;
                if (!attaches) {
                  this.removeEventListener(delegateType, focusMappedHandler);
                  dataPriv.remove(this, delegateType);
                } else {
                  dataPriv.set(this, delegateType, attaches);
                }
              } else {
                return false;
              }
            },
            // Suppress native focus or blur if we're currently inside
            // a leveraged native-event stack
            _default: function(event) {
              return dataPriv.get(event.target, type);
            },
            delegateType
          };
          jQuery.event.special[delegateType] = {
            setup: function() {
              var doc = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType);
              if (!attaches) {
                if (document2.documentMode) {
                  this.addEventListener(delegateType, focusMappedHandler);
                } else {
                  doc.addEventListener(type, focusMappedHandler, true);
                }
              }
              dataPriv.set(dataHolder, delegateType, (attaches || 0) + 1);
            },
            teardown: function() {
              var doc = this.ownerDocument || this.document || this, dataHolder = document2.documentMode ? this : doc, attaches = dataPriv.get(dataHolder, delegateType) - 1;
              if (!attaches) {
                if (document2.documentMode) {
                  this.removeEventListener(delegateType, focusMappedHandler);
                } else {
                  doc.removeEventListener(type, focusMappedHandler, true);
                }
                dataPriv.remove(dataHolder, delegateType);
              } else {
                dataPriv.set(dataHolder, delegateType, attaches);
              }
            }
          };
        });
        jQuery.each({
          mouseenter: "mouseover",
          mouseleave: "mouseout",
          pointerenter: "pointerover",
          pointerleave: "pointerout"
        }, function(orig, fix) {
          jQuery.event.special[orig] = {
            delegateType: fix,
            bindType: fix,
            handle: function(event) {
              var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
              if (!related || related !== target && !jQuery.contains(target, related)) {
                event.type = handleObj.origType;
                ret = handleObj.handler.apply(this, arguments);
                event.type = fix;
              }
              return ret;
            }
          };
        });
        jQuery.fn.extend({
          on: function(types, selector, data, fn2) {
            return on(this, types, selector, data, fn2);
          },
          one: function(types, selector, data, fn2) {
            return on(this, types, selector, data, fn2, 1);
          },
          off: function(types, selector, fn2) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) {
              handleObj = types.handleObj;
              jQuery(types.delegateTarget).off(
                handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                handleObj.selector,
                handleObj.handler
              );
              return this;
            }
            if (typeof types === "object") {
              for (type in types) {
                this.off(type, selector, types[type]);
              }
              return this;
            }
            if (selector === false || typeof selector === "function") {
              fn2 = selector;
              selector = void 0;
            }
            if (fn2 === false) {
              fn2 = returnFalse;
            }
            return this.each(function() {
              jQuery.event.remove(this, types, fn2, selector);
            });
          }
        });
        var rnoInnerhtml = /<script|<style|<link/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rcleanScript = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
        function manipulationTarget(elem, content) {
          if (nodeName(elem, "table") && nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr")) {
            return jQuery(elem).children("tbody")[0] || elem;
          }
          return elem;
        }
        function disableScript(elem) {
          elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
          return elem;
        }
        function restoreScript(elem) {
          if ((elem.type || "").slice(0, 5) === "true/") {
            elem.type = elem.type.slice(5);
          } else {
            elem.removeAttribute("type");
          }
          return elem;
        }
        function cloneCopyEvent(src, dest) {
          var i, l, type, pdataOld, udataOld, udataCur, events2;
          if (dest.nodeType !== 1) {
            return;
          }
          if (dataPriv.hasData(src)) {
            pdataOld = dataPriv.get(src);
            events2 = pdataOld.events;
            if (events2) {
              dataPriv.remove(dest, "handle events");
              for (type in events2) {
                for (i = 0, l = events2[type].length; i < l; i++) {
                  jQuery.event.add(dest, type, events2[type][i]);
                }
              }
            }
          }
          if (dataUser.hasData(src)) {
            udataOld = dataUser.access(src);
            udataCur = jQuery.extend({}, udataOld);
            dataUser.set(dest, udataCur);
          }
        }
        function fixInput(src, dest) {
          var nodeName2 = dest.nodeName.toLowerCase();
          if (nodeName2 === "input" && rcheckableType.test(src.type)) {
            dest.checked = src.checked;
          } else if (nodeName2 === "input" || nodeName2 === "textarea") {
            dest.defaultValue = src.defaultValue;
          }
        }
        function domManip(collection, args, callback, ignored) {
          args = flat(args);
          var fragment, first, scripts, hasScripts, node, doc, i = 0, l = collection.length, iNoClone = l - 1, value = args[0], valueIsFunction = isFunction(value);
          if (valueIsFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
            return collection.each(function(index) {
              var self2 = collection.eq(index);
              if (valueIsFunction) {
                args[0] = value.call(this, index, self2.html());
              }
              domManip(self2, args, callback, ignored);
            });
          }
          if (l) {
            fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
            first = fragment.firstChild;
            if (fragment.childNodes.length === 1) {
              fragment = first;
            }
            if (first || ignored) {
              scripts = jQuery.map(getAll(fragment, "script"), disableScript);
              hasScripts = scripts.length;
              for (; i < l; i++) {
                node = fragment;
                if (i !== iNoClone) {
                  node = jQuery.clone(node, true, true);
                  if (hasScripts) {
                    jQuery.merge(scripts, getAll(node, "script"));
                  }
                }
                callback.call(collection[i], node, i);
              }
              if (hasScripts) {
                doc = scripts[scripts.length - 1].ownerDocument;
                jQuery.map(scripts, restoreScript);
                for (i = 0; i < hasScripts; i++) {
                  node = scripts[i];
                  if (rscriptType.test(node.type || "") && !dataPriv.access(node, "globalEval") && jQuery.contains(doc, node)) {
                    if (node.src && (node.type || "").toLowerCase() !== "module") {
                      if (jQuery._evalUrl && !node.noModule) {
                        jQuery._evalUrl(node.src, {
                          nonce: node.nonce || node.getAttribute("nonce")
                        }, doc);
                      }
                    } else {
                      DOMEval(node.textContent.replace(rcleanScript, ""), node, doc);
                    }
                  }
                }
              }
            }
          }
          return collection;
        }
        function remove(elem, selector, keepData) {
          var node, nodes = selector ? jQuery.filter(selector, elem) : elem, i = 0;
          for (; (node = nodes[i]) != null; i++) {
            if (!keepData && node.nodeType === 1) {
              jQuery.cleanData(getAll(node));
            }
            if (node.parentNode) {
              if (keepData && isAttached(node)) {
                setGlobalEval(getAll(node, "script"));
              }
              node.parentNode.removeChild(node);
            }
          }
          return elem;
        }
        jQuery.extend({
          htmlPrefilter: function(html) {
            return html;
          },
          clone: function(elem, dataAndEvents, deepDataAndEvents) {
            var i, l, srcElements, destElements, clone = elem.cloneNode(true), inPage = isAttached(elem);
            if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
              destElements = getAll(clone);
              srcElements = getAll(elem);
              for (i = 0, l = srcElements.length; i < l; i++) {
                fixInput(srcElements[i], destElements[i]);
              }
            }
            if (dataAndEvents) {
              if (deepDataAndEvents) {
                srcElements = srcElements || getAll(elem);
                destElements = destElements || getAll(clone);
                for (i = 0, l = srcElements.length; i < l; i++) {
                  cloneCopyEvent(srcElements[i], destElements[i]);
                }
              } else {
                cloneCopyEvent(elem, clone);
              }
            }
            destElements = getAll(clone, "script");
            if (destElements.length > 0) {
              setGlobalEval(destElements, !inPage && getAll(elem, "script"));
            }
            return clone;
          },
          cleanData: function(elems) {
            var data, elem, type, special = jQuery.event.special, i = 0;
            for (; (elem = elems[i]) !== void 0; i++) {
              if (acceptData(elem)) {
                if (data = elem[dataPriv.expando]) {
                  if (data.events) {
                    for (type in data.events) {
                      if (special[type]) {
                        jQuery.event.remove(elem, type);
                      } else {
                        jQuery.removeEvent(elem, type, data.handle);
                      }
                    }
                  }
                  elem[dataPriv.expando] = void 0;
                }
                if (elem[dataUser.expando]) {
                  elem[dataUser.expando] = void 0;
                }
              }
            }
          }
        });
        jQuery.fn.extend({
          detach: function(selector) {
            return remove(this, selector, true);
          },
          remove: function(selector) {
            return remove(this, selector);
          },
          text: function(value) {
            return access(this, function(value2) {
              return value2 === void 0 ? jQuery.text(this) : this.empty().each(function() {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                  this.textContent = value2;
                }
              });
            }, null, value, arguments.length);
          },
          append: function() {
            return domManip(this, arguments, function(elem) {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                var target = manipulationTarget(this, elem);
                target.appendChild(elem);
              }
            });
          },
          prepend: function() {
            return domManip(this, arguments, function(elem) {
              if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                var target = manipulationTarget(this, elem);
                target.insertBefore(elem, target.firstChild);
              }
            });
          },
          before: function() {
            return domManip(this, arguments, function(elem) {
              if (this.parentNode) {
                this.parentNode.insertBefore(elem, this);
              }
            });
          },
          after: function() {
            return domManip(this, arguments, function(elem) {
              if (this.parentNode) {
                this.parentNode.insertBefore(elem, this.nextSibling);
              }
            });
          },
          empty: function() {
            var elem, i = 0;
            for (; (elem = this[i]) != null; i++) {
              if (elem.nodeType === 1) {
                jQuery.cleanData(getAll(elem, false));
                elem.textContent = "";
              }
            }
            return this;
          },
          clone: function(dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
            return this.map(function() {
              return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
          },
          html: function(value) {
            return access(this, function(value2) {
              var elem = this[0] || {}, i = 0, l = this.length;
              if (value2 === void 0 && elem.nodeType === 1) {
                return elem.innerHTML;
              }
              if (typeof value2 === "string" && !rnoInnerhtml.test(value2) && !wrapMap[(rtagName.exec(value2) || ["", ""])[1].toLowerCase()]) {
                value2 = jQuery.htmlPrefilter(value2);
                try {
                  for (; i < l; i++) {
                    elem = this[i] || {};
                    if (elem.nodeType === 1) {
                      jQuery.cleanData(getAll(elem, false));
                      elem.innerHTML = value2;
                    }
                  }
                  elem = 0;
                } catch (e) {
                }
              }
              if (elem) {
                this.empty().append(value2);
              }
            }, null, value, arguments.length);
          },
          replaceWith: function() {
            var ignored = [];
            return domManip(this, arguments, function(elem) {
              var parent = this.parentNode;
              if (jQuery.inArray(this, ignored) < 0) {
                jQuery.cleanData(getAll(this));
                if (parent) {
                  parent.replaceChild(elem, this);
                }
              }
            }, ignored);
          }
        });
        jQuery.each({
          appendTo: "append",
          prependTo: "prepend",
          insertBefore: "before",
          insertAfter: "after",
          replaceAll: "replaceWith"
        }, function(name, original) {
          jQuery.fn[name] = function(selector) {
            var elems, ret = [], insert = jQuery(selector), last = insert.length - 1, i = 0;
            for (; i <= last; i++) {
              elems = i === last ? this : this.clone(true);
              jQuery(insert[i])[original](elems);
              push.apply(ret, elems.get());
            }
            return this.pushStack(ret);
          };
        });
        var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
        var rcustomProp = /^--/;
        var getStyles = function(elem) {
          var view = elem.ownerDocument.defaultView;
          if (!view || !view.opener) {
            view = window2;
          }
          return view.getComputedStyle(elem);
        };
        var swap = function(elem, options, callback) {
          var ret, name, old = {};
          for (name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
          }
          ret = callback.call(elem);
          for (name in options) {
            elem.style[name] = old[name];
          }
          return ret;
        };
        var rboxStyle = new RegExp(cssExpand.join("|"), "i");
        (function() {
          function computeStyleTests() {
            if (!div) {
              return;
            }
            container.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0";
            div.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%";
            documentElement.appendChild(container).appendChild(div);
            var divStyle = window2.getComputedStyle(div);
            pixelPositionVal = divStyle.top !== "1%";
            reliableMarginLeftVal = roundPixelMeasures(divStyle.marginLeft) === 12;
            div.style.right = "60%";
            pixelBoxStylesVal = roundPixelMeasures(divStyle.right) === 36;
            boxSizingReliableVal = roundPixelMeasures(divStyle.width) === 36;
            div.style.position = "absolute";
            scrollboxSizeVal = roundPixelMeasures(div.offsetWidth / 3) === 12;
            documentElement.removeChild(container);
            div = null;
          }
          function roundPixelMeasures(measure) {
            return Math.round(parseFloat(measure));
          }
          var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal, reliableTrDimensionsVal, reliableMarginLeftVal, container = document2.createElement("div"), div = document2.createElement("div");
          if (!div.style) {
            return;
          }
          div.style.backgroundClip = "content-box";
          div.cloneNode(true).style.backgroundClip = "";
          support.clearCloneStyle = div.style.backgroundClip === "content-box";
          jQuery.extend(support, {
            boxSizingReliable: function() {
              computeStyleTests();
              return boxSizingReliableVal;
            },
            pixelBoxStyles: function() {
              computeStyleTests();
              return pixelBoxStylesVal;
            },
            pixelPosition: function() {
              computeStyleTests();
              return pixelPositionVal;
            },
            reliableMarginLeft: function() {
              computeStyleTests();
              return reliableMarginLeftVal;
            },
            scrollboxSize: function() {
              computeStyleTests();
              return scrollboxSizeVal;
            },
            // Support: IE 9 - 11+, Edge 15 - 18+
            // IE/Edge misreport `getComputedStyle` of table rows with width/height
            // set in CSS while `offset*` properties report correct values.
            // Behavior in IE 9 is more subtle than in newer versions & it passes
            // some versions of this test; make sure not to make it pass there!
            //
            // Support: Firefox 70+
            // Only Firefox includes border widths
            // in computed dimensions. (gh-4529)
            reliableTrDimensions: function() {
              var table, tr, trChild, trStyle;
              if (reliableTrDimensionsVal == null) {
                table = document2.createElement("table");
                tr = document2.createElement("tr");
                trChild = document2.createElement("div");
                table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
                tr.style.cssText = "box-sizing:content-box;border:1px solid";
                tr.style.height = "1px";
                trChild.style.height = "9px";
                trChild.style.display = "block";
                documentElement.appendChild(table).appendChild(tr).appendChild(trChild);
                trStyle = window2.getComputedStyle(tr);
                reliableTrDimensionsVal = parseInt(trStyle.height, 10) + parseInt(trStyle.borderTopWidth, 10) + parseInt(trStyle.borderBottomWidth, 10) === tr.offsetHeight;
                documentElement.removeChild(table);
              }
              return reliableTrDimensionsVal;
            }
          });
        })();
        function curCSS(elem, name, computed) {
          var width, minWidth, maxWidth, ret, isCustomProp = rcustomProp.test(name), style = elem.style;
          computed = computed || getStyles(elem);
          if (computed) {
            ret = computed.getPropertyValue(name) || computed[name];
            if (isCustomProp && ret) {
              ret = ret.replace(rtrimCSS, "$1") || void 0;
            }
            if (ret === "" && !isAttached(elem)) {
              ret = jQuery.style(elem, name);
            }
            if (!support.pixelBoxStyles() && rnumnonpx.test(ret) && rboxStyle.test(name)) {
              width = style.width;
              minWidth = style.minWidth;
              maxWidth = style.maxWidth;
              style.minWidth = style.maxWidth = style.width = ret;
              ret = computed.width;
              style.width = width;
              style.minWidth = minWidth;
              style.maxWidth = maxWidth;
            }
          }
          return ret !== void 0 ? (
            // Support: IE <=9 - 11 only
            // IE returns zIndex value as an integer.
            ret + ""
          ) : ret;
        }
        function addGetHookIf(conditionFn, hookFn) {
          return {
            get: function() {
              if (conditionFn()) {
                delete this.get;
                return;
              }
              return (this.get = hookFn).apply(this, arguments);
            }
          };
        }
        var cssPrefixes = ["Webkit", "Moz", "ms"], emptyStyle = document2.createElement("div").style, vendorProps = {};
        function vendorPropName(name) {
          var capName = name[0].toUpperCase() + name.slice(1), i = cssPrefixes.length;
          while (i--) {
            name = cssPrefixes[i] + capName;
            if (name in emptyStyle) {
              return name;
            }
          }
        }
        function finalPropName(name) {
          var final = jQuery.cssProps[name] || vendorProps[name];
          if (final) {
            return final;
          }
          if (name in emptyStyle) {
            return name;
          }
          return vendorProps[name] = vendorPropName(name) || name;
        }
        var rdisplayswap = /^(none|table(?!-c[ea]).+)/, cssShow = { position: "absolute", visibility: "hidden", display: "block" }, cssNormalTransform = {
          letterSpacing: "0",
          fontWeight: "400"
        };
        function setPositiveNumber(_elem, value, subtract) {
          var matches = rcssNum.exec(value);
          return matches ? (
            // Guard against undefined "subtract", e.g., when used as in cssHooks
            Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px")
          ) : value;
        }
        function boxModelAdjustment(elem, dimension, box, isBorderBox, styles, computedVal) {
          var i = dimension === "width" ? 1 : 0, extra = 0, delta = 0, marginDelta = 0;
          if (box === (isBorderBox ? "border" : "content")) {
            return 0;
          }
          for (; i < 4; i += 2) {
            if (box === "margin") {
              marginDelta += jQuery.css(elem, box + cssExpand[i], true, styles);
            }
            if (!isBorderBox) {
              delta += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
              if (box !== "padding") {
                delta += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
              } else {
                extra += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
              }
            } else {
              if (box === "content") {
                delta -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
              }
              if (box !== "margin") {
                delta -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
              }
            }
          }
          if (!isBorderBox && computedVal >= 0) {
            delta += Math.max(0, Math.ceil(
              elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - computedVal - delta - extra - 0.5
              // If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
              // Use an explicit zero to avoid NaN (gh-3964)
            )) || 0;
          }
          return delta + marginDelta;
        }
        function getWidthOrHeight(elem, dimension, extra) {
          var styles = getStyles(elem), boxSizingNeeded = !support.boxSizingReliable() || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", valueIsBorderBox = isBorderBox, val = curCSS(elem, dimension, styles), offsetProp = "offset" + dimension[0].toUpperCase() + dimension.slice(1);
          if (rnumnonpx.test(val)) {
            if (!extra) {
              return val;
            }
            val = "auto";
          }
          if ((!support.boxSizingReliable() && isBorderBox || // Support: IE 10 - 11+, Edge 15 - 18+
          // IE/Edge misreport `getComputedStyle` of table rows with width/height
          // set in CSS while `offset*` properties report correct values.
          // Interestingly, in some cases IE 9 doesn't suffer from this issue.
          !support.reliableTrDimensions() && nodeName(elem, "tr") || // Fall back to offsetWidth/offsetHeight when value is "auto"
          // This happens for inline elements with no explicit setting (gh-3571)
          val === "auto" || // Support: Android <=4.1 - 4.3 only
          // Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
          !parseFloat(val) && jQuery.css(elem, "display", false, styles) === "inline") && // Make sure the element is visible & connected
          elem.getClientRects().length) {
            isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";
            valueIsBorderBox = offsetProp in elem;
            if (valueIsBorderBox) {
              val = elem[offsetProp];
            }
          }
          val = parseFloat(val) || 0;
          return val + boxModelAdjustment(
            elem,
            dimension,
            extra || (isBorderBox ? "border" : "content"),
            valueIsBorderBox,
            styles,
            // Provide the current computed size to request scroll gutter calculation (gh-3589)
            val
          ) + "px";
        }
        jQuery.extend({
          // Add in style property hooks for overriding the default
          // behavior of getting and setting a style property
          cssHooks: {
            opacity: {
              get: function(elem, computed) {
                if (computed) {
                  var ret = curCSS(elem, "opacity");
                  return ret === "" ? "1" : ret;
                }
              }
            }
          },
          // Don't automatically add "px" to these possibly-unitless properties
          cssNumber: {
            animationIterationCount: true,
            aspectRatio: true,
            borderImageSlice: true,
            columnCount: true,
            flexGrow: true,
            flexShrink: true,
            fontWeight: true,
            gridArea: true,
            gridColumn: true,
            gridColumnEnd: true,
            gridColumnStart: true,
            gridRow: true,
            gridRowEnd: true,
            gridRowStart: true,
            lineHeight: true,
            opacity: true,
            order: true,
            orphans: true,
            scale: true,
            widows: true,
            zIndex: true,
            zoom: true,
            // SVG-related
            fillOpacity: true,
            floodOpacity: true,
            stopOpacity: true,
            strokeMiterlimit: true,
            strokeOpacity: true
          },
          // Add in properties whose names you wish to fix before
          // setting or getting the value
          cssProps: {},
          // Get and set the style property on a DOM Node
          style: function(elem, name, value, extra) {
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
              return;
            }
            var ret, type, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name), style = elem.style;
            if (!isCustomProp) {
              name = finalPropName(origName);
            }
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
            if (value !== void 0) {
              type = typeof value;
              if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
                value = adjustCSS(elem, name, ret);
                type = "number";
              }
              if (value == null || value !== value) {
                return;
              }
              if (type === "number" && !isCustomProp) {
                value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
              }
              if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
                style[name] = "inherit";
              }
              if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== void 0) {
                if (isCustomProp) {
                  style.setProperty(name, value);
                } else {
                  style[name] = value;
                }
              }
            } else {
              if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== void 0) {
                return ret;
              }
              return style[name];
            }
          },
          css: function(elem, name, extra, styles) {
            var val, num, hooks, origName = camelCase(name), isCustomProp = rcustomProp.test(name);
            if (!isCustomProp) {
              name = finalPropName(origName);
            }
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
            if (hooks && "get" in hooks) {
              val = hooks.get(elem, true, extra);
            }
            if (val === void 0) {
              val = curCSS(elem, name, styles);
            }
            if (val === "normal" && name in cssNormalTransform) {
              val = cssNormalTransform[name];
            }
            if (extra === "" || extra) {
              num = parseFloat(val);
              return extra === true || isFinite(num) ? num || 0 : val;
            }
            return val;
          }
        });
        jQuery.each(["height", "width"], function(_i, dimension) {
          jQuery.cssHooks[dimension] = {
            get: function(elem, computed, extra) {
              if (computed) {
                return rdisplayswap.test(jQuery.css(elem, "display")) && // Support: Safari 8+
                // Table columns in Safari have non-zero offsetWidth & zero
                // getBoundingClientRect().width unless display is changed.
                // Support: IE <=11 only
                // Running getBoundingClientRect on a disconnected node
                // in IE throws an error.
                (!elem.getClientRects().length || !elem.getBoundingClientRect().width) ? swap(elem, cssShow, function() {
                  return getWidthOrHeight(elem, dimension, extra);
                }) : getWidthOrHeight(elem, dimension, extra);
              }
            },
            set: function(elem, value, extra) {
              var matches, styles = getStyles(elem), scrollboxSizeBuggy = !support.scrollboxSize() && styles.position === "absolute", boxSizingNeeded = scrollboxSizeBuggy || extra, isBorderBox = boxSizingNeeded && jQuery.css(elem, "boxSizing", false, styles) === "border-box", subtract = extra ? boxModelAdjustment(
                elem,
                dimension,
                extra,
                isBorderBox,
                styles
              ) : 0;
              if (isBorderBox && scrollboxSizeBuggy) {
                subtract -= Math.ceil(
                  elem["offset" + dimension[0].toUpperCase() + dimension.slice(1)] - parseFloat(styles[dimension]) - boxModelAdjustment(elem, dimension, "border", false, styles) - 0.5
                );
              }
              if (subtract && (matches = rcssNum.exec(value)) && (matches[3] || "px") !== "px") {
                elem.style[dimension] = value;
                value = jQuery.css(elem, dimension);
              }
              return setPositiveNumber(elem, value, subtract);
            }
          };
        });
        jQuery.cssHooks.marginLeft = addGetHookIf(
          support.reliableMarginLeft,
          function(elem, computed) {
            if (computed) {
              return (parseFloat(curCSS(elem, "marginLeft")) || elem.getBoundingClientRect().left - swap(elem, { marginLeft: 0 }, function() {
                return elem.getBoundingClientRect().left;
              })) + "px";
            }
          }
        );
        jQuery.each({
          margin: "",
          padding: "",
          border: "Width"
        }, function(prefix, suffix) {
          jQuery.cssHooks[prefix + suffix] = {
            expand: function(value) {
              var i = 0, expanded = {}, parts = typeof value === "string" ? value.split(" ") : [value];
              for (; i < 4; i++) {
                expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
              }
              return expanded;
            }
          };
          if (prefix !== "margin") {
            jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
          }
        });
        jQuery.fn.extend({
          css: function(name, value) {
            return access(this, function(elem, name2, value2) {
              var styles, len, map = {}, i = 0;
              if (Array.isArray(name2)) {
                styles = getStyles(elem);
                len = name2.length;
                for (; i < len; i++) {
                  map[name2[i]] = jQuery.css(elem, name2[i], false, styles);
                }
                return map;
              }
              return value2 !== void 0 ? jQuery.style(elem, name2, value2) : jQuery.css(elem, name2);
            }, name, value, arguments.length > 1);
          }
        });
        function Tween(elem, options, prop, end2, easing) {
          return new Tween.prototype.init(elem, options, prop, end2, easing);
        }
        jQuery.Tween = Tween;
        Tween.prototype = {
          constructor: Tween,
          init: function(elem, options, prop, end2, easing, unit) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || jQuery.easing._default;
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end2;
            this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
          },
          cur: function() {
            var hooks = Tween.propHooks[this.prop];
            return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
          },
          run: function(percent) {
            var eased, hooks = Tween.propHooks[this.prop];
            if (this.options.duration) {
              this.pos = eased = jQuery.easing[this.easing](
                percent,
                this.options.duration * percent,
                0,
                1,
                this.options.duration
              );
            } else {
              this.pos = eased = percent;
            }
            this.now = (this.end - this.start) * eased + this.start;
            if (this.options.step) {
              this.options.step.call(this.elem, this.now, this);
            }
            if (hooks && hooks.set) {
              hooks.set(this);
            } else {
              Tween.propHooks._default.set(this);
            }
            return this;
          }
        };
        Tween.prototype.init.prototype = Tween.prototype;
        Tween.propHooks = {
          _default: {
            get: function(tween) {
              var result;
              if (tween.elem.nodeType !== 1 || tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
                return tween.elem[tween.prop];
              }
              result = jQuery.css(tween.elem, tween.prop, "");
              return !result || result === "auto" ? 0 : result;
            },
            set: function(tween) {
              if (jQuery.fx.step[tween.prop]) {
                jQuery.fx.step[tween.prop](tween);
              } else if (tween.elem.nodeType === 1 && (jQuery.cssHooks[tween.prop] || tween.elem.style[finalPropName(tween.prop)] != null)) {
                jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
              } else {
                tween.elem[tween.prop] = tween.now;
              }
            }
          }
        };
        Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
          set: function(tween) {
            if (tween.elem.nodeType && tween.elem.parentNode) {
              tween.elem[tween.prop] = tween.now;
            }
          }
        };
        jQuery.easing = {
          linear: function(p) {
            return p;
          },
          swing: function(p) {
            return 0.5 - Math.cos(p * Math.PI) / 2;
          },
          _default: "swing"
        };
        jQuery.fx = Tween.prototype.init;
        jQuery.fx.step = {};
        var fxNow, inProgress, rfxtypes = /^(?:toggle|show|hide)$/, rrun = /queueHooks$/;
        function schedule() {
          if (inProgress) {
            if (document2.hidden === false && window2.requestAnimationFrame) {
              window2.requestAnimationFrame(schedule);
            } else {
              window2.setTimeout(schedule, jQuery.fx.interval);
            }
            jQuery.fx.tick();
          }
        }
        function createFxNow() {
          window2.setTimeout(function() {
            fxNow = void 0;
          });
          return fxNow = Date.now();
        }
        function genFx(type, includeWidth) {
          var which, i = 0, attrs = { height: type };
          includeWidth = includeWidth ? 1 : 0;
          for (; i < 4; i += 2 - includeWidth) {
            which = cssExpand[i];
            attrs["margin" + which] = attrs["padding" + which] = type;
          }
          if (includeWidth) {
            attrs.opacity = attrs.width = type;
          }
          return attrs;
        }
        function createTween(value, prop, animation) {
          var tween, collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]), index = 0, length = collection.length;
          for (; index < length; index++) {
            if (tween = collection[index].call(animation, prop, value)) {
              return tween;
            }
          }
        }
        function defaultPrefilter(elem, props, opts) {
          var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display, isBox = "width" in props || "height" in props, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHiddenWithinTree(elem), dataShow = dataPriv.get(elem, "fxshow");
          if (!opts.queue) {
            hooks = jQuery._queueHooks(elem, "fx");
            if (hooks.unqueued == null) {
              hooks.unqueued = 0;
              oldfire = hooks.empty.fire;
              hooks.empty.fire = function() {
                if (!hooks.unqueued) {
                  oldfire();
                }
              };
            }
            hooks.unqueued++;
            anim.always(function() {
              anim.always(function() {
                hooks.unqueued--;
                if (!jQuery.queue(elem, "fx").length) {
                  hooks.empty.fire();
                }
              });
            });
          }
          for (prop in props) {
            value = props[prop];
            if (rfxtypes.test(value)) {
              delete props[prop];
              toggle = toggle || value === "toggle";
              if (value === (hidden ? "hide" : "show")) {
                if (value === "show" && dataShow && dataShow[prop] !== void 0) {
                  hidden = true;
                } else {
                  continue;
                }
              }
              orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
            }
          }
          propTween = !jQuery.isEmptyObject(props);
          if (!propTween && jQuery.isEmptyObject(orig)) {
            return;
          }
          if (isBox && elem.nodeType === 1) {
            opts.overflow = [style.overflow, style.overflowX, style.overflowY];
            restoreDisplay = dataShow && dataShow.display;
            if (restoreDisplay == null) {
              restoreDisplay = dataPriv.get(elem, "display");
            }
            display = jQuery.css(elem, "display");
            if (display === "none") {
              if (restoreDisplay) {
                display = restoreDisplay;
              } else {
                showHide([elem], true);
                restoreDisplay = elem.style.display || restoreDisplay;
                display = jQuery.css(elem, "display");
                showHide([elem]);
              }
            }
            if (display === "inline" || display === "inline-block" && restoreDisplay != null) {
              if (jQuery.css(elem, "float") === "none") {
                if (!propTween) {
                  anim.done(function() {
                    style.display = restoreDisplay;
                  });
                  if (restoreDisplay == null) {
                    display = style.display;
                    restoreDisplay = display === "none" ? "" : display;
                  }
                }
                style.display = "inline-block";
              }
            }
          }
          if (opts.overflow) {
            style.overflow = "hidden";
            anim.always(function() {
              style.overflow = opts.overflow[0];
              style.overflowX = opts.overflow[1];
              style.overflowY = opts.overflow[2];
            });
          }
          propTween = false;
          for (prop in orig) {
            if (!propTween) {
              if (dataShow) {
                if ("hidden" in dataShow) {
                  hidden = dataShow.hidden;
                }
              } else {
                dataShow = dataPriv.access(elem, "fxshow", { display: restoreDisplay });
              }
              if (toggle) {
                dataShow.hidden = !hidden;
              }
              if (hidden) {
                showHide([elem], true);
              }
              anim.done(function() {
                if (!hidden) {
                  showHide([elem]);
                }
                dataPriv.remove(elem, "fxshow");
                for (prop in orig) {
                  jQuery.style(elem, prop, orig[prop]);
                }
              });
            }
            propTween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
            if (!(prop in dataShow)) {
              dataShow[prop] = propTween.start;
              if (hidden) {
                propTween.end = propTween.start;
                propTween.start = 0;
              }
            }
          }
        }
        function propFilter(props, specialEasing) {
          var index, name, easing, value, hooks;
          for (index in props) {
            name = camelCase(index);
            easing = specialEasing[name];
            value = props[index];
            if (Array.isArray(value)) {
              easing = value[1];
              value = props[index] = value[0];
            }
            if (index !== name) {
              props[name] = value;
              delete props[index];
            }
            hooks = jQuery.cssHooks[name];
            if (hooks && "expand" in hooks) {
              value = hooks.expand(value);
              delete props[name];
              for (index in value) {
                if (!(index in props)) {
                  props[index] = value[index];
                  specialEasing[index] = easing;
                }
              }
            } else {
              specialEasing[name] = easing;
            }
          }
        }
        function Animation(elem, properties, options) {
          var result, stopped, index = 0, length = Animation.prefilters.length, deferred = jQuery.Deferred().always(function() {
            delete tick.elem;
          }), tick = function() {
            if (stopped) {
              return false;
            }
            var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index2 = 0, length2 = animation.tweens.length;
            for (; index2 < length2; index2++) {
              animation.tweens[index2].run(percent);
            }
            deferred.notifyWith(elem, [animation, percent, remaining]);
            if (percent < 1 && length2) {
              return remaining;
            }
            if (!length2) {
              deferred.notifyWith(elem, [animation, 1, 0]);
            }
            deferred.resolveWith(elem, [animation]);
            return false;
          }, animation = deferred.promise({
            elem,
            props: jQuery.extend({}, properties),
            opts: jQuery.extend(true, {
              specialEasing: {},
              easing: jQuery.easing._default
            }, options),
            originalProperties: properties,
            originalOptions: options,
            startTime: fxNow || createFxNow(),
            duration: options.duration,
            tweens: [],
            createTween: function(prop, end2) {
              var tween = jQuery.Tween(
                elem,
                animation.opts,
                prop,
                end2,
                animation.opts.specialEasing[prop] || animation.opts.easing
              );
              animation.tweens.push(tween);
              return tween;
            },
            stop: function(gotoEnd) {
              var index2 = 0, length2 = gotoEnd ? animation.tweens.length : 0;
              if (stopped) {
                return this;
              }
              stopped = true;
              for (; index2 < length2; index2++) {
                animation.tweens[index2].run(1);
              }
              if (gotoEnd) {
                deferred.notifyWith(elem, [animation, 1, 0]);
                deferred.resolveWith(elem, [animation, gotoEnd]);
              } else {
                deferred.rejectWith(elem, [animation, gotoEnd]);
              }
              return this;
            }
          }), props = animation.props;
          propFilter(props, animation.opts.specialEasing);
          for (; index < length; index++) {
            result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
            if (result) {
              if (isFunction(result.stop)) {
                jQuery._queueHooks(animation.elem, animation.opts.queue).stop = result.stop.bind(result);
              }
              return result;
            }
          }
          jQuery.map(props, createTween, animation);
          if (isFunction(animation.opts.start)) {
            animation.opts.start.call(elem, animation);
          }
          animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
          jQuery.fx.timer(
            jQuery.extend(tick, {
              elem,
              anim: animation,
              queue: animation.opts.queue
            })
          );
          return animation;
        }
        jQuery.Animation = jQuery.extend(Animation, {
          tweeners: {
            "*": [function(prop, value) {
              var tween = this.createTween(prop, value);
              adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
              return tween;
            }]
          },
          tweener: function(props, callback) {
            if (isFunction(props)) {
              callback = props;
              props = ["*"];
            } else {
              props = props.match(rnothtmlwhite);
            }
            var prop, index = 0, length = props.length;
            for (; index < length; index++) {
              prop = props[index];
              Animation.tweeners[prop] = Animation.tweeners[prop] || [];
              Animation.tweeners[prop].unshift(callback);
            }
          },
          prefilters: [defaultPrefilter],
          prefilter: function(callback, prepend) {
            if (prepend) {
              Animation.prefilters.unshift(callback);
            } else {
              Animation.prefilters.push(callback);
            }
          }
        });
        jQuery.speed = function(speed, easing, fn2) {
          var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
            complete: fn2 || !fn2 && easing || isFunction(speed) && speed,
            duration: speed,
            easing: fn2 && easing || easing && !isFunction(easing) && easing
          };
          if (jQuery.fx.off) {
            opt.duration = 0;
          } else {
            if (typeof opt.duration !== "number") {
              if (opt.duration in jQuery.fx.speeds) {
                opt.duration = jQuery.fx.speeds[opt.duration];
              } else {
                opt.duration = jQuery.fx.speeds._default;
              }
            }
          }
          if (opt.queue == null || opt.queue === true) {
            opt.queue = "fx";
          }
          opt.old = opt.complete;
          opt.complete = function() {
            if (isFunction(opt.old)) {
              opt.old.call(this);
            }
            if (opt.queue) {
              jQuery.dequeue(this, opt.queue);
            }
          };
          return opt;
        };
        jQuery.fn.extend({
          fadeTo: function(speed, to, easing, callback) {
            return this.filter(isHiddenWithinTree).css("opacity", 0).show().end().animate({ opacity: to }, speed, easing, callback);
          },
          animate: function(prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
              var anim = Animation(this, jQuery.extend({}, prop), optall);
              if (empty || dataPriv.get(this, "finish")) {
                anim.stop(true);
              }
            };
            doAnimation.finish = doAnimation;
            return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
          },
          stop: function(type, clearQueue, gotoEnd) {
            var stopQueue = function(hooks) {
              var stop = hooks.stop;
              delete hooks.stop;
              stop(gotoEnd);
            };
            if (typeof type !== "string") {
              gotoEnd = clearQueue;
              clearQueue = type;
              type = void 0;
            }
            if (clearQueue) {
              this.queue(type || "fx", []);
            }
            return this.each(function() {
              var dequeue = true, index = type != null && type + "queueHooks", timers = jQuery.timers, data = dataPriv.get(this);
              if (index) {
                if (data[index] && data[index].stop) {
                  stopQueue(data[index]);
                }
              } else {
                for (index in data) {
                  if (data[index] && data[index].stop && rrun.test(index)) {
                    stopQueue(data[index]);
                  }
                }
              }
              for (index = timers.length; index--; ) {
                if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                  timers[index].anim.stop(gotoEnd);
                  dequeue = false;
                  timers.splice(index, 1);
                }
              }
              if (dequeue || !gotoEnd) {
                jQuery.dequeue(this, type);
              }
            });
          },
          finish: function(type) {
            if (type !== false) {
              type = type || "fx";
            }
            return this.each(function() {
              var index, data = dataPriv.get(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery.timers, length = queue ? queue.length : 0;
              data.finish = true;
              jQuery.queue(this, type, []);
              if (hooks && hooks.stop) {
                hooks.stop.call(this, true);
              }
              for (index = timers.length; index--; ) {
                if (timers[index].elem === this && timers[index].queue === type) {
                  timers[index].anim.stop(true);
                  timers.splice(index, 1);
                }
              }
              for (index = 0; index < length; index++) {
                if (queue[index] && queue[index].finish) {
                  queue[index].finish.call(this);
                }
              }
              delete data.finish;
            });
          }
        });
        jQuery.each(["toggle", "show", "hide"], function(_i, name) {
          var cssFn = jQuery.fn[name];
          jQuery.fn[name] = function(speed, easing, callback) {
            return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
          };
        });
        jQuery.each({
          slideDown: genFx("show"),
          slideUp: genFx("hide"),
          slideToggle: genFx("toggle"),
          fadeIn: { opacity: "show" },
          fadeOut: { opacity: "hide" },
          fadeToggle: { opacity: "toggle" }
        }, function(name, props) {
          jQuery.fn[name] = function(speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
          };
        });
        jQuery.timers = [];
        jQuery.fx.tick = function() {
          var timer, i = 0, timers = jQuery.timers;
          fxNow = Date.now();
          for (; i < timers.length; i++) {
            timer = timers[i];
            if (!timer() && timers[i] === timer) {
              timers.splice(i--, 1);
            }
          }
          if (!timers.length) {
            jQuery.fx.stop();
          }
          fxNow = void 0;
        };
        jQuery.fx.timer = function(timer) {
          jQuery.timers.push(timer);
          jQuery.fx.start();
        };
        jQuery.fx.interval = 13;
        jQuery.fx.start = function() {
          if (inProgress) {
            return;
          }
          inProgress = true;
          schedule();
        };
        jQuery.fx.stop = function() {
          inProgress = null;
        };
        jQuery.fx.speeds = {
          slow: 600,
          fast: 200,
          // Default speed
          _default: 400
        };
        jQuery.fn.delay = function(time, type) {
          time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
          type = type || "fx";
          return this.queue(type, function(next, hooks) {
            var timeout = window2.setTimeout(next, time);
            hooks.stop = function() {
              window2.clearTimeout(timeout);
            };
          });
        };
        (function() {
          var input = document2.createElement("input"), select = document2.createElement("select"), opt = select.appendChild(document2.createElement("option"));
          input.type = "checkbox";
          support.checkOn = input.value !== "";
          support.optSelected = opt.selected;
          input = document2.createElement("input");
          input.value = "t";
          input.type = "radio";
          support.radioValue = input.value === "t";
        })();
        var boolHook, attrHandle = jQuery.expr.attrHandle;
        jQuery.fn.extend({
          attr: function(name, value) {
            return access(this, jQuery.attr, name, value, arguments.length > 1);
          },
          removeAttr: function(name) {
            return this.each(function() {
              jQuery.removeAttr(this, name);
            });
          }
        });
        jQuery.extend({
          attr: function(elem, name, value) {
            var ret, hooks, nType = elem.nodeType;
            if (nType === 3 || nType === 8 || nType === 2) {
              return;
            }
            if (typeof elem.getAttribute === "undefined") {
              return jQuery.prop(elem, name, value);
            }
            if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
              hooks = jQuery.attrHooks[name.toLowerCase()] || (jQuery.expr.match.bool.test(name) ? boolHook : void 0);
            }
            if (value !== void 0) {
              if (value === null) {
                jQuery.removeAttr(elem, name);
                return;
              }
              if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
                return ret;
              }
              elem.setAttribute(name, value + "");
              return value;
            }
            if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
              return ret;
            }
            ret = jQuery.find.attr(elem, name);
            return ret == null ? void 0 : ret;
          },
          attrHooks: {
            type: {
              set: function(elem, value) {
                if (!support.radioValue && value === "radio" && nodeName(elem, "input")) {
                  var val = elem.value;
                  elem.setAttribute("type", value);
                  if (val) {
                    elem.value = val;
                  }
                  return value;
                }
              }
            }
          },
          removeAttr: function(elem, value) {
            var name, i = 0, attrNames = value && value.match(rnothtmlwhite);
            if (attrNames && elem.nodeType === 1) {
              while (name = attrNames[i++]) {
                elem.removeAttribute(name);
              }
            }
          }
        });
        boolHook = {
          set: function(elem, value, name) {
            if (value === false) {
              jQuery.removeAttr(elem, name);
            } else {
              elem.setAttribute(name, name);
            }
            return name;
          }
        };
        jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(_i, name) {
          var getter = attrHandle[name] || jQuery.find.attr;
          attrHandle[name] = function(elem, name2, isXML) {
            var ret, handle, lowercaseName = name2.toLowerCase();
            if (!isXML) {
              handle = attrHandle[lowercaseName];
              attrHandle[lowercaseName] = ret;
              ret = getter(elem, name2, isXML) != null ? lowercaseName : null;
              attrHandle[lowercaseName] = handle;
            }
            return ret;
          };
        });
        var rfocusable = /^(?:input|select|textarea|button)$/i, rclickable = /^(?:a|area)$/i;
        jQuery.fn.extend({
          prop: function(name, value) {
            return access(this, jQuery.prop, name, value, arguments.length > 1);
          },
          removeProp: function(name) {
            return this.each(function() {
              delete this[jQuery.propFix[name] || name];
            });
          }
        });
        jQuery.extend({
          prop: function(elem, name, value) {
            var ret, hooks, nType = elem.nodeType;
            if (nType === 3 || nType === 8 || nType === 2) {
              return;
            }
            if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
              name = jQuery.propFix[name] || name;
              hooks = jQuery.propHooks[name];
            }
            if (value !== void 0) {
              if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== void 0) {
                return ret;
              }
              return elem[name] = value;
            }
            if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
              return ret;
            }
            return elem[name];
          },
          propHooks: {
            tabIndex: {
              get: function(elem) {
                var tabindex = jQuery.find.attr(elem, "tabindex");
                if (tabindex) {
                  return parseInt(tabindex, 10);
                }
                if (rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href) {
                  return 0;
                }
                return -1;
              }
            }
          },
          propFix: {
            "for": "htmlFor",
            "class": "className"
          }
        });
        if (!support.optSelected) {
          jQuery.propHooks.selected = {
            get: function(elem) {
              var parent = elem.parentNode;
              if (parent && parent.parentNode) {
                parent.parentNode.selectedIndex;
              }
              return null;
            },
            set: function(elem) {
              var parent = elem.parentNode;
              if (parent) {
                parent.selectedIndex;
                if (parent.parentNode) {
                  parent.parentNode.selectedIndex;
                }
              }
            }
          };
        }
        jQuery.each([
          "tabIndex",
          "readOnly",
          "maxLength",
          "cellSpacing",
          "cellPadding",
          "rowSpan",
          "colSpan",
          "useMap",
          "frameBorder",
          "contentEditable"
        ], function() {
          jQuery.propFix[this.toLowerCase()] = this;
        });
        function stripAndCollapse(value) {
          var tokens = value.match(rnothtmlwhite) || [];
          return tokens.join(" ");
        }
        function getClass(elem) {
          return elem.getAttribute && elem.getAttribute("class") || "";
        }
        function classesToArray(value) {
          if (Array.isArray(value)) {
            return value;
          }
          if (typeof value === "string") {
            return value.match(rnothtmlwhite) || [];
          }
          return [];
        }
        jQuery.fn.extend({
          addClass: function(value) {
            var classNames, cur, curValue, className, i, finalValue;
            if (isFunction(value)) {
              return this.each(function(j) {
                jQuery(this).addClass(value.call(this, j, getClass(this)));
              });
            }
            classNames = classesToArray(value);
            if (classNames.length) {
              return this.each(function() {
                curValue = getClass(this);
                cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
                if (cur) {
                  for (i = 0; i < classNames.length; i++) {
                    className = classNames[i];
                    if (cur.indexOf(" " + className + " ") < 0) {
                      cur += className + " ";
                    }
                  }
                  finalValue = stripAndCollapse(cur);
                  if (curValue !== finalValue) {
                    this.setAttribute("class", finalValue);
                  }
                }
              });
            }
            return this;
          },
          removeClass: function(value) {
            var classNames, cur, curValue, className, i, finalValue;
            if (isFunction(value)) {
              return this.each(function(j) {
                jQuery(this).removeClass(value.call(this, j, getClass(this)));
              });
            }
            if (!arguments.length) {
              return this.attr("class", "");
            }
            classNames = classesToArray(value);
            if (classNames.length) {
              return this.each(function() {
                curValue = getClass(this);
                cur = this.nodeType === 1 && " " + stripAndCollapse(curValue) + " ";
                if (cur) {
                  for (i = 0; i < classNames.length; i++) {
                    className = classNames[i];
                    while (cur.indexOf(" " + className + " ") > -1) {
                      cur = cur.replace(" " + className + " ", " ");
                    }
                  }
                  finalValue = stripAndCollapse(cur);
                  if (curValue !== finalValue) {
                    this.setAttribute("class", finalValue);
                  }
                }
              });
            }
            return this;
          },
          toggleClass: function(value, stateVal) {
            var classNames, className, i, self2, type = typeof value, isValidValue = type === "string" || Array.isArray(value);
            if (isFunction(value)) {
              return this.each(function(i2) {
                jQuery(this).toggleClass(
                  value.call(this, i2, getClass(this), stateVal),
                  stateVal
                );
              });
            }
            if (typeof stateVal === "boolean" && isValidValue) {
              return stateVal ? this.addClass(value) : this.removeClass(value);
            }
            classNames = classesToArray(value);
            return this.each(function() {
              if (isValidValue) {
                self2 = jQuery(this);
                for (i = 0; i < classNames.length; i++) {
                  className = classNames[i];
                  if (self2.hasClass(className)) {
                    self2.removeClass(className);
                  } else {
                    self2.addClass(className);
                  }
                }
              } else if (value === void 0 || type === "boolean") {
                className = getClass(this);
                if (className) {
                  dataPriv.set(this, "__className__", className);
                }
                if (this.setAttribute) {
                  this.setAttribute(
                    "class",
                    className || value === false ? "" : dataPriv.get(this, "__className__") || ""
                  );
                }
              }
            });
          },
          hasClass: function(selector) {
            var className, elem, i = 0;
            className = " " + selector + " ";
            while (elem = this[i++]) {
              if (elem.nodeType === 1 && (" " + stripAndCollapse(getClass(elem)) + " ").indexOf(className) > -1) {
                return true;
              }
            }
            return false;
          }
        });
        var rreturn = /\r/g;
        jQuery.fn.extend({
          val: function(value) {
            var hooks, ret, valueIsFunction, elem = this[0];
            if (!arguments.length) {
              if (elem) {
                hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
                if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== void 0) {
                  return ret;
                }
                ret = elem.value;
                if (typeof ret === "string") {
                  return ret.replace(rreturn, "");
                }
                return ret == null ? "" : ret;
              }
              return;
            }
            valueIsFunction = isFunction(value);
            return this.each(function(i) {
              var val;
              if (this.nodeType !== 1) {
                return;
              }
              if (valueIsFunction) {
                val = value.call(this, i, jQuery(this).val());
              } else {
                val = value;
              }
              if (val == null) {
                val = "";
              } else if (typeof val === "number") {
                val += "";
              } else if (Array.isArray(val)) {
                val = jQuery.map(val, function(value2) {
                  return value2 == null ? "" : value2 + "";
                });
              }
              hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
              if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === void 0) {
                this.value = val;
              }
            });
          }
        });
        jQuery.extend({
          valHooks: {
            option: {
              get: function(elem) {
                var val = jQuery.find.attr(elem, "value");
                return val != null ? val : (
                  // Support: IE <=10 - 11 only
                  // option.text throws exceptions (trac-14686, trac-14858)
                  // Strip and collapse whitespace
                  // https://html.spec.whatwg.org/#strip-and-collapse-whitespace
                  stripAndCollapse(jQuery.text(elem))
                );
              }
            },
            select: {
              get: function(elem) {
                var value, option, i, options = elem.options, index = elem.selectedIndex, one = elem.type === "select-one", values = one ? null : [], max2 = one ? index + 1 : options.length;
                if (index < 0) {
                  i = max2;
                } else {
                  i = one ? index : 0;
                }
                for (; i < max2; i++) {
                  option = options[i];
                  if ((option.selected || i === index) && // Don't return options that are disabled or in a disabled optgroup
                  !option.disabled && (!option.parentNode.disabled || !nodeName(option.parentNode, "optgroup"))) {
                    value = jQuery(option).val();
                    if (one) {
                      return value;
                    }
                    values.push(value);
                  }
                }
                return values;
              },
              set: function(elem, value) {
                var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length;
                while (i--) {
                  option = options[i];
                  if (option.selected = jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1) {
                    optionSet = true;
                  }
                }
                if (!optionSet) {
                  elem.selectedIndex = -1;
                }
                return values;
              }
            }
          }
        });
        jQuery.each(["radio", "checkbox"], function() {
          jQuery.valHooks[this] = {
            set: function(elem, value) {
              if (Array.isArray(value)) {
                return elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1;
              }
            }
          };
          if (!support.checkOn) {
            jQuery.valHooks[this].get = function(elem) {
              return elem.getAttribute("value") === null ? "on" : elem.value;
            };
          }
        });
        var location2 = window2.location;
        var nonce = { guid: Date.now() };
        var rquery = /\?/;
        jQuery.parseXML = function(data) {
          var xml, parserErrorElem;
          if (!data || typeof data !== "string") {
            return null;
          }
          try {
            xml = new window2.DOMParser().parseFromString(data, "text/xml");
          } catch (e) {
          }
          parserErrorElem = xml && xml.getElementsByTagName("parsererror")[0];
          if (!xml || parserErrorElem) {
            jQuery.error("Invalid XML: " + (parserErrorElem ? jQuery.map(parserErrorElem.childNodes, function(el) {
              return el.textContent;
            }).join("\n") : data));
          }
          return xml;
        };
        var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, stopPropagationCallback = function(e) {
          e.stopPropagation();
        };
        jQuery.extend(jQuery.event, {
          trigger: function(event, data, elem, onlyHandlers) {
            var i, cur, tmp, bubbleType, ontype, handle, special, lastElement, eventPath = [elem || document2], type = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
            cur = lastElement = tmp = elem = elem || document2;
            if (elem.nodeType === 3 || elem.nodeType === 8) {
              return;
            }
            if (rfocusMorph.test(type + jQuery.event.triggered)) {
              return;
            }
            if (type.indexOf(".") > -1) {
              namespaces = type.split(".");
              type = namespaces.shift();
              namespaces.sort();
            }
            ontype = type.indexOf(":") < 0 && "on" + type;
            event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);
            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join(".");
            event.rnamespace = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
            event.result = void 0;
            if (!event.target) {
              event.target = elem;
            }
            data = data == null ? [event] : jQuery.makeArray(data, [event]);
            special = jQuery.event.special[type] || {};
            if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
              return;
            }
            if (!onlyHandlers && !special.noBubble && !isWindow(elem)) {
              bubbleType = special.delegateType || type;
              if (!rfocusMorph.test(bubbleType + type)) {
                cur = cur.parentNode;
              }
              for (; cur; cur = cur.parentNode) {
                eventPath.push(cur);
                tmp = cur;
              }
              if (tmp === (elem.ownerDocument || document2)) {
                eventPath.push(tmp.defaultView || tmp.parentWindow || window2);
              }
            }
            i = 0;
            while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
              lastElement = cur;
              event.type = i > 1 ? bubbleType : special.bindType || type;
              handle = (dataPriv.get(cur, "events") || /* @__PURE__ */ Object.create(null))[event.type] && dataPriv.get(cur, "handle");
              if (handle) {
                handle.apply(cur, data);
              }
              handle = ontype && cur[ontype];
              if (handle && handle.apply && acceptData(cur)) {
                event.result = handle.apply(cur, data);
                if (event.result === false) {
                  event.preventDefault();
                }
              }
            }
            event.type = type;
            if (!onlyHandlers && !event.isDefaultPrevented()) {
              if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && acceptData(elem)) {
                if (ontype && isFunction(elem[type]) && !isWindow(elem)) {
                  tmp = elem[ontype];
                  if (tmp) {
                    elem[ontype] = null;
                  }
                  jQuery.event.triggered = type;
                  if (event.isPropagationStopped()) {
                    lastElement.addEventListener(type, stopPropagationCallback);
                  }
                  elem[type]();
                  if (event.isPropagationStopped()) {
                    lastElement.removeEventListener(type, stopPropagationCallback);
                  }
                  jQuery.event.triggered = void 0;
                  if (tmp) {
                    elem[ontype] = tmp;
                  }
                }
              }
            }
            return event.result;
          },
          // Piggyback on a donor event to simulate a different one
          // Used only for `focus(in | out)` events
          simulate: function(type, elem, event) {
            var e = jQuery.extend(
              new jQuery.Event(),
              event,
              {
                type,
                isSimulated: true
              }
            );
            jQuery.event.trigger(e, null, elem);
          }
        });
        jQuery.fn.extend({
          trigger: function(type, data) {
            return this.each(function() {
              jQuery.event.trigger(type, data, this);
            });
          },
          triggerHandler: function(type, data) {
            var elem = this[0];
            if (elem) {
              return jQuery.event.trigger(type, data, elem, true);
            }
          }
        });
        var rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
        function buildParams(prefix, obj, traditional, add2) {
          var name;
          if (Array.isArray(obj)) {
            jQuery.each(obj, function(i, v) {
              if (traditional || rbracket.test(prefix)) {
                add2(prefix, v);
              } else {
                buildParams(
                  prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]",
                  v,
                  traditional,
                  add2
                );
              }
            });
          } else if (!traditional && toType(obj) === "object") {
            for (name in obj) {
              buildParams(prefix + "[" + name + "]", obj[name], traditional, add2);
            }
          } else {
            add2(prefix, obj);
          }
        }
        jQuery.param = function(a, traditional) {
          var prefix, s = [], add2 = function(key, valueOrFunction) {
            var value = isFunction(valueOrFunction) ? valueOrFunction() : valueOrFunction;
            s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
          };
          if (a == null) {
            return "";
          }
          if (Array.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
            jQuery.each(a, function() {
              add2(this.name, this.value);
            });
          } else {
            for (prefix in a) {
              buildParams(prefix, a[prefix], traditional, add2);
            }
          }
          return s.join("&");
        };
        jQuery.fn.extend({
          serialize: function() {
            return jQuery.param(this.serializeArray());
          },
          serializeArray: function() {
            return this.map(function() {
              var elements = jQuery.prop(this, "elements");
              return elements ? jQuery.makeArray(elements) : this;
            }).filter(function() {
              var type = this.type;
              return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
            }).map(function(_i, elem) {
              var val = jQuery(this).val();
              if (val == null) {
                return null;
              }
              if (Array.isArray(val)) {
                return jQuery.map(val, function(val2) {
                  return { name: elem.name, value: val2.replace(rCRLF, "\r\n") };
                });
              }
              return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
            }).get();
          }
        });
        var r20 = /%20/g, rhash = /#.*$/, rantiCache = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, prefilters = {}, transports = {}, allTypes = "*/".concat("*"), originAnchor = document2.createElement("a");
        originAnchor.href = location2.href;
        function addToPrefiltersOrTransports(structure) {
          return function(dataTypeExpression, func) {
            if (typeof dataTypeExpression !== "string") {
              func = dataTypeExpression;
              dataTypeExpression = "*";
            }
            var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnothtmlwhite) || [];
            if (isFunction(func)) {
              while (dataType = dataTypes[i++]) {
                if (dataType[0] === "+") {
                  dataType = dataType.slice(1) || "*";
                  (structure[dataType] = structure[dataType] || []).unshift(func);
                } else {
                  (structure[dataType] = structure[dataType] || []).push(func);
                }
              }
            }
          };
        }
        function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
          var inspected = {}, seekingTransport = structure === transports;
          function inspect(dataType) {
            var selected;
            inspected[dataType] = true;
            jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
              var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
              if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
                options.dataTypes.unshift(dataTypeOrTransport);
                inspect(dataTypeOrTransport);
                return false;
              } else if (seekingTransport) {
                return !(selected = dataTypeOrTransport);
              }
            });
            return selected;
          }
          return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
        }
        function ajaxExtend(target, src) {
          var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
          for (key in src) {
            if (src[key] !== void 0) {
              (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
            }
          }
          if (deep) {
            jQuery.extend(true, target, deep);
          }
          return target;
        }
        function ajaxHandleResponses(s, jqXHR, responses) {
          var ct, type, finalDataType, firstDataType, contents = s.contents, dataTypes = s.dataTypes;
          while (dataTypes[0] === "*") {
            dataTypes.shift();
            if (ct === void 0) {
              ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
            }
          }
          if (ct) {
            for (type in contents) {
              if (contents[type] && contents[type].test(ct)) {
                dataTypes.unshift(type);
                break;
              }
            }
          }
          if (dataTypes[0] in responses) {
            finalDataType = dataTypes[0];
          } else {
            for (type in responses) {
              if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                finalDataType = type;
                break;
              }
              if (!firstDataType) {
                firstDataType = type;
              }
            }
            finalDataType = finalDataType || firstDataType;
          }
          if (finalDataType) {
            if (finalDataType !== dataTypes[0]) {
              dataTypes.unshift(finalDataType);
            }
            return responses[finalDataType];
          }
        }
        function ajaxConvert(s, response, jqXHR, isSuccess) {
          var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
          if (dataTypes[1]) {
            for (conv in s.converters) {
              converters[conv.toLowerCase()] = s.converters[conv];
            }
          }
          current = dataTypes.shift();
          while (current) {
            if (s.responseFields[current]) {
              jqXHR[s.responseFields[current]] = response;
            }
            if (!prev && isSuccess && s.dataFilter) {
              response = s.dataFilter(response, s.dataType);
            }
            prev = current;
            current = dataTypes.shift();
            if (current) {
              if (current === "*") {
                current = prev;
              } else if (prev !== "*" && prev !== current) {
                conv = converters[prev + " " + current] || converters["* " + current];
                if (!conv) {
                  for (conv2 in converters) {
                    tmp = conv2.split(" ");
                    if (tmp[1] === current) {
                      conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                      if (conv) {
                        if (conv === true) {
                          conv = converters[conv2];
                        } else if (converters[conv2] !== true) {
                          current = tmp[0];
                          dataTypes.unshift(tmp[1]);
                        }
                        break;
                      }
                    }
                  }
                }
                if (conv !== true) {
                  if (conv && s.throws) {
                    response = conv(response);
                  } else {
                    try {
                      response = conv(response);
                    } catch (e) {
                      return {
                        state: "parsererror",
                        error: conv ? e : "No conversion from " + prev + " to " + current
                      };
                    }
                  }
                }
              }
            }
          }
          return { state: "success", data: response };
        }
        jQuery.extend({
          // Counter for holding the number of active queries
          active: 0,
          // Last-Modified header cache for next request
          lastModified: {},
          etag: {},
          ajaxSettings: {
            url: location2.href,
            type: "GET",
            isLocal: rlocalProtocol.test(location2.protocol),
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            /*
            timeout: 0,
            data: null,
            dataType: null,
            username: null,
            password: null,
            cache: null,
            throws: false,
            traditional: false,
            headers: {},
            */
            accepts: {
              "*": allTypes,
              text: "text/plain",
              html: "text/html",
              xml: "application/xml, text/xml",
              json: "application/json, text/javascript"
            },
            contents: {
              xml: /\bxml\b/,
              html: /\bhtml/,
              json: /\bjson\b/
            },
            responseFields: {
              xml: "responseXML",
              text: "responseText",
              json: "responseJSON"
            },
            // Data converters
            // Keys separate source (or catchall "*") and destination types with a single space
            converters: {
              // Convert anything to text
              "* text": String,
              // Text to html (true = no transformation)
              "text html": true,
              // Evaluate text as a json expression
              "text json": JSON.parse,
              // Parse text as xml
              "text xml": jQuery.parseXML
            },
            // For options that shouldn't be deep extended:
            // you can add your own custom options here if
            // and when you create one that shouldn't be
            // deep extended (see ajaxExtend)
            flatOptions: {
              url: true,
              context: true
            }
          },
          // Creates a full fledged settings object into target
          // with both ajaxSettings and settings fields.
          // If target is omitted, writes into ajaxSettings.
          ajaxSetup: function(target, settings) {
            return settings ? (
              // Building a settings object
              ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings)
            ) : (
              // Extending ajaxSettings
              ajaxExtend(jQuery.ajaxSettings, target)
            );
          },
          ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
          ajaxTransport: addToPrefiltersOrTransports(transports),
          // Main method
          ajax: function(url, options) {
            if (typeof url === "object") {
              options = url;
              url = void 0;
            }
            options = options || {};
            var transport, cacheURL, responseHeadersString, responseHeaders, timeoutTimer, urlAnchor, completed2, fireGlobals, i, uncached, s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, strAbort = "canceled", jqXHR = {
              readyState: 0,
              // Builds headers hashtable if needed
              getResponseHeader: function(key) {
                var match;
                if (completed2) {
                  if (!responseHeaders) {
                    responseHeaders = {};
                    while (match = rheaders.exec(responseHeadersString)) {
                      responseHeaders[match[1].toLowerCase() + " "] = (responseHeaders[match[1].toLowerCase() + " "] || []).concat(match[2]);
                    }
                  }
                  match = responseHeaders[key.toLowerCase() + " "];
                }
                return match == null ? null : match.join(", ");
              },
              // Raw string
              getAllResponseHeaders: function() {
                return completed2 ? responseHeadersString : null;
              },
              // Caches the header
              setRequestHeader: function(name, value) {
                if (completed2 == null) {
                  name = requestHeadersNames[name.toLowerCase()] = requestHeadersNames[name.toLowerCase()] || name;
                  requestHeaders[name] = value;
                }
                return this;
              },
              // Overrides response content-type header
              overrideMimeType: function(type) {
                if (completed2 == null) {
                  s.mimeType = type;
                }
                return this;
              },
              // Status-dependent callbacks
              statusCode: function(map) {
                var code;
                if (map) {
                  if (completed2) {
                    jqXHR.always(map[jqXHR.status]);
                  } else {
                    for (code in map) {
                      statusCode[code] = [statusCode[code], map[code]];
                    }
                  }
                }
                return this;
              },
              // Cancel the request
              abort: function(statusText) {
                var finalText = statusText || strAbort;
                if (transport) {
                  transport.abort(finalText);
                }
                done(0, finalText);
                return this;
              }
            };
            deferred.promise(jqXHR);
            s.url = ((url || s.url || location2.href) + "").replace(rprotocol, location2.protocol + "//");
            s.type = options.method || options.type || s.method || s.type;
            s.dataTypes = (s.dataType || "*").toLowerCase().match(rnothtmlwhite) || [""];
            if (s.crossDomain == null) {
              urlAnchor = document2.createElement("a");
              try {
                urlAnchor.href = s.url;
                urlAnchor.href = urlAnchor.href;
                s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !== urlAnchor.protocol + "//" + urlAnchor.host;
              } catch (e) {
                s.crossDomain = true;
              }
            }
            if (s.data && s.processData && typeof s.data !== "string") {
              s.data = jQuery.param(s.data, s.traditional);
            }
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
            if (completed2) {
              return jqXHR;
            }
            fireGlobals = jQuery.event && s.global;
            if (fireGlobals && jQuery.active++ === 0) {
              jQuery.event.trigger("ajaxStart");
            }
            s.type = s.type.toUpperCase();
            s.hasContent = !rnoContent.test(s.type);
            cacheURL = s.url.replace(rhash, "");
            if (!s.hasContent) {
              uncached = s.url.slice(cacheURL.length);
              if (s.data && (s.processData || typeof s.data === "string")) {
                cacheURL += (rquery.test(cacheURL) ? "&" : "?") + s.data;
                delete s.data;
              }
              if (s.cache === false) {
                cacheURL = cacheURL.replace(rantiCache, "$1");
                uncached = (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce.guid++ + uncached;
              }
              s.url = cacheURL + uncached;
            } else if (s.data && s.processData && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0) {
              s.data = s.data.replace(r20, "+");
            }
            if (s.ifModified) {
              if (jQuery.lastModified[cacheURL]) {
                jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
              }
              if (jQuery.etag[cacheURL]) {
                jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
              }
            }
            if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
              jqXHR.setRequestHeader("Content-Type", s.contentType);
            }
            jqXHR.setRequestHeader(
              "Accept",
              s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]
            );
            for (i in s.headers) {
              jqXHR.setRequestHeader(i, s.headers[i]);
            }
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || completed2)) {
              return jqXHR.abort();
            }
            strAbort = "abort";
            completeDeferred.add(s.complete);
            jqXHR.done(s.success);
            jqXHR.fail(s.error);
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
            if (!transport) {
              done(-1, "No Transport");
            } else {
              jqXHR.readyState = 1;
              if (fireGlobals) {
                globalEventContext.trigger("ajaxSend", [jqXHR, s]);
              }
              if (completed2) {
                return jqXHR;
              }
              if (s.async && s.timeout > 0) {
                timeoutTimer = window2.setTimeout(function() {
                  jqXHR.abort("timeout");
                }, s.timeout);
              }
              try {
                completed2 = false;
                transport.send(requestHeaders, done);
              } catch (e) {
                if (completed2) {
                  throw e;
                }
                done(-1, e);
              }
            }
            function done(status, nativeStatusText, responses, headers) {
              var isSuccess, success, error2, response, modified, statusText = nativeStatusText;
              if (completed2) {
                return;
              }
              completed2 = true;
              if (timeoutTimer) {
                window2.clearTimeout(timeoutTimer);
              }
              transport = void 0;
              responseHeadersString = headers || "";
              jqXHR.readyState = status > 0 ? 4 : 0;
              isSuccess = status >= 200 && status < 300 || status === 304;
              if (responses) {
                response = ajaxHandleResponses(s, jqXHR, responses);
              }
              if (!isSuccess && jQuery.inArray("script", s.dataTypes) > -1 && jQuery.inArray("json", s.dataTypes) < 0) {
                s.converters["text script"] = function() {
                };
              }
              response = ajaxConvert(s, response, jqXHR, isSuccess);
              if (isSuccess) {
                if (s.ifModified) {
                  modified = jqXHR.getResponseHeader("Last-Modified");
                  if (modified) {
                    jQuery.lastModified[cacheURL] = modified;
                  }
                  modified = jqXHR.getResponseHeader("etag");
                  if (modified) {
                    jQuery.etag[cacheURL] = modified;
                  }
                }
                if (status === 204 || s.type === "HEAD") {
                  statusText = "nocontent";
                } else if (status === 304) {
                  statusText = "notmodified";
                } else {
                  statusText = response.state;
                  success = response.data;
                  error2 = response.error;
                  isSuccess = !error2;
                }
              } else {
                error2 = statusText;
                if (status || !statusText) {
                  statusText = "error";
                  if (status < 0) {
                    status = 0;
                  }
                }
              }
              jqXHR.status = status;
              jqXHR.statusText = (nativeStatusText || statusText) + "";
              if (isSuccess) {
                deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
              } else {
                deferred.rejectWith(callbackContext, [jqXHR, statusText, error2]);
              }
              jqXHR.statusCode(statusCode);
              statusCode = void 0;
              if (fireGlobals) {
                globalEventContext.trigger(
                  isSuccess ? "ajaxSuccess" : "ajaxError",
                  [jqXHR, s, isSuccess ? success : error2]
                );
              }
              completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);
              if (fireGlobals) {
                globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
                if (!--jQuery.active) {
                  jQuery.event.trigger("ajaxStop");
                }
              }
            }
            return jqXHR;
          },
          getJSON: function(url, data, callback) {
            return jQuery.get(url, data, callback, "json");
          },
          getScript: function(url, callback) {
            return jQuery.get(url, void 0, callback, "script");
          }
        });
        jQuery.each(["get", "post"], function(_i, method) {
          jQuery[method] = function(url, data, callback, type) {
            if (isFunction(data)) {
              type = type || callback;
              callback = data;
              data = void 0;
            }
            return jQuery.ajax(jQuery.extend({
              url,
              type: method,
              dataType: type,
              data,
              success: callback
            }, jQuery.isPlainObject(url) && url));
          };
        });
        jQuery.ajaxPrefilter(function(s) {
          var i;
          for (i in s.headers) {
            if (i.toLowerCase() === "content-type") {
              s.contentType = s.headers[i] || "";
            }
          }
        });
        jQuery._evalUrl = function(url, options, doc) {
          return jQuery.ajax({
            url,
            // Make this explicit, since user can override this through ajaxSetup (trac-11264)
            type: "GET",
            dataType: "script",
            cache: true,
            async: false,
            global: false,
            // Only evaluate the response if it is successful (gh-4126)
            // dataFilter is not invoked for failure responses, so using it instead
            // of the default converter is kludgy but it works.
            converters: {
              "text script": function() {
              }
            },
            dataFilter: function(response) {
              jQuery.globalEval(response, options, doc);
            }
          });
        };
        jQuery.fn.extend({
          wrapAll: function(html) {
            var wrap;
            if (this[0]) {
              if (isFunction(html)) {
                html = html.call(this[0]);
              }
              wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
              if (this[0].parentNode) {
                wrap.insertBefore(this[0]);
              }
              wrap.map(function() {
                var elem = this;
                while (elem.firstElementChild) {
                  elem = elem.firstElementChild;
                }
                return elem;
              }).append(this);
            }
            return this;
          },
          wrapInner: function(html) {
            if (isFunction(html)) {
              return this.each(function(i) {
                jQuery(this).wrapInner(html.call(this, i));
              });
            }
            return this.each(function() {
              var self2 = jQuery(this), contents = self2.contents();
              if (contents.length) {
                contents.wrapAll(html);
              } else {
                self2.append(html);
              }
            });
          },
          wrap: function(html) {
            var htmlIsFunction = isFunction(html);
            return this.each(function(i) {
              jQuery(this).wrapAll(htmlIsFunction ? html.call(this, i) : html);
            });
          },
          unwrap: function(selector) {
            this.parent(selector).not("body").each(function() {
              jQuery(this).replaceWith(this.childNodes);
            });
            return this;
          }
        });
        jQuery.expr.pseudos.hidden = function(elem) {
          return !jQuery.expr.pseudos.visible(elem);
        };
        jQuery.expr.pseudos.visible = function(elem) {
          return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
        };
        jQuery.ajaxSettings.xhr = function() {
          try {
            return new window2.XMLHttpRequest();
          } catch (e) {
          }
        };
        var xhrSuccessStatus = {
          // File protocol always yields status code 0, assume 200
          0: 200,
          // Support: IE <=9 only
          // trac-1450: sometimes IE returns 1223 when it should be 204
          1223: 204
        }, xhrSupported = jQuery.ajaxSettings.xhr();
        support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
        support.ajax = xhrSupported = !!xhrSupported;
        jQuery.ajaxTransport(function(options) {
          var callback, errorCallback;
          if (support.cors || xhrSupported && !options.crossDomain) {
            return {
              send: function(headers, complete) {
                var i, xhr = options.xhr();
                xhr.open(
                  options.type,
                  options.url,
                  options.async,
                  options.username,
                  options.password
                );
                if (options.xhrFields) {
                  for (i in options.xhrFields) {
                    xhr[i] = options.xhrFields[i];
                  }
                }
                if (options.mimeType && xhr.overrideMimeType) {
                  xhr.overrideMimeType(options.mimeType);
                }
                if (!options.crossDomain && !headers["X-Requested-With"]) {
                  headers["X-Requested-With"] = "XMLHttpRequest";
                }
                for (i in headers) {
                  xhr.setRequestHeader(i, headers[i]);
                }
                callback = function(type) {
                  return function() {
                    if (callback) {
                      callback = errorCallback = xhr.onload = xhr.onerror = xhr.onabort = xhr.ontimeout = xhr.onreadystatechange = null;
                      if (type === "abort") {
                        xhr.abort();
                      } else if (type === "error") {
                        if (typeof xhr.status !== "number") {
                          complete(0, "error");
                        } else {
                          complete(
                            // File: protocol always yields status 0; see trac-8605, trac-14207
                            xhr.status,
                            xhr.statusText
                          );
                        }
                      } else {
                        complete(
                          xhrSuccessStatus[xhr.status] || xhr.status,
                          xhr.statusText,
                          // Support: IE <=9 only
                          // IE9 has no XHR2 but throws on binary (trac-11426)
                          // For XHR2 non-text, let the caller handle it (gh-2498)
                          (xhr.responseType || "text") !== "text" || typeof xhr.responseText !== "string" ? { binary: xhr.response } : { text: xhr.responseText },
                          xhr.getAllResponseHeaders()
                        );
                      }
                    }
                  };
                };
                xhr.onload = callback();
                errorCallback = xhr.onerror = xhr.ontimeout = callback("error");
                if (xhr.onabort !== void 0) {
                  xhr.onabort = errorCallback;
                } else {
                  xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                      window2.setTimeout(function() {
                        if (callback) {
                          errorCallback();
                        }
                      });
                    }
                  };
                }
                callback = callback("abort");
                try {
                  xhr.send(options.hasContent && options.data || null);
                } catch (e) {
                  if (callback) {
                    throw e;
                  }
                }
              },
              abort: function() {
                if (callback) {
                  callback();
                }
              }
            };
          }
        });
        jQuery.ajaxPrefilter(function(s) {
          if (s.crossDomain) {
            s.contents.script = false;
          }
        });
        jQuery.ajaxSetup({
          accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
          },
          contents: {
            script: /\b(?:java|ecma)script\b/
          },
          converters: {
            "text script": function(text) {
              jQuery.globalEval(text);
              return text;
            }
          }
        });
        jQuery.ajaxPrefilter("script", function(s) {
          if (s.cache === void 0) {
            s.cache = false;
          }
          if (s.crossDomain) {
            s.type = "GET";
          }
        });
        jQuery.ajaxTransport("script", function(s) {
          if (s.crossDomain || s.scriptAttrs) {
            var script, callback;
            return {
              send: function(_, complete) {
                script = jQuery("<script>").attr(s.scriptAttrs || {}).prop({ charset: s.scriptCharset, src: s.url }).on("load error", callback = function(evt) {
                  script.remove();
                  callback = null;
                  if (evt) {
                    complete(evt.type === "error" ? 404 : 200, evt.type);
                  }
                });
                document2.head.appendChild(script[0]);
              },
              abort: function() {
                if (callback) {
                  callback();
                }
              }
            };
          }
        });
        var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
        jQuery.ajaxSetup({
          jsonp: "callback",
          jsonpCallback: function() {
            var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce.guid++;
            this[callback] = true;
            return callback;
          }
        });
        jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
          var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && (s.contentType || "").indexOf("application/x-www-form-urlencoded") === 0 && rjsonp.test(s.data) && "data");
          if (jsonProp || s.dataTypes[0] === "jsonp") {
            callbackName = s.jsonpCallback = isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
            if (jsonProp) {
              s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
            } else if (s.jsonp !== false) {
              s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
            }
            s.converters["script json"] = function() {
              if (!responseContainer) {
                jQuery.error(callbackName + " was not called");
              }
              return responseContainer[0];
            };
            s.dataTypes[0] = "json";
            overwritten = window2[callbackName];
            window2[callbackName] = function() {
              responseContainer = arguments;
            };
            jqXHR.always(function() {
              if (overwritten === void 0) {
                jQuery(window2).removeProp(callbackName);
              } else {
                window2[callbackName] = overwritten;
              }
              if (s[callbackName]) {
                s.jsonpCallback = originalSettings.jsonpCallback;
                oldCallbacks.push(callbackName);
              }
              if (responseContainer && isFunction(overwritten)) {
                overwritten(responseContainer[0]);
              }
              responseContainer = overwritten = void 0;
            });
            return "script";
          }
        });
        support.createHTMLDocument = function() {
          var body = document2.implementation.createHTMLDocument("").body;
          body.innerHTML = "<form></form><form></form>";
          return body.childNodes.length === 2;
        }();
        jQuery.parseHTML = function(data, context, keepScripts) {
          if (typeof data !== "string") {
            return [];
          }
          if (typeof context === "boolean") {
            keepScripts = context;
            context = false;
          }
          var base, parsed, scripts;
          if (!context) {
            if (support.createHTMLDocument) {
              context = document2.implementation.createHTMLDocument("");
              base = context.createElement("base");
              base.href = document2.location.href;
              context.head.appendChild(base);
            } else {
              context = document2;
            }
          }
          parsed = rsingleTag.exec(data);
          scripts = !keepScripts && [];
          if (parsed) {
            return [context.createElement(parsed[1])];
          }
          parsed = buildFragment([data], context, scripts);
          if (scripts && scripts.length) {
            jQuery(scripts).remove();
          }
          return jQuery.merge([], parsed.childNodes);
        };
        jQuery.fn.load = function(url, params, callback) {
          var selector, type, response, self2 = this, off = url.indexOf(" ");
          if (off > -1) {
            selector = stripAndCollapse(url.slice(off));
            url = url.slice(0, off);
          }
          if (isFunction(params)) {
            callback = params;
            params = void 0;
          } else if (params && typeof params === "object") {
            type = "POST";
          }
          if (self2.length > 0) {
            jQuery.ajax({
              url,
              // If "type" variable is undefined, then "GET" method will be used.
              // Make value of this field explicit since
              // user can override it through ajaxSetup method
              type: type || "GET",
              dataType: "html",
              data: params
            }).done(function(responseText) {
              response = arguments;
              self2.html(selector ? (
                // If a selector was specified, locate the right elements in a dummy div
                // Exclude scripts to avoid IE 'Permission Denied' errors
                jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector)
              ) : (
                // Otherwise use the full result
                responseText
              ));
            }).always(callback && function(jqXHR, status) {
              self2.each(function() {
                callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
              });
            });
          }
          return this;
        };
        jQuery.expr.pseudos.animated = function(elem) {
          return jQuery.grep(jQuery.timers, function(fn2) {
            return elem === fn2.elem;
          }).length;
        };
        jQuery.offset = {
          setOffset: function(elem, options, i) {
            var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
            if (position === "static") {
              elem.style.position = "relative";
            }
            curOffset = curElem.offset();
            curCSSTop = jQuery.css(elem, "top");
            curCSSLeft = jQuery.css(elem, "left");
            calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;
            if (calculatePosition) {
              curPosition = curElem.position();
              curTop = curPosition.top;
              curLeft = curPosition.left;
            } else {
              curTop = parseFloat(curCSSTop) || 0;
              curLeft = parseFloat(curCSSLeft) || 0;
            }
            if (isFunction(options)) {
              options = options.call(elem, i, jQuery.extend({}, curOffset));
            }
            if (options.top != null) {
              props.top = options.top - curOffset.top + curTop;
            }
            if (options.left != null) {
              props.left = options.left - curOffset.left + curLeft;
            }
            if ("using" in options) {
              options.using.call(elem, props);
            } else {
              curElem.css(props);
            }
          }
        };
        jQuery.fn.extend({
          // offset() relates an element's border box to the document origin
          offset: function(options) {
            if (arguments.length) {
              return options === void 0 ? this : this.each(function(i) {
                jQuery.offset.setOffset(this, options, i);
              });
            }
            var rect, win, elem = this[0];
            if (!elem) {
              return;
            }
            if (!elem.getClientRects().length) {
              return { top: 0, left: 0 };
            }
            rect = elem.getBoundingClientRect();
            win = elem.ownerDocument.defaultView;
            return {
              top: rect.top + win.pageYOffset,
              left: rect.left + win.pageXOffset
            };
          },
          // position() relates an element's margin box to its offset parent's padding box
          // This corresponds to the behavior of CSS absolute positioning
          position: function() {
            if (!this[0]) {
              return;
            }
            var offsetParent, offset2, doc, elem = this[0], parentOffset = { top: 0, left: 0 };
            if (jQuery.css(elem, "position") === "fixed") {
              offset2 = elem.getBoundingClientRect();
            } else {
              offset2 = this.offset();
              doc = elem.ownerDocument;
              offsetParent = elem.offsetParent || doc.documentElement;
              while (offsetParent && (offsetParent === doc.body || offsetParent === doc.documentElement) && jQuery.css(offsetParent, "position") === "static") {
                offsetParent = offsetParent.parentNode;
              }
              if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
                parentOffset = jQuery(offsetParent).offset();
                parentOffset.top += jQuery.css(offsetParent, "borderTopWidth", true);
                parentOffset.left += jQuery.css(offsetParent, "borderLeftWidth", true);
              }
            }
            return {
              top: offset2.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
              left: offset2.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
            };
          },
          // This method will return documentElement in the following cases:
          // 1) For the element inside the iframe without offsetParent, this method will return
          //    documentElement of the parent window
          // 2) For the hidden or detached element
          // 3) For body or html element, i.e. in case of the html node - it will return itself
          //
          // but those exceptions were never presented as a real life use-cases
          // and might be considered as more preferable results.
          //
          // This logic, however, is not guaranteed and can change at any point in the future
          offsetParent: function() {
            return this.map(function() {
              var offsetParent = this.offsetParent;
              while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
                offsetParent = offsetParent.offsetParent;
              }
              return offsetParent || documentElement;
            });
          }
        });
        jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function(method, prop) {
          var top2 = "pageYOffset" === prop;
          jQuery.fn[method] = function(val) {
            return access(this, function(elem, method2, val2) {
              var win;
              if (isWindow(elem)) {
                win = elem;
              } else if (elem.nodeType === 9) {
                win = elem.defaultView;
              }
              if (val2 === void 0) {
                return win ? win[prop] : elem[method2];
              }
              if (win) {
                win.scrollTo(
                  !top2 ? val2 : win.pageXOffset,
                  top2 ? val2 : win.pageYOffset
                );
              } else {
                elem[method2] = val2;
              }
            }, method, val, arguments.length);
          };
        });
        jQuery.each(["top", "left"], function(_i, prop) {
          jQuery.cssHooks[prop] = addGetHookIf(
            support.pixelPosition,
            function(elem, computed) {
              if (computed) {
                computed = curCSS(elem, prop);
                return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
              }
            }
          );
        });
        jQuery.each({ Height: "height", Width: "width" }, function(name, type) {
          jQuery.each({
            padding: "inner" + name,
            content: type,
            "": "outer" + name
          }, function(defaultExtra, funcName) {
            jQuery.fn[funcName] = function(margin, value) {
              var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"), extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
              return access(this, function(elem, type2, value2) {
                var doc;
                if (isWindow(elem)) {
                  return funcName.indexOf("outer") === 0 ? elem["inner" + name] : elem.document.documentElement["client" + name];
                }
                if (elem.nodeType === 9) {
                  doc = elem.documentElement;
                  return Math.max(
                    elem.body["scroll" + name],
                    doc["scroll" + name],
                    elem.body["offset" + name],
                    doc["offset" + name],
                    doc["client" + name]
                  );
                }
                return value2 === void 0 ? (
                  // Get width or height on the element, requesting but not forcing parseFloat
                  jQuery.css(elem, type2, extra)
                ) : (
                  // Set width or height on the element
                  jQuery.style(elem, type2, value2, extra)
                );
              }, type, chainable ? margin : void 0, chainable);
            };
          });
        });
        jQuery.each([
          "ajaxStart",
          "ajaxStop",
          "ajaxComplete",
          "ajaxError",
          "ajaxSuccess",
          "ajaxSend"
        ], function(_i, type) {
          jQuery.fn[type] = function(fn2) {
            return this.on(type, fn2);
          };
        });
        jQuery.fn.extend({
          bind: function(types, data, fn2) {
            return this.on(types, null, data, fn2);
          },
          unbind: function(types, fn2) {
            return this.off(types, null, fn2);
          },
          delegate: function(selector, types, data, fn2) {
            return this.on(types, selector, data, fn2);
          },
          undelegate: function(selector, types, fn2) {
            return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn2);
          },
          hover: function(fnOver, fnOut) {
            return this.on("mouseenter", fnOver).on("mouseleave", fnOut || fnOver);
          }
        });
        jQuery.each(
          "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),
          function(_i, name) {
            jQuery.fn[name] = function(data, fn2) {
              return arguments.length > 0 ? this.on(name, null, data, fn2) : this.trigger(name);
            };
          }
        );
        var rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
        jQuery.proxy = function(fn2, context) {
          var tmp, args, proxy;
          if (typeof context === "string") {
            tmp = fn2[context];
            context = fn2;
            fn2 = tmp;
          }
          if (!isFunction(fn2)) {
            return void 0;
          }
          args = slice.call(arguments, 2);
          proxy = function() {
            return fn2.apply(context || this, args.concat(slice.call(arguments)));
          };
          proxy.guid = fn2.guid = fn2.guid || jQuery.guid++;
          return proxy;
        };
        jQuery.holdReady = function(hold) {
          if (hold) {
            jQuery.readyWait++;
          } else {
            jQuery.ready(true);
          }
        };
        jQuery.isArray = Array.isArray;
        jQuery.parseJSON = JSON.parse;
        jQuery.nodeName = nodeName;
        jQuery.isFunction = isFunction;
        jQuery.isWindow = isWindow;
        jQuery.camelCase = camelCase;
        jQuery.type = toType;
        jQuery.now = Date.now;
        jQuery.isNumeric = function(obj) {
          var type = jQuery.type(obj);
          return (type === "number" || type === "string") && // parseFloat NaNs numeric-cast false positives ("")
          // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
          // subtraction forces infinities to NaN
          !isNaN(obj - parseFloat(obj));
        };
        jQuery.trim = function(text) {
          return text == null ? "" : (text + "").replace(rtrim, "$1");
        };
        if (typeof define === "function" && define.amd) {
          define("jquery", [], function() {
            return jQuery;
          });
        }
        var _jQuery = window2.jQuery, _$ = window2.$;
        jQuery.noConflict = function(deep) {
          if (window2.$ === jQuery) {
            window2.$ = _$;
          }
          if (deep && window2.jQuery === jQuery) {
            window2.jQuery = _jQuery;
          }
          return jQuery;
        };
        if (typeof noGlobal === "undefined") {
          window2.jQuery = window2.$ = jQuery;
        }
        return jQuery;
      });
    }
  });

  // node_modules/tom-select/dist/js/tom-select.complete.js
  var require_tom_select_complete = __commonJS({
    "node_modules/tom-select/dist/js/tom-select.complete.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.TomSelect = factory());
      })(exports, function() {
        "use strict";
        function forEvents(events2, callback) {
          events2.split(/\s+/).forEach((event) => {
            callback(event);
          });
        }
        class MicroEvent {
          constructor() {
            this._events = void 0;
            this._events = {};
          }
          on(events2, fct) {
            forEvents(events2, (event) => {
              const event_array = this._events[event] || [];
              event_array.push(fct);
              this._events[event] = event_array;
            });
          }
          off(events2, fct) {
            var n = arguments.length;
            if (n === 0) {
              this._events = {};
              return;
            }
            forEvents(events2, (event) => {
              if (n === 1) {
                delete this._events[event];
                return;
              }
              const event_array = this._events[event];
              if (event_array === void 0)
                return;
              event_array.splice(event_array.indexOf(fct), 1);
              this._events[event] = event_array;
            });
          }
          trigger(events2, ...args) {
            var self2 = this;
            forEvents(events2, (event) => {
              const event_array = self2._events[event];
              if (event_array === void 0)
                return;
              event_array.forEach((fct) => {
                fct.apply(self2, args);
              });
            });
          }
        }
        function MicroPlugin(Interface) {
          Interface.plugins = {};
          return class extends Interface {
            constructor(...args) {
              super(...args);
              this.plugins = {
                names: [],
                settings: {},
                requested: {},
                loaded: {}
              };
            }
            /**
             * Registers a plugin.
             *
             * @param {function} fn
             */
            static define(name, fn2) {
              Interface.plugins[name] = {
                "name": name,
                "fn": fn2
              };
            }
            /**
             * Initializes the listed plugins (with options).
             * Acceptable formats:
             *
             * List (without options):
             *   ['a', 'b', 'c']
             *
             * List (with options):
             *   [{'name': 'a', options: {}}, {'name': 'b', options: {}}]
             *
             * Hash (with options):
             *   {'a': { ... }, 'b': { ... }, 'c': { ... }}
             *
             * @param {array|object} plugins
             */
            initializePlugins(plugins) {
              var key, name;
              const self2 = this;
              const queue = [];
              if (Array.isArray(plugins)) {
                plugins.forEach((plugin) => {
                  if (typeof plugin === "string") {
                    queue.push(plugin);
                  } else {
                    self2.plugins.settings[plugin.name] = plugin.options;
                    queue.push(plugin.name);
                  }
                });
              } else if (plugins) {
                for (key in plugins) {
                  if (plugins.hasOwnProperty(key)) {
                    self2.plugins.settings[key] = plugins[key];
                    queue.push(key);
                  }
                }
              }
              while (name = queue.shift()) {
                self2.require(name);
              }
            }
            loadPlugin(name) {
              var self2 = this;
              var plugins = self2.plugins;
              var plugin = Interface.plugins[name];
              if (!Interface.plugins.hasOwnProperty(name)) {
                throw new Error('Unable to find "' + name + '" plugin');
              }
              plugins.requested[name] = true;
              plugins.loaded[name] = plugin.fn.apply(self2, [self2.plugins.settings[name] || {}]);
              plugins.names.push(name);
            }
            /**
             * Initializes a plugin.
             *
             */
            require(name) {
              var self2 = this;
              var plugins = self2.plugins;
              if (!self2.plugins.loaded.hasOwnProperty(name)) {
                if (plugins.requested[name]) {
                  throw new Error('Plugin has circular dependency ("' + name + '")');
                }
                self2.loadPlugin(name);
              }
              return plugins.loaded[name];
            }
          };
        }
        const arrayToPattern = (chars) => {
          chars = chars.filter(Boolean);
          if (chars.length < 2) {
            return chars[0] || "";
          }
          return maxValueLength(chars) == 1 ? "[" + chars.join("") + "]" : "(?:" + chars.join("|") + ")";
        };
        const sequencePattern = (array) => {
          if (!hasDuplicates(array)) {
            return array.join("");
          }
          let pattern = "";
          let prev_char_count = 0;
          const prev_pattern = () => {
            if (prev_char_count > 1) {
              pattern += "{" + prev_char_count + "}";
            }
          };
          array.forEach((char, i) => {
            if (char === array[i - 1]) {
              prev_char_count++;
              return;
            }
            prev_pattern();
            pattern += char;
            prev_char_count = 1;
          });
          prev_pattern();
          return pattern;
        };
        const setToPattern = (chars) => {
          let array = toArray(chars);
          return arrayToPattern(array);
        };
        const hasDuplicates = (array) => {
          return new Set(array).size !== array.length;
        };
        const escape_regex = (str) => {
          return (str + "").replace(/([\$\(\)\*\+\.\?\[\]\^\{\|\}\\])/gu, "\\$1");
        };
        const maxValueLength = (array) => {
          return array.reduce((longest, value) => Math.max(longest, unicodeLength(value)), 0);
        };
        const unicodeLength = (str) => {
          return toArray(str).length;
        };
        const toArray = (p) => Array.from(p);
        const allSubstrings = (input) => {
          if (input.length === 1)
            return [[input]];
          let result = [];
          const start3 = input.substring(1);
          const suba = allSubstrings(start3);
          suba.forEach(function(subresult) {
            let tmp = subresult.slice(0);
            tmp[0] = input.charAt(0) + tmp[0];
            result.push(tmp);
            tmp = subresult.slice(0);
            tmp.unshift(input.charAt(0));
            result.push(tmp);
          });
          return result;
        };
        const code_points = [[0, 65535]];
        const accent_pat = "[\u0300-\u036F\xB7\u02BE\u02BC]";
        let unicode_map;
        let multi_char_reg;
        const max_char_length = 3;
        const latin_convert = {};
        const latin_condensed = {
          "/": "\u2044\u2215",
          "0": "\u07C0",
          "a": "\u2C65\u0250\u0251",
          "aa": "\uA733",
          "ae": "\xE6\u01FD\u01E3",
          "ao": "\uA735",
          "au": "\uA737",
          "av": "\uA739\uA73B",
          "ay": "\uA73D",
          "b": "\u0180\u0253\u0183",
          "c": "\uA73F\u0188\u023C\u2184",
          "d": "\u0111\u0257\u0256\u1D05\u018C\uABB7\u0501\u0266",
          "e": "\u025B\u01DD\u1D07\u0247",
          "f": "\uA77C\u0192",
          "g": "\u01E5\u0260\uA7A1\u1D79\uA77F\u0262",
          "h": "\u0127\u2C68\u2C76\u0265",
          "i": "\u0268\u0131",
          "j": "\u0249\u0237",
          "k": "\u0199\u2C6A\uA741\uA743\uA745\uA7A3",
          "l": "\u0142\u019A\u026B\u2C61\uA749\uA747\uA781\u026D",
          "m": "\u0271\u026F\u03FB",
          "n": "\uA7A5\u019E\u0272\uA791\u1D0E\u043B\u0509",
          "o": "\xF8\u01FF\u0254\u0275\uA74B\uA74D\u1D11",
          "oe": "\u0153",
          "oi": "\u01A3",
          "oo": "\uA74F",
          "ou": "\u0223",
          "p": "\u01A5\u1D7D\uA751\uA753\uA755\u03C1",
          "q": "\uA757\uA759\u024B",
          "r": "\u024D\u027D\uA75B\uA7A7\uA783",
          "s": "\xDF\u023F\uA7A9\uA785\u0282",
          "t": "\u0167\u01AD\u0288\u2C66\uA787",
          "th": "\xFE",
          "tz": "\uA729",
          "u": "\u0289",
          "v": "\u028B\uA75F\u028C",
          "vy": "\uA761",
          "w": "\u2C73",
          "y": "\u01B4\u024F\u1EFF",
          "z": "\u01B6\u0225\u0240\u2C6C\uA763",
          "hv": "\u0195"
        };
        for (let latin in latin_condensed) {
          let unicode = latin_condensed[latin] || "";
          for (let i = 0; i < unicode.length; i++) {
            let char = unicode.substring(i, i + 1);
            latin_convert[char] = latin;
          }
        }
        const convert_pat = new RegExp(Object.keys(latin_convert).join("|") + "|" + accent_pat, "gu");
        const initialize = (_code_points) => {
          if (unicode_map !== void 0)
            return;
          unicode_map = generateMap(_code_points || code_points);
        };
        const normalize = (str, form = "NFKD") => str.normalize(form);
        const asciifold = (str) => {
          return toArray(str).reduce(
            /**
             * @param {string} result
             * @param {string} char
             */
            (result, char) => {
              return result + _asciifold(char);
            },
            ""
          );
        };
        const _asciifold = (str) => {
          str = normalize(str).toLowerCase().replace(convert_pat, (char) => {
            return latin_convert[char] || "";
          });
          return normalize(str, "NFC");
        };
        function* generator(code_points2) {
          for (const [code_point_min, code_point_max] of code_points2) {
            for (let i = code_point_min; i <= code_point_max; i++) {
              let composed = String.fromCharCode(i);
              let folded = asciifold(composed);
              if (folded == composed.toLowerCase()) {
                continue;
              }
              if (folded.length > max_char_length) {
                continue;
              }
              if (folded.length == 0) {
                continue;
              }
              yield {
                folded,
                composed,
                code_point: i
              };
            }
          }
        }
        const generateSets = (code_points2) => {
          const unicode_sets = {};
          const addMatching = (folded, to_add) => {
            const folded_set = unicode_sets[folded] || /* @__PURE__ */ new Set();
            const patt = new RegExp("^" + setToPattern(folded_set) + "$", "iu");
            if (to_add.match(patt)) {
              return;
            }
            folded_set.add(escape_regex(to_add));
            unicode_sets[folded] = folded_set;
          };
          for (let value of generator(code_points2)) {
            addMatching(value.folded, value.folded);
            addMatching(value.folded, value.composed);
          }
          return unicode_sets;
        };
        const generateMap = (code_points2) => {
          const unicode_sets = generateSets(code_points2);
          const unicode_map2 = {};
          let multi_char = [];
          for (let folded in unicode_sets) {
            let set = unicode_sets[folded];
            if (set) {
              unicode_map2[folded] = setToPattern(set);
            }
            if (folded.length > 1) {
              multi_char.push(escape_regex(folded));
            }
          }
          multi_char.sort((a, b) => b.length - a.length);
          const multi_char_patt = arrayToPattern(multi_char);
          multi_char_reg = new RegExp("^" + multi_char_patt, "u");
          return unicode_map2;
        };
        const mapSequence = (strings, min_replacement = 1) => {
          let chars_replaced = 0;
          strings = strings.map((str) => {
            if (unicode_map[str]) {
              chars_replaced += str.length;
            }
            return unicode_map[str] || str;
          });
          if (chars_replaced >= min_replacement) {
            return sequencePattern(strings);
          }
          return "";
        };
        const substringsToPattern = (str, min_replacement = 1) => {
          min_replacement = Math.max(min_replacement, str.length - 1);
          return arrayToPattern(allSubstrings(str).map((sub_pat) => {
            return mapSequence(sub_pat, min_replacement);
          }));
        };
        const sequencesToPattern = (sequences, all = true) => {
          let min_replacement = sequences.length > 1 ? 1 : 0;
          return arrayToPattern(sequences.map((sequence) => {
            let seq = [];
            const len = all ? sequence.length() : sequence.length() - 1;
            for (let j = 0; j < len; j++) {
              seq.push(substringsToPattern(sequence.substrs[j] || "", min_replacement));
            }
            return sequencePattern(seq);
          }));
        };
        const inSequences = (needle_seq, sequences) => {
          for (const seq of sequences) {
            if (seq.start != needle_seq.start || seq.end != needle_seq.end) {
              continue;
            }
            if (seq.substrs.join("") !== needle_seq.substrs.join("")) {
              continue;
            }
            let needle_parts = needle_seq.parts;
            const filter = (part) => {
              for (const needle_part of needle_parts) {
                if (needle_part.start === part.start && needle_part.substr === part.substr) {
                  return false;
                }
                if (part.length == 1 || needle_part.length == 1) {
                  continue;
                }
                if (part.start < needle_part.start && part.end > needle_part.start) {
                  return true;
                }
                if (needle_part.start < part.start && needle_part.end > part.start) {
                  return true;
                }
              }
              return false;
            };
            let filtered = seq.parts.filter(filter);
            if (filtered.length > 0) {
              continue;
            }
            return true;
          }
          return false;
        };
        class Sequence {
          constructor() {
            this.parts = [];
            this.substrs = [];
            this.start = 0;
            this.end = 0;
          }
          /**
           * @param {TSequencePart|undefined} part
           */
          add(part) {
            if (part) {
              this.parts.push(part);
              this.substrs.push(part.substr);
              this.start = Math.min(part.start, this.start);
              this.end = Math.max(part.end, this.end);
            }
          }
          last() {
            return this.parts[this.parts.length - 1];
          }
          length() {
            return this.parts.length;
          }
          /**
           * @param {number} position
           * @param {TSequencePart} last_piece
           */
          clone(position, last_piece) {
            let clone = new Sequence();
            let parts = JSON.parse(JSON.stringify(this.parts));
            let last_part = parts.pop();
            for (const part of parts) {
              clone.add(part);
            }
            let last_substr = last_piece.substr.substring(0, position - last_part.start);
            let clone_last_len = last_substr.length;
            clone.add({
              start: last_part.start,
              end: last_part.start + clone_last_len,
              length: clone_last_len,
              substr: last_substr
            });
            return clone;
          }
        }
        const getPattern = (str) => {
          initialize();
          str = asciifold(str);
          let pattern = "";
          let sequences = [new Sequence()];
          for (let i = 0; i < str.length; i++) {
            let substr = str.substring(i);
            let match = substr.match(multi_char_reg);
            const char = str.substring(i, i + 1);
            const match_str = match ? match[0] : null;
            let overlapping = [];
            let added_types = /* @__PURE__ */ new Set();
            for (const sequence of sequences) {
              const last_piece = sequence.last();
              if (!last_piece || last_piece.length == 1 || last_piece.end <= i) {
                if (match_str) {
                  const len = match_str.length;
                  sequence.add({
                    start: i,
                    end: i + len,
                    length: len,
                    substr: match_str
                  });
                  added_types.add("1");
                } else {
                  sequence.add({
                    start: i,
                    end: i + 1,
                    length: 1,
                    substr: char
                  });
                  added_types.add("2");
                }
              } else if (match_str) {
                let clone = sequence.clone(i, last_piece);
                const len = match_str.length;
                clone.add({
                  start: i,
                  end: i + len,
                  length: len,
                  substr: match_str
                });
                overlapping.push(clone);
              } else {
                added_types.add("3");
              }
            }
            if (overlapping.length > 0) {
              overlapping = overlapping.sort((a, b) => {
                return a.length() - b.length();
              });
              for (let clone of overlapping) {
                if (inSequences(clone, sequences)) {
                  continue;
                }
                sequences.push(clone);
              }
              continue;
            }
            if (i > 0 && added_types.size == 1 && !added_types.has("3")) {
              pattern += sequencesToPattern(sequences, false);
              let new_seq = new Sequence();
              const old_seq = sequences[0];
              if (old_seq) {
                new_seq.add(old_seq.last());
              }
              sequences = [new_seq];
            }
          }
          pattern += sequencesToPattern(sequences, true);
          return pattern;
        };
        const getAttr = (obj, name) => {
          if (!obj)
            return;
          return obj[name];
        };
        const getAttrNesting = (obj, name) => {
          if (!obj)
            return;
          var part, names = name.split(".");
          while ((part = names.shift()) && (obj = obj[part]))
            ;
          return obj;
        };
        const scoreValue = (value, token, weight) => {
          var score, pos;
          if (!value)
            return 0;
          value = value + "";
          if (token.regex == null)
            return 0;
          pos = value.search(token.regex);
          if (pos === -1)
            return 0;
          score = token.string.length / value.length;
          if (pos === 0)
            score += 0.5;
          return score * weight;
        };
        const propToArray = (obj, key) => {
          var value = obj[key];
          if (typeof value == "function")
            return value;
          if (value && !Array.isArray(value)) {
            obj[key] = [value];
          }
        };
        const iterate$1 = (object, callback) => {
          if (Array.isArray(object)) {
            object.forEach(callback);
          } else {
            for (var key in object) {
              if (object.hasOwnProperty(key)) {
                callback(object[key], key);
              }
            }
          }
        };
        const cmp = (a, b) => {
          if (typeof a === "number" && typeof b === "number") {
            return a > b ? 1 : a < b ? -1 : 0;
          }
          a = asciifold(a + "").toLowerCase();
          b = asciifold(b + "").toLowerCase();
          if (a > b)
            return 1;
          if (b > a)
            return -1;
          return 0;
        };
        class Sifter {
          // []|{};
          /**
           * Textually searches arrays and hashes of objects
           * by property (or multiple properties). Designed
           * specifically for autocomplete.
           *
           */
          constructor(items, settings) {
            this.items = void 0;
            this.settings = void 0;
            this.items = items;
            this.settings = settings || {
              diacritics: true
            };
          }
          /**
           * Splits a search string into an array of individual
           * regexps to be used to match results.
           *
           */
          tokenize(query, respect_word_boundaries, weights) {
            if (!query || !query.length)
              return [];
            const tokens = [];
            const words = query.split(/\s+/);
            var field_regex;
            if (weights) {
              field_regex = new RegExp("^(" + Object.keys(weights).map(escape_regex).join("|") + "):(.*)$");
            }
            words.forEach((word) => {
              let field_match;
              let field = null;
              let regex = null;
              if (field_regex && (field_match = word.match(field_regex))) {
                field = field_match[1];
                word = field_match[2];
              }
              if (word.length > 0) {
                if (this.settings.diacritics) {
                  regex = getPattern(word) || null;
                } else {
                  regex = escape_regex(word);
                }
                if (regex && respect_word_boundaries)
                  regex = "\\b" + regex;
              }
              tokens.push({
                string: word,
                regex: regex ? new RegExp(regex, "iu") : null,
                field
              });
            });
            return tokens;
          }
          /**
           * Returns a function to be used to score individual results.
           *
           * Good matches will have a higher score than poor matches.
           * If an item is not a match, 0 will be returned by the function.
           *
           * @returns {T.ScoreFn}
           */
          getScoreFunction(query, options) {
            var search = this.prepareSearch(query, options);
            return this._getScoreFunction(search);
          }
          /**
           * @returns {T.ScoreFn}
           *
           */
          _getScoreFunction(search) {
            const tokens = search.tokens, token_count = tokens.length;
            if (!token_count) {
              return function() {
                return 0;
              };
            }
            const fields = search.options.fields, weights = search.weights, field_count = fields.length, getAttrFn = search.getAttrFn;
            if (!field_count) {
              return function() {
                return 1;
              };
            }
            const scoreObject = function() {
              if (field_count === 1) {
                return function(token, data) {
                  const field = fields[0].field;
                  return scoreValue(getAttrFn(data, field), token, weights[field] || 1);
                };
              }
              return function(token, data) {
                var sum = 0;
                if (token.field) {
                  const value = getAttrFn(data, token.field);
                  if (!token.regex && value) {
                    sum += 1 / field_count;
                  } else {
                    sum += scoreValue(value, token, 1);
                  }
                } else {
                  iterate$1(weights, (weight, field) => {
                    sum += scoreValue(getAttrFn(data, field), token, weight);
                  });
                }
                return sum / field_count;
              };
            }();
            if (token_count === 1) {
              return function(data) {
                return scoreObject(tokens[0], data);
              };
            }
            if (search.options.conjunction === "and") {
              return function(data) {
                var score, sum = 0;
                for (let token of tokens) {
                  score = scoreObject(token, data);
                  if (score <= 0)
                    return 0;
                  sum += score;
                }
                return sum / token_count;
              };
            } else {
              return function(data) {
                var sum = 0;
                iterate$1(tokens, (token) => {
                  sum += scoreObject(token, data);
                });
                return sum / token_count;
              };
            }
          }
          /**
           * Returns a function that can be used to compare two
           * results, for sorting purposes. If no sorting should
           * be performed, `null` will be returned.
           *
           * @return function(a,b)
           */
          getSortFunction(query, options) {
            var search = this.prepareSearch(query, options);
            return this._getSortFunction(search);
          }
          _getSortFunction(search) {
            var implicit_score, sort_flds = [];
            const self2 = this, options = search.options, sort = !search.query && options.sort_empty ? options.sort_empty : options.sort;
            if (typeof sort == "function") {
              return sort.bind(this);
            }
            const get_field = function get_field2(name, result) {
              if (name === "$score")
                return result.score;
              return search.getAttrFn(self2.items[result.id], name);
            };
            if (sort) {
              for (let s of sort) {
                if (search.query || s.field !== "$score") {
                  sort_flds.push(s);
                }
              }
            }
            if (search.query) {
              implicit_score = true;
              for (let fld of sort_flds) {
                if (fld.field === "$score") {
                  implicit_score = false;
                  break;
                }
              }
              if (implicit_score) {
                sort_flds.unshift({
                  field: "$score",
                  direction: "desc"
                });
              }
            } else {
              sort_flds = sort_flds.filter((fld) => fld.field !== "$score");
            }
            const sort_flds_count = sort_flds.length;
            if (!sort_flds_count) {
              return null;
            }
            return function(a, b) {
              var result, field;
              for (let sort_fld of sort_flds) {
                field = sort_fld.field;
                let multiplier = sort_fld.direction === "desc" ? -1 : 1;
                result = multiplier * cmp(get_field(field, a), get_field(field, b));
                if (result)
                  return result;
              }
              return 0;
            };
          }
          /**
           * Parses a search query and returns an object
           * with tokens and fields ready to be populated
           * with results.
           *
           */
          prepareSearch(query, optsUser) {
            const weights = {};
            var options = Object.assign({}, optsUser);
            propToArray(options, "sort");
            propToArray(options, "sort_empty");
            if (options.fields) {
              propToArray(options, "fields");
              const fields = [];
              options.fields.forEach((field) => {
                if (typeof field == "string") {
                  field = {
                    field,
                    weight: 1
                  };
                }
                fields.push(field);
                weights[field.field] = "weight" in field ? field.weight : 1;
              });
              options.fields = fields;
            }
            return {
              options,
              query: query.toLowerCase().trim(),
              tokens: this.tokenize(query, options.respect_word_boundaries, weights),
              total: 0,
              items: [],
              weights,
              getAttrFn: options.nesting ? getAttrNesting : getAttr
            };
          }
          /**
           * Searches through all items and returns a sorted array of matches.
           *
           */
          search(query, options) {
            var self2 = this, score, search;
            search = this.prepareSearch(query, options);
            options = search.options;
            query = search.query;
            const fn_score = options.score || self2._getScoreFunction(search);
            if (query.length) {
              iterate$1(self2.items, (item, id) => {
                score = fn_score(item);
                if (options.filter === false || score > 0) {
                  search.items.push({
                    "score": score,
                    "id": id
                  });
                }
              });
            } else {
              iterate$1(self2.items, (_, id) => {
                search.items.push({
                  "score": 1,
                  "id": id
                });
              });
            }
            const fn_sort = self2._getSortFunction(search);
            if (fn_sort)
              search.items.sort(fn_sort);
            search.total = search.items.length;
            if (typeof options.limit === "number") {
              search.items = search.items.slice(0, options.limit);
            }
            return search;
          }
        }
        const iterate = (object, callback) => {
          if (Array.isArray(object)) {
            object.forEach(callback);
          } else {
            for (var key in object) {
              if (object.hasOwnProperty(key)) {
                callback(object[key], key);
              }
            }
          }
        };
        const getDom = (query) => {
          if (query.jquery) {
            return query[0];
          }
          if (query instanceof HTMLElement) {
            return query;
          }
          if (isHtmlString(query)) {
            var tpl = document.createElement("template");
            tpl.innerHTML = query.trim();
            return tpl.content.firstChild;
          }
          return document.querySelector(query);
        };
        const isHtmlString = (arg) => {
          if (typeof arg === "string" && arg.indexOf("<") > -1) {
            return true;
          }
          return false;
        };
        const escapeQuery = (query) => {
          return query.replace(/['"\\]/g, "\\$&");
        };
        const triggerEvent = (dom_el, event_name) => {
          var event = document.createEvent("HTMLEvents");
          event.initEvent(event_name, true, false);
          dom_el.dispatchEvent(event);
        };
        const applyCSS = (dom_el, css) => {
          Object.assign(dom_el.style, css);
        };
        const addClasses = (elmts, ...classes) => {
          var norm_classes = classesArray(classes);
          elmts = castAsArray(elmts);
          elmts.map((el) => {
            norm_classes.map((cls) => {
              el.classList.add(cls);
            });
          });
        };
        const removeClasses = (elmts, ...classes) => {
          var norm_classes = classesArray(classes);
          elmts = castAsArray(elmts);
          elmts.map((el) => {
            norm_classes.map((cls) => {
              el.classList.remove(cls);
            });
          });
        };
        const classesArray = (args) => {
          var classes = [];
          iterate(args, (_classes) => {
            if (typeof _classes === "string") {
              _classes = _classes.trim().split(/[\11\12\14\15\40]/);
            }
            if (Array.isArray(_classes)) {
              classes = classes.concat(_classes);
            }
          });
          return classes.filter(Boolean);
        };
        const castAsArray = (arg) => {
          if (!Array.isArray(arg)) {
            arg = [arg];
          }
          return arg;
        };
        const parentMatch = (target, selector, wrapper) => {
          if (wrapper && !wrapper.contains(target)) {
            return;
          }
          while (target && target.matches) {
            if (target.matches(selector)) {
              return target;
            }
            target = target.parentNode;
          }
        };
        const getTail = (list, direction = 0) => {
          if (direction > 0) {
            return list[list.length - 1];
          }
          return list[0];
        };
        const isEmptyObject = (obj) => {
          return Object.keys(obj).length === 0;
        };
        const nodeIndex = (el, amongst) => {
          if (!el)
            return -1;
          amongst = amongst || el.nodeName;
          var i = 0;
          while (el = el.previousElementSibling) {
            if (el.matches(amongst)) {
              i++;
            }
          }
          return i;
        };
        const setAttr = (el, attrs) => {
          iterate(attrs, (val, attr) => {
            if (val == null) {
              el.removeAttribute(attr);
            } else {
              el.setAttribute(attr, "" + val);
            }
          });
        };
        const replaceNode = (existing, replacement) => {
          if (existing.parentNode)
            existing.parentNode.replaceChild(replacement, existing);
        };
        const highlight = (element, regex) => {
          if (regex === null)
            return;
          if (typeof regex === "string") {
            if (!regex.length)
              return;
            regex = new RegExp(regex, "i");
          }
          const highlightText = (node) => {
            var match = node.data.match(regex);
            if (match && node.data.length > 0) {
              var spannode = document.createElement("span");
              spannode.className = "highlight";
              var middlebit = node.splitText(match.index);
              middlebit.splitText(match[0].length);
              var middleclone = middlebit.cloneNode(true);
              spannode.appendChild(middleclone);
              replaceNode(middlebit, spannode);
              return 1;
            }
            return 0;
          };
          const highlightChildren = (node) => {
            if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName) && (node.className !== "highlight" || node.tagName !== "SPAN")) {
              Array.from(node.childNodes).forEach((element2) => {
                highlightRecursive(element2);
              });
            }
          };
          const highlightRecursive = (node) => {
            if (node.nodeType === 3) {
              return highlightText(node);
            }
            highlightChildren(node);
            return 0;
          };
          highlightRecursive(element);
        };
        const removeHighlight = (el) => {
          var elements = el.querySelectorAll("span.highlight");
          Array.prototype.forEach.call(elements, function(el2) {
            var parent = el2.parentNode;
            parent.replaceChild(el2.firstChild, el2);
            parent.normalize();
          });
        };
        const KEY_A = 65;
        const KEY_RETURN = 13;
        const KEY_ESC = 27;
        const KEY_LEFT = 37;
        const KEY_UP = 38;
        const KEY_RIGHT = 39;
        const KEY_DOWN = 40;
        const KEY_BACKSPACE = 8;
        const KEY_DELETE = 46;
        const KEY_TAB = 9;
        const IS_MAC = typeof navigator === "undefined" ? false : /Mac/.test(navigator.userAgent);
        const KEY_SHORTCUT = IS_MAC ? "metaKey" : "ctrlKey";
        var defaults = {
          options: [],
          optgroups: [],
          plugins: [],
          delimiter: ",",
          splitOn: null,
          // regexp or string for splitting up values from a paste command
          persist: true,
          diacritics: true,
          create: null,
          createOnBlur: false,
          createFilter: null,
          highlight: true,
          openOnFocus: true,
          shouldOpen: null,
          maxOptions: 50,
          maxItems: null,
          hideSelected: null,
          duplicates: false,
          addPrecedence: false,
          selectOnTab: false,
          preload: null,
          allowEmptyOption: false,
          //closeAfterSelect: false,
          loadThrottle: 300,
          loadingClass: "loading",
          dataAttr: null,
          //'data-data',
          optgroupField: "optgroup",
          valueField: "value",
          labelField: "text",
          disabledField: "disabled",
          optgroupLabelField: "label",
          optgroupValueField: "value",
          lockOptgroupOrder: false,
          sortField: "$order",
          searchField: ["text"],
          searchConjunction: "and",
          mode: null,
          wrapperClass: "ts-wrapper",
          controlClass: "ts-control",
          dropdownClass: "ts-dropdown",
          dropdownContentClass: "ts-dropdown-content",
          itemClass: "item",
          optionClass: "option",
          dropdownParent: null,
          controlInput: '<input type="text" autocomplete="off" size="1" />',
          copyClassesToDropdown: false,
          placeholder: null,
          hidePlaceholder: null,
          shouldLoad: function(query) {
            return query.length > 0;
          },
          /*
          load                 : null, // function(query, callback) { ... }
          score                : null, // function(search) { ... }
          onInitialize         : null, // function() { ... }
          onChange             : null, // function(value) { ... }
          onItemAdd            : null, // function(value, $item) { ... }
          onItemRemove         : null, // function(value) { ... }
          onClear              : null, // function() { ... }
          onOptionAdd          : null, // function(value, data) { ... }
          onOptionRemove       : null, // function(value) { ... }
          onOptionClear        : null, // function() { ... }
          onOptionGroupAdd     : null, // function(id, data) { ... }
          onOptionGroupRemove  : null, // function(id) { ... }
          onOptionGroupClear   : null, // function() { ... }
          onDropdownOpen       : null, // function(dropdown) { ... }
          onDropdownClose      : null, // function(dropdown) { ... }
          onType               : null, // function(str) { ... }
          onDelete             : null, // function(values) { ... }
          */
          render: {
            /*
            item: null,
            optgroup: null,
            optgroup_header: null,
            option: null,
            option_create: null
            */
          }
        };
        const hash_key = (value) => {
          if (typeof value === "undefined" || value === null)
            return null;
          return get_hash(value);
        };
        const get_hash = (value) => {
          if (typeof value === "boolean")
            return value ? "1" : "0";
          return value + "";
        };
        const escape_html = (str) => {
          return (str + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        };
        const loadDebounce = (fn2, delay) => {
          var timeout;
          return function(value, callback) {
            var self2 = this;
            if (timeout) {
              self2.loading = Math.max(self2.loading - 1, 0);
              clearTimeout(timeout);
            }
            timeout = setTimeout(function() {
              timeout = null;
              self2.loadedSearches[value] = true;
              fn2.call(self2, value, callback);
            }, delay);
          };
        };
        const debounce_events = (self2, types, fn2) => {
          var type;
          var trigger = self2.trigger;
          var event_args = {};
          self2.trigger = function() {
            var type2 = arguments[0];
            if (types.indexOf(type2) !== -1) {
              event_args[type2] = arguments;
            } else {
              return trigger.apply(self2, arguments);
            }
          };
          fn2.apply(self2, []);
          self2.trigger = trigger;
          for (type of types) {
            if (type in event_args) {
              trigger.apply(self2, event_args[type]);
            }
          }
        };
        const getSelection = (input) => {
          return {
            start: input.selectionStart || 0,
            length: (input.selectionEnd || 0) - (input.selectionStart || 0)
          };
        };
        const preventDefault = (evt, stop = false) => {
          if (evt) {
            evt.preventDefault();
            if (stop) {
              evt.stopPropagation();
            }
          }
        };
        const addEvent = (target, type, callback, options) => {
          target.addEventListener(type, callback, options);
        };
        const isKeyDown = (key_name, evt) => {
          if (!evt) {
            return false;
          }
          if (!evt[key_name]) {
            return false;
          }
          var count = (evt.altKey ? 1 : 0) + (evt.ctrlKey ? 1 : 0) + (evt.shiftKey ? 1 : 0) + (evt.metaKey ? 1 : 0);
          if (count === 1) {
            return true;
          }
          return false;
        };
        const getId = (el, id) => {
          const existing_id = el.getAttribute("id");
          if (existing_id) {
            return existing_id;
          }
          el.setAttribute("id", id);
          return id;
        };
        const addSlashes = (str) => {
          return str.replace(/[\\"']/g, "\\$&");
        };
        const append = (parent, node) => {
          if (node)
            parent.append(node);
        };
        function getSettings(input, settings_user) {
          var settings = Object.assign({}, defaults, settings_user);
          var attr_data = settings.dataAttr;
          var field_label = settings.labelField;
          var field_value = settings.valueField;
          var field_disabled = settings.disabledField;
          var field_optgroup = settings.optgroupField;
          var field_optgroup_label = settings.optgroupLabelField;
          var field_optgroup_value = settings.optgroupValueField;
          var tag_name = input.tagName.toLowerCase();
          var placeholder = input.getAttribute("placeholder") || input.getAttribute("data-placeholder");
          if (!placeholder && !settings.allowEmptyOption) {
            let option = input.querySelector('option[value=""]');
            if (option) {
              placeholder = option.textContent;
            }
          }
          var settings_element = {
            placeholder,
            options: [],
            optgroups: [],
            items: [],
            maxItems: null
          };
          var init_select = () => {
            var tagName;
            var options = settings_element.options;
            var optionsMap = {};
            var group_count = 1;
            var readData = (el) => {
              var data = Object.assign({}, el.dataset);
              var json = attr_data && data[attr_data];
              if (typeof json === "string" && json.length) {
                data = Object.assign(data, JSON.parse(json));
              }
              return data;
            };
            var addOption = (option, group) => {
              var value = hash_key(option.value);
              if (value == null)
                return;
              if (!value && !settings.allowEmptyOption)
                return;
              if (optionsMap.hasOwnProperty(value)) {
                if (group) {
                  var arr = optionsMap[value][field_optgroup];
                  if (!arr) {
                    optionsMap[value][field_optgroup] = group;
                  } else if (!Array.isArray(arr)) {
                    optionsMap[value][field_optgroup] = [arr, group];
                  } else {
                    arr.push(group);
                  }
                }
              } else {
                var option_data = readData(option);
                option_data[field_label] = option_data[field_label] || option.textContent;
                option_data[field_value] = option_data[field_value] || value;
                option_data[field_disabled] = option_data[field_disabled] || option.disabled;
                option_data[field_optgroup] = option_data[field_optgroup] || group;
                option_data.$option = option;
                optionsMap[value] = option_data;
                options.push(option_data);
              }
              if (option.selected) {
                settings_element.items.push(value);
              }
            };
            var addGroup = (optgroup) => {
              var id, optgroup_data;
              optgroup_data = readData(optgroup);
              optgroup_data[field_optgroup_label] = optgroup_data[field_optgroup_label] || optgroup.getAttribute("label") || "";
              optgroup_data[field_optgroup_value] = optgroup_data[field_optgroup_value] || group_count++;
              optgroup_data[field_disabled] = optgroup_data[field_disabled] || optgroup.disabled;
              settings_element.optgroups.push(optgroup_data);
              id = optgroup_data[field_optgroup_value];
              iterate(optgroup.children, (option) => {
                addOption(option, id);
              });
            };
            settings_element.maxItems = input.hasAttribute("multiple") ? null : 1;
            iterate(input.children, (child) => {
              tagName = child.tagName.toLowerCase();
              if (tagName === "optgroup") {
                addGroup(child);
              } else if (tagName === "option") {
                addOption(child);
              }
            });
          };
          var init_textbox = () => {
            const data_raw = input.getAttribute(attr_data);
            if (!data_raw) {
              var value = input.value.trim() || "";
              if (!settings.allowEmptyOption && !value.length)
                return;
              const values = value.split(settings.delimiter);
              iterate(values, (value2) => {
                const option = {};
                option[field_label] = value2;
                option[field_value] = value2;
                settings_element.options.push(option);
              });
              settings_element.items = values;
            } else {
              settings_element.options = JSON.parse(data_raw);
              iterate(settings_element.options, (opt) => {
                settings_element.items.push(opt[field_value]);
              });
            }
          };
          if (tag_name === "select") {
            init_select();
          } else {
            init_textbox();
          }
          return Object.assign({}, defaults, settings_element, settings_user);
        }
        var instance_i = 0;
        class TomSelect3 extends MicroPlugin(MicroEvent) {
          // @deprecated 1.8
          constructor(input_arg, user_settings) {
            super();
            this.control_input = void 0;
            this.wrapper = void 0;
            this.dropdown = void 0;
            this.control = void 0;
            this.dropdown_content = void 0;
            this.focus_node = void 0;
            this.order = 0;
            this.settings = void 0;
            this.input = void 0;
            this.tabIndex = void 0;
            this.is_select_tag = void 0;
            this.rtl = void 0;
            this.inputId = void 0;
            this._destroy = void 0;
            this.sifter = void 0;
            this.isOpen = false;
            this.isDisabled = false;
            this.isRequired = void 0;
            this.isInvalid = false;
            this.isValid = true;
            this.isLocked = false;
            this.isFocused = false;
            this.isInputHidden = false;
            this.isSetup = false;
            this.ignoreFocus = false;
            this.ignoreHover = false;
            this.hasOptions = false;
            this.currentResults = void 0;
            this.lastValue = "";
            this.caretPos = 0;
            this.loading = 0;
            this.loadedSearches = {};
            this.activeOption = null;
            this.activeItems = [];
            this.optgroups = {};
            this.options = {};
            this.userOptions = {};
            this.items = [];
            instance_i++;
            var dir;
            var input = getDom(input_arg);
            if (input.tomselect) {
              throw new Error("Tom Select already initialized on this element");
            }
            input.tomselect = this;
            var computedStyle = window.getComputedStyle && window.getComputedStyle(input, null);
            dir = computedStyle.getPropertyValue("direction");
            const settings = getSettings(input, user_settings);
            this.settings = settings;
            this.input = input;
            this.tabIndex = input.tabIndex || 0;
            this.is_select_tag = input.tagName.toLowerCase() === "select";
            this.rtl = /rtl/i.test(dir);
            this.inputId = getId(input, "tomselect-" + instance_i);
            this.isRequired = input.required;
            this.sifter = new Sifter(this.options, {
              diacritics: settings.diacritics
            });
            settings.mode = settings.mode || (settings.maxItems === 1 ? "single" : "multi");
            if (typeof settings.hideSelected !== "boolean") {
              settings.hideSelected = settings.mode === "multi";
            }
            if (typeof settings.hidePlaceholder !== "boolean") {
              settings.hidePlaceholder = settings.mode !== "multi";
            }
            var filter = settings.createFilter;
            if (typeof filter !== "function") {
              if (typeof filter === "string") {
                filter = new RegExp(filter);
              }
              if (filter instanceof RegExp) {
                settings.createFilter = (input2) => filter.test(input2);
              } else {
                settings.createFilter = (value) => {
                  return this.settings.duplicates || !this.options[value];
                };
              }
            }
            this.initializePlugins(settings.plugins);
            this.setupCallbacks();
            this.setupTemplates();
            const wrapper = getDom("<div>");
            const control = getDom("<div>");
            const dropdown = this._render("dropdown");
            const dropdown_content = getDom(`<div role="listbox" tabindex="-1">`);
            const classes = this.input.getAttribute("class") || "";
            const inputMode = settings.mode;
            var control_input;
            addClasses(wrapper, settings.wrapperClass, classes, inputMode);
            addClasses(control, settings.controlClass);
            append(wrapper, control);
            addClasses(dropdown, settings.dropdownClass, inputMode);
            if (settings.copyClassesToDropdown) {
              addClasses(dropdown, classes);
            }
            addClasses(dropdown_content, settings.dropdownContentClass);
            append(dropdown, dropdown_content);
            getDom(settings.dropdownParent || wrapper).appendChild(dropdown);
            if (isHtmlString(settings.controlInput)) {
              control_input = getDom(settings.controlInput);
              var attrs = ["autocorrect", "autocapitalize", "autocomplete"];
              iterate$1(attrs, (attr) => {
                if (input.getAttribute(attr)) {
                  setAttr(control_input, {
                    [attr]: input.getAttribute(attr)
                  });
                }
              });
              control_input.tabIndex = -1;
              control.appendChild(control_input);
              this.focus_node = control_input;
            } else if (settings.controlInput) {
              control_input = getDom(settings.controlInput);
              this.focus_node = control_input;
            } else {
              control_input = getDom("<input/>");
              this.focus_node = control;
            }
            this.wrapper = wrapper;
            this.dropdown = dropdown;
            this.dropdown_content = dropdown_content;
            this.control = control;
            this.control_input = control_input;
            this.setup();
          }
          /**
           * set up event bindings.
           *
           */
          setup() {
            const self2 = this;
            const settings = self2.settings;
            const control_input = self2.control_input;
            const dropdown = self2.dropdown;
            const dropdown_content = self2.dropdown_content;
            const wrapper = self2.wrapper;
            const control = self2.control;
            const input = self2.input;
            const focus_node = self2.focus_node;
            const passive_event = {
              passive: true
            };
            const listboxId = self2.inputId + "-ts-dropdown";
            setAttr(dropdown_content, {
              id: listboxId
            });
            setAttr(focus_node, {
              role: "combobox",
              "aria-haspopup": "listbox",
              "aria-expanded": "false",
              "aria-controls": listboxId
            });
            const control_id = getId(focus_node, self2.inputId + "-ts-control");
            const query = "label[for='" + escapeQuery(self2.inputId) + "']";
            const label = document.querySelector(query);
            const label_click = self2.focus.bind(self2);
            if (label) {
              addEvent(label, "click", label_click);
              setAttr(label, {
                for: control_id
              });
              const label_id = getId(label, self2.inputId + "-ts-label");
              setAttr(focus_node, {
                "aria-labelledby": label_id
              });
              setAttr(dropdown_content, {
                "aria-labelledby": label_id
              });
            }
            wrapper.style.width = input.style.width;
            if (self2.plugins.names.length) {
              const classes_plugins = "plugin-" + self2.plugins.names.join(" plugin-");
              addClasses([wrapper, dropdown], classes_plugins);
            }
            if ((settings.maxItems === null || settings.maxItems > 1) && self2.is_select_tag) {
              setAttr(input, {
                multiple: "multiple"
              });
            }
            if (settings.placeholder) {
              setAttr(control_input, {
                placeholder: settings.placeholder
              });
            }
            if (!settings.splitOn && settings.delimiter) {
              settings.splitOn = new RegExp("\\s*" + escape_regex(settings.delimiter) + "+\\s*");
            }
            if (settings.load && settings.loadThrottle) {
              settings.load = loadDebounce(settings.load, settings.loadThrottle);
            }
            self2.control_input.type = input.type;
            addEvent(dropdown, "mousemove", () => {
              self2.ignoreHover = false;
            });
            addEvent(dropdown, "mouseenter", (e) => {
              var target_match = parentMatch(e.target, "[data-selectable]", dropdown);
              if (target_match)
                self2.onOptionHover(e, target_match);
            }, {
              capture: true
            });
            addEvent(dropdown, "click", (evt) => {
              const option = parentMatch(evt.target, "[data-selectable]");
              if (option) {
                self2.onOptionSelect(evt, option);
                preventDefault(evt, true);
              }
            });
            addEvent(control, "click", (evt) => {
              var target_match = parentMatch(evt.target, "[data-ts-item]", control);
              if (target_match && self2.onItemSelect(evt, target_match)) {
                preventDefault(evt, true);
                return;
              }
              if (control_input.value != "") {
                return;
              }
              self2.onClick();
              preventDefault(evt, true);
            });
            addEvent(focus_node, "keydown", (e) => self2.onKeyDown(e));
            addEvent(control_input, "keypress", (e) => self2.onKeyPress(e));
            addEvent(control_input, "input", (e) => self2.onInput(e));
            addEvent(focus_node, "blur", (e) => self2.onBlur(e));
            addEvent(focus_node, "focus", (e) => self2.onFocus(e));
            addEvent(control_input, "paste", (e) => self2.onPaste(e));
            const doc_mousedown = (evt) => {
              const target = evt.composedPath()[0];
              if (!wrapper.contains(target) && !dropdown.contains(target)) {
                if (self2.isFocused) {
                  self2.blur();
                }
                self2.inputState();
                return;
              }
              if (target == control_input && self2.isOpen) {
                evt.stopPropagation();
              } else {
                preventDefault(evt, true);
              }
            };
            const win_scroll = () => {
              if (self2.isOpen) {
                self2.positionDropdown();
              }
            };
            addEvent(document, "mousedown", doc_mousedown);
            addEvent(window, "scroll", win_scroll, passive_event);
            addEvent(window, "resize", win_scroll, passive_event);
            this._destroy = () => {
              document.removeEventListener("mousedown", doc_mousedown);
              window.removeEventListener("scroll", win_scroll);
              window.removeEventListener("resize", win_scroll);
              if (label)
                label.removeEventListener("click", label_click);
            };
            this.revertSettings = {
              innerHTML: input.innerHTML,
              tabIndex: input.tabIndex
            };
            input.tabIndex = -1;
            input.insertAdjacentElement("afterend", self2.wrapper);
            self2.sync(false);
            settings.items = [];
            delete settings.optgroups;
            delete settings.options;
            addEvent(input, "invalid", () => {
              if (self2.isValid) {
                self2.isValid = false;
                self2.isInvalid = true;
                self2.refreshState();
              }
            });
            self2.updateOriginalInput();
            self2.refreshItems();
            self2.close(false);
            self2.inputState();
            self2.isSetup = true;
            if (input.disabled) {
              self2.disable();
            } else {
              self2.enable();
            }
            self2.on("change", this.onChange);
            addClasses(input, "tomselected", "ts-hidden-accessible");
            self2.trigger("initialize");
            if (settings.preload === true) {
              self2.preload();
            }
          }
          /**
           * Register options and optgroups
           *
           */
          setupOptions(options = [], optgroups = []) {
            this.addOptions(options);
            iterate$1(optgroups, (optgroup) => {
              this.registerOptionGroup(optgroup);
            });
          }
          /**
           * Sets up default rendering functions.
           */
          setupTemplates() {
            var self2 = this;
            var field_label = self2.settings.labelField;
            var field_optgroup = self2.settings.optgroupLabelField;
            var templates = {
              "optgroup": (data) => {
                let optgroup = document.createElement("div");
                optgroup.className = "optgroup";
                optgroup.appendChild(data.options);
                return optgroup;
              },
              "optgroup_header": (data, escape) => {
                return '<div class="optgroup-header">' + escape(data[field_optgroup]) + "</div>";
              },
              "option": (data, escape) => {
                return "<div>" + escape(data[field_label]) + "</div>";
              },
              "item": (data, escape) => {
                return "<div>" + escape(data[field_label]) + "</div>";
              },
              "option_create": (data, escape) => {
                return '<div class="create">Add <strong>' + escape(data.input) + "</strong>&hellip;</div>";
              },
              "no_results": () => {
                return '<div class="no-results">No results found</div>';
              },
              "loading": () => {
                return '<div class="spinner"></div>';
              },
              "not_loading": () => {
              },
              "dropdown": () => {
                return "<div></div>";
              }
            };
            self2.settings.render = Object.assign({}, templates, self2.settings.render);
          }
          /**
           * Maps fired events to callbacks provided
           * in the settings used when creating the control.
           */
          setupCallbacks() {
            var key, fn2;
            var callbacks = {
              "initialize": "onInitialize",
              "change": "onChange",
              "item_add": "onItemAdd",
              "item_remove": "onItemRemove",
              "item_select": "onItemSelect",
              "clear": "onClear",
              "option_add": "onOptionAdd",
              "option_remove": "onOptionRemove",
              "option_clear": "onOptionClear",
              "optgroup_add": "onOptionGroupAdd",
              "optgroup_remove": "onOptionGroupRemove",
              "optgroup_clear": "onOptionGroupClear",
              "dropdown_open": "onDropdownOpen",
              "dropdown_close": "onDropdownClose",
              "type": "onType",
              "load": "onLoad",
              "focus": "onFocus",
              "blur": "onBlur"
            };
            for (key in callbacks) {
              fn2 = this.settings[callbacks[key]];
              if (fn2)
                this.on(key, fn2);
            }
          }
          /**
           * Sync the Tom Select instance with the original input or select
           *
           */
          sync(get_settings = true) {
            const self2 = this;
            const settings = get_settings ? getSettings(self2.input, {
              delimiter: self2.settings.delimiter
            }) : self2.settings;
            self2.setupOptions(settings.options, settings.optgroups);
            self2.setValue(settings.items || [], true);
            self2.lastQuery = null;
          }
          /**
           * Triggered when the main control element
           * has a click event.
           *
           */
          onClick() {
            var self2 = this;
            if (self2.activeItems.length > 0) {
              self2.clearActiveItems();
              self2.focus();
              return;
            }
            if (self2.isFocused && self2.isOpen) {
              self2.blur();
            } else {
              self2.focus();
            }
          }
          /**
           * @deprecated v1.7
           *
           */
          onMouseDown() {
          }
          /**
           * Triggered when the value of the control has been changed.
           * This should propagate the event to the original DOM
           * input / select element.
           */
          onChange() {
            triggerEvent(this.input, "input");
            triggerEvent(this.input, "change");
          }
          /**
           * Triggered on <input> paste.
           *
           */
          onPaste(e) {
            var self2 = this;
            if (self2.isInputHidden || self2.isLocked) {
              preventDefault(e);
              return;
            }
            if (!self2.settings.splitOn) {
              return;
            }
            setTimeout(() => {
              var pastedText = self2.inputValue();
              if (!pastedText.match(self2.settings.splitOn)) {
                return;
              }
              var splitInput = pastedText.trim().split(self2.settings.splitOn);
              iterate$1(splitInput, (piece) => {
                const hash3 = hash_key(piece);
                if (hash3) {
                  if (this.options[piece]) {
                    self2.addItem(piece);
                  } else {
                    self2.createItem(piece);
                  }
                }
              });
            }, 0);
          }
          /**
           * Triggered on <input> keypress.
           *
           */
          onKeyPress(e) {
            var self2 = this;
            if (self2.isLocked) {
              preventDefault(e);
              return;
            }
            var character = String.fromCharCode(e.keyCode || e.which);
            if (self2.settings.create && self2.settings.mode === "multi" && character === self2.settings.delimiter) {
              self2.createItem();
              preventDefault(e);
              return;
            }
          }
          /**
           * Triggered on <input> keydown.
           *
           */
          onKeyDown(e) {
            var self2 = this;
            self2.ignoreHover = true;
            if (self2.isLocked) {
              if (e.keyCode !== KEY_TAB) {
                preventDefault(e);
              }
              return;
            }
            switch (e.keyCode) {
              case KEY_A:
                if (isKeyDown(KEY_SHORTCUT, e)) {
                  if (self2.control_input.value == "") {
                    preventDefault(e);
                    self2.selectAll();
                    return;
                  }
                }
                break;
              case KEY_ESC:
                if (self2.isOpen) {
                  preventDefault(e, true);
                  self2.close();
                }
                self2.clearActiveItems();
                return;
              case KEY_DOWN:
                if (!self2.isOpen && self2.hasOptions) {
                  self2.open();
                } else if (self2.activeOption) {
                  let next = self2.getAdjacent(self2.activeOption, 1);
                  if (next)
                    self2.setActiveOption(next);
                }
                preventDefault(e);
                return;
              case KEY_UP:
                if (self2.activeOption) {
                  let prev = self2.getAdjacent(self2.activeOption, -1);
                  if (prev)
                    self2.setActiveOption(prev);
                }
                preventDefault(e);
                return;
              case KEY_RETURN:
                if (self2.canSelect(self2.activeOption)) {
                  self2.onOptionSelect(e, self2.activeOption);
                  preventDefault(e);
                } else if (self2.settings.create && self2.createItem()) {
                  preventDefault(e);
                } else if (document.activeElement == self2.control_input && self2.isOpen) {
                  preventDefault(e);
                }
                return;
              case KEY_LEFT:
                self2.advanceSelection(-1, e);
                return;
              case KEY_RIGHT:
                self2.advanceSelection(1, e);
                return;
              case KEY_TAB:
                if (self2.settings.selectOnTab) {
                  if (self2.canSelect(self2.activeOption)) {
                    self2.onOptionSelect(e, self2.activeOption);
                    preventDefault(e);
                  }
                  if (self2.settings.create && self2.createItem()) {
                    preventDefault(e);
                  }
                }
                return;
              case KEY_BACKSPACE:
              case KEY_DELETE:
                self2.deleteSelection(e);
                return;
            }
            if (self2.isInputHidden && !isKeyDown(KEY_SHORTCUT, e)) {
              preventDefault(e);
            }
          }
          /**
           * Triggered on <input> keyup.
           *
           */
          onInput(e) {
            var self2 = this;
            if (self2.isLocked) {
              return;
            }
            var value = self2.inputValue();
            if (self2.lastValue !== value) {
              self2.lastValue = value;
              if (self2.settings.shouldLoad.call(self2, value)) {
                self2.load(value);
              }
              self2.refreshOptions();
              self2.trigger("type", value);
            }
          }
          /**
           * Triggered when the user rolls over
           * an option in the autocomplete dropdown menu.
           *
           */
          onOptionHover(evt, option) {
            if (this.ignoreHover)
              return;
            this.setActiveOption(option, false);
          }
          /**
           * Triggered on <input> focus.
           *
           */
          onFocus(e) {
            var self2 = this;
            var wasFocused = self2.isFocused;
            if (self2.isDisabled) {
              self2.blur();
              preventDefault(e);
              return;
            }
            if (self2.ignoreFocus)
              return;
            self2.isFocused = true;
            if (self2.settings.preload === "focus")
              self2.preload();
            if (!wasFocused)
              self2.trigger("focus");
            if (!self2.activeItems.length) {
              self2.showInput();
              self2.refreshOptions(!!self2.settings.openOnFocus);
            }
            self2.refreshState();
          }
          /**
           * Triggered on <input> blur.
           *
           */
          onBlur(e) {
            if (document.hasFocus() === false)
              return;
            var self2 = this;
            if (!self2.isFocused)
              return;
            self2.isFocused = false;
            self2.ignoreFocus = false;
            var deactivate = () => {
              self2.close();
              self2.setActiveItem();
              self2.setCaret(self2.items.length);
              self2.trigger("blur");
            };
            if (self2.settings.create && self2.settings.createOnBlur) {
              self2.createItem(null, deactivate);
            } else {
              deactivate();
            }
          }
          /**
           * Triggered when the user clicks on an option
           * in the autocomplete dropdown menu.
           *
           */
          onOptionSelect(evt, option) {
            var value, self2 = this;
            if (option.parentElement && option.parentElement.matches("[data-disabled]")) {
              return;
            }
            if (option.classList.contains("create")) {
              self2.createItem(null, () => {
                if (self2.settings.closeAfterSelect) {
                  self2.close();
                }
              });
            } else {
              value = option.dataset.value;
              if (typeof value !== "undefined") {
                self2.lastQuery = null;
                self2.addItem(value);
                if (self2.settings.closeAfterSelect) {
                  self2.close();
                }
                if (!self2.settings.hideSelected && evt.type && /click/.test(evt.type)) {
                  self2.setActiveOption(option);
                }
              }
            }
          }
          /**
           * Return true if the given option can be selected
           *
           */
          canSelect(option) {
            if (this.isOpen && option && this.dropdown_content.contains(option)) {
              return true;
            }
            return false;
          }
          /**
           * Triggered when the user clicks on an item
           * that has been selected.
           *
           */
          onItemSelect(evt, item) {
            var self2 = this;
            if (!self2.isLocked && self2.settings.mode === "multi") {
              preventDefault(evt);
              self2.setActiveItem(item, evt);
              return true;
            }
            return false;
          }
          /**
           * Determines whether or not to invoke
           * the user-provided option provider / loader
           *
           * Note, there is a subtle difference between
           * this.canLoad() and this.settings.shouldLoad();
           *
           *	- settings.shouldLoad() is a user-input validator.
           *	When false is returned, the not_loading template
           *	will be added to the dropdown
           *
           *	- canLoad() is lower level validator that checks
           * 	the Tom Select instance. There is no inherent user
           *	feedback when canLoad returns false
           *
           */
          canLoad(value) {
            if (!this.settings.load)
              return false;
            if (this.loadedSearches.hasOwnProperty(value))
              return false;
            return true;
          }
          /**
           * Invokes the user-provided option provider / loader.
           *
           */
          load(value) {
            const self2 = this;
            if (!self2.canLoad(value))
              return;
            addClasses(self2.wrapper, self2.settings.loadingClass);
            self2.loading++;
            const callback = self2.loadCallback.bind(self2);
            self2.settings.load.call(self2, value, callback);
          }
          /**
           * Invoked by the user-provided option provider
           *
           */
          loadCallback(options, optgroups) {
            const self2 = this;
            self2.loading = Math.max(self2.loading - 1, 0);
            self2.lastQuery = null;
            self2.clearActiveOption();
            self2.setupOptions(options, optgroups);
            self2.refreshOptions(self2.isFocused && !self2.isInputHidden);
            if (!self2.loading) {
              removeClasses(self2.wrapper, self2.settings.loadingClass);
            }
            self2.trigger("load", options, optgroups);
          }
          preload() {
            var classList = this.wrapper.classList;
            if (classList.contains("preloaded"))
              return;
            classList.add("preloaded");
            this.load("");
          }
          /**
           * Sets the input field of the control to the specified value.
           *
           */
          setTextboxValue(value = "") {
            var input = this.control_input;
            var changed = input.value !== value;
            if (changed) {
              input.value = value;
              triggerEvent(input, "update");
              this.lastValue = value;
            }
          }
          /**
           * Returns the value of the control. If multiple items
           * can be selected (e.g. <select multiple>), this returns
           * an array. If only one item can be selected, this
           * returns a string.
           *
           */
          getValue() {
            if (this.is_select_tag && this.input.hasAttribute("multiple")) {
              return this.items;
            }
            return this.items.join(this.settings.delimiter);
          }
          /**
           * Resets the selected items to the given value.
           *
           */
          setValue(value, silent) {
            var events2 = silent ? [] : ["change"];
            debounce_events(this, events2, () => {
              this.clear(silent);
              this.addItems(value, silent);
            });
          }
          /**
           * Resets the number of max items to the given value
           *
           */
          setMaxItems(value) {
            if (value === 0)
              value = null;
            this.settings.maxItems = value;
            this.refreshState();
          }
          /**
           * Sets the selected item.
           *
           */
          setActiveItem(item, e) {
            var self2 = this;
            var eventName;
            var i, begin, end2, swap;
            var last;
            if (self2.settings.mode === "single")
              return;
            if (!item) {
              self2.clearActiveItems();
              if (self2.isFocused) {
                self2.showInput();
              }
              return;
            }
            eventName = e && e.type.toLowerCase();
            if (eventName === "click" && isKeyDown("shiftKey", e) && self2.activeItems.length) {
              last = self2.getLastActive();
              begin = Array.prototype.indexOf.call(self2.control.children, last);
              end2 = Array.prototype.indexOf.call(self2.control.children, item);
              if (begin > end2) {
                swap = begin;
                begin = end2;
                end2 = swap;
              }
              for (i = begin; i <= end2; i++) {
                item = self2.control.children[i];
                if (self2.activeItems.indexOf(item) === -1) {
                  self2.setActiveItemClass(item);
                }
              }
              preventDefault(e);
            } else if (eventName === "click" && isKeyDown(KEY_SHORTCUT, e) || eventName === "keydown" && isKeyDown("shiftKey", e)) {
              if (item.classList.contains("active")) {
                self2.removeActiveItem(item);
              } else {
                self2.setActiveItemClass(item);
              }
            } else {
              self2.clearActiveItems();
              self2.setActiveItemClass(item);
            }
            self2.hideInput();
            if (!self2.isFocused) {
              self2.focus();
            }
          }
          /**
           * Set the active and last-active classes
           *
           */
          setActiveItemClass(item) {
            const self2 = this;
            const last_active = self2.control.querySelector(".last-active");
            if (last_active)
              removeClasses(last_active, "last-active");
            addClasses(item, "active last-active");
            self2.trigger("item_select", item);
            if (self2.activeItems.indexOf(item) == -1) {
              self2.activeItems.push(item);
            }
          }
          /**
           * Remove active item
           *
           */
          removeActiveItem(item) {
            var idx = this.activeItems.indexOf(item);
            this.activeItems.splice(idx, 1);
            removeClasses(item, "active");
          }
          /**
           * Clears all the active items
           *
           */
          clearActiveItems() {
            removeClasses(this.activeItems, "active");
            this.activeItems = [];
          }
          /**
           * Sets the selected item in the dropdown menu
           * of available options.
           *
           */
          setActiveOption(option, scroll = true) {
            if (option === this.activeOption) {
              return;
            }
            this.clearActiveOption();
            if (!option)
              return;
            this.activeOption = option;
            setAttr(this.focus_node, {
              "aria-activedescendant": option.getAttribute("id")
            });
            setAttr(option, {
              "aria-selected": "true"
            });
            addClasses(option, "active");
            if (scroll)
              this.scrollToOption(option);
          }
          /**
           * Sets the dropdown_content scrollTop to display the option
           *
           */
          scrollToOption(option, behavior) {
            if (!option)
              return;
            const content = this.dropdown_content;
            const height_menu = content.clientHeight;
            const scrollTop = content.scrollTop || 0;
            const height_item = option.offsetHeight;
            const y = option.getBoundingClientRect().top - content.getBoundingClientRect().top + scrollTop;
            if (y + height_item > height_menu + scrollTop) {
              this.scroll(y - height_menu + height_item, behavior);
            } else if (y < scrollTop) {
              this.scroll(y, behavior);
            }
          }
          /**
           * Scroll the dropdown to the given position
           *
           */
          scroll(scrollTop, behavior) {
            const content = this.dropdown_content;
            if (behavior) {
              content.style.scrollBehavior = behavior;
            }
            content.scrollTop = scrollTop;
            content.style.scrollBehavior = "";
          }
          /**
           * Clears the active option
           *
           */
          clearActiveOption() {
            if (this.activeOption) {
              removeClasses(this.activeOption, "active");
              setAttr(this.activeOption, {
                "aria-selected": null
              });
            }
            this.activeOption = null;
            setAttr(this.focus_node, {
              "aria-activedescendant": null
            });
          }
          /**
           * Selects all items (CTRL + A).
           */
          selectAll() {
            const self2 = this;
            if (self2.settings.mode === "single")
              return;
            const activeItems = self2.controlChildren();
            if (!activeItems.length)
              return;
            self2.hideInput();
            self2.close();
            self2.activeItems = activeItems;
            iterate$1(activeItems, (item) => {
              self2.setActiveItemClass(item);
            });
          }
          /**
           * Determines if the control_input should be in a hidden or visible state
           *
           */
          inputState() {
            var self2 = this;
            if (!self2.control.contains(self2.control_input))
              return;
            setAttr(self2.control_input, {
              placeholder: self2.settings.placeholder
            });
            if (self2.activeItems.length > 0 || !self2.isFocused && self2.settings.hidePlaceholder && self2.items.length > 0) {
              self2.setTextboxValue();
              self2.isInputHidden = true;
            } else {
              if (self2.settings.hidePlaceholder && self2.items.length > 0) {
                setAttr(self2.control_input, {
                  placeholder: ""
                });
              }
              self2.isInputHidden = false;
            }
            self2.wrapper.classList.toggle("input-hidden", self2.isInputHidden);
          }
          /**
           * Hides the input element out of view, while
           * retaining its focus.
           * @deprecated 1.3
           */
          hideInput() {
            this.inputState();
          }
          /**
           * Restores input visibility.
           * @deprecated 1.3
           */
          showInput() {
            this.inputState();
          }
          /**
           * Get the input value
           */
          inputValue() {
            return this.control_input.value.trim();
          }
          /**
           * Gives the control focus.
           */
          focus() {
            var self2 = this;
            if (self2.isDisabled)
              return;
            self2.ignoreFocus = true;
            if (self2.control_input.offsetWidth) {
              self2.control_input.focus();
            } else {
              self2.focus_node.focus();
            }
            setTimeout(() => {
              self2.ignoreFocus = false;
              self2.onFocus();
            }, 0);
          }
          /**
           * Forces the control out of focus.
           *
           */
          blur() {
            this.focus_node.blur();
            this.onBlur();
          }
          /**
           * Returns a function that scores an object
           * to show how good of a match it is to the
           * provided query.
           *
           * @return {function}
           */
          getScoreFunction(query) {
            return this.sifter.getScoreFunction(query, this.getSearchOptions());
          }
          /**
           * Returns search options for sifter (the system
           * for scoring and sorting results).
           *
           * @see https://github.com/orchidjs/sifter.js
           * @return {object}
           */
          getSearchOptions() {
            var settings = this.settings;
            var sort = settings.sortField;
            if (typeof settings.sortField === "string") {
              sort = [{
                field: settings.sortField
              }];
            }
            return {
              fields: settings.searchField,
              conjunction: settings.searchConjunction,
              sort,
              nesting: settings.nesting
            };
          }
          /**
           * Searches through available options and returns
           * a sorted array of matches.
           *
           */
          search(query) {
            var result, calculateScore;
            var self2 = this;
            var options = this.getSearchOptions();
            if (self2.settings.score) {
              calculateScore = self2.settings.score.call(self2, query);
              if (typeof calculateScore !== "function") {
                throw new Error('Tom Select "score" setting must be a function that returns a function');
              }
            }
            if (query !== self2.lastQuery) {
              self2.lastQuery = query;
              result = self2.sifter.search(query, Object.assign(options, {
                score: calculateScore
              }));
              self2.currentResults = result;
            } else {
              result = Object.assign({}, self2.currentResults);
            }
            if (self2.settings.hideSelected) {
              result.items = result.items.filter((item) => {
                let hashed = hash_key(item.id);
                return !(hashed && self2.items.indexOf(hashed) !== -1);
              });
            }
            return result;
          }
          /**
           * Refreshes the list of available options shown
           * in the autocomplete dropdown menu.
           *
           */
          refreshOptions(triggerDropdown = true) {
            var i, j, k, n, optgroup, optgroups, html, has_create_option, active_group;
            var create;
            const groups = {};
            const groups_order = [];
            var self2 = this;
            var query = self2.inputValue();
            const same_query = query === self2.lastQuery || query == "" && self2.lastQuery == null;
            var results = self2.search(query);
            var active_option = null;
            var show_dropdown = self2.settings.shouldOpen || false;
            var dropdown_content = self2.dropdown_content;
            if (same_query) {
              active_option = self2.activeOption;
              if (active_option) {
                active_group = active_option.closest("[data-group]");
              }
            }
            n = results.items.length;
            if (typeof self2.settings.maxOptions === "number") {
              n = Math.min(n, self2.settings.maxOptions);
            }
            if (n > 0) {
              show_dropdown = true;
            }
            for (i = 0; i < n; i++) {
              let item = results.items[i];
              if (!item)
                continue;
              let opt_value = item.id;
              let option = self2.options[opt_value];
              if (option === void 0)
                continue;
              let opt_hash = get_hash(opt_value);
              let option_el = self2.getOption(opt_hash, true);
              if (!self2.settings.hideSelected) {
                option_el.classList.toggle("selected", self2.items.includes(opt_hash));
              }
              optgroup = option[self2.settings.optgroupField] || "";
              optgroups = Array.isArray(optgroup) ? optgroup : [optgroup];
              for (j = 0, k = optgroups && optgroups.length; j < k; j++) {
                optgroup = optgroups[j];
                if (!self2.optgroups.hasOwnProperty(optgroup)) {
                  optgroup = "";
                }
                let group_fragment = groups[optgroup];
                if (group_fragment === void 0) {
                  group_fragment = document.createDocumentFragment();
                  groups_order.push(optgroup);
                }
                if (j > 0) {
                  option_el = option_el.cloneNode(true);
                  setAttr(option_el, {
                    id: option.$id + "-clone-" + j,
                    "aria-selected": null
                  });
                  option_el.classList.add("ts-cloned");
                  removeClasses(option_el, "active");
                  if (self2.activeOption && self2.activeOption.dataset.value == opt_value) {
                    if (active_group && active_group.dataset.group === optgroup.toString()) {
                      active_option = option_el;
                    }
                  }
                }
                group_fragment.appendChild(option_el);
                groups[optgroup] = group_fragment;
              }
            }
            if (self2.settings.lockOptgroupOrder) {
              groups_order.sort((a, b) => {
                const grp_a = self2.optgroups[a];
                const grp_b = self2.optgroups[b];
                const a_order = grp_a && grp_a.$order || 0;
                const b_order = grp_b && grp_b.$order || 0;
                return a_order - b_order;
              });
            }
            html = document.createDocumentFragment();
            iterate$1(groups_order, (optgroup2) => {
              let group_fragment = groups[optgroup2];
              if (!group_fragment || !group_fragment.children.length)
                return;
              let group_heading = self2.optgroups[optgroup2];
              if (group_heading !== void 0) {
                let group_options = document.createDocumentFragment();
                let header = self2.render("optgroup_header", group_heading);
                append(group_options, header);
                append(group_options, group_fragment);
                let group_html = self2.render("optgroup", {
                  group: group_heading,
                  options: group_options
                });
                append(html, group_html);
              } else {
                append(html, group_fragment);
              }
            });
            dropdown_content.innerHTML = "";
            append(dropdown_content, html);
            if (self2.settings.highlight) {
              removeHighlight(dropdown_content);
              if (results.query.length && results.tokens.length) {
                iterate$1(results.tokens, (tok) => {
                  highlight(dropdown_content, tok.regex);
                });
              }
            }
            var add_template = (template) => {
              let content = self2.render(template, {
                input: query
              });
              if (content) {
                show_dropdown = true;
                dropdown_content.insertBefore(content, dropdown_content.firstChild);
              }
              return content;
            };
            if (self2.loading) {
              add_template("loading");
            } else if (!self2.settings.shouldLoad.call(self2, query)) {
              add_template("not_loading");
            } else if (results.items.length === 0) {
              add_template("no_results");
            }
            has_create_option = self2.canCreate(query);
            if (has_create_option) {
              create = add_template("option_create");
            }
            self2.hasOptions = results.items.length > 0 || has_create_option;
            if (show_dropdown) {
              if (results.items.length > 0) {
                if (!active_option && self2.settings.mode === "single" && self2.items[0] != void 0) {
                  active_option = self2.getOption(self2.items[0]);
                }
                if (!dropdown_content.contains(active_option)) {
                  let active_index = 0;
                  if (create && !self2.settings.addPrecedence) {
                    active_index = 1;
                  }
                  active_option = self2.selectable()[active_index];
                }
              } else if (create) {
                active_option = create;
              }
              if (triggerDropdown && !self2.isOpen) {
                self2.open();
                self2.scrollToOption(active_option, "auto");
              }
              self2.setActiveOption(active_option);
            } else {
              self2.clearActiveOption();
              if (triggerDropdown && self2.isOpen) {
                self2.close(false);
              }
            }
          }
          /**
           * Return list of selectable options
           *
           */
          selectable() {
            return this.dropdown_content.querySelectorAll("[data-selectable]");
          }
          /**
           * Adds an available option. If it already exists,
           * nothing will happen. Note: this does not refresh
           * the options list dropdown (use `refreshOptions`
           * for that).
           *
           * Usage:
           *
           *   this.addOption(data)
           *
           */
          addOption(data, user_created = false) {
            const self2 = this;
            if (Array.isArray(data)) {
              self2.addOptions(data, user_created);
              return false;
            }
            const key = hash_key(data[self2.settings.valueField]);
            if (key === null || self2.options.hasOwnProperty(key)) {
              return false;
            }
            data.$order = data.$order || ++self2.order;
            data.$id = self2.inputId + "-opt-" + data.$order;
            self2.options[key] = data;
            self2.lastQuery = null;
            if (user_created) {
              self2.userOptions[key] = user_created;
              self2.trigger("option_add", key, data);
            }
            return key;
          }
          /**
           * Add multiple options
           *
           */
          addOptions(data, user_created = false) {
            iterate$1(data, (dat) => {
              this.addOption(dat, user_created);
            });
          }
          /**
           * @deprecated 1.7.7
           */
          registerOption(data) {
            return this.addOption(data);
          }
          /**
           * Registers an option group to the pool of option groups.
           *
           * @return {boolean|string}
           */
          registerOptionGroup(data) {
            var key = hash_key(data[this.settings.optgroupValueField]);
            if (key === null)
              return false;
            data.$order = data.$order || ++this.order;
            this.optgroups[key] = data;
            return key;
          }
          /**
           * Registers a new optgroup for options
           * to be bucketed into.
           *
           */
          addOptionGroup(id, data) {
            var hashed_id;
            data[this.settings.optgroupValueField] = id;
            if (hashed_id = this.registerOptionGroup(data)) {
              this.trigger("optgroup_add", hashed_id, data);
            }
          }
          /**
           * Removes an existing option group.
           *
           */
          removeOptionGroup(id) {
            if (this.optgroups.hasOwnProperty(id)) {
              delete this.optgroups[id];
              this.clearCache();
              this.trigger("optgroup_remove", id);
            }
          }
          /**
           * Clears all existing option groups.
           */
          clearOptionGroups() {
            this.optgroups = {};
            this.clearCache();
            this.trigger("optgroup_clear");
          }
          /**
           * Updates an option available for selection. If
           * it is visible in the selected items or options
           * dropdown, it will be re-rendered automatically.
           *
           */
          updateOption(value, data) {
            const self2 = this;
            var item_new;
            var index_item;
            const value_old = hash_key(value);
            const value_new = hash_key(data[self2.settings.valueField]);
            if (value_old === null)
              return;
            const data_old = self2.options[value_old];
            if (data_old == void 0)
              return;
            if (typeof value_new !== "string")
              throw new Error("Value must be set in option data");
            const option = self2.getOption(value_old);
            const item = self2.getItem(value_old);
            data.$order = data.$order || data_old.$order;
            delete self2.options[value_old];
            self2.uncacheValue(value_new);
            self2.options[value_new] = data;
            if (option) {
              if (self2.dropdown_content.contains(option)) {
                const option_new = self2._render("option", data);
                replaceNode(option, option_new);
                if (self2.activeOption === option) {
                  self2.setActiveOption(option_new);
                }
              }
              option.remove();
            }
            if (item) {
              index_item = self2.items.indexOf(value_old);
              if (index_item !== -1) {
                self2.items.splice(index_item, 1, value_new);
              }
              item_new = self2._render("item", data);
              if (item.classList.contains("active"))
                addClasses(item_new, "active");
              replaceNode(item, item_new);
            }
            self2.lastQuery = null;
          }
          /**
           * Removes a single option.
           *
           */
          removeOption(value, silent) {
            const self2 = this;
            value = get_hash(value);
            self2.uncacheValue(value);
            delete self2.userOptions[value];
            delete self2.options[value];
            self2.lastQuery = null;
            self2.trigger("option_remove", value);
            self2.removeItem(value, silent);
          }
          /**
           * Clears all options.
           */
          clearOptions(filter) {
            const boundFilter = (filter || this.clearFilter).bind(this);
            this.loadedSearches = {};
            this.userOptions = {};
            this.clearCache();
            const selected = {};
            iterate$1(this.options, (option, key) => {
              if (boundFilter(option, key)) {
                selected[key] = option;
              }
            });
            this.options = this.sifter.items = selected;
            this.lastQuery = null;
            this.trigger("option_clear");
          }
          /**
           * Used by clearOptions() to decide whether or not an option should be removed
           * Return true to keep an option, false to remove
           *
           */
          clearFilter(option, value) {
            if (this.items.indexOf(value) >= 0) {
              return true;
            }
            return false;
          }
          /**
           * Returns the dom element of the option
           * matching the given value.
           *
           */
          getOption(value, create = false) {
            const hashed = hash_key(value);
            if (hashed === null)
              return null;
            const option = this.options[hashed];
            if (option != void 0) {
              if (option.$div) {
                return option.$div;
              }
              if (create) {
                return this._render("option", option);
              }
            }
            return null;
          }
          /**
           * Returns the dom element of the next or previous dom element of the same type
           * Note: adjacent options may not be adjacent DOM elements (optgroups)
           *
           */
          getAdjacent(option, direction, type = "option") {
            var self2 = this, all;
            if (!option) {
              return null;
            }
            if (type == "item") {
              all = self2.controlChildren();
            } else {
              all = self2.dropdown_content.querySelectorAll("[data-selectable]");
            }
            for (let i = 0; i < all.length; i++) {
              if (all[i] != option) {
                continue;
              }
              if (direction > 0) {
                return all[i + 1];
              }
              return all[i - 1];
            }
            return null;
          }
          /**
           * Returns the dom element of the item
           * matching the given value.
           *
           */
          getItem(item) {
            if (typeof item == "object") {
              return item;
            }
            var value = hash_key(item);
            return value !== null ? this.control.querySelector(`[data-value="${addSlashes(value)}"]`) : null;
          }
          /**
           * "Selects" multiple items at once. Adds them to the list
           * at the current caret position.
           *
           */
          addItems(values, silent) {
            var self2 = this;
            var items = Array.isArray(values) ? values : [values];
            items = items.filter((x) => self2.items.indexOf(x) === -1);
            const last_item = items[items.length - 1];
            items.forEach((item) => {
              self2.isPending = item !== last_item;
              self2.addItem(item, silent);
            });
          }
          /**
           * "Selects" an item. Adds it to the list
           * at the current caret position.
           *
           */
          addItem(value, silent) {
            var events2 = silent ? [] : ["change", "dropdown_close"];
            debounce_events(this, events2, () => {
              var item, wasFull;
              const self2 = this;
              const inputMode = self2.settings.mode;
              const hashed = hash_key(value);
              if (hashed && self2.items.indexOf(hashed) !== -1) {
                if (inputMode === "single") {
                  self2.close();
                }
                if (inputMode === "single" || !self2.settings.duplicates) {
                  return;
                }
              }
              if (hashed === null || !self2.options.hasOwnProperty(hashed))
                return;
              if (inputMode === "single")
                self2.clear(silent);
              if (inputMode === "multi" && self2.isFull())
                return;
              item = self2._render("item", self2.options[hashed]);
              if (self2.control.contains(item)) {
                item = item.cloneNode(true);
              }
              wasFull = self2.isFull();
              self2.items.splice(self2.caretPos, 0, hashed);
              self2.insertAtCaret(item);
              if (self2.isSetup) {
                if (!self2.isPending && self2.settings.hideSelected) {
                  let option = self2.getOption(hashed);
                  let next = self2.getAdjacent(option, 1);
                  if (next) {
                    self2.setActiveOption(next);
                  }
                }
                if (!self2.isPending && !self2.settings.closeAfterSelect) {
                  self2.refreshOptions(self2.isFocused && inputMode !== "single");
                }
                if (self2.settings.closeAfterSelect != false && self2.isFull()) {
                  self2.close();
                } else if (!self2.isPending) {
                  self2.positionDropdown();
                }
                self2.trigger("item_add", hashed, item);
                if (!self2.isPending) {
                  self2.updateOriginalInput({
                    silent
                  });
                }
              }
              if (!self2.isPending || !wasFull && self2.isFull()) {
                self2.inputState();
                self2.refreshState();
              }
            });
          }
          /**
           * Removes the selected item matching
           * the provided value.
           *
           */
          removeItem(item = null, silent) {
            const self2 = this;
            item = self2.getItem(item);
            if (!item)
              return;
            var i, idx;
            const value = item.dataset.value;
            i = nodeIndex(item);
            item.remove();
            if (item.classList.contains("active")) {
              idx = self2.activeItems.indexOf(item);
              self2.activeItems.splice(idx, 1);
              removeClasses(item, "active");
            }
            self2.items.splice(i, 1);
            self2.lastQuery = null;
            if (!self2.settings.persist && self2.userOptions.hasOwnProperty(value)) {
              self2.removeOption(value, silent);
            }
            if (i < self2.caretPos) {
              self2.setCaret(self2.caretPos - 1);
            }
            self2.updateOriginalInput({
              silent
            });
            self2.refreshState();
            self2.positionDropdown();
            self2.trigger("item_remove", value, item);
          }
          /**
           * Invokes the `create` method provided in the
           * TomSelect options that should provide the data
           * for the new item, given the user input.
           *
           * Once this completes, it will be added
           * to the item list.
           *
           */
          createItem(input = null, callback = () => {
          }) {
            if (arguments.length === 3) {
              callback = arguments[2];
            }
            if (typeof callback != "function") {
              callback = () => {
              };
            }
            var self2 = this;
            var caret = self2.caretPos;
            var output;
            input = input || self2.inputValue();
            if (!self2.canCreate(input)) {
              callback();
              return false;
            }
            self2.lock();
            var created = false;
            var create = (data) => {
              self2.unlock();
              if (!data || typeof data !== "object")
                return callback();
              var value = hash_key(data[self2.settings.valueField]);
              if (typeof value !== "string") {
                return callback();
              }
              self2.setTextboxValue();
              self2.addOption(data, true);
              self2.setCaret(caret);
              self2.addItem(value);
              callback(data);
              created = true;
            };
            if (typeof self2.settings.create === "function") {
              output = self2.settings.create.call(this, input, create);
            } else {
              output = {
                [self2.settings.labelField]: input,
                [self2.settings.valueField]: input
              };
            }
            if (!created) {
              create(output);
            }
            return true;
          }
          /**
           * Re-renders the selected item lists.
           */
          refreshItems() {
            var self2 = this;
            self2.lastQuery = null;
            if (self2.isSetup) {
              self2.addItems(self2.items);
            }
            self2.updateOriginalInput();
            self2.refreshState();
          }
          /**
           * Updates all state-dependent attributes
           * and CSS classes.
           */
          refreshState() {
            const self2 = this;
            self2.refreshValidityState();
            const isFull = self2.isFull();
            const isLocked = self2.isLocked;
            self2.wrapper.classList.toggle("rtl", self2.rtl);
            const wrap_classList = self2.wrapper.classList;
            wrap_classList.toggle("focus", self2.isFocused);
            wrap_classList.toggle("disabled", self2.isDisabled);
            wrap_classList.toggle("required", self2.isRequired);
            wrap_classList.toggle("invalid", !self2.isValid);
            wrap_classList.toggle("locked", isLocked);
            wrap_classList.toggle("full", isFull);
            wrap_classList.toggle("input-active", self2.isFocused && !self2.isInputHidden);
            wrap_classList.toggle("dropdown-active", self2.isOpen);
            wrap_classList.toggle("has-options", isEmptyObject(self2.options));
            wrap_classList.toggle("has-items", self2.items.length > 0);
          }
          /**
           * Update the `required` attribute of both input and control input.
           *
           * The `required` property needs to be activated on the control input
           * for the error to be displayed at the right place. `required` also
           * needs to be temporarily deactivated on the input since the input is
           * hidden and can't show errors.
           */
          refreshValidityState() {
            var self2 = this;
            if (!self2.input.validity) {
              return;
            }
            self2.isValid = self2.input.validity.valid;
            self2.isInvalid = !self2.isValid;
          }
          /**
           * Determines whether or not more items can be added
           * to the control without exceeding the user-defined maximum.
           *
           * @returns {boolean}
           */
          isFull() {
            return this.settings.maxItems !== null && this.items.length >= this.settings.maxItems;
          }
          /**
           * Refreshes the original <select> or <input>
           * element to reflect the current state.
           *
           */
          updateOriginalInput(opts = {}) {
            const self2 = this;
            var option, label;
            const empty_option = self2.input.querySelector('option[value=""]');
            if (self2.is_select_tag) {
              let AddSelected = function(option_el, value, label2) {
                if (!option_el) {
                  option_el = getDom('<option value="' + escape_html(value) + '">' + escape_html(label2) + "</option>");
                }
                if (option_el != empty_option) {
                  self2.input.append(option_el);
                }
                selected.push(option_el);
                if (option_el != empty_option || has_selected > 0) {
                  option_el.selected = true;
                }
                return option_el;
              };
              const selected = [];
              const has_selected = self2.input.querySelectorAll("option:checked").length;
              self2.input.querySelectorAll("option:checked").forEach((option_el) => {
                option_el.selected = false;
              });
              if (self2.items.length == 0 && self2.settings.mode == "single") {
                AddSelected(empty_option, "", "");
              } else {
                self2.items.forEach((value) => {
                  option = self2.options[value];
                  label = option[self2.settings.labelField] || "";
                  if (selected.includes(option.$option)) {
                    const reuse_opt = self2.input.querySelector(`option[value="${addSlashes(value)}"]:not(:checked)`);
                    AddSelected(reuse_opt, value, label);
                  } else {
                    option.$option = AddSelected(option.$option, value, label);
                  }
                });
              }
            } else {
              self2.input.value = self2.getValue();
            }
            if (self2.isSetup) {
              if (!opts.silent) {
                self2.trigger("change", self2.getValue());
              }
            }
          }
          /**
           * Shows the autocomplete dropdown containing
           * the available options.
           */
          open() {
            var self2 = this;
            if (self2.isLocked || self2.isOpen || self2.settings.mode === "multi" && self2.isFull())
              return;
            self2.isOpen = true;
            setAttr(self2.focus_node, {
              "aria-expanded": "true"
            });
            self2.refreshState();
            applyCSS(self2.dropdown, {
              visibility: "hidden",
              display: "block"
            });
            self2.positionDropdown();
            applyCSS(self2.dropdown, {
              visibility: "visible",
              display: "block"
            });
            self2.focus();
            self2.trigger("dropdown_open", self2.dropdown);
          }
          /**
           * Closes the autocomplete dropdown menu.
           */
          close(setTextboxValue = true) {
            var self2 = this;
            var trigger = self2.isOpen;
            if (setTextboxValue) {
              self2.setTextboxValue();
              if (self2.settings.mode === "single" && self2.items.length) {
                self2.hideInput();
              }
            }
            self2.isOpen = false;
            setAttr(self2.focus_node, {
              "aria-expanded": "false"
            });
            applyCSS(self2.dropdown, {
              display: "none"
            });
            if (self2.settings.hideSelected) {
              self2.clearActiveOption();
            }
            self2.refreshState();
            if (trigger)
              self2.trigger("dropdown_close", self2.dropdown);
          }
          /**
           * Calculates and applies the appropriate
           * position of the dropdown if dropdownParent = 'body'.
           * Otherwise, position is determined by css
           */
          positionDropdown() {
            if (this.settings.dropdownParent !== "body") {
              return;
            }
            var context = this.control;
            var rect = context.getBoundingClientRect();
            var top2 = context.offsetHeight + rect.top + window.scrollY;
            var left2 = rect.left + window.scrollX;
            applyCSS(this.dropdown, {
              width: rect.width + "px",
              top: top2 + "px",
              left: left2 + "px"
            });
          }
          /**
           * Resets / clears all selected items
           * from the control.
           *
           */
          clear(silent) {
            var self2 = this;
            if (!self2.items.length)
              return;
            var items = self2.controlChildren();
            iterate$1(items, (item) => {
              self2.removeItem(item, true);
            });
            self2.showInput();
            if (!silent)
              self2.updateOriginalInput();
            self2.trigger("clear");
          }
          /**
           * A helper method for inserting an element
           * at the current caret position.
           *
           */
          insertAtCaret(el) {
            const self2 = this;
            const caret = self2.caretPos;
            const target = self2.control;
            target.insertBefore(el, target.children[caret] || null);
            self2.setCaret(caret + 1);
          }
          /**
           * Removes the current selected item(s).
           *
           */
          deleteSelection(e) {
            var direction, selection, caret, tail;
            var self2 = this;
            direction = e && e.keyCode === KEY_BACKSPACE ? -1 : 1;
            selection = getSelection(self2.control_input);
            const rm_items = [];
            if (self2.activeItems.length) {
              tail = getTail(self2.activeItems, direction);
              caret = nodeIndex(tail);
              if (direction > 0) {
                caret++;
              }
              iterate$1(self2.activeItems, (item) => rm_items.push(item));
            } else if ((self2.isFocused || self2.settings.mode === "single") && self2.items.length) {
              const items = self2.controlChildren();
              let rm_item;
              if (direction < 0 && selection.start === 0 && selection.length === 0) {
                rm_item = items[self2.caretPos - 1];
              } else if (direction > 0 && selection.start === self2.inputValue().length) {
                rm_item = items[self2.caretPos];
              }
              if (rm_item !== void 0) {
                rm_items.push(rm_item);
              }
            }
            if (!self2.shouldDelete(rm_items, e)) {
              return false;
            }
            preventDefault(e, true);
            if (typeof caret !== "undefined") {
              self2.setCaret(caret);
            }
            while (rm_items.length) {
              self2.removeItem(rm_items.pop());
            }
            self2.showInput();
            self2.positionDropdown();
            self2.refreshOptions(false);
            return true;
          }
          /**
           * Return true if the items should be deleted
           */
          shouldDelete(items, evt) {
            const values = items.map((item) => item.dataset.value);
            if (!values.length || typeof this.settings.onDelete === "function" && this.settings.onDelete(values, evt) === false) {
              return false;
            }
            return true;
          }
          /**
           * Selects the previous / next item (depending on the `direction` argument).
           *
           * > 0 - right
           * < 0 - left
           *
           */
          advanceSelection(direction, e) {
            var last_active, adjacent, self2 = this;
            if (self2.rtl)
              direction *= -1;
            if (self2.inputValue().length)
              return;
            if (isKeyDown(KEY_SHORTCUT, e) || isKeyDown("shiftKey", e)) {
              last_active = self2.getLastActive(direction);
              if (last_active) {
                if (!last_active.classList.contains("active")) {
                  adjacent = last_active;
                } else {
                  adjacent = self2.getAdjacent(last_active, direction, "item");
                }
              } else if (direction > 0) {
                adjacent = self2.control_input.nextElementSibling;
              } else {
                adjacent = self2.control_input.previousElementSibling;
              }
              if (adjacent) {
                if (adjacent.classList.contains("active")) {
                  self2.removeActiveItem(last_active);
                }
                self2.setActiveItemClass(adjacent);
              }
            } else {
              self2.moveCaret(direction);
            }
          }
          moveCaret(direction) {
          }
          /**
           * Get the last active item
           *
           */
          getLastActive(direction) {
            let last_active = this.control.querySelector(".last-active");
            if (last_active) {
              return last_active;
            }
            var result = this.control.querySelectorAll(".active");
            if (result) {
              return getTail(result, direction);
            }
          }
          /**
           * Moves the caret to the specified index.
           *
           * The input must be moved by leaving it in place and moving the
           * siblings, due to the fact that focus cannot be restored once lost
           * on mobile webkit devices
           *
           */
          setCaret(new_pos) {
            this.caretPos = this.items.length;
          }
          /**
           * Return list of item dom elements
           *
           */
          controlChildren() {
            return Array.from(this.control.querySelectorAll("[data-ts-item]"));
          }
          /**
           * Disables user input on the control. Used while
           * items are being asynchronously created.
           */
          lock() {
            this.isLocked = true;
            this.refreshState();
          }
          /**
           * Re-enables user input on the control.
           */
          unlock() {
            this.isLocked = false;
            this.refreshState();
          }
          /**
           * Disables user input on the control completely.
           * While disabled, it cannot receive focus.
           */
          disable() {
            var self2 = this;
            self2.input.disabled = true;
            self2.control_input.disabled = true;
            self2.focus_node.tabIndex = -1;
            self2.isDisabled = true;
            this.close();
            self2.lock();
          }
          /**
           * Enables the control so that it can respond
           * to focus and user input.
           */
          enable() {
            var self2 = this;
            self2.input.disabled = false;
            self2.control_input.disabled = false;
            self2.focus_node.tabIndex = self2.tabIndex;
            self2.isDisabled = false;
            self2.unlock();
          }
          /**
           * Completely destroys the control and
           * unbinds all event listeners so that it can
           * be garbage collected.
           */
          destroy() {
            var self2 = this;
            var revertSettings = self2.revertSettings;
            self2.trigger("destroy");
            self2.off();
            self2.wrapper.remove();
            self2.dropdown.remove();
            self2.input.innerHTML = revertSettings.innerHTML;
            self2.input.tabIndex = revertSettings.tabIndex;
            removeClasses(self2.input, "tomselected", "ts-hidden-accessible");
            self2._destroy();
            delete self2.input.tomselect;
          }
          /**
           * A helper method for rendering "item" and
           * "option" templates, given the data.
           *
           */
          render(templateName, data) {
            var id, html;
            const self2 = this;
            if (typeof this.settings.render[templateName] !== "function") {
              return null;
            }
            html = self2.settings.render[templateName].call(this, data, escape_html);
            if (!html) {
              return null;
            }
            html = getDom(html);
            if (templateName === "option" || templateName === "option_create") {
              if (data[self2.settings.disabledField]) {
                setAttr(html, {
                  "aria-disabled": "true"
                });
              } else {
                setAttr(html, {
                  "data-selectable": ""
                });
              }
            } else if (templateName === "optgroup") {
              id = data.group[self2.settings.optgroupValueField];
              setAttr(html, {
                "data-group": id
              });
              if (data.group[self2.settings.disabledField]) {
                setAttr(html, {
                  "data-disabled": ""
                });
              }
            }
            if (templateName === "option" || templateName === "item") {
              const value = get_hash(data[self2.settings.valueField]);
              setAttr(html, {
                "data-value": value
              });
              if (templateName === "item") {
                addClasses(html, self2.settings.itemClass);
                setAttr(html, {
                  "data-ts-item": ""
                });
              } else {
                addClasses(html, self2.settings.optionClass);
                setAttr(html, {
                  role: "option",
                  id: data.$id
                });
                data.$div = html;
                self2.options[value] = data;
              }
            }
            return html;
          }
          /**
           * Type guarded rendering
           *
           */
          _render(templateName, data) {
            const html = this.render(templateName, data);
            if (html == null) {
              throw "HTMLElement expected";
            }
            return html;
          }
          /**
           * Clears the render cache for a template. If
           * no template is given, clears all render
           * caches.
           *
           */
          clearCache() {
            iterate$1(this.options, (option) => {
              if (option.$div) {
                option.$div.remove();
                delete option.$div;
              }
            });
          }
          /**
           * Removes a value from item and option caches
           *
           */
          uncacheValue(value) {
            const option_el = this.getOption(value);
            if (option_el)
              option_el.remove();
          }
          /**
           * Determines whether or not to display the
           * create item prompt, given a user input.
           *
           */
          canCreate(input) {
            return this.settings.create && input.length > 0 && this.settings.createFilter.call(this, input);
          }
          /**
           * Wraps this.`method` so that `new_fn` can be invoked 'before', 'after', or 'instead' of the original method
           *
           * this.hook('instead','onKeyDown',function( arg1, arg2 ...){
           *
           * });
           */
          hook(when, method, new_fn) {
            var self2 = this;
            var orig_method = self2[method];
            self2[method] = function() {
              var result, result_new;
              if (when === "after") {
                result = orig_method.apply(self2, arguments);
              }
              result_new = new_fn.apply(self2, arguments);
              if (when === "instead") {
                return result_new;
              }
              if (when === "before") {
                result = orig_method.apply(self2, arguments);
              }
              return result;
            };
          }
        }
        function change_listener() {
          addEvent(this.input, "change", () => {
            this.sync();
          });
        }
        function checkbox_options() {
          var self2 = this;
          var orig_onOptionSelect = self2.onOptionSelect;
          self2.settings.hideSelected = false;
          var UpdateCheckbox = function UpdateCheckbox2(option) {
            setTimeout(() => {
              var checkbox = option.querySelector("input");
              if (checkbox instanceof HTMLInputElement) {
                if (option.classList.contains("selected")) {
                  checkbox.checked = true;
                } else {
                  checkbox.checked = false;
                }
              }
            }, 1);
          };
          self2.hook("after", "setupTemplates", () => {
            var orig_render_option = self2.settings.render.option;
            self2.settings.render.option = (data, escape_html2) => {
              var rendered = getDom(orig_render_option.call(self2, data, escape_html2));
              var checkbox = document.createElement("input");
              checkbox.addEventListener("click", function(evt) {
                preventDefault(evt);
              });
              checkbox.type = "checkbox";
              const hashed = hash_key(data[self2.settings.valueField]);
              if (hashed && self2.items.indexOf(hashed) > -1) {
                checkbox.checked = true;
              }
              rendered.prepend(checkbox);
              return rendered;
            };
          });
          self2.on("item_remove", (value) => {
            var option = self2.getOption(value);
            if (option) {
              option.classList.remove("selected");
              UpdateCheckbox(option);
            }
          });
          self2.on("item_add", (value) => {
            var option = self2.getOption(value);
            if (option) {
              UpdateCheckbox(option);
            }
          });
          self2.hook("instead", "onOptionSelect", (evt, option) => {
            if (option.classList.contains("selected")) {
              option.classList.remove("selected");
              self2.removeItem(option.dataset.value);
              self2.refreshOptions();
              preventDefault(evt, true);
              return;
            }
            orig_onOptionSelect.call(self2, evt, option);
            UpdateCheckbox(option);
          });
        }
        function clear_button(userOptions) {
          const self2 = this;
          const options = Object.assign({
            className: "clear-button",
            title: "Clear All",
            html: (data) => {
              return `<div class="${data.className}" title="${data.title}">&#10799;</div>`;
            }
          }, userOptions);
          self2.on("initialize", () => {
            var button = getDom(options.html(options));
            button.addEventListener("click", (evt) => {
              if (self2.isDisabled) {
                return;
              }
              self2.clear();
              if (self2.settings.mode === "single" && self2.settings.allowEmptyOption) {
                self2.addItem("");
              }
              evt.preventDefault();
              evt.stopPropagation();
            });
            self2.control.appendChild(button);
          });
        }
        function drag_drop() {
          var self2 = this;
          if (!$.fn.sortable)
            throw new Error('The "drag_drop" plugin requires jQuery UI "sortable".');
          if (self2.settings.mode !== "multi")
            return;
          var orig_lock = self2.lock;
          var orig_unlock = self2.unlock;
          self2.hook("instead", "lock", () => {
            var sortable = $(self2.control).data("sortable");
            if (sortable)
              sortable.disable();
            return orig_lock.call(self2);
          });
          self2.hook("instead", "unlock", () => {
            var sortable = $(self2.control).data("sortable");
            if (sortable)
              sortable.enable();
            return orig_unlock.call(self2);
          });
          self2.on("initialize", () => {
            var $control = $(self2.control).sortable({
              items: "[data-value]",
              forcePlaceholderSize: true,
              disabled: self2.isLocked,
              start: (e, ui) => {
                ui.placeholder.css("width", ui.helper.css("width"));
                $control.css({
                  overflow: "visible"
                });
              },
              stop: () => {
                $control.css({
                  overflow: "hidden"
                });
                var values = [];
                $control.children("[data-value]").each(function() {
                  if (this.dataset.value)
                    values.push(this.dataset.value);
                });
                self2.setValue(values);
              }
            });
          });
        }
        function dropdown_header(userOptions) {
          const self2 = this;
          const options = Object.assign({
            title: "Untitled",
            headerClass: "dropdown-header",
            titleRowClass: "dropdown-header-title",
            labelClass: "dropdown-header-label",
            closeClass: "dropdown-header-close",
            html: (data) => {
              return '<div class="' + data.headerClass + '"><div class="' + data.titleRowClass + '"><span class="' + data.labelClass + '">' + data.title + '</span><a class="' + data.closeClass + '">&times;</a></div></div>';
            }
          }, userOptions);
          self2.on("initialize", () => {
            var header = getDom(options.html(options));
            var close_link = header.querySelector("." + options.closeClass);
            if (close_link) {
              close_link.addEventListener("click", (evt) => {
                preventDefault(evt, true);
                self2.close();
              });
            }
            self2.dropdown.insertBefore(header, self2.dropdown.firstChild);
          });
        }
        function caret_position() {
          var self2 = this;
          self2.hook("instead", "setCaret", (new_pos) => {
            if (self2.settings.mode === "single" || !self2.control.contains(self2.control_input)) {
              new_pos = self2.items.length;
            } else {
              new_pos = Math.max(0, Math.min(self2.items.length, new_pos));
              if (new_pos != self2.caretPos && !self2.isPending) {
                self2.controlChildren().forEach((child, j) => {
                  if (j < new_pos) {
                    self2.control_input.insertAdjacentElement("beforebegin", child);
                  } else {
                    self2.control.appendChild(child);
                  }
                });
              }
            }
            self2.caretPos = new_pos;
          });
          self2.hook("instead", "moveCaret", (direction) => {
            if (!self2.isFocused)
              return;
            const last_active = self2.getLastActive(direction);
            if (last_active) {
              const idx = nodeIndex(last_active);
              self2.setCaret(direction > 0 ? idx + 1 : idx);
              self2.setActiveItem();
              removeClasses(last_active, "last-active");
            } else {
              self2.setCaret(self2.caretPos + direction);
            }
          });
        }
        function dropdown_input() {
          const self2 = this;
          self2.settings.shouldOpen = true;
          self2.hook("before", "setup", () => {
            self2.focus_node = self2.control;
            addClasses(self2.control_input, "dropdown-input");
            const div = getDom('<div class="dropdown-input-wrap">');
            div.append(self2.control_input);
            self2.dropdown.insertBefore(div, self2.dropdown.firstChild);
            const placeholder = getDom('<input class="items-placeholder" tabindex="-1" />');
            placeholder.placeholder = self2.settings.placeholder || "";
            self2.control.append(placeholder);
          });
          self2.on("initialize", () => {
            self2.control_input.addEventListener("keydown", (evt) => {
              switch (evt.keyCode) {
                case KEY_ESC:
                  if (self2.isOpen) {
                    preventDefault(evt, true);
                    self2.close();
                  }
                  self2.clearActiveItems();
                  return;
                case KEY_TAB:
                  self2.focus_node.tabIndex = -1;
                  break;
              }
              return self2.onKeyDown.call(self2, evt);
            });
            self2.on("blur", () => {
              self2.focus_node.tabIndex = self2.isDisabled ? -1 : self2.tabIndex;
            });
            self2.on("dropdown_open", () => {
              self2.control_input.focus();
            });
            const orig_onBlur = self2.onBlur;
            self2.hook("instead", "onBlur", (evt) => {
              if (evt && evt.relatedTarget == self2.control_input)
                return;
              return orig_onBlur.call(self2);
            });
            addEvent(self2.control_input, "blur", () => self2.onBlur());
            self2.hook("before", "close", () => {
              if (!self2.isOpen)
                return;
              self2.focus_node.focus({
                preventScroll: true
              });
            });
          });
        }
        function input_autogrow() {
          var self2 = this;
          self2.on("initialize", () => {
            var test_input = document.createElement("span");
            var control = self2.control_input;
            test_input.style.cssText = "position:absolute; top:-99999px; left:-99999px; width:auto; padding:0; white-space:pre; ";
            self2.wrapper.appendChild(test_input);
            var transfer_styles = ["letterSpacing", "fontSize", "fontFamily", "fontWeight", "textTransform"];
            for (const style_name of transfer_styles) {
              test_input.style[style_name] = control.style[style_name];
            }
            var resize = () => {
              test_input.textContent = control.value;
              control.style.width = test_input.clientWidth + "px";
            };
            resize();
            self2.on("update item_add item_remove", resize);
            addEvent(control, "input", resize);
            addEvent(control, "keyup", resize);
            addEvent(control, "blur", resize);
            addEvent(control, "update", resize);
          });
        }
        function no_backspace_delete() {
          var self2 = this;
          var orig_deleteSelection = self2.deleteSelection;
          this.hook("instead", "deleteSelection", (evt) => {
            if (self2.activeItems.length) {
              return orig_deleteSelection.call(self2, evt);
            }
            return false;
          });
        }
        function no_active_items() {
          this.hook("instead", "setActiveItem", () => {
          });
          this.hook("instead", "selectAll", () => {
          });
        }
        function optgroup_columns() {
          var self2 = this;
          var orig_keydown = self2.onKeyDown;
          self2.hook("instead", "onKeyDown", (evt) => {
            var index, option, options, optgroup;
            if (!self2.isOpen || !(evt.keyCode === KEY_LEFT || evt.keyCode === KEY_RIGHT)) {
              return orig_keydown.call(self2, evt);
            }
            self2.ignoreHover = true;
            optgroup = parentMatch(self2.activeOption, "[data-group]");
            index = nodeIndex(self2.activeOption, "[data-selectable]");
            if (!optgroup) {
              return;
            }
            if (evt.keyCode === KEY_LEFT) {
              optgroup = optgroup.previousSibling;
            } else {
              optgroup = optgroup.nextSibling;
            }
            if (!optgroup) {
              return;
            }
            options = optgroup.querySelectorAll("[data-selectable]");
            option = options[Math.min(options.length - 1, index)];
            if (option) {
              self2.setActiveOption(option);
            }
          });
        }
        function remove_button(userOptions) {
          const options = Object.assign({
            label: "&times;",
            title: "Remove",
            className: "remove",
            append: true
          }, userOptions);
          var self2 = this;
          if (!options.append) {
            return;
          }
          var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + "</a>";
          self2.hook("after", "setupTemplates", () => {
            var orig_render_item = self2.settings.render.item;
            self2.settings.render.item = (data, escape) => {
              var item = getDom(orig_render_item.call(self2, data, escape));
              var close_button = getDom(html);
              item.appendChild(close_button);
              addEvent(close_button, "mousedown", (evt) => {
                preventDefault(evt, true);
              });
              addEvent(close_button, "click", (evt) => {
                preventDefault(evt, true);
                if (self2.isLocked)
                  return;
                if (!self2.shouldDelete([item], evt))
                  return;
                self2.removeItem(item);
                self2.refreshOptions(false);
                self2.inputState();
              });
              return item;
            };
          });
        }
        function restore_on_backspace(userOptions) {
          const self2 = this;
          const options = Object.assign({
            text: (option) => {
              return option[self2.settings.labelField];
            }
          }, userOptions);
          self2.on("item_remove", function(value) {
            if (!self2.isFocused) {
              return;
            }
            if (self2.control_input.value.trim() === "") {
              var option = self2.options[value];
              if (option) {
                self2.setTextboxValue(options.text.call(self2, option));
              }
            }
          });
        }
        function virtual_scroll() {
          const self2 = this;
          const orig_canLoad = self2.canLoad;
          const orig_clearActiveOption = self2.clearActiveOption;
          const orig_loadCallback = self2.loadCallback;
          var pagination = {};
          var dropdown_content;
          var loading_more = false;
          var load_more_opt;
          var default_values = [];
          if (!self2.settings.shouldLoadMore) {
            self2.settings.shouldLoadMore = () => {
              const scroll_percent = dropdown_content.clientHeight / (dropdown_content.scrollHeight - dropdown_content.scrollTop);
              if (scroll_percent > 0.9) {
                return true;
              }
              if (self2.activeOption) {
                var selectable = self2.selectable();
                var index = Array.from(selectable).indexOf(self2.activeOption);
                if (index >= selectable.length - 2) {
                  return true;
                }
              }
              return false;
            };
          }
          if (!self2.settings.firstUrl) {
            throw "virtual_scroll plugin requires a firstUrl() method";
          }
          self2.settings.sortField = [{
            field: "$order"
          }, {
            field: "$score"
          }];
          const canLoadMore = (query) => {
            if (typeof self2.settings.maxOptions === "number" && dropdown_content.children.length >= self2.settings.maxOptions) {
              return false;
            }
            if (query in pagination && pagination[query]) {
              return true;
            }
            return false;
          };
          const clearFilter = (option, value) => {
            if (self2.items.indexOf(value) >= 0 || default_values.indexOf(value) >= 0) {
              return true;
            }
            return false;
          };
          self2.setNextUrl = (value, next_url) => {
            pagination[value] = next_url;
          };
          self2.getUrl = (query) => {
            if (query in pagination) {
              const next_url = pagination[query];
              pagination[query] = false;
              return next_url;
            }
            pagination = {};
            return self2.settings.firstUrl.call(self2, query);
          };
          self2.hook("instead", "clearActiveOption", () => {
            if (loading_more) {
              return;
            }
            return orig_clearActiveOption.call(self2);
          });
          self2.hook("instead", "canLoad", (query) => {
            if (!(query in pagination)) {
              return orig_canLoad.call(self2, query);
            }
            return canLoadMore(query);
          });
          self2.hook("instead", "loadCallback", (options, optgroups) => {
            if (!loading_more) {
              self2.clearOptions(clearFilter);
            } else if (load_more_opt) {
              const first_option = options[0];
              if (first_option !== void 0) {
                load_more_opt.dataset.value = first_option[self2.settings.valueField];
              }
            }
            orig_loadCallback.call(self2, options, optgroups);
            loading_more = false;
          });
          self2.hook("after", "refreshOptions", () => {
            const query = self2.lastValue;
            var option;
            if (canLoadMore(query)) {
              option = self2.render("loading_more", {
                query
              });
              if (option) {
                option.setAttribute("data-selectable", "");
                load_more_opt = option;
              }
            } else if (query in pagination && !dropdown_content.querySelector(".no-results")) {
              option = self2.render("no_more_results", {
                query
              });
            }
            if (option) {
              addClasses(option, self2.settings.optionClass);
              dropdown_content.append(option);
            }
          });
          self2.on("initialize", () => {
            default_values = Object.keys(self2.options);
            dropdown_content = self2.dropdown_content;
            self2.settings.render = Object.assign({}, {
              loading_more: () => {
                return `<div class="loading-more-results">Loading more results ... </div>`;
              },
              no_more_results: () => {
                return `<div class="no-more-results">No more results</div>`;
              }
            }, self2.settings.render);
            dropdown_content.addEventListener("scroll", () => {
              if (!self2.settings.shouldLoadMore.call(self2)) {
                return;
              }
              if (!canLoadMore(self2.lastValue)) {
                return;
              }
              if (loading_more)
                return;
              loading_more = true;
              self2.load.call(self2, self2.lastValue);
            });
          });
        }
        TomSelect3.define("change_listener", change_listener);
        TomSelect3.define("checkbox_options", checkbox_options);
        TomSelect3.define("clear_button", clear_button);
        TomSelect3.define("drag_drop", drag_drop);
        TomSelect3.define("dropdown_header", dropdown_header);
        TomSelect3.define("caret_position", caret_position);
        TomSelect3.define("dropdown_input", dropdown_input);
        TomSelect3.define("input_autogrow", input_autogrow);
        TomSelect3.define("no_backspace_delete", no_backspace_delete);
        TomSelect3.define("no_active_items", no_active_items);
        TomSelect3.define("optgroup_columns", optgroup_columns);
        TomSelect3.define("remove_button", remove_button);
        TomSelect3.define("restore_on_backspace", restore_on_backspace);
        TomSelect3.define("virtual_scroll", virtual_scroll);
        return TomSelect3;
      });
    }
  });

  // node_modules/flowbite/dist/flowbite.turbo.js
  var require_flowbite_turbo = __commonJS({
    "node_modules/flowbite/dist/flowbite.turbo.js"(exports, module) {
      (function webpackUniversalModuleDefinition(root, factory) {
        if (typeof exports === "object" && typeof module === "object")
          module.exports = factory();
        else if (typeof define === "function" && define.amd)
          define("Flowbite", [], factory);
        else if (typeof exports === "object")
          exports["Flowbite"] = factory();
        else
          root["Flowbite"] = factory();
      })(self, function() {
        return (
          /******/
          function() {
            "use strict";
            var __webpack_modules__ = {
              /***/
              853: (
                /***/
                function(__unused_webpack_module, __webpack_exports__2, __webpack_require__2) {
                  __webpack_require__2.r(__webpack_exports__2);
                  __webpack_require__2.d(__webpack_exports__2, {
                    "afterMain": function() {
                      return (
                        /* reexport */
                        afterMain2
                      );
                    },
                    "afterRead": function() {
                      return (
                        /* reexport */
                        afterRead2
                      );
                    },
                    "afterWrite": function() {
                      return (
                        /* reexport */
                        afterWrite2
                      );
                    },
                    "applyStyles": function() {
                      return (
                        /* reexport */
                        modifiers_applyStyles
                      );
                    },
                    "arrow": function() {
                      return (
                        /* reexport */
                        modifiers_arrow
                      );
                    },
                    "auto": function() {
                      return (
                        /* reexport */
                        auto2
                      );
                    },
                    "basePlacements": function() {
                      return (
                        /* reexport */
                        basePlacements2
                      );
                    },
                    "beforeMain": function() {
                      return (
                        /* reexport */
                        beforeMain2
                      );
                    },
                    "beforeRead": function() {
                      return (
                        /* reexport */
                        beforeRead2
                      );
                    },
                    "beforeWrite": function() {
                      return (
                        /* reexport */
                        beforeWrite2
                      );
                    },
                    "bottom": function() {
                      return (
                        /* reexport */
                        bottom2
                      );
                    },
                    "clippingParents": function() {
                      return (
                        /* reexport */
                        clippingParents2
                      );
                    },
                    "computeStyles": function() {
                      return (
                        /* reexport */
                        modifiers_computeStyles
                      );
                    },
                    "createPopper": function() {
                      return (
                        /* reexport */
                        popper_createPopper
                      );
                    },
                    "createPopperBase": function() {
                      return (
                        /* reexport */
                        createPopper2
                      );
                    },
                    "createPopperLite": function() {
                      return (
                        /* reexport */
                        popper_lite_createPopper
                      );
                    },
                    "detectOverflow": function() {
                      return (
                        /* reexport */
                        detectOverflow2
                      );
                    },
                    "end": function() {
                      return (
                        /* reexport */
                        end2
                      );
                    },
                    "eventListeners": function() {
                      return (
                        /* reexport */
                        eventListeners
                      );
                    },
                    "flip": function() {
                      return (
                        /* reexport */
                        modifiers_flip
                      );
                    },
                    "hide": function() {
                      return (
                        /* reexport */
                        modifiers_hide
                      );
                    },
                    "left": function() {
                      return (
                        /* reexport */
                        left2
                      );
                    },
                    "main": function() {
                      return (
                        /* reexport */
                        main2
                      );
                    },
                    "modifierPhases": function() {
                      return (
                        /* reexport */
                        modifierPhases2
                      );
                    },
                    "offset": function() {
                      return (
                        /* reexport */
                        modifiers_offset
                      );
                    },
                    "placements": function() {
                      return (
                        /* reexport */
                        enums_placements
                      );
                    },
                    "popper": function() {
                      return (
                        /* reexport */
                        popper2
                      );
                    },
                    "popperGenerator": function() {
                      return (
                        /* reexport */
                        popperGenerator2
                      );
                    },
                    "popperOffsets": function() {
                      return (
                        /* reexport */
                        modifiers_popperOffsets
                      );
                    },
                    "preventOverflow": function() {
                      return (
                        /* reexport */
                        modifiers_preventOverflow
                      );
                    },
                    "read": function() {
                      return (
                        /* reexport */
                        read2
                      );
                    },
                    "reference": function() {
                      return (
                        /* reexport */
                        reference2
                      );
                    },
                    "right": function() {
                      return (
                        /* reexport */
                        right2
                      );
                    },
                    "start": function() {
                      return (
                        /* reexport */
                        start3
                      );
                    },
                    "top": function() {
                      return (
                        /* reexport */
                        enums_top
                      );
                    },
                    "variationPlacements": function() {
                      return (
                        /* reexport */
                        variationPlacements2
                      );
                    },
                    "viewport": function() {
                      return (
                        /* reexport */
                        viewport2
                      );
                    },
                    "write": function() {
                      return (
                        /* reexport */
                        write2
                      );
                    }
                  });
                  ;
                  var enums_top = "top";
                  var bottom2 = "bottom";
                  var right2 = "right";
                  var left2 = "left";
                  var auto2 = "auto";
                  var basePlacements2 = [enums_top, bottom2, right2, left2];
                  var start3 = "start";
                  var end2 = "end";
                  var clippingParents2 = "clippingParents";
                  var viewport2 = "viewport";
                  var popper2 = "popper";
                  var reference2 = "reference";
                  var variationPlacements2 = /* @__PURE__ */ basePlacements2.reduce(function(acc, placement) {
                    return acc.concat([placement + "-" + start3, placement + "-" + end2]);
                  }, []);
                  var enums_placements = /* @__PURE__ */ [].concat(basePlacements2, [auto2]).reduce(function(acc, placement) {
                    return acc.concat([placement, placement + "-" + start3, placement + "-" + end2]);
                  }, []);
                  var beforeRead2 = "beforeRead";
                  var read2 = "read";
                  var afterRead2 = "afterRead";
                  var beforeMain2 = "beforeMain";
                  var main2 = "main";
                  var afterMain2 = "afterMain";
                  var beforeWrite2 = "beforeWrite";
                  var write2 = "write";
                  var afterWrite2 = "afterWrite";
                  var modifierPhases2 = [beforeRead2, read2, afterRead2, beforeMain2, main2, afterMain2, beforeWrite2, write2, afterWrite2];
                  ;
                  function getNodeName2(element) {
                    return element ? (element.nodeName || "").toLowerCase() : null;
                  }
                  ;
                  function getWindow2(node) {
                    if (node == null) {
                      return window;
                    }
                    if (node.toString() !== "[object Window]") {
                      var ownerDocument = node.ownerDocument;
                      return ownerDocument ? ownerDocument.defaultView || window : window;
                    }
                    return node;
                  }
                  ;
                  function isElement2(node) {
                    var OwnElement = getWindow2(node).Element;
                    return node instanceof OwnElement || node instanceof Element;
                  }
                  function isHTMLElement2(node) {
                    var OwnElement = getWindow2(node).HTMLElement;
                    return node instanceof OwnElement || node instanceof HTMLElement;
                  }
                  function isShadowRoot2(node) {
                    if (typeof ShadowRoot === "undefined") {
                      return false;
                    }
                    var OwnElement = getWindow2(node).ShadowRoot;
                    return node instanceof OwnElement || node instanceof ShadowRoot;
                  }
                  ;
                  function applyStyles2(_ref) {
                    var state = _ref.state;
                    Object.keys(state.elements).forEach(function(name) {
                      var style = state.styles[name] || {};
                      var attributes = state.attributes[name] || {};
                      var element = state.elements[name];
                      if (!isHTMLElement2(element) || !getNodeName2(element)) {
                        return;
                      }
                      Object.assign(element.style, style);
                      Object.keys(attributes).forEach(function(name2) {
                        var value = attributes[name2];
                        if (value === false) {
                          element.removeAttribute(name2);
                        } else {
                          element.setAttribute(name2, value === true ? "" : value);
                        }
                      });
                    });
                  }
                  function effect4(_ref2) {
                    var state = _ref2.state;
                    var initialStyles = {
                      popper: {
                        position: state.options.strategy,
                        left: "0",
                        top: "0",
                        margin: "0"
                      },
                      arrow: {
                        position: "absolute"
                      },
                      reference: {}
                    };
                    Object.assign(state.elements.popper.style, initialStyles.popper);
                    state.styles = initialStyles;
                    if (state.elements.arrow) {
                      Object.assign(state.elements.arrow.style, initialStyles.arrow);
                    }
                    return function() {
                      Object.keys(state.elements).forEach(function(name) {
                        var element = state.elements[name];
                        var attributes = state.attributes[name] || {};
                        var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
                        var style = styleProperties.reduce(function(style2, property) {
                          style2[property] = "";
                          return style2;
                        }, {});
                        if (!isHTMLElement2(element) || !getNodeName2(element)) {
                          return;
                        }
                        Object.assign(element.style, style);
                        Object.keys(attributes).forEach(function(attribute) {
                          element.removeAttribute(attribute);
                        });
                      });
                    };
                  }
                  var modifiers_applyStyles = {
                    name: "applyStyles",
                    enabled: true,
                    phase: "write",
                    fn: applyStyles2,
                    effect: effect4,
                    requires: ["computeStyles"]
                  };
                  ;
                  function getBasePlacement2(placement) {
                    return placement.split("-")[0];
                  }
                  ;
                  var math_max = Math.max;
                  var math_min = Math.min;
                  var round2 = Math.round;
                  ;
                  function getUAString2() {
                    var uaData = navigator.userAgentData;
                    if (uaData != null && uaData.brands) {
                      return uaData.brands.map(function(item) {
                        return item.brand + "/" + item.version;
                      }).join(" ");
                    }
                    return navigator.userAgent;
                  }
                  ;
                  function isLayoutViewport2() {
                    return !/^((?!chrome|android).)*safari/i.test(getUAString2());
                  }
                  ;
                  function getBoundingClientRect2(element, includeScale, isFixedStrategy) {
                    if (includeScale === void 0) {
                      includeScale = false;
                    }
                    if (isFixedStrategy === void 0) {
                      isFixedStrategy = false;
                    }
                    var clientRect = element.getBoundingClientRect();
                    var scaleX = 1;
                    var scaleY = 1;
                    if (includeScale && isHTMLElement2(element)) {
                      scaleX = element.offsetWidth > 0 ? round2(clientRect.width) / element.offsetWidth || 1 : 1;
                      scaleY = element.offsetHeight > 0 ? round2(clientRect.height) / element.offsetHeight || 1 : 1;
                    }
                    var _ref = isElement2(element) ? getWindow2(element) : window, visualViewport = _ref.visualViewport;
                    var addVisualOffsets = !isLayoutViewport2() && isFixedStrategy;
                    var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
                    var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
                    var width = clientRect.width / scaleX;
                    var height = clientRect.height / scaleY;
                    return {
                      width,
                      height,
                      top: y,
                      right: x + width,
                      bottom: y + height,
                      left: x,
                      x,
                      y
                    };
                  }
                  ;
                  function getLayoutRect2(element) {
                    var clientRect = getBoundingClientRect2(element);
                    var width = element.offsetWidth;
                    var height = element.offsetHeight;
                    if (Math.abs(clientRect.width - width) <= 1) {
                      width = clientRect.width;
                    }
                    if (Math.abs(clientRect.height - height) <= 1) {
                      height = clientRect.height;
                    }
                    return {
                      x: element.offsetLeft,
                      y: element.offsetTop,
                      width,
                      height
                    };
                  }
                  ;
                  function contains2(parent, child) {
                    var rootNode = child.getRootNode && child.getRootNode();
                    if (parent.contains(child)) {
                      return true;
                    } else if (rootNode && isShadowRoot2(rootNode)) {
                      var next = child;
                      do {
                        if (next && parent.isSameNode(next)) {
                          return true;
                        }
                        next = next.parentNode || next.host;
                      } while (next);
                    }
                    return false;
                  }
                  ;
                  function getComputedStyle2(element) {
                    return getWindow2(element).getComputedStyle(element);
                  }
                  ;
                  function isTableElement2(element) {
                    return ["table", "td", "th"].indexOf(getNodeName2(element)) >= 0;
                  }
                  ;
                  function getDocumentElement2(element) {
                    return ((isElement2(element) ? element.ownerDocument : (
                      // $FlowFixMe[prop-missing]
                      element.document
                    )) || window.document).documentElement;
                  }
                  ;
                  function getParentNode2(element) {
                    if (getNodeName2(element) === "html") {
                      return element;
                    }
                    return (
                      // this is a quicker (but less type safe) way to save quite some bytes from the bundle
                      // $FlowFixMe[incompatible-return]
                      // $FlowFixMe[prop-missing]
                      element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
                      element.parentNode || // DOM Element detected
                      (isShadowRoot2(element) ? element.host : null) || // ShadowRoot detected
                      // $FlowFixMe[incompatible-call]: HTMLElement is a Node
                      getDocumentElement2(element)
                    );
                  }
                  ;
                  function getTrueOffsetParent2(element) {
                    if (!isHTMLElement2(element) || // https://github.com/popperjs/popper-core/issues/837
                    getComputedStyle2(element).position === "fixed") {
                      return null;
                    }
                    return element.offsetParent;
                  }
                  function getContainingBlock2(element) {
                    var isFirefox = /firefox/i.test(getUAString2());
                    var isIE = /Trident/i.test(getUAString2());
                    if (isIE && isHTMLElement2(element)) {
                      var elementCss = getComputedStyle2(element);
                      if (elementCss.position === "fixed") {
                        return null;
                      }
                    }
                    var currentNode = getParentNode2(element);
                    if (isShadowRoot2(currentNode)) {
                      currentNode = currentNode.host;
                    }
                    while (isHTMLElement2(currentNode) && ["html", "body"].indexOf(getNodeName2(currentNode)) < 0) {
                      var css = getComputedStyle2(currentNode);
                      if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
                        return currentNode;
                      } else {
                        currentNode = currentNode.parentNode;
                      }
                    }
                    return null;
                  }
                  function getOffsetParent2(element) {
                    var window2 = getWindow2(element);
                    var offsetParent = getTrueOffsetParent2(element);
                    while (offsetParent && isTableElement2(offsetParent) && getComputedStyle2(offsetParent).position === "static") {
                      offsetParent = getTrueOffsetParent2(offsetParent);
                    }
                    if (offsetParent && (getNodeName2(offsetParent) === "html" || getNodeName2(offsetParent) === "body" && getComputedStyle2(offsetParent).position === "static")) {
                      return window2;
                    }
                    return offsetParent || getContainingBlock2(element) || window2;
                  }
                  ;
                  function getMainAxisFromPlacement2(placement) {
                    return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
                  }
                  ;
                  function within2(min2, value, max2) {
                    return math_max(min2, math_min(value, max2));
                  }
                  function withinMaxClamp2(min2, value, max2) {
                    var v = within2(min2, value, max2);
                    return v > max2 ? max2 : v;
                  }
                  ;
                  function getFreshSideObject2() {
                    return {
                      top: 0,
                      right: 0,
                      bottom: 0,
                      left: 0
                    };
                  }
                  ;
                  function mergePaddingObject2(paddingObject) {
                    return Object.assign({}, getFreshSideObject2(), paddingObject);
                  }
                  ;
                  function expandToHashMap2(value, keys) {
                    return keys.reduce(function(hashMap, key) {
                      hashMap[key] = value;
                      return hashMap;
                    }, {});
                  }
                  ;
                  var toPaddingObject3 = function toPaddingObject4(padding, state) {
                    padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
                      placement: state.placement
                    })) : padding;
                    return mergePaddingObject2(typeof padding !== "number" ? padding : expandToHashMap2(padding, basePlacements2));
                  };
                  function arrow2(_ref) {
                    var _state$modifiersData$;
                    var state = _ref.state, name = _ref.name, options = _ref.options;
                    var arrowElement = state.elements.arrow;
                    var popperOffsets3 = state.modifiersData.popperOffsets;
                    var basePlacement = getBasePlacement2(state.placement);
                    var axis = getMainAxisFromPlacement2(basePlacement);
                    var isVertical = [left2, right2].indexOf(basePlacement) >= 0;
                    var len = isVertical ? "height" : "width";
                    if (!arrowElement || !popperOffsets3) {
                      return;
                    }
                    var paddingObject = toPaddingObject3(options.padding, state);
                    var arrowRect = getLayoutRect2(arrowElement);
                    var minProp = axis === "y" ? enums_top : left2;
                    var maxProp = axis === "y" ? bottom2 : right2;
                    var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets3[axis] - state.rects.popper[len];
                    var startDiff = popperOffsets3[axis] - state.rects.reference[axis];
                    var arrowOffsetParent = getOffsetParent2(arrowElement);
                    var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
                    var centerToReference = endDiff / 2 - startDiff / 2;
                    var min2 = paddingObject[minProp];
                    var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
                    var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
                    var offset3 = within2(min2, center, max2);
                    var axisProp = axis;
                    state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset3, _state$modifiersData$.centerOffset = offset3 - center, _state$modifiersData$);
                  }
                  function arrow_effect(_ref2) {
                    var state = _ref2.state, options = _ref2.options;
                    var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
                    if (arrowElement == null) {
                      return;
                    }
                    if (typeof arrowElement === "string") {
                      arrowElement = state.elements.popper.querySelector(arrowElement);
                      if (!arrowElement) {
                        return;
                      }
                    }
                    if (false) {
                    }
                    if (!contains2(state.elements.popper, arrowElement)) {
                      if (false) {
                      }
                      return;
                    }
                    state.elements.arrow = arrowElement;
                  }
                  var modifiers_arrow = {
                    name: "arrow",
                    enabled: true,
                    phase: "main",
                    fn: arrow2,
                    effect: arrow_effect,
                    requires: ["popperOffsets"],
                    requiresIfExists: ["preventOverflow"]
                  };
                  ;
                  function getVariation2(placement) {
                    return placement.split("-")[1];
                  }
                  ;
                  var unsetSides2 = {
                    top: "auto",
                    right: "auto",
                    bottom: "auto",
                    left: "auto"
                  };
                  function roundOffsetsByDPR2(_ref) {
                    var x = _ref.x, y = _ref.y;
                    var win = window;
                    var dpr = win.devicePixelRatio || 1;
                    return {
                      x: round2(x * dpr) / dpr || 0,
                      y: round2(y * dpr) / dpr || 0
                    };
                  }
                  function mapToStyles2(_ref2) {
                    var _Object$assign2;
                    var popper3 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
                    var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
                    var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
                      x,
                      y
                    }) : {
                      x,
                      y
                    };
                    x = _ref3.x;
                    y = _ref3.y;
                    var hasX = offsets.hasOwnProperty("x");
                    var hasY = offsets.hasOwnProperty("y");
                    var sideX = left2;
                    var sideY = enums_top;
                    var win = window;
                    if (adaptive) {
                      var offsetParent = getOffsetParent2(popper3);
                      var heightProp = "clientHeight";
                      var widthProp = "clientWidth";
                      if (offsetParent === getWindow2(popper3)) {
                        offsetParent = getDocumentElement2(popper3);
                        if (getComputedStyle2(offsetParent).position !== "static" && position === "absolute") {
                          heightProp = "scrollHeight";
                          widthProp = "scrollWidth";
                        }
                      }
                      offsetParent = offsetParent;
                      if (placement === enums_top || (placement === left2 || placement === right2) && variation === end2) {
                        sideY = bottom2;
                        var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
                          // $FlowFixMe[prop-missing]
                          offsetParent[heightProp]
                        );
                        y -= offsetY - popperRect.height;
                        y *= gpuAcceleration ? 1 : -1;
                      }
                      if (placement === left2 || (placement === enums_top || placement === bottom2) && variation === end2) {
                        sideX = right2;
                        var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
                          // $FlowFixMe[prop-missing]
                          offsetParent[widthProp]
                        );
                        x -= offsetX - popperRect.width;
                        x *= gpuAcceleration ? 1 : -1;
                      }
                    }
                    var commonStyles = Object.assign({
                      position
                    }, adaptive && unsetSides2);
                    var _ref4 = roundOffsets === true ? roundOffsetsByDPR2({
                      x,
                      y
                    }) : {
                      x,
                      y
                    };
                    x = _ref4.x;
                    y = _ref4.y;
                    if (gpuAcceleration) {
                      var _Object$assign;
                      return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
                    }
                    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
                  }
                  function computeStyles2(_ref5) {
                    var state = _ref5.state, options = _ref5.options;
                    var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
                    if (false) {
                      var transitionProperty;
                    }
                    var commonStyles = {
                      placement: getBasePlacement2(state.placement),
                      variation: getVariation2(state.placement),
                      popper: state.elements.popper,
                      popperRect: state.rects.popper,
                      gpuAcceleration,
                      isFixed: state.options.strategy === "fixed"
                    };
                    if (state.modifiersData.popperOffsets != null) {
                      state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles2(Object.assign({}, commonStyles, {
                        offsets: state.modifiersData.popperOffsets,
                        position: state.options.strategy,
                        adaptive,
                        roundOffsets
                      })));
                    }
                    if (state.modifiersData.arrow != null) {
                      state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles2(Object.assign({}, commonStyles, {
                        offsets: state.modifiersData.arrow,
                        position: "absolute",
                        adaptive: false,
                        roundOffsets
                      })));
                    }
                    state.attributes.popper = Object.assign({}, state.attributes.popper, {
                      "data-popper-placement": state.placement
                    });
                  }
                  var modifiers_computeStyles = {
                    name: "computeStyles",
                    enabled: true,
                    phase: "beforeWrite",
                    fn: computeStyles2,
                    data: {}
                  };
                  ;
                  var passive2 = {
                    passive: true
                  };
                  function eventListeners_effect(_ref) {
                    var state = _ref.state, instance = _ref.instance, options = _ref.options;
                    var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
                    var window2 = getWindow2(state.elements.popper);
                    var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
                    if (scroll) {
                      scrollParents.forEach(function(scrollParent) {
                        scrollParent.addEventListener("scroll", instance.update, passive2);
                      });
                    }
                    if (resize) {
                      window2.addEventListener("resize", instance.update, passive2);
                    }
                    return function() {
                      if (scroll) {
                        scrollParents.forEach(function(scrollParent) {
                          scrollParent.removeEventListener("scroll", instance.update, passive2);
                        });
                      }
                      if (resize) {
                        window2.removeEventListener("resize", instance.update, passive2);
                      }
                    };
                  }
                  var eventListeners = {
                    name: "eventListeners",
                    enabled: true,
                    phase: "write",
                    fn: function fn2() {
                    },
                    effect: eventListeners_effect,
                    data: {}
                  };
                  ;
                  var hash3 = {
                    left: "right",
                    right: "left",
                    bottom: "top",
                    top: "bottom"
                  };
                  function getOppositePlacement2(placement) {
                    return placement.replace(/left|right|bottom|top/g, function(matched) {
                      return hash3[matched];
                    });
                  }
                  ;
                  var getOppositeVariationPlacement_hash = {
                    start: "end",
                    end: "start"
                  };
                  function getOppositeVariationPlacement2(placement) {
                    return placement.replace(/start|end/g, function(matched) {
                      return getOppositeVariationPlacement_hash[matched];
                    });
                  }
                  ;
                  function getWindowScroll2(node) {
                    var win = getWindow2(node);
                    var scrollLeft = win.pageXOffset;
                    var scrollTop = win.pageYOffset;
                    return {
                      scrollLeft,
                      scrollTop
                    };
                  }
                  ;
                  function getWindowScrollBarX2(element) {
                    return getBoundingClientRect2(getDocumentElement2(element)).left + getWindowScroll2(element).scrollLeft;
                  }
                  ;
                  function getViewportRect2(element, strategy) {
                    var win = getWindow2(element);
                    var html = getDocumentElement2(element);
                    var visualViewport = win.visualViewport;
                    var width = html.clientWidth;
                    var height = html.clientHeight;
                    var x = 0;
                    var y = 0;
                    if (visualViewport) {
                      width = visualViewport.width;
                      height = visualViewport.height;
                      var layoutViewport = isLayoutViewport2();
                      if (layoutViewport || !layoutViewport && strategy === "fixed") {
                        x = visualViewport.offsetLeft;
                        y = visualViewport.offsetTop;
                      }
                    }
                    return {
                      width,
                      height,
                      x: x + getWindowScrollBarX2(element),
                      y
                    };
                  }
                  ;
                  function getDocumentRect2(element) {
                    var _element$ownerDocumen;
                    var html = getDocumentElement2(element);
                    var winScroll = getWindowScroll2(element);
                    var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
                    var width = math_max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
                    var height = math_max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
                    var x = -winScroll.scrollLeft + getWindowScrollBarX2(element);
                    var y = -winScroll.scrollTop;
                    if (getComputedStyle2(body || html).direction === "rtl") {
                      x += math_max(html.clientWidth, body ? body.clientWidth : 0) - width;
                    }
                    return {
                      width,
                      height,
                      x,
                      y
                    };
                  }
                  ;
                  function isScrollParent2(element) {
                    var _getComputedStyle = getComputedStyle2(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
                    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
                  }
                  ;
                  function getScrollParent2(node) {
                    if (["html", "body", "#document"].indexOf(getNodeName2(node)) >= 0) {
                      return node.ownerDocument.body;
                    }
                    if (isHTMLElement2(node) && isScrollParent2(node)) {
                      return node;
                    }
                    return getScrollParent2(getParentNode2(node));
                  }
                  ;
                  function listScrollParents2(element, list) {
                    var _element$ownerDocumen;
                    if (list === void 0) {
                      list = [];
                    }
                    var scrollParent = getScrollParent2(element);
                    var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
                    var win = getWindow2(scrollParent);
                    var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent2(scrollParent) ? scrollParent : []) : scrollParent;
                    var updatedList = list.concat(target);
                    return isBody ? updatedList : (
                      // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
                      updatedList.concat(listScrollParents2(getParentNode2(target)))
                    );
                  }
                  ;
                  function rectToClientRect2(rect) {
                    return Object.assign({}, rect, {
                      left: rect.x,
                      top: rect.y,
                      right: rect.x + rect.width,
                      bottom: rect.y + rect.height
                    });
                  }
                  ;
                  function getInnerBoundingClientRect2(element, strategy) {
                    var rect = getBoundingClientRect2(element, false, strategy === "fixed");
                    rect.top = rect.top + element.clientTop;
                    rect.left = rect.left + element.clientLeft;
                    rect.bottom = rect.top + element.clientHeight;
                    rect.right = rect.left + element.clientWidth;
                    rect.width = element.clientWidth;
                    rect.height = element.clientHeight;
                    rect.x = rect.left;
                    rect.y = rect.top;
                    return rect;
                  }
                  function getClientRectFromMixedType2(element, clippingParent, strategy) {
                    return clippingParent === viewport2 ? rectToClientRect2(getViewportRect2(element, strategy)) : isElement2(clippingParent) ? getInnerBoundingClientRect2(clippingParent, strategy) : rectToClientRect2(getDocumentRect2(getDocumentElement2(element)));
                  }
                  function getClippingParents2(element) {
                    var clippingParents3 = listScrollParents2(getParentNode2(element));
                    var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle2(element).position) >= 0;
                    var clipperElement = canEscapeClipping && isHTMLElement2(element) ? getOffsetParent2(element) : element;
                    if (!isElement2(clipperElement)) {
                      return [];
                    }
                    return clippingParents3.filter(function(clippingParent) {
                      return isElement2(clippingParent) && contains2(clippingParent, clipperElement) && getNodeName2(clippingParent) !== "body";
                    });
                  }
                  function getClippingRect2(element, boundary, rootBoundary, strategy) {
                    var mainClippingParents = boundary === "clippingParents" ? getClippingParents2(element) : [].concat(boundary);
                    var clippingParents3 = [].concat(mainClippingParents, [rootBoundary]);
                    var firstClippingParent = clippingParents3[0];
                    var clippingRect = clippingParents3.reduce(function(accRect, clippingParent) {
                      var rect = getClientRectFromMixedType2(element, clippingParent, strategy);
                      accRect.top = math_max(rect.top, accRect.top);
                      accRect.right = math_min(rect.right, accRect.right);
                      accRect.bottom = math_min(rect.bottom, accRect.bottom);
                      accRect.left = math_max(rect.left, accRect.left);
                      return accRect;
                    }, getClientRectFromMixedType2(element, firstClippingParent, strategy));
                    clippingRect.width = clippingRect.right - clippingRect.left;
                    clippingRect.height = clippingRect.bottom - clippingRect.top;
                    clippingRect.x = clippingRect.left;
                    clippingRect.y = clippingRect.top;
                    return clippingRect;
                  }
                  ;
                  function computeOffsets2(_ref) {
                    var reference3 = _ref.reference, element = _ref.element, placement = _ref.placement;
                    var basePlacement = placement ? getBasePlacement2(placement) : null;
                    var variation = placement ? getVariation2(placement) : null;
                    var commonX = reference3.x + reference3.width / 2 - element.width / 2;
                    var commonY = reference3.y + reference3.height / 2 - element.height / 2;
                    var offsets;
                    switch (basePlacement) {
                      case enums_top:
                        offsets = {
                          x: commonX,
                          y: reference3.y - element.height
                        };
                        break;
                      case bottom2:
                        offsets = {
                          x: commonX,
                          y: reference3.y + reference3.height
                        };
                        break;
                      case right2:
                        offsets = {
                          x: reference3.x + reference3.width,
                          y: commonY
                        };
                        break;
                      case left2:
                        offsets = {
                          x: reference3.x - element.width,
                          y: commonY
                        };
                        break;
                      default:
                        offsets = {
                          x: reference3.x,
                          y: reference3.y
                        };
                    }
                    var mainAxis = basePlacement ? getMainAxisFromPlacement2(basePlacement) : null;
                    if (mainAxis != null) {
                      var len = mainAxis === "y" ? "height" : "width";
                      switch (variation) {
                        case start3:
                          offsets[mainAxis] = offsets[mainAxis] - (reference3[len] / 2 - element[len] / 2);
                          break;
                        case end2:
                          offsets[mainAxis] = offsets[mainAxis] + (reference3[len] / 2 - element[len] / 2);
                          break;
                        default:
                      }
                    }
                    return offsets;
                  }
                  ;
                  function detectOverflow2(state, options) {
                    if (options === void 0) {
                      options = {};
                    }
                    var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents2 : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport2 : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper2 : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
                    var paddingObject = mergePaddingObject2(typeof padding !== "number" ? padding : expandToHashMap2(padding, basePlacements2));
                    var altContext = elementContext === popper2 ? reference2 : popper2;
                    var popperRect = state.rects.popper;
                    var element = state.elements[altBoundary ? altContext : elementContext];
                    var clippingClientRect = getClippingRect2(isElement2(element) ? element : element.contextElement || getDocumentElement2(state.elements.popper), boundary, rootBoundary, strategy);
                    var referenceClientRect = getBoundingClientRect2(state.elements.reference);
                    var popperOffsets3 = computeOffsets2({
                      reference: referenceClientRect,
                      element: popperRect,
                      strategy: "absolute",
                      placement
                    });
                    var popperClientRect = rectToClientRect2(Object.assign({}, popperRect, popperOffsets3));
                    var elementClientRect = elementContext === popper2 ? popperClientRect : referenceClientRect;
                    var overflowOffsets = {
                      top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
                      bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
                      left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
                      right: elementClientRect.right - clippingClientRect.right + paddingObject.right
                    };
                    var offsetData = state.modifiersData.offset;
                    if (elementContext === popper2 && offsetData) {
                      var offset3 = offsetData[placement];
                      Object.keys(overflowOffsets).forEach(function(key) {
                        var multiply = [right2, bottom2].indexOf(key) >= 0 ? 1 : -1;
                        var axis = [enums_top, bottom2].indexOf(key) >= 0 ? "y" : "x";
                        overflowOffsets[key] += offset3[axis] * multiply;
                      });
                    }
                    return overflowOffsets;
                  }
                  ;
                  function computeAutoPlacement2(state, options) {
                    if (options === void 0) {
                      options = {};
                    }
                    var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? enums_placements : _options$allowedAutoP;
                    var variation = getVariation2(placement);
                    var placements2 = variation ? flipVariations ? variationPlacements2 : variationPlacements2.filter(function(placement2) {
                      return getVariation2(placement2) === variation;
                    }) : basePlacements2;
                    var allowedPlacements = placements2.filter(function(placement2) {
                      return allowedAutoPlacements.indexOf(placement2) >= 0;
                    });
                    if (allowedPlacements.length === 0) {
                      allowedPlacements = placements2;
                      if (false) {
                      }
                    }
                    var overflows = allowedPlacements.reduce(function(acc, placement2) {
                      acc[placement2] = detectOverflow2(state, {
                        placement: placement2,
                        boundary,
                        rootBoundary,
                        padding
                      })[getBasePlacement2(placement2)];
                      return acc;
                    }, {});
                    return Object.keys(overflows).sort(function(a, b) {
                      return overflows[a] - overflows[b];
                    });
                  }
                  ;
                  function getExpandedFallbackPlacements2(placement) {
                    if (getBasePlacement2(placement) === auto2) {
                      return [];
                    }
                    var oppositePlacement = getOppositePlacement2(placement);
                    return [getOppositeVariationPlacement2(placement), oppositePlacement, getOppositeVariationPlacement2(oppositePlacement)];
                  }
                  function flip2(_ref) {
                    var state = _ref.state, options = _ref.options, name = _ref.name;
                    if (state.modifiersData[name]._skip) {
                      return;
                    }
                    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
                    var preferredPlacement = state.options.placement;
                    var basePlacement = getBasePlacement2(preferredPlacement);
                    var isBasePlacement = basePlacement === preferredPlacement;
                    var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement2(preferredPlacement)] : getExpandedFallbackPlacements2(preferredPlacement));
                    var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
                      return acc.concat(getBasePlacement2(placement2) === auto2 ? computeAutoPlacement2(state, {
                        placement: placement2,
                        boundary,
                        rootBoundary,
                        padding,
                        flipVariations,
                        allowedAutoPlacements
                      }) : placement2);
                    }, []);
                    var referenceRect = state.rects.reference;
                    var popperRect = state.rects.popper;
                    var checksMap = /* @__PURE__ */ new Map();
                    var makeFallbackChecks = true;
                    var firstFittingPlacement = placements2[0];
                    for (var i = 0; i < placements2.length; i++) {
                      var placement = placements2[i];
                      var _basePlacement = getBasePlacement2(placement);
                      var isStartVariation = getVariation2(placement) === start3;
                      var isVertical = [enums_top, bottom2].indexOf(_basePlacement) >= 0;
                      var len = isVertical ? "width" : "height";
                      var overflow = detectOverflow2(state, {
                        placement,
                        boundary,
                        rootBoundary,
                        altBoundary,
                        padding
                      });
                      var mainVariationSide = isVertical ? isStartVariation ? right2 : left2 : isStartVariation ? bottom2 : enums_top;
                      if (referenceRect[len] > popperRect[len]) {
                        mainVariationSide = getOppositePlacement2(mainVariationSide);
                      }
                      var altVariationSide = getOppositePlacement2(mainVariationSide);
                      var checks = [];
                      if (checkMainAxis) {
                        checks.push(overflow[_basePlacement] <= 0);
                      }
                      if (checkAltAxis) {
                        checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
                      }
                      if (checks.every(function(check) {
                        return check;
                      })) {
                        firstFittingPlacement = placement;
                        makeFallbackChecks = false;
                        break;
                      }
                      checksMap.set(placement, checks);
                    }
                    if (makeFallbackChecks) {
                      var numberOfChecks = flipVariations ? 3 : 1;
                      var _loop = function _loop2(_i2) {
                        var fittingPlacement = placements2.find(function(placement2) {
                          var checks2 = checksMap.get(placement2);
                          if (checks2) {
                            return checks2.slice(0, _i2).every(function(check) {
                              return check;
                            });
                          }
                        });
                        if (fittingPlacement) {
                          firstFittingPlacement = fittingPlacement;
                          return "break";
                        }
                      };
                      for (var _i = numberOfChecks; _i > 0; _i--) {
                        var _ret = _loop(_i);
                        if (_ret === "break")
                          break;
                      }
                    }
                    if (state.placement !== firstFittingPlacement) {
                      state.modifiersData[name]._skip = true;
                      state.placement = firstFittingPlacement;
                      state.reset = true;
                    }
                  }
                  var modifiers_flip = {
                    name: "flip",
                    enabled: true,
                    phase: "main",
                    fn: flip2,
                    requiresIfExists: ["offset"],
                    data: {
                      _skip: false
                    }
                  };
                  ;
                  function getSideOffsets2(overflow, rect, preventedOffsets) {
                    if (preventedOffsets === void 0) {
                      preventedOffsets = {
                        x: 0,
                        y: 0
                      };
                    }
                    return {
                      top: overflow.top - rect.height - preventedOffsets.y,
                      right: overflow.right - rect.width + preventedOffsets.x,
                      bottom: overflow.bottom - rect.height + preventedOffsets.y,
                      left: overflow.left - rect.width - preventedOffsets.x
                    };
                  }
                  function isAnySideFullyClipped2(overflow) {
                    return [enums_top, right2, bottom2, left2].some(function(side) {
                      return overflow[side] >= 0;
                    });
                  }
                  function hide2(_ref) {
                    var state = _ref.state, name = _ref.name;
                    var referenceRect = state.rects.reference;
                    var popperRect = state.rects.popper;
                    var preventedOffsets = state.modifiersData.preventOverflow;
                    var referenceOverflow = detectOverflow2(state, {
                      elementContext: "reference"
                    });
                    var popperAltOverflow = detectOverflow2(state, {
                      altBoundary: true
                    });
                    var referenceClippingOffsets = getSideOffsets2(referenceOverflow, referenceRect);
                    var popperEscapeOffsets = getSideOffsets2(popperAltOverflow, popperRect, preventedOffsets);
                    var isReferenceHidden = isAnySideFullyClipped2(referenceClippingOffsets);
                    var hasPopperEscaped = isAnySideFullyClipped2(popperEscapeOffsets);
                    state.modifiersData[name] = {
                      referenceClippingOffsets,
                      popperEscapeOffsets,
                      isReferenceHidden,
                      hasPopperEscaped
                    };
                    state.attributes.popper = Object.assign({}, state.attributes.popper, {
                      "data-popper-reference-hidden": isReferenceHidden,
                      "data-popper-escaped": hasPopperEscaped
                    });
                  }
                  var modifiers_hide = {
                    name: "hide",
                    enabled: true,
                    phase: "main",
                    requiresIfExists: ["preventOverflow"],
                    fn: hide2
                  };
                  ;
                  function distanceAndSkiddingToXY2(placement, rects, offset3) {
                    var basePlacement = getBasePlacement2(placement);
                    var invertDistance = [left2, enums_top].indexOf(basePlacement) >= 0 ? -1 : 1;
                    var _ref = typeof offset3 === "function" ? offset3(Object.assign({}, rects, {
                      placement
                    })) : offset3, skidding = _ref[0], distance = _ref[1];
                    skidding = skidding || 0;
                    distance = (distance || 0) * invertDistance;
                    return [left2, right2].indexOf(basePlacement) >= 0 ? {
                      x: distance,
                      y: skidding
                    } : {
                      x: skidding,
                      y: distance
                    };
                  }
                  function offset2(_ref2) {
                    var state = _ref2.state, options = _ref2.options, name = _ref2.name;
                    var _options$offset = options.offset, offset3 = _options$offset === void 0 ? [0, 0] : _options$offset;
                    var data = enums_placements.reduce(function(acc, placement) {
                      acc[placement] = distanceAndSkiddingToXY2(placement, state.rects, offset3);
                      return acc;
                    }, {});
                    var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
                    if (state.modifiersData.popperOffsets != null) {
                      state.modifiersData.popperOffsets.x += x;
                      state.modifiersData.popperOffsets.y += y;
                    }
                    state.modifiersData[name] = data;
                  }
                  var modifiers_offset = {
                    name: "offset",
                    enabled: true,
                    phase: "main",
                    requires: ["popperOffsets"],
                    fn: offset2
                  };
                  ;
                  function popperOffsets2(_ref) {
                    var state = _ref.state, name = _ref.name;
                    state.modifiersData[name] = computeOffsets2({
                      reference: state.rects.reference,
                      element: state.rects.popper,
                      strategy: "absolute",
                      placement: state.placement
                    });
                  }
                  var modifiers_popperOffsets = {
                    name: "popperOffsets",
                    enabled: true,
                    phase: "read",
                    fn: popperOffsets2,
                    data: {}
                  };
                  ;
                  function getAltAxis2(axis) {
                    return axis === "x" ? "y" : "x";
                  }
                  ;
                  function preventOverflow2(_ref) {
                    var state = _ref.state, options = _ref.options, name = _ref.name;
                    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
                    var overflow = detectOverflow2(state, {
                      boundary,
                      rootBoundary,
                      padding,
                      altBoundary
                    });
                    var basePlacement = getBasePlacement2(state.placement);
                    var variation = getVariation2(state.placement);
                    var isBasePlacement = !variation;
                    var mainAxis = getMainAxisFromPlacement2(basePlacement);
                    var altAxis = getAltAxis2(mainAxis);
                    var popperOffsets3 = state.modifiersData.popperOffsets;
                    var referenceRect = state.rects.reference;
                    var popperRect = state.rects.popper;
                    var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
                      placement: state.placement
                    })) : tetherOffset;
                    var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
                      mainAxis: tetherOffsetValue,
                      altAxis: tetherOffsetValue
                    } : Object.assign({
                      mainAxis: 0,
                      altAxis: 0
                    }, tetherOffsetValue);
                    var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
                    var data = {
                      x: 0,
                      y: 0
                    };
                    if (!popperOffsets3) {
                      return;
                    }
                    if (checkMainAxis) {
                      var _offsetModifierState$;
                      var mainSide = mainAxis === "y" ? enums_top : left2;
                      var altSide = mainAxis === "y" ? bottom2 : right2;
                      var len = mainAxis === "y" ? "height" : "width";
                      var offset3 = popperOffsets3[mainAxis];
                      var min2 = offset3 + overflow[mainSide];
                      var max2 = offset3 - overflow[altSide];
                      var additive = tether ? -popperRect[len] / 2 : 0;
                      var minLen = variation === start3 ? referenceRect[len] : popperRect[len];
                      var maxLen = variation === start3 ? -popperRect[len] : -referenceRect[len];
                      var arrowElement = state.elements.arrow;
                      var arrowRect = tether && arrowElement ? getLayoutRect2(arrowElement) : {
                        width: 0,
                        height: 0
                      };
                      var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject2();
                      var arrowPaddingMin = arrowPaddingObject[mainSide];
                      var arrowPaddingMax = arrowPaddingObject[altSide];
                      var arrowLen = within2(0, referenceRect[len], arrowRect[len]);
                      var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
                      var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
                      var arrowOffsetParent = state.elements.arrow && getOffsetParent2(state.elements.arrow);
                      var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
                      var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
                      var tetherMin = offset3 + minOffset - offsetModifierValue - clientOffset;
                      var tetherMax = offset3 + maxOffset - offsetModifierValue;
                      var preventedOffset = within2(tether ? math_min(min2, tetherMin) : min2, offset3, tether ? math_max(max2, tetherMax) : max2);
                      popperOffsets3[mainAxis] = preventedOffset;
                      data[mainAxis] = preventedOffset - offset3;
                    }
                    if (checkAltAxis) {
                      var _offsetModifierState$2;
                      var _mainSide = mainAxis === "x" ? enums_top : left2;
                      var _altSide = mainAxis === "x" ? bottom2 : right2;
                      var _offset = popperOffsets3[altAxis];
                      var _len = altAxis === "y" ? "height" : "width";
                      var _min = _offset + overflow[_mainSide];
                      var _max = _offset - overflow[_altSide];
                      var isOriginSide = [enums_top, left2].indexOf(basePlacement) !== -1;
                      var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
                      var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
                      var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
                      var _preventedOffset = tether && isOriginSide ? withinMaxClamp2(_tetherMin, _offset, _tetherMax) : within2(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
                      popperOffsets3[altAxis] = _preventedOffset;
                      data[altAxis] = _preventedOffset - _offset;
                    }
                    state.modifiersData[name] = data;
                  }
                  var modifiers_preventOverflow = {
                    name: "preventOverflow",
                    enabled: true,
                    phase: "main",
                    fn: preventOverflow2,
                    requiresIfExists: ["offset"]
                  };
                  ;
                  ;
                  function getHTMLElementScroll2(element) {
                    return {
                      scrollLeft: element.scrollLeft,
                      scrollTop: element.scrollTop
                    };
                  }
                  ;
                  function getNodeScroll2(node) {
                    if (node === getWindow2(node) || !isHTMLElement2(node)) {
                      return getWindowScroll2(node);
                    } else {
                      return getHTMLElementScroll2(node);
                    }
                  }
                  ;
                  function isElementScaled2(element) {
                    var rect = element.getBoundingClientRect();
                    var scaleX = round2(rect.width) / element.offsetWidth || 1;
                    var scaleY = round2(rect.height) / element.offsetHeight || 1;
                    return scaleX !== 1 || scaleY !== 1;
                  }
                  function getCompositeRect2(elementOrVirtualElement, offsetParent, isFixed) {
                    if (isFixed === void 0) {
                      isFixed = false;
                    }
                    var isOffsetParentAnElement = isHTMLElement2(offsetParent);
                    var offsetParentIsScaled = isHTMLElement2(offsetParent) && isElementScaled2(offsetParent);
                    var documentElement = getDocumentElement2(offsetParent);
                    var rect = getBoundingClientRect2(elementOrVirtualElement, offsetParentIsScaled, isFixed);
                    var scroll = {
                      scrollLeft: 0,
                      scrollTop: 0
                    };
                    var offsets = {
                      x: 0,
                      y: 0
                    };
                    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
                      if (getNodeName2(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
                      isScrollParent2(documentElement)) {
                        scroll = getNodeScroll2(offsetParent);
                      }
                      if (isHTMLElement2(offsetParent)) {
                        offsets = getBoundingClientRect2(offsetParent, true);
                        offsets.x += offsetParent.clientLeft;
                        offsets.y += offsetParent.clientTop;
                      } else if (documentElement) {
                        offsets.x = getWindowScrollBarX2(documentElement);
                      }
                    }
                    return {
                      x: rect.left + scroll.scrollLeft - offsets.x,
                      y: rect.top + scroll.scrollTop - offsets.y,
                      width: rect.width,
                      height: rect.height
                    };
                  }
                  ;
                  function order2(modifiers) {
                    var map = /* @__PURE__ */ new Map();
                    var visited = /* @__PURE__ */ new Set();
                    var result = [];
                    modifiers.forEach(function(modifier) {
                      map.set(modifier.name, modifier);
                    });
                    function sort(modifier) {
                      visited.add(modifier.name);
                      var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
                      requires.forEach(function(dep) {
                        if (!visited.has(dep)) {
                          var depModifier = map.get(dep);
                          if (depModifier) {
                            sort(depModifier);
                          }
                        }
                      });
                      result.push(modifier);
                    }
                    modifiers.forEach(function(modifier) {
                      if (!visited.has(modifier.name)) {
                        sort(modifier);
                      }
                    });
                    return result;
                  }
                  function orderModifiers2(modifiers) {
                    var orderedModifiers = order2(modifiers);
                    return modifierPhases2.reduce(function(acc, phase) {
                      return acc.concat(orderedModifiers.filter(function(modifier) {
                        return modifier.phase === phase;
                      }));
                    }, []);
                  }
                  ;
                  function debounce2(fn2) {
                    var pending;
                    return function() {
                      if (!pending) {
                        pending = new Promise(function(resolve) {
                          Promise.resolve().then(function() {
                            pending = void 0;
                            resolve(fn2());
                          });
                        });
                      }
                      return pending;
                    };
                  }
                  ;
                  function mergeByName2(modifiers) {
                    var merged = modifiers.reduce(function(merged2, current) {
                      var existing = merged2[current.name];
                      merged2[current.name] = existing ? Object.assign({}, existing, current, {
                        options: Object.assign({}, existing.options, current.options),
                        data: Object.assign({}, existing.data, current.data)
                      }) : current;
                      return merged2;
                    }, {});
                    return Object.keys(merged).map(function(key) {
                      return merged[key];
                    });
                  }
                  ;
                  var INVALID_ELEMENT_ERROR = "Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.";
                  var INFINITE_LOOP_ERROR = "Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.";
                  var DEFAULT_OPTIONS2 = {
                    placement: "bottom",
                    modifiers: [],
                    strategy: "absolute"
                  };
                  function areValidElements2() {
                    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                      args[_key] = arguments[_key];
                    }
                    return !args.some(function(element) {
                      return !(element && typeof element.getBoundingClientRect === "function");
                    });
                  }
                  function popperGenerator2(generatorOptions) {
                    if (generatorOptions === void 0) {
                      generatorOptions = {};
                    }
                    var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers3 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions2 = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS2 : _generatorOptions$def2;
                    return function createPopper3(reference3, popper3, options) {
                      if (options === void 0) {
                        options = defaultOptions2;
                      }
                      var state = {
                        placement: "bottom",
                        orderedModifiers: [],
                        options: Object.assign({}, DEFAULT_OPTIONS2, defaultOptions2),
                        modifiersData: {},
                        elements: {
                          reference: reference3,
                          popper: popper3
                        },
                        attributes: {},
                        styles: {}
                      };
                      var effectCleanupFns = [];
                      var isDestroyed = false;
                      var instance = {
                        state,
                        setOptions: function setOptions(setOptionsAction) {
                          var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
                          cleanupModifierEffects();
                          state.options = Object.assign({}, defaultOptions2, state.options, options2);
                          state.scrollParents = {
                            reference: isElement2(reference3) ? listScrollParents2(reference3) : reference3.contextElement ? listScrollParents2(reference3.contextElement) : [],
                            popper: listScrollParents2(popper3)
                          };
                          var orderedModifiers = orderModifiers2(mergeByName2([].concat(defaultModifiers3, state.options.modifiers)));
                          state.orderedModifiers = orderedModifiers.filter(function(m) {
                            return m.enabled;
                          });
                          if (false) {
                            var _getComputedStyle, marginTop, marginRight, marginBottom, marginLeft, flipModifier, modifiers;
                          }
                          runModifierEffects();
                          return instance.update();
                        },
                        // Sync update – it will always be executed, even if not necessary. This
                        // is useful for low frequency updates where sync behavior simplifies the
                        // logic.
                        // For high frequency updates (e.g. `resize` and `scroll` events), always
                        // prefer the async Popper#update method
                        forceUpdate: function forceUpdate() {
                          if (isDestroyed) {
                            return;
                          }
                          var _state$elements = state.elements, reference4 = _state$elements.reference, popper4 = _state$elements.popper;
                          if (!areValidElements2(reference4, popper4)) {
                            if (false) {
                            }
                            return;
                          }
                          state.rects = {
                            reference: getCompositeRect2(reference4, getOffsetParent2(popper4), state.options.strategy === "fixed"),
                            popper: getLayoutRect2(popper4)
                          };
                          state.reset = false;
                          state.placement = state.options.placement;
                          state.orderedModifiers.forEach(function(modifier) {
                            return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
                          });
                          var __debug_loops__ = 0;
                          for (var index = 0; index < state.orderedModifiers.length; index++) {
                            if (false) {
                            }
                            if (state.reset === true) {
                              state.reset = false;
                              index = -1;
                              continue;
                            }
                            var _state$orderedModifie = state.orderedModifiers[index], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
                            if (typeof fn2 === "function") {
                              state = fn2({
                                state,
                                options: _options,
                                name,
                                instance
                              }) || state;
                            }
                          }
                        },
                        // Async and optimistically optimized update – it will not be executed if
                        // not necessary (debounced to run at most once-per-tick)
                        update: debounce2(function() {
                          return new Promise(function(resolve) {
                            instance.forceUpdate();
                            resolve(state);
                          });
                        }),
                        destroy: function destroy() {
                          cleanupModifierEffects();
                          isDestroyed = true;
                        }
                      };
                      if (!areValidElements2(reference3, popper3)) {
                        if (false) {
                        }
                        return instance;
                      }
                      instance.setOptions(options).then(function(state2) {
                        if (!isDestroyed && options.onFirstUpdate) {
                          options.onFirstUpdate(state2);
                        }
                      });
                      function runModifierEffects() {
                        state.orderedModifiers.forEach(function(_ref3) {
                          var name = _ref3.name, _ref3$options = _ref3.options, options2 = _ref3$options === void 0 ? {} : _ref3$options, effect5 = _ref3.effect;
                          if (typeof effect5 === "function") {
                            var cleanupFn = effect5({
                              state,
                              name,
                              instance,
                              options: options2
                            });
                            var noopFn = function noopFn2() {
                            };
                            effectCleanupFns.push(cleanupFn || noopFn);
                          }
                        });
                      }
                      function cleanupModifierEffects() {
                        effectCleanupFns.forEach(function(fn2) {
                          return fn2();
                        });
                        effectCleanupFns = [];
                      }
                      return instance;
                    };
                  }
                  var createPopper2 = /* @__PURE__ */ popperGenerator2();
                  ;
                  var defaultModifiers2 = [eventListeners, modifiers_popperOffsets, modifiers_computeStyles, modifiers_applyStyles, modifiers_offset, modifiers_flip, modifiers_preventOverflow, modifiers_arrow, modifiers_hide];
                  var popper_createPopper = /* @__PURE__ */ popperGenerator2({
                    defaultModifiers: defaultModifiers2
                  });
                  ;
                  var popper_lite_defaultModifiers = [eventListeners, modifiers_popperOffsets, modifiers_computeStyles, modifiers_applyStyles];
                  var popper_lite_createPopper = /* @__PURE__ */ popperGenerator2({
                    defaultModifiers: popper_lite_defaultModifiers
                  });
                  ;
                }
              ),
              /***/
              902: (
                /***/
                function(__unused_webpack_module, exports2) {
                  var __assign12 = this && this.__assign || function() {
                    __assign12 = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign12.apply(this, arguments);
                  };
                  Object.defineProperty(exports2, "__esModule", { value: true });
                  exports2.initAccordions = void 0;
                  var Default12 = {
                    alwaysOpen: false,
                    activeClasses: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
                    inactiveClasses: "text-gray-500 dark:text-gray-400",
                    onOpen: function() {
                    },
                    onClose: function() {
                    },
                    onToggle: function() {
                    }
                  };
                  var Accordion2 = (
                    /** @class */
                    function() {
                      function Accordion3(items, options) {
                        if (items === void 0) {
                          items = [];
                        }
                        if (options === void 0) {
                          options = Default12;
                        }
                        this._items = items;
                        this._options = __assign12(__assign12({}, Default12), options);
                        this._init();
                      }
                      Accordion3.prototype._init = function() {
                        var _this = this;
                        if (this._items.length) {
                          this._items.map(function(item) {
                            if (item.active) {
                              _this.open(item.id);
                            }
                            item.triggerEl.addEventListener("click", function() {
                              _this.toggle(item.id);
                            });
                          });
                        }
                      };
                      Accordion3.prototype.getItem = function(id) {
                        return this._items.filter(function(item) {
                          return item.id === id;
                        })[0];
                      };
                      Accordion3.prototype.open = function(id) {
                        var _a, _b;
                        var _this = this;
                        var item = this.getItem(id);
                        if (!this._options.alwaysOpen) {
                          this._items.map(function(i) {
                            var _a2, _b2;
                            if (i !== item) {
                              (_a2 = i.triggerEl.classList).remove.apply(_a2, _this._options.activeClasses.split(" "));
                              (_b2 = i.triggerEl.classList).add.apply(_b2, _this._options.inactiveClasses.split(" "));
                              i.targetEl.classList.add("hidden");
                              i.triggerEl.setAttribute("aria-expanded", "false");
                              i.active = false;
                              if (i.iconEl) {
                                i.iconEl.classList.remove("rotate-180");
                              }
                            }
                          });
                        }
                        (_a = item.triggerEl.classList).add.apply(_a, this._options.activeClasses.split(" "));
                        (_b = item.triggerEl.classList).remove.apply(_b, this._options.inactiveClasses.split(" "));
                        item.triggerEl.setAttribute("aria-expanded", "true");
                        item.targetEl.classList.remove("hidden");
                        item.active = true;
                        if (item.iconEl) {
                          item.iconEl.classList.add("rotate-180");
                        }
                        this._options.onOpen(this, item);
                      };
                      Accordion3.prototype.toggle = function(id) {
                        var item = this.getItem(id);
                        if (item.active) {
                          this.close(id);
                        } else {
                          this.open(id);
                        }
                        this._options.onToggle(this, item);
                      };
                      Accordion3.prototype.close = function(id) {
                        var _a, _b;
                        var item = this.getItem(id);
                        (_a = item.triggerEl.classList).remove.apply(_a, this._options.activeClasses.split(" "));
                        (_b = item.triggerEl.classList).add.apply(_b, this._options.inactiveClasses.split(" "));
                        item.targetEl.classList.add("hidden");
                        item.triggerEl.setAttribute("aria-expanded", "false");
                        item.active = false;
                        if (item.iconEl) {
                          item.iconEl.classList.remove("rotate-180");
                        }
                        this._options.onClose(this, item);
                      };
                      return Accordion3;
                    }()
                  );
                  function initAccordions2() {
                    document.querySelectorAll("[data-accordion]").forEach(function($accordionEl) {
                      var alwaysOpen = $accordionEl.getAttribute("data-accordion");
                      var activeClasses = $accordionEl.getAttribute("data-active-classes");
                      var inactiveClasses = $accordionEl.getAttribute("data-inactive-classes");
                      var items = [];
                      $accordionEl.querySelectorAll("[data-accordion-target]").forEach(function($triggerEl) {
                        if ($triggerEl.closest("[data-accordion]") === $accordionEl) {
                          var item = {
                            id: $triggerEl.getAttribute("data-accordion-target"),
                            triggerEl: $triggerEl,
                            targetEl: document.querySelector($triggerEl.getAttribute("data-accordion-target")),
                            iconEl: $triggerEl.querySelector("[data-accordion-icon]"),
                            active: $triggerEl.getAttribute("aria-expanded") === "true" ? true : false
                          };
                          items.push(item);
                        }
                      });
                      new Accordion2(items, {
                        alwaysOpen: alwaysOpen === "open" ? true : false,
                        activeClasses: activeClasses ? activeClasses : Default12.activeClasses,
                        inactiveClasses: inactiveClasses ? inactiveClasses : Default12.inactiveClasses
                      });
                    });
                  }
                  exports2.initAccordions = initAccordions2;
                  if (typeof window !== "undefined") {
                    window.Accordion = Accordion2;
                    window.initAccordions = initAccordions2;
                  }
                  exports2["default"] = Accordion2;
                }
              ),
              /***/
              33: (
                /***/
                function(__unused_webpack_module, exports2) {
                  var __assign12 = this && this.__assign || function() {
                    __assign12 = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign12.apply(this, arguments);
                  };
                  Object.defineProperty(exports2, "__esModule", { value: true });
                  exports2.initCarousels = void 0;
                  var Default12 = {
                    defaultPosition: 0,
                    indicators: {
                      items: [],
                      activeClasses: "bg-white dark:bg-gray-800",
                      inactiveClasses: "bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800"
                    },
                    interval: 3e3,
                    onNext: function() {
                    },
                    onPrev: function() {
                    },
                    onChange: function() {
                    }
                  };
                  var Carousel2 = (
                    /** @class */
                    function() {
                      function Carousel3(items, options) {
                        if (items === void 0) {
                          items = [];
                        }
                        if (options === void 0) {
                          options = Default12;
                        }
                        this._items = items;
                        this._options = __assign12(__assign12(__assign12({}, Default12), options), { indicators: __assign12(__assign12({}, Default12.indicators), options.indicators) });
                        this._activeItem = this.getItem(this._options.defaultPosition);
                        this._indicators = this._options.indicators.items;
                        this._intervalDuration = this._options.interval;
                        this._intervalInstance = null;
                        this._init();
                      }
                      Carousel3.prototype._init = function() {
                        var _this = this;
                        this._items.map(function(item) {
                          item.el.classList.add("absolute", "inset-0", "transition-transform", "transform");
                        });
                        if (this._getActiveItem()) {
                          this.slideTo(this._getActiveItem().position);
                        } else {
                          this.slideTo(0);
                        }
                        this._indicators.map(function(indicator, position) {
                          indicator.el.addEventListener("click", function() {
                            _this.slideTo(position);
                          });
                        });
                      };
                      Carousel3.prototype.getItem = function(position) {
                        return this._items[position];
                      };
                      Carousel3.prototype.slideTo = function(position) {
                        var nextItem = this._items[position];
                        var rotationItems = {
                          left: nextItem.position === 0 ? this._items[this._items.length - 1] : this._items[nextItem.position - 1],
                          middle: nextItem,
                          right: nextItem.position === this._items.length - 1 ? this._items[0] : this._items[nextItem.position + 1]
                        };
                        this._rotate(rotationItems);
                        this._setActiveItem(nextItem);
                        if (this._intervalInstance) {
                          this.pause();
                          this.cycle();
                        }
                        this._options.onChange(this);
                      };
                      Carousel3.prototype.next = function() {
                        var activeItem = this._getActiveItem();
                        var nextItem = null;
                        if (activeItem.position === this._items.length - 1) {
                          nextItem = this._items[0];
                        } else {
                          nextItem = this._items[activeItem.position + 1];
                        }
                        this.slideTo(nextItem.position);
                        this._options.onNext(this);
                      };
                      Carousel3.prototype.prev = function() {
                        var activeItem = this._getActiveItem();
                        var prevItem = null;
                        if (activeItem.position === 0) {
                          prevItem = this._items[this._items.length - 1];
                        } else {
                          prevItem = this._items[activeItem.position - 1];
                        }
                        this.slideTo(prevItem.position);
                        this._options.onPrev(this);
                      };
                      Carousel3.prototype._rotate = function(rotationItems) {
                        this._items.map(function(item) {
                          item.el.classList.add("hidden");
                        });
                        rotationItems.left.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-20");
                        rotationItems.left.el.classList.add("-translate-x-full", "z-10");
                        rotationItems.middle.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-10");
                        rotationItems.middle.el.classList.add("translate-x-0", "z-20");
                        rotationItems.right.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-20");
                        rotationItems.right.el.classList.add("translate-x-full", "z-10");
                      };
                      Carousel3.prototype.cycle = function() {
                        var _this = this;
                        if (typeof window !== "undefined") {
                          this._intervalInstance = window.setInterval(function() {
                            _this.next();
                          }, this._intervalDuration);
                        }
                      };
                      Carousel3.prototype.pause = function() {
                        clearInterval(this._intervalInstance);
                      };
                      Carousel3.prototype._getActiveItem = function() {
                        return this._activeItem;
                      };
                      Carousel3.prototype._setActiveItem = function(item) {
                        var _a, _b;
                        var _this = this;
                        this._activeItem = item;
                        var position = item.position;
                        if (this._indicators.length) {
                          this._indicators.map(function(indicator) {
                            var _a2, _b2;
                            indicator.el.setAttribute("aria-current", "false");
                            (_a2 = indicator.el.classList).remove.apply(_a2, _this._options.indicators.activeClasses.split(" "));
                            (_b2 = indicator.el.classList).add.apply(_b2, _this._options.indicators.inactiveClasses.split(" "));
                          });
                          (_a = this._indicators[position].el.classList).add.apply(_a, this._options.indicators.activeClasses.split(" "));
                          (_b = this._indicators[position].el.classList).remove.apply(_b, this._options.indicators.inactiveClasses.split(" "));
                          this._indicators[position].el.setAttribute("aria-current", "true");
                        }
                      };
                      return Carousel3;
                    }()
                  );
                  function initCarousels2() {
                    document.querySelectorAll("[data-carousel]").forEach(function($carouselEl) {
                      var interval = $carouselEl.getAttribute("data-carousel-interval");
                      var slide = $carouselEl.getAttribute("data-carousel") === "slide" ? true : false;
                      var items = [];
                      var defaultPosition = 0;
                      if ($carouselEl.querySelectorAll("[data-carousel-item]").length) {
                        Array.from($carouselEl.querySelectorAll("[data-carousel-item]")).map(function($carouselItemEl, position) {
                          items.push({
                            position,
                            el: $carouselItemEl
                          });
                          if ($carouselItemEl.getAttribute("data-carousel-item") === "active") {
                            defaultPosition = position;
                          }
                        });
                      }
                      var indicators = [];
                      if ($carouselEl.querySelectorAll("[data-carousel-slide-to]").length) {
                        Array.from($carouselEl.querySelectorAll("[data-carousel-slide-to]")).map(function($indicatorEl) {
                          indicators.push({
                            position: parseInt($indicatorEl.getAttribute("data-carousel-slide-to")),
                            el: $indicatorEl
                          });
                        });
                      }
                      var carousel = new Carousel2(items, {
                        defaultPosition,
                        indicators: {
                          items: indicators
                        },
                        interval: interval ? interval : Default12.interval
                      });
                      if (slide) {
                        carousel.cycle();
                      }
                      var carouselNextEl = $carouselEl.querySelector("[data-carousel-next]");
                      var carouselPrevEl = $carouselEl.querySelector("[data-carousel-prev]");
                      if (carouselNextEl) {
                        carouselNextEl.addEventListener("click", function() {
                          carousel.next();
                        });
                      }
                      if (carouselPrevEl) {
                        carouselPrevEl.addEventListener("click", function() {
                          carousel.prev();
                        });
                      }
                    });
                  }
                  exports2.initCarousels = initCarousels2;
                  if (typeof window !== "undefined") {
                    window.Carousel = Carousel2;
                    window.initCarousels = initCarousels2;
                  }
                  exports2["default"] = Carousel2;
                }
              ),
              /***/
              922: (
                /***/
                function(__unused_webpack_module, exports2) {
                  var __assign12 = this && this.__assign || function() {
                    __assign12 = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign12.apply(this, arguments);
                  };
                  Object.defineProperty(exports2, "__esModule", { value: true });
                  exports2.initCollapses = void 0;
                  var Default12 = {
                    onCollapse: function() {
                    },
                    onExpand: function() {
                    },
                    onToggle: function() {
                    }
                  };
                  var Collapse2 = (
                    /** @class */
                    function() {
                      function Collapse3(targetEl, triggerEl, options) {
                        if (targetEl === void 0) {
                          targetEl = null;
                        }
                        if (triggerEl === void 0) {
                          triggerEl = null;
                        }
                        if (options === void 0) {
                          options = Default12;
                        }
                        this._targetEl = targetEl;
                        this._triggerEl = triggerEl;
                        this._options = __assign12(__assign12({}, Default12), options);
                        this._visible = false;
                        this._init();
                      }
                      Collapse3.prototype._init = function() {
                        var _this = this;
                        if (this._triggerEl) {
                          if (this._triggerEl.hasAttribute("aria-expanded")) {
                            this._visible = this._triggerEl.getAttribute("aria-expanded") === "true";
                          } else {
                            this._visible = !this._targetEl.classList.contains("hidden");
                          }
                          this._triggerEl.addEventListener("click", function() {
                            _this.toggle();
                          });
                        }
                      };
                      Collapse3.prototype.collapse = function() {
                        this._targetEl.classList.add("hidden");
                        if (this._triggerEl) {
                          this._triggerEl.setAttribute("aria-expanded", "false");
                        }
                        this._visible = false;
                        this._options.onCollapse(this);
                      };
                      Collapse3.prototype.expand = function() {
                        this._targetEl.classList.remove("hidden");
                        if (this._triggerEl) {
                          this._triggerEl.setAttribute("aria-expanded", "true");
                        }
                        this._visible = true;
                        this._options.onExpand(this);
                      };
                      Collapse3.prototype.toggle = function() {
                        if (this._visible) {
                          this.collapse();
                        } else {
                          this.expand();
                        }
                        this._options.onToggle(this);
                      };
                      return Collapse3;
                    }()
                  );
                  function initCollapses2() {
                    document.querySelectorAll("[data-collapse-toggle]").forEach(function($triggerEl) {
                      var targetId = $triggerEl.getAttribute("data-collapse-toggle");
                      var $targetEl = document.getElementById(targetId);
                      if ($targetEl) {
                        new Collapse2($targetEl, $triggerEl);
                      } else {
                        console.error('The target element with id "'.concat(targetId, '" does not exist. Please check the data-collapse-toggle attribute.'));
                      }
                    });
                  }
                  exports2.initCollapses = initCollapses2;
                  if (typeof window !== "undefined") {
                    window.Collapse = Collapse2;
                    window.initCollapses = initCollapses2;
                  }
                  exports2["default"] = Collapse2;
                }
              ),
              /***/
              556: (
                /***/
                function(__unused_webpack_module, exports2) {
                  var __assign12 = this && this.__assign || function() {
                    __assign12 = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign12.apply(this, arguments);
                  };
                  Object.defineProperty(exports2, "__esModule", { value: true });
                  exports2.initDials = void 0;
                  var Default12 = {
                    triggerType: "hover",
                    onShow: function() {
                    },
                    onHide: function() {
                    },
                    onToggle: function() {
                    }
                  };
                  var Dial2 = (
                    /** @class */
                    function() {
                      function Dial3(parentEl, triggerEl, targetEl, options) {
                        if (parentEl === void 0) {
                          parentEl = null;
                        }
                        if (triggerEl === void 0) {
                          triggerEl = null;
                        }
                        if (targetEl === void 0) {
                          targetEl = null;
                        }
                        if (options === void 0) {
                          options = Default12;
                        }
                        this._parentEl = parentEl;
                        this._triggerEl = triggerEl;
                        this._targetEl = targetEl;
                        this._options = __assign12(__assign12({}, Default12), options);
                        this._visible = false;
                        this._init();
                      }
                      Dial3.prototype._init = function() {
                        var _this = this;
                        if (this._triggerEl) {
                          var triggerEventTypes = this._getTriggerEventTypes(this._options.triggerType);
                          triggerEventTypes.showEvents.forEach(function(ev) {
                            _this._triggerEl.addEventListener(ev, function() {
                              _this.show();
                            });
                            _this._targetEl.addEventListener(ev, function() {
                              _this.show();
                            });
                          });
                          triggerEventTypes.hideEvents.forEach(function(ev) {
                            _this._parentEl.addEventListener(ev, function() {
                              if (!_this._parentEl.matches(":hover")) {
                                _this.hide();
                              }
                            });
                          });
                        }
                      };
                      Dial3.prototype.hide = function() {
                        this._targetEl.classList.add("hidden");
                        if (this._triggerEl) {
                          this._triggerEl.setAttribute("aria-expanded", "false");
                        }
                        this._visible = false;
                        this._options.onHide(this);
                      };
                      Dial3.prototype.show = function() {
                        this._targetEl.classList.remove("hidden");
                        if (this._triggerEl) {
                          this._triggerEl.setAttribute("aria-expanded", "true");
                        }
                        this._visible = true;
                        this._options.onShow(this);
                      };
                      Dial3.prototype.toggle = function() {
                        if (this._visible) {
                          this.hide();
                        } else {
                          this.show();
                        }
                      };
                      Dial3.prototype.isHidden = function() {
                        return !this._visible;
                      };
                      Dial3.prototype.isVisible = function() {
                        return this._visible;
                      };
                      Dial3.prototype._getTriggerEventTypes = function(triggerType) {
                        switch (triggerType) {
                          case "hover":
                            return {
                              showEvents: ["mouseenter", "focus"],
                              hideEvents: ["mouseleave", "blur"]
                            };
                          case "click":
                            return {
                              showEvents: ["click", "focus"],
                              hideEvents: ["focusout", "blur"]
                            };
                          case "none":
                            return {
                              showEvents: [],
                              hideEvents: []
                            };
                          default:
                            return {
                              showEvents: ["mouseenter", "focus"],
                              hideEvents: ["mouseleave", "blur"]
                            };
                        }
                      };
                      return Dial3;
                    }()
                  );
                  function initDials2() {
                    document.querySelectorAll("[data-dial-init]").forEach(function($parentEl) {
                      var $triggerEl = $parentEl.querySelector("[data-dial-toggle]");
                      if ($triggerEl) {
                        var dialId = $triggerEl.getAttribute("data-dial-toggle");
                        var $dialEl = document.getElementById(dialId);
                        if ($dialEl) {
                          var triggerType = $triggerEl.getAttribute("data-dial-trigger");
                          new Dial2($parentEl, $triggerEl, $dialEl, {
                            triggerType: triggerType ? triggerType : Default12.triggerType
                          });
                        } else {
                          console.error("Dial with id ".concat(dialId, " does not exist. Are you sure that the data-dial-toggle attribute points to the correct modal id?"));
                        }
                      } else {
                        console.error("Dial with id ".concat($parentEl.id, " does not have a trigger element. Are you sure that the data-dial-toggle attribute exists?"));
                      }
                    });
                  }
                  exports2.initDials = initDials2;
                  if (typeof window !== "undefined") {
                    window.Dial = Dial2;
                    window.initDials = initDials2;
                  }
                  exports2["default"] = Dial2;
                }
              ),
              /***/
              791: (
                /***/
                function(__unused_webpack_module, exports2) {
                  var __assign12 = this && this.__assign || function() {
                    __assign12 = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign12.apply(this, arguments);
                  };
                  Object.defineProperty(exports2, "__esModule", { value: true });
                  exports2.initDismisses = void 0;
                  var Default12 = {
                    transition: "transition-opacity",
                    duration: 300,
                    timing: "ease-out",
                    onHide: function() {
                    }
                  };
                  var Dismiss2 = (
                    /** @class */
                    function() {
                      function Dismiss3(targetEl, triggerEl, options) {
                        if (targetEl === void 0) {
                          targetEl = null;
                        }
                        if (triggerEl === void 0) {
                          triggerEl = null;
                        }
                        if (options === void 0) {
                          options = Default12;
                        }
                        this._targetEl = targetEl;
                        this._triggerEl = triggerEl;
                        this._options = __assign12(__assign12({}, Default12), options);
                        this._init();
                      }
                      Dismiss3.prototype._init = function() {
                        var _this = this;
                        if (this._triggerEl) {
                          this._triggerEl.addEventListener("click", function() {
                            _this.hide();
                          });
                        }
                      };
                      Dismiss3.prototype.hide = function() {
                        var _this = this;
                        this._targetEl.classList.add(this._options.transition, "duration-".concat(this._options.duration), this._options.timing, "opacity-0");
                        setTimeout(function() {
                          _this._targetEl.classList.add("hidden");
                        }, this._options.duration);
                        this._options.onHide(this, this._targetEl);
                      };
                      return Dismiss3;
                    }()
                  );
                  function initDismisses2() {
                    document.querySelectorAll("[data-dismiss-target]").forEach(function($triggerEl) {
                      var targetId = $triggerEl.getAttribute("data-dismiss-target");
                      var $dismissEl = document.querySelector(targetId);
                      if ($dismissEl) {
                        new Dismiss2($dismissEl, $triggerEl);
                      } else {
                        console.error('The dismiss element with id "'.concat(targetId, '" does not exist. Please check the data-dismiss-target attribute.'));
                      }
                    });
                  }
                  exports2.initDismisses = initDismisses2;
                  if (typeof window !== "undefined") {
                    window.Dismiss = Dismiss2;
                    window.initDismisses = initDismisses2;
                  }
                  exports2["default"] = Dismiss2;
                }
              ),
              /***/
              340: (
                /***/
                function(__unused_webpack_module, exports2) {
                  var __assign12 = this && this.__assign || function() {
                    __assign12 = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign12.apply(this, arguments);
                  };
                  Object.defineProperty(exports2, "__esModule", { value: true });
                  exports2.initDrawers = void 0;
                  var Default12 = {
                    placement: "left",
                    bodyScrolling: false,
                    backdrop: true,
                    edge: false,
                    edgeOffset: "bottom-[60px]",
                    backdropClasses: "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-30",
                    onShow: function() {
                    },
                    onHide: function() {
                    },
                    onToggle: function() {
                    }
                  };
                  var Drawer2 = (
                    /** @class */
                    function() {
                      function Drawer3(targetEl, options) {
                        if (targetEl === void 0) {
                          targetEl = null;
                        }
                        if (options === void 0) {
                          options = Default12;
                        }
                        this._targetEl = targetEl;
                        this._options = __assign12(__assign12({}, Default12), options);
                        this._visible = false;
                        this._init();
                      }
                      Drawer3.prototype._init = function() {
                        var _this = this;
                        if (this._targetEl) {
                          this._targetEl.setAttribute("aria-hidden", "true");
                          this._targetEl.classList.add("transition-transform");
                        }
                        this._getPlacementClasses(this._options.placement).base.map(function(c) {
                          _this._targetEl.classList.add(c);
                        });
                        document.addEventListener("keydown", function(event) {
                          if (event.key === "Escape") {
                            if (_this.isVisible()) {
                              _this.hide();
                            }
                          }
                        });
                      };
                      Drawer3.prototype.hide = function() {
                        var _this = this;
                        if (this._options.edge) {
                          this._getPlacementClasses(this._options.placement + "-edge").active.map(function(c) {
                            _this._targetEl.classList.remove(c);
                          });
                          this._getPlacementClasses(this._options.placement + "-edge").inactive.map(function(c) {
                            _this._targetEl.classList.add(c);
                          });
                        } else {
                          this._getPlacementClasses(this._options.placement).active.map(function(c) {
                            _this._targetEl.classList.remove(c);
                          });
                          this._getPlacementClasses(this._options.placement).inactive.map(function(c) {
                            _this._targetEl.classList.add(c);
                          });
                        }
                        this._targetEl.setAttribute("aria-hidden", "true");
                        this._targetEl.removeAttribute("aria-modal");
                        this._targetEl.removeAttribute("role");
                        if (!this._options.bodyScrolling) {
                          document.body.classList.remove("overflow-hidden");
                        }
                        if (this._options.backdrop) {
                          this._destroyBackdropEl();
                        }
                        this._visible = false;
                        this._options.onHide(this);
                      };
                      Drawer3.prototype.show = function() {
                        var _this = this;
                        if (this._options.edge) {
                          this._getPlacementClasses(this._options.placement + "-edge").active.map(function(c) {
                            _this._targetEl.classList.add(c);
                          });
                          this._getPlacementClasses(this._options.placement + "-edge").inactive.map(function(c) {
                            _this._targetEl.classList.remove(c);
                          });
                        } else {
                          this._getPlacementClasses(this._options.placement).active.map(function(c) {
                            _this._targetEl.classList.add(c);
                          });
                          this._getPlacementClasses(this._options.placement).inactive.map(function(c) {
                            _this._targetEl.classList.remove(c);
                          });
                        }
                        this._targetEl.setAttribute("aria-modal", "true");
                        this._targetEl.setAttribute("role", "dialog");
                        this._targetEl.removeAttribute("aria-hidden");
                        if (!this._options.bodyScrolling) {
                          document.body.classList.add("overflow-hidden");
                        }
                        if (this._options.backdrop) {
                          this._createBackdrop();
                        }
                        this._visible = true;
                        this._options.onShow(this);
                      };
                      Drawer3.prototype.toggle = function() {
                        if (this.isVisible()) {
                          this.hide();
                        } else {
                          this.show();
                        }
                      };
                      Drawer3.prototype._createBackdrop = function() {
                        var _a;
                        var _this = this;
                        if (!this._visible) {
                          var backdropEl = document.createElement("div");
                          backdropEl.setAttribute("drawer-backdrop", "");
                          (_a = backdropEl.classList).add.apply(_a, this._options.backdropClasses.split(" "));
                          document.querySelector("body").append(backdropEl);
                          backdropEl.addEventListener("click", function() {
                            _this.hide();
                          });
                        }
                      };
                      Drawer3.prototype._destroyBackdropEl = function() {
                        if (this._visible) {
                          document.querySelector("[drawer-backdrop]").remove();
                        }
                      };
                      Drawer3.prototype._getPlacementClasses = function(placement) {
                        switch (placement) {
                          case "top":
                            return {
                              base: ["top-0", "left-0", "right-0"],
                              active: ["transform-none"],
                              inactive: ["-translate-y-full"]
                            };
                          case "right":
                            return {
                              base: ["right-0", "top-0"],
                              active: ["transform-none"],
                              inactive: ["translate-x-full"]
                            };
                          case "bottom":
                            return {
                              base: ["bottom-0", "left-0", "right-0"],
                              active: ["transform-none"],
                              inactive: ["translate-y-full"]
                            };
                          case "left":
                            return {
                              base: ["left-0", "top-0"],
                              active: ["transform-none"],
                              inactive: ["-translate-x-full"]
                            };
                          case "bottom-edge":
                            return {
                              base: ["left-0", "top-0"],
                              active: ["transform-none"],
                              inactive: ["translate-y-full", this._options.edgeOffset]
                            };
                          default:
                            return {
                              base: ["left-0", "top-0"],
                              active: ["transform-none"],
                              inactive: ["-translate-x-full"]
                            };
                        }
                      };
                      Drawer3.prototype.isHidden = function() {
                        return !this._visible;
                      };
                      Drawer3.prototype.isVisible = function() {
                        return this._visible;
                      };
                      return Drawer3;
                    }()
                  );
                  var getDrawerInstance2 = function(id, instances) {
                    if (instances.some(function(drawerInstance) {
                      return drawerInstance.id === id;
                    })) {
                      return instances.find(function(drawerInstance) {
                        return drawerInstance.id === id;
                      });
                    }
                  };
                  function initDrawers2() {
                    var drawerInstances = [];
                    document.querySelectorAll("[data-drawer-target]").forEach(function($triggerEl) {
                      var drawerId = $triggerEl.getAttribute("data-drawer-target");
                      var $drawerEl = document.getElementById(drawerId);
                      if ($drawerEl) {
                        var placement = $triggerEl.getAttribute("data-drawer-placement");
                        var bodyScrolling = $triggerEl.getAttribute("data-drawer-body-scrolling");
                        var backdrop = $triggerEl.getAttribute("data-drawer-backdrop");
                        var edge = $triggerEl.getAttribute("data-drawer-edge");
                        var edgeOffset = $triggerEl.getAttribute("data-drawer-edge-offset");
                        if (!getDrawerInstance2(drawerId, drawerInstances)) {
                          drawerInstances.push({
                            id: drawerId,
                            object: new Drawer2($drawerEl, {
                              placement: placement ? placement : Default12.placement,
                              bodyScrolling: bodyScrolling ? bodyScrolling === "true" ? true : false : Default12.bodyScrolling,
                              backdrop: backdrop ? backdrop === "true" ? true : false : Default12.backdrop,
                              edge: edge ? edge === "true" ? true : false : Default12.edge,
                              edgeOffset: edgeOffset ? edgeOffset : Default12.edgeOffset
                            })
                          });
                        }
                      } else {
                        console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
                      }
                    });
                    document.querySelectorAll("[data-drawer-toggle]").forEach(function($triggerEl) {
                      var drawerId = $triggerEl.getAttribute("data-drawer-toggle");
                      var $drawerEl = document.getElementById(drawerId);
                      if ($drawerEl) {
                        var drawer_1 = getDrawerInstance2(drawerId, drawerInstances);
                        if (drawer_1) {
                          $triggerEl.addEventListener("click", function() {
                            drawer_1.object.toggle();
                          });
                        } else {
                          console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
                        }
                      } else {
                        console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
                      }
                    });
                    document.querySelectorAll("[data-drawer-dismiss], [data-drawer-hide]").forEach(function($triggerEl) {
                      var drawerId = $triggerEl.getAttribute("data-drawer-dismiss") ? $triggerEl.getAttribute("data-drawer-dismiss") : $triggerEl.getAttribute("data-drawer-hide");
                      var $drawerEl = document.getElementById(drawerId);
                      if ($drawerEl) {
                        var drawer_2 = getDrawerInstance2(drawerId, drawerInstances);
                        if (drawer_2) {
                          $triggerEl.addEventListener("click", function() {
                            drawer_2.object.hide();
                          });
                        } else {
                          console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
                        }
                      } else {
                        console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id"));
                      }
                    });
                    document.querySelectorAll("[data-drawer-show]").forEach(function($triggerEl) {
                      var drawerId = $triggerEl.getAttribute("data-drawer-show");
                      var $drawerEl = document.getElementById(drawerId);
                      if ($drawerEl) {
                        var drawer_3 = getDrawerInstance2(drawerId, drawerInstances);
                        if (drawer_3) {
                          $triggerEl.addEventListener("click", function() {
                            drawer_3.object.show();
                          });
                        } else {
                          console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
                        }
                      } else {
                        console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
                      }
                    });
                  }
                  exports2.initDrawers = initDrawers2;
                  if (typeof window !== "undefined") {
                    window.Drawer = Drawer2;
                    window.initDrawers = initDrawers2;
                  }
                  exports2["default"] = Drawer2;
                }
              ),
              /***/
              316: (
                /***/
                function(__unused_webpack_module, exports2, __webpack_require__2) {
                  var __assign12 = this && this.__assign || function() {
                    __assign12 = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign12.apply(this, arguments);
                  };
                  var __spreadArray4 = this && this.__spreadArray || function(to, from, pack) {
                    if (pack || arguments.length === 2)
                      for (var i = 0, l = from.length, ar; i < l; i++) {
                        if (ar || !(i in from)) {
                          if (!ar)
                            ar = Array.prototype.slice.call(from, 0, i);
                          ar[i] = from[i];
                        }
                      }
                    return to.concat(ar || Array.prototype.slice.call(from));
                  };
                  Object.defineProperty(exports2, "__esModule", { value: true });
                  exports2.initDropdowns = void 0;
                  var core_1 = __webpack_require__2(853);
                  var Default12 = {
                    placement: "bottom",
                    triggerType: "click",
                    offsetSkidding: 0,
                    offsetDistance: 10,
                    delay: 300,
                    ignoreClickOutsideClass: false,
                    onShow: function() {
                    },
                    onHide: function() {
                    },
                    onToggle: function() {
                    }
                  };
                  var Dropdown2 = (
                    /** @class */
                    function() {
                      function Dropdown3(targetElement, triggerElement, options) {
                        if (targetElement === void 0) {
                          targetElement = null;
                        }
                        if (triggerElement === void 0) {
                          triggerElement = null;
                        }
                        if (options === void 0) {
                          options = Default12;
                        }
                        this._targetEl = targetElement;
                        this._triggerEl = triggerElement;
                        this._options = __assign12(__assign12({}, Default12), options);
                        this._popperInstance = this._createPopperInstance();
                        this._visible = false;
                        this._init();
                      }
                      Dropdown3.prototype._init = function() {
                        if (this._triggerEl) {
                          this._setupEventListeners();
                        }
                      };
                      Dropdown3.prototype._setupEventListeners = function() {
                        var _this = this;
                        var triggerEvents = this._getTriggerEvents();
                        if (this._options.triggerType === "click") {
                          triggerEvents.showEvents.forEach(function(ev) {
                            _this._triggerEl.addEventListener(ev, function() {
                              _this.toggle();
                            });
                          });
                        }
                        if (this._options.triggerType === "hover") {
                          triggerEvents.showEvents.forEach(function(ev) {
                            _this._triggerEl.addEventListener(ev, function() {
                              if (ev === "click") {
                                _this.toggle();
                              } else {
                                setTimeout(function() {
                                  _this.show();
                                }, _this._options.delay);
                              }
                            });
                            _this._targetEl.addEventListener(ev, function() {
                              _this.show();
                            });
                          });
                          triggerEvents.hideEvents.forEach(function(ev) {
                            _this._triggerEl.addEventListener(ev, function() {
                              setTimeout(function() {
                                if (!_this._targetEl.matches(":hover")) {
                                  _this.hide();
                                }
                              }, _this._options.delay);
                            });
                            _this._targetEl.addEventListener(ev, function() {
                              setTimeout(function() {
                                if (!_this._triggerEl.matches(":hover")) {
                                  _this.hide();
                                }
                              }, _this._options.delay);
                            });
                          });
                        }
                      };
                      Dropdown3.prototype._createPopperInstance = function() {
                        return (0, core_1.createPopper)(this._triggerEl, this._targetEl, {
                          placement: this._options.placement,
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [
                                  this._options.offsetSkidding,
                                  this._options.offsetDistance
                                ]
                              }
                            }
                          ]
                        });
                      };
                      Dropdown3.prototype._setupClickOutsideListener = function() {
                        var _this = this;
                        this._clickOutsideEventListener = function(ev) {
                          _this._handleClickOutside(ev, _this._targetEl);
                        };
                        document.body.addEventListener("click", this._clickOutsideEventListener, true);
                      };
                      Dropdown3.prototype._removeClickOutsideListener = function() {
                        document.body.removeEventListener("click", this._clickOutsideEventListener, true);
                      };
                      Dropdown3.prototype._handleClickOutside = function(ev, targetEl) {
                        var clickedEl = ev.target;
                        var ignoreClickOutsideClass = this._options.ignoreClickOutsideClass;
                        var isIgnored = false;
                        if (ignoreClickOutsideClass) {
                          var ignoredClickOutsideEls = document.querySelectorAll(".".concat(ignoreClickOutsideClass));
                          ignoredClickOutsideEls.forEach(function(el) {
                            if (el.contains(clickedEl)) {
                              isIgnored = true;
                              return;
                            }
                          });
                        }
                        if (clickedEl !== targetEl && !targetEl.contains(clickedEl) && !this._triggerEl.contains(clickedEl) && !isIgnored && this.isVisible()) {
                          this.hide();
                        }
                      };
                      Dropdown3.prototype._getTriggerEvents = function() {
                        switch (this._options.triggerType) {
                          case "hover":
                            return {
                              showEvents: ["mouseenter", "click"],
                              hideEvents: ["mouseleave"]
                            };
                          case "click":
                            return {
                              showEvents: ["click"],
                              hideEvents: []
                            };
                          case "none":
                            return {
                              showEvents: [],
                              hideEvents: []
                            };
                          default:
                            return {
                              showEvents: ["click"],
                              hideEvents: []
                            };
                        }
                      };
                      Dropdown3.prototype.toggle = function() {
                        if (this.isVisible()) {
                          this.hide();
                        } else {
                          this.show();
                        }
                        this._options.onToggle(this);
                      };
                      Dropdown3.prototype.isVisible = function() {
                        return this._visible;
                      };
                      Dropdown3.prototype.show = function() {
                        this._targetEl.classList.remove("hidden");
                        this._targetEl.classList.add("block");
                        this._popperInstance.setOptions(function(options) {
                          return __assign12(__assign12({}, options), { modifiers: __spreadArray4(__spreadArray4([], options.modifiers, true), [
                            { name: "eventListeners", enabled: true }
                          ], false) });
                        });
                        this._setupClickOutsideListener();
                        this._popperInstance.update();
                        this._visible = true;
                        this._options.onShow(this);
                      };
                      Dropdown3.prototype.hide = function() {
                        this._targetEl.classList.remove("block");
                        this._targetEl.classList.add("hidden");
                        this._popperInstance.setOptions(function(options) {
                          return __assign12(__assign12({}, options), { modifiers: __spreadArray4(__spreadArray4([], options.modifiers, true), [
                            { name: "eventListeners", enabled: false }
                          ], false) });
                        });
                        this._visible = false;
                        this._removeClickOutsideListener();
                        this._options.onHide(this);
                      };
                      return Dropdown3;
                    }()
                  );
                  function initDropdowns2() {
                    document.querySelectorAll("[data-dropdown-toggle]").forEach(function($triggerEl) {
                      var dropdownId = $triggerEl.getAttribute("data-dropdown-toggle");
                      var $dropdownEl = document.getElementById(dropdownId);
                      if ($dropdownEl) {
                        var placement = $triggerEl.getAttribute("data-dropdown-placement");
                        var offsetSkidding = $triggerEl.getAttribute("data-dropdown-offset-skidding");
                        var offsetDistance = $triggerEl.getAttribute("data-dropdown-offset-distance");
                        var triggerType = $triggerEl.getAttribute("data-dropdown-trigger");
                        var delay = $triggerEl.getAttribute("data-dropdown-delay");
                        var ignoreClickOutsideClass = $triggerEl.getAttribute("data-dropdown-ignore-click-outside-class");
                        new Dropdown2($dropdownEl, $triggerEl, {
                          placement: placement ? placement : Default12.placement,
                          triggerType: triggerType ? triggerType : Default12.triggerType,
                          offsetSkidding: offsetSkidding ? parseInt(offsetSkidding) : Default12.offsetSkidding,
                          offsetDistance: offsetDistance ? parseInt(offsetDistance) : Default12.offsetDistance,
                          delay: delay ? parseInt(delay) : Default12.delay,
                          ignoreClickOutsideClass: ignoreClickOutsideClass ? ignoreClickOutsideClass : Default12.ignoreClickOutsideClass
                        });
                      } else {
                        console.error('The dropdown element with id "'.concat(dropdownId, '" does not exist. Please check the data-dropdown-toggle attribute.'));
                      }
                    });
                  }
                  exports2.initDropdowns = initDropdowns2;
                  if (typeof window !== "undefined") {
                    window.Dropdown = Dropdown2;
                    window.initDropdowns = initDropdowns2;
                  }
                  exports2["default"] = Dropdown2;
                }
              ),
              /***/
              311: (
                /***/
                function(__unused_webpack_module, exports2, __webpack_require__2) {
                  Object.defineProperty(exports2, "__esModule", { value: true });
                  exports2.initFlowbite = void 0;
                  var accordion_1 = __webpack_require__2(902);
                  var carousel_1 = __webpack_require__2(33);
                  var collapse_1 = __webpack_require__2(922);
                  var dial_1 = __webpack_require__2(556);
                  var dismiss_1 = __webpack_require__2(791);
                  var drawer_1 = __webpack_require__2(340);
                  var dropdown_1 = __webpack_require__2(316);
                  var modal_1 = __webpack_require__2(16);
                  var popover_1 = __webpack_require__2(903);
                  var tabs_1 = __webpack_require__2(247);
                  var tooltip_1 = __webpack_require__2(671);
                  function initFlowbite2() {
                    (0, accordion_1.initAccordions)();
                    (0, collapse_1.initCollapses)();
                    (0, carousel_1.initCarousels)();
                    (0, dismiss_1.initDismisses)();
                    (0, dropdown_1.initDropdowns)();
                    (0, modal_1.initModals)();
                    (0, drawer_1.initDrawers)();
                    (0, tabs_1.initTabs)();
                    (0, tooltip_1.initTooltips)();
                    (0, popover_1.initPopovers)();
                    (0, dial_1.initDials)();
                  }
                  exports2.initFlowbite = initFlowbite2;
                  if (typeof window !== "undefined") {
                    window.initFlowbite = initFlowbite2;
                  }
                }
              ),
              /***/
              16: (
                /***/
                function(__unused_webpack_module, exports2) {
                  var __assign12 = this && this.__assign || function() {
                    __assign12 = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign12.apply(this, arguments);
                  };
                  Object.defineProperty(exports2, "__esModule", { value: true });
                  exports2.initModals = void 0;
                  var Default12 = {
                    placement: "center",
                    backdropClasses: "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40",
                    backdrop: "dynamic",
                    closable: true,
                    onHide: function() {
                    },
                    onShow: function() {
                    },
                    onToggle: function() {
                    }
                  };
                  var Modal2 = (
                    /** @class */
                    function() {
                      function Modal3(targetEl, options) {
                        if (targetEl === void 0) {
                          targetEl = null;
                        }
                        if (options === void 0) {
                          options = Default12;
                        }
                        this._targetEl = targetEl;
                        this._options = __assign12(__assign12({}, Default12), options);
                        this._isHidden = true;
                        this._backdropEl = null;
                        this._init();
                      }
                      Modal3.prototype._init = function() {
                        var _this = this;
                        if (this._targetEl) {
                          this._getPlacementClasses().map(function(c) {
                            _this._targetEl.classList.add(c);
                          });
                        }
                      };
                      Modal3.prototype._createBackdrop = function() {
                        var _a;
                        if (this._isHidden) {
                          var backdropEl = document.createElement("div");
                          backdropEl.setAttribute("modal-backdrop", "");
                          (_a = backdropEl.classList).add.apply(_a, this._options.backdropClasses.split(" "));
                          document.querySelector("body").append(backdropEl);
                          this._backdropEl = backdropEl;
                        }
                      };
                      Modal3.prototype._destroyBackdropEl = function() {
                        if (!this._isHidden) {
                          document.querySelector("[modal-backdrop]").remove();
                        }
                      };
                      Modal3.prototype._setupModalCloseEventListeners = function() {
                        var _this = this;
                        if (this._options.backdrop === "dynamic") {
                          this._clickOutsideEventListener = function(ev) {
                            _this._handleOutsideClick(ev.target);
                          };
                          this._targetEl.addEventListener("click", this._clickOutsideEventListener, true);
                        }
                        this._keydownEventListener = function(ev) {
                          if (ev.key === "Escape") {
                            _this.hide();
                          }
                        };
                        document.body.addEventListener("keydown", this._keydownEventListener, true);
                      };
                      Modal3.prototype._removeModalCloseEventListeners = function() {
                        if (this._options.backdrop === "dynamic") {
                          this._targetEl.removeEventListener("click", this._clickOutsideEventListener, true);
                        }
                        document.body.removeEventListener("keydown", this._keydownEventListener, true);
                      };
                      Modal3.prototype._handleOutsideClick = function(target) {
                        if (target === this._targetEl || target === this._backdropEl && this.isVisible()) {
                          this.hide();
                        }
                      };
                      Modal3.prototype._getPlacementClasses = function() {
                        switch (this._options.placement) {
                          case "top-left":
                            return ["justify-start", "items-start"];
                          case "top-center":
                            return ["justify-center", "items-start"];
                          case "top-right":
                            return ["justify-end", "items-start"];
                          case "center-left":
                            return ["justify-start", "items-center"];
                          case "center":
                            return ["justify-center", "items-center"];
                          case "center-right":
                            return ["justify-end", "items-center"];
                          case "bottom-left":
                            return ["justify-start", "items-end"];
                          case "bottom-center":
                            return ["justify-center", "items-end"];
                          case "bottom-right":
                            return ["justify-end", "items-end"];
                          default:
                            return ["justify-center", "items-center"];
                        }
                      };
                      Modal3.prototype.toggle = function() {
                        if (this._isHidden) {
                          this.show();
                        } else {
                          this.hide();
                        }
                        this._options.onToggle(this);
                      };
                      Modal3.prototype.show = function() {
                        if (this.isHidden) {
                          this._targetEl.classList.add("flex");
                          this._targetEl.classList.remove("hidden");
                          this._targetEl.setAttribute("aria-modal", "true");
                          this._targetEl.setAttribute("role", "dialog");
                          this._targetEl.removeAttribute("aria-hidden");
                          this._createBackdrop();
                          this._isHidden = false;
                          document.body.classList.add("overflow-hidden");
                          if (this._options.closable) {
                            this._setupModalCloseEventListeners();
                          }
                          this._options.onShow(this);
                        }
                      };
                      Modal3.prototype.hide = function() {
                        if (this.isVisible) {
                          this._targetEl.classList.add("hidden");
                          this._targetEl.classList.remove("flex");
                          this._targetEl.setAttribute("aria-hidden", "true");
                          this._targetEl.removeAttribute("aria-modal");
                          this._targetEl.removeAttribute("role");
                          this._destroyBackdropEl();
                          this._isHidden = true;
                          document.body.classList.remove("overflow-hidden");
                          if (this._options.closable) {
                            this._removeModalCloseEventListeners();
                          }
                          this._options.onHide(this);
                        }
                      };
                      Modal3.prototype.isVisible = function() {
                        return !this._isHidden;
                      };
                      Modal3.prototype.isHidden = function() {
                        return this._isHidden;
                      };
                      return Modal3;
                    }()
                  );
                  var getModalInstance2 = function(id, instances) {
                    if (instances.some(function(modalInstance) {
                      return modalInstance.id === id;
                    })) {
                      return instances.find(function(modalInstance) {
                        return modalInstance.id === id;
                      });
                    }
                    return null;
                  };
                  function initModals2() {
                    var modalInstances = [];
                    document.querySelectorAll("[data-modal-target]").forEach(function($triggerEl) {
                      var modalId = $triggerEl.getAttribute("data-modal-target");
                      var $modalEl = document.getElementById(modalId);
                      if ($modalEl) {
                        var placement = $modalEl.getAttribute("data-modal-placement");
                        var backdrop = $modalEl.getAttribute("data-modal-backdrop");
                        if (!getModalInstance2(modalId, modalInstances)) {
                          modalInstances.push({
                            id: modalId,
                            object: new Modal2($modalEl, {
                              placement: placement ? placement : Default12.placement,
                              backdrop: backdrop ? backdrop : Default12.backdrop
                            })
                          });
                        }
                      } else {
                        console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-target attribute points to the correct modal id?."));
                      }
                    });
                    document.querySelectorAll("[data-modal-toggle]").forEach(function($triggerEl) {
                      var modalId = $triggerEl.getAttribute("data-modal-toggle");
                      var $modalEl = document.getElementById(modalId);
                      if ($modalEl) {
                        var placement = $modalEl.getAttribute("data-modal-placement");
                        var backdrop = $modalEl.getAttribute("data-modal-backdrop");
                        var modal_1 = getModalInstance2(modalId, modalInstances);
                        if (!modal_1) {
                          modal_1 = {
                            id: modalId,
                            object: new Modal2($modalEl, {
                              placement: placement ? placement : Default12.placement,
                              backdrop: backdrop ? backdrop : Default12.backdrop
                            })
                          };
                          modalInstances.push(modal_1);
                        }
                        $triggerEl.addEventListener("click", function() {
                          modal_1.object.toggle();
                        });
                      } else {
                        console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-toggle attribute points to the correct modal id?"));
                      }
                    });
                    document.querySelectorAll("[data-modal-show]").forEach(function($triggerEl) {
                      var modalId = $triggerEl.getAttribute("data-modal-show");
                      var $modalEl = document.getElementById(modalId);
                      if ($modalEl) {
                        var modal_2 = getModalInstance2(modalId, modalInstances);
                        if (modal_2) {
                          $triggerEl.addEventListener("click", function() {
                            if (modal_2.object.isHidden) {
                              modal_2.object.show();
                            }
                          });
                        } else {
                          console.error("Modal with id ".concat(modalId, " has not been initialized. Please initialize it using the data-modal-target attribute."));
                        }
                      } else {
                        console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-show attribute points to the correct modal id?"));
                      }
                    });
                    document.querySelectorAll("[data-modal-hide]").forEach(function($triggerEl) {
                      var modalId = $triggerEl.getAttribute("data-modal-hide");
                      var $modalEl = document.getElementById(modalId);
                      if ($modalEl) {
                        var modal_3 = getModalInstance2(modalId, modalInstances);
                        if (modal_3) {
                          $triggerEl.addEventListener("click", function() {
                            if (modal_3.object.isVisible) {
                              modal_3.object.hide();
                            }
                          });
                        } else {
                          console.error("Modal with id ".concat(modalId, " has not been initialized. Please initialize it using the data-modal-target attribute."));
                        }
                      } else {
                        console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-hide attribute points to the correct modal id?"));
                      }
                    });
                  }
                  exports2.initModals = initModals2;
                  if (typeof window !== "undefined") {
                    window.Modal = Modal2;
                    window.initModals = initModals2;
                  }
                  exports2["default"] = Modal2;
                }
              ),
              /***/
              903: (
                /***/
                function(__unused_webpack_module, exports2, __webpack_require__2) {
                  var __assign12 = this && this.__assign || function() {
                    __assign12 = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign12.apply(this, arguments);
                  };
                  var __spreadArray4 = this && this.__spreadArray || function(to, from, pack) {
                    if (pack || arguments.length === 2)
                      for (var i = 0, l = from.length, ar; i < l; i++) {
                        if (ar || !(i in from)) {
                          if (!ar)
                            ar = Array.prototype.slice.call(from, 0, i);
                          ar[i] = from[i];
                        }
                      }
                    return to.concat(ar || Array.prototype.slice.call(from));
                  };
                  Object.defineProperty(exports2, "__esModule", { value: true });
                  exports2.initPopovers = void 0;
                  var core_1 = __webpack_require__2(853);
                  var Default12 = {
                    placement: "top",
                    offset: 10,
                    triggerType: "hover",
                    onShow: function() {
                    },
                    onHide: function() {
                    },
                    onToggle: function() {
                    }
                  };
                  var Popover2 = (
                    /** @class */
                    function() {
                      function Popover3(targetEl, triggerEl, options) {
                        if (targetEl === void 0) {
                          targetEl = null;
                        }
                        if (triggerEl === void 0) {
                          triggerEl = null;
                        }
                        if (options === void 0) {
                          options = Default12;
                        }
                        this._targetEl = targetEl;
                        this._triggerEl = triggerEl;
                        this._options = __assign12(__assign12({}, Default12), options);
                        this._popperInstance = this._createPopperInstance();
                        this._visible = false;
                        this._init();
                      }
                      Popover3.prototype._init = function() {
                        if (this._triggerEl) {
                          this._setupEventListeners();
                        }
                      };
                      Popover3.prototype._setupEventListeners = function() {
                        var _this = this;
                        var triggerEvents = this._getTriggerEvents();
                        triggerEvents.showEvents.forEach(function(ev) {
                          _this._triggerEl.addEventListener(ev, function() {
                            _this.show();
                          });
                          _this._targetEl.addEventListener(ev, function() {
                            _this.show();
                          });
                        });
                        triggerEvents.hideEvents.forEach(function(ev) {
                          _this._triggerEl.addEventListener(ev, function() {
                            setTimeout(function() {
                              if (!_this._targetEl.matches(":hover")) {
                                _this.hide();
                              }
                            }, 100);
                          });
                          _this._targetEl.addEventListener(ev, function() {
                            setTimeout(function() {
                              if (!_this._triggerEl.matches(":hover")) {
                                _this.hide();
                              }
                            }, 100);
                          });
                        });
                      };
                      Popover3.prototype._createPopperInstance = function() {
                        return (0, core_1.createPopper)(this._triggerEl, this._targetEl, {
                          placement: this._options.placement,
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, this._options.offset]
                              }
                            }
                          ]
                        });
                      };
                      Popover3.prototype._getTriggerEvents = function() {
                        switch (this._options.triggerType) {
                          case "hover":
                            return {
                              showEvents: ["mouseenter", "focus"],
                              hideEvents: ["mouseleave", "blur"]
                            };
                          case "click":
                            return {
                              showEvents: ["click", "focus"],
                              hideEvents: ["focusout", "blur"]
                            };
                          case "none":
                            return {
                              showEvents: [],
                              hideEvents: []
                            };
                          default:
                            return {
                              showEvents: ["mouseenter", "focus"],
                              hideEvents: ["mouseleave", "blur"]
                            };
                        }
                      };
                      Popover3.prototype._setupKeydownListener = function() {
                        var _this = this;
                        this._keydownEventListener = function(ev) {
                          if (ev.key === "Escape") {
                            _this.hide();
                          }
                        };
                        document.body.addEventListener("keydown", this._keydownEventListener, true);
                      };
                      Popover3.prototype._removeKeydownListener = function() {
                        document.body.removeEventListener("keydown", this._keydownEventListener, true);
                      };
                      Popover3.prototype._setupClickOutsideListener = function() {
                        var _this = this;
                        this._clickOutsideEventListener = function(ev) {
                          _this._handleClickOutside(ev, _this._targetEl);
                        };
                        document.body.addEventListener("click", this._clickOutsideEventListener, true);
                      };
                      Popover3.prototype._removeClickOutsideListener = function() {
                        document.body.removeEventListener("click", this._clickOutsideEventListener, true);
                      };
                      Popover3.prototype._handleClickOutside = function(ev, targetEl) {
                        var clickedEl = ev.target;
                        if (clickedEl !== targetEl && !targetEl.contains(clickedEl) && !this._triggerEl.contains(clickedEl) && this.isVisible()) {
                          this.hide();
                        }
                      };
                      Popover3.prototype.isVisible = function() {
                        return this._visible;
                      };
                      Popover3.prototype.toggle = function() {
                        if (this.isVisible()) {
                          this.hide();
                        } else {
                          this.show();
                        }
                        this._options.onToggle(this);
                      };
                      Popover3.prototype.show = function() {
                        this._targetEl.classList.remove("opacity-0", "invisible");
                        this._targetEl.classList.add("opacity-100", "visible");
                        this._popperInstance.setOptions(function(options) {
                          return __assign12(__assign12({}, options), { modifiers: __spreadArray4(__spreadArray4([], options.modifiers, true), [
                            { name: "eventListeners", enabled: true }
                          ], false) });
                        });
                        this._setupClickOutsideListener();
                        this._setupKeydownListener();
                        this._popperInstance.update();
                        this._visible = true;
                        this._options.onShow(this);
                      };
                      Popover3.prototype.hide = function() {
                        this._targetEl.classList.remove("opacity-100", "visible");
                        this._targetEl.classList.add("opacity-0", "invisible");
                        this._popperInstance.setOptions(function(options) {
                          return __assign12(__assign12({}, options), { modifiers: __spreadArray4(__spreadArray4([], options.modifiers, true), [
                            { name: "eventListeners", enabled: false }
                          ], false) });
                        });
                        this._removeClickOutsideListener();
                        this._removeKeydownListener();
                        this._visible = false;
                        this._options.onHide(this);
                      };
                      return Popover3;
                    }()
                  );
                  function initPopovers2() {
                    document.querySelectorAll("[data-popover-target]").forEach(function($triggerEl) {
                      var popoverID = $triggerEl.getAttribute("data-popover-target");
                      var $popoverEl = document.getElementById(popoverID);
                      if ($popoverEl) {
                        var triggerType = $triggerEl.getAttribute("data-popover-trigger");
                        var placement = $triggerEl.getAttribute("data-popover-placement");
                        var offset2 = $triggerEl.getAttribute("data-popover-offset");
                        new Popover2($popoverEl, $triggerEl, {
                          placement: placement ? placement : Default12.placement,
                          offset: offset2 ? parseInt(offset2) : Default12.offset,
                          triggerType: triggerType ? triggerType : Default12.triggerType
                        });
                      } else {
                        console.error('The popover element with id "'.concat(popoverID, '" does not exist. Please check the data-popover-target attribute.'));
                      }
                    });
                  }
                  exports2.initPopovers = initPopovers2;
                  if (typeof window !== "undefined") {
                    window.Popover = Popover2;
                    window.initPopovers = initPopovers2;
                  }
                  exports2["default"] = Popover2;
                }
              ),
              /***/
              247: (
                /***/
                function(__unused_webpack_module, exports2) {
                  var __assign12 = this && this.__assign || function() {
                    __assign12 = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign12.apply(this, arguments);
                  };
                  Object.defineProperty(exports2, "__esModule", { value: true });
                  exports2.initTabs = void 0;
                  var Default12 = {
                    defaultTabId: null,
                    activeClasses: "text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-500 border-blue-600 dark:border-blue-500",
                    inactiveClasses: "dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300",
                    onShow: function() {
                    }
                  };
                  var Tabs2 = (
                    /** @class */
                    function() {
                      function Tabs3(items, options) {
                        if (items === void 0) {
                          items = [];
                        }
                        if (options === void 0) {
                          options = Default12;
                        }
                        this._items = items;
                        this._activeTab = options ? this.getTab(options.defaultTabId) : null;
                        this._options = __assign12(__assign12({}, Default12), options);
                        this._init();
                      }
                      Tabs3.prototype._init = function() {
                        var _this = this;
                        if (this._items.length) {
                          if (!this._activeTab) {
                            this._setActiveTab(this._items[0]);
                          }
                          this.show(this._activeTab.id, true);
                          this._items.map(function(tab) {
                            tab.triggerEl.addEventListener("click", function() {
                              _this.show(tab.id);
                            });
                          });
                        }
                      };
                      Tabs3.prototype.getActiveTab = function() {
                        return this._activeTab;
                      };
                      Tabs3.prototype._setActiveTab = function(tab) {
                        this._activeTab = tab;
                      };
                      Tabs3.prototype.getTab = function(id) {
                        return this._items.filter(function(t) {
                          return t.id === id;
                        })[0];
                      };
                      Tabs3.prototype.show = function(id, forceShow) {
                        var _a, _b;
                        var _this = this;
                        if (forceShow === void 0) {
                          forceShow = false;
                        }
                        var tab = this.getTab(id);
                        if (tab === this._activeTab && !forceShow) {
                          return;
                        }
                        this._items.map(function(t) {
                          var _a2, _b2;
                          if (t !== tab) {
                            (_a2 = t.triggerEl.classList).remove.apply(_a2, _this._options.activeClasses.split(" "));
                            (_b2 = t.triggerEl.classList).add.apply(_b2, _this._options.inactiveClasses.split(" "));
                            t.targetEl.classList.add("hidden");
                            t.triggerEl.setAttribute("aria-selected", "false");
                          }
                        });
                        (_a = tab.triggerEl.classList).add.apply(_a, this._options.activeClasses.split(" "));
                        (_b = tab.triggerEl.classList).remove.apply(_b, this._options.inactiveClasses.split(" "));
                        tab.triggerEl.setAttribute("aria-selected", "true");
                        tab.targetEl.classList.remove("hidden");
                        this._setActiveTab(tab);
                        this._options.onShow(this, tab);
                      };
                      return Tabs3;
                    }()
                  );
                  function initTabs2() {
                    document.querySelectorAll("[data-tabs-toggle]").forEach(function($triggerEl) {
                      var tabItems = [];
                      var defaultTabId = null;
                      $triggerEl.querySelectorAll('[role="tab"]').forEach(function($triggerEl2) {
                        var isActive = $triggerEl2.getAttribute("aria-selected") === "true";
                        var tab = {
                          id: $triggerEl2.getAttribute("data-tabs-target"),
                          triggerEl: $triggerEl2,
                          targetEl: document.querySelector($triggerEl2.getAttribute("data-tabs-target"))
                        };
                        tabItems.push(tab);
                        if (isActive) {
                          defaultTabId = tab.id;
                        }
                      });
                      new Tabs2(tabItems, {
                        defaultTabId
                      });
                    });
                  }
                  exports2.initTabs = initTabs2;
                  if (typeof window !== "undefined") {
                    window.Tabs = Tabs2;
                    window.initTabs = initTabs2;
                  }
                  exports2["default"] = Tabs2;
                }
              ),
              /***/
              671: (
                /***/
                function(__unused_webpack_module, exports2, __webpack_require__2) {
                  var __assign12 = this && this.__assign || function() {
                    __assign12 = Object.assign || function(t) {
                      for (var s, i = 1, n = arguments.length; i < n; i++) {
                        s = arguments[i];
                        for (var p in s)
                          if (Object.prototype.hasOwnProperty.call(s, p))
                            t[p] = s[p];
                      }
                      return t;
                    };
                    return __assign12.apply(this, arguments);
                  };
                  var __spreadArray4 = this && this.__spreadArray || function(to, from, pack) {
                    if (pack || arguments.length === 2)
                      for (var i = 0, l = from.length, ar; i < l; i++) {
                        if (ar || !(i in from)) {
                          if (!ar)
                            ar = Array.prototype.slice.call(from, 0, i);
                          ar[i] = from[i];
                        }
                      }
                    return to.concat(ar || Array.prototype.slice.call(from));
                  };
                  Object.defineProperty(exports2, "__esModule", { value: true });
                  exports2.initTooltips = void 0;
                  var core_1 = __webpack_require__2(853);
                  var Default12 = {
                    placement: "top",
                    triggerType: "hover",
                    onShow: function() {
                    },
                    onHide: function() {
                    },
                    onToggle: function() {
                    }
                  };
                  var Tooltip2 = (
                    /** @class */
                    function() {
                      function Tooltip3(targetEl, triggerEl, options) {
                        if (targetEl === void 0) {
                          targetEl = null;
                        }
                        if (triggerEl === void 0) {
                          triggerEl = null;
                        }
                        if (options === void 0) {
                          options = Default12;
                        }
                        this._targetEl = targetEl;
                        this._triggerEl = triggerEl;
                        this._options = __assign12(__assign12({}, Default12), options);
                        this._popperInstance = this._createPopperInstance();
                        this._visible = false;
                        this._init();
                      }
                      Tooltip3.prototype._init = function() {
                        if (this._triggerEl) {
                          this._setupEventListeners();
                        }
                      };
                      Tooltip3.prototype._setupEventListeners = function() {
                        var _this = this;
                        var triggerEvents = this._getTriggerEvents();
                        triggerEvents.showEvents.forEach(function(ev) {
                          _this._triggerEl.addEventListener(ev, function() {
                            _this.show();
                          });
                        });
                        triggerEvents.hideEvents.forEach(function(ev) {
                          _this._triggerEl.addEventListener(ev, function() {
                            _this.hide();
                          });
                        });
                      };
                      Tooltip3.prototype._createPopperInstance = function() {
                        return (0, core_1.createPopper)(this._triggerEl, this._targetEl, {
                          placement: this._options.placement,
                          modifiers: [
                            {
                              name: "offset",
                              options: {
                                offset: [0, 8]
                              }
                            }
                          ]
                        });
                      };
                      Tooltip3.prototype._getTriggerEvents = function() {
                        switch (this._options.triggerType) {
                          case "hover":
                            return {
                              showEvents: ["mouseenter", "focus"],
                              hideEvents: ["mouseleave", "blur"]
                            };
                          case "click":
                            return {
                              showEvents: ["click", "focus"],
                              hideEvents: ["focusout", "blur"]
                            };
                          case "none":
                            return {
                              showEvents: [],
                              hideEvents: []
                            };
                          default:
                            return {
                              showEvents: ["mouseenter", "focus"],
                              hideEvents: ["mouseleave", "blur"]
                            };
                        }
                      };
                      Tooltip3.prototype._setupKeydownListener = function() {
                        var _this = this;
                        this._keydownEventListener = function(ev) {
                          if (ev.key === "Escape") {
                            _this.hide();
                          }
                        };
                        document.body.addEventListener("keydown", this._keydownEventListener, true);
                      };
                      Tooltip3.prototype._removeKeydownListener = function() {
                        document.body.removeEventListener("keydown", this._keydownEventListener, true);
                      };
                      Tooltip3.prototype._setupClickOutsideListener = function() {
                        var _this = this;
                        this._clickOutsideEventListener = function(ev) {
                          _this._handleClickOutside(ev, _this._targetEl);
                        };
                        document.body.addEventListener("click", this._clickOutsideEventListener, true);
                      };
                      Tooltip3.prototype._removeClickOutsideListener = function() {
                        document.body.removeEventListener("click", this._clickOutsideEventListener, true);
                      };
                      Tooltip3.prototype._handleClickOutside = function(ev, targetEl) {
                        var clickedEl = ev.target;
                        if (clickedEl !== targetEl && !targetEl.contains(clickedEl) && !this._triggerEl.contains(clickedEl) && this.isVisible()) {
                          this.hide();
                        }
                      };
                      Tooltip3.prototype.isVisible = function() {
                        return this._visible;
                      };
                      Tooltip3.prototype.toggle = function() {
                        if (this.isVisible()) {
                          this.hide();
                        } else {
                          this.show();
                        }
                      };
                      Tooltip3.prototype.show = function() {
                        this._targetEl.classList.remove("opacity-0", "invisible");
                        this._targetEl.classList.add("opacity-100", "visible");
                        this._popperInstance.setOptions(function(options) {
                          return __assign12(__assign12({}, options), { modifiers: __spreadArray4(__spreadArray4([], options.modifiers, true), [
                            { name: "eventListeners", enabled: true }
                          ], false) });
                        });
                        this._setupClickOutsideListener();
                        this._setupKeydownListener();
                        this._popperInstance.update();
                        this._visible = true;
                        this._options.onShow(this);
                      };
                      Tooltip3.prototype.hide = function() {
                        this._targetEl.classList.remove("opacity-100", "visible");
                        this._targetEl.classList.add("opacity-0", "invisible");
                        this._popperInstance.setOptions(function(options) {
                          return __assign12(__assign12({}, options), { modifiers: __spreadArray4(__spreadArray4([], options.modifiers, true), [
                            { name: "eventListeners", enabled: false }
                          ], false) });
                        });
                        this._removeClickOutsideListener();
                        this._removeKeydownListener();
                        this._visible = false;
                        this._options.onHide(this);
                      };
                      return Tooltip3;
                    }()
                  );
                  function initTooltips2() {
                    document.querySelectorAll("[data-tooltip-target]").forEach(function($triggerEl) {
                      var tooltipId = $triggerEl.getAttribute("data-tooltip-target");
                      var $tooltipEl = document.getElementById(tooltipId);
                      if ($tooltipEl) {
                        var triggerType = $triggerEl.getAttribute("data-tooltip-trigger");
                        var placement = $triggerEl.getAttribute("data-tooltip-placement");
                        new Tooltip2($tooltipEl, $triggerEl, {
                          placement: placement ? placement : Default12.placement,
                          triggerType: triggerType ? triggerType : Default12.triggerType
                        });
                      } else {
                        console.error('The tooltip element with id "'.concat(tooltipId, '" does not exist. Please check the data-tooltip-target attribute.'));
                      }
                    });
                  }
                  exports2.initTooltips = initTooltips2;
                  if (typeof window !== "undefined") {
                    window.Tooltip = Tooltip2;
                    window.initTooltips = initTooltips2;
                  }
                  exports2["default"] = Tooltip2;
                }
              ),
              /***/
              947: (
                /***/
                function(__unused_webpack_module, exports2) {
                  Object.defineProperty(exports2, "__esModule", { value: true });
                  var Events2 = (
                    /** @class */
                    function() {
                      function Events3(eventType, eventFunctions) {
                        if (eventFunctions === void 0) {
                          eventFunctions = [];
                        }
                        this._eventType = eventType;
                        this._eventFunctions = eventFunctions;
                      }
                      Events3.prototype.init = function() {
                        var _this = this;
                        this._eventFunctions.forEach(function(eventFunction) {
                          if (typeof window !== "undefined") {
                            window.addEventListener(_this._eventType, eventFunction);
                          }
                        });
                      };
                      return Events3;
                    }()
                  );
                  exports2["default"] = Events2;
                }
              )
              /******/
            };
            var __webpack_module_cache__ = {};
            function __webpack_require__(moduleId) {
              var cachedModule = __webpack_module_cache__[moduleId];
              if (cachedModule !== void 0) {
                return cachedModule.exports;
              }
              var module2 = __webpack_module_cache__[moduleId] = {
                /******/
                // no module.id needed
                /******/
                // no module.loaded needed
                /******/
                exports: {}
                /******/
              };
              __webpack_modules__[moduleId].call(module2.exports, module2, module2.exports, __webpack_require__);
              return module2.exports;
            }
            !function() {
              __webpack_require__.d = function(exports2, definition) {
                for (var key in definition) {
                  if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports2, key)) {
                    Object.defineProperty(exports2, key, { enumerable: true, get: definition[key] });
                  }
                }
              };
            }();
            !function() {
              __webpack_require__.o = function(obj, prop) {
                return Object.prototype.hasOwnProperty.call(obj, prop);
              };
            }();
            !function() {
              __webpack_require__.r = function(exports2) {
                if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
                }
                Object.defineProperty(exports2, "__esModule", { value: true });
              };
            }();
            var __webpack_exports__ = {};
            !function() {
              var exports2 = __webpack_exports__;
              Object.defineProperty(exports2, "__esModule", { value: true });
              var accordion_1 = __webpack_require__(902);
              var carousel_1 = __webpack_require__(33);
              var collapse_1 = __webpack_require__(922);
              var dial_1 = __webpack_require__(556);
              var dismiss_1 = __webpack_require__(791);
              var drawer_1 = __webpack_require__(340);
              var dropdown_1 = __webpack_require__(316);
              var modal_1 = __webpack_require__(16);
              var popover_1 = __webpack_require__(903);
              var tabs_1 = __webpack_require__(247);
              var tooltip_1 = __webpack_require__(671);
              __webpack_require__(311);
              var events_1 = __webpack_require__(947);
              var turboLoadEvents = new events_1.default("turbo:load", [
                accordion_1.initAccordions,
                collapse_1.initCollapses,
                carousel_1.initCarousels,
                dismiss_1.initDismisses,
                dropdown_1.initDropdowns,
                modal_1.initModals,
                drawer_1.initDrawers,
                tabs_1.initTabs,
                tooltip_1.initTooltips,
                popover_1.initPopovers,
                dial_1.initDials
              ]);
              turboLoadEvents.init();
              var turboFrameLoadEvents = new events_1.default("turbo:frame-load", [
                accordion_1.initAccordions,
                collapse_1.initCollapses,
                carousel_1.initCarousels,
                dismiss_1.initDismisses,
                dropdown_1.initDropdowns,
                modal_1.initModals,
                drawer_1.initDrawers,
                tabs_1.initTabs,
                tooltip_1.initTooltips,
                popover_1.initPopovers,
                dial_1.initDials
              ]);
              turboFrameLoadEvents.init();
              exports2["default"] = {
                Accordion: accordion_1.default,
                Carousel: carousel_1.default,
                Collapse: collapse_1.default,
                Dial: dial_1.default,
                Drawer: drawer_1.default,
                Dismiss: dismiss_1.default,
                Dropdown: dropdown_1.default,
                Modal: modal_1.default,
                Popover: popover_1.default,
                Tabs: tabs_1.default,
                Tooltip: tooltip_1.default,
                Events: events_1.default
              };
            }();
            return __webpack_exports__;
          }()
        );
      });
    }
  });

  // node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js
  (function() {
    if (window.Reflect === void 0 || window.customElements === void 0 || window.customElements.polyfillWrapFlushCallback) {
      return;
    }
    const BuiltInHTMLElement = HTMLElement;
    const wrapperForTheName = {
      HTMLElement: function HTMLElement2() {
        return Reflect.construct(BuiltInHTMLElement, [], this.constructor);
      }
    };
    window.HTMLElement = wrapperForTheName["HTMLElement"];
    HTMLElement.prototype = BuiltInHTMLElement.prototype;
    HTMLElement.prototype.constructor = HTMLElement;
    Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement);
  })();
  (function(prototype) {
    if (typeof prototype.requestSubmit == "function")
      return;
    prototype.requestSubmit = function(submitter) {
      if (submitter) {
        validateSubmitter(submitter, this);
        submitter.click();
      } else {
        submitter = document.createElement("input");
        submitter.type = "submit";
        submitter.hidden = true;
        this.appendChild(submitter);
        submitter.click();
        this.removeChild(submitter);
      }
    };
    function validateSubmitter(submitter, form) {
      submitter instanceof HTMLElement || raise(TypeError, "parameter 1 is not of type 'HTMLElement'");
      submitter.type == "submit" || raise(TypeError, "The specified element is not a submit button");
      submitter.form == form || raise(DOMException, "The specified element is not owned by this form element", "NotFoundError");
    }
    function raise(errorConstructor, message, name) {
      throw new errorConstructor("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".", name);
    }
  })(HTMLFormElement.prototype);
  var submittersByForm = /* @__PURE__ */ new WeakMap();
  function findSubmitterFromClickTarget(target) {
    const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
    const candidate = element ? element.closest("input, button") : null;
    return (candidate === null || candidate === void 0 ? void 0 : candidate.type) == "submit" ? candidate : null;
  }
  function clickCaptured(event) {
    const submitter = findSubmitterFromClickTarget(event.target);
    if (submitter && submitter.form) {
      submittersByForm.set(submitter.form, submitter);
    }
  }
  (function() {
    if ("submitter" in Event.prototype)
      return;
    let prototype = window.Event.prototype;
    if ("SubmitEvent" in window && /Apple Computer/.test(navigator.vendor)) {
      prototype = window.SubmitEvent.prototype;
    } else if ("SubmitEvent" in window) {
      return;
    }
    addEventListener("click", clickCaptured, true);
    Object.defineProperty(prototype, "submitter", {
      get() {
        if (this.type == "submit" && this.target instanceof HTMLFormElement) {
          return submittersByForm.get(this.target);
        }
      }
    });
  })();
  var FrameLoadingStyle;
  (function(FrameLoadingStyle2) {
    FrameLoadingStyle2["eager"] = "eager";
    FrameLoadingStyle2["lazy"] = "lazy";
  })(FrameLoadingStyle || (FrameLoadingStyle = {}));
  var FrameElement = class _FrameElement extends HTMLElement {
    static get observedAttributes() {
      return ["disabled", "complete", "loading", "src"];
    }
    constructor() {
      super();
      this.loaded = Promise.resolve();
      this.delegate = new _FrameElement.delegateConstructor(this);
    }
    connectedCallback() {
      this.delegate.connect();
    }
    disconnectedCallback() {
      this.delegate.disconnect();
    }
    reload() {
      return this.delegate.sourceURLReloaded();
    }
    attributeChangedCallback(name) {
      if (name == "loading") {
        this.delegate.loadingStyleChanged();
      } else if (name == "complete") {
        this.delegate.completeChanged();
      } else if (name == "src") {
        this.delegate.sourceURLChanged();
      } else {
        this.delegate.disabledChanged();
      }
    }
    get src() {
      return this.getAttribute("src");
    }
    set src(value) {
      if (value) {
        this.setAttribute("src", value);
      } else {
        this.removeAttribute("src");
      }
    }
    get loading() {
      return frameLoadingStyleFromString(this.getAttribute("loading") || "");
    }
    set loading(value) {
      if (value) {
        this.setAttribute("loading", value);
      } else {
        this.removeAttribute("loading");
      }
    }
    get disabled() {
      return this.hasAttribute("disabled");
    }
    set disabled(value) {
      if (value) {
        this.setAttribute("disabled", "");
      } else {
        this.removeAttribute("disabled");
      }
    }
    get autoscroll() {
      return this.hasAttribute("autoscroll");
    }
    set autoscroll(value) {
      if (value) {
        this.setAttribute("autoscroll", "");
      } else {
        this.removeAttribute("autoscroll");
      }
    }
    get complete() {
      return !this.delegate.isLoading;
    }
    get isActive() {
      return this.ownerDocument === document && !this.isPreview;
    }
    get isPreview() {
      var _a, _b;
      return (_b = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.documentElement) === null || _b === void 0 ? void 0 : _b.hasAttribute("data-turbo-preview");
    }
  };
  function frameLoadingStyleFromString(style) {
    switch (style.toLowerCase()) {
      case "lazy":
        return FrameLoadingStyle.lazy;
      default:
        return FrameLoadingStyle.eager;
    }
  }
  function expandURL(locatable) {
    return new URL(locatable.toString(), document.baseURI);
  }
  function getAnchor(url) {
    let anchorMatch;
    if (url.hash) {
      return url.hash.slice(1);
    } else if (anchorMatch = url.href.match(/#(.*)$/)) {
      return anchorMatch[1];
    }
  }
  function getAction(form, submitter) {
    const action = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formaction")) || form.getAttribute("action") || form.action;
    return expandURL(action);
  }
  function getExtension(url) {
    return (getLastPathComponent(url).match(/\.[^.]*$/) || [])[0] || "";
  }
  function isHTML(url) {
    return !!getExtension(url).match(/^(?:|\.(?:htm|html|xhtml|php))$/);
  }
  function isPrefixedBy(baseURL, url) {
    const prefix = getPrefix(url);
    return baseURL.href === expandURL(prefix).href || baseURL.href.startsWith(prefix);
  }
  function locationIsVisitable(location2, rootLocation) {
    return isPrefixedBy(location2, rootLocation) && isHTML(location2);
  }
  function getRequestURL(url) {
    const anchor = getAnchor(url);
    return anchor != null ? url.href.slice(0, -(anchor.length + 1)) : url.href;
  }
  function toCacheKey(url) {
    return getRequestURL(url);
  }
  function urlsAreEqual(left2, right2) {
    return expandURL(left2).href == expandURL(right2).href;
  }
  function getPathComponents(url) {
    return url.pathname.split("/").slice(1);
  }
  function getLastPathComponent(url) {
    return getPathComponents(url).slice(-1)[0];
  }
  function getPrefix(url) {
    return addTrailingSlash(url.origin + url.pathname);
  }
  function addTrailingSlash(value) {
    return value.endsWith("/") ? value : value + "/";
  }
  var FetchResponse = class {
    constructor(response) {
      this.response = response;
    }
    get succeeded() {
      return this.response.ok;
    }
    get failed() {
      return !this.succeeded;
    }
    get clientError() {
      return this.statusCode >= 400 && this.statusCode <= 499;
    }
    get serverError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
    get redirected() {
      return this.response.redirected;
    }
    get location() {
      return expandURL(this.response.url);
    }
    get isHTML() {
      return this.contentType && this.contentType.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/);
    }
    get statusCode() {
      return this.response.status;
    }
    get contentType() {
      return this.header("Content-Type");
    }
    get responseText() {
      return this.response.clone().text();
    }
    get responseHTML() {
      if (this.isHTML) {
        return this.response.clone().text();
      } else {
        return Promise.resolve(void 0);
      }
    }
    header(name) {
      return this.response.headers.get(name);
    }
  };
  function activateScriptElement(element) {
    if (element.getAttribute("data-turbo-eval") == "false") {
      return element;
    } else {
      const createdScriptElement = document.createElement("script");
      const cspNonce = getMetaContent("csp-nonce");
      if (cspNonce) {
        createdScriptElement.nonce = cspNonce;
      }
      createdScriptElement.textContent = element.textContent;
      createdScriptElement.async = false;
      copyElementAttributes(createdScriptElement, element);
      return createdScriptElement;
    }
  }
  function copyElementAttributes(destinationElement, sourceElement) {
    for (const { name, value } of sourceElement.attributes) {
      destinationElement.setAttribute(name, value);
    }
  }
  function createDocumentFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
  }
  function dispatch(eventName, { target, cancelable, detail } = {}) {
    const event = new CustomEvent(eventName, {
      cancelable,
      bubbles: true,
      composed: true,
      detail
    });
    if (target && target.isConnected) {
      target.dispatchEvent(event);
    } else {
      document.documentElement.dispatchEvent(event);
    }
    return event;
  }
  function nextAnimationFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }
  function nextEventLoopTick() {
    return new Promise((resolve) => setTimeout(() => resolve(), 0));
  }
  function nextMicrotask() {
    return Promise.resolve();
  }
  function parseHTMLDocument(html = "") {
    return new DOMParser().parseFromString(html, "text/html");
  }
  function unindent(strings, ...values) {
    const lines = interpolate(strings, values).replace(/^\n/, "").split("\n");
    const match = lines[0].match(/^\s+/);
    const indent = match ? match[0].length : 0;
    return lines.map((line) => line.slice(indent)).join("\n");
  }
  function interpolate(strings, values) {
    return strings.reduce((result, string, i) => {
      const value = values[i] == void 0 ? "" : values[i];
      return result + string + value;
    }, "");
  }
  function uuid() {
    return Array.from({ length: 36 }).map((_, i) => {
      if (i == 8 || i == 13 || i == 18 || i == 23) {
        return "-";
      } else if (i == 14) {
        return "4";
      } else if (i == 19) {
        return (Math.floor(Math.random() * 4) + 8).toString(16);
      } else {
        return Math.floor(Math.random() * 15).toString(16);
      }
    }).join("");
  }
  function getAttribute(attributeName, ...elements) {
    for (const value of elements.map((element) => element === null || element === void 0 ? void 0 : element.getAttribute(attributeName))) {
      if (typeof value == "string")
        return value;
    }
    return null;
  }
  function hasAttribute(attributeName, ...elements) {
    return elements.some((element) => element && element.hasAttribute(attributeName));
  }
  function markAsBusy(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.setAttribute("busy", "");
      }
      element.setAttribute("aria-busy", "true");
    }
  }
  function clearBusyState(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.removeAttribute("busy");
      }
      element.removeAttribute("aria-busy");
    }
  }
  function waitForLoad(element, timeoutInMilliseconds = 2e3) {
    return new Promise((resolve) => {
      const onComplete = () => {
        element.removeEventListener("error", onComplete);
        element.removeEventListener("load", onComplete);
        resolve();
      };
      element.addEventListener("load", onComplete, { once: true });
      element.addEventListener("error", onComplete, { once: true });
      setTimeout(resolve, timeoutInMilliseconds);
    });
  }
  function getHistoryMethodForAction(action) {
    switch (action) {
      case "replace":
        return history.replaceState;
      case "advance":
      case "restore":
        return history.pushState;
    }
  }
  function isAction(action) {
    return action == "advance" || action == "replace" || action == "restore";
  }
  function getVisitAction(...elements) {
    const action = getAttribute("data-turbo-action", ...elements);
    return isAction(action) ? action : null;
  }
  function getMetaElement(name) {
    return document.querySelector(`meta[name="${name}"]`);
  }
  function getMetaContent(name) {
    const element = getMetaElement(name);
    return element && element.content;
  }
  function setMetaContent(name, content) {
    let element = getMetaElement(name);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("name", name);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
    return element;
  }
  function findClosestRecursively(element, selector) {
    var _a;
    if (element instanceof Element) {
      return element.closest(selector) || findClosestRecursively(element.assignedSlot || ((_a = element.getRootNode()) === null || _a === void 0 ? void 0 : _a.host), selector);
    }
  }
  var FetchMethod;
  (function(FetchMethod2) {
    FetchMethod2[FetchMethod2["get"] = 0] = "get";
    FetchMethod2[FetchMethod2["post"] = 1] = "post";
    FetchMethod2[FetchMethod2["put"] = 2] = "put";
    FetchMethod2[FetchMethod2["patch"] = 3] = "patch";
    FetchMethod2[FetchMethod2["delete"] = 4] = "delete";
  })(FetchMethod || (FetchMethod = {}));
  function fetchMethodFromString(method) {
    switch (method.toLowerCase()) {
      case "get":
        return FetchMethod.get;
      case "post":
        return FetchMethod.post;
      case "put":
        return FetchMethod.put;
      case "patch":
        return FetchMethod.patch;
      case "delete":
        return FetchMethod.delete;
    }
  }
  var FetchRequest = class {
    constructor(delegate, method, location2, body = new URLSearchParams(), target = null) {
      this.abortController = new AbortController();
      this.resolveRequestPromise = (_value) => {
      };
      this.delegate = delegate;
      this.method = method;
      this.headers = this.defaultHeaders;
      this.body = body;
      this.url = location2;
      this.target = target;
    }
    get location() {
      return this.url;
    }
    get params() {
      return this.url.searchParams;
    }
    get entries() {
      return this.body ? Array.from(this.body.entries()) : [];
    }
    cancel() {
      this.abortController.abort();
    }
    async perform() {
      const { fetchOptions } = this;
      this.delegate.prepareRequest(this);
      await this.allowRequestToBeIntercepted(fetchOptions);
      try {
        this.delegate.requestStarted(this);
        const response = await fetch(this.url.href, fetchOptions);
        return await this.receive(response);
      } catch (error2) {
        if (error2.name !== "AbortError") {
          if (this.willDelegateErrorHandling(error2)) {
            this.delegate.requestErrored(this, error2);
          }
          throw error2;
        }
      } finally {
        this.delegate.requestFinished(this);
      }
    }
    async receive(response) {
      const fetchResponse = new FetchResponse(response);
      const event = dispatch("turbo:before-fetch-response", {
        cancelable: true,
        detail: { fetchResponse },
        target: this.target
      });
      if (event.defaultPrevented) {
        this.delegate.requestPreventedHandlingResponse(this, fetchResponse);
      } else if (fetchResponse.succeeded) {
        this.delegate.requestSucceededWithResponse(this, fetchResponse);
      } else {
        this.delegate.requestFailedWithResponse(this, fetchResponse);
      }
      return fetchResponse;
    }
    get fetchOptions() {
      var _a;
      return {
        method: FetchMethod[this.method].toUpperCase(),
        credentials: "same-origin",
        headers: this.headers,
        redirect: "follow",
        body: this.isSafe ? null : this.body,
        signal: this.abortSignal,
        referrer: (_a = this.delegate.referrer) === null || _a === void 0 ? void 0 : _a.href
      };
    }
    get defaultHeaders() {
      return {
        Accept: "text/html, application/xhtml+xml"
      };
    }
    get isSafe() {
      return this.method === FetchMethod.get;
    }
    get abortSignal() {
      return this.abortController.signal;
    }
    acceptResponseType(mimeType) {
      this.headers["Accept"] = [mimeType, this.headers["Accept"]].join(", ");
    }
    async allowRequestToBeIntercepted(fetchOptions) {
      const requestInterception = new Promise((resolve) => this.resolveRequestPromise = resolve);
      const event = dispatch("turbo:before-fetch-request", {
        cancelable: true,
        detail: {
          fetchOptions,
          url: this.url,
          resume: this.resolveRequestPromise
        },
        target: this.target
      });
      if (event.defaultPrevented)
        await requestInterception;
    }
    willDelegateErrorHandling(error2) {
      const event = dispatch("turbo:fetch-request-error", {
        target: this.target,
        cancelable: true,
        detail: { request: this, error: error2 }
      });
      return !event.defaultPrevented;
    }
  };
  var AppearanceObserver = class {
    constructor(delegate, element) {
      this.started = false;
      this.intersect = (entries) => {
        const lastEntry = entries.slice(-1)[0];
        if (lastEntry === null || lastEntry === void 0 ? void 0 : lastEntry.isIntersecting) {
          this.delegate.elementAppearedInViewport(this.element);
        }
      };
      this.delegate = delegate;
      this.element = element;
      this.intersectionObserver = new IntersectionObserver(this.intersect);
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.intersectionObserver.observe(this.element);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.intersectionObserver.unobserve(this.element);
      }
    }
  };
  var StreamMessage = class {
    static wrap(message) {
      if (typeof message == "string") {
        return new this(createDocumentFragment(message));
      } else {
        return message;
      }
    }
    constructor(fragment) {
      this.fragment = importStreamElements(fragment);
    }
  };
  StreamMessage.contentType = "text/vnd.turbo-stream.html";
  function importStreamElements(fragment) {
    for (const element of fragment.querySelectorAll("turbo-stream")) {
      const streamElement = document.importNode(element, true);
      for (const inertScriptElement of streamElement.templateElement.content.querySelectorAll("script")) {
        inertScriptElement.replaceWith(activateScriptElement(inertScriptElement));
      }
      element.replaceWith(streamElement);
    }
    return fragment;
  }
  var FormSubmissionState;
  (function(FormSubmissionState2) {
    FormSubmissionState2[FormSubmissionState2["initialized"] = 0] = "initialized";
    FormSubmissionState2[FormSubmissionState2["requesting"] = 1] = "requesting";
    FormSubmissionState2[FormSubmissionState2["waiting"] = 2] = "waiting";
    FormSubmissionState2[FormSubmissionState2["receiving"] = 3] = "receiving";
    FormSubmissionState2[FormSubmissionState2["stopping"] = 4] = "stopping";
    FormSubmissionState2[FormSubmissionState2["stopped"] = 5] = "stopped";
  })(FormSubmissionState || (FormSubmissionState = {}));
  var FormEnctype;
  (function(FormEnctype2) {
    FormEnctype2["urlEncoded"] = "application/x-www-form-urlencoded";
    FormEnctype2["multipart"] = "multipart/form-data";
    FormEnctype2["plain"] = "text/plain";
  })(FormEnctype || (FormEnctype = {}));
  function formEnctypeFromString(encoding) {
    switch (encoding.toLowerCase()) {
      case FormEnctype.multipart:
        return FormEnctype.multipart;
      case FormEnctype.plain:
        return FormEnctype.plain;
      default:
        return FormEnctype.urlEncoded;
    }
  }
  var FormSubmission = class _FormSubmission {
    static confirmMethod(message, _element, _submitter) {
      return Promise.resolve(confirm(message));
    }
    constructor(delegate, formElement, submitter, mustRedirect = false) {
      this.state = FormSubmissionState.initialized;
      this.delegate = delegate;
      this.formElement = formElement;
      this.submitter = submitter;
      this.formData = buildFormData(formElement, submitter);
      this.location = expandURL(this.action);
      if (this.method == FetchMethod.get) {
        mergeFormDataEntries(this.location, [...this.body.entries()]);
      }
      this.fetchRequest = new FetchRequest(this, this.method, this.location, this.body, this.formElement);
      this.mustRedirect = mustRedirect;
    }
    get method() {
      var _a;
      const method = ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formmethod")) || this.formElement.getAttribute("method") || "";
      return fetchMethodFromString(method.toLowerCase()) || FetchMethod.get;
    }
    get action() {
      var _a;
      const formElementAction = typeof this.formElement.action === "string" ? this.formElement.action : null;
      if ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.hasAttribute("formaction")) {
        return this.submitter.getAttribute("formaction") || "";
      } else {
        return this.formElement.getAttribute("action") || formElementAction || "";
      }
    }
    get body() {
      if (this.enctype == FormEnctype.urlEncoded || this.method == FetchMethod.get) {
        return new URLSearchParams(this.stringFormData);
      } else {
        return this.formData;
      }
    }
    get enctype() {
      var _a;
      return formEnctypeFromString(((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formenctype")) || this.formElement.enctype);
    }
    get isSafe() {
      return this.fetchRequest.isSafe;
    }
    get stringFormData() {
      return [...this.formData].reduce((entries, [name, value]) => {
        return entries.concat(typeof value == "string" ? [[name, value]] : []);
      }, []);
    }
    async start() {
      const { initialized, requesting } = FormSubmissionState;
      const confirmationMessage = getAttribute("data-turbo-confirm", this.submitter, this.formElement);
      if (typeof confirmationMessage === "string") {
        const answer = await _FormSubmission.confirmMethod(confirmationMessage, this.formElement, this.submitter);
        if (!answer) {
          return;
        }
      }
      if (this.state == initialized) {
        this.state = requesting;
        return this.fetchRequest.perform();
      }
    }
    stop() {
      const { stopping, stopped } = FormSubmissionState;
      if (this.state != stopping && this.state != stopped) {
        this.state = stopping;
        this.fetchRequest.cancel();
        return true;
      }
    }
    prepareRequest(request) {
      if (!request.isSafe) {
        const token = getCookieValue(getMetaContent("csrf-param")) || getMetaContent("csrf-token");
        if (token) {
          request.headers["X-CSRF-Token"] = token;
        }
      }
      if (this.requestAcceptsTurboStreamResponse(request)) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted(_request) {
      var _a;
      this.state = FormSubmissionState.waiting;
      (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.setAttribute("disabled", "");
      this.setSubmitsWith();
      dispatch("turbo:submit-start", {
        target: this.formElement,
        detail: { formSubmission: this }
      });
      this.delegate.formSubmissionStarted(this);
    }
    requestPreventedHandlingResponse(request, response) {
      this.result = { success: response.succeeded, fetchResponse: response };
    }
    requestSucceededWithResponse(request, response) {
      if (response.clientError || response.serverError) {
        this.delegate.formSubmissionFailedWithResponse(this, response);
      } else if (this.requestMustRedirect(request) && responseSucceededWithoutRedirect(response)) {
        const error2 = new Error("Form responses must redirect to another location");
        this.delegate.formSubmissionErrored(this, error2);
      } else {
        this.state = FormSubmissionState.receiving;
        this.result = { success: true, fetchResponse: response };
        this.delegate.formSubmissionSucceededWithResponse(this, response);
      }
    }
    requestFailedWithResponse(request, response) {
      this.result = { success: false, fetchResponse: response };
      this.delegate.formSubmissionFailedWithResponse(this, response);
    }
    requestErrored(request, error2) {
      this.result = { success: false, error: error2 };
      this.delegate.formSubmissionErrored(this, error2);
    }
    requestFinished(_request) {
      var _a;
      this.state = FormSubmissionState.stopped;
      (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.removeAttribute("disabled");
      this.resetSubmitterText();
      dispatch("turbo:submit-end", {
        target: this.formElement,
        detail: Object.assign({ formSubmission: this }, this.result)
      });
      this.delegate.formSubmissionFinished(this);
    }
    setSubmitsWith() {
      if (!this.submitter || !this.submitsWith)
        return;
      if (this.submitter.matches("button")) {
        this.originalSubmitText = this.submitter.innerHTML;
        this.submitter.innerHTML = this.submitsWith;
      } else if (this.submitter.matches("input")) {
        const input = this.submitter;
        this.originalSubmitText = input.value;
        input.value = this.submitsWith;
      }
    }
    resetSubmitterText() {
      if (!this.submitter || !this.originalSubmitText)
        return;
      if (this.submitter.matches("button")) {
        this.submitter.innerHTML = this.originalSubmitText;
      } else if (this.submitter.matches("input")) {
        const input = this.submitter;
        input.value = this.originalSubmitText;
      }
    }
    requestMustRedirect(request) {
      return !request.isSafe && this.mustRedirect;
    }
    requestAcceptsTurboStreamResponse(request) {
      return !request.isSafe || hasAttribute("data-turbo-stream", this.submitter, this.formElement);
    }
    get submitsWith() {
      var _a;
      return (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("data-turbo-submits-with");
    }
  };
  function buildFormData(formElement, submitter) {
    const formData = new FormData(formElement);
    const name = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("name");
    const value = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("value");
    if (name) {
      formData.append(name, value || "");
    }
    return formData;
  }
  function getCookieValue(cookieName) {
    if (cookieName != null) {
      const cookies = document.cookie ? document.cookie.split("; ") : [];
      const cookie = cookies.find((cookie2) => cookie2.startsWith(cookieName));
      if (cookie) {
        const value = cookie.split("=").slice(1).join("=");
        return value ? decodeURIComponent(value) : void 0;
      }
    }
  }
  function responseSucceededWithoutRedirect(response) {
    return response.statusCode == 200 && !response.redirected;
  }
  function mergeFormDataEntries(url, entries) {
    const searchParams = new URLSearchParams();
    for (const [name, value] of entries) {
      if (value instanceof File)
        continue;
      searchParams.append(name, value);
    }
    url.search = searchParams.toString();
    return url;
  }
  var Snapshot = class {
    constructor(element) {
      this.element = element;
    }
    get activeElement() {
      return this.element.ownerDocument.activeElement;
    }
    get children() {
      return [...this.element.children];
    }
    hasAnchor(anchor) {
      return this.getElementForAnchor(anchor) != null;
    }
    getElementForAnchor(anchor) {
      return anchor ? this.element.querySelector(`[id='${anchor}'], a[name='${anchor}']`) : null;
    }
    get isConnected() {
      return this.element.isConnected;
    }
    get firstAutofocusableElement() {
      const inertDisabledOrHidden = "[inert], :disabled, [hidden], details:not([open]), dialog:not([open])";
      for (const element of this.element.querySelectorAll("[autofocus]")) {
        if (element.closest(inertDisabledOrHidden) == null)
          return element;
        else
          continue;
      }
      return null;
    }
    get permanentElements() {
      return queryPermanentElementsAll(this.element);
    }
    getPermanentElementById(id) {
      return getPermanentElementById(this.element, id);
    }
    getPermanentElementMapForSnapshot(snapshot) {
      const permanentElementMap = {};
      for (const currentPermanentElement of this.permanentElements) {
        const { id } = currentPermanentElement;
        const newPermanentElement = snapshot.getPermanentElementById(id);
        if (newPermanentElement) {
          permanentElementMap[id] = [currentPermanentElement, newPermanentElement];
        }
      }
      return permanentElementMap;
    }
  };
  function getPermanentElementById(node, id) {
    return node.querySelector(`#${id}[data-turbo-permanent]`);
  }
  function queryPermanentElementsAll(node) {
    return node.querySelectorAll("[id][data-turbo-permanent]");
  }
  var FormSubmitObserver = class {
    constructor(delegate, eventTarget) {
      this.started = false;
      this.submitCaptured = () => {
        this.eventTarget.removeEventListener("submit", this.submitBubbled, false);
        this.eventTarget.addEventListener("submit", this.submitBubbled, false);
      };
      this.submitBubbled = (event) => {
        if (!event.defaultPrevented) {
          const form = event.target instanceof HTMLFormElement ? event.target : void 0;
          const submitter = event.submitter || void 0;
          if (form && submissionDoesNotDismissDialog(form, submitter) && submissionDoesNotTargetIFrame(form, submitter) && this.delegate.willSubmitForm(form, submitter)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.delegate.formSubmitted(form, submitter);
          }
        }
      };
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (!this.started) {
        this.eventTarget.addEventListener("submit", this.submitCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.eventTarget.removeEventListener("submit", this.submitCaptured, true);
        this.started = false;
      }
    }
  };
  function submissionDoesNotDismissDialog(form, submitter) {
    const method = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formmethod")) || form.getAttribute("method");
    return method != "dialog";
  }
  function submissionDoesNotTargetIFrame(form, submitter) {
    if ((submitter === null || submitter === void 0 ? void 0 : submitter.hasAttribute("formtarget")) || form.hasAttribute("target")) {
      const target = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formtarget")) || form.target;
      for (const element of document.getElementsByName(target)) {
        if (element instanceof HTMLIFrameElement)
          return false;
      }
      return true;
    } else {
      return true;
    }
  }
  var View = class {
    constructor(delegate, element) {
      this.resolveRenderPromise = (_value) => {
      };
      this.resolveInterceptionPromise = (_value) => {
      };
      this.delegate = delegate;
      this.element = element;
    }
    scrollToAnchor(anchor) {
      const element = this.snapshot.getElementForAnchor(anchor);
      if (element) {
        this.scrollToElement(element);
        this.focusElement(element);
      } else {
        this.scrollToPosition({ x: 0, y: 0 });
      }
    }
    scrollToAnchorFromLocation(location2) {
      this.scrollToAnchor(getAnchor(location2));
    }
    scrollToElement(element) {
      element.scrollIntoView();
    }
    focusElement(element) {
      if (element instanceof HTMLElement) {
        if (element.hasAttribute("tabindex")) {
          element.focus();
        } else {
          element.setAttribute("tabindex", "-1");
          element.focus();
          element.removeAttribute("tabindex");
        }
      }
    }
    scrollToPosition({ x, y }) {
      this.scrollRoot.scrollTo(x, y);
    }
    scrollToTop() {
      this.scrollToPosition({ x: 0, y: 0 });
    }
    get scrollRoot() {
      return window;
    }
    async render(renderer) {
      const { isPreview, shouldRender, newSnapshot: snapshot } = renderer;
      if (shouldRender) {
        try {
          this.renderPromise = new Promise((resolve) => this.resolveRenderPromise = resolve);
          this.renderer = renderer;
          await this.prepareToRenderSnapshot(renderer);
          const renderInterception = new Promise((resolve) => this.resolveInterceptionPromise = resolve);
          const options = { resume: this.resolveInterceptionPromise, render: this.renderer.renderElement };
          const immediateRender = this.delegate.allowsImmediateRender(snapshot, options);
          if (!immediateRender)
            await renderInterception;
          await this.renderSnapshot(renderer);
          this.delegate.viewRenderedSnapshot(snapshot, isPreview);
          this.delegate.preloadOnLoadLinksForView(this.element);
          this.finishRenderingSnapshot(renderer);
        } finally {
          delete this.renderer;
          this.resolveRenderPromise(void 0);
          delete this.renderPromise;
        }
      } else {
        this.invalidate(renderer.reloadReason);
      }
    }
    invalidate(reason) {
      this.delegate.viewInvalidated(reason);
    }
    async prepareToRenderSnapshot(renderer) {
      this.markAsPreview(renderer.isPreview);
      await renderer.prepareToRender();
    }
    markAsPreview(isPreview) {
      if (isPreview) {
        this.element.setAttribute("data-turbo-preview", "");
      } else {
        this.element.removeAttribute("data-turbo-preview");
      }
    }
    async renderSnapshot(renderer) {
      await renderer.render();
    }
    finishRenderingSnapshot(renderer) {
      renderer.finishRendering();
    }
  };
  var FrameView = class extends View {
    missing() {
      this.element.innerHTML = `<strong class="turbo-frame-error">Content missing</strong>`;
    }
    get snapshot() {
      return new Snapshot(this.element);
    }
  };
  var LinkInterceptor = class {
    constructor(delegate, element) {
      this.clickBubbled = (event) => {
        if (this.respondsToEventTarget(event.target)) {
          this.clickEvent = event;
        } else {
          delete this.clickEvent;
        }
      };
      this.linkClicked = (event) => {
        if (this.clickEvent && this.respondsToEventTarget(event.target) && event.target instanceof Element) {
          if (this.delegate.shouldInterceptLinkClick(event.target, event.detail.url, event.detail.originalEvent)) {
            this.clickEvent.preventDefault();
            event.preventDefault();
            this.delegate.linkClickIntercepted(event.target, event.detail.url, event.detail.originalEvent);
          }
        }
        delete this.clickEvent;
      };
      this.willVisit = (_event) => {
        delete this.clickEvent;
      };
      this.delegate = delegate;
      this.element = element;
    }
    start() {
      this.element.addEventListener("click", this.clickBubbled);
      document.addEventListener("turbo:click", this.linkClicked);
      document.addEventListener("turbo:before-visit", this.willVisit);
    }
    stop() {
      this.element.removeEventListener("click", this.clickBubbled);
      document.removeEventListener("turbo:click", this.linkClicked);
      document.removeEventListener("turbo:before-visit", this.willVisit);
    }
    respondsToEventTarget(target) {
      const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
      return element && element.closest("turbo-frame, html") == this.element;
    }
  };
  var LinkClickObserver = class {
    constructor(delegate, eventTarget) {
      this.started = false;
      this.clickCaptured = () => {
        this.eventTarget.removeEventListener("click", this.clickBubbled, false);
        this.eventTarget.addEventListener("click", this.clickBubbled, false);
      };
      this.clickBubbled = (event) => {
        if (event instanceof MouseEvent && this.clickEventIsSignificant(event)) {
          const target = event.composedPath && event.composedPath()[0] || event.target;
          const link = this.findLinkFromClickTarget(target);
          if (link && doesNotTargetIFrame(link)) {
            const location2 = this.getLocationForLink(link);
            if (this.delegate.willFollowLinkToLocation(link, location2, event)) {
              event.preventDefault();
              this.delegate.followedLinkToLocation(link, location2);
            }
          }
        }
      };
      this.delegate = delegate;
      this.eventTarget = eventTarget;
    }
    start() {
      if (!this.started) {
        this.eventTarget.addEventListener("click", this.clickCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.eventTarget.removeEventListener("click", this.clickCaptured, true);
        this.started = false;
      }
    }
    clickEventIsSignificant(event) {
      return !(event.target && event.target.isContentEditable || event.defaultPrevented || event.which > 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
    }
    findLinkFromClickTarget(target) {
      return findClosestRecursively(target, "a[href]:not([target^=_]):not([download])");
    }
    getLocationForLink(link) {
      return expandURL(link.getAttribute("href") || "");
    }
  };
  function doesNotTargetIFrame(anchor) {
    if (anchor.hasAttribute("target")) {
      for (const element of document.getElementsByName(anchor.target)) {
        if (element instanceof HTMLIFrameElement)
          return false;
      }
      return true;
    } else {
      return true;
    }
  }
  var FormLinkClickObserver = class {
    constructor(delegate, element) {
      this.delegate = delegate;
      this.linkInterceptor = new LinkClickObserver(this, element);
    }
    start() {
      this.linkInterceptor.start();
    }
    stop() {
      this.linkInterceptor.stop();
    }
    willFollowLinkToLocation(link, location2, originalEvent) {
      return this.delegate.willSubmitFormLinkToLocation(link, location2, originalEvent) && link.hasAttribute("data-turbo-method");
    }
    followedLinkToLocation(link, location2) {
      const form = document.createElement("form");
      const type = "hidden";
      for (const [name, value] of location2.searchParams) {
        form.append(Object.assign(document.createElement("input"), { type, name, value }));
      }
      const action = Object.assign(location2, { search: "" });
      form.setAttribute("data-turbo", "true");
      form.setAttribute("action", action.href);
      form.setAttribute("hidden", "");
      const method = link.getAttribute("data-turbo-method");
      if (method)
        form.setAttribute("method", method);
      const turboFrame = link.getAttribute("data-turbo-frame");
      if (turboFrame)
        form.setAttribute("data-turbo-frame", turboFrame);
      const turboAction = getVisitAction(link);
      if (turboAction)
        form.setAttribute("data-turbo-action", turboAction);
      const turboConfirm = link.getAttribute("data-turbo-confirm");
      if (turboConfirm)
        form.setAttribute("data-turbo-confirm", turboConfirm);
      const turboStream = link.hasAttribute("data-turbo-stream");
      if (turboStream)
        form.setAttribute("data-turbo-stream", "");
      this.delegate.submittedFormLinkToLocation(link, location2, form);
      document.body.appendChild(form);
      form.addEventListener("turbo:submit-end", () => form.remove(), { once: true });
      requestAnimationFrame(() => form.requestSubmit());
    }
  };
  var Bardo = class {
    static async preservingPermanentElements(delegate, permanentElementMap, callback) {
      const bardo = new this(delegate, permanentElementMap);
      bardo.enter();
      await callback();
      bardo.leave();
    }
    constructor(delegate, permanentElementMap) {
      this.delegate = delegate;
      this.permanentElementMap = permanentElementMap;
    }
    enter() {
      for (const id in this.permanentElementMap) {
        const [currentPermanentElement, newPermanentElement] = this.permanentElementMap[id];
        this.delegate.enteringBardo(currentPermanentElement, newPermanentElement);
        this.replaceNewPermanentElementWithPlaceholder(newPermanentElement);
      }
    }
    leave() {
      for (const id in this.permanentElementMap) {
        const [currentPermanentElement] = this.permanentElementMap[id];
        this.replaceCurrentPermanentElementWithClone(currentPermanentElement);
        this.replacePlaceholderWithPermanentElement(currentPermanentElement);
        this.delegate.leavingBardo(currentPermanentElement);
      }
    }
    replaceNewPermanentElementWithPlaceholder(permanentElement) {
      const placeholder = createPlaceholderForPermanentElement(permanentElement);
      permanentElement.replaceWith(placeholder);
    }
    replaceCurrentPermanentElementWithClone(permanentElement) {
      const clone = permanentElement.cloneNode(true);
      permanentElement.replaceWith(clone);
    }
    replacePlaceholderWithPermanentElement(permanentElement) {
      const placeholder = this.getPlaceholderById(permanentElement.id);
      placeholder === null || placeholder === void 0 ? void 0 : placeholder.replaceWith(permanentElement);
    }
    getPlaceholderById(id) {
      return this.placeholders.find((element) => element.content == id);
    }
    get placeholders() {
      return [...document.querySelectorAll("meta[name=turbo-permanent-placeholder][content]")];
    }
  };
  function createPlaceholderForPermanentElement(permanentElement) {
    const element = document.createElement("meta");
    element.setAttribute("name", "turbo-permanent-placeholder");
    element.setAttribute("content", permanentElement.id);
    return element;
  }
  var Renderer = class {
    constructor(currentSnapshot, newSnapshot, renderElement, isPreview, willRender = true) {
      this.activeElement = null;
      this.currentSnapshot = currentSnapshot;
      this.newSnapshot = newSnapshot;
      this.isPreview = isPreview;
      this.willRender = willRender;
      this.renderElement = renderElement;
      this.promise = new Promise((resolve, reject) => this.resolvingFunctions = { resolve, reject });
    }
    get shouldRender() {
      return true;
    }
    get reloadReason() {
      return;
    }
    prepareToRender() {
      return;
    }
    finishRendering() {
      if (this.resolvingFunctions) {
        this.resolvingFunctions.resolve();
        delete this.resolvingFunctions;
      }
    }
    async preservingPermanentElements(callback) {
      await Bardo.preservingPermanentElements(this, this.permanentElementMap, callback);
    }
    focusFirstAutofocusableElement() {
      const element = this.connectedSnapshot.firstAutofocusableElement;
      if (elementIsFocusable(element)) {
        element.focus();
      }
    }
    enteringBardo(currentPermanentElement) {
      if (this.activeElement)
        return;
      if (currentPermanentElement.contains(this.currentSnapshot.activeElement)) {
        this.activeElement = this.currentSnapshot.activeElement;
      }
    }
    leavingBardo(currentPermanentElement) {
      if (currentPermanentElement.contains(this.activeElement) && this.activeElement instanceof HTMLElement) {
        this.activeElement.focus();
        this.activeElement = null;
      }
    }
    get connectedSnapshot() {
      return this.newSnapshot.isConnected ? this.newSnapshot : this.currentSnapshot;
    }
    get currentElement() {
      return this.currentSnapshot.element;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    get permanentElementMap() {
      return this.currentSnapshot.getPermanentElementMapForSnapshot(this.newSnapshot);
    }
  };
  function elementIsFocusable(element) {
    return element && typeof element.focus == "function";
  }
  var FrameRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      var _a;
      const destinationRange = document.createRange();
      destinationRange.selectNodeContents(currentElement);
      destinationRange.deleteContents();
      const frameElement = newElement;
      const sourceRange = (_a = frameElement.ownerDocument) === null || _a === void 0 ? void 0 : _a.createRange();
      if (sourceRange) {
        sourceRange.selectNodeContents(frameElement);
        currentElement.appendChild(sourceRange.extractContents());
      }
    }
    constructor(delegate, currentSnapshot, newSnapshot, renderElement, isPreview, willRender = true) {
      super(currentSnapshot, newSnapshot, renderElement, isPreview, willRender);
      this.delegate = delegate;
    }
    get shouldRender() {
      return true;
    }
    async render() {
      await nextAnimationFrame();
      this.preservingPermanentElements(() => {
        this.loadFrameElement();
      });
      this.scrollFrameIntoView();
      await nextAnimationFrame();
      this.focusFirstAutofocusableElement();
      await nextAnimationFrame();
      this.activateScriptElements();
    }
    loadFrameElement() {
      this.delegate.willRenderFrame(this.currentElement, this.newElement);
      this.renderElement(this.currentElement, this.newElement);
    }
    scrollFrameIntoView() {
      if (this.currentElement.autoscroll || this.newElement.autoscroll) {
        const element = this.currentElement.firstElementChild;
        const block = readScrollLogicalPosition(this.currentElement.getAttribute("data-autoscroll-block"), "end");
        const behavior = readScrollBehavior(this.currentElement.getAttribute("data-autoscroll-behavior"), "auto");
        if (element) {
          element.scrollIntoView({ block, behavior });
          return true;
        }
      }
      return false;
    }
    activateScriptElements() {
      for (const inertScriptElement of this.newScriptElements) {
        const activatedScriptElement = activateScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    get newScriptElements() {
      return this.currentElement.querySelectorAll("script");
    }
  };
  function readScrollLogicalPosition(value, defaultValue) {
    if (value == "end" || value == "start" || value == "center" || value == "nearest") {
      return value;
    } else {
      return defaultValue;
    }
  }
  function readScrollBehavior(value, defaultValue) {
    if (value == "auto" || value == "smooth") {
      return value;
    } else {
      return defaultValue;
    }
  }
  var ProgressBar = class _ProgressBar {
    static get defaultCSS() {
      return unindent`
      .turbo-progress-bar {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        height: 3px;
        background: #0076ff;
        z-index: 2147483647;
        transition:
          width ${_ProgressBar.animationDuration}ms ease-out,
          opacity ${_ProgressBar.animationDuration / 2}ms ${_ProgressBar.animationDuration / 2}ms ease-in;
        transform: translate3d(0, 0, 0);
      }
    `;
    }
    constructor() {
      this.hiding = false;
      this.value = 0;
      this.visible = false;
      this.trickle = () => {
        this.setValue(this.value + Math.random() / 100);
      };
      this.stylesheetElement = this.createStylesheetElement();
      this.progressElement = this.createProgressElement();
      this.installStylesheetElement();
      this.setValue(0);
    }
    show() {
      if (!this.visible) {
        this.visible = true;
        this.installProgressElement();
        this.startTrickling();
      }
    }
    hide() {
      if (this.visible && !this.hiding) {
        this.hiding = true;
        this.fadeProgressElement(() => {
          this.uninstallProgressElement();
          this.stopTrickling();
          this.visible = false;
          this.hiding = false;
        });
      }
    }
    setValue(value) {
      this.value = value;
      this.refresh();
    }
    installStylesheetElement() {
      document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
    }
    installProgressElement() {
      this.progressElement.style.width = "0";
      this.progressElement.style.opacity = "1";
      document.documentElement.insertBefore(this.progressElement, document.body);
      this.refresh();
    }
    fadeProgressElement(callback) {
      this.progressElement.style.opacity = "0";
      setTimeout(callback, _ProgressBar.animationDuration * 1.5);
    }
    uninstallProgressElement() {
      if (this.progressElement.parentNode) {
        document.documentElement.removeChild(this.progressElement);
      }
    }
    startTrickling() {
      if (!this.trickleInterval) {
        this.trickleInterval = window.setInterval(this.trickle, _ProgressBar.animationDuration);
      }
    }
    stopTrickling() {
      window.clearInterval(this.trickleInterval);
      delete this.trickleInterval;
    }
    refresh() {
      requestAnimationFrame(() => {
        this.progressElement.style.width = `${10 + this.value * 90}%`;
      });
    }
    createStylesheetElement() {
      const element = document.createElement("style");
      element.type = "text/css";
      element.textContent = _ProgressBar.defaultCSS;
      if (this.cspNonce) {
        element.nonce = this.cspNonce;
      }
      return element;
    }
    createProgressElement() {
      const element = document.createElement("div");
      element.className = "turbo-progress-bar";
      return element;
    }
    get cspNonce() {
      return getMetaContent("csp-nonce");
    }
  };
  ProgressBar.animationDuration = 300;
  var HeadSnapshot = class extends Snapshot {
    constructor() {
      super(...arguments);
      this.detailsByOuterHTML = this.children.filter((element) => !elementIsNoscript(element)).map((element) => elementWithoutNonce(element)).reduce((result, element) => {
        const { outerHTML } = element;
        const details = outerHTML in result ? result[outerHTML] : {
          type: elementType(element),
          tracked: elementIsTracked(element),
          elements: []
        };
        return Object.assign(Object.assign({}, result), { [outerHTML]: Object.assign(Object.assign({}, details), { elements: [...details.elements, element] }) });
      }, {});
    }
    get trackedElementSignature() {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => this.detailsByOuterHTML[outerHTML].tracked).join("");
    }
    getScriptElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("script", snapshot);
    }
    getStylesheetElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("stylesheet", snapshot);
    }
    getElementsMatchingTypeNotInSnapshot(matchedType, snapshot) {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => !(outerHTML in snapshot.detailsByOuterHTML)).map((outerHTML) => this.detailsByOuterHTML[outerHTML]).filter(({ type }) => type == matchedType).map(({ elements: [element] }) => element);
    }
    get provisionalElements() {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const { type, tracked, elements } = this.detailsByOuterHTML[outerHTML];
        if (type == null && !tracked) {
          return [...result, ...elements];
        } else if (elements.length > 1) {
          return [...result, ...elements.slice(1)];
        } else {
          return result;
        }
      }, []);
    }
    getMetaValue(name) {
      const element = this.findMetaElementByName(name);
      return element ? element.getAttribute("content") : null;
    }
    findMetaElementByName(name) {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const { elements: [element] } = this.detailsByOuterHTML[outerHTML];
        return elementIsMetaElementWithName(element, name) ? element : result;
      }, void 0);
    }
  };
  function elementType(element) {
    if (elementIsScript(element)) {
      return "script";
    } else if (elementIsStylesheet(element)) {
      return "stylesheet";
    }
  }
  function elementIsTracked(element) {
    return element.getAttribute("data-turbo-track") == "reload";
  }
  function elementIsScript(element) {
    const tagName = element.localName;
    return tagName == "script";
  }
  function elementIsNoscript(element) {
    const tagName = element.localName;
    return tagName == "noscript";
  }
  function elementIsStylesheet(element) {
    const tagName = element.localName;
    return tagName == "style" || tagName == "link" && element.getAttribute("rel") == "stylesheet";
  }
  function elementIsMetaElementWithName(element, name) {
    const tagName = element.localName;
    return tagName == "meta" && element.getAttribute("name") == name;
  }
  function elementWithoutNonce(element) {
    if (element.hasAttribute("nonce")) {
      element.setAttribute("nonce", "");
    }
    return element;
  }
  var PageSnapshot = class _PageSnapshot extends Snapshot {
    static fromHTMLString(html = "") {
      return this.fromDocument(parseHTMLDocument(html));
    }
    static fromElement(element) {
      return this.fromDocument(element.ownerDocument);
    }
    static fromDocument({ head, body }) {
      return new this(body, new HeadSnapshot(head));
    }
    constructor(element, headSnapshot) {
      super(element);
      this.headSnapshot = headSnapshot;
    }
    clone() {
      const clonedElement = this.element.cloneNode(true);
      const selectElements = this.element.querySelectorAll("select");
      const clonedSelectElements = clonedElement.querySelectorAll("select");
      for (const [index, source] of selectElements.entries()) {
        const clone = clonedSelectElements[index];
        for (const option of clone.selectedOptions)
          option.selected = false;
        for (const option of source.selectedOptions)
          clone.options[option.index].selected = true;
      }
      for (const clonedPasswordInput of clonedElement.querySelectorAll('input[type="password"]')) {
        clonedPasswordInput.value = "";
      }
      return new _PageSnapshot(clonedElement, this.headSnapshot);
    }
    get headElement() {
      return this.headSnapshot.element;
    }
    get rootLocation() {
      var _a;
      const root = (_a = this.getSetting("root")) !== null && _a !== void 0 ? _a : "/";
      return expandURL(root);
    }
    get cacheControlValue() {
      return this.getSetting("cache-control");
    }
    get isPreviewable() {
      return this.cacheControlValue != "no-preview";
    }
    get isCacheable() {
      return this.cacheControlValue != "no-cache";
    }
    get isVisitable() {
      return this.getSetting("visit-control") != "reload";
    }
    getSetting(name) {
      return this.headSnapshot.getMetaValue(`turbo-${name}`);
    }
  };
  var TimingMetric;
  (function(TimingMetric2) {
    TimingMetric2["visitStart"] = "visitStart";
    TimingMetric2["requestStart"] = "requestStart";
    TimingMetric2["requestEnd"] = "requestEnd";
    TimingMetric2["visitEnd"] = "visitEnd";
  })(TimingMetric || (TimingMetric = {}));
  var VisitState;
  (function(VisitState2) {
    VisitState2["initialized"] = "initialized";
    VisitState2["started"] = "started";
    VisitState2["canceled"] = "canceled";
    VisitState2["failed"] = "failed";
    VisitState2["completed"] = "completed";
  })(VisitState || (VisitState = {}));
  var defaultOptions = {
    action: "advance",
    historyChanged: false,
    visitCachedSnapshot: () => {
    },
    willRender: true,
    updateHistory: true,
    shouldCacheSnapshot: true,
    acceptsStreamResponse: false
  };
  var SystemStatusCode;
  (function(SystemStatusCode2) {
    SystemStatusCode2[SystemStatusCode2["networkFailure"] = 0] = "networkFailure";
    SystemStatusCode2[SystemStatusCode2["timeoutFailure"] = -1] = "timeoutFailure";
    SystemStatusCode2[SystemStatusCode2["contentTypeMismatch"] = -2] = "contentTypeMismatch";
  })(SystemStatusCode || (SystemStatusCode = {}));
  var Visit = class {
    constructor(delegate, location2, restorationIdentifier, options = {}) {
      this.identifier = uuid();
      this.timingMetrics = {};
      this.followedRedirect = false;
      this.historyChanged = false;
      this.scrolled = false;
      this.shouldCacheSnapshot = true;
      this.acceptsStreamResponse = false;
      this.snapshotCached = false;
      this.state = VisitState.initialized;
      this.delegate = delegate;
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier || uuid();
      const { action, historyChanged, referrer, snapshot, snapshotHTML, response, visitCachedSnapshot, willRender, updateHistory, shouldCacheSnapshot, acceptsStreamResponse } = Object.assign(Object.assign({}, defaultOptions), options);
      this.action = action;
      this.historyChanged = historyChanged;
      this.referrer = referrer;
      this.snapshot = snapshot;
      this.snapshotHTML = snapshotHTML;
      this.response = response;
      this.isSamePage = this.delegate.locationWithActionIsSamePage(this.location, this.action);
      this.visitCachedSnapshot = visitCachedSnapshot;
      this.willRender = willRender;
      this.updateHistory = updateHistory;
      this.scrolled = !willRender;
      this.shouldCacheSnapshot = shouldCacheSnapshot;
      this.acceptsStreamResponse = acceptsStreamResponse;
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get history() {
      return this.delegate.history;
    }
    get restorationData() {
      return this.history.getRestorationDataForIdentifier(this.restorationIdentifier);
    }
    get silent() {
      return this.isSamePage;
    }
    start() {
      if (this.state == VisitState.initialized) {
        this.recordTimingMetric(TimingMetric.visitStart);
        this.state = VisitState.started;
        this.adapter.visitStarted(this);
        this.delegate.visitStarted(this);
      }
    }
    cancel() {
      if (this.state == VisitState.started) {
        if (this.request) {
          this.request.cancel();
        }
        this.cancelRender();
        this.state = VisitState.canceled;
      }
    }
    complete() {
      if (this.state == VisitState.started) {
        this.recordTimingMetric(TimingMetric.visitEnd);
        this.state = VisitState.completed;
        this.followRedirect();
        if (!this.followedRedirect) {
          this.adapter.visitCompleted(this);
          this.delegate.visitCompleted(this);
        }
      }
    }
    fail() {
      if (this.state == VisitState.started) {
        this.state = VisitState.failed;
        this.adapter.visitFailed(this);
      }
    }
    changeHistory() {
      var _a;
      if (!this.historyChanged && this.updateHistory) {
        const actionForHistory = this.location.href === ((_a = this.referrer) === null || _a === void 0 ? void 0 : _a.href) ? "replace" : this.action;
        const method = getHistoryMethodForAction(actionForHistory);
        this.history.update(method, this.location, this.restorationIdentifier);
        this.historyChanged = true;
      }
    }
    issueRequest() {
      if (this.hasPreloadedResponse()) {
        this.simulateRequest();
      } else if (this.shouldIssueRequest() && !this.request) {
        this.request = new FetchRequest(this, FetchMethod.get, this.location);
        this.request.perform();
      }
    }
    simulateRequest() {
      if (this.response) {
        this.startRequest();
        this.recordResponse();
        this.finishRequest();
      }
    }
    startRequest() {
      this.recordTimingMetric(TimingMetric.requestStart);
      this.adapter.visitRequestStarted(this);
    }
    recordResponse(response = this.response) {
      this.response = response;
      if (response) {
        const { statusCode } = response;
        if (isSuccessful(statusCode)) {
          this.adapter.visitRequestCompleted(this);
        } else {
          this.adapter.visitRequestFailedWithStatusCode(this, statusCode);
        }
      }
    }
    finishRequest() {
      this.recordTimingMetric(TimingMetric.requestEnd);
      this.adapter.visitRequestFinished(this);
    }
    loadResponse() {
      if (this.response) {
        const { statusCode, responseHTML } = this.response;
        this.render(async () => {
          if (this.shouldCacheSnapshot)
            this.cacheSnapshot();
          if (this.view.renderPromise)
            await this.view.renderPromise;
          if (isSuccessful(statusCode) && responseHTML != null) {
            await this.view.renderPage(PageSnapshot.fromHTMLString(responseHTML), false, this.willRender, this);
            this.performScroll();
            this.adapter.visitRendered(this);
            this.complete();
          } else {
            await this.view.renderError(PageSnapshot.fromHTMLString(responseHTML), this);
            this.adapter.visitRendered(this);
            this.fail();
          }
        });
      }
    }
    getCachedSnapshot() {
      const snapshot = this.view.getCachedSnapshotForLocation(this.location) || this.getPreloadedSnapshot();
      if (snapshot && (!getAnchor(this.location) || snapshot.hasAnchor(getAnchor(this.location)))) {
        if (this.action == "restore" || snapshot.isPreviewable) {
          return snapshot;
        }
      }
    }
    getPreloadedSnapshot() {
      if (this.snapshotHTML) {
        return PageSnapshot.fromHTMLString(this.snapshotHTML);
      }
    }
    hasCachedSnapshot() {
      return this.getCachedSnapshot() != null;
    }
    loadCachedSnapshot() {
      const snapshot = this.getCachedSnapshot();
      if (snapshot) {
        const isPreview = this.shouldIssueRequest();
        this.render(async () => {
          this.cacheSnapshot();
          if (this.isSamePage) {
            this.adapter.visitRendered(this);
          } else {
            if (this.view.renderPromise)
              await this.view.renderPromise;
            await this.view.renderPage(snapshot, isPreview, this.willRender, this);
            this.performScroll();
            this.adapter.visitRendered(this);
            if (!isPreview) {
              this.complete();
            }
          }
        });
      }
    }
    followRedirect() {
      var _a;
      if (this.redirectedToLocation && !this.followedRedirect && ((_a = this.response) === null || _a === void 0 ? void 0 : _a.redirected)) {
        this.adapter.visitProposedToLocation(this.redirectedToLocation, {
          action: "replace",
          response: this.response,
          shouldCacheSnapshot: false,
          willRender: false
        });
        this.followedRedirect = true;
      }
    }
    goToSamePageAnchor() {
      if (this.isSamePage) {
        this.render(async () => {
          this.cacheSnapshot();
          this.performScroll();
          this.changeHistory();
          this.adapter.visitRendered(this);
        });
      }
    }
    prepareRequest(request) {
      if (this.acceptsStreamResponse) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted() {
      this.startRequest();
    }
    requestPreventedHandlingResponse(_request, _response) {
    }
    async requestSucceededWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({
          statusCode: SystemStatusCode.contentTypeMismatch,
          redirected
        });
      } else {
        this.redirectedToLocation = response.redirected ? response.location : void 0;
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    async requestFailedWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({
          statusCode: SystemStatusCode.contentTypeMismatch,
          redirected
        });
      } else {
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    requestErrored(_request, _error) {
      this.recordResponse({
        statusCode: SystemStatusCode.networkFailure,
        redirected: false
      });
    }
    requestFinished() {
      this.finishRequest();
    }
    performScroll() {
      if (!this.scrolled && !this.view.forceReloaded) {
        if (this.action == "restore") {
          this.scrollToRestoredPosition() || this.scrollToAnchor() || this.view.scrollToTop();
        } else {
          this.scrollToAnchor() || this.view.scrollToTop();
        }
        if (this.isSamePage) {
          this.delegate.visitScrolledToSamePageLocation(this.view.lastRenderedLocation, this.location);
        }
        this.scrolled = true;
      }
    }
    scrollToRestoredPosition() {
      const { scrollPosition } = this.restorationData;
      if (scrollPosition) {
        this.view.scrollToPosition(scrollPosition);
        return true;
      }
    }
    scrollToAnchor() {
      const anchor = getAnchor(this.location);
      if (anchor != null) {
        this.view.scrollToAnchor(anchor);
        return true;
      }
    }
    recordTimingMetric(metric) {
      this.timingMetrics[metric] = (/* @__PURE__ */ new Date()).getTime();
    }
    getTimingMetrics() {
      return Object.assign({}, this.timingMetrics);
    }
    getHistoryMethodForAction(action) {
      switch (action) {
        case "replace":
          return history.replaceState;
        case "advance":
        case "restore":
          return history.pushState;
      }
    }
    hasPreloadedResponse() {
      return typeof this.response == "object";
    }
    shouldIssueRequest() {
      if (this.isSamePage) {
        return false;
      } else if (this.action == "restore") {
        return !this.hasCachedSnapshot();
      } else {
        return this.willRender;
      }
    }
    cacheSnapshot() {
      if (!this.snapshotCached) {
        this.view.cacheSnapshot(this.snapshot).then((snapshot) => snapshot && this.visitCachedSnapshot(snapshot));
        this.snapshotCached = true;
      }
    }
    async render(callback) {
      this.cancelRender();
      await new Promise((resolve) => {
        this.frame = requestAnimationFrame(() => resolve());
      });
      await callback();
      delete this.frame;
    }
    cancelRender() {
      if (this.frame) {
        cancelAnimationFrame(this.frame);
        delete this.frame;
      }
    }
  };
  function isSuccessful(statusCode) {
    return statusCode >= 200 && statusCode < 300;
  }
  var BrowserAdapter = class {
    constructor(session2) {
      this.progressBar = new ProgressBar();
      this.showProgressBar = () => {
        this.progressBar.show();
      };
      this.session = session2;
    }
    visitProposedToLocation(location2, options) {
      this.navigator.startVisit(location2, (options === null || options === void 0 ? void 0 : options.restorationIdentifier) || uuid(), options);
    }
    visitStarted(visit2) {
      this.location = visit2.location;
      visit2.loadCachedSnapshot();
      visit2.issueRequest();
      visit2.goToSamePageAnchor();
    }
    visitRequestStarted(visit2) {
      this.progressBar.setValue(0);
      if (visit2.hasCachedSnapshot() || visit2.action != "restore") {
        this.showVisitProgressBarAfterDelay();
      } else {
        this.showProgressBar();
      }
    }
    visitRequestCompleted(visit2) {
      visit2.loadResponse();
    }
    visitRequestFailedWithStatusCode(visit2, statusCode) {
      switch (statusCode) {
        case SystemStatusCode.networkFailure:
        case SystemStatusCode.timeoutFailure:
        case SystemStatusCode.contentTypeMismatch:
          return this.reload({
            reason: "request_failed",
            context: {
              statusCode
            }
          });
        default:
          return visit2.loadResponse();
      }
    }
    visitRequestFinished(_visit) {
      this.progressBar.setValue(1);
      this.hideVisitProgressBar();
    }
    visitCompleted(_visit) {
    }
    pageInvalidated(reason) {
      this.reload(reason);
    }
    visitFailed(_visit) {
    }
    visitRendered(_visit) {
    }
    formSubmissionStarted(_formSubmission) {
      this.progressBar.setValue(0);
      this.showFormProgressBarAfterDelay();
    }
    formSubmissionFinished(_formSubmission) {
      this.progressBar.setValue(1);
      this.hideFormProgressBar();
    }
    showVisitProgressBarAfterDelay() {
      this.visitProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
    }
    hideVisitProgressBar() {
      this.progressBar.hide();
      if (this.visitProgressBarTimeout != null) {
        window.clearTimeout(this.visitProgressBarTimeout);
        delete this.visitProgressBarTimeout;
      }
    }
    showFormProgressBarAfterDelay() {
      if (this.formProgressBarTimeout == null) {
        this.formProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
      }
    }
    hideFormProgressBar() {
      this.progressBar.hide();
      if (this.formProgressBarTimeout != null) {
        window.clearTimeout(this.formProgressBarTimeout);
        delete this.formProgressBarTimeout;
      }
    }
    reload(reason) {
      var _a;
      dispatch("turbo:reload", { detail: reason });
      window.location.href = ((_a = this.location) === null || _a === void 0 ? void 0 : _a.toString()) || window.location.href;
    }
    get navigator() {
      return this.session.navigator;
    }
  };
  var CacheObserver = class {
    constructor() {
      this.selector = "[data-turbo-temporary]";
      this.deprecatedSelector = "[data-turbo-cache=false]";
      this.started = false;
      this.removeTemporaryElements = (_event) => {
        for (const element of this.temporaryElements) {
          element.remove();
        }
      };
    }
    start() {
      if (!this.started) {
        this.started = true;
        addEventListener("turbo:before-cache", this.removeTemporaryElements, false);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        removeEventListener("turbo:before-cache", this.removeTemporaryElements, false);
      }
    }
    get temporaryElements() {
      return [...document.querySelectorAll(this.selector), ...this.temporaryElementsWithDeprecation];
    }
    get temporaryElementsWithDeprecation() {
      const elements = document.querySelectorAll(this.deprecatedSelector);
      if (elements.length) {
        console.warn(`The ${this.deprecatedSelector} selector is deprecated and will be removed in a future version. Use ${this.selector} instead.`);
      }
      return [...elements];
    }
  };
  var FrameRedirector = class {
    constructor(session2, element) {
      this.session = session2;
      this.element = element;
      this.linkInterceptor = new LinkInterceptor(this, element);
      this.formSubmitObserver = new FormSubmitObserver(this, element);
    }
    start() {
      this.linkInterceptor.start();
      this.formSubmitObserver.start();
    }
    stop() {
      this.linkInterceptor.stop();
      this.formSubmitObserver.stop();
    }
    shouldInterceptLinkClick(element, _location, _event) {
      return this.shouldRedirect(element);
    }
    linkClickIntercepted(element, url, event) {
      const frame = this.findFrameElement(element);
      if (frame) {
        frame.delegate.linkClickIntercepted(element, url, event);
      }
    }
    willSubmitForm(element, submitter) {
      return element.closest("turbo-frame") == null && this.shouldSubmit(element, submitter) && this.shouldRedirect(element, submitter);
    }
    formSubmitted(element, submitter) {
      const frame = this.findFrameElement(element, submitter);
      if (frame) {
        frame.delegate.formSubmitted(element, submitter);
      }
    }
    shouldSubmit(form, submitter) {
      var _a;
      const action = getAction(form, submitter);
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const rootLocation = expandURL((_a = meta === null || meta === void 0 ? void 0 : meta.content) !== null && _a !== void 0 ? _a : "/");
      return this.shouldRedirect(form, submitter) && locationIsVisitable(action, rootLocation);
    }
    shouldRedirect(element, submitter) {
      const isNavigatable = element instanceof HTMLFormElement ? this.session.submissionIsNavigatable(element, submitter) : this.session.elementIsNavigatable(element);
      if (isNavigatable) {
        const frame = this.findFrameElement(element, submitter);
        return frame ? frame != element.closest("turbo-frame") : false;
      } else {
        return false;
      }
    }
    findFrameElement(element, submitter) {
      const id = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("data-turbo-frame")) || element.getAttribute("data-turbo-frame");
      if (id && id != "_top") {
        const frame = this.element.querySelector(`#${id}:not([disabled])`);
        if (frame instanceof FrameElement) {
          return frame;
        }
      }
    }
  };
  var History = class {
    constructor(delegate) {
      this.restorationIdentifier = uuid();
      this.restorationData = {};
      this.started = false;
      this.pageLoaded = false;
      this.onPopState = (event) => {
        if (this.shouldHandlePopState()) {
          const { turbo } = event.state || {};
          if (turbo) {
            this.location = new URL(window.location.href);
            const { restorationIdentifier } = turbo;
            this.restorationIdentifier = restorationIdentifier;
            this.delegate.historyPoppedToLocationWithRestorationIdentifier(this.location, restorationIdentifier);
          }
        }
      };
      this.onPageLoad = async (_event) => {
        await nextMicrotask();
        this.pageLoaded = true;
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("popstate", this.onPopState, false);
        addEventListener("load", this.onPageLoad, false);
        this.started = true;
        this.replace(new URL(window.location.href));
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("popstate", this.onPopState, false);
        removeEventListener("load", this.onPageLoad, false);
        this.started = false;
      }
    }
    push(location2, restorationIdentifier) {
      this.update(history.pushState, location2, restorationIdentifier);
    }
    replace(location2, restorationIdentifier) {
      this.update(history.replaceState, location2, restorationIdentifier);
    }
    update(method, location2, restorationIdentifier = uuid()) {
      const state = { turbo: { restorationIdentifier } };
      method.call(history, state, "", location2.href);
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier;
    }
    getRestorationDataForIdentifier(restorationIdentifier) {
      return this.restorationData[restorationIdentifier] || {};
    }
    updateRestorationData(additionalData) {
      const { restorationIdentifier } = this;
      const restorationData = this.restorationData[restorationIdentifier];
      this.restorationData[restorationIdentifier] = Object.assign(Object.assign({}, restorationData), additionalData);
    }
    assumeControlOfScrollRestoration() {
      var _a;
      if (!this.previousScrollRestoration) {
        this.previousScrollRestoration = (_a = history.scrollRestoration) !== null && _a !== void 0 ? _a : "auto";
        history.scrollRestoration = "manual";
      }
    }
    relinquishControlOfScrollRestoration() {
      if (this.previousScrollRestoration) {
        history.scrollRestoration = this.previousScrollRestoration;
        delete this.previousScrollRestoration;
      }
    }
    shouldHandlePopState() {
      return this.pageIsLoaded();
    }
    pageIsLoaded() {
      return this.pageLoaded || document.readyState == "complete";
    }
  };
  var Navigator = class {
    constructor(delegate) {
      this.delegate = delegate;
    }
    proposeVisit(location2, options = {}) {
      if (this.delegate.allowsVisitingLocationWithAction(location2, options.action)) {
        if (locationIsVisitable(location2, this.view.snapshot.rootLocation)) {
          this.delegate.visitProposedToLocation(location2, options);
        } else {
          window.location.href = location2.toString();
        }
      }
    }
    startVisit(locatable, restorationIdentifier, options = {}) {
      this.stop();
      this.currentVisit = new Visit(this, expandURL(locatable), restorationIdentifier, Object.assign({ referrer: this.location }, options));
      this.currentVisit.start();
    }
    submitForm(form, submitter) {
      this.stop();
      this.formSubmission = new FormSubmission(this, form, submitter, true);
      this.formSubmission.start();
    }
    stop() {
      if (this.formSubmission) {
        this.formSubmission.stop();
        delete this.formSubmission;
      }
      if (this.currentVisit) {
        this.currentVisit.cancel();
        delete this.currentVisit;
      }
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get history() {
      return this.delegate.history;
    }
    formSubmissionStarted(formSubmission) {
      if (typeof this.adapter.formSubmissionStarted === "function") {
        this.adapter.formSubmissionStarted(formSubmission);
      }
    }
    async formSubmissionSucceededWithResponse(formSubmission, fetchResponse) {
      if (formSubmission == this.formSubmission) {
        const responseHTML = await fetchResponse.responseHTML;
        if (responseHTML) {
          const shouldCacheSnapshot = formSubmission.isSafe;
          if (!shouldCacheSnapshot) {
            this.view.clearSnapshotCache();
          }
          const { statusCode, redirected } = fetchResponse;
          const action = this.getActionForFormSubmission(formSubmission);
          const visitOptions = {
            action,
            shouldCacheSnapshot,
            response: { statusCode, responseHTML, redirected }
          };
          this.proposeVisit(fetchResponse.location, visitOptions);
        }
      }
    }
    async formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      const responseHTML = await fetchResponse.responseHTML;
      if (responseHTML) {
        const snapshot = PageSnapshot.fromHTMLString(responseHTML);
        if (fetchResponse.serverError) {
          await this.view.renderError(snapshot, this.currentVisit);
        } else {
          await this.view.renderPage(snapshot, false, true, this.currentVisit);
        }
        this.view.scrollToTop();
        this.view.clearSnapshotCache();
      }
    }
    formSubmissionErrored(formSubmission, error2) {
      console.error(error2);
    }
    formSubmissionFinished(formSubmission) {
      if (typeof this.adapter.formSubmissionFinished === "function") {
        this.adapter.formSubmissionFinished(formSubmission);
      }
    }
    visitStarted(visit2) {
      this.delegate.visitStarted(visit2);
    }
    visitCompleted(visit2) {
      this.delegate.visitCompleted(visit2);
    }
    locationWithActionIsSamePage(location2, action) {
      const anchor = getAnchor(location2);
      const currentAnchor = getAnchor(this.view.lastRenderedLocation);
      const isRestorationToTop = action === "restore" && typeof anchor === "undefined";
      return action !== "replace" && getRequestURL(location2) === getRequestURL(this.view.lastRenderedLocation) && (isRestorationToTop || anchor != null && anchor !== currentAnchor);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.delegate.visitScrolledToSamePageLocation(oldURL, newURL);
    }
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    getActionForFormSubmission({ submitter, formElement }) {
      return getVisitAction(submitter, formElement) || "advance";
    }
  };
  var PageStage;
  (function(PageStage2) {
    PageStage2[PageStage2["initial"] = 0] = "initial";
    PageStage2[PageStage2["loading"] = 1] = "loading";
    PageStage2[PageStage2["interactive"] = 2] = "interactive";
    PageStage2[PageStage2["complete"] = 3] = "complete";
  })(PageStage || (PageStage = {}));
  var PageObserver = class {
    constructor(delegate) {
      this.stage = PageStage.initial;
      this.started = false;
      this.interpretReadyState = () => {
        const { readyState } = this;
        if (readyState == "interactive") {
          this.pageIsInteractive();
        } else if (readyState == "complete") {
          this.pageIsComplete();
        }
      };
      this.pageWillUnload = () => {
        this.delegate.pageWillUnload();
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        if (this.stage == PageStage.initial) {
          this.stage = PageStage.loading;
        }
        document.addEventListener("readystatechange", this.interpretReadyState, false);
        addEventListener("pagehide", this.pageWillUnload, false);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        document.removeEventListener("readystatechange", this.interpretReadyState, false);
        removeEventListener("pagehide", this.pageWillUnload, false);
        this.started = false;
      }
    }
    pageIsInteractive() {
      if (this.stage == PageStage.loading) {
        this.stage = PageStage.interactive;
        this.delegate.pageBecameInteractive();
      }
    }
    pageIsComplete() {
      this.pageIsInteractive();
      if (this.stage == PageStage.interactive) {
        this.stage = PageStage.complete;
        this.delegate.pageLoaded();
      }
    }
    get readyState() {
      return document.readyState;
    }
  };
  var ScrollObserver = class {
    constructor(delegate) {
      this.started = false;
      this.onScroll = () => {
        this.updatePosition({ x: window.pageXOffset, y: window.pageYOffset });
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("scroll", this.onScroll, false);
        this.onScroll();
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("scroll", this.onScroll, false);
        this.started = false;
      }
    }
    updatePosition(position) {
      this.delegate.scrollPositionChanged(position);
    }
  };
  var StreamMessageRenderer = class {
    render({ fragment }) {
      Bardo.preservingPermanentElements(this, getPermanentElementMapForFragment(fragment), () => document.documentElement.appendChild(fragment));
    }
    enteringBardo(currentPermanentElement, newPermanentElement) {
      newPermanentElement.replaceWith(currentPermanentElement.cloneNode(true));
    }
    leavingBardo() {
    }
  };
  function getPermanentElementMapForFragment(fragment) {
    const permanentElementsInDocument = queryPermanentElementsAll(document.documentElement);
    const permanentElementMap = {};
    for (const permanentElementInDocument of permanentElementsInDocument) {
      const { id } = permanentElementInDocument;
      for (const streamElement of fragment.querySelectorAll("turbo-stream")) {
        const elementInStream = getPermanentElementById(streamElement.templateElement.content, id);
        if (elementInStream) {
          permanentElementMap[id] = [permanentElementInDocument, elementInStream];
        }
      }
    }
    return permanentElementMap;
  }
  var StreamObserver = class {
    constructor(delegate) {
      this.sources = /* @__PURE__ */ new Set();
      this.started = false;
      this.inspectFetchResponse = (event) => {
        const response = fetchResponseFromEvent(event);
        if (response && fetchResponseIsStream(response)) {
          event.preventDefault();
          this.receiveMessageResponse(response);
        }
      };
      this.receiveMessageEvent = (event) => {
        if (this.started && typeof event.data == "string") {
          this.receiveMessageHTML(event.data);
        }
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        this.started = true;
        addEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        removeEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    connectStreamSource(source) {
      if (!this.streamSourceIsConnected(source)) {
        this.sources.add(source);
        source.addEventListener("message", this.receiveMessageEvent, false);
      }
    }
    disconnectStreamSource(source) {
      if (this.streamSourceIsConnected(source)) {
        this.sources.delete(source);
        source.removeEventListener("message", this.receiveMessageEvent, false);
      }
    }
    streamSourceIsConnected(source) {
      return this.sources.has(source);
    }
    async receiveMessageResponse(response) {
      const html = await response.responseHTML;
      if (html) {
        this.receiveMessageHTML(html);
      }
    }
    receiveMessageHTML(html) {
      this.delegate.receivedMessageFromStream(StreamMessage.wrap(html));
    }
  };
  function fetchResponseFromEvent(event) {
    var _a;
    const fetchResponse = (_a = event.detail) === null || _a === void 0 ? void 0 : _a.fetchResponse;
    if (fetchResponse instanceof FetchResponse) {
      return fetchResponse;
    }
  }
  function fetchResponseIsStream(response) {
    var _a;
    const contentType = (_a = response.contentType) !== null && _a !== void 0 ? _a : "";
    return contentType.startsWith(StreamMessage.contentType);
  }
  var ErrorRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      const { documentElement, body } = document;
      documentElement.replaceChild(newElement, body);
    }
    async render() {
      this.replaceHeadAndBody();
      this.activateScriptElements();
    }
    replaceHeadAndBody() {
      const { documentElement, head } = document;
      documentElement.replaceChild(this.newHead, head);
      this.renderElement(this.currentElement, this.newElement);
    }
    activateScriptElements() {
      for (const replaceableElement of this.scriptElements) {
        const parentNode = replaceableElement.parentNode;
        if (parentNode) {
          const element = activateScriptElement(replaceableElement);
          parentNode.replaceChild(element, replaceableElement);
        }
      }
    }
    get newHead() {
      return this.newSnapshot.headSnapshot.element;
    }
    get scriptElements() {
      return document.documentElement.querySelectorAll("script");
    }
  };
  var PageRenderer = class extends Renderer {
    static renderElement(currentElement, newElement) {
      if (document.body && newElement instanceof HTMLBodyElement) {
        document.body.replaceWith(newElement);
      } else {
        document.documentElement.appendChild(newElement);
      }
    }
    get shouldRender() {
      return this.newSnapshot.isVisitable && this.trackedElementsAreIdentical;
    }
    get reloadReason() {
      if (!this.newSnapshot.isVisitable) {
        return {
          reason: "turbo_visit_control_is_reload"
        };
      }
      if (!this.trackedElementsAreIdentical) {
        return {
          reason: "tracked_element_mismatch"
        };
      }
    }
    async prepareToRender() {
      await this.mergeHead();
    }
    async render() {
      if (this.willRender) {
        await this.replaceBody();
      }
    }
    finishRendering() {
      super.finishRendering();
      if (!this.isPreview) {
        this.focusFirstAutofocusableElement();
      }
    }
    get currentHeadSnapshot() {
      return this.currentSnapshot.headSnapshot;
    }
    get newHeadSnapshot() {
      return this.newSnapshot.headSnapshot;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    async mergeHead() {
      const mergedHeadElements = this.mergeProvisionalElements();
      const newStylesheetElements = this.copyNewHeadStylesheetElements();
      this.copyNewHeadScriptElements();
      await mergedHeadElements;
      await newStylesheetElements;
    }
    async replaceBody() {
      await this.preservingPermanentElements(async () => {
        this.activateNewBody();
        await this.assignNewBody();
      });
    }
    get trackedElementsAreIdentical() {
      return this.currentHeadSnapshot.trackedElementSignature == this.newHeadSnapshot.trackedElementSignature;
    }
    async copyNewHeadStylesheetElements() {
      const loadingElements = [];
      for (const element of this.newHeadStylesheetElements) {
        loadingElements.push(waitForLoad(element));
        document.head.appendChild(element);
      }
      await Promise.all(loadingElements);
    }
    copyNewHeadScriptElements() {
      for (const element of this.newHeadScriptElements) {
        document.head.appendChild(activateScriptElement(element));
      }
    }
    async mergeProvisionalElements() {
      const newHeadElements = [...this.newHeadProvisionalElements];
      for (const element of this.currentHeadProvisionalElements) {
        if (!this.isCurrentElementInElementList(element, newHeadElements)) {
          document.head.removeChild(element);
        }
      }
      for (const element of newHeadElements) {
        document.head.appendChild(element);
      }
    }
    isCurrentElementInElementList(element, elementList) {
      for (const [index, newElement] of elementList.entries()) {
        if (element.tagName == "TITLE") {
          if (newElement.tagName != "TITLE") {
            continue;
          }
          if (element.innerHTML == newElement.innerHTML) {
            elementList.splice(index, 1);
            return true;
          }
        }
        if (newElement.isEqualNode(element)) {
          elementList.splice(index, 1);
          return true;
        }
      }
      return false;
    }
    removeCurrentHeadProvisionalElements() {
      for (const element of this.currentHeadProvisionalElements) {
        document.head.removeChild(element);
      }
    }
    copyNewHeadProvisionalElements() {
      for (const element of this.newHeadProvisionalElements) {
        document.head.appendChild(element);
      }
    }
    activateNewBody() {
      document.adoptNode(this.newElement);
      this.activateNewBodyScriptElements();
    }
    activateNewBodyScriptElements() {
      for (const inertScriptElement of this.newBodyScriptElements) {
        const activatedScriptElement = activateScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    async assignNewBody() {
      await this.renderElement(this.currentElement, this.newElement);
    }
    get newHeadStylesheetElements() {
      return this.newHeadSnapshot.getStylesheetElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get newHeadScriptElements() {
      return this.newHeadSnapshot.getScriptElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get currentHeadProvisionalElements() {
      return this.currentHeadSnapshot.provisionalElements;
    }
    get newHeadProvisionalElements() {
      return this.newHeadSnapshot.provisionalElements;
    }
    get newBodyScriptElements() {
      return this.newElement.querySelectorAll("script");
    }
  };
  var SnapshotCache = class {
    constructor(size) {
      this.keys = [];
      this.snapshots = {};
      this.size = size;
    }
    has(location2) {
      return toCacheKey(location2) in this.snapshots;
    }
    get(location2) {
      if (this.has(location2)) {
        const snapshot = this.read(location2);
        this.touch(location2);
        return snapshot;
      }
    }
    put(location2, snapshot) {
      this.write(location2, snapshot);
      this.touch(location2);
      return snapshot;
    }
    clear() {
      this.snapshots = {};
    }
    read(location2) {
      return this.snapshots[toCacheKey(location2)];
    }
    write(location2, snapshot) {
      this.snapshots[toCacheKey(location2)] = snapshot;
    }
    touch(location2) {
      const key = toCacheKey(location2);
      const index = this.keys.indexOf(key);
      if (index > -1)
        this.keys.splice(index, 1);
      this.keys.unshift(key);
      this.trim();
    }
    trim() {
      for (const key of this.keys.splice(this.size)) {
        delete this.snapshots[key];
      }
    }
  };
  var PageView = class extends View {
    constructor() {
      super(...arguments);
      this.snapshotCache = new SnapshotCache(10);
      this.lastRenderedLocation = new URL(location.href);
      this.forceReloaded = false;
    }
    renderPage(snapshot, isPreview = false, willRender = true, visit2) {
      const renderer = new PageRenderer(this.snapshot, snapshot, PageRenderer.renderElement, isPreview, willRender);
      if (!renderer.shouldRender) {
        this.forceReloaded = true;
      } else {
        visit2 === null || visit2 === void 0 ? void 0 : visit2.changeHistory();
      }
      return this.render(renderer);
    }
    renderError(snapshot, visit2) {
      visit2 === null || visit2 === void 0 ? void 0 : visit2.changeHistory();
      const renderer = new ErrorRenderer(this.snapshot, snapshot, ErrorRenderer.renderElement, false);
      return this.render(renderer);
    }
    clearSnapshotCache() {
      this.snapshotCache.clear();
    }
    async cacheSnapshot(snapshot = this.snapshot) {
      if (snapshot.isCacheable) {
        this.delegate.viewWillCacheSnapshot();
        const { lastRenderedLocation: location2 } = this;
        await nextEventLoopTick();
        const cachedSnapshot = snapshot.clone();
        this.snapshotCache.put(location2, cachedSnapshot);
        return cachedSnapshot;
      }
    }
    getCachedSnapshotForLocation(location2) {
      return this.snapshotCache.get(location2);
    }
    get snapshot() {
      return PageSnapshot.fromElement(this.element);
    }
  };
  var Preloader = class {
    constructor(delegate) {
      this.selector = "a[data-turbo-preload]";
      this.delegate = delegate;
    }
    get snapshotCache() {
      return this.delegate.navigator.view.snapshotCache;
    }
    start() {
      if (document.readyState === "loading") {
        return document.addEventListener("DOMContentLoaded", () => {
          this.preloadOnLoadLinksForView(document.body);
        });
      } else {
        this.preloadOnLoadLinksForView(document.body);
      }
    }
    preloadOnLoadLinksForView(element) {
      for (const link of element.querySelectorAll(this.selector)) {
        this.preloadURL(link);
      }
    }
    async preloadURL(link) {
      const location2 = new URL(link.href);
      if (this.snapshotCache.has(location2)) {
        return;
      }
      try {
        const response = await fetch(location2.toString(), { headers: { "VND.PREFETCH": "true", Accept: "text/html" } });
        const responseText = await response.text();
        const snapshot = PageSnapshot.fromHTMLString(responseText);
        this.snapshotCache.put(location2, snapshot);
      } catch (_) {
      }
    }
  };
  var Session = class {
    constructor() {
      this.navigator = new Navigator(this);
      this.history = new History(this);
      this.preloader = new Preloader(this);
      this.view = new PageView(this, document.documentElement);
      this.adapter = new BrowserAdapter(this);
      this.pageObserver = new PageObserver(this);
      this.cacheObserver = new CacheObserver();
      this.linkClickObserver = new LinkClickObserver(this, window);
      this.formSubmitObserver = new FormSubmitObserver(this, document);
      this.scrollObserver = new ScrollObserver(this);
      this.streamObserver = new StreamObserver(this);
      this.formLinkClickObserver = new FormLinkClickObserver(this, document.documentElement);
      this.frameRedirector = new FrameRedirector(this, document.documentElement);
      this.streamMessageRenderer = new StreamMessageRenderer();
      this.drive = true;
      this.enabled = true;
      this.progressBarDelay = 500;
      this.started = false;
      this.formMode = "on";
    }
    start() {
      if (!this.started) {
        this.pageObserver.start();
        this.cacheObserver.start();
        this.formLinkClickObserver.start();
        this.linkClickObserver.start();
        this.formSubmitObserver.start();
        this.scrollObserver.start();
        this.streamObserver.start();
        this.frameRedirector.start();
        this.history.start();
        this.preloader.start();
        this.started = true;
        this.enabled = true;
      }
    }
    disable() {
      this.enabled = false;
    }
    stop() {
      if (this.started) {
        this.pageObserver.stop();
        this.cacheObserver.stop();
        this.formLinkClickObserver.stop();
        this.linkClickObserver.stop();
        this.formSubmitObserver.stop();
        this.scrollObserver.stop();
        this.streamObserver.stop();
        this.frameRedirector.stop();
        this.history.stop();
        this.started = false;
      }
    }
    registerAdapter(adapter) {
      this.adapter = adapter;
    }
    visit(location2, options = {}) {
      const frameElement = options.frame ? document.getElementById(options.frame) : null;
      if (frameElement instanceof FrameElement) {
        frameElement.src = location2.toString();
        frameElement.loaded;
      } else {
        this.navigator.proposeVisit(expandURL(location2), options);
      }
    }
    connectStreamSource(source) {
      this.streamObserver.connectStreamSource(source);
    }
    disconnectStreamSource(source) {
      this.streamObserver.disconnectStreamSource(source);
    }
    renderStreamMessage(message) {
      this.streamMessageRenderer.render(StreamMessage.wrap(message));
    }
    clearCache() {
      this.view.clearSnapshotCache();
    }
    setProgressBarDelay(delay) {
      this.progressBarDelay = delay;
    }
    setFormMode(mode) {
      this.formMode = mode;
    }
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    historyPoppedToLocationWithRestorationIdentifier(location2, restorationIdentifier) {
      if (this.enabled) {
        this.navigator.startVisit(location2, restorationIdentifier, {
          action: "restore",
          historyChanged: true
        });
      } else {
        this.adapter.pageInvalidated({
          reason: "turbo_disabled"
        });
      }
    }
    scrollPositionChanged(position) {
      this.history.updateRestorationData({ scrollPosition: position });
    }
    willSubmitFormLinkToLocation(link, location2) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation);
    }
    submittedFormLinkToLocation() {
    }
    willFollowLinkToLocation(link, location2, event) {
      return this.elementIsNavigatable(link) && locationIsVisitable(location2, this.snapshot.rootLocation) && this.applicationAllowsFollowingLinkToLocation(link, location2, event);
    }
    followedLinkToLocation(link, location2) {
      const action = this.getActionForLink(link);
      const acceptsStreamResponse = link.hasAttribute("data-turbo-stream");
      this.visit(location2.href, { action, acceptsStreamResponse });
    }
    allowsVisitingLocationWithAction(location2, action) {
      return this.locationWithActionIsSamePage(location2, action) || this.applicationAllowsVisitingLocation(location2);
    }
    visitProposedToLocation(location2, options) {
      extendURLWithDeprecatedProperties(location2);
      this.adapter.visitProposedToLocation(location2, options);
    }
    visitStarted(visit2) {
      if (!visit2.acceptsStreamResponse) {
        markAsBusy(document.documentElement);
      }
      extendURLWithDeprecatedProperties(visit2.location);
      if (!visit2.silent) {
        this.notifyApplicationAfterVisitingLocation(visit2.location, visit2.action);
      }
    }
    visitCompleted(visit2) {
      clearBusyState(document.documentElement);
      this.notifyApplicationAfterPageLoad(visit2.getTimingMetrics());
    }
    locationWithActionIsSamePage(location2, action) {
      return this.navigator.locationWithActionIsSamePage(location2, action);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL);
    }
    willSubmitForm(form, submitter) {
      const action = getAction(form, submitter);
      return this.submissionIsNavigatable(form, submitter) && locationIsVisitable(expandURL(action), this.snapshot.rootLocation);
    }
    formSubmitted(form, submitter) {
      this.navigator.submitForm(form, submitter);
    }
    pageBecameInteractive() {
      this.view.lastRenderedLocation = this.location;
      this.notifyApplicationAfterPageLoad();
    }
    pageLoaded() {
      this.history.assumeControlOfScrollRestoration();
    }
    pageWillUnload() {
      this.history.relinquishControlOfScrollRestoration();
    }
    receivedMessageFromStream(message) {
      this.renderStreamMessage(message);
    }
    viewWillCacheSnapshot() {
      var _a;
      if (!((_a = this.navigator.currentVisit) === null || _a === void 0 ? void 0 : _a.silent)) {
        this.notifyApplicationBeforeCachingSnapshot();
      }
    }
    allowsImmediateRender({ element }, options) {
      const event = this.notifyApplicationBeforeRender(element, options);
      const { defaultPrevented, detail: { render } } = event;
      if (this.view.renderer && render) {
        this.view.renderer.renderElement = render;
      }
      return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview) {
      this.view.lastRenderedLocation = this.history.location;
      this.notifyApplicationAfterRender();
    }
    preloadOnLoadLinksForView(element) {
      this.preloader.preloadOnLoadLinksForView(element);
    }
    viewInvalidated(reason) {
      this.adapter.pageInvalidated(reason);
    }
    frameLoaded(frame) {
      this.notifyApplicationAfterFrameLoad(frame);
    }
    frameRendered(fetchResponse, frame) {
      this.notifyApplicationAfterFrameRender(fetchResponse, frame);
    }
    applicationAllowsFollowingLinkToLocation(link, location2, ev) {
      const event = this.notifyApplicationAfterClickingLinkToLocation(link, location2, ev);
      return !event.defaultPrevented;
    }
    applicationAllowsVisitingLocation(location2) {
      const event = this.notifyApplicationBeforeVisitingLocation(location2);
      return !event.defaultPrevented;
    }
    notifyApplicationAfterClickingLinkToLocation(link, location2, event) {
      return dispatch("turbo:click", {
        target: link,
        detail: { url: location2.href, originalEvent: event },
        cancelable: true
      });
    }
    notifyApplicationBeforeVisitingLocation(location2) {
      return dispatch("turbo:before-visit", {
        detail: { url: location2.href },
        cancelable: true
      });
    }
    notifyApplicationAfterVisitingLocation(location2, action) {
      return dispatch("turbo:visit", { detail: { url: location2.href, action } });
    }
    notifyApplicationBeforeCachingSnapshot() {
      return dispatch("turbo:before-cache");
    }
    notifyApplicationBeforeRender(newBody, options) {
      return dispatch("turbo:before-render", {
        detail: Object.assign({ newBody }, options),
        cancelable: true
      });
    }
    notifyApplicationAfterRender() {
      return dispatch("turbo:render");
    }
    notifyApplicationAfterPageLoad(timing = {}) {
      return dispatch("turbo:load", {
        detail: { url: this.location.href, timing }
      });
    }
    notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL) {
      dispatchEvent(new HashChangeEvent("hashchange", {
        oldURL: oldURL.toString(),
        newURL: newURL.toString()
      }));
    }
    notifyApplicationAfterFrameLoad(frame) {
      return dispatch("turbo:frame-load", { target: frame });
    }
    notifyApplicationAfterFrameRender(fetchResponse, frame) {
      return dispatch("turbo:frame-render", {
        detail: { fetchResponse },
        target: frame,
        cancelable: true
      });
    }
    submissionIsNavigatable(form, submitter) {
      if (this.formMode == "off") {
        return false;
      } else {
        const submitterIsNavigatable = submitter ? this.elementIsNavigatable(submitter) : true;
        if (this.formMode == "optin") {
          return submitterIsNavigatable && form.closest('[data-turbo="true"]') != null;
        } else {
          return submitterIsNavigatable && this.elementIsNavigatable(form);
        }
      }
    }
    elementIsNavigatable(element) {
      const container = findClosestRecursively(element, "[data-turbo]");
      const withinFrame = findClosestRecursively(element, "turbo-frame");
      if (this.drive || withinFrame) {
        if (container) {
          return container.getAttribute("data-turbo") != "false";
        } else {
          return true;
        }
      } else {
        if (container) {
          return container.getAttribute("data-turbo") == "true";
        } else {
          return false;
        }
      }
    }
    getActionForLink(link) {
      return getVisitAction(link) || "advance";
    }
    get snapshot() {
      return this.view.snapshot;
    }
  };
  function extendURLWithDeprecatedProperties(url) {
    Object.defineProperties(url, deprecatedLocationPropertyDescriptors);
  }
  var deprecatedLocationPropertyDescriptors = {
    absoluteURL: {
      get() {
        return this.toString();
      }
    }
  };
  var Cache = class {
    constructor(session2) {
      this.session = session2;
    }
    clear() {
      this.session.clearCache();
    }
    resetCacheControl() {
      this.setCacheControl("");
    }
    exemptPageFromCache() {
      this.setCacheControl("no-cache");
    }
    exemptPageFromPreview() {
      this.setCacheControl("no-preview");
    }
    setCacheControl(value) {
      setMetaContent("turbo-cache-control", value);
    }
  };
  var StreamActions = {
    after() {
      this.targetElements.forEach((e) => {
        var _a;
        return (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e.nextSibling);
      });
    },
    append() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e) => e.append(this.templateContent));
    },
    before() {
      this.targetElements.forEach((e) => {
        var _a;
        return (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e);
      });
    },
    prepend() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e) => e.prepend(this.templateContent));
    },
    remove() {
      this.targetElements.forEach((e) => e.remove());
    },
    replace() {
      this.targetElements.forEach((e) => e.replaceWith(this.templateContent));
    },
    update() {
      this.targetElements.forEach((targetElement) => {
        targetElement.innerHTML = "";
        targetElement.append(this.templateContent);
      });
    }
  };
  var session = new Session();
  var cache = new Cache(session);
  var { navigator: navigator$1 } = session;
  function start() {
    session.start();
  }
  function registerAdapter(adapter) {
    session.registerAdapter(adapter);
  }
  function visit(location2, options) {
    session.visit(location2, options);
  }
  function connectStreamSource(source) {
    session.connectStreamSource(source);
  }
  function disconnectStreamSource(source) {
    session.disconnectStreamSource(source);
  }
  function renderStreamMessage(message) {
    session.renderStreamMessage(message);
  }
  function clearCache() {
    console.warn("Please replace `Turbo.clearCache()` with `Turbo.cache.clear()`. The top-level function is deprecated and will be removed in a future version of Turbo.`");
    session.clearCache();
  }
  function setProgressBarDelay(delay) {
    session.setProgressBarDelay(delay);
  }
  function setConfirmMethod(confirmMethod) {
    FormSubmission.confirmMethod = confirmMethod;
  }
  function setFormMode(mode) {
    session.setFormMode(mode);
  }
  var Turbo2 = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    navigator: navigator$1,
    session,
    cache,
    PageRenderer,
    PageSnapshot,
    FrameRenderer,
    start,
    registerAdapter,
    visit,
    connectStreamSource,
    disconnectStreamSource,
    renderStreamMessage,
    clearCache,
    setProgressBarDelay,
    setConfirmMethod,
    setFormMode,
    StreamActions
  });
  var TurboFrameMissingError = class extends Error {
  };
  var FrameController = class {
    constructor(element) {
      this.fetchResponseLoaded = (_fetchResponse) => {
      };
      this.currentFetchRequest = null;
      this.resolveVisitPromise = () => {
      };
      this.connected = false;
      this.hasBeenLoaded = false;
      this.ignoredAttributes = /* @__PURE__ */ new Set();
      this.action = null;
      this.visitCachedSnapshot = ({ element: element2 }) => {
        const frame = element2.querySelector("#" + this.element.id);
        if (frame && this.previousFrameElement) {
          frame.replaceChildren(...this.previousFrameElement.children);
        }
        delete this.previousFrameElement;
      };
      this.element = element;
      this.view = new FrameView(this, this.element);
      this.appearanceObserver = new AppearanceObserver(this, this.element);
      this.formLinkClickObserver = new FormLinkClickObserver(this, this.element);
      this.linkInterceptor = new LinkInterceptor(this, this.element);
      this.restorationIdentifier = uuid();
      this.formSubmitObserver = new FormSubmitObserver(this, this.element);
    }
    connect() {
      if (!this.connected) {
        this.connected = true;
        if (this.loadingStyle == FrameLoadingStyle.lazy) {
          this.appearanceObserver.start();
        } else {
          this.loadSourceURL();
        }
        this.formLinkClickObserver.start();
        this.linkInterceptor.start();
        this.formSubmitObserver.start();
      }
    }
    disconnect() {
      if (this.connected) {
        this.connected = false;
        this.appearanceObserver.stop();
        this.formLinkClickObserver.stop();
        this.linkInterceptor.stop();
        this.formSubmitObserver.stop();
      }
    }
    disabledChanged() {
      if (this.loadingStyle == FrameLoadingStyle.eager) {
        this.loadSourceURL();
      }
    }
    sourceURLChanged() {
      if (this.isIgnoringChangesTo("src"))
        return;
      if (this.element.isConnected) {
        this.complete = false;
      }
      if (this.loadingStyle == FrameLoadingStyle.eager || this.hasBeenLoaded) {
        this.loadSourceURL();
      }
    }
    sourceURLReloaded() {
      const { src } = this.element;
      this.ignoringChangesToAttribute("complete", () => {
        this.element.removeAttribute("complete");
      });
      this.element.src = null;
      this.element.src = src;
      return this.element.loaded;
    }
    completeChanged() {
      if (this.isIgnoringChangesTo("complete"))
        return;
      this.loadSourceURL();
    }
    loadingStyleChanged() {
      if (this.loadingStyle == FrameLoadingStyle.lazy) {
        this.appearanceObserver.start();
      } else {
        this.appearanceObserver.stop();
        this.loadSourceURL();
      }
    }
    async loadSourceURL() {
      if (this.enabled && this.isActive && !this.complete && this.sourceURL) {
        this.element.loaded = this.visit(expandURL(this.sourceURL));
        this.appearanceObserver.stop();
        await this.element.loaded;
        this.hasBeenLoaded = true;
      }
    }
    async loadResponse(fetchResponse) {
      if (fetchResponse.redirected || fetchResponse.succeeded && fetchResponse.isHTML) {
        this.sourceURL = fetchResponse.response.url;
      }
      try {
        const html = await fetchResponse.responseHTML;
        if (html) {
          const document2 = parseHTMLDocument(html);
          const pageSnapshot = PageSnapshot.fromDocument(document2);
          if (pageSnapshot.isVisitable) {
            await this.loadFrameResponse(fetchResponse, document2);
          } else {
            await this.handleUnvisitableFrameResponse(fetchResponse);
          }
        }
      } finally {
        this.fetchResponseLoaded = () => {
        };
      }
    }
    elementAppearedInViewport(element) {
      this.proposeVisitIfNavigatedWithAction(element, element);
      this.loadSourceURL();
    }
    willSubmitFormLinkToLocation(link) {
      return this.shouldInterceptNavigation(link);
    }
    submittedFormLinkToLocation(link, _location, form) {
      const frame = this.findFrameElement(link);
      if (frame)
        form.setAttribute("data-turbo-frame", frame.id);
    }
    shouldInterceptLinkClick(element, _location, _event) {
      return this.shouldInterceptNavigation(element);
    }
    linkClickIntercepted(element, location2) {
      this.navigateFrame(element, location2);
    }
    willSubmitForm(element, submitter) {
      return element.closest("turbo-frame") == this.element && this.shouldInterceptNavigation(element, submitter);
    }
    formSubmitted(element, submitter) {
      if (this.formSubmission) {
        this.formSubmission.stop();
      }
      this.formSubmission = new FormSubmission(this, element, submitter);
      const { fetchRequest } = this.formSubmission;
      this.prepareRequest(fetchRequest);
      this.formSubmission.start();
    }
    prepareRequest(request) {
      var _a;
      request.headers["Turbo-Frame"] = this.id;
      if ((_a = this.currentNavigationElement) === null || _a === void 0 ? void 0 : _a.hasAttribute("data-turbo-stream")) {
        request.acceptResponseType(StreamMessage.contentType);
      }
    }
    requestStarted(_request) {
      markAsBusy(this.element);
    }
    requestPreventedHandlingResponse(_request, _response) {
      this.resolveVisitPromise();
    }
    async requestSucceededWithResponse(request, response) {
      await this.loadResponse(response);
      this.resolveVisitPromise();
    }
    async requestFailedWithResponse(request, response) {
      await this.loadResponse(response);
      this.resolveVisitPromise();
    }
    requestErrored(request, error2) {
      console.error(error2);
      this.resolveVisitPromise();
    }
    requestFinished(_request) {
      clearBusyState(this.element);
    }
    formSubmissionStarted({ formElement }) {
      markAsBusy(formElement, this.findFrameElement(formElement));
    }
    formSubmissionSucceededWithResponse(formSubmission, response) {
      const frame = this.findFrameElement(formSubmission.formElement, formSubmission.submitter);
      frame.delegate.proposeVisitIfNavigatedWithAction(frame, formSubmission.formElement, formSubmission.submitter);
      frame.delegate.loadResponse(response);
      if (!formSubmission.isSafe) {
        session.clearCache();
      }
    }
    formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      this.element.delegate.loadResponse(fetchResponse);
      session.clearCache();
    }
    formSubmissionErrored(formSubmission, error2) {
      console.error(error2);
    }
    formSubmissionFinished({ formElement }) {
      clearBusyState(formElement, this.findFrameElement(formElement));
    }
    allowsImmediateRender({ element: newFrame }, options) {
      const event = dispatch("turbo:before-frame-render", {
        target: this.element,
        detail: Object.assign({ newFrame }, options),
        cancelable: true
      });
      const { defaultPrevented, detail: { render } } = event;
      if (this.view.renderer && render) {
        this.view.renderer.renderElement = render;
      }
      return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview) {
    }
    preloadOnLoadLinksForView(element) {
      session.preloadOnLoadLinksForView(element);
    }
    viewInvalidated() {
    }
    willRenderFrame(currentElement, _newElement) {
      this.previousFrameElement = currentElement.cloneNode(true);
    }
    async loadFrameResponse(fetchResponse, document2) {
      const newFrameElement = await this.extractForeignFrameElement(document2.body);
      if (newFrameElement) {
        const snapshot = new Snapshot(newFrameElement);
        const renderer = new FrameRenderer(this, this.view.snapshot, snapshot, FrameRenderer.renderElement, false, false);
        if (this.view.renderPromise)
          await this.view.renderPromise;
        this.changeHistory();
        await this.view.render(renderer);
        this.complete = true;
        session.frameRendered(fetchResponse, this.element);
        session.frameLoaded(this.element);
        this.fetchResponseLoaded(fetchResponse);
      } else if (this.willHandleFrameMissingFromResponse(fetchResponse)) {
        this.handleFrameMissingFromResponse(fetchResponse);
      }
    }
    async visit(url) {
      var _a;
      const request = new FetchRequest(this, FetchMethod.get, url, new URLSearchParams(), this.element);
      (_a = this.currentFetchRequest) === null || _a === void 0 ? void 0 : _a.cancel();
      this.currentFetchRequest = request;
      return new Promise((resolve) => {
        this.resolveVisitPromise = () => {
          this.resolveVisitPromise = () => {
          };
          this.currentFetchRequest = null;
          resolve();
        };
        request.perform();
      });
    }
    navigateFrame(element, url, submitter) {
      const frame = this.findFrameElement(element, submitter);
      frame.delegate.proposeVisitIfNavigatedWithAction(frame, element, submitter);
      this.withCurrentNavigationElement(element, () => {
        frame.src = url;
      });
    }
    proposeVisitIfNavigatedWithAction(frame, element, submitter) {
      this.action = getVisitAction(submitter, element, frame);
      if (this.action) {
        const pageSnapshot = PageSnapshot.fromElement(frame).clone();
        const { visitCachedSnapshot } = frame.delegate;
        frame.delegate.fetchResponseLoaded = (fetchResponse) => {
          if (frame.src) {
            const { statusCode, redirected } = fetchResponse;
            const responseHTML = frame.ownerDocument.documentElement.outerHTML;
            const response = { statusCode, redirected, responseHTML };
            const options = {
              response,
              visitCachedSnapshot,
              willRender: false,
              updateHistory: false,
              restorationIdentifier: this.restorationIdentifier,
              snapshot: pageSnapshot
            };
            if (this.action)
              options.action = this.action;
            session.visit(frame.src, options);
          }
        };
      }
    }
    changeHistory() {
      if (this.action) {
        const method = getHistoryMethodForAction(this.action);
        session.history.update(method, expandURL(this.element.src || ""), this.restorationIdentifier);
      }
    }
    async handleUnvisitableFrameResponse(fetchResponse) {
      console.warn(`The response (${fetchResponse.statusCode}) from <turbo-frame id="${this.element.id}"> is performing a full page visit due to turbo-visit-control.`);
      await this.visitResponse(fetchResponse.response);
    }
    willHandleFrameMissingFromResponse(fetchResponse) {
      this.element.setAttribute("complete", "");
      const response = fetchResponse.response;
      const visit2 = async (url, options = {}) => {
        if (url instanceof Response) {
          this.visitResponse(url);
        } else {
          session.visit(url, options);
        }
      };
      const event = dispatch("turbo:frame-missing", {
        target: this.element,
        detail: { response, visit: visit2 },
        cancelable: true
      });
      return !event.defaultPrevented;
    }
    handleFrameMissingFromResponse(fetchResponse) {
      this.view.missing();
      this.throwFrameMissingError(fetchResponse);
    }
    throwFrameMissingError(fetchResponse) {
      const message = `The response (${fetchResponse.statusCode}) did not contain the expected <turbo-frame id="${this.element.id}"> and will be ignored. To perform a full page visit instead, set turbo-visit-control to reload.`;
      throw new TurboFrameMissingError(message);
    }
    async visitResponse(response) {
      const wrapped = new FetchResponse(response);
      const responseHTML = await wrapped.responseHTML;
      const { location: location2, redirected, statusCode } = wrapped;
      return session.visit(location2, { response: { redirected, statusCode, responseHTML } });
    }
    findFrameElement(element, submitter) {
      var _a;
      const id = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
      return (_a = getFrameElementById(id)) !== null && _a !== void 0 ? _a : this.element;
    }
    async extractForeignFrameElement(container) {
      let element;
      const id = CSS.escape(this.id);
      try {
        element = activateElement(container.querySelector(`turbo-frame#${id}`), this.sourceURL);
        if (element) {
          return element;
        }
        element = activateElement(container.querySelector(`turbo-frame[src][recurse~=${id}]`), this.sourceURL);
        if (element) {
          await element.loaded;
          return await this.extractForeignFrameElement(element);
        }
      } catch (error2) {
        console.error(error2);
        return new FrameElement();
      }
      return null;
    }
    formActionIsVisitable(form, submitter) {
      const action = getAction(form, submitter);
      return locationIsVisitable(expandURL(action), this.rootLocation);
    }
    shouldInterceptNavigation(element, submitter) {
      const id = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
      if (element instanceof HTMLFormElement && !this.formActionIsVisitable(element, submitter)) {
        return false;
      }
      if (!this.enabled || id == "_top") {
        return false;
      }
      if (id) {
        const frameElement = getFrameElementById(id);
        if (frameElement) {
          return !frameElement.disabled;
        }
      }
      if (!session.elementIsNavigatable(element)) {
        return false;
      }
      if (submitter && !session.elementIsNavigatable(submitter)) {
        return false;
      }
      return true;
    }
    get id() {
      return this.element.id;
    }
    get enabled() {
      return !this.element.disabled;
    }
    get sourceURL() {
      if (this.element.src) {
        return this.element.src;
      }
    }
    set sourceURL(sourceURL) {
      this.ignoringChangesToAttribute("src", () => {
        this.element.src = sourceURL !== null && sourceURL !== void 0 ? sourceURL : null;
      });
    }
    get loadingStyle() {
      return this.element.loading;
    }
    get isLoading() {
      return this.formSubmission !== void 0 || this.resolveVisitPromise() !== void 0;
    }
    get complete() {
      return this.element.hasAttribute("complete");
    }
    set complete(value) {
      this.ignoringChangesToAttribute("complete", () => {
        if (value) {
          this.element.setAttribute("complete", "");
        } else {
          this.element.removeAttribute("complete");
        }
      });
    }
    get isActive() {
      return this.element.isActive && this.connected;
    }
    get rootLocation() {
      var _a;
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const root = (_a = meta === null || meta === void 0 ? void 0 : meta.content) !== null && _a !== void 0 ? _a : "/";
      return expandURL(root);
    }
    isIgnoringChangesTo(attributeName) {
      return this.ignoredAttributes.has(attributeName);
    }
    ignoringChangesToAttribute(attributeName, callback) {
      this.ignoredAttributes.add(attributeName);
      callback();
      this.ignoredAttributes.delete(attributeName);
    }
    withCurrentNavigationElement(element, callback) {
      this.currentNavigationElement = element;
      callback();
      delete this.currentNavigationElement;
    }
  };
  function getFrameElementById(id) {
    if (id != null) {
      const element = document.getElementById(id);
      if (element instanceof FrameElement) {
        return element;
      }
    }
  }
  function activateElement(element, currentURL) {
    if (element) {
      const src = element.getAttribute("src");
      if (src != null && currentURL != null && urlsAreEqual(src, currentURL)) {
        throw new Error(`Matching <turbo-frame id="${element.id}"> element has a source URL which references itself`);
      }
      if (element.ownerDocument !== document) {
        element = document.importNode(element, true);
      }
      if (element instanceof FrameElement) {
        element.connectedCallback();
        element.disconnectedCallback();
        return element;
      }
    }
  }
  var StreamElement = class _StreamElement extends HTMLElement {
    static async renderElement(newElement) {
      await newElement.performAction();
    }
    async connectedCallback() {
      try {
        await this.render();
      } catch (error2) {
        console.error(error2);
      } finally {
        this.disconnect();
      }
    }
    async render() {
      var _a;
      return (_a = this.renderPromise) !== null && _a !== void 0 ? _a : this.renderPromise = (async () => {
        const event = this.beforeRenderEvent;
        if (this.dispatchEvent(event)) {
          await nextAnimationFrame();
          await event.detail.render(this);
        }
      })();
    }
    disconnect() {
      try {
        this.remove();
      } catch (_a) {
      }
    }
    removeDuplicateTargetChildren() {
      this.duplicateChildren.forEach((c) => c.remove());
    }
    get duplicateChildren() {
      var _a;
      const existingChildren = this.targetElements.flatMap((e) => [...e.children]).filter((c) => !!c.id);
      const newChildrenIds = [...((_a = this.templateContent) === null || _a === void 0 ? void 0 : _a.children) || []].filter((c) => !!c.id).map((c) => c.id);
      return existingChildren.filter((c) => newChildrenIds.includes(c.id));
    }
    get performAction() {
      if (this.action) {
        const actionFunction = StreamActions[this.action];
        if (actionFunction) {
          return actionFunction;
        }
        this.raise("unknown action");
      }
      this.raise("action attribute is missing");
    }
    get targetElements() {
      if (this.target) {
        return this.targetElementsById;
      } else if (this.targets) {
        return this.targetElementsByQuery;
      } else {
        this.raise("target or targets attribute is missing");
      }
    }
    get templateContent() {
      return this.templateElement.content.cloneNode(true);
    }
    get templateElement() {
      if (this.firstElementChild === null) {
        const template = this.ownerDocument.createElement("template");
        this.appendChild(template);
        return template;
      } else if (this.firstElementChild instanceof HTMLTemplateElement) {
        return this.firstElementChild;
      }
      this.raise("first child element must be a <template> element");
    }
    get action() {
      return this.getAttribute("action");
    }
    get target() {
      return this.getAttribute("target");
    }
    get targets() {
      return this.getAttribute("targets");
    }
    raise(message) {
      throw new Error(`${this.description}: ${message}`);
    }
    get description() {
      var _a, _b;
      return (_b = ((_a = this.outerHTML.match(/<[^>]+>/)) !== null && _a !== void 0 ? _a : [])[0]) !== null && _b !== void 0 ? _b : "<turbo-stream>";
    }
    get beforeRenderEvent() {
      return new CustomEvent("turbo:before-stream-render", {
        bubbles: true,
        cancelable: true,
        detail: { newStream: this, render: _StreamElement.renderElement }
      });
    }
    get targetElementsById() {
      var _a;
      const element = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.getElementById(this.target);
      if (element !== null) {
        return [element];
      } else {
        return [];
      }
    }
    get targetElementsByQuery() {
      var _a;
      const elements = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.querySelectorAll(this.targets);
      if (elements.length !== 0) {
        return Array.prototype.slice.call(elements);
      } else {
        return [];
      }
    }
  };
  var StreamSourceElement = class extends HTMLElement {
    constructor() {
      super(...arguments);
      this.streamSource = null;
    }
    connectedCallback() {
      this.streamSource = this.src.match(/^ws{1,2}:/) ? new WebSocket(this.src) : new EventSource(this.src);
      connectStreamSource(this.streamSource);
    }
    disconnectedCallback() {
      if (this.streamSource) {
        disconnectStreamSource(this.streamSource);
      }
    }
    get src() {
      return this.getAttribute("src") || "";
    }
  };
  FrameElement.delegateConstructor = FrameController;
  if (customElements.get("turbo-frame") === void 0) {
    customElements.define("turbo-frame", FrameElement);
  }
  if (customElements.get("turbo-stream") === void 0) {
    customElements.define("turbo-stream", StreamElement);
  }
  if (customElements.get("turbo-stream-source") === void 0) {
    customElements.define("turbo-stream-source", StreamSourceElement);
  }
  (() => {
    let element = document.currentScript;
    if (!element)
      return;
    if (element.hasAttribute("data-turbo-suppress-warning"))
      return;
    element = element.parentElement;
    while (element) {
      if (element == document.body) {
        return console.warn(unindent`
        You are loading Turbo from a <script> element inside the <body> element. This is probably not what you meant to do!

        Load your application’s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.

        For more information, see: https://turbo.hotwired.dev/handbook/building#working-with-script-elements

        ——
        Suppress this warning by adding a "data-turbo-suppress-warning" attribute to: %s
      `, element.outerHTML);
      }
      element = element.parentElement;
    }
  })();
  window.Turbo = Turbo2;
  start();

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable.js
  var consumer;
  async function getConsumer() {
    return consumer || setConsumer(createConsumer2().then(setConsumer));
  }
  function setConsumer(newConsumer) {
    return consumer = newConsumer;
  }
  async function createConsumer2() {
    const { createConsumer: createConsumer3 } = await Promise.resolve().then(() => (init_src(), src_exports));
    return createConsumer3();
  }
  async function subscribeTo(channel, mixin) {
    const { subscriptions } = await getConsumer();
    return subscriptions.create(channel, mixin);
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/snakeize.js
  function walk(obj) {
    if (!obj || typeof obj !== "object")
      return obj;
    if (obj instanceof Date || obj instanceof RegExp)
      return obj;
    if (Array.isArray(obj))
      return obj.map(walk);
    return Object.keys(obj).reduce(function(acc, key) {
      var camel = key[0].toLowerCase() + key.slice(1).replace(/([A-Z]+)/g, function(m, x) {
        return "_" + x.toLowerCase();
      });
      acc[camel] = walk(obj[key]);
      return acc;
    }, {});
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable_stream_source_element.js
  var TurboCableStreamSourceElement = class extends HTMLElement {
    async connectedCallback() {
      connectStreamSource(this);
      this.subscription = await subscribeTo(this.channel, {
        received: this.dispatchMessageEvent.bind(this),
        connected: this.subscriptionConnected.bind(this),
        disconnected: this.subscriptionDisconnected.bind(this)
      });
    }
    disconnectedCallback() {
      disconnectStreamSource(this);
      if (this.subscription)
        this.subscription.unsubscribe();
    }
    dispatchMessageEvent(data) {
      const event = new MessageEvent("message", { data });
      return this.dispatchEvent(event);
    }
    subscriptionConnected() {
      this.setAttribute("connected", "");
    }
    subscriptionDisconnected() {
      this.removeAttribute("connected");
    }
    get channel() {
      const channel = this.getAttribute("channel");
      const signed_stream_name = this.getAttribute("signed-stream-name");
      return { channel, signed_stream_name, ...walk({ ...this.dataset }) };
    }
  };
  if (customElements.get("turbo-cable-stream-source") === void 0) {
    customElements.define("turbo-cable-stream-source", TurboCableStreamSourceElement);
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/fetch_requests.js
  function encodeMethodIntoRequestBody(event) {
    if (event.target instanceof HTMLFormElement) {
      const { target: form, detail: { fetchOptions } } = event;
      form.addEventListener("turbo:submit-start", ({ detail: { formSubmission: { submitter } } }) => {
        const body = isBodyInit(fetchOptions.body) ? fetchOptions.body : new URLSearchParams();
        const method = determineFetchMethod(submitter, body, form);
        if (!/get/i.test(method)) {
          if (/post/i.test(method)) {
            body.delete("_method");
          } else {
            body.set("_method", method);
          }
          fetchOptions.method = "post";
        }
      }, { once: true });
    }
  }
  function determineFetchMethod(submitter, body, form) {
    const formMethod = determineFormMethod(submitter);
    const overrideMethod = body.get("_method");
    const method = form.getAttribute("method") || "get";
    if (typeof formMethod == "string") {
      return formMethod;
    } else if (typeof overrideMethod == "string") {
      return overrideMethod;
    } else {
      return method;
    }
  }
  function determineFormMethod(submitter) {
    if (submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement) {
      if (submitter.hasAttribute("formmethod")) {
        return submitter.formMethod;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  function isBodyInit(body) {
    return body instanceof FormData || body instanceof URLSearchParams;
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/index.js
  addEventListener("turbo:before-fetch-request", encodeMethodIntoRequestBody);

  // node_modules/@hotwired/stimulus/dist/stimulus.js
  var EventListener = class {
    constructor(eventTarget, eventName, eventOptions) {
      this.eventTarget = eventTarget;
      this.eventName = eventName;
      this.eventOptions = eventOptions;
      this.unorderedBindings = /* @__PURE__ */ new Set();
    }
    connect() {
      this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
    }
    disconnect() {
      this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
    }
    bindingConnected(binding) {
      this.unorderedBindings.add(binding);
    }
    bindingDisconnected(binding) {
      this.unorderedBindings.delete(binding);
    }
    handleEvent(event) {
      const extendedEvent = extendEvent(event);
      for (const binding of this.bindings) {
        if (extendedEvent.immediatePropagationStopped) {
          break;
        } else {
          binding.handleEvent(extendedEvent);
        }
      }
    }
    hasBindings() {
      return this.unorderedBindings.size > 0;
    }
    get bindings() {
      return Array.from(this.unorderedBindings).sort((left2, right2) => {
        const leftIndex = left2.index, rightIndex = right2.index;
        return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
      });
    }
  };
  function extendEvent(event) {
    if ("immediatePropagationStopped" in event) {
      return event;
    } else {
      const { stopImmediatePropagation } = event;
      return Object.assign(event, {
        immediatePropagationStopped: false,
        stopImmediatePropagation() {
          this.immediatePropagationStopped = true;
          stopImmediatePropagation.call(this);
        }
      });
    }
  }
  var Dispatcher = class {
    constructor(application2) {
      this.application = application2;
      this.eventListenerMaps = /* @__PURE__ */ new Map();
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.eventListeners.forEach((eventListener) => eventListener.connect());
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.eventListeners.forEach((eventListener) => eventListener.disconnect());
      }
    }
    get eventListeners() {
      return Array.from(this.eventListenerMaps.values()).reduce((listeners, map) => listeners.concat(Array.from(map.values())), []);
    }
    bindingConnected(binding) {
      this.fetchEventListenerForBinding(binding).bindingConnected(binding);
    }
    bindingDisconnected(binding, clearEventListeners = false) {
      this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
      if (clearEventListeners)
        this.clearEventListenersForBinding(binding);
    }
    handleError(error2, message, detail = {}) {
      this.application.handleError(error2, `Error ${message}`, detail);
    }
    clearEventListenersForBinding(binding) {
      const eventListener = this.fetchEventListenerForBinding(binding);
      if (!eventListener.hasBindings()) {
        eventListener.disconnect();
        this.removeMappedEventListenerFor(binding);
      }
    }
    removeMappedEventListenerFor(binding) {
      const { eventTarget, eventName, eventOptions } = binding;
      const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      const cacheKey = this.cacheKey(eventName, eventOptions);
      eventListenerMap.delete(cacheKey);
      if (eventListenerMap.size == 0)
        this.eventListenerMaps.delete(eventTarget);
    }
    fetchEventListenerForBinding(binding) {
      const { eventTarget, eventName, eventOptions } = binding;
      return this.fetchEventListener(eventTarget, eventName, eventOptions);
    }
    fetchEventListener(eventTarget, eventName, eventOptions) {
      const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      const cacheKey = this.cacheKey(eventName, eventOptions);
      let eventListener = eventListenerMap.get(cacheKey);
      if (!eventListener) {
        eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
        eventListenerMap.set(cacheKey, eventListener);
      }
      return eventListener;
    }
    createEventListener(eventTarget, eventName, eventOptions) {
      const eventListener = new EventListener(eventTarget, eventName, eventOptions);
      if (this.started) {
        eventListener.connect();
      }
      return eventListener;
    }
    fetchEventListenerMapForEventTarget(eventTarget) {
      let eventListenerMap = this.eventListenerMaps.get(eventTarget);
      if (!eventListenerMap) {
        eventListenerMap = /* @__PURE__ */ new Map();
        this.eventListenerMaps.set(eventTarget, eventListenerMap);
      }
      return eventListenerMap;
    }
    cacheKey(eventName, eventOptions) {
      const parts = [eventName];
      Object.keys(eventOptions).sort().forEach((key) => {
        parts.push(`${eventOptions[key] ? "" : "!"}${key}`);
      });
      return parts.join(":");
    }
  };
  var defaultActionDescriptorFilters = {
    stop({ event, value }) {
      if (value)
        event.stopPropagation();
      return true;
    },
    prevent({ event, value }) {
      if (value)
        event.preventDefault();
      return true;
    },
    self({ event, value, element }) {
      if (value) {
        return element === event.target;
      } else {
        return true;
      }
    }
  };
  var descriptorPattern = /^(?:(?:([^.]+?)\+)?(.+?)(?:\.(.+?))?(?:@(window|document))?->)?(.+?)(?:#([^:]+?))(?::(.+))?$/;
  function parseActionDescriptorString(descriptorString) {
    const source = descriptorString.trim();
    const matches = source.match(descriptorPattern) || [];
    let eventName = matches[2];
    let keyFilter = matches[3];
    if (keyFilter && !["keydown", "keyup", "keypress"].includes(eventName)) {
      eventName += `.${keyFilter}`;
      keyFilter = "";
    }
    return {
      eventTarget: parseEventTarget(matches[4]),
      eventName,
      eventOptions: matches[7] ? parseEventOptions(matches[7]) : {},
      identifier: matches[5],
      methodName: matches[6],
      keyFilter: matches[1] || keyFilter
    };
  }
  function parseEventTarget(eventTargetName) {
    if (eventTargetName == "window") {
      return window;
    } else if (eventTargetName == "document") {
      return document;
    }
  }
  function parseEventOptions(eventOptions) {
    return eventOptions.split(":").reduce((options, token) => Object.assign(options, { [token.replace(/^!/, "")]: !/^!/.test(token) }), {});
  }
  function stringifyEventTarget(eventTarget) {
    if (eventTarget == window) {
      return "window";
    } else if (eventTarget == document) {
      return "document";
    }
  }
  function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_, char) => char.toUpperCase());
  }
  function namespaceCamelize(value) {
    return camelize(value.replace(/--/g, "-").replace(/__/g, "_"));
  }
  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  function dasherize(value) {
    return value.replace(/([A-Z])/g, (_, char) => `-${char.toLowerCase()}`);
  }
  function tokenize(value) {
    return value.match(/[^\s]+/g) || [];
  }
  function isSomething(object) {
    return object !== null && object !== void 0;
  }
  function hasProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }
  var allModifiers = ["meta", "ctrl", "alt", "shift"];
  var Action = class {
    constructor(element, index, descriptor, schema) {
      this.element = element;
      this.index = index;
      this.eventTarget = descriptor.eventTarget || element;
      this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name");
      this.eventOptions = descriptor.eventOptions || {};
      this.identifier = descriptor.identifier || error("missing identifier");
      this.methodName = descriptor.methodName || error("missing method name");
      this.keyFilter = descriptor.keyFilter || "";
      this.schema = schema;
    }
    static forToken(token, schema) {
      return new this(token.element, token.index, parseActionDescriptorString(token.content), schema);
    }
    toString() {
      const eventFilter = this.keyFilter ? `.${this.keyFilter}` : "";
      const eventTarget = this.eventTargetName ? `@${this.eventTargetName}` : "";
      return `${this.eventName}${eventFilter}${eventTarget}->${this.identifier}#${this.methodName}`;
    }
    shouldIgnoreKeyboardEvent(event) {
      if (!this.keyFilter) {
        return false;
      }
      const filters = this.keyFilter.split("+");
      if (this.keyFilterDissatisfied(event, filters)) {
        return true;
      }
      const standardFilter = filters.filter((key) => !allModifiers.includes(key))[0];
      if (!standardFilter) {
        return false;
      }
      if (!hasProperty(this.keyMappings, standardFilter)) {
        error(`contains unknown key filter: ${this.keyFilter}`);
      }
      return this.keyMappings[standardFilter].toLowerCase() !== event.key.toLowerCase();
    }
    shouldIgnoreMouseEvent(event) {
      if (!this.keyFilter) {
        return false;
      }
      const filters = [this.keyFilter];
      if (this.keyFilterDissatisfied(event, filters)) {
        return true;
      }
      return false;
    }
    get params() {
      const params = {};
      const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`, "i");
      for (const { name, value } of Array.from(this.element.attributes)) {
        const match = name.match(pattern);
        const key = match && match[1];
        if (key) {
          params[camelize(key)] = typecast(value);
        }
      }
      return params;
    }
    get eventTargetName() {
      return stringifyEventTarget(this.eventTarget);
    }
    get keyMappings() {
      return this.schema.keyMappings;
    }
    keyFilterDissatisfied(event, filters) {
      const [meta, ctrl, alt, shift] = allModifiers.map((modifier) => filters.includes(modifier));
      return event.metaKey !== meta || event.ctrlKey !== ctrl || event.altKey !== alt || event.shiftKey !== shift;
    }
  };
  var defaultEventNames = {
    a: () => "click",
    button: () => "click",
    form: () => "submit",
    details: () => "toggle",
    input: (e) => e.getAttribute("type") == "submit" ? "click" : "input",
    select: () => "change",
    textarea: () => "input"
  };
  function getDefaultEventNameForElement(element) {
    const tagName = element.tagName.toLowerCase();
    if (tagName in defaultEventNames) {
      return defaultEventNames[tagName](element);
    }
  }
  function error(message) {
    throw new Error(message);
  }
  function typecast(value) {
    try {
      return JSON.parse(value);
    } catch (o_O) {
      return value;
    }
  }
  var Binding = class {
    constructor(context, action) {
      this.context = context;
      this.action = action;
    }
    get index() {
      return this.action.index;
    }
    get eventTarget() {
      return this.action.eventTarget;
    }
    get eventOptions() {
      return this.action.eventOptions;
    }
    get identifier() {
      return this.context.identifier;
    }
    handleEvent(event) {
      const actionEvent = this.prepareActionEvent(event);
      if (this.willBeInvokedByEvent(event) && this.applyEventModifiers(actionEvent)) {
        this.invokeWithEvent(actionEvent);
      }
    }
    get eventName() {
      return this.action.eventName;
    }
    get method() {
      const method = this.controller[this.methodName];
      if (typeof method == "function") {
        return method;
      }
      throw new Error(`Action "${this.action}" references undefined method "${this.methodName}"`);
    }
    applyEventModifiers(event) {
      const { element } = this.action;
      const { actionDescriptorFilters } = this.context.application;
      const { controller } = this.context;
      let passes = true;
      for (const [name, value] of Object.entries(this.eventOptions)) {
        if (name in actionDescriptorFilters) {
          const filter = actionDescriptorFilters[name];
          passes = passes && filter({ name, value, event, element, controller });
        } else {
          continue;
        }
      }
      return passes;
    }
    prepareActionEvent(event) {
      return Object.assign(event, { params: this.action.params });
    }
    invokeWithEvent(event) {
      const { target, currentTarget } = event;
      try {
        this.method.call(this.controller, event);
        this.context.logDebugActivity(this.methodName, { event, target, currentTarget, action: this.methodName });
      } catch (error2) {
        const { identifier, controller, element, index } = this;
        const detail = { identifier, controller, element, index, event };
        this.context.handleError(error2, `invoking action "${this.action}"`, detail);
      }
    }
    willBeInvokedByEvent(event) {
      const eventTarget = event.target;
      if (event instanceof KeyboardEvent && this.action.shouldIgnoreKeyboardEvent(event)) {
        return false;
      }
      if (event instanceof MouseEvent && this.action.shouldIgnoreMouseEvent(event)) {
        return false;
      }
      if (this.element === eventTarget) {
        return true;
      } else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
        return this.scope.containsElement(eventTarget);
      } else {
        return this.scope.containsElement(this.action.element);
      }
    }
    get controller() {
      return this.context.controller;
    }
    get methodName() {
      return this.action.methodName;
    }
    get element() {
      return this.scope.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  var ElementObserver = class {
    constructor(element, delegate) {
      this.mutationObserverInit = { attributes: true, childList: true, subtree: true };
      this.element = element;
      this.started = false;
      this.delegate = delegate;
      this.elements = /* @__PURE__ */ new Set();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.refresh();
      }
    }
    pause(callback) {
      if (this.started) {
        this.mutationObserver.disconnect();
        this.started = false;
      }
      callback();
      if (!this.started) {
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        const matches = new Set(this.matchElementsInTree());
        for (const element of Array.from(this.elements)) {
          if (!matches.has(element)) {
            this.removeElement(element);
          }
        }
        for (const element of Array.from(matches)) {
          this.addElement(element);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      if (mutation.type == "attributes") {
        this.processAttributeChange(mutation.target, mutation.attributeName);
      } else if (mutation.type == "childList") {
        this.processRemovedNodes(mutation.removedNodes);
        this.processAddedNodes(mutation.addedNodes);
      }
    }
    processAttributeChange(element, attributeName) {
      if (this.elements.has(element)) {
        if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
          this.delegate.elementAttributeChanged(element, attributeName);
        } else {
          this.removeElement(element);
        }
      } else if (this.matchElement(element)) {
        this.addElement(element);
      }
    }
    processRemovedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element) {
          this.processTree(element, this.removeElement);
        }
      }
    }
    processAddedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element && this.elementIsActive(element)) {
          this.processTree(element, this.addElement);
        }
      }
    }
    matchElement(element) {
      return this.delegate.matchElement(element);
    }
    matchElementsInTree(tree = this.element) {
      return this.delegate.matchElementsInTree(tree);
    }
    processTree(tree, processor) {
      for (const element of this.matchElementsInTree(tree)) {
        processor.call(this, element);
      }
    }
    elementFromNode(node) {
      if (node.nodeType == Node.ELEMENT_NODE) {
        return node;
      }
    }
    elementIsActive(element) {
      if (element.isConnected != this.element.isConnected) {
        return false;
      } else {
        return this.element.contains(element);
      }
    }
    addElement(element) {
      if (!this.elements.has(element)) {
        if (this.elementIsActive(element)) {
          this.elements.add(element);
          if (this.delegate.elementMatched) {
            this.delegate.elementMatched(element);
          }
        }
      }
    }
    removeElement(element) {
      if (this.elements.has(element)) {
        this.elements.delete(element);
        if (this.delegate.elementUnmatched) {
          this.delegate.elementUnmatched(element);
        }
      }
    }
  };
  var AttributeObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeName = attributeName;
      this.delegate = delegate;
      this.elementObserver = new ElementObserver(element, this);
    }
    get element() {
      return this.elementObserver.element;
    }
    get selector() {
      return `[${this.attributeName}]`;
    }
    start() {
      this.elementObserver.start();
    }
    pause(callback) {
      this.elementObserver.pause(callback);
    }
    stop() {
      this.elementObserver.stop();
    }
    refresh() {
      this.elementObserver.refresh();
    }
    get started() {
      return this.elementObserver.started;
    }
    matchElement(element) {
      return element.hasAttribute(this.attributeName);
    }
    matchElementsInTree(tree) {
      const match = this.matchElement(tree) ? [tree] : [];
      const matches = Array.from(tree.querySelectorAll(this.selector));
      return match.concat(matches);
    }
    elementMatched(element) {
      if (this.delegate.elementMatchedAttribute) {
        this.delegate.elementMatchedAttribute(element, this.attributeName);
      }
    }
    elementUnmatched(element) {
      if (this.delegate.elementUnmatchedAttribute) {
        this.delegate.elementUnmatchedAttribute(element, this.attributeName);
      }
    }
    elementAttributeChanged(element, attributeName) {
      if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
        this.delegate.elementAttributeValueChanged(element, attributeName);
      }
    }
  };
  function add(map, key, value) {
    fetch2(map, key).add(value);
  }
  function del(map, key, value) {
    fetch2(map, key).delete(value);
    prune(map, key);
  }
  function fetch2(map, key) {
    let values = map.get(key);
    if (!values) {
      values = /* @__PURE__ */ new Set();
      map.set(key, values);
    }
    return values;
  }
  function prune(map, key) {
    const values = map.get(key);
    if (values != null && values.size == 0) {
      map.delete(key);
    }
  }
  var Multimap = class {
    constructor() {
      this.valuesByKey = /* @__PURE__ */ new Map();
    }
    get keys() {
      return Array.from(this.valuesByKey.keys());
    }
    get values() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((values, set) => values.concat(Array.from(set)), []);
    }
    get size() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((size, set) => size + set.size, 0);
    }
    add(key, value) {
      add(this.valuesByKey, key, value);
    }
    delete(key, value) {
      del(this.valuesByKey, key, value);
    }
    has(key, value) {
      const values = this.valuesByKey.get(key);
      return values != null && values.has(value);
    }
    hasKey(key) {
      return this.valuesByKey.has(key);
    }
    hasValue(value) {
      const sets = Array.from(this.valuesByKey.values());
      return sets.some((set) => set.has(value));
    }
    getValuesForKey(key) {
      const values = this.valuesByKey.get(key);
      return values ? Array.from(values) : [];
    }
    getKeysForValue(value) {
      return Array.from(this.valuesByKey).filter(([_key, values]) => values.has(value)).map(([key, _values]) => key);
    }
  };
  var SelectorObserver = class {
    constructor(element, selector, delegate, details) {
      this._selector = selector;
      this.details = details;
      this.elementObserver = new ElementObserver(element, this);
      this.delegate = delegate;
      this.matchesByElement = new Multimap();
    }
    get started() {
      return this.elementObserver.started;
    }
    get selector() {
      return this._selector;
    }
    set selector(selector) {
      this._selector = selector;
      this.refresh();
    }
    start() {
      this.elementObserver.start();
    }
    pause(callback) {
      this.elementObserver.pause(callback);
    }
    stop() {
      this.elementObserver.stop();
    }
    refresh() {
      this.elementObserver.refresh();
    }
    get element() {
      return this.elementObserver.element;
    }
    matchElement(element) {
      const { selector } = this;
      if (selector) {
        const matches = element.matches(selector);
        if (this.delegate.selectorMatchElement) {
          return matches && this.delegate.selectorMatchElement(element, this.details);
        }
        return matches;
      } else {
        return false;
      }
    }
    matchElementsInTree(tree) {
      const { selector } = this;
      if (selector) {
        const match = this.matchElement(tree) ? [tree] : [];
        const matches = Array.from(tree.querySelectorAll(selector)).filter((match2) => this.matchElement(match2));
        return match.concat(matches);
      } else {
        return [];
      }
    }
    elementMatched(element) {
      const { selector } = this;
      if (selector) {
        this.selectorMatched(element, selector);
      }
    }
    elementUnmatched(element) {
      const selectors = this.matchesByElement.getKeysForValue(element);
      for (const selector of selectors) {
        this.selectorUnmatched(element, selector);
      }
    }
    elementAttributeChanged(element, _attributeName) {
      const { selector } = this;
      if (selector) {
        const matches = this.matchElement(element);
        const matchedBefore = this.matchesByElement.has(selector, element);
        if (matches && !matchedBefore) {
          this.selectorMatched(element, selector);
        } else if (!matches && matchedBefore) {
          this.selectorUnmatched(element, selector);
        }
      }
    }
    selectorMatched(element, selector) {
      this.delegate.selectorMatched(element, selector, this.details);
      this.matchesByElement.add(selector, element);
    }
    selectorUnmatched(element, selector) {
      this.delegate.selectorUnmatched(element, selector, this.details);
      this.matchesByElement.delete(selector, element);
    }
  };
  var StringMapObserver = class {
    constructor(element, delegate) {
      this.element = element;
      this.delegate = delegate;
      this.started = false;
      this.stringMap = /* @__PURE__ */ new Map();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, { attributes: true, attributeOldValue: true });
        this.refresh();
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        for (const attributeName of this.knownAttributeNames) {
          this.refreshAttribute(attributeName, null);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      const attributeName = mutation.attributeName;
      if (attributeName) {
        this.refreshAttribute(attributeName, mutation.oldValue);
      }
    }
    refreshAttribute(attributeName, oldValue) {
      const key = this.delegate.getStringMapKeyForAttribute(attributeName);
      if (key != null) {
        if (!this.stringMap.has(attributeName)) {
          this.stringMapKeyAdded(key, attributeName);
        }
        const value = this.element.getAttribute(attributeName);
        if (this.stringMap.get(attributeName) != value) {
          this.stringMapValueChanged(value, key, oldValue);
        }
        if (value == null) {
          const oldValue2 = this.stringMap.get(attributeName);
          this.stringMap.delete(attributeName);
          if (oldValue2)
            this.stringMapKeyRemoved(key, attributeName, oldValue2);
        } else {
          this.stringMap.set(attributeName, value);
        }
      }
    }
    stringMapKeyAdded(key, attributeName) {
      if (this.delegate.stringMapKeyAdded) {
        this.delegate.stringMapKeyAdded(key, attributeName);
      }
    }
    stringMapValueChanged(value, key, oldValue) {
      if (this.delegate.stringMapValueChanged) {
        this.delegate.stringMapValueChanged(value, key, oldValue);
      }
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      if (this.delegate.stringMapKeyRemoved) {
        this.delegate.stringMapKeyRemoved(key, attributeName, oldValue);
      }
    }
    get knownAttributeNames() {
      return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)));
    }
    get currentAttributeNames() {
      return Array.from(this.element.attributes).map((attribute) => attribute.name);
    }
    get recordedAttributeNames() {
      return Array.from(this.stringMap.keys());
    }
  };
  var TokenListObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeObserver = new AttributeObserver(element, attributeName, this);
      this.delegate = delegate;
      this.tokensByElement = new Multimap();
    }
    get started() {
      return this.attributeObserver.started;
    }
    start() {
      this.attributeObserver.start();
    }
    pause(callback) {
      this.attributeObserver.pause(callback);
    }
    stop() {
      this.attributeObserver.stop();
    }
    refresh() {
      this.attributeObserver.refresh();
    }
    get element() {
      return this.attributeObserver.element;
    }
    get attributeName() {
      return this.attributeObserver.attributeName;
    }
    elementMatchedAttribute(element) {
      this.tokensMatched(this.readTokensForElement(element));
    }
    elementAttributeValueChanged(element) {
      const [unmatchedTokens, matchedTokens] = this.refreshTokensForElement(element);
      this.tokensUnmatched(unmatchedTokens);
      this.tokensMatched(matchedTokens);
    }
    elementUnmatchedAttribute(element) {
      this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
    }
    tokensMatched(tokens) {
      tokens.forEach((token) => this.tokenMatched(token));
    }
    tokensUnmatched(tokens) {
      tokens.forEach((token) => this.tokenUnmatched(token));
    }
    tokenMatched(token) {
      this.delegate.tokenMatched(token);
      this.tokensByElement.add(token.element, token);
    }
    tokenUnmatched(token) {
      this.delegate.tokenUnmatched(token);
      this.tokensByElement.delete(token.element, token);
    }
    refreshTokensForElement(element) {
      const previousTokens = this.tokensByElement.getValuesForKey(element);
      const currentTokens = this.readTokensForElement(element);
      const firstDifferingIndex = zip(previousTokens, currentTokens).findIndex(([previousToken, currentToken]) => !tokensAreEqual(previousToken, currentToken));
      if (firstDifferingIndex == -1) {
        return [[], []];
      } else {
        return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
      }
    }
    readTokensForElement(element) {
      const attributeName = this.attributeName;
      const tokenString = element.getAttribute(attributeName) || "";
      return parseTokenString(tokenString, element, attributeName);
    }
  };
  function parseTokenString(tokenString, element, attributeName) {
    return tokenString.trim().split(/\s+/).filter((content) => content.length).map((content, index) => ({ element, attributeName, content, index }));
  }
  function zip(left2, right2) {
    const length = Math.max(left2.length, right2.length);
    return Array.from({ length }, (_, index) => [left2[index], right2[index]]);
  }
  function tokensAreEqual(left2, right2) {
    return left2 && right2 && left2.index == right2.index && left2.content == right2.content;
  }
  var ValueListObserver = class {
    constructor(element, attributeName, delegate) {
      this.tokenListObserver = new TokenListObserver(element, attributeName, this);
      this.delegate = delegate;
      this.parseResultsByToken = /* @__PURE__ */ new WeakMap();
      this.valuesByTokenByElement = /* @__PURE__ */ new WeakMap();
    }
    get started() {
      return this.tokenListObserver.started;
    }
    start() {
      this.tokenListObserver.start();
    }
    stop() {
      this.tokenListObserver.stop();
    }
    refresh() {
      this.tokenListObserver.refresh();
    }
    get element() {
      return this.tokenListObserver.element;
    }
    get attributeName() {
      return this.tokenListObserver.attributeName;
    }
    tokenMatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).set(token, value);
        this.delegate.elementMatchedValue(element, value);
      }
    }
    tokenUnmatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).delete(token);
        this.delegate.elementUnmatchedValue(element, value);
      }
    }
    fetchParseResultForToken(token) {
      let parseResult = this.parseResultsByToken.get(token);
      if (!parseResult) {
        parseResult = this.parseToken(token);
        this.parseResultsByToken.set(token, parseResult);
      }
      return parseResult;
    }
    fetchValuesByTokenForElement(element) {
      let valuesByToken = this.valuesByTokenByElement.get(element);
      if (!valuesByToken) {
        valuesByToken = /* @__PURE__ */ new Map();
        this.valuesByTokenByElement.set(element, valuesByToken);
      }
      return valuesByToken;
    }
    parseToken(token) {
      try {
        const value = this.delegate.parseValueForToken(token);
        return { value };
      } catch (error2) {
        return { error: error2 };
      }
    }
  };
  var BindingObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.bindingsByAction = /* @__PURE__ */ new Map();
    }
    start() {
      if (!this.valueListObserver) {
        this.valueListObserver = new ValueListObserver(this.element, this.actionAttribute, this);
        this.valueListObserver.start();
      }
    }
    stop() {
      if (this.valueListObserver) {
        this.valueListObserver.stop();
        delete this.valueListObserver;
        this.disconnectAllActions();
      }
    }
    get element() {
      return this.context.element;
    }
    get identifier() {
      return this.context.identifier;
    }
    get actionAttribute() {
      return this.schema.actionAttribute;
    }
    get schema() {
      return this.context.schema;
    }
    get bindings() {
      return Array.from(this.bindingsByAction.values());
    }
    connectAction(action) {
      const binding = new Binding(this.context, action);
      this.bindingsByAction.set(action, binding);
      this.delegate.bindingConnected(binding);
    }
    disconnectAction(action) {
      const binding = this.bindingsByAction.get(action);
      if (binding) {
        this.bindingsByAction.delete(action);
        this.delegate.bindingDisconnected(binding);
      }
    }
    disconnectAllActions() {
      this.bindings.forEach((binding) => this.delegate.bindingDisconnected(binding, true));
      this.bindingsByAction.clear();
    }
    parseValueForToken(token) {
      const action = Action.forToken(token, this.schema);
      if (action.identifier == this.identifier) {
        return action;
      }
    }
    elementMatchedValue(element, action) {
      this.connectAction(action);
    }
    elementUnmatchedValue(element, action) {
      this.disconnectAction(action);
    }
  };
  var ValueObserver = class {
    constructor(context, receiver) {
      this.context = context;
      this.receiver = receiver;
      this.stringMapObserver = new StringMapObserver(this.element, this);
      this.valueDescriptorMap = this.controller.valueDescriptorMap;
    }
    start() {
      this.stringMapObserver.start();
      this.invokeChangedCallbacksForDefaultValues();
    }
    stop() {
      this.stringMapObserver.stop();
    }
    get element() {
      return this.context.element;
    }
    get controller() {
      return this.context.controller;
    }
    getStringMapKeyForAttribute(attributeName) {
      if (attributeName in this.valueDescriptorMap) {
        return this.valueDescriptorMap[attributeName].name;
      }
    }
    stringMapKeyAdded(key, attributeName) {
      const descriptor = this.valueDescriptorMap[attributeName];
      if (!this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), descriptor.writer(descriptor.defaultValue));
      }
    }
    stringMapValueChanged(value, name, oldValue) {
      const descriptor = this.valueDescriptorNameMap[name];
      if (value === null)
        return;
      if (oldValue === null) {
        oldValue = descriptor.writer(descriptor.defaultValue);
      }
      this.invokeChangedCallback(name, value, oldValue);
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      const descriptor = this.valueDescriptorNameMap[key];
      if (this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), oldValue);
      } else {
        this.invokeChangedCallback(key, descriptor.writer(descriptor.defaultValue), oldValue);
      }
    }
    invokeChangedCallbacksForDefaultValues() {
      for (const { key, name, defaultValue, writer } of this.valueDescriptors) {
        if (defaultValue != void 0 && !this.controller.data.has(key)) {
          this.invokeChangedCallback(name, writer(defaultValue), void 0);
        }
      }
    }
    invokeChangedCallback(name, rawValue, rawOldValue) {
      const changedMethodName = `${name}Changed`;
      const changedMethod = this.receiver[changedMethodName];
      if (typeof changedMethod == "function") {
        const descriptor = this.valueDescriptorNameMap[name];
        try {
          const value = descriptor.reader(rawValue);
          let oldValue = rawOldValue;
          if (rawOldValue) {
            oldValue = descriptor.reader(rawOldValue);
          }
          changedMethod.call(this.receiver, value, oldValue);
        } catch (error2) {
          if (error2 instanceof TypeError) {
            error2.message = `Stimulus Value "${this.context.identifier}.${descriptor.name}" - ${error2.message}`;
          }
          throw error2;
        }
      }
    }
    get valueDescriptors() {
      const { valueDescriptorMap } = this;
      return Object.keys(valueDescriptorMap).map((key) => valueDescriptorMap[key]);
    }
    get valueDescriptorNameMap() {
      const descriptors = {};
      Object.keys(this.valueDescriptorMap).forEach((key) => {
        const descriptor = this.valueDescriptorMap[key];
        descriptors[descriptor.name] = descriptor;
      });
      return descriptors;
    }
    hasValue(attributeName) {
      const descriptor = this.valueDescriptorNameMap[attributeName];
      const hasMethodName = `has${capitalize(descriptor.name)}`;
      return this.receiver[hasMethodName];
    }
  };
  var TargetObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.targetsByName = new Multimap();
    }
    start() {
      if (!this.tokenListObserver) {
        this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this);
        this.tokenListObserver.start();
      }
    }
    stop() {
      if (this.tokenListObserver) {
        this.disconnectAllTargets();
        this.tokenListObserver.stop();
        delete this.tokenListObserver;
      }
    }
    tokenMatched({ element, content: name }) {
      if (this.scope.containsElement(element)) {
        this.connectTarget(element, name);
      }
    }
    tokenUnmatched({ element, content: name }) {
      this.disconnectTarget(element, name);
    }
    connectTarget(element, name) {
      var _a;
      if (!this.targetsByName.has(name, element)) {
        this.targetsByName.add(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetConnected(element, name));
      }
    }
    disconnectTarget(element, name) {
      var _a;
      if (this.targetsByName.has(name, element)) {
        this.targetsByName.delete(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetDisconnected(element, name));
      }
    }
    disconnectAllTargets() {
      for (const name of this.targetsByName.keys) {
        for (const element of this.targetsByName.getValuesForKey(name)) {
          this.disconnectTarget(element, name);
        }
      }
    }
    get attributeName() {
      return `data-${this.context.identifier}-target`;
    }
    get element() {
      return this.context.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  function readInheritableStaticArrayValues(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce((values, constructor2) => {
      getOwnStaticArrayValues(constructor2, propertyName).forEach((name) => values.add(name));
      return values;
    }, /* @__PURE__ */ new Set()));
  }
  function readInheritableStaticObjectPairs(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return ancestors.reduce((pairs, constructor2) => {
      pairs.push(...getOwnStaticObjectPairs(constructor2, propertyName));
      return pairs;
    }, []);
  }
  function getAncestorsForConstructor(constructor) {
    const ancestors = [];
    while (constructor) {
      ancestors.push(constructor);
      constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
  }
  function getOwnStaticArrayValues(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
  }
  function getOwnStaticObjectPairs(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
  }
  var OutletObserver = class {
    constructor(context, delegate) {
      this.started = false;
      this.context = context;
      this.delegate = delegate;
      this.outletsByName = new Multimap();
      this.outletElementsByName = new Multimap();
      this.selectorObserverMap = /* @__PURE__ */ new Map();
      this.attributeObserverMap = /* @__PURE__ */ new Map();
    }
    start() {
      if (!this.started) {
        this.outletDefinitions.forEach((outletName) => {
          this.setupSelectorObserverForOutlet(outletName);
          this.setupAttributeObserverForOutlet(outletName);
        });
        this.started = true;
        this.dependentContexts.forEach((context) => context.refresh());
      }
    }
    refresh() {
      this.selectorObserverMap.forEach((observer) => observer.refresh());
      this.attributeObserverMap.forEach((observer) => observer.refresh());
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.disconnectAllOutlets();
        this.stopSelectorObservers();
        this.stopAttributeObservers();
      }
    }
    stopSelectorObservers() {
      if (this.selectorObserverMap.size > 0) {
        this.selectorObserverMap.forEach((observer) => observer.stop());
        this.selectorObserverMap.clear();
      }
    }
    stopAttributeObservers() {
      if (this.attributeObserverMap.size > 0) {
        this.attributeObserverMap.forEach((observer) => observer.stop());
        this.attributeObserverMap.clear();
      }
    }
    selectorMatched(element, _selector, { outletName }) {
      const outlet = this.getOutlet(element, outletName);
      if (outlet) {
        this.connectOutlet(outlet, element, outletName);
      }
    }
    selectorUnmatched(element, _selector, { outletName }) {
      const outlet = this.getOutletFromMap(element, outletName);
      if (outlet) {
        this.disconnectOutlet(outlet, element, outletName);
      }
    }
    selectorMatchElement(element, { outletName }) {
      const selector = this.selector(outletName);
      const hasOutlet = this.hasOutlet(element, outletName);
      const hasOutletController = element.matches(`[${this.schema.controllerAttribute}~=${outletName}]`);
      if (selector) {
        return hasOutlet && hasOutletController && element.matches(selector);
      } else {
        return false;
      }
    }
    elementMatchedAttribute(_element, attributeName) {
      const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
      if (outletName) {
        this.updateSelectorObserverForOutlet(outletName);
      }
    }
    elementAttributeValueChanged(_element, attributeName) {
      const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
      if (outletName) {
        this.updateSelectorObserverForOutlet(outletName);
      }
    }
    elementUnmatchedAttribute(_element, attributeName) {
      const outletName = this.getOutletNameFromOutletAttributeName(attributeName);
      if (outletName) {
        this.updateSelectorObserverForOutlet(outletName);
      }
    }
    connectOutlet(outlet, element, outletName) {
      var _a;
      if (!this.outletElementsByName.has(outletName, element)) {
        this.outletsByName.add(outletName, outlet);
        this.outletElementsByName.add(outletName, element);
        (_a = this.selectorObserverMap.get(outletName)) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.outletConnected(outlet, element, outletName));
      }
    }
    disconnectOutlet(outlet, element, outletName) {
      var _a;
      if (this.outletElementsByName.has(outletName, element)) {
        this.outletsByName.delete(outletName, outlet);
        this.outletElementsByName.delete(outletName, element);
        (_a = this.selectorObserverMap.get(outletName)) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.outletDisconnected(outlet, element, outletName));
      }
    }
    disconnectAllOutlets() {
      for (const outletName of this.outletElementsByName.keys) {
        for (const element of this.outletElementsByName.getValuesForKey(outletName)) {
          for (const outlet of this.outletsByName.getValuesForKey(outletName)) {
            this.disconnectOutlet(outlet, element, outletName);
          }
        }
      }
    }
    updateSelectorObserverForOutlet(outletName) {
      const observer = this.selectorObserverMap.get(outletName);
      if (observer) {
        observer.selector = this.selector(outletName);
      }
    }
    setupSelectorObserverForOutlet(outletName) {
      const selector = this.selector(outletName);
      const selectorObserver = new SelectorObserver(document.body, selector, this, { outletName });
      this.selectorObserverMap.set(outletName, selectorObserver);
      selectorObserver.start();
    }
    setupAttributeObserverForOutlet(outletName) {
      const attributeName = this.attributeNameForOutletName(outletName);
      const attributeObserver = new AttributeObserver(this.scope.element, attributeName, this);
      this.attributeObserverMap.set(outletName, attributeObserver);
      attributeObserver.start();
    }
    selector(outletName) {
      return this.scope.outlets.getSelectorForOutletName(outletName);
    }
    attributeNameForOutletName(outletName) {
      return this.scope.schema.outletAttributeForScope(this.identifier, outletName);
    }
    getOutletNameFromOutletAttributeName(attributeName) {
      return this.outletDefinitions.find((outletName) => this.attributeNameForOutletName(outletName) === attributeName);
    }
    get outletDependencies() {
      const dependencies = new Multimap();
      this.router.modules.forEach((module) => {
        const constructor = module.definition.controllerConstructor;
        const outlets = readInheritableStaticArrayValues(constructor, "outlets");
        outlets.forEach((outlet) => dependencies.add(outlet, module.identifier));
      });
      return dependencies;
    }
    get outletDefinitions() {
      return this.outletDependencies.getKeysForValue(this.identifier);
    }
    get dependentControllerIdentifiers() {
      return this.outletDependencies.getValuesForKey(this.identifier);
    }
    get dependentContexts() {
      const identifiers = this.dependentControllerIdentifiers;
      return this.router.contexts.filter((context) => identifiers.includes(context.identifier));
    }
    hasOutlet(element, outletName) {
      return !!this.getOutlet(element, outletName) || !!this.getOutletFromMap(element, outletName);
    }
    getOutlet(element, outletName) {
      return this.application.getControllerForElementAndIdentifier(element, outletName);
    }
    getOutletFromMap(element, outletName) {
      return this.outletsByName.getValuesForKey(outletName).find((outlet) => outlet.element === element);
    }
    get scope() {
      return this.context.scope;
    }
    get schema() {
      return this.context.schema;
    }
    get identifier() {
      return this.context.identifier;
    }
    get application() {
      return this.context.application;
    }
    get router() {
      return this.application.router;
    }
  };
  var Context = class {
    constructor(module, scope) {
      this.logDebugActivity = (functionName, detail = {}) => {
        const { identifier, controller, element } = this;
        detail = Object.assign({ identifier, controller, element }, detail);
        this.application.logDebugActivity(this.identifier, functionName, detail);
      };
      this.module = module;
      this.scope = scope;
      this.controller = new module.controllerConstructor(this);
      this.bindingObserver = new BindingObserver(this, this.dispatcher);
      this.valueObserver = new ValueObserver(this, this.controller);
      this.targetObserver = new TargetObserver(this, this);
      this.outletObserver = new OutletObserver(this, this);
      try {
        this.controller.initialize();
        this.logDebugActivity("initialize");
      } catch (error2) {
        this.handleError(error2, "initializing controller");
      }
    }
    connect() {
      this.bindingObserver.start();
      this.valueObserver.start();
      this.targetObserver.start();
      this.outletObserver.start();
      try {
        this.controller.connect();
        this.logDebugActivity("connect");
      } catch (error2) {
        this.handleError(error2, "connecting controller");
      }
    }
    refresh() {
      this.outletObserver.refresh();
    }
    disconnect() {
      try {
        this.controller.disconnect();
        this.logDebugActivity("disconnect");
      } catch (error2) {
        this.handleError(error2, "disconnecting controller");
      }
      this.outletObserver.stop();
      this.targetObserver.stop();
      this.valueObserver.stop();
      this.bindingObserver.stop();
    }
    get application() {
      return this.module.application;
    }
    get identifier() {
      return this.module.identifier;
    }
    get schema() {
      return this.application.schema;
    }
    get dispatcher() {
      return this.application.dispatcher;
    }
    get element() {
      return this.scope.element;
    }
    get parentElement() {
      return this.element.parentElement;
    }
    handleError(error2, message, detail = {}) {
      const { identifier, controller, element } = this;
      detail = Object.assign({ identifier, controller, element }, detail);
      this.application.handleError(error2, `Error ${message}`, detail);
    }
    targetConnected(element, name) {
      this.invokeControllerMethod(`${name}TargetConnected`, element);
    }
    targetDisconnected(element, name) {
      this.invokeControllerMethod(`${name}TargetDisconnected`, element);
    }
    outletConnected(outlet, element, name) {
      this.invokeControllerMethod(`${namespaceCamelize(name)}OutletConnected`, outlet, element);
    }
    outletDisconnected(outlet, element, name) {
      this.invokeControllerMethod(`${namespaceCamelize(name)}OutletDisconnected`, outlet, element);
    }
    invokeControllerMethod(methodName, ...args) {
      const controller = this.controller;
      if (typeof controller[methodName] == "function") {
        controller[methodName](...args);
      }
    }
  };
  function bless(constructor) {
    return shadow(constructor, getBlessedProperties(constructor));
  }
  function shadow(constructor, properties) {
    const shadowConstructor = extend2(constructor);
    const shadowProperties = getShadowProperties(constructor.prototype, properties);
    Object.defineProperties(shadowConstructor.prototype, shadowProperties);
    return shadowConstructor;
  }
  function getBlessedProperties(constructor) {
    const blessings = readInheritableStaticArrayValues(constructor, "blessings");
    return blessings.reduce((blessedProperties, blessing) => {
      const properties = blessing(constructor);
      for (const key in properties) {
        const descriptor = blessedProperties[key] || {};
        blessedProperties[key] = Object.assign(descriptor, properties[key]);
      }
      return blessedProperties;
    }, {});
  }
  function getShadowProperties(prototype, properties) {
    return getOwnKeys(properties).reduce((shadowProperties, key) => {
      const descriptor = getShadowedDescriptor(prototype, properties, key);
      if (descriptor) {
        Object.assign(shadowProperties, { [key]: descriptor });
      }
      return shadowProperties;
    }, {});
  }
  function getShadowedDescriptor(prototype, properties, key) {
    const shadowingDescriptor = Object.getOwnPropertyDescriptor(prototype, key);
    const shadowedByValue = shadowingDescriptor && "value" in shadowingDescriptor;
    if (!shadowedByValue) {
      const descriptor = Object.getOwnPropertyDescriptor(properties, key).value;
      if (shadowingDescriptor) {
        descriptor.get = shadowingDescriptor.get || descriptor.get;
        descriptor.set = shadowingDescriptor.set || descriptor.set;
      }
      return descriptor;
    }
  }
  var getOwnKeys = (() => {
    if (typeof Object.getOwnPropertySymbols == "function") {
      return (object) => [...Object.getOwnPropertyNames(object), ...Object.getOwnPropertySymbols(object)];
    } else {
      return Object.getOwnPropertyNames;
    }
  })();
  var extend2 = (() => {
    function extendWithReflect(constructor) {
      function extended() {
        return Reflect.construct(constructor, arguments, new.target);
      }
      extended.prototype = Object.create(constructor.prototype, {
        constructor: { value: extended }
      });
      Reflect.setPrototypeOf(extended, constructor);
      return extended;
    }
    function testReflectExtension() {
      const a = function() {
        this.a.call(this);
      };
      const b = extendWithReflect(a);
      b.prototype.a = function() {
      };
      return new b();
    }
    try {
      testReflectExtension();
      return extendWithReflect;
    } catch (error2) {
      return (constructor) => class extended extends constructor {
      };
    }
  })();
  function blessDefinition(definition) {
    return {
      identifier: definition.identifier,
      controllerConstructor: bless(definition.controllerConstructor)
    };
  }
  var Module = class {
    constructor(application2, definition) {
      this.application = application2;
      this.definition = blessDefinition(definition);
      this.contextsByScope = /* @__PURE__ */ new WeakMap();
      this.connectedContexts = /* @__PURE__ */ new Set();
    }
    get identifier() {
      return this.definition.identifier;
    }
    get controllerConstructor() {
      return this.definition.controllerConstructor;
    }
    get contexts() {
      return Array.from(this.connectedContexts);
    }
    connectContextForScope(scope) {
      const context = this.fetchContextForScope(scope);
      this.connectedContexts.add(context);
      context.connect();
    }
    disconnectContextForScope(scope) {
      const context = this.contextsByScope.get(scope);
      if (context) {
        this.connectedContexts.delete(context);
        context.disconnect();
      }
    }
    fetchContextForScope(scope) {
      let context = this.contextsByScope.get(scope);
      if (!context) {
        context = new Context(this, scope);
        this.contextsByScope.set(scope, context);
      }
      return context;
    }
  };
  var ClassMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    has(name) {
      return this.data.has(this.getDataKey(name));
    }
    get(name) {
      return this.getAll(name)[0];
    }
    getAll(name) {
      const tokenString = this.data.get(this.getDataKey(name)) || "";
      return tokenize(tokenString);
    }
    getAttributeName(name) {
      return this.data.getAttributeNameForKey(this.getDataKey(name));
    }
    getDataKey(name) {
      return `${name}-class`;
    }
    get data() {
      return this.scope.data;
    }
  };
  var DataMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.getAttribute(name);
    }
    set(key, value) {
      const name = this.getAttributeNameForKey(key);
      this.element.setAttribute(name, value);
      return this.get(key);
    }
    has(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.hasAttribute(name);
    }
    delete(key) {
      if (this.has(key)) {
        const name = this.getAttributeNameForKey(key);
        this.element.removeAttribute(name);
        return true;
      } else {
        return false;
      }
    }
    getAttributeNameForKey(key) {
      return `data-${this.identifier}-${dasherize(key)}`;
    }
  };
  var Guide = class {
    constructor(logger) {
      this.warnedKeysByObject = /* @__PURE__ */ new WeakMap();
      this.logger = logger;
    }
    warn(object, key, message) {
      let warnedKeys = this.warnedKeysByObject.get(object);
      if (!warnedKeys) {
        warnedKeys = /* @__PURE__ */ new Set();
        this.warnedKeysByObject.set(object, warnedKeys);
      }
      if (!warnedKeys.has(key)) {
        warnedKeys.add(key);
        this.logger.warn(message, object);
      }
    }
  };
  function attributeValueContainsToken(attributeName, token) {
    return `[${attributeName}~="${token}"]`;
  }
  var TargetSet = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get schema() {
      return this.scope.schema;
    }
    has(targetName) {
      return this.find(targetName) != null;
    }
    find(...targetNames) {
      return targetNames.reduce((target, targetName) => target || this.findTarget(targetName) || this.findLegacyTarget(targetName), void 0);
    }
    findAll(...targetNames) {
      return targetNames.reduce((targets, targetName) => [
        ...targets,
        ...this.findAllTargets(targetName),
        ...this.findAllLegacyTargets(targetName)
      ], []);
    }
    findTarget(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findElement(selector);
    }
    findAllTargets(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findAllElements(selector);
    }
    getSelectorForTargetName(targetName) {
      const attributeName = this.schema.targetAttributeForScope(this.identifier);
      return attributeValueContainsToken(attributeName, targetName);
    }
    findLegacyTarget(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.deprecate(this.scope.findElement(selector), targetName);
    }
    findAllLegacyTargets(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.scope.findAllElements(selector).map((element) => this.deprecate(element, targetName));
    }
    getLegacySelectorForTargetName(targetName) {
      const targetDescriptor = `${this.identifier}.${targetName}`;
      return attributeValueContainsToken(this.schema.targetAttribute, targetDescriptor);
    }
    deprecate(element, targetName) {
      if (element) {
        const { identifier } = this;
        const attributeName = this.schema.targetAttribute;
        const revisedAttributeName = this.schema.targetAttributeForScope(identifier);
        this.guide.warn(element, `target:${targetName}`, `Please replace ${attributeName}="${identifier}.${targetName}" with ${revisedAttributeName}="${targetName}". The ${attributeName} attribute is deprecated and will be removed in a future version of Stimulus.`);
      }
      return element;
    }
    get guide() {
      return this.scope.guide;
    }
  };
  var OutletSet = class {
    constructor(scope, controllerElement) {
      this.scope = scope;
      this.controllerElement = controllerElement;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get schema() {
      return this.scope.schema;
    }
    has(outletName) {
      return this.find(outletName) != null;
    }
    find(...outletNames) {
      return outletNames.reduce((outlet, outletName) => outlet || this.findOutlet(outletName), void 0);
    }
    findAll(...outletNames) {
      return outletNames.reduce((outlets, outletName) => [...outlets, ...this.findAllOutlets(outletName)], []);
    }
    getSelectorForOutletName(outletName) {
      const attributeName = this.schema.outletAttributeForScope(this.identifier, outletName);
      return this.controllerElement.getAttribute(attributeName);
    }
    findOutlet(outletName) {
      const selector = this.getSelectorForOutletName(outletName);
      if (selector)
        return this.findElement(selector, outletName);
    }
    findAllOutlets(outletName) {
      const selector = this.getSelectorForOutletName(outletName);
      return selector ? this.findAllElements(selector, outletName) : [];
    }
    findElement(selector, outletName) {
      const elements = this.scope.queryElements(selector);
      return elements.filter((element) => this.matchesElement(element, selector, outletName))[0];
    }
    findAllElements(selector, outletName) {
      const elements = this.scope.queryElements(selector);
      return elements.filter((element) => this.matchesElement(element, selector, outletName));
    }
    matchesElement(element, selector, outletName) {
      const controllerAttribute = element.getAttribute(this.scope.schema.controllerAttribute) || "";
      return element.matches(selector) && controllerAttribute.split(" ").includes(outletName);
    }
  };
  var Scope = class _Scope {
    constructor(schema, element, identifier, logger) {
      this.targets = new TargetSet(this);
      this.classes = new ClassMap(this);
      this.data = new DataMap(this);
      this.containsElement = (element2) => {
        return element2.closest(this.controllerSelector) === this.element;
      };
      this.schema = schema;
      this.element = element;
      this.identifier = identifier;
      this.guide = new Guide(logger);
      this.outlets = new OutletSet(this.documentScope, element);
    }
    findElement(selector) {
      return this.element.matches(selector) ? this.element : this.queryElements(selector).find(this.containsElement);
    }
    findAllElements(selector) {
      return [
        ...this.element.matches(selector) ? [this.element] : [],
        ...this.queryElements(selector).filter(this.containsElement)
      ];
    }
    queryElements(selector) {
      return Array.from(this.element.querySelectorAll(selector));
    }
    get controllerSelector() {
      return attributeValueContainsToken(this.schema.controllerAttribute, this.identifier);
    }
    get isDocumentScope() {
      return this.element === document.documentElement;
    }
    get documentScope() {
      return this.isDocumentScope ? this : new _Scope(this.schema, document.documentElement, this.identifier, this.guide.logger);
    }
  };
  var ScopeObserver = class {
    constructor(element, schema, delegate) {
      this.element = element;
      this.schema = schema;
      this.delegate = delegate;
      this.valueListObserver = new ValueListObserver(this.element, this.controllerAttribute, this);
      this.scopesByIdentifierByElement = /* @__PURE__ */ new WeakMap();
      this.scopeReferenceCounts = /* @__PURE__ */ new WeakMap();
    }
    start() {
      this.valueListObserver.start();
    }
    stop() {
      this.valueListObserver.stop();
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    parseValueForToken(token) {
      const { element, content: identifier } = token;
      return this.parseValueForElementAndIdentifier(element, identifier);
    }
    parseValueForElementAndIdentifier(element, identifier) {
      const scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
      let scope = scopesByIdentifier.get(identifier);
      if (!scope) {
        scope = this.delegate.createScopeForElementAndIdentifier(element, identifier);
        scopesByIdentifier.set(identifier, scope);
      }
      return scope;
    }
    elementMatchedValue(element, value) {
      const referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
      this.scopeReferenceCounts.set(value, referenceCount);
      if (referenceCount == 1) {
        this.delegate.scopeConnected(value);
      }
    }
    elementUnmatchedValue(element, value) {
      const referenceCount = this.scopeReferenceCounts.get(value);
      if (referenceCount) {
        this.scopeReferenceCounts.set(value, referenceCount - 1);
        if (referenceCount == 1) {
          this.delegate.scopeDisconnected(value);
        }
      }
    }
    fetchScopesByIdentifierForElement(element) {
      let scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
      if (!scopesByIdentifier) {
        scopesByIdentifier = /* @__PURE__ */ new Map();
        this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
      }
      return scopesByIdentifier;
    }
  };
  var Router = class {
    constructor(application2) {
      this.application = application2;
      this.scopeObserver = new ScopeObserver(this.element, this.schema, this);
      this.scopesByIdentifier = new Multimap();
      this.modulesByIdentifier = /* @__PURE__ */ new Map();
    }
    get element() {
      return this.application.element;
    }
    get schema() {
      return this.application.schema;
    }
    get logger() {
      return this.application.logger;
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    get modules() {
      return Array.from(this.modulesByIdentifier.values());
    }
    get contexts() {
      return this.modules.reduce((contexts, module) => contexts.concat(module.contexts), []);
    }
    start() {
      this.scopeObserver.start();
    }
    stop() {
      this.scopeObserver.stop();
    }
    loadDefinition(definition) {
      this.unloadIdentifier(definition.identifier);
      const module = new Module(this.application, definition);
      this.connectModule(module);
      const afterLoad = definition.controllerConstructor.afterLoad;
      if (afterLoad) {
        afterLoad.call(definition.controllerConstructor, definition.identifier, this.application);
      }
    }
    unloadIdentifier(identifier) {
      const module = this.modulesByIdentifier.get(identifier);
      if (module) {
        this.disconnectModule(module);
      }
    }
    getContextForElementAndIdentifier(element, identifier) {
      const module = this.modulesByIdentifier.get(identifier);
      if (module) {
        return module.contexts.find((context) => context.element == element);
      }
    }
    proposeToConnectScopeForElementAndIdentifier(element, identifier) {
      const scope = this.scopeObserver.parseValueForElementAndIdentifier(element, identifier);
      if (scope) {
        this.scopeObserver.elementMatchedValue(scope.element, scope);
      } else {
        console.error(`Couldn't find or create scope for identifier: "${identifier}" and element:`, element);
      }
    }
    handleError(error2, message, detail) {
      this.application.handleError(error2, message, detail);
    }
    createScopeForElementAndIdentifier(element, identifier) {
      return new Scope(this.schema, element, identifier, this.logger);
    }
    scopeConnected(scope) {
      this.scopesByIdentifier.add(scope.identifier, scope);
      const module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.connectContextForScope(scope);
      }
    }
    scopeDisconnected(scope) {
      this.scopesByIdentifier.delete(scope.identifier, scope);
      const module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.disconnectContextForScope(scope);
      }
    }
    connectModule(module) {
      this.modulesByIdentifier.set(module.identifier, module);
      const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach((scope) => module.connectContextForScope(scope));
    }
    disconnectModule(module) {
      this.modulesByIdentifier.delete(module.identifier);
      const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach((scope) => module.disconnectContextForScope(scope));
    }
  };
  var defaultSchema = {
    controllerAttribute: "data-controller",
    actionAttribute: "data-action",
    targetAttribute: "data-target",
    targetAttributeForScope: (identifier) => `data-${identifier}-target`,
    outletAttributeForScope: (identifier, outlet) => `data-${identifier}-${outlet}-outlet`,
    keyMappings: Object.assign(Object.assign({ enter: "Enter", tab: "Tab", esc: "Escape", space: " ", up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight", home: "Home", end: "End", page_up: "PageUp", page_down: "PageDown" }, objectFromEntries("abcdefghijklmnopqrstuvwxyz".split("").map((c) => [c, c]))), objectFromEntries("0123456789".split("").map((n) => [n, n])))
  };
  function objectFromEntries(array) {
    return array.reduce((memo, [k, v]) => Object.assign(Object.assign({}, memo), { [k]: v }), {});
  }
  var Application = class {
    constructor(element = document.documentElement, schema = defaultSchema) {
      this.logger = console;
      this.debug = false;
      this.logDebugActivity = (identifier, functionName, detail = {}) => {
        if (this.debug) {
          this.logFormattedMessage(identifier, functionName, detail);
        }
      };
      this.element = element;
      this.schema = schema;
      this.dispatcher = new Dispatcher(this);
      this.router = new Router(this);
      this.actionDescriptorFilters = Object.assign({}, defaultActionDescriptorFilters);
    }
    static start(element, schema) {
      const application2 = new this(element, schema);
      application2.start();
      return application2;
    }
    async start() {
      await domReady();
      this.logDebugActivity("application", "starting");
      this.dispatcher.start();
      this.router.start();
      this.logDebugActivity("application", "start");
    }
    stop() {
      this.logDebugActivity("application", "stopping");
      this.dispatcher.stop();
      this.router.stop();
      this.logDebugActivity("application", "stop");
    }
    register(identifier, controllerConstructor) {
      this.load({ identifier, controllerConstructor });
    }
    registerActionOption(name, filter) {
      this.actionDescriptorFilters[name] = filter;
    }
    load(head, ...rest) {
      const definitions = Array.isArray(head) ? head : [head, ...rest];
      definitions.forEach((definition) => {
        if (definition.controllerConstructor.shouldLoad) {
          this.router.loadDefinition(definition);
        }
      });
    }
    unload(head, ...rest) {
      const identifiers = Array.isArray(head) ? head : [head, ...rest];
      identifiers.forEach((identifier) => this.router.unloadIdentifier(identifier));
    }
    get controllers() {
      return this.router.contexts.map((context) => context.controller);
    }
    getControllerForElementAndIdentifier(element, identifier) {
      const context = this.router.getContextForElementAndIdentifier(element, identifier);
      return context ? context.controller : null;
    }
    handleError(error2, message, detail) {
      var _a;
      this.logger.error(`%s

%o

%o`, message, error2, detail);
      (_a = window.onerror) === null || _a === void 0 ? void 0 : _a.call(window, message, "", 0, 0, error2);
    }
    logFormattedMessage(identifier, functionName, detail = {}) {
      detail = Object.assign({ application: this }, detail);
      this.logger.groupCollapsed(`${identifier} #${functionName}`);
      this.logger.log("details:", Object.assign({}, detail));
      this.logger.groupEnd();
    }
  };
  function domReady() {
    return new Promise((resolve) => {
      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", () => resolve());
      } else {
        resolve();
      }
    });
  }
  function ClassPropertiesBlessing(constructor) {
    const classes = readInheritableStaticArrayValues(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
      return Object.assign(properties, propertiesForClassDefinition(classDefinition));
    }, {});
  }
  function propertiesForClassDefinition(key) {
    return {
      [`${key}Class`]: {
        get() {
          const { classes } = this;
          if (classes.has(key)) {
            return classes.get(key);
          } else {
            const attribute = classes.getAttributeName(key);
            throw new Error(`Missing attribute "${attribute}"`);
          }
        }
      },
      [`${key}Classes`]: {
        get() {
          return this.classes.getAll(key);
        }
      },
      [`has${capitalize(key)}Class`]: {
        get() {
          return this.classes.has(key);
        }
      }
    };
  }
  function OutletPropertiesBlessing(constructor) {
    const outlets = readInheritableStaticArrayValues(constructor, "outlets");
    return outlets.reduce((properties, outletDefinition) => {
      return Object.assign(properties, propertiesForOutletDefinition(outletDefinition));
    }, {});
  }
  function getOutletController(controller, element, identifier) {
    return controller.application.getControllerForElementAndIdentifier(element, identifier);
  }
  function getControllerAndEnsureConnectedScope(controller, element, outletName) {
    let outletController = getOutletController(controller, element, outletName);
    if (outletController)
      return outletController;
    controller.application.router.proposeToConnectScopeForElementAndIdentifier(element, outletName);
    outletController = getOutletController(controller, element, outletName);
    if (outletController)
      return outletController;
  }
  function propertiesForOutletDefinition(name) {
    const camelizedName = namespaceCamelize(name);
    return {
      [`${camelizedName}Outlet`]: {
        get() {
          const outletElement = this.outlets.find(name);
          const selector = this.outlets.getSelectorForOutletName(name);
          if (outletElement) {
            const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
            if (outletController)
              return outletController;
            throw new Error(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`);
          }
          throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
        }
      },
      [`${camelizedName}Outlets`]: {
        get() {
          const outlets = this.outlets.findAll(name);
          if (outlets.length > 0) {
            return outlets.map((outletElement) => {
              const outletController = getControllerAndEnsureConnectedScope(this, outletElement, name);
              if (outletController)
                return outletController;
              console.warn(`The provided outlet element is missing an outlet controller "${name}" instance for host controller "${this.identifier}"`, outletElement);
            }).filter((controller) => controller);
          }
          return [];
        }
      },
      [`${camelizedName}OutletElement`]: {
        get() {
          const outletElement = this.outlets.find(name);
          const selector = this.outlets.getSelectorForOutletName(name);
          if (outletElement) {
            return outletElement;
          } else {
            throw new Error(`Missing outlet element "${name}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${selector}".`);
          }
        }
      },
      [`${camelizedName}OutletElements`]: {
        get() {
          return this.outlets.findAll(name);
        }
      },
      [`has${capitalize(camelizedName)}Outlet`]: {
        get() {
          return this.outlets.has(name);
        }
      }
    };
  }
  function TargetPropertiesBlessing(constructor) {
    const targets = readInheritableStaticArrayValues(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
      return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
    }, {});
  }
  function propertiesForTargetDefinition(name) {
    return {
      [`${name}Target`]: {
        get() {
          const target = this.targets.find(name);
          if (target) {
            return target;
          } else {
            throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
          }
        }
      },
      [`${name}Targets`]: {
        get() {
          return this.targets.findAll(name);
        }
      },
      [`has${capitalize(name)}Target`]: {
        get() {
          return this.targets.has(name);
        }
      }
    };
  }
  function ValuePropertiesBlessing(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
    const propertyDescriptorMap = {
      valueDescriptorMap: {
        get() {
          return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
            const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair, this.identifier);
            const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
            return Object.assign(result, { [attributeName]: valueDescriptor });
          }, {});
        }
      }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
      return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
  }
  function propertiesForValueDefinitionPair(valueDefinitionPair, controller) {
    const definition = parseValueDefinitionPair(valueDefinitionPair, controller);
    const { key, name, reader: read2, writer: write2 } = definition;
    return {
      [name]: {
        get() {
          const value = this.data.get(key);
          if (value !== null) {
            return read2(value);
          } else {
            return definition.defaultValue;
          }
        },
        set(value) {
          if (value === void 0) {
            this.data.delete(key);
          } else {
            this.data.set(key, write2(value));
          }
        }
      },
      [`has${capitalize(name)}`]: {
        get() {
          return this.data.has(key) || definition.hasCustomDefaultValue;
        }
      }
    };
  }
  function parseValueDefinitionPair([token, typeDefinition], controller) {
    return valueDescriptorForTokenAndTypeDefinition({
      controller,
      token,
      typeDefinition
    });
  }
  function parseValueTypeConstant(constant) {
    switch (constant) {
      case Array:
        return "array";
      case Boolean:
        return "boolean";
      case Number:
        return "number";
      case Object:
        return "object";
      case String:
        return "string";
    }
  }
  function parseValueTypeDefault(defaultValue) {
    switch (typeof defaultValue) {
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
    }
    if (Array.isArray(defaultValue))
      return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
      return "object";
  }
  function parseValueTypeObject(payload) {
    const { controller, token, typeObject } = payload;
    const hasType = isSomething(typeObject.type);
    const hasDefault = isSomething(typeObject.default);
    const fullObject = hasType && hasDefault;
    const onlyType = hasType && !hasDefault;
    const onlyDefault = !hasType && hasDefault;
    const typeFromObject = parseValueTypeConstant(typeObject.type);
    const typeFromDefaultValue = parseValueTypeDefault(payload.typeObject.default);
    if (onlyType)
      return typeFromObject;
    if (onlyDefault)
      return typeFromDefaultValue;
    if (typeFromObject !== typeFromDefaultValue) {
      const propertyPath = controller ? `${controller}.${token}` : token;
      throw new Error(`The specified default value for the Stimulus Value "${propertyPath}" must match the defined type "${typeFromObject}". The provided default value of "${typeObject.default}" is of type "${typeFromDefaultValue}".`);
    }
    if (fullObject)
      return typeFromObject;
  }
  function parseValueTypeDefinition(payload) {
    const { controller, token, typeDefinition } = payload;
    const typeObject = { controller, token, typeObject: typeDefinition };
    const typeFromObject = parseValueTypeObject(typeObject);
    const typeFromDefaultValue = parseValueTypeDefault(typeDefinition);
    const typeFromConstant = parseValueTypeConstant(typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
      return type;
    const propertyPath = controller ? `${controller}.${typeDefinition}` : token;
    throw new Error(`Unknown value type "${propertyPath}" for "${token}" value`);
  }
  function defaultValueForDefinition(typeDefinition) {
    const constant = parseValueTypeConstant(typeDefinition);
    if (constant)
      return defaultValuesByType[constant];
    const hasDefault = hasProperty(typeDefinition, "default");
    const hasType = hasProperty(typeDefinition, "type");
    const typeObject = typeDefinition;
    if (hasDefault)
      return typeObject.default;
    if (hasType) {
      const { type } = typeObject;
      const constantFromType = parseValueTypeConstant(type);
      if (constantFromType)
        return defaultValuesByType[constantFromType];
    }
    return typeDefinition;
  }
  function valueDescriptorForTokenAndTypeDefinition(payload) {
    const { token, typeDefinition } = payload;
    const key = `${dasherize(token)}-value`;
    const type = parseValueTypeDefinition(payload);
    return {
      type,
      key,
      name: camelize(key),
      get defaultValue() {
        return defaultValueForDefinition(typeDefinition);
      },
      get hasCustomDefaultValue() {
        return parseValueTypeDefault(typeDefinition) !== void 0;
      },
      reader: readers[type],
      writer: writers[type] || writers.default
    };
  }
  var defaultValuesByType = {
    get array() {
      return [];
    },
    boolean: false,
    number: 0,
    get object() {
      return {};
    },
    string: ""
  };
  var readers = {
    array(value) {
      const array = JSON.parse(value);
      if (!Array.isArray(array)) {
        throw new TypeError(`expected value of type "array" but instead got value "${value}" of type "${parseValueTypeDefault(array)}"`);
      }
      return array;
    },
    boolean(value) {
      return !(value == "0" || String(value).toLowerCase() == "false");
    },
    number(value) {
      return Number(value.replace(/_/g, ""));
    },
    object(value) {
      const object = JSON.parse(value);
      if (object === null || typeof object != "object" || Array.isArray(object)) {
        throw new TypeError(`expected value of type "object" but instead got value "${value}" of type "${parseValueTypeDefault(object)}"`);
      }
      return object;
    },
    string(value) {
      return value;
    }
  };
  var writers = {
    default: writeString,
    array: writeJSON,
    object: writeJSON
  };
  function writeJSON(value) {
    return JSON.stringify(value);
  }
  function writeString(value) {
    return `${value}`;
  }
  var Controller = class {
    constructor(context) {
      this.context = context;
    }
    static get shouldLoad() {
      return true;
    }
    static afterLoad(_identifier, _application) {
      return;
    }
    get application() {
      return this.context.application;
    }
    get scope() {
      return this.context.scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get targets() {
      return this.scope.targets;
    }
    get outlets() {
      return this.scope.outlets;
    }
    get classes() {
      return this.scope.classes;
    }
    get data() {
      return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
      const type = prefix ? `${prefix}:${eventName}` : eventName;
      const event = new CustomEvent(type, { detail, bubbles, cancelable });
      target.dispatchEvent(event);
      return event;
    }
  };
  Controller.blessings = [
    ClassPropertiesBlessing,
    TargetPropertiesBlessing,
    ValuePropertiesBlessing,
    OutletPropertiesBlessing
  ];
  Controller.targets = [];
  Controller.outlets = [];
  Controller.values = {};

  // app/javascript/controllers/application.js
  var application = Application.start();
  application.debug = false;
  window.Stimulus = application;

  // app/javascript/controllers/hello_controller.js
  var hello_controller_default = class extends Controller {
    connect() {
      this.element.textContent = "Hello World!";
    }
  };

  // app/javascript/controllers/progress_bar_controller.js
  var progress_bar_controller_default = class extends Controller {
    connect() {
      $("#loading-bar").hide();
      $(document).on("turbo:loading", function() {
        $("#loading-bar").show();
        $("#progress").css("width", "20%");
      });
      $(document).on("turbo:streamElementReceived", function() {
        $("#loading-bar").show();
        $("#progress").css("width", "70%");
      });
      $(document).on("turbo:loading", function() {
        $("#loading-bar").show();
        $("#progress").css("width", "90%");
      });
      $(document).on("turbo:load", function() {
        $("#loading-bar").hide();
      });
      $("#toast-alert").delay(5e3).fadeOut(300);
    }
  };

  // app/javascript/controllers/show_inventory_controller.js
  var import_jquery = __toESM(require_jquery());
  var show_inventory_controller_default = class extends Controller {
    connect() {
      (0, import_jquery.default)(".toggleDetails").on("click", function() {
        if ((0, import_jquery.default)(".toggleDetails").html() === "View Complete Detail") {
          (0, import_jquery.default)(".toggleDetails").html("View Less Detail");
        } else {
          (0, import_jquery.default)(".toggleDetails").html("View Complete Detail");
        }
        (0, import_jquery.default)("#detailsContainer").toggleClass("hidden");
      });
    }
  };

  // app/javascript/controllers/inventories_controller.js
  var inventories_controller_default = class extends Controller {
    static targets = ["inventory"];
    connect() {
    }
    inventoryTargetConnected(element) {
    }
  };

  // app/javascript/controllers/tom_select_controller.js
  var import_tom_select = __toESM(require_tom_select_complete());
  var tom_select_controller_default = class extends Controller {
    connect() {
      let blockEmpty = this.element.dataset.blockEmpty === "true";
      const config = {
        allowEmptyOption: !blockEmpty
      };
      let ts = new import_tom_select.default(this.element, config);
    }
  };

  // app/javascript/controllers/navbar_controller.js
  var navbar_controller_default = class extends Controller {
    static targets = ["secondElement"];
    connect() {
    }
    secondElementTargetConnected() {
      this.secondElementTarget.style.top = `${$("nav").height()}px`;
    }
  };

  // app/javascript/controllers/inventory_form_controller.js
  var inventory_form_controller_default = class extends Controller {
    static targets = ["grid", "input"];
    connect() {
      this.inputTarget.addEventListener("change", this.loadImages.bind(this));
    }
    loadImages(event) {
      const files = event.target.files;
      this.gridTarget.innerHTML = "";
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.classList.add("w-1/5", "h-50", "object-cover", "m-1");
          this.gridTarget.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // app/javascript/controllers/index.js
  application.register("hello", hello_controller_default);
  application.register("progress-bar", progress_bar_controller_default);
  application.register("show-inventory", show_inventory_controller_default);
  application.register("inventories", inventories_controller_default);
  application.register("tom-select", tom_select_controller_default);
  application.register("navbar", navbar_controller_default);
  application.register("inventory-form", inventory_form_controller_default);

  // app/javascript/add_jquery.js
  var import_jquery2 = __toESM(require_jquery());
  window.jQuery = import_jquery2.default;
  window.$ = import_jquery2.default;

  // node_modules/flowbite/lib/esm/dom/events.js
  var Events = (
    /** @class */
    function() {
      function Events2(eventType, eventFunctions) {
        if (eventFunctions === void 0) {
          eventFunctions = [];
        }
        this._eventType = eventType;
        this._eventFunctions = eventFunctions;
      }
      Events2.prototype.init = function() {
        var _this = this;
        this._eventFunctions.forEach(function(eventFunction) {
          if (typeof window !== "undefined") {
            window.addEventListener(_this._eventType, eventFunction);
          }
        });
      };
      return Events2;
    }()
  );
  var events_default = Events;

  // node_modules/flowbite/lib/esm/components/accordion/index.js
  var __assign = function() {
    __assign = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign.apply(this, arguments);
  };
  var Default = {
    alwaysOpen: false,
    activeClasses: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
    inactiveClasses: "text-gray-500 dark:text-gray-400",
    onOpen: function() {
    },
    onClose: function() {
    },
    onToggle: function() {
    }
  };
  var Accordion = (
    /** @class */
    function() {
      function Accordion2(items, options) {
        if (items === void 0) {
          items = [];
        }
        if (options === void 0) {
          options = Default;
        }
        this._items = items;
        this._options = __assign(__assign({}, Default), options);
        this._init();
      }
      Accordion2.prototype._init = function() {
        var _this = this;
        if (this._items.length) {
          this._items.map(function(item) {
            if (item.active) {
              _this.open(item.id);
            }
            item.triggerEl.addEventListener("click", function() {
              _this.toggle(item.id);
            });
          });
        }
      };
      Accordion2.prototype.getItem = function(id) {
        return this._items.filter(function(item) {
          return item.id === id;
        })[0];
      };
      Accordion2.prototype.open = function(id) {
        var _a, _b;
        var _this = this;
        var item = this.getItem(id);
        if (!this._options.alwaysOpen) {
          this._items.map(function(i) {
            var _a2, _b2;
            if (i !== item) {
              (_a2 = i.triggerEl.classList).remove.apply(_a2, _this._options.activeClasses.split(" "));
              (_b2 = i.triggerEl.classList).add.apply(_b2, _this._options.inactiveClasses.split(" "));
              i.targetEl.classList.add("hidden");
              i.triggerEl.setAttribute("aria-expanded", "false");
              i.active = false;
              if (i.iconEl) {
                i.iconEl.classList.remove("rotate-180");
              }
            }
          });
        }
        (_a = item.triggerEl.classList).add.apply(_a, this._options.activeClasses.split(" "));
        (_b = item.triggerEl.classList).remove.apply(_b, this._options.inactiveClasses.split(" "));
        item.triggerEl.setAttribute("aria-expanded", "true");
        item.targetEl.classList.remove("hidden");
        item.active = true;
        if (item.iconEl) {
          item.iconEl.classList.add("rotate-180");
        }
        this._options.onOpen(this, item);
      };
      Accordion2.prototype.toggle = function(id) {
        var item = this.getItem(id);
        if (item.active) {
          this.close(id);
        } else {
          this.open(id);
        }
        this._options.onToggle(this, item);
      };
      Accordion2.prototype.close = function(id) {
        var _a, _b;
        var item = this.getItem(id);
        (_a = item.triggerEl.classList).remove.apply(_a, this._options.activeClasses.split(" "));
        (_b = item.triggerEl.classList).add.apply(_b, this._options.inactiveClasses.split(" "));
        item.targetEl.classList.add("hidden");
        item.triggerEl.setAttribute("aria-expanded", "false");
        item.active = false;
        if (item.iconEl) {
          item.iconEl.classList.remove("rotate-180");
        }
        this._options.onClose(this, item);
      };
      return Accordion2;
    }()
  );
  function initAccordions() {
    document.querySelectorAll("[data-accordion]").forEach(function($accordionEl) {
      var alwaysOpen = $accordionEl.getAttribute("data-accordion");
      var activeClasses = $accordionEl.getAttribute("data-active-classes");
      var inactiveClasses = $accordionEl.getAttribute("data-inactive-classes");
      var items = [];
      $accordionEl.querySelectorAll("[data-accordion-target]").forEach(function($triggerEl) {
        if ($triggerEl.closest("[data-accordion]") === $accordionEl) {
          var item = {
            id: $triggerEl.getAttribute("data-accordion-target"),
            triggerEl: $triggerEl,
            targetEl: document.querySelector($triggerEl.getAttribute("data-accordion-target")),
            iconEl: $triggerEl.querySelector("[data-accordion-icon]"),
            active: $triggerEl.getAttribute("aria-expanded") === "true" ? true : false
          };
          items.push(item);
        }
      });
      new Accordion(items, {
        alwaysOpen: alwaysOpen === "open" ? true : false,
        activeClasses: activeClasses ? activeClasses : Default.activeClasses,
        inactiveClasses: inactiveClasses ? inactiveClasses : Default.inactiveClasses
      });
    });
  }
  if (typeof window !== "undefined") {
    window.Accordion = Accordion;
    window.initAccordions = initAccordions;
  }

  // node_modules/flowbite/lib/esm/components/collapse/index.js
  var __assign2 = function() {
    __assign2 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign2.apply(this, arguments);
  };
  var Default2 = {
    onCollapse: function() {
    },
    onExpand: function() {
    },
    onToggle: function() {
    }
  };
  var Collapse = (
    /** @class */
    function() {
      function Collapse2(targetEl, triggerEl, options) {
        if (targetEl === void 0) {
          targetEl = null;
        }
        if (triggerEl === void 0) {
          triggerEl = null;
        }
        if (options === void 0) {
          options = Default2;
        }
        this._targetEl = targetEl;
        this._triggerEl = triggerEl;
        this._options = __assign2(__assign2({}, Default2), options);
        this._visible = false;
        this._init();
      }
      Collapse2.prototype._init = function() {
        var _this = this;
        if (this._triggerEl) {
          if (this._triggerEl.hasAttribute("aria-expanded")) {
            this._visible = this._triggerEl.getAttribute("aria-expanded") === "true";
          } else {
            this._visible = !this._targetEl.classList.contains("hidden");
          }
          this._triggerEl.addEventListener("click", function() {
            _this.toggle();
          });
        }
      };
      Collapse2.prototype.collapse = function() {
        this._targetEl.classList.add("hidden");
        if (this._triggerEl) {
          this._triggerEl.setAttribute("aria-expanded", "false");
        }
        this._visible = false;
        this._options.onCollapse(this);
      };
      Collapse2.prototype.expand = function() {
        this._targetEl.classList.remove("hidden");
        if (this._triggerEl) {
          this._triggerEl.setAttribute("aria-expanded", "true");
        }
        this._visible = true;
        this._options.onExpand(this);
      };
      Collapse2.prototype.toggle = function() {
        if (this._visible) {
          this.collapse();
        } else {
          this.expand();
        }
        this._options.onToggle(this);
      };
      return Collapse2;
    }()
  );
  function initCollapses() {
    document.querySelectorAll("[data-collapse-toggle]").forEach(function($triggerEl) {
      var targetId = $triggerEl.getAttribute("data-collapse-toggle");
      var $targetEl = document.getElementById(targetId);
      if ($targetEl) {
        new Collapse($targetEl, $triggerEl);
      } else {
        console.error('The target element with id "'.concat(targetId, '" does not exist. Please check the data-collapse-toggle attribute.'));
      }
    });
  }
  if (typeof window !== "undefined") {
    window.Collapse = Collapse;
    window.initCollapses = initCollapses;
  }

  // node_modules/flowbite/lib/esm/components/carousel/index.js
  var __assign3 = function() {
    __assign3 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign3.apply(this, arguments);
  };
  var Default3 = {
    defaultPosition: 0,
    indicators: {
      items: [],
      activeClasses: "bg-white dark:bg-gray-800",
      inactiveClasses: "bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800"
    },
    interval: 3e3,
    onNext: function() {
    },
    onPrev: function() {
    },
    onChange: function() {
    }
  };
  var Carousel = (
    /** @class */
    function() {
      function Carousel2(items, options) {
        if (items === void 0) {
          items = [];
        }
        if (options === void 0) {
          options = Default3;
        }
        this._items = items;
        this._options = __assign3(__assign3(__assign3({}, Default3), options), { indicators: __assign3(__assign3({}, Default3.indicators), options.indicators) });
        this._activeItem = this.getItem(this._options.defaultPosition);
        this._indicators = this._options.indicators.items;
        this._intervalDuration = this._options.interval;
        this._intervalInstance = null;
        this._init();
      }
      Carousel2.prototype._init = function() {
        var _this = this;
        this._items.map(function(item) {
          item.el.classList.add("absolute", "inset-0", "transition-transform", "transform");
        });
        if (this._getActiveItem()) {
          this.slideTo(this._getActiveItem().position);
        } else {
          this.slideTo(0);
        }
        this._indicators.map(function(indicator, position) {
          indicator.el.addEventListener("click", function() {
            _this.slideTo(position);
          });
        });
      };
      Carousel2.prototype.getItem = function(position) {
        return this._items[position];
      };
      Carousel2.prototype.slideTo = function(position) {
        var nextItem = this._items[position];
        var rotationItems = {
          left: nextItem.position === 0 ? this._items[this._items.length - 1] : this._items[nextItem.position - 1],
          middle: nextItem,
          right: nextItem.position === this._items.length - 1 ? this._items[0] : this._items[nextItem.position + 1]
        };
        this._rotate(rotationItems);
        this._setActiveItem(nextItem);
        if (this._intervalInstance) {
          this.pause();
          this.cycle();
        }
        this._options.onChange(this);
      };
      Carousel2.prototype.next = function() {
        var activeItem = this._getActiveItem();
        var nextItem = null;
        if (activeItem.position === this._items.length - 1) {
          nextItem = this._items[0];
        } else {
          nextItem = this._items[activeItem.position + 1];
        }
        this.slideTo(nextItem.position);
        this._options.onNext(this);
      };
      Carousel2.prototype.prev = function() {
        var activeItem = this._getActiveItem();
        var prevItem = null;
        if (activeItem.position === 0) {
          prevItem = this._items[this._items.length - 1];
        } else {
          prevItem = this._items[activeItem.position - 1];
        }
        this.slideTo(prevItem.position);
        this._options.onPrev(this);
      };
      Carousel2.prototype._rotate = function(rotationItems) {
        this._items.map(function(item) {
          item.el.classList.add("hidden");
        });
        rotationItems.left.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-20");
        rotationItems.left.el.classList.add("-translate-x-full", "z-10");
        rotationItems.middle.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-10");
        rotationItems.middle.el.classList.add("translate-x-0", "z-20");
        rotationItems.right.el.classList.remove("-translate-x-full", "translate-x-full", "translate-x-0", "hidden", "z-20");
        rotationItems.right.el.classList.add("translate-x-full", "z-10");
      };
      Carousel2.prototype.cycle = function() {
        var _this = this;
        if (typeof window !== "undefined") {
          this._intervalInstance = window.setInterval(function() {
            _this.next();
          }, this._intervalDuration);
        }
      };
      Carousel2.prototype.pause = function() {
        clearInterval(this._intervalInstance);
      };
      Carousel2.prototype._getActiveItem = function() {
        return this._activeItem;
      };
      Carousel2.prototype._setActiveItem = function(item) {
        var _a, _b;
        var _this = this;
        this._activeItem = item;
        var position = item.position;
        if (this._indicators.length) {
          this._indicators.map(function(indicator) {
            var _a2, _b2;
            indicator.el.setAttribute("aria-current", "false");
            (_a2 = indicator.el.classList).remove.apply(_a2, _this._options.indicators.activeClasses.split(" "));
            (_b2 = indicator.el.classList).add.apply(_b2, _this._options.indicators.inactiveClasses.split(" "));
          });
          (_a = this._indicators[position].el.classList).add.apply(_a, this._options.indicators.activeClasses.split(" "));
          (_b = this._indicators[position].el.classList).remove.apply(_b, this._options.indicators.inactiveClasses.split(" "));
          this._indicators[position].el.setAttribute("aria-current", "true");
        }
      };
      return Carousel2;
    }()
  );
  function initCarousels() {
    document.querySelectorAll("[data-carousel]").forEach(function($carouselEl) {
      var interval = $carouselEl.getAttribute("data-carousel-interval");
      var slide = $carouselEl.getAttribute("data-carousel") === "slide" ? true : false;
      var items = [];
      var defaultPosition = 0;
      if ($carouselEl.querySelectorAll("[data-carousel-item]").length) {
        Array.from($carouselEl.querySelectorAll("[data-carousel-item]")).map(function($carouselItemEl, position) {
          items.push({
            position,
            el: $carouselItemEl
          });
          if ($carouselItemEl.getAttribute("data-carousel-item") === "active") {
            defaultPosition = position;
          }
        });
      }
      var indicators = [];
      if ($carouselEl.querySelectorAll("[data-carousel-slide-to]").length) {
        Array.from($carouselEl.querySelectorAll("[data-carousel-slide-to]")).map(function($indicatorEl) {
          indicators.push({
            position: parseInt($indicatorEl.getAttribute("data-carousel-slide-to")),
            el: $indicatorEl
          });
        });
      }
      var carousel = new Carousel(items, {
        defaultPosition,
        indicators: {
          items: indicators
        },
        interval: interval ? interval : Default3.interval
      });
      if (slide) {
        carousel.cycle();
      }
      var carouselNextEl = $carouselEl.querySelector("[data-carousel-next]");
      var carouselPrevEl = $carouselEl.querySelector("[data-carousel-prev]");
      if (carouselNextEl) {
        carouselNextEl.addEventListener("click", function() {
          carousel.next();
        });
      }
      if (carouselPrevEl) {
        carouselPrevEl.addEventListener("click", function() {
          carousel.prev();
        });
      }
    });
  }
  if (typeof window !== "undefined") {
    window.Carousel = Carousel;
    window.initCarousels = initCarousels;
  }

  // node_modules/flowbite/lib/esm/components/dismiss/index.js
  var __assign4 = function() {
    __assign4 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign4.apply(this, arguments);
  };
  var Default4 = {
    transition: "transition-opacity",
    duration: 300,
    timing: "ease-out",
    onHide: function() {
    }
  };
  var Dismiss = (
    /** @class */
    function() {
      function Dismiss2(targetEl, triggerEl, options) {
        if (targetEl === void 0) {
          targetEl = null;
        }
        if (triggerEl === void 0) {
          triggerEl = null;
        }
        if (options === void 0) {
          options = Default4;
        }
        this._targetEl = targetEl;
        this._triggerEl = triggerEl;
        this._options = __assign4(__assign4({}, Default4), options);
        this._init();
      }
      Dismiss2.prototype._init = function() {
        var _this = this;
        if (this._triggerEl) {
          this._triggerEl.addEventListener("click", function() {
            _this.hide();
          });
        }
      };
      Dismiss2.prototype.hide = function() {
        var _this = this;
        this._targetEl.classList.add(this._options.transition, "duration-".concat(this._options.duration), this._options.timing, "opacity-0");
        setTimeout(function() {
          _this._targetEl.classList.add("hidden");
        }, this._options.duration);
        this._options.onHide(this, this._targetEl);
      };
      return Dismiss2;
    }()
  );
  function initDismisses() {
    document.querySelectorAll("[data-dismiss-target]").forEach(function($triggerEl) {
      var targetId = $triggerEl.getAttribute("data-dismiss-target");
      var $dismissEl = document.querySelector(targetId);
      if ($dismissEl) {
        new Dismiss($dismissEl, $triggerEl);
      } else {
        console.error('The dismiss element with id "'.concat(targetId, '" does not exist. Please check the data-dismiss-target attribute.'));
      }
    });
  }
  if (typeof window !== "undefined") {
    window.Dismiss = Dismiss;
    window.initDismisses = initDismisses;
  }

  // node_modules/@popperjs/core/lib/enums.js
  var top = "top";
  var bottom = "bottom";
  var right = "right";
  var left = "left";
  var auto = "auto";
  var basePlacements = [top, bottom, right, left];
  var start2 = "start";
  var end = "end";
  var clippingParents = "clippingParents";
  var viewport = "viewport";
  var popper = "popper";
  var reference = "reference";
  var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
    return acc.concat([placement + "-" + start2, placement + "-" + end]);
  }, []);
  var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
    return acc.concat([placement, placement + "-" + start2, placement + "-" + end]);
  }, []);
  var beforeRead = "beforeRead";
  var read = "read";
  var afterRead = "afterRead";
  var beforeMain = "beforeMain";
  var main = "main";
  var afterMain = "afterMain";
  var beforeWrite = "beforeWrite";
  var write = "write";
  var afterWrite = "afterWrite";
  var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

  // node_modules/@popperjs/core/lib/dom-utils/getNodeName.js
  function getNodeName(element) {
    return element ? (element.nodeName || "").toLowerCase() : null;
  }

  // node_modules/@popperjs/core/lib/dom-utils/getWindow.js
  function getWindow(node) {
    if (node == null) {
      return window;
    }
    if (node.toString() !== "[object Window]") {
      var ownerDocument = node.ownerDocument;
      return ownerDocument ? ownerDocument.defaultView || window : window;
    }
    return node;
  }

  // node_modules/@popperjs/core/lib/dom-utils/instanceOf.js
  function isElement(node) {
    var OwnElement = getWindow(node).Element;
    return node instanceof OwnElement || node instanceof Element;
  }
  function isHTMLElement(node) {
    var OwnElement = getWindow(node).HTMLElement;
    return node instanceof OwnElement || node instanceof HTMLElement;
  }
  function isShadowRoot(node) {
    if (typeof ShadowRoot === "undefined") {
      return false;
    }
    var OwnElement = getWindow(node).ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
  }

  // node_modules/@popperjs/core/lib/modifiers/applyStyles.js
  function applyStyles(_ref) {
    var state = _ref.state;
    Object.keys(state.elements).forEach(function(name) {
      var style = state.styles[name] || {};
      var attributes = state.attributes[name] || {};
      var element = state.elements[name];
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(name2) {
        var value = attributes[name2];
        if (value === false) {
          element.removeAttribute(name2);
        } else {
          element.setAttribute(name2, value === true ? "" : value);
        }
      });
    });
  }
  function effect(_ref2) {
    var state = _ref2.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: "0",
        top: "0",
        margin: "0"
      },
      arrow: {
        position: "absolute"
      },
      reference: {}
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;
    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    }
    return function() {
      Object.keys(state.elements).forEach(function(name) {
        var element = state.elements[name];
        var attributes = state.attributes[name] || {};
        var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
        var style = styleProperties.reduce(function(style2, property) {
          style2[property] = "";
          return style2;
        }, {});
        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        }
        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function(attribute) {
          element.removeAttribute(attribute);
        });
      });
    };
  }
  var applyStyles_default = {
    name: "applyStyles",
    enabled: true,
    phase: "write",
    fn: applyStyles,
    effect,
    requires: ["computeStyles"]
  };

  // node_modules/@popperjs/core/lib/utils/getBasePlacement.js
  function getBasePlacement(placement) {
    return placement.split("-")[0];
  }

  // node_modules/@popperjs/core/lib/utils/math.js
  var max = Math.max;
  var min = Math.min;
  var round = Math.round;

  // node_modules/@popperjs/core/lib/utils/userAgent.js
  function getUAString() {
    var uaData = navigator.userAgentData;
    if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
      return uaData.brands.map(function(item) {
        return item.brand + "/" + item.version;
      }).join(" ");
    }
    return navigator.userAgent;
  }

  // node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js
  function isLayoutViewport() {
    return !/^((?!chrome|android).)*safari/i.test(getUAString());
  }

  // node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js
  function getBoundingClientRect(element, includeScale, isFixedStrategy) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    var clientRect = element.getBoundingClientRect();
    var scaleX = 1;
    var scaleY = 1;
    if (includeScale && isHTMLElement(element)) {
      scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
      scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
    }
    var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
    var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
    var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
    var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
    var width = clientRect.width / scaleX;
    var height = clientRect.height / scaleY;
    return {
      width,
      height,
      top: y,
      right: x + width,
      bottom: y + height,
      left: x,
      x,
      y
    };
  }

  // node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js
  function getLayoutRect(element) {
    var clientRect = getBoundingClientRect(element);
    var width = element.offsetWidth;
    var height = element.offsetHeight;
    if (Math.abs(clientRect.width - width) <= 1) {
      width = clientRect.width;
    }
    if (Math.abs(clientRect.height - height) <= 1) {
      height = clientRect.height;
    }
    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width,
      height
    };
  }

  // node_modules/@popperjs/core/lib/dom-utils/contains.js
  function contains(parent, child) {
    var rootNode = child.getRootNode && child.getRootNode();
    if (parent.contains(child)) {
      return true;
    } else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;
      do {
        if (next && parent.isSameNode(next)) {
          return true;
        }
        next = next.parentNode || next.host;
      } while (next);
    }
    return false;
  }

  // node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js
  function getComputedStyle(element) {
    return getWindow(element).getComputedStyle(element);
  }

  // node_modules/@popperjs/core/lib/dom-utils/isTableElement.js
  function isTableElement(element) {
    return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
  }

  // node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js
  function getDocumentElement(element) {
    return ((isElement(element) ? element.ownerDocument : (
      // $FlowFixMe[prop-missing]
      element.document
    )) || window.document).documentElement;
  }

  // node_modules/@popperjs/core/lib/dom-utils/getParentNode.js
  function getParentNode(element) {
    if (getNodeName(element) === "html") {
      return element;
    }
    return (
      // this is a quicker (but less type safe) way to save quite some bytes from the bundle
      // $FlowFixMe[incompatible-return]
      // $FlowFixMe[prop-missing]
      element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
      element.parentNode || // DOM Element detected
      (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
      // $FlowFixMe[incompatible-call]: HTMLElement is a Node
      getDocumentElement(element)
    );
  }

  // node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js
  function getTrueOffsetParent(element) {
    if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
    getComputedStyle(element).position === "fixed") {
      return null;
    }
    return element.offsetParent;
  }
  function getContainingBlock(element) {
    var isFirefox = /firefox/i.test(getUAString());
    var isIE = /Trident/i.test(getUAString());
    if (isIE && isHTMLElement(element)) {
      var elementCss = getComputedStyle(element);
      if (elementCss.position === "fixed") {
        return null;
      }
    }
    var currentNode = getParentNode(element);
    if (isShadowRoot(currentNode)) {
      currentNode = currentNode.host;
    }
    while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
      var css = getComputedStyle(currentNode);
      if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
        return currentNode;
      } else {
        currentNode = currentNode.parentNode;
      }
    }
    return null;
  }
  function getOffsetParent(element) {
    var window2 = getWindow(element);
    var offsetParent = getTrueOffsetParent(element);
    while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
      offsetParent = getTrueOffsetParent(offsetParent);
    }
    if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) {
      return window2;
    }
    return offsetParent || getContainingBlock(element) || window2;
  }

  // node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js
  function getMainAxisFromPlacement(placement) {
    return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
  }

  // node_modules/@popperjs/core/lib/utils/within.js
  function within(min2, value, max2) {
    return max(min2, min(value, max2));
  }
  function withinMaxClamp(min2, value, max2) {
    var v = within(min2, value, max2);
    return v > max2 ? max2 : v;
  }

  // node_modules/@popperjs/core/lib/utils/getFreshSideObject.js
  function getFreshSideObject() {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }

  // node_modules/@popperjs/core/lib/utils/mergePaddingObject.js
  function mergePaddingObject(paddingObject) {
    return Object.assign({}, getFreshSideObject(), paddingObject);
  }

  // node_modules/@popperjs/core/lib/utils/expandToHashMap.js
  function expandToHashMap(value, keys) {
    return keys.reduce(function(hashMap, key) {
      hashMap[key] = value;
      return hashMap;
    }, {});
  }

  // node_modules/@popperjs/core/lib/modifiers/arrow.js
  var toPaddingObject = function toPaddingObject2(padding, state) {
    padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
      placement: state.placement
    })) : padding;
    return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  };
  function arrow(_ref) {
    var _state$modifiersData$;
    var state = _ref.state, name = _ref.name, options = _ref.options;
    var arrowElement = state.elements.arrow;
    var popperOffsets2 = state.modifiersData.popperOffsets;
    var basePlacement = getBasePlacement(state.placement);
    var axis = getMainAxisFromPlacement(basePlacement);
    var isVertical = [left, right].indexOf(basePlacement) >= 0;
    var len = isVertical ? "height" : "width";
    if (!arrowElement || !popperOffsets2) {
      return;
    }
    var paddingObject = toPaddingObject(options.padding, state);
    var arrowRect = getLayoutRect(arrowElement);
    var minProp = axis === "y" ? top : left;
    var maxProp = axis === "y" ? bottom : right;
    var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
    var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
    var arrowOffsetParent = getOffsetParent(arrowElement);
    var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
    var centerToReference = endDiff / 2 - startDiff / 2;
    var min2 = paddingObject[minProp];
    var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
    var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
    var offset2 = within(min2, center, max2);
    var axisProp = axis;
    state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
  }
  function effect2(_ref2) {
    var state = _ref2.state, options = _ref2.options;
    var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
    if (arrowElement == null) {
      return;
    }
    if (typeof arrowElement === "string") {
      arrowElement = state.elements.popper.querySelector(arrowElement);
      if (!arrowElement) {
        return;
      }
    }
    if (!contains(state.elements.popper, arrowElement)) {
      return;
    }
    state.elements.arrow = arrowElement;
  }
  var arrow_default = {
    name: "arrow",
    enabled: true,
    phase: "main",
    fn: arrow,
    effect: effect2,
    requires: ["popperOffsets"],
    requiresIfExists: ["preventOverflow"]
  };

  // node_modules/@popperjs/core/lib/utils/getVariation.js
  function getVariation(placement) {
    return placement.split("-")[1];
  }

  // node_modules/@popperjs/core/lib/modifiers/computeStyles.js
  var unsetSides = {
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto"
  };
  function roundOffsetsByDPR(_ref, win) {
    var x = _ref.x, y = _ref.y;
    var dpr = win.devicePixelRatio || 1;
    return {
      x: round(x * dpr) / dpr || 0,
      y: round(y * dpr) / dpr || 0
    };
  }
  function mapToStyles(_ref2) {
    var _Object$assign2;
    var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
    var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
    var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
      x,
      y
    }) : {
      x,
      y
    };
    x = _ref3.x;
    y = _ref3.y;
    var hasX = offsets.hasOwnProperty("x");
    var hasY = offsets.hasOwnProperty("y");
    var sideX = left;
    var sideY = top;
    var win = window;
    if (adaptive) {
      var offsetParent = getOffsetParent(popper2);
      var heightProp = "clientHeight";
      var widthProp = "clientWidth";
      if (offsetParent === getWindow(popper2)) {
        offsetParent = getDocumentElement(popper2);
        if (getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
          heightProp = "scrollHeight";
          widthProp = "scrollWidth";
        }
      }
      offsetParent = offsetParent;
      if (placement === top || (placement === left || placement === right) && variation === end) {
        sideY = bottom;
        var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
          // $FlowFixMe[prop-missing]
          offsetParent[heightProp]
        );
        y -= offsetY - popperRect.height;
        y *= gpuAcceleration ? 1 : -1;
      }
      if (placement === left || (placement === top || placement === bottom) && variation === end) {
        sideX = right;
        var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
          // $FlowFixMe[prop-missing]
          offsetParent[widthProp]
        );
        x -= offsetX - popperRect.width;
        x *= gpuAcceleration ? 1 : -1;
      }
    }
    var commonStyles = Object.assign({
      position
    }, adaptive && unsetSides);
    var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
      x,
      y
    }, getWindow(popper2)) : {
      x,
      y
    };
    x = _ref4.x;
    y = _ref4.y;
    if (gpuAcceleration) {
      var _Object$assign;
      return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
    }
    return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
  }
  function computeStyles(_ref5) {
    var state = _ref5.state, options = _ref5.options;
    var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
    var commonStyles = {
      placement: getBasePlacement(state.placement),
      variation: getVariation(state.placement),
      popper: state.elements.popper,
      popperRect: state.rects.popper,
      gpuAcceleration,
      isFixed: state.options.strategy === "fixed"
    };
    if (state.modifiersData.popperOffsets != null) {
      state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.popperOffsets,
        position: state.options.strategy,
        adaptive,
        roundOffsets
      })));
    }
    if (state.modifiersData.arrow != null) {
      state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
        offsets: state.modifiersData.arrow,
        position: "absolute",
        adaptive: false,
        roundOffsets
      })));
    }
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      "data-popper-placement": state.placement
    });
  }
  var computeStyles_default = {
    name: "computeStyles",
    enabled: true,
    phase: "beforeWrite",
    fn: computeStyles,
    data: {}
  };

  // node_modules/@popperjs/core/lib/modifiers/eventListeners.js
  var passive = {
    passive: true
  };
  function effect3(_ref) {
    var state = _ref.state, instance = _ref.instance, options = _ref.options;
    var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
    var window2 = getWindow(state.elements.popper);
    var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.addEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.addEventListener("resize", instance.update, passive);
    }
    return function() {
      if (scroll) {
        scrollParents.forEach(function(scrollParent) {
          scrollParent.removeEventListener("scroll", instance.update, passive);
        });
      }
      if (resize) {
        window2.removeEventListener("resize", instance.update, passive);
      }
    };
  }
  var eventListeners_default = {
    name: "eventListeners",
    enabled: true,
    phase: "write",
    fn: function fn() {
    },
    effect: effect3,
    data: {}
  };

  // node_modules/@popperjs/core/lib/utils/getOppositePlacement.js
  var hash = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, function(matched) {
      return hash[matched];
    });
  }

  // node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js
  var hash2 = {
    start: "end",
    end: "start"
  };
  function getOppositeVariationPlacement(placement) {
    return placement.replace(/start|end/g, function(matched) {
      return hash2[matched];
    });
  }

  // node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js
  function getWindowScroll(node) {
    var win = getWindow(node);
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    return {
      scrollLeft,
      scrollTop
    };
  }

  // node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js
  function getWindowScrollBarX(element) {
    return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
  }

  // node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js
  function getViewportRect(element, strategy) {
    var win = getWindow(element);
    var html = getDocumentElement(element);
    var visualViewport = win.visualViewport;
    var width = html.clientWidth;
    var height = html.clientHeight;
    var x = 0;
    var y = 0;
    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      var layoutViewport = isLayoutViewport();
      if (layoutViewport || !layoutViewport && strategy === "fixed") {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
    return {
      width,
      height,
      x: x + getWindowScrollBarX(element),
      y
    };
  }

  // node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js
  function getDocumentRect(element) {
    var _element$ownerDocumen;
    var html = getDocumentElement(element);
    var winScroll = getWindowScroll(element);
    var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
    var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
    var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
    var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
    var y = -winScroll.scrollTop;
    if (getComputedStyle(body || html).direction === "rtl") {
      x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
    }
    return {
      width,
      height,
      x,
      y
    };
  }

  // node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js
  function isScrollParent(element) {
    var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
  }

  // node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js
  function getScrollParent(node) {
    if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
      return node.ownerDocument.body;
    }
    if (isHTMLElement(node) && isScrollParent(node)) {
      return node;
    }
    return getScrollParent(getParentNode(node));
  }

  // node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js
  function listScrollParents(element, list) {
    var _element$ownerDocumen;
    if (list === void 0) {
      list = [];
    }
    var scrollParent = getScrollParent(element);
    var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
    var win = getWindow(scrollParent);
    var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
    var updatedList = list.concat(target);
    return isBody ? updatedList : (
      // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
      updatedList.concat(listScrollParents(getParentNode(target)))
    );
  }

  // node_modules/@popperjs/core/lib/utils/rectToClientRect.js
  function rectToClientRect(rect) {
    return Object.assign({}, rect, {
      left: rect.x,
      top: rect.y,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    });
  }

  // node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js
  function getInnerBoundingClientRect(element, strategy) {
    var rect = getBoundingClientRect(element, false, strategy === "fixed");
    rect.top = rect.top + element.clientTop;
    rect.left = rect.left + element.clientLeft;
    rect.bottom = rect.top + element.clientHeight;
    rect.right = rect.left + element.clientWidth;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = rect.left;
    rect.y = rect.top;
    return rect;
  }
  function getClientRectFromMixedType(element, clippingParent, strategy) {
    return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
  }
  function getClippingParents(element) {
    var clippingParents2 = listScrollParents(getParentNode(element));
    var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle(element).position) >= 0;
    var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
    if (!isElement(clipperElement)) {
      return [];
    }
    return clippingParents2.filter(function(clippingParent) {
      return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
    });
  }
  function getClippingRect(element, boundary, rootBoundary, strategy) {
    var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
    var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
    var firstClippingParent = clippingParents2[0];
    var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
      var rect = getClientRectFromMixedType(element, clippingParent, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromMixedType(element, firstClippingParent, strategy));
    clippingRect.width = clippingRect.right - clippingRect.left;
    clippingRect.height = clippingRect.bottom - clippingRect.top;
    clippingRect.x = clippingRect.left;
    clippingRect.y = clippingRect.top;
    return clippingRect;
  }

  // node_modules/@popperjs/core/lib/utils/computeOffsets.js
  function computeOffsets(_ref) {
    var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
    var basePlacement = placement ? getBasePlacement(placement) : null;
    var variation = placement ? getVariation(placement) : null;
    var commonX = reference2.x + reference2.width / 2 - element.width / 2;
    var commonY = reference2.y + reference2.height / 2 - element.height / 2;
    var offsets;
    switch (basePlacement) {
      case top:
        offsets = {
          x: commonX,
          y: reference2.y - element.height
        };
        break;
      case bottom:
        offsets = {
          x: commonX,
          y: reference2.y + reference2.height
        };
        break;
      case right:
        offsets = {
          x: reference2.x + reference2.width,
          y: commonY
        };
        break;
      case left:
        offsets = {
          x: reference2.x - element.width,
          y: commonY
        };
        break;
      default:
        offsets = {
          x: reference2.x,
          y: reference2.y
        };
    }
    var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
    if (mainAxis != null) {
      var len = mainAxis === "y" ? "height" : "width";
      switch (variation) {
        case start2:
          offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
          break;
        case end:
          offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
          break;
        default:
      }
    }
    return offsets;
  }

  // node_modules/@popperjs/core/lib/utils/detectOverflow.js
  function detectOverflow(state, options) {
    if (options === void 0) {
      options = {};
    }
    var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
    var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
    var altContext = elementContext === popper ? reference : popper;
    var popperRect = state.rects.popper;
    var element = state.elements[altBoundary ? altContext : elementContext];
    var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
    var referenceClientRect = getBoundingClientRect(state.elements.reference);
    var popperOffsets2 = computeOffsets({
      reference: referenceClientRect,
      element: popperRect,
      strategy: "absolute",
      placement
    });
    var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
    var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
    var overflowOffsets = {
      top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
      bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
      left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
      right: elementClientRect.right - clippingClientRect.right + paddingObject.right
    };
    var offsetData = state.modifiersData.offset;
    if (elementContext === popper && offsetData) {
      var offset2 = offsetData[placement];
      Object.keys(overflowOffsets).forEach(function(key) {
        var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
        var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
        overflowOffsets[key] += offset2[axis] * multiply;
      });
    }
    return overflowOffsets;
  }

  // node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js
  function computeAutoPlacement(state, options) {
    if (options === void 0) {
      options = {};
    }
    var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
    var variation = getVariation(placement);
    var placements2 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
      return getVariation(placement2) === variation;
    }) : basePlacements;
    var allowedPlacements = placements2.filter(function(placement2) {
      return allowedAutoPlacements.indexOf(placement2) >= 0;
    });
    if (allowedPlacements.length === 0) {
      allowedPlacements = placements2;
    }
    var overflows = allowedPlacements.reduce(function(acc, placement2) {
      acc[placement2] = detectOverflow(state, {
        placement: placement2,
        boundary,
        rootBoundary,
        padding
      })[getBasePlacement(placement2)];
      return acc;
    }, {});
    return Object.keys(overflows).sort(function(a, b) {
      return overflows[a] - overflows[b];
    });
  }

  // node_modules/@popperjs/core/lib/modifiers/flip.js
  function getExpandedFallbackPlacements(placement) {
    if (getBasePlacement(placement) === auto) {
      return [];
    }
    var oppositePlacement = getOppositePlacement(placement);
    return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
  }
  function flip(_ref) {
    var state = _ref.state, options = _ref.options, name = _ref.name;
    if (state.modifiersData[name]._skip) {
      return;
    }
    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
    var preferredPlacement = state.options.placement;
    var basePlacement = getBasePlacement(preferredPlacement);
    var isBasePlacement = basePlacement === preferredPlacement;
    var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
    var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
      return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
        placement: placement2,
        boundary,
        rootBoundary,
        padding,
        flipVariations,
        allowedAutoPlacements
      }) : placement2);
    }, []);
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var checksMap = /* @__PURE__ */ new Map();
    var makeFallbackChecks = true;
    var firstFittingPlacement = placements2[0];
    for (var i = 0; i < placements2.length; i++) {
      var placement = placements2[i];
      var _basePlacement = getBasePlacement(placement);
      var isStartVariation = getVariation(placement) === start2;
      var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
      var len = isVertical ? "width" : "height";
      var overflow = detectOverflow(state, {
        placement,
        boundary,
        rootBoundary,
        altBoundary,
        padding
      });
      var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
      if (referenceRect[len] > popperRect[len]) {
        mainVariationSide = getOppositePlacement(mainVariationSide);
      }
      var altVariationSide = getOppositePlacement(mainVariationSide);
      var checks = [];
      if (checkMainAxis) {
        checks.push(overflow[_basePlacement] <= 0);
      }
      if (checkAltAxis) {
        checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
      }
      if (checks.every(function(check) {
        return check;
      })) {
        firstFittingPlacement = placement;
        makeFallbackChecks = false;
        break;
      }
      checksMap.set(placement, checks);
    }
    if (makeFallbackChecks) {
      var numberOfChecks = flipVariations ? 3 : 1;
      var _loop = function _loop2(_i2) {
        var fittingPlacement = placements2.find(function(placement2) {
          var checks2 = checksMap.get(placement2);
          if (checks2) {
            return checks2.slice(0, _i2).every(function(check) {
              return check;
            });
          }
        });
        if (fittingPlacement) {
          firstFittingPlacement = fittingPlacement;
          return "break";
        }
      };
      for (var _i = numberOfChecks; _i > 0; _i--) {
        var _ret = _loop(_i);
        if (_ret === "break")
          break;
      }
    }
    if (state.placement !== firstFittingPlacement) {
      state.modifiersData[name]._skip = true;
      state.placement = firstFittingPlacement;
      state.reset = true;
    }
  }
  var flip_default = {
    name: "flip",
    enabled: true,
    phase: "main",
    fn: flip,
    requiresIfExists: ["offset"],
    data: {
      _skip: false
    }
  };

  // node_modules/@popperjs/core/lib/modifiers/hide.js
  function getSideOffsets(overflow, rect, preventedOffsets) {
    if (preventedOffsets === void 0) {
      preventedOffsets = {
        x: 0,
        y: 0
      };
    }
    return {
      top: overflow.top - rect.height - preventedOffsets.y,
      right: overflow.right - rect.width + preventedOffsets.x,
      bottom: overflow.bottom - rect.height + preventedOffsets.y,
      left: overflow.left - rect.width - preventedOffsets.x
    };
  }
  function isAnySideFullyClipped(overflow) {
    return [top, right, bottom, left].some(function(side) {
      return overflow[side] >= 0;
    });
  }
  function hide(_ref) {
    var state = _ref.state, name = _ref.name;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var preventedOffsets = state.modifiersData.preventOverflow;
    var referenceOverflow = detectOverflow(state, {
      elementContext: "reference"
    });
    var popperAltOverflow = detectOverflow(state, {
      altBoundary: true
    });
    var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
    var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
    var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
    var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
    state.modifiersData[name] = {
      referenceClippingOffsets,
      popperEscapeOffsets,
      isReferenceHidden,
      hasPopperEscaped
    };
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      "data-popper-reference-hidden": isReferenceHidden,
      "data-popper-escaped": hasPopperEscaped
    });
  }
  var hide_default = {
    name: "hide",
    enabled: true,
    phase: "main",
    requiresIfExists: ["preventOverflow"],
    fn: hide
  };

  // node_modules/@popperjs/core/lib/modifiers/offset.js
  function distanceAndSkiddingToXY(placement, rects, offset2) {
    var basePlacement = getBasePlacement(placement);
    var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
    var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
      placement
    })) : offset2, skidding = _ref[0], distance = _ref[1];
    skidding = skidding || 0;
    distance = (distance || 0) * invertDistance;
    return [left, right].indexOf(basePlacement) >= 0 ? {
      x: distance,
      y: skidding
    } : {
      x: skidding,
      y: distance
    };
  }
  function offset(_ref2) {
    var state = _ref2.state, options = _ref2.options, name = _ref2.name;
    var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
    var data = placements.reduce(function(acc, placement) {
      acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
      return acc;
    }, {});
    var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
    if (state.modifiersData.popperOffsets != null) {
      state.modifiersData.popperOffsets.x += x;
      state.modifiersData.popperOffsets.y += y;
    }
    state.modifiersData[name] = data;
  }
  var offset_default = {
    name: "offset",
    enabled: true,
    phase: "main",
    requires: ["popperOffsets"],
    fn: offset
  };

  // node_modules/@popperjs/core/lib/modifiers/popperOffsets.js
  function popperOffsets(_ref) {
    var state = _ref.state, name = _ref.name;
    state.modifiersData[name] = computeOffsets({
      reference: state.rects.reference,
      element: state.rects.popper,
      strategy: "absolute",
      placement: state.placement
    });
  }
  var popperOffsets_default = {
    name: "popperOffsets",
    enabled: true,
    phase: "read",
    fn: popperOffsets,
    data: {}
  };

  // node_modules/@popperjs/core/lib/utils/getAltAxis.js
  function getAltAxis(axis) {
    return axis === "x" ? "y" : "x";
  }

  // node_modules/@popperjs/core/lib/modifiers/preventOverflow.js
  function preventOverflow(_ref) {
    var state = _ref.state, options = _ref.options, name = _ref.name;
    var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
    var overflow = detectOverflow(state, {
      boundary,
      rootBoundary,
      padding,
      altBoundary
    });
    var basePlacement = getBasePlacement(state.placement);
    var variation = getVariation(state.placement);
    var isBasePlacement = !variation;
    var mainAxis = getMainAxisFromPlacement(basePlacement);
    var altAxis = getAltAxis(mainAxis);
    var popperOffsets2 = state.modifiersData.popperOffsets;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
      placement: state.placement
    })) : tetherOffset;
    var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
      mainAxis: tetherOffsetValue,
      altAxis: tetherOffsetValue
    } : Object.assign({
      mainAxis: 0,
      altAxis: 0
    }, tetherOffsetValue);
    var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
    var data = {
      x: 0,
      y: 0
    };
    if (!popperOffsets2) {
      return;
    }
    if (checkMainAxis) {
      var _offsetModifierState$;
      var mainSide = mainAxis === "y" ? top : left;
      var altSide = mainAxis === "y" ? bottom : right;
      var len = mainAxis === "y" ? "height" : "width";
      var offset2 = popperOffsets2[mainAxis];
      var min2 = offset2 + overflow[mainSide];
      var max2 = offset2 - overflow[altSide];
      var additive = tether ? -popperRect[len] / 2 : 0;
      var minLen = variation === start2 ? referenceRect[len] : popperRect[len];
      var maxLen = variation === start2 ? -popperRect[len] : -referenceRect[len];
      var arrowElement = state.elements.arrow;
      var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
        width: 0,
        height: 0
      };
      var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
      var arrowPaddingMin = arrowPaddingObject[mainSide];
      var arrowPaddingMax = arrowPaddingObject[altSide];
      var arrowLen = within(0, referenceRect[len], arrowRect[len]);
      var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
      var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
      var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
      var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
      var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
      var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
      var tetherMax = offset2 + maxOffset - offsetModifierValue;
      var preventedOffset = within(tether ? min(min2, tetherMin) : min2, offset2, tether ? max(max2, tetherMax) : max2);
      popperOffsets2[mainAxis] = preventedOffset;
      data[mainAxis] = preventedOffset - offset2;
    }
    if (checkAltAxis) {
      var _offsetModifierState$2;
      var _mainSide = mainAxis === "x" ? top : left;
      var _altSide = mainAxis === "x" ? bottom : right;
      var _offset = popperOffsets2[altAxis];
      var _len = altAxis === "y" ? "height" : "width";
      var _min = _offset + overflow[_mainSide];
      var _max = _offset - overflow[_altSide];
      var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
      var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
      var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
      var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
      var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
      popperOffsets2[altAxis] = _preventedOffset;
      data[altAxis] = _preventedOffset - _offset;
    }
    state.modifiersData[name] = data;
  }
  var preventOverflow_default = {
    name: "preventOverflow",
    enabled: true,
    phase: "main",
    fn: preventOverflow,
    requiresIfExists: ["offset"]
  };

  // node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js
  function getHTMLElementScroll(element) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }

  // node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js
  function getNodeScroll(node) {
    if (node === getWindow(node) || !isHTMLElement(node)) {
      return getWindowScroll(node);
    } else {
      return getHTMLElementScroll(node);
    }
  }

  // node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js
  function isElementScaled(element) {
    var rect = element.getBoundingClientRect();
    var scaleX = round(rect.width) / element.offsetWidth || 1;
    var scaleY = round(rect.height) / element.offsetHeight || 1;
    return scaleX !== 1 || scaleY !== 1;
  }
  function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    var isOffsetParentAnElement = isHTMLElement(offsetParent);
    var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
    var documentElement = getDocumentElement(offsetParent);
    var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
    var scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    var offsets = {
      x: 0,
      y: 0
    };
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
      isScrollParent(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isHTMLElement(offsetParent)) {
        offsets = getBoundingClientRect(offsetParent, true);
        offsets.x += offsetParent.clientLeft;
        offsets.y += offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }
    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    };
  }

  // node_modules/@popperjs/core/lib/utils/orderModifiers.js
  function order(modifiers) {
    var map = /* @__PURE__ */ new Map();
    var visited = /* @__PURE__ */ new Set();
    var result = [];
    modifiers.forEach(function(modifier) {
      map.set(modifier.name, modifier);
    });
    function sort(modifier) {
      visited.add(modifier.name);
      var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
      requires.forEach(function(dep) {
        if (!visited.has(dep)) {
          var depModifier = map.get(dep);
          if (depModifier) {
            sort(depModifier);
          }
        }
      });
      result.push(modifier);
    }
    modifiers.forEach(function(modifier) {
      if (!visited.has(modifier.name)) {
        sort(modifier);
      }
    });
    return result;
  }
  function orderModifiers(modifiers) {
    var orderedModifiers = order(modifiers);
    return modifierPhases.reduce(function(acc, phase) {
      return acc.concat(orderedModifiers.filter(function(modifier) {
        return modifier.phase === phase;
      }));
    }, []);
  }

  // node_modules/@popperjs/core/lib/utils/debounce.js
  function debounce(fn2) {
    var pending;
    return function() {
      if (!pending) {
        pending = new Promise(function(resolve) {
          Promise.resolve().then(function() {
            pending = void 0;
            resolve(fn2());
          });
        });
      }
      return pending;
    };
  }

  // node_modules/@popperjs/core/lib/utils/mergeByName.js
  function mergeByName(modifiers) {
    var merged = modifiers.reduce(function(merged2, current) {
      var existing = merged2[current.name];
      merged2[current.name] = existing ? Object.assign({}, existing, current, {
        options: Object.assign({}, existing.options, current.options),
        data: Object.assign({}, existing.data, current.data)
      }) : current;
      return merged2;
    }, {});
    return Object.keys(merged).map(function(key) {
      return merged[key];
    });
  }

  // node_modules/@popperjs/core/lib/createPopper.js
  var DEFAULT_OPTIONS = {
    placement: "bottom",
    modifiers: [],
    strategy: "absolute"
  };
  function areValidElements() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return !args.some(function(element) {
      return !(element && typeof element.getBoundingClientRect === "function");
    });
  }
  function popperGenerator(generatorOptions) {
    if (generatorOptions === void 0) {
      generatorOptions = {};
    }
    var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions2 = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
    return function createPopper2(reference2, popper2, options) {
      if (options === void 0) {
        options = defaultOptions2;
      }
      var state = {
        placement: "bottom",
        orderedModifiers: [],
        options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions2),
        modifiersData: {},
        elements: {
          reference: reference2,
          popper: popper2
        },
        attributes: {},
        styles: {}
      };
      var effectCleanupFns = [];
      var isDestroyed = false;
      var instance = {
        state,
        setOptions: function setOptions(setOptionsAction) {
          var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
          cleanupModifierEffects();
          state.options = Object.assign({}, defaultOptions2, state.options, options2);
          state.scrollParents = {
            reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
            popper: listScrollParents(popper2)
          };
          var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
          state.orderedModifiers = orderedModifiers.filter(function(m) {
            return m.enabled;
          });
          runModifierEffects();
          return instance.update();
        },
        // Sync update – it will always be executed, even if not necessary. This
        // is useful for low frequency updates where sync behavior simplifies the
        // logic.
        // For high frequency updates (e.g. `resize` and `scroll` events), always
        // prefer the async Popper#update method
        forceUpdate: function forceUpdate() {
          if (isDestroyed) {
            return;
          }
          var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
          if (!areValidElements(reference3, popper3)) {
            return;
          }
          state.rects = {
            reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
            popper: getLayoutRect(popper3)
          };
          state.reset = false;
          state.placement = state.options.placement;
          state.orderedModifiers.forEach(function(modifier) {
            return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
          });
          for (var index = 0; index < state.orderedModifiers.length; index++) {
            if (state.reset === true) {
              state.reset = false;
              index = -1;
              continue;
            }
            var _state$orderedModifie = state.orderedModifiers[index], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
            if (typeof fn2 === "function") {
              state = fn2({
                state,
                options: _options,
                name,
                instance
              }) || state;
            }
          }
        },
        // Async and optimistically optimized update – it will not be executed if
        // not necessary (debounced to run at most once-per-tick)
        update: debounce(function() {
          return new Promise(function(resolve) {
            instance.forceUpdate();
            resolve(state);
          });
        }),
        destroy: function destroy() {
          cleanupModifierEffects();
          isDestroyed = true;
        }
      };
      if (!areValidElements(reference2, popper2)) {
        return instance;
      }
      instance.setOptions(options).then(function(state2) {
        if (!isDestroyed && options.onFirstUpdate) {
          options.onFirstUpdate(state2);
        }
      });
      function runModifierEffects() {
        state.orderedModifiers.forEach(function(_ref) {
          var name = _ref.name, _ref$options = _ref.options, options2 = _ref$options === void 0 ? {} : _ref$options, effect4 = _ref.effect;
          if (typeof effect4 === "function") {
            var cleanupFn = effect4({
              state,
              name,
              instance,
              options: options2
            });
            var noopFn = function noopFn2() {
            };
            effectCleanupFns.push(cleanupFn || noopFn);
          }
        });
      }
      function cleanupModifierEffects() {
        effectCleanupFns.forEach(function(fn2) {
          return fn2();
        });
        effectCleanupFns = [];
      }
      return instance;
    };
  }

  // node_modules/@popperjs/core/lib/popper.js
  var defaultModifiers = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default, offset_default, flip_default, preventOverflow_default, arrow_default, hide_default];
  var createPopper = /* @__PURE__ */ popperGenerator({
    defaultModifiers
  });

  // node_modules/flowbite/lib/esm/components/dropdown/index.js
  var __assign5 = function() {
    __assign5 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign5.apply(this, arguments);
  };
  var __spreadArray = function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var Default5 = {
    placement: "bottom",
    triggerType: "click",
    offsetSkidding: 0,
    offsetDistance: 10,
    delay: 300,
    ignoreClickOutsideClass: false,
    onShow: function() {
    },
    onHide: function() {
    },
    onToggle: function() {
    }
  };
  var Dropdown = (
    /** @class */
    function() {
      function Dropdown2(targetElement, triggerElement, options) {
        if (targetElement === void 0) {
          targetElement = null;
        }
        if (triggerElement === void 0) {
          triggerElement = null;
        }
        if (options === void 0) {
          options = Default5;
        }
        this._targetEl = targetElement;
        this._triggerEl = triggerElement;
        this._options = __assign5(__assign5({}, Default5), options);
        this._popperInstance = this._createPopperInstance();
        this._visible = false;
        this._init();
      }
      Dropdown2.prototype._init = function() {
        if (this._triggerEl) {
          this._setupEventListeners();
        }
      };
      Dropdown2.prototype._setupEventListeners = function() {
        var _this = this;
        var triggerEvents = this._getTriggerEvents();
        if (this._options.triggerType === "click") {
          triggerEvents.showEvents.forEach(function(ev) {
            _this._triggerEl.addEventListener(ev, function() {
              _this.toggle();
            });
          });
        }
        if (this._options.triggerType === "hover") {
          triggerEvents.showEvents.forEach(function(ev) {
            _this._triggerEl.addEventListener(ev, function() {
              if (ev === "click") {
                _this.toggle();
              } else {
                setTimeout(function() {
                  _this.show();
                }, _this._options.delay);
              }
            });
            _this._targetEl.addEventListener(ev, function() {
              _this.show();
            });
          });
          triggerEvents.hideEvents.forEach(function(ev) {
            _this._triggerEl.addEventListener(ev, function() {
              setTimeout(function() {
                if (!_this._targetEl.matches(":hover")) {
                  _this.hide();
                }
              }, _this._options.delay);
            });
            _this._targetEl.addEventListener(ev, function() {
              setTimeout(function() {
                if (!_this._triggerEl.matches(":hover")) {
                  _this.hide();
                }
              }, _this._options.delay);
            });
          });
        }
      };
      Dropdown2.prototype._createPopperInstance = function() {
        return createPopper(this._triggerEl, this._targetEl, {
          placement: this._options.placement,
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [
                  this._options.offsetSkidding,
                  this._options.offsetDistance
                ]
              }
            }
          ]
        });
      };
      Dropdown2.prototype._setupClickOutsideListener = function() {
        var _this = this;
        this._clickOutsideEventListener = function(ev) {
          _this._handleClickOutside(ev, _this._targetEl);
        };
        document.body.addEventListener("click", this._clickOutsideEventListener, true);
      };
      Dropdown2.prototype._removeClickOutsideListener = function() {
        document.body.removeEventListener("click", this._clickOutsideEventListener, true);
      };
      Dropdown2.prototype._handleClickOutside = function(ev, targetEl) {
        var clickedEl = ev.target;
        var ignoreClickOutsideClass = this._options.ignoreClickOutsideClass;
        var isIgnored = false;
        if (ignoreClickOutsideClass) {
          var ignoredClickOutsideEls = document.querySelectorAll(".".concat(ignoreClickOutsideClass));
          ignoredClickOutsideEls.forEach(function(el) {
            if (el.contains(clickedEl)) {
              isIgnored = true;
              return;
            }
          });
        }
        if (clickedEl !== targetEl && !targetEl.contains(clickedEl) && !this._triggerEl.contains(clickedEl) && !isIgnored && this.isVisible()) {
          this.hide();
        }
      };
      Dropdown2.prototype._getTriggerEvents = function() {
        switch (this._options.triggerType) {
          case "hover":
            return {
              showEvents: ["mouseenter", "click"],
              hideEvents: ["mouseleave"]
            };
          case "click":
            return {
              showEvents: ["click"],
              hideEvents: []
            };
          case "none":
            return {
              showEvents: [],
              hideEvents: []
            };
          default:
            return {
              showEvents: ["click"],
              hideEvents: []
            };
        }
      };
      Dropdown2.prototype.toggle = function() {
        if (this.isVisible()) {
          this.hide();
        } else {
          this.show();
        }
        this._options.onToggle(this);
      };
      Dropdown2.prototype.isVisible = function() {
        return this._visible;
      };
      Dropdown2.prototype.show = function() {
        this._targetEl.classList.remove("hidden");
        this._targetEl.classList.add("block");
        this._popperInstance.setOptions(function(options) {
          return __assign5(__assign5({}, options), { modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [
            { name: "eventListeners", enabled: true }
          ], false) });
        });
        this._setupClickOutsideListener();
        this._popperInstance.update();
        this._visible = true;
        this._options.onShow(this);
      };
      Dropdown2.prototype.hide = function() {
        this._targetEl.classList.remove("block");
        this._targetEl.classList.add("hidden");
        this._popperInstance.setOptions(function(options) {
          return __assign5(__assign5({}, options), { modifiers: __spreadArray(__spreadArray([], options.modifiers, true), [
            { name: "eventListeners", enabled: false }
          ], false) });
        });
        this._visible = false;
        this._removeClickOutsideListener();
        this._options.onHide(this);
      };
      return Dropdown2;
    }()
  );
  function initDropdowns() {
    document.querySelectorAll("[data-dropdown-toggle]").forEach(function($triggerEl) {
      var dropdownId = $triggerEl.getAttribute("data-dropdown-toggle");
      var $dropdownEl = document.getElementById(dropdownId);
      if ($dropdownEl) {
        var placement = $triggerEl.getAttribute("data-dropdown-placement");
        var offsetSkidding = $triggerEl.getAttribute("data-dropdown-offset-skidding");
        var offsetDistance = $triggerEl.getAttribute("data-dropdown-offset-distance");
        var triggerType = $triggerEl.getAttribute("data-dropdown-trigger");
        var delay = $triggerEl.getAttribute("data-dropdown-delay");
        var ignoreClickOutsideClass = $triggerEl.getAttribute("data-dropdown-ignore-click-outside-class");
        new Dropdown($dropdownEl, $triggerEl, {
          placement: placement ? placement : Default5.placement,
          triggerType: triggerType ? triggerType : Default5.triggerType,
          offsetSkidding: offsetSkidding ? parseInt(offsetSkidding) : Default5.offsetSkidding,
          offsetDistance: offsetDistance ? parseInt(offsetDistance) : Default5.offsetDistance,
          delay: delay ? parseInt(delay) : Default5.delay,
          ignoreClickOutsideClass: ignoreClickOutsideClass ? ignoreClickOutsideClass : Default5.ignoreClickOutsideClass
        });
      } else {
        console.error('The dropdown element with id "'.concat(dropdownId, '" does not exist. Please check the data-dropdown-toggle attribute.'));
      }
    });
  }
  if (typeof window !== "undefined") {
    window.Dropdown = Dropdown;
    window.initDropdowns = initDropdowns;
  }

  // node_modules/flowbite/lib/esm/components/modal/index.js
  var __assign6 = function() {
    __assign6 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign6.apply(this, arguments);
  };
  var Default6 = {
    placement: "center",
    backdropClasses: "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40",
    backdrop: "dynamic",
    closable: true,
    onHide: function() {
    },
    onShow: function() {
    },
    onToggle: function() {
    }
  };
  var Modal = (
    /** @class */
    function() {
      function Modal2(targetEl, options) {
        if (targetEl === void 0) {
          targetEl = null;
        }
        if (options === void 0) {
          options = Default6;
        }
        this._targetEl = targetEl;
        this._options = __assign6(__assign6({}, Default6), options);
        this._isHidden = true;
        this._backdropEl = null;
        this._init();
      }
      Modal2.prototype._init = function() {
        var _this = this;
        if (this._targetEl) {
          this._getPlacementClasses().map(function(c) {
            _this._targetEl.classList.add(c);
          });
        }
      };
      Modal2.prototype._createBackdrop = function() {
        var _a;
        if (this._isHidden) {
          var backdropEl = document.createElement("div");
          backdropEl.setAttribute("modal-backdrop", "");
          (_a = backdropEl.classList).add.apply(_a, this._options.backdropClasses.split(" "));
          document.querySelector("body").append(backdropEl);
          this._backdropEl = backdropEl;
        }
      };
      Modal2.prototype._destroyBackdropEl = function() {
        if (!this._isHidden) {
          document.querySelector("[modal-backdrop]").remove();
        }
      };
      Modal2.prototype._setupModalCloseEventListeners = function() {
        var _this = this;
        if (this._options.backdrop === "dynamic") {
          this._clickOutsideEventListener = function(ev) {
            _this._handleOutsideClick(ev.target);
          };
          this._targetEl.addEventListener("click", this._clickOutsideEventListener, true);
        }
        this._keydownEventListener = function(ev) {
          if (ev.key === "Escape") {
            _this.hide();
          }
        };
        document.body.addEventListener("keydown", this._keydownEventListener, true);
      };
      Modal2.prototype._removeModalCloseEventListeners = function() {
        if (this._options.backdrop === "dynamic") {
          this._targetEl.removeEventListener("click", this._clickOutsideEventListener, true);
        }
        document.body.removeEventListener("keydown", this._keydownEventListener, true);
      };
      Modal2.prototype._handleOutsideClick = function(target) {
        if (target === this._targetEl || target === this._backdropEl && this.isVisible()) {
          this.hide();
        }
      };
      Modal2.prototype._getPlacementClasses = function() {
        switch (this._options.placement) {
          case "top-left":
            return ["justify-start", "items-start"];
          case "top-center":
            return ["justify-center", "items-start"];
          case "top-right":
            return ["justify-end", "items-start"];
          case "center-left":
            return ["justify-start", "items-center"];
          case "center":
            return ["justify-center", "items-center"];
          case "center-right":
            return ["justify-end", "items-center"];
          case "bottom-left":
            return ["justify-start", "items-end"];
          case "bottom-center":
            return ["justify-center", "items-end"];
          case "bottom-right":
            return ["justify-end", "items-end"];
          default:
            return ["justify-center", "items-center"];
        }
      };
      Modal2.prototype.toggle = function() {
        if (this._isHidden) {
          this.show();
        } else {
          this.hide();
        }
        this._options.onToggle(this);
      };
      Modal2.prototype.show = function() {
        if (this.isHidden) {
          this._targetEl.classList.add("flex");
          this._targetEl.classList.remove("hidden");
          this._targetEl.setAttribute("aria-modal", "true");
          this._targetEl.setAttribute("role", "dialog");
          this._targetEl.removeAttribute("aria-hidden");
          this._createBackdrop();
          this._isHidden = false;
          document.body.classList.add("overflow-hidden");
          if (this._options.closable) {
            this._setupModalCloseEventListeners();
          }
          this._options.onShow(this);
        }
      };
      Modal2.prototype.hide = function() {
        if (this.isVisible) {
          this._targetEl.classList.add("hidden");
          this._targetEl.classList.remove("flex");
          this._targetEl.setAttribute("aria-hidden", "true");
          this._targetEl.removeAttribute("aria-modal");
          this._targetEl.removeAttribute("role");
          this._destroyBackdropEl();
          this._isHidden = true;
          document.body.classList.remove("overflow-hidden");
          if (this._options.closable) {
            this._removeModalCloseEventListeners();
          }
          this._options.onHide(this);
        }
      };
      Modal2.prototype.isVisible = function() {
        return !this._isHidden;
      };
      Modal2.prototype.isHidden = function() {
        return this._isHidden;
      };
      return Modal2;
    }()
  );
  var getModalInstance = function(id, instances) {
    if (instances.some(function(modalInstance) {
      return modalInstance.id === id;
    })) {
      return instances.find(function(modalInstance) {
        return modalInstance.id === id;
      });
    }
    return null;
  };
  function initModals() {
    var modalInstances = [];
    document.querySelectorAll("[data-modal-target]").forEach(function($triggerEl) {
      var modalId = $triggerEl.getAttribute("data-modal-target");
      var $modalEl = document.getElementById(modalId);
      if ($modalEl) {
        var placement = $modalEl.getAttribute("data-modal-placement");
        var backdrop = $modalEl.getAttribute("data-modal-backdrop");
        if (!getModalInstance(modalId, modalInstances)) {
          modalInstances.push({
            id: modalId,
            object: new Modal($modalEl, {
              placement: placement ? placement : Default6.placement,
              backdrop: backdrop ? backdrop : Default6.backdrop
            })
          });
        }
      } else {
        console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-target attribute points to the correct modal id?."));
      }
    });
    document.querySelectorAll("[data-modal-toggle]").forEach(function($triggerEl) {
      var modalId = $triggerEl.getAttribute("data-modal-toggle");
      var $modalEl = document.getElementById(modalId);
      if ($modalEl) {
        var placement = $modalEl.getAttribute("data-modal-placement");
        var backdrop = $modalEl.getAttribute("data-modal-backdrop");
        var modal_1 = getModalInstance(modalId, modalInstances);
        if (!modal_1) {
          modal_1 = {
            id: modalId,
            object: new Modal($modalEl, {
              placement: placement ? placement : Default6.placement,
              backdrop: backdrop ? backdrop : Default6.backdrop
            })
          };
          modalInstances.push(modal_1);
        }
        $triggerEl.addEventListener("click", function() {
          modal_1.object.toggle();
        });
      } else {
        console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-toggle attribute points to the correct modal id?"));
      }
    });
    document.querySelectorAll("[data-modal-show]").forEach(function($triggerEl) {
      var modalId = $triggerEl.getAttribute("data-modal-show");
      var $modalEl = document.getElementById(modalId);
      if ($modalEl) {
        var modal_2 = getModalInstance(modalId, modalInstances);
        if (modal_2) {
          $triggerEl.addEventListener("click", function() {
            if (modal_2.object.isHidden) {
              modal_2.object.show();
            }
          });
        } else {
          console.error("Modal with id ".concat(modalId, " has not been initialized. Please initialize it using the data-modal-target attribute."));
        }
      } else {
        console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-show attribute points to the correct modal id?"));
      }
    });
    document.querySelectorAll("[data-modal-hide]").forEach(function($triggerEl) {
      var modalId = $triggerEl.getAttribute("data-modal-hide");
      var $modalEl = document.getElementById(modalId);
      if ($modalEl) {
        var modal_3 = getModalInstance(modalId, modalInstances);
        if (modal_3) {
          $triggerEl.addEventListener("click", function() {
            if (modal_3.object.isVisible) {
              modal_3.object.hide();
            }
          });
        } else {
          console.error("Modal with id ".concat(modalId, " has not been initialized. Please initialize it using the data-modal-target attribute."));
        }
      } else {
        console.error("Modal with id ".concat(modalId, " does not exist. Are you sure that the data-modal-hide attribute points to the correct modal id?"));
      }
    });
  }
  if (typeof window !== "undefined") {
    window.Modal = Modal;
    window.initModals = initModals;
  }

  // node_modules/flowbite/lib/esm/components/drawer/index.js
  var __assign7 = function() {
    __assign7 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign7.apply(this, arguments);
  };
  var Default7 = {
    placement: "left",
    bodyScrolling: false,
    backdrop: true,
    edge: false,
    edgeOffset: "bottom-[60px]",
    backdropClasses: "bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-30",
    onShow: function() {
    },
    onHide: function() {
    },
    onToggle: function() {
    }
  };
  var Drawer = (
    /** @class */
    function() {
      function Drawer2(targetEl, options) {
        if (targetEl === void 0) {
          targetEl = null;
        }
        if (options === void 0) {
          options = Default7;
        }
        this._targetEl = targetEl;
        this._options = __assign7(__assign7({}, Default7), options);
        this._visible = false;
        this._init();
      }
      Drawer2.prototype._init = function() {
        var _this = this;
        if (this._targetEl) {
          this._targetEl.setAttribute("aria-hidden", "true");
          this._targetEl.classList.add("transition-transform");
        }
        this._getPlacementClasses(this._options.placement).base.map(function(c) {
          _this._targetEl.classList.add(c);
        });
        document.addEventListener("keydown", function(event) {
          if (event.key === "Escape") {
            if (_this.isVisible()) {
              _this.hide();
            }
          }
        });
      };
      Drawer2.prototype.hide = function() {
        var _this = this;
        if (this._options.edge) {
          this._getPlacementClasses(this._options.placement + "-edge").active.map(function(c) {
            _this._targetEl.classList.remove(c);
          });
          this._getPlacementClasses(this._options.placement + "-edge").inactive.map(function(c) {
            _this._targetEl.classList.add(c);
          });
        } else {
          this._getPlacementClasses(this._options.placement).active.map(function(c) {
            _this._targetEl.classList.remove(c);
          });
          this._getPlacementClasses(this._options.placement).inactive.map(function(c) {
            _this._targetEl.classList.add(c);
          });
        }
        this._targetEl.setAttribute("aria-hidden", "true");
        this._targetEl.removeAttribute("aria-modal");
        this._targetEl.removeAttribute("role");
        if (!this._options.bodyScrolling) {
          document.body.classList.remove("overflow-hidden");
        }
        if (this._options.backdrop) {
          this._destroyBackdropEl();
        }
        this._visible = false;
        this._options.onHide(this);
      };
      Drawer2.prototype.show = function() {
        var _this = this;
        if (this._options.edge) {
          this._getPlacementClasses(this._options.placement + "-edge").active.map(function(c) {
            _this._targetEl.classList.add(c);
          });
          this._getPlacementClasses(this._options.placement + "-edge").inactive.map(function(c) {
            _this._targetEl.classList.remove(c);
          });
        } else {
          this._getPlacementClasses(this._options.placement).active.map(function(c) {
            _this._targetEl.classList.add(c);
          });
          this._getPlacementClasses(this._options.placement).inactive.map(function(c) {
            _this._targetEl.classList.remove(c);
          });
        }
        this._targetEl.setAttribute("aria-modal", "true");
        this._targetEl.setAttribute("role", "dialog");
        this._targetEl.removeAttribute("aria-hidden");
        if (!this._options.bodyScrolling) {
          document.body.classList.add("overflow-hidden");
        }
        if (this._options.backdrop) {
          this._createBackdrop();
        }
        this._visible = true;
        this._options.onShow(this);
      };
      Drawer2.prototype.toggle = function() {
        if (this.isVisible()) {
          this.hide();
        } else {
          this.show();
        }
      };
      Drawer2.prototype._createBackdrop = function() {
        var _a;
        var _this = this;
        if (!this._visible) {
          var backdropEl = document.createElement("div");
          backdropEl.setAttribute("drawer-backdrop", "");
          (_a = backdropEl.classList).add.apply(_a, this._options.backdropClasses.split(" "));
          document.querySelector("body").append(backdropEl);
          backdropEl.addEventListener("click", function() {
            _this.hide();
          });
        }
      };
      Drawer2.prototype._destroyBackdropEl = function() {
        if (this._visible) {
          document.querySelector("[drawer-backdrop]").remove();
        }
      };
      Drawer2.prototype._getPlacementClasses = function(placement) {
        switch (placement) {
          case "top":
            return {
              base: ["top-0", "left-0", "right-0"],
              active: ["transform-none"],
              inactive: ["-translate-y-full"]
            };
          case "right":
            return {
              base: ["right-0", "top-0"],
              active: ["transform-none"],
              inactive: ["translate-x-full"]
            };
          case "bottom":
            return {
              base: ["bottom-0", "left-0", "right-0"],
              active: ["transform-none"],
              inactive: ["translate-y-full"]
            };
          case "left":
            return {
              base: ["left-0", "top-0"],
              active: ["transform-none"],
              inactive: ["-translate-x-full"]
            };
          case "bottom-edge":
            return {
              base: ["left-0", "top-0"],
              active: ["transform-none"],
              inactive: ["translate-y-full", this._options.edgeOffset]
            };
          default:
            return {
              base: ["left-0", "top-0"],
              active: ["transform-none"],
              inactive: ["-translate-x-full"]
            };
        }
      };
      Drawer2.prototype.isHidden = function() {
        return !this._visible;
      };
      Drawer2.prototype.isVisible = function() {
        return this._visible;
      };
      return Drawer2;
    }()
  );
  var getDrawerInstance = function(id, instances) {
    if (instances.some(function(drawerInstance) {
      return drawerInstance.id === id;
    })) {
      return instances.find(function(drawerInstance) {
        return drawerInstance.id === id;
      });
    }
  };
  function initDrawers() {
    var drawerInstances = [];
    document.querySelectorAll("[data-drawer-target]").forEach(function($triggerEl) {
      var drawerId = $triggerEl.getAttribute("data-drawer-target");
      var $drawerEl = document.getElementById(drawerId);
      if ($drawerEl) {
        var placement = $triggerEl.getAttribute("data-drawer-placement");
        var bodyScrolling = $triggerEl.getAttribute("data-drawer-body-scrolling");
        var backdrop = $triggerEl.getAttribute("data-drawer-backdrop");
        var edge = $triggerEl.getAttribute("data-drawer-edge");
        var edgeOffset = $triggerEl.getAttribute("data-drawer-edge-offset");
        if (!getDrawerInstance(drawerId, drawerInstances)) {
          drawerInstances.push({
            id: drawerId,
            object: new Drawer($drawerEl, {
              placement: placement ? placement : Default7.placement,
              bodyScrolling: bodyScrolling ? bodyScrolling === "true" ? true : false : Default7.bodyScrolling,
              backdrop: backdrop ? backdrop === "true" ? true : false : Default7.backdrop,
              edge: edge ? edge === "true" ? true : false : Default7.edge,
              edgeOffset: edgeOffset ? edgeOffset : Default7.edgeOffset
            })
          });
        }
      } else {
        console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
      }
    });
    document.querySelectorAll("[data-drawer-toggle]").forEach(function($triggerEl) {
      var drawerId = $triggerEl.getAttribute("data-drawer-toggle");
      var $drawerEl = document.getElementById(drawerId);
      if ($drawerEl) {
        var drawer_1 = getDrawerInstance(drawerId, drawerInstances);
        if (drawer_1) {
          $triggerEl.addEventListener("click", function() {
            drawer_1.object.toggle();
          });
        } else {
          console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
        }
      } else {
        console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
      }
    });
    document.querySelectorAll("[data-drawer-dismiss], [data-drawer-hide]").forEach(function($triggerEl) {
      var drawerId = $triggerEl.getAttribute("data-drawer-dismiss") ? $triggerEl.getAttribute("data-drawer-dismiss") : $triggerEl.getAttribute("data-drawer-hide");
      var $drawerEl = document.getElementById(drawerId);
      if ($drawerEl) {
        var drawer_2 = getDrawerInstance(drawerId, drawerInstances);
        if (drawer_2) {
          $triggerEl.addEventListener("click", function() {
            drawer_2.object.hide();
          });
        } else {
          console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
        }
      } else {
        console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id"));
      }
    });
    document.querySelectorAll("[data-drawer-show]").forEach(function($triggerEl) {
      var drawerId = $triggerEl.getAttribute("data-drawer-show");
      var $drawerEl = document.getElementById(drawerId);
      if ($drawerEl) {
        var drawer_3 = getDrawerInstance(drawerId, drawerInstances);
        if (drawer_3) {
          $triggerEl.addEventListener("click", function() {
            drawer_3.object.show();
          });
        } else {
          console.error("Drawer with id ".concat(drawerId, " has not been initialized. Please initialize it using the data-drawer-target attribute."));
        }
      } else {
        console.error("Drawer with id ".concat(drawerId, " not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"));
      }
    });
  }
  if (typeof window !== "undefined") {
    window.Drawer = Drawer;
    window.initDrawers = initDrawers;
  }

  // node_modules/flowbite/lib/esm/components/tabs/index.js
  var __assign8 = function() {
    __assign8 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign8.apply(this, arguments);
  };
  var Default8 = {
    defaultTabId: null,
    activeClasses: "text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-500 border-blue-600 dark:border-blue-500",
    inactiveClasses: "dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300",
    onShow: function() {
    }
  };
  var Tabs = (
    /** @class */
    function() {
      function Tabs2(items, options) {
        if (items === void 0) {
          items = [];
        }
        if (options === void 0) {
          options = Default8;
        }
        this._items = items;
        this._activeTab = options ? this.getTab(options.defaultTabId) : null;
        this._options = __assign8(__assign8({}, Default8), options);
        this._init();
      }
      Tabs2.prototype._init = function() {
        var _this = this;
        if (this._items.length) {
          if (!this._activeTab) {
            this._setActiveTab(this._items[0]);
          }
          this.show(this._activeTab.id, true);
          this._items.map(function(tab) {
            tab.triggerEl.addEventListener("click", function() {
              _this.show(tab.id);
            });
          });
        }
      };
      Tabs2.prototype.getActiveTab = function() {
        return this._activeTab;
      };
      Tabs2.prototype._setActiveTab = function(tab) {
        this._activeTab = tab;
      };
      Tabs2.prototype.getTab = function(id) {
        return this._items.filter(function(t) {
          return t.id === id;
        })[0];
      };
      Tabs2.prototype.show = function(id, forceShow) {
        var _a, _b;
        var _this = this;
        if (forceShow === void 0) {
          forceShow = false;
        }
        var tab = this.getTab(id);
        if (tab === this._activeTab && !forceShow) {
          return;
        }
        this._items.map(function(t) {
          var _a2, _b2;
          if (t !== tab) {
            (_a2 = t.triggerEl.classList).remove.apply(_a2, _this._options.activeClasses.split(" "));
            (_b2 = t.triggerEl.classList).add.apply(_b2, _this._options.inactiveClasses.split(" "));
            t.targetEl.classList.add("hidden");
            t.triggerEl.setAttribute("aria-selected", "false");
          }
        });
        (_a = tab.triggerEl.classList).add.apply(_a, this._options.activeClasses.split(" "));
        (_b = tab.triggerEl.classList).remove.apply(_b, this._options.inactiveClasses.split(" "));
        tab.triggerEl.setAttribute("aria-selected", "true");
        tab.targetEl.classList.remove("hidden");
        this._setActiveTab(tab);
        this._options.onShow(this, tab);
      };
      return Tabs2;
    }()
  );
  function initTabs() {
    document.querySelectorAll("[data-tabs-toggle]").forEach(function($triggerEl) {
      var tabItems = [];
      var defaultTabId = null;
      $triggerEl.querySelectorAll('[role="tab"]').forEach(function($triggerEl2) {
        var isActive = $triggerEl2.getAttribute("aria-selected") === "true";
        var tab = {
          id: $triggerEl2.getAttribute("data-tabs-target"),
          triggerEl: $triggerEl2,
          targetEl: document.querySelector($triggerEl2.getAttribute("data-tabs-target"))
        };
        tabItems.push(tab);
        if (isActive) {
          defaultTabId = tab.id;
        }
      });
      new Tabs(tabItems, {
        defaultTabId
      });
    });
  }
  if (typeof window !== "undefined") {
    window.Tabs = Tabs;
    window.initTabs = initTabs;
  }

  // node_modules/flowbite/lib/esm/components/tooltip/index.js
  var __assign9 = function() {
    __assign9 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign9.apply(this, arguments);
  };
  var __spreadArray2 = function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var Default9 = {
    placement: "top",
    triggerType: "hover",
    onShow: function() {
    },
    onHide: function() {
    },
    onToggle: function() {
    }
  };
  var Tooltip = (
    /** @class */
    function() {
      function Tooltip2(targetEl, triggerEl, options) {
        if (targetEl === void 0) {
          targetEl = null;
        }
        if (triggerEl === void 0) {
          triggerEl = null;
        }
        if (options === void 0) {
          options = Default9;
        }
        this._targetEl = targetEl;
        this._triggerEl = triggerEl;
        this._options = __assign9(__assign9({}, Default9), options);
        this._popperInstance = this._createPopperInstance();
        this._visible = false;
        this._init();
      }
      Tooltip2.prototype._init = function() {
        if (this._triggerEl) {
          this._setupEventListeners();
        }
      };
      Tooltip2.prototype._setupEventListeners = function() {
        var _this = this;
        var triggerEvents = this._getTriggerEvents();
        triggerEvents.showEvents.forEach(function(ev) {
          _this._triggerEl.addEventListener(ev, function() {
            _this.show();
          });
        });
        triggerEvents.hideEvents.forEach(function(ev) {
          _this._triggerEl.addEventListener(ev, function() {
            _this.hide();
          });
        });
      };
      Tooltip2.prototype._createPopperInstance = function() {
        return createPopper(this._triggerEl, this._targetEl, {
          placement: this._options.placement,
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 8]
              }
            }
          ]
        });
      };
      Tooltip2.prototype._getTriggerEvents = function() {
        switch (this._options.triggerType) {
          case "hover":
            return {
              showEvents: ["mouseenter", "focus"],
              hideEvents: ["mouseleave", "blur"]
            };
          case "click":
            return {
              showEvents: ["click", "focus"],
              hideEvents: ["focusout", "blur"]
            };
          case "none":
            return {
              showEvents: [],
              hideEvents: []
            };
          default:
            return {
              showEvents: ["mouseenter", "focus"],
              hideEvents: ["mouseleave", "blur"]
            };
        }
      };
      Tooltip2.prototype._setupKeydownListener = function() {
        var _this = this;
        this._keydownEventListener = function(ev) {
          if (ev.key === "Escape") {
            _this.hide();
          }
        };
        document.body.addEventListener("keydown", this._keydownEventListener, true);
      };
      Tooltip2.prototype._removeKeydownListener = function() {
        document.body.removeEventListener("keydown", this._keydownEventListener, true);
      };
      Tooltip2.prototype._setupClickOutsideListener = function() {
        var _this = this;
        this._clickOutsideEventListener = function(ev) {
          _this._handleClickOutside(ev, _this._targetEl);
        };
        document.body.addEventListener("click", this._clickOutsideEventListener, true);
      };
      Tooltip2.prototype._removeClickOutsideListener = function() {
        document.body.removeEventListener("click", this._clickOutsideEventListener, true);
      };
      Tooltip2.prototype._handleClickOutside = function(ev, targetEl) {
        var clickedEl = ev.target;
        if (clickedEl !== targetEl && !targetEl.contains(clickedEl) && !this._triggerEl.contains(clickedEl) && this.isVisible()) {
          this.hide();
        }
      };
      Tooltip2.prototype.isVisible = function() {
        return this._visible;
      };
      Tooltip2.prototype.toggle = function() {
        if (this.isVisible()) {
          this.hide();
        } else {
          this.show();
        }
      };
      Tooltip2.prototype.show = function() {
        this._targetEl.classList.remove("opacity-0", "invisible");
        this._targetEl.classList.add("opacity-100", "visible");
        this._popperInstance.setOptions(function(options) {
          return __assign9(__assign9({}, options), { modifiers: __spreadArray2(__spreadArray2([], options.modifiers, true), [
            { name: "eventListeners", enabled: true }
          ], false) });
        });
        this._setupClickOutsideListener();
        this._setupKeydownListener();
        this._popperInstance.update();
        this._visible = true;
        this._options.onShow(this);
      };
      Tooltip2.prototype.hide = function() {
        this._targetEl.classList.remove("opacity-100", "visible");
        this._targetEl.classList.add("opacity-0", "invisible");
        this._popperInstance.setOptions(function(options) {
          return __assign9(__assign9({}, options), { modifiers: __spreadArray2(__spreadArray2([], options.modifiers, true), [
            { name: "eventListeners", enabled: false }
          ], false) });
        });
        this._removeClickOutsideListener();
        this._removeKeydownListener();
        this._visible = false;
        this._options.onHide(this);
      };
      return Tooltip2;
    }()
  );
  function initTooltips() {
    document.querySelectorAll("[data-tooltip-target]").forEach(function($triggerEl) {
      var tooltipId = $triggerEl.getAttribute("data-tooltip-target");
      var $tooltipEl = document.getElementById(tooltipId);
      if ($tooltipEl) {
        var triggerType = $triggerEl.getAttribute("data-tooltip-trigger");
        var placement = $triggerEl.getAttribute("data-tooltip-placement");
        new Tooltip($tooltipEl, $triggerEl, {
          placement: placement ? placement : Default9.placement,
          triggerType: triggerType ? triggerType : Default9.triggerType
        });
      } else {
        console.error('The tooltip element with id "'.concat(tooltipId, '" does not exist. Please check the data-tooltip-target attribute.'));
      }
    });
  }
  if (typeof window !== "undefined") {
    window.Tooltip = Tooltip;
    window.initTooltips = initTooltips;
  }

  // node_modules/flowbite/lib/esm/components/popover/index.js
  var __assign10 = function() {
    __assign10 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign10.apply(this, arguments);
  };
  var __spreadArray3 = function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var Default10 = {
    placement: "top",
    offset: 10,
    triggerType: "hover",
    onShow: function() {
    },
    onHide: function() {
    },
    onToggle: function() {
    }
  };
  var Popover = (
    /** @class */
    function() {
      function Popover2(targetEl, triggerEl, options) {
        if (targetEl === void 0) {
          targetEl = null;
        }
        if (triggerEl === void 0) {
          triggerEl = null;
        }
        if (options === void 0) {
          options = Default10;
        }
        this._targetEl = targetEl;
        this._triggerEl = triggerEl;
        this._options = __assign10(__assign10({}, Default10), options);
        this._popperInstance = this._createPopperInstance();
        this._visible = false;
        this._init();
      }
      Popover2.prototype._init = function() {
        if (this._triggerEl) {
          this._setupEventListeners();
        }
      };
      Popover2.prototype._setupEventListeners = function() {
        var _this = this;
        var triggerEvents = this._getTriggerEvents();
        triggerEvents.showEvents.forEach(function(ev) {
          _this._triggerEl.addEventListener(ev, function() {
            _this.show();
          });
          _this._targetEl.addEventListener(ev, function() {
            _this.show();
          });
        });
        triggerEvents.hideEvents.forEach(function(ev) {
          _this._triggerEl.addEventListener(ev, function() {
            setTimeout(function() {
              if (!_this._targetEl.matches(":hover")) {
                _this.hide();
              }
            }, 100);
          });
          _this._targetEl.addEventListener(ev, function() {
            setTimeout(function() {
              if (!_this._triggerEl.matches(":hover")) {
                _this.hide();
              }
            }, 100);
          });
        });
      };
      Popover2.prototype._createPopperInstance = function() {
        return createPopper(this._triggerEl, this._targetEl, {
          placement: this._options.placement,
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, this._options.offset]
              }
            }
          ]
        });
      };
      Popover2.prototype._getTriggerEvents = function() {
        switch (this._options.triggerType) {
          case "hover":
            return {
              showEvents: ["mouseenter", "focus"],
              hideEvents: ["mouseleave", "blur"]
            };
          case "click":
            return {
              showEvents: ["click", "focus"],
              hideEvents: ["focusout", "blur"]
            };
          case "none":
            return {
              showEvents: [],
              hideEvents: []
            };
          default:
            return {
              showEvents: ["mouseenter", "focus"],
              hideEvents: ["mouseleave", "blur"]
            };
        }
      };
      Popover2.prototype._setupKeydownListener = function() {
        var _this = this;
        this._keydownEventListener = function(ev) {
          if (ev.key === "Escape") {
            _this.hide();
          }
        };
        document.body.addEventListener("keydown", this._keydownEventListener, true);
      };
      Popover2.prototype._removeKeydownListener = function() {
        document.body.removeEventListener("keydown", this._keydownEventListener, true);
      };
      Popover2.prototype._setupClickOutsideListener = function() {
        var _this = this;
        this._clickOutsideEventListener = function(ev) {
          _this._handleClickOutside(ev, _this._targetEl);
        };
        document.body.addEventListener("click", this._clickOutsideEventListener, true);
      };
      Popover2.prototype._removeClickOutsideListener = function() {
        document.body.removeEventListener("click", this._clickOutsideEventListener, true);
      };
      Popover2.prototype._handleClickOutside = function(ev, targetEl) {
        var clickedEl = ev.target;
        if (clickedEl !== targetEl && !targetEl.contains(clickedEl) && !this._triggerEl.contains(clickedEl) && this.isVisible()) {
          this.hide();
        }
      };
      Popover2.prototype.isVisible = function() {
        return this._visible;
      };
      Popover2.prototype.toggle = function() {
        if (this.isVisible()) {
          this.hide();
        } else {
          this.show();
        }
        this._options.onToggle(this);
      };
      Popover2.prototype.show = function() {
        this._targetEl.classList.remove("opacity-0", "invisible");
        this._targetEl.classList.add("opacity-100", "visible");
        this._popperInstance.setOptions(function(options) {
          return __assign10(__assign10({}, options), { modifiers: __spreadArray3(__spreadArray3([], options.modifiers, true), [
            { name: "eventListeners", enabled: true }
          ], false) });
        });
        this._setupClickOutsideListener();
        this._setupKeydownListener();
        this._popperInstance.update();
        this._visible = true;
        this._options.onShow(this);
      };
      Popover2.prototype.hide = function() {
        this._targetEl.classList.remove("opacity-100", "visible");
        this._targetEl.classList.add("opacity-0", "invisible");
        this._popperInstance.setOptions(function(options) {
          return __assign10(__assign10({}, options), { modifiers: __spreadArray3(__spreadArray3([], options.modifiers, true), [
            { name: "eventListeners", enabled: false }
          ], false) });
        });
        this._removeClickOutsideListener();
        this._removeKeydownListener();
        this._visible = false;
        this._options.onHide(this);
      };
      return Popover2;
    }()
  );
  function initPopovers() {
    document.querySelectorAll("[data-popover-target]").forEach(function($triggerEl) {
      var popoverID = $triggerEl.getAttribute("data-popover-target");
      var $popoverEl = document.getElementById(popoverID);
      if ($popoverEl) {
        var triggerType = $triggerEl.getAttribute("data-popover-trigger");
        var placement = $triggerEl.getAttribute("data-popover-placement");
        var offset2 = $triggerEl.getAttribute("data-popover-offset");
        new Popover($popoverEl, $triggerEl, {
          placement: placement ? placement : Default10.placement,
          offset: offset2 ? parseInt(offset2) : Default10.offset,
          triggerType: triggerType ? triggerType : Default10.triggerType
        });
      } else {
        console.error('The popover element with id "'.concat(popoverID, '" does not exist. Please check the data-popover-target attribute.'));
      }
    });
  }
  if (typeof window !== "undefined") {
    window.Popover = Popover;
    window.initPopovers = initPopovers;
  }

  // node_modules/flowbite/lib/esm/components/dial/index.js
  var __assign11 = function() {
    __assign11 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s)
          if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
      }
      return t;
    };
    return __assign11.apply(this, arguments);
  };
  var Default11 = {
    triggerType: "hover",
    onShow: function() {
    },
    onHide: function() {
    },
    onToggle: function() {
    }
  };
  var Dial = (
    /** @class */
    function() {
      function Dial2(parentEl, triggerEl, targetEl, options) {
        if (parentEl === void 0) {
          parentEl = null;
        }
        if (triggerEl === void 0) {
          triggerEl = null;
        }
        if (targetEl === void 0) {
          targetEl = null;
        }
        if (options === void 0) {
          options = Default11;
        }
        this._parentEl = parentEl;
        this._triggerEl = triggerEl;
        this._targetEl = targetEl;
        this._options = __assign11(__assign11({}, Default11), options);
        this._visible = false;
        this._init();
      }
      Dial2.prototype._init = function() {
        var _this = this;
        if (this._triggerEl) {
          var triggerEventTypes = this._getTriggerEventTypes(this._options.triggerType);
          triggerEventTypes.showEvents.forEach(function(ev) {
            _this._triggerEl.addEventListener(ev, function() {
              _this.show();
            });
            _this._targetEl.addEventListener(ev, function() {
              _this.show();
            });
          });
          triggerEventTypes.hideEvents.forEach(function(ev) {
            _this._parentEl.addEventListener(ev, function() {
              if (!_this._parentEl.matches(":hover")) {
                _this.hide();
              }
            });
          });
        }
      };
      Dial2.prototype.hide = function() {
        this._targetEl.classList.add("hidden");
        if (this._triggerEl) {
          this._triggerEl.setAttribute("aria-expanded", "false");
        }
        this._visible = false;
        this._options.onHide(this);
      };
      Dial2.prototype.show = function() {
        this._targetEl.classList.remove("hidden");
        if (this._triggerEl) {
          this._triggerEl.setAttribute("aria-expanded", "true");
        }
        this._visible = true;
        this._options.onShow(this);
      };
      Dial2.prototype.toggle = function() {
        if (this._visible) {
          this.hide();
        } else {
          this.show();
        }
      };
      Dial2.prototype.isHidden = function() {
        return !this._visible;
      };
      Dial2.prototype.isVisible = function() {
        return this._visible;
      };
      Dial2.prototype._getTriggerEventTypes = function(triggerType) {
        switch (triggerType) {
          case "hover":
            return {
              showEvents: ["mouseenter", "focus"],
              hideEvents: ["mouseleave", "blur"]
            };
          case "click":
            return {
              showEvents: ["click", "focus"],
              hideEvents: ["focusout", "blur"]
            };
          case "none":
            return {
              showEvents: [],
              hideEvents: []
            };
          default:
            return {
              showEvents: ["mouseenter", "focus"],
              hideEvents: ["mouseleave", "blur"]
            };
        }
      };
      return Dial2;
    }()
  );
  function initDials() {
    document.querySelectorAll("[data-dial-init]").forEach(function($parentEl) {
      var $triggerEl = $parentEl.querySelector("[data-dial-toggle]");
      if ($triggerEl) {
        var dialId = $triggerEl.getAttribute("data-dial-toggle");
        var $dialEl = document.getElementById(dialId);
        if ($dialEl) {
          var triggerType = $triggerEl.getAttribute("data-dial-trigger");
          new Dial($parentEl, $triggerEl, $dialEl, {
            triggerType: triggerType ? triggerType : Default11.triggerType
          });
        } else {
          console.error("Dial with id ".concat(dialId, " does not exist. Are you sure that the data-dial-toggle attribute points to the correct modal id?"));
        }
      } else {
        console.error("Dial with id ".concat($parentEl.id, " does not have a trigger element. Are you sure that the data-dial-toggle attribute exists?"));
      }
    });
  }
  if (typeof window !== "undefined") {
    window.Dial = Dial;
    window.initDials = initDials;
  }

  // node_modules/flowbite/lib/esm/components/index.js
  function initFlowbite() {
    initAccordions();
    initCollapses();
    initCarousels();
    initDismisses();
    initDropdowns();
    initModals();
    initDrawers();
    initTabs();
    initTooltips();
    initPopovers();
    initDials();
  }
  if (typeof window !== "undefined") {
    window.initFlowbite = initFlowbite;
  }

  // node_modules/flowbite/lib/esm/index.js
  var events = new events_default("load", [
    initAccordions,
    initCollapses,
    initCarousels,
    initDismisses,
    initDropdowns,
    initModals,
    initDrawers,
    initTabs,
    initTooltips,
    initPopovers,
    initDials
  ]);
  events.init();

  // app/javascript/application.js
  var import_flowbite_turbo = __toESM(require_flowbite_turbo());
  Turbo.session.drive = false;
})();
/*! Bundled license information:

jquery/dist/jquery.js:
  (*!
   * jQuery JavaScript Library v3.7.1
   * https://jquery.com/
   *
   * Copyright OpenJS Foundation and other contributors
   * Released under the MIT license
   * https://jquery.org/license
   *
   * Date: 2023-08-28T13:37Z
   *)

tom-select/dist/js/tom-select.complete.js:
  (*! @orchidjs/unicode-variants | https://github.com/orchidjs/unicode-variants | Apache License (v2) *)
  (*! sifter.js | https://github.com/orchidjs/sifter.js | Apache License (v2) *)
*/
;
