//line:4659 會call window.notice()
/*!
 * Socket.IO v4.4.0
 * (c) 2014-2021 Guillermo Rauch
 * Released under the MIT License.
 */
!(function(t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : ((t =
        "undefined" != typeof globalThis ? globalThis : t || self).io = e());
})(this, function() {
  "use strict";
  function t(e) {
    return (
      (t =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function(t) {
              return typeof t;
            }
          : function(t) {
              return t &&
                "function" == typeof Symbol &&
                t.constructor === Symbol &&
                t !== Symbol.prototype
                ? "symbol"
                : typeof t;
            }),
      t(e)
    );
  }
  function e(t, e) {
    if (!(t instanceof e))
      throw new TypeError("Cannot call a class as a function");
  }
  function n(t, e) {
    for (var n = 0; n < e.length; n++) {
      var r = e[n];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        "value" in r && (r.writable = !0),
        Object.defineProperty(t, r.key, r);
    }
  }
  function r(t, e, r) {
    return e && n(t.prototype, e), r && n(t, r), t;
  }
  function o() {
    return (
      (o =
        Object.assign ||
        function(t) {
          for (var e = 1; e < arguments.length; e++) {
            var n = arguments[e];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
          }
          return t;
        }),
      o.apply(this, arguments)
    );
  }
  function i(t, e) {
    if ("function" != typeof e && null !== e)
      throw new TypeError("Super expression must either be null or a function");
    (t.prototype = Object.create(e && e.prototype, {
      constructor: { value: t, writable: !0, configurable: !0 }
    })),
      e && a(t, e);
  }
  function s(t) {
    return (
      (s = Object.setPrototypeOf
        ? Object.getPrototypeOf
        : function(t) {
            return t.__proto__ || Object.getPrototypeOf(t);
          }),
      s(t)
    );
  }
  function a(t, e) {
    return (
      (a =
        Object.setPrototypeOf ||
        function(t, e) {
          return (t.__proto__ = e), t;
        }),
      a(t, e)
    );
  }
  function c(t) {
    if (void 0 === t)
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called"
      );
    return t;
  }
  function u(t, e) {
    if (e && ("object" == typeof e || "function" == typeof e)) return e;
    if (void 0 !== e)
      throw new TypeError(
        "Derived constructors may only return object or undefined"
      );
    return c(t);
  }
  function h(t) {
    var e = (function() {
      if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
      if (Reflect.construct.sham) return !1;
      if ("function" == typeof Proxy) return !0;
      try {
        return (
          Boolean.prototype.valueOf.call(
            Reflect.construct(Boolean, [], function() {})
          ),
          !0
        );
      } catch (t) {
        return !1;
      }
    })();
    return function() {
      var n,
        r = s(t);
      if (e) {
        var o = s(this).constructor;
        n = Reflect.construct(r, arguments, o);
      } else n = r.apply(this, arguments);
      return u(this, n);
    };
  }
  function f(t, e, n) {
    return (
      (f =
        "undefined" != typeof Reflect && Reflect.get
          ? Reflect.get
          : function(t, e, n) {
              var r = (function(t, e) {
                for (
                  ;
                  !Object.prototype.hasOwnProperty.call(t, e) &&
                  null !== (t = s(t));

                );
                return t;
              })(t, e);
              if (r) {
                var o = Object.getOwnPropertyDescriptor(r, e);
                return o.get ? o.get.call(n) : o.value;
              }
            }),
      f(t, e, n || t)
    );
  }
  function l(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
    return r;
  }
  function p(t, e) {
    var n =
      ("undefined" != typeof Symbol && t[Symbol.iterator]) || t["@@iterator"];
    if (!n) {
      if (
        Array.isArray(t) ||
        (n = (function(t, e) {
          if (t) {
            if ("string" == typeof t) return l(t, e);
            var n = Object.prototype.toString.call(t).slice(8, -1);
            return (
              "Object" === n && t.constructor && (n = t.constructor.name),
              "Map" === n || "Set" === n
                ? Array.from(t)
                : "Arguments" === n ||
                  /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                ? l(t, e)
                : void 0
            );
          }
        })(t)) ||
        (e && t && "number" == typeof t.length)
      ) {
        n && (t = n);
        var r = 0,
          o = function() {};
        return {
          s: o,
          n: function() {
            return r >= t.length ? { done: !0 } : { done: !1, value: t[r++] };
          },
          e: function(t) {
            throw t;
          },
          f: o
        };
      }
      throw new TypeError(
        "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
      );
    }
    var i,
      s = !0,
      a = !1;
    return {
      s: function() {
        n = n.call(t);
      },
      n: function() {
        var t = n.next();
        return (s = t.done), t;
      },
      e: function(t) {
        (a = !0), (i = t);
      },
      f: function() {
        try {
          s || null == n.return || n.return();
        } finally {
          if (a) throw i;
        }
      }
    };
  }
  var d = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
    y = [
      "source",
      "protocol",
      "authority",
      "userInfo",
      "user",
      "password",
      "host",
      "port",
      "relative",
      "path",
      "directory",
      "file",
      "query",
      "anchor"
    ],
    v = function(t) {
      var e = t,
        n = t.indexOf("["),
        r = t.indexOf("]");
      -1 != n &&
        -1 != r &&
        (t =
          t.substring(0, n) +
          t.substring(n, r).replace(/:/g, ";") +
          t.substring(r, t.length));
      for (var o, i, s = d.exec(t || ""), a = {}, c = 14; c--; )
        a[y[c]] = s[c] || "";
      return (
        -1 != n &&
          -1 != r &&
          ((a.source = e),
          (a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ":")),
          (a.authority = a.authority
            .replace("[", "")
            .replace("]", "")
            .replace(/;/g, ":")),
          (a.ipv6uri = !0)),
        (a.pathNames = (function(t, e) {
          var n = /\/{2,9}/g,
            r = e.replace(n, "/").split("/");
          ("/" != e.substr(0, 1) && 0 !== e.length) || r.splice(0, 1);
          "/" == e.substr(e.length - 1, 1) && r.splice(r.length - 1, 1);
          return r;
        })(0, a.path)),
        (a.queryKey =
          ((o = a.query),
          (i = {}),
          o.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function(t, e, n) {
            e && (i[e] = n);
          }),
          i)),
        a
      );
    };
  var m = { exports: {} };
  try {
    m.exports =
      "undefined" != typeof XMLHttpRequest &&
      "withCredentials" in new XMLHttpRequest();
  } catch (t) {
    m.exports = !1;
  }
  var g = m.exports,
    k =
      "undefined" != typeof self
        ? self
        : "undefined" != typeof window
        ? window
        : Function("return this")();
  function b(t) {
    var e = t.xdomain;
    try {
      if ("undefined" != typeof XMLHttpRequest && (!e || g))
        return new XMLHttpRequest();
    } catch (t) {}
    if (!e)
      try {
        return new k[["Active"].concat("Object").join("X")](
          "Microsoft.XMLHTTP"
        );
      } catch (t) {}
  }
  function w(t) {
    for (
      var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1;
      r < e;
      r++
    )
      n[r - 1] = arguments[r];
    return n.reduce(function(e, n) {
      return t.hasOwnProperty(n) && (e[n] = t[n]), e;
    }, {});
  }
  var _ = setTimeout,
    E = clearTimeout;
  function A(t, e) {
    e.useNativeTimers
      ? ((t.setTimeoutFn = _.bind(k)), (t.clearTimeoutFn = E.bind(k)))
      : ((t.setTimeoutFn = setTimeout.bind(k)),
        (t.clearTimeoutFn = clearTimeout.bind(k)));
  }
  var R = T;
  function T(t) {
    if (t)
      return (function(t) {
        for (var e in T.prototype) t[e] = T.prototype[e];
        return t;
      })(t);
  }
  (T.prototype.on = T.prototype.addEventListener = function(t, e) {
    return (
      (this._callbacks = this._callbacks || {}),
      (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e),
      this
    );
  }),
    (T.prototype.once = function(t, e) {
      function n() {
        this.off(t, n), e.apply(this, arguments);
      }
      return (n.fn = e), this.on(t, n), this;
    }),
    (T.prototype.off = T.prototype.removeListener = T.prototype.removeAllListeners = T.prototype.removeEventListener = function(
      t,
      e
    ) {
      if (((this._callbacks = this._callbacks || {}), 0 == arguments.length))
        return (this._callbacks = {}), this;
      var n,
        r = this._callbacks["$" + t];
      if (!r) return this;
      if (1 == arguments.length) return delete this._callbacks["$" + t], this;
      for (var o = 0; o < r.length; o++)
        if ((n = r[o]) === e || n.fn === e) {
          r.splice(o, 1);
          break;
        }
      return 0 === r.length && delete this._callbacks["$" + t], this;
    }),
    (T.prototype.emit = function(t) {
      this._callbacks = this._callbacks || {};
      for (
        var e = new Array(arguments.length - 1),
          n = this._callbacks["$" + t],
          r = 1;
        r < arguments.length;
        r++
      )
        e[r - 1] = arguments[r];
      if (n) {
        r = 0;
        for (var o = (n = n.slice(0)).length; r < o; ++r) n[r].apply(this, e);
      }
      return this;
    }),
    (T.prototype.emitReserved = T.prototype.emit),
    (T.prototype.listeners = function(t) {
      return (
        (this._callbacks = this._callbacks || {}),
        this._callbacks["$" + t] || []
      );
    }),
    (T.prototype.hasListeners = function(t) {
      return !!this.listeners(t).length;
    });
  var C = Object.create(null);
  (C.open = "0"),
    (C.close = "1"),
    (C.ping = "2"),
    (C.pong = "3"),
    (C.message = "4"),
    (C.upgrade = "5"),
    (C.noop = "6");
  var O = Object.create(null);
  Object.keys(C).forEach(function(t) {
    O[C[t]] = t;
  });
  for (
    var S = { type: "error", data: "parser error" },
      B =
        "function" == typeof Blob ||
        ("undefined" != typeof Blob &&
          "[object BlobConstructor]" === Object.prototype.toString.call(Blob)),
      N = "function" == typeof ArrayBuffer,
      x = function(t, e, n) {
        var r,
          o = t.type,
          i = t.data;
        return B && i instanceof Blob
          ? e
            ? n(i)
            : L(i, n)
          : N &&
            (i instanceof ArrayBuffer ||
              ((r = i),
              "function" == typeof ArrayBuffer.isView
                ? ArrayBuffer.isView(r)
                : r && r.buffer instanceof ArrayBuffer))
          ? e
            ? n(i)
            : L(new Blob([i]), n)
          : n(C[o] + (i || ""));
      },
      L = function(t, e) {
        var n = new FileReader();
        return (
          (n.onload = function() {
            var t = n.result.split(",")[1];
            e("b" + t);
          }),
          n.readAsDataURL(t)
        );
      },
      j = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      P = "undefined" == typeof Uint8Array ? [] : new Uint8Array(256),
      q = 0;
    q < j.length;
    q++
  )
    P[j.charCodeAt(q)] = q;
  var D,
    I = "function" == typeof ArrayBuffer,
    F = function(t, e) {
      if ("string" != typeof t) return { type: "message", data: U(t, e) };
      var n = t.charAt(0);
      return "b" === n
        ? { type: "message", data: M(t.substring(1), e) }
        : O[n]
        ? t.length > 1
          ? { type: O[n], data: t.substring(1) }
          : { type: O[n] }
        : S;
    },
    M = function(t, e) {
      if (I) {
        var n = (function(t) {
          var e,
            n,
            r,
            o,
            i,
            s = 0.75 * t.length,
            a = t.length,
            c = 0;
          "=" === t[t.length - 1] && (s--, "=" === t[t.length - 2] && s--);
          var u = new ArrayBuffer(s),
            h = new Uint8Array(u);
          for (e = 0; e < a; e += 4)
            (n = P[t.charCodeAt(e)]),
              (r = P[t.charCodeAt(e + 1)]),
              (o = P[t.charCodeAt(e + 2)]),
              (i = P[t.charCodeAt(e + 3)]),
              (h[c++] = (n << 2) | (r >> 4)),
              (h[c++] = ((15 & r) << 4) | (o >> 2)),
              (h[c++] = ((3 & o) << 6) | (63 & i));
          return u;
        })(t);
        return U(n, e);
      }
      return { base64: !0, data: t };
    },
    U = function(t, e) {
      return "blob" === e && t instanceof ArrayBuffer ? new Blob([t]) : t;
    },
    V = String.fromCharCode(30),
    H = (function(t) {
      i(o, t);
      var n = h(o);
      function o(t) {
        var r;
        return (
          e(this, o),
          ((r = n.call(this)).writable = !1),
          A(c(r), t),
          (r.opts = t),
          (r.query = t.query),
          (r.readyState = ""),
          (r.socket = t.socket),
          r
        );
      }
      return (
        r(o, [
          {
            key: "onError",
            value: function(t, e) {
              var n = new Error(t);
              return (
                (n.type = "TransportError"),
                (n.description = e),
                f(s(o.prototype), "emit", this).call(this, "error", n),
                this
              );
            }
          },
          {
            key: "open",
            value: function() {
              return (
                ("closed" !== this.readyState && "" !== this.readyState) ||
                  ((this.readyState = "opening"), this.doOpen()),
                this
              );
            }
          },
          {
            key: "close",
            value: function() {
              return (
                ("opening" !== this.readyState && "open" !== this.readyState) ||
                  (this.doClose(), this.onClose()),
                this
              );
            }
          },
          {
            key: "send",
            value: function(t) {
              "open" === this.readyState && this.write(t);
            }
          },
          {
            key: "onOpen",
            value: function() {
              (this.readyState = "open"),
                (this.writable = !0),
                f(s(o.prototype), "emit", this).call(this, "open");
            }
          },
          {
            key: "onData",
            value: function(t) {
              var e = F(t, this.socket.binaryType);
              this.onPacket(e);
            }
          },
          {
            key: "onPacket",
            value: function(t) {
              f(s(o.prototype), "emit", this).call(this, "packet", t);
            }
          },
          {
            key: "onClose",
            value: function() {
              (this.readyState = "closed"),
                f(s(o.prototype), "emit", this).call(this, "close");
            }
          }
        ]),
        o
      );
    })(R),
    K = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(
      ""
    ),
    Y = {},
    z = 0,
    $ = 0;
  function W(t) {
    var e = "";
    do {
      (e = K[t % 64] + e), (t = Math.floor(t / 64));
    } while (t > 0);
    return e;
  }
  function J() {
    var t = W(+new Date());
    return t !== D ? ((z = 0), (D = t)) : t + "." + W(z++);
  }
  for (; $ < 64; $++) Y[K[$]] = $;
  (J.encode = W),
    (J.decode = function(t) {
      var e = 0;
      for ($ = 0; $ < t.length; $++) e = 64 * e + Y[t.charAt($)];
      return e;
    });
  var X = J,
    G = {
      encode: function(t) {
        var e = "";
        for (var n in t)
          t.hasOwnProperty(n) &&
            (e.length && (e += "&"),
            (e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n])));
        return e;
      },
      decode: function(t) {
        for (var e = {}, n = t.split("&"), r = 0, o = n.length; r < o; r++) {
          var i = n[r].split("=");
          e[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
        }
        return e;
      }
    },
    Q = (function(t) {
      i(o, t);
      var n = h(o);
      function o() {
        var t;
        return e(this, o), ((t = n.apply(this, arguments)).polling = !1), t;
      }
      return (
        r(o, [
          {
            key: "name",
            get: function() {
              return "polling";
            }
          },
          {
            key: "doOpen",
            value: function() {
              this.poll();
            }
          },
          {
            key: "pause",
            value: function(t) {
              var e = this;
              this.readyState = "pausing";
              var n = function() {
                (e.readyState = "paused"), t();
              };
              if (this.polling || !this.writable) {
                var r = 0;
                this.polling &&
                  (r++,
                  this.once("pollComplete", function() {
                    --r || n();
                  })),
                  this.writable ||
                    (r++,
                    this.once("drain", function() {
                      --r || n();
                    }));
              } else n();
            }
          },
          {
            key: "poll",
            value: function() {
              (this.polling = !0), this.doPoll(), this.emit("poll");
            }
          },
          {
            key: "onData",
            value: function(t) {
              var e = this;
              (function(t, e) {
                for (var n = t.split(V), r = [], o = 0; o < n.length; o++) {
                  var i = F(n[o], e);
                  if ((r.push(i), "error" === i.type)) break;
                }
                return r;
              })(t, this.socket.binaryType).forEach(function(t) {
                if (
                  ("opening" === e.readyState &&
                    "open" === t.type &&
                    e.onOpen(),
                  "close" === t.type)
                )
                  return e.onClose(), !1;
                e.onPacket(t);
              }),
                "closed" !== this.readyState &&
                  ((this.polling = !1),
                  this.emit("pollComplete"),
                  "open" === this.readyState && this.poll());
            }
          },
          {
            key: "doClose",
            value: function() {
              var t = this,
                e = function() {
                  t.write([{ type: "close" }]);
                };
              "open" === this.readyState ? e() : this.once("open", e);
            }
          },
          {
            key: "write",
            value: function(t) {
              var e = this;
              (this.writable = !1),
                (function(t, e) {
                  var n = t.length,
                    r = new Array(n),
                    o = 0;
                  t.forEach(function(t, i) {
                    x(t, !1, function(t) {
                      (r[i] = t), ++o === n && e(r.join(V));
                    });
                  });
                })(t, function(t) {
                  e.doWrite(t, function() {
                    (e.writable = !0), e.emit("drain");
                  });
                });
            }
          },
          {
            key: "uri",
            value: function() {
              var t = this.query || {},
                e = this.opts.secure ? "https" : "http",
                n = "";
              !1 !== this.opts.timestampRequests &&
                (t[this.opts.timestampParam] = X()),
                this.supportsBinary || t.sid || (t.b64 = 1),
                this.opts.port &&
                  (("https" === e && 443 !== Number(this.opts.port)) ||
                    ("http" === e && 80 !== Number(this.opts.port))) &&
                  (n = ":" + this.opts.port);
              var r = G.encode(t);
              return (
                e +
                "://" +
                (-1 !== this.opts.hostname.indexOf(":")
                  ? "[" + this.opts.hostname + "]"
                  : this.opts.hostname) +
                n +
                this.opts.path +
                (r.length ? "?" + r : "")
              );
            }
          }
        ]),
        o
      );
    })(H);
  function Z() {}
  var tt = null != new b({ xdomain: !1 }).responseType,
    et = (function(t) {
      i(s, t);
      var n = h(s);
      function s(t) {
        var r;
        if (
          (e(this, s), (r = n.call(this, t)), "undefined" != typeof location)
        ) {
          var o = "https:" === location.protocol,
            i = location.port;
          i || (i = o ? "443" : "80"),
            (r.xd =
              ("undefined" != typeof location &&
                t.hostname !== location.hostname) ||
              i !== t.port),
            (r.xs = t.secure !== o);
        }
        var a = t && t.forceBase64;
        return (r.supportsBinary = tt && !a), r;
      }
      return (
        r(s, [
          {
            key: "request",
            value: function() {
              var t =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {};
              return (
                o(t, { xd: this.xd, xs: this.xs }, this.opts),
                new nt(this.uri(), t)
              );
            }
          },
          {
            key: "doWrite",
            value: function(t, e) {
              var n = this,
                r = this.request({ method: "POST", data: t });
              r.on("success", e),
                r.on("error", function(t) {
                  n.onError("xhr post error", t);
                });
            }
          },
          {
            key: "doPoll",
            value: function() {
              var t = this,
                e = this.request();
              e.on("data", this.onData.bind(this)),
                e.on("error", function(e) {
                  t.onError("xhr poll error", e);
                }),
                (this.pollXhr = e);
            }
          }
        ]),
        s
      );
    })(Q),
    nt = (function(t) {
      i(o, t);
      var n = h(o);
      function o(t, r) {
        var i;
        return (
          e(this, o),
          A(c((i = n.call(this))), r),
          (i.opts = r),
          (i.method = r.method || "GET"),
          (i.uri = t),
          (i.async = !1 !== r.async),
          (i.data = void 0 !== r.data ? r.data : null),
          i.create(),
          i
        );
      }
      return (
        r(o, [
          {
            key: "create",
            value: function() {
              var t = this,
                e = w(
                  this.opts,
                  "agent",
                  "pfx",
                  "key",
                  "passphrase",
                  "cert",
                  "ca",
                  "ciphers",
                  "rejectUnauthorized",
                  "autoUnref"
                );
              (e.xdomain = !!this.opts.xd), (e.xscheme = !!this.opts.xs);
              var n = (this.xhr = new b(e));
              try {
                n.open(this.method, this.uri, this.async);
                try {
                  if (this.opts.extraHeaders)
                    for (var r in (n.setDisableHeaderCheck &&
                      n.setDisableHeaderCheck(!0),
                    this.opts.extraHeaders))
                      this.opts.extraHeaders.hasOwnProperty(r) &&
                        n.setRequestHeader(r, this.opts.extraHeaders[r]);
                } catch (t) {}
                if ("POST" === this.method)
                  try {
                    n.setRequestHeader(
                      "Content-type",
                      "text/plain;charset=UTF-8"
                    );
                  } catch (t) {}
                try {
                  n.setRequestHeader("Accept", "*/*");
                } catch (t) {}
                "withCredentials" in n &&
                  (n.withCredentials = this.opts.withCredentials),
                  this.opts.requestTimeout &&
                    (n.timeout = this.opts.requestTimeout),
                  (n.onreadystatechange = function() {
                    4 === n.readyState &&
                      (200 === n.status || 1223 === n.status
                        ? t.onLoad()
                        : t.setTimeoutFn(function() {
                            t.onError(
                              "number" == typeof n.status ? n.status : 0
                            );
                          }, 0));
                  }),
                  n.send(this.data);
              } catch (e) {
                return void this.setTimeoutFn(function() {
                  t.onError(e);
                }, 0);
              }
              "undefined" != typeof document &&
                ((this.index = o.requestsCount++),
                (o.requests[this.index] = this));
            }
          },
          {
            key: "onSuccess",
            value: function() {
              this.emit("success"), this.cleanup();
            }
          },
          {
            key: "onData",
            value: function(t) {
              this.emit("data", t), this.onSuccess();
            }
          },
          {
            key: "onError",
            value: function(t) {
              this.emit("error", t), this.cleanup(!0);
            }
          },
          {
            key: "cleanup",
            value: function(t) {
              if (void 0 !== this.xhr && null !== this.xhr) {
                if (((this.xhr.onreadystatechange = Z), t))
                  try {
                    this.xhr.abort();
                  } catch (t) {}
                "undefined" != typeof document && delete o.requests[this.index],
                  (this.xhr = null);
              }
            }
          },
          {
            key: "onLoad",
            value: function() {
              var t = this.xhr.responseText;
              null !== t && this.onData(t);
            }
          },
          {
            key: "abort",
            value: function() {
              this.cleanup();
            }
          }
        ]),
        o
      );
    })(R);
  if (
    ((nt.requestsCount = 0), (nt.requests = {}), "undefined" != typeof document)
  )
    if ("function" == typeof attachEvent) attachEvent("onunload", rt);
    else if ("function" == typeof addEventListener) {
      addEventListener("onpagehide" in k ? "pagehide" : "unload", rt, !1);
    }
  function rt() {
    for (var t in nt.requests)
      nt.requests.hasOwnProperty(t) && nt.requests[t].abort();
  }
  var ot =
      "function" == typeof Promise && "function" == typeof Promise.resolve
        ? function(t) {
            return Promise.resolve().then(t);
          }
        : function(t, e) {
            return e(t, 0);
          },
    it = k.WebSocket || k.MozWebSocket,
    st =
      "undefined" != typeof navigator &&
      "string" == typeof navigator.product &&
      "reactnative" === navigator.product.toLowerCase(),
    at = (function(t) {
      i(o, t);
      var n = h(o);
      function o(t) {
        var r;
        return (
          e(this, o), ((r = n.call(this, t)).supportsBinary = !t.forceBase64), r
        );
      }
      return (
        r(o, [
          {
            key: "name",
            get: function() {
              return "websocket";
            }
          },
          {
            key: "doOpen",
            value: function() {
              if (this.check()) {
                var t = this.uri(),
                  e = this.opts.protocols,
                  n = st
                    ? {}
                    : w(
                        this.opts,
                        "agent",
                        "perMessageDeflate",
                        "pfx",
                        "key",
                        "passphrase",
                        "cert",
                        "ca",
                        "ciphers",
                        "rejectUnauthorized",
                        "localAddress",
                        "protocolVersion",
                        "origin",
                        "maxPayload",
                        "family",
                        "checkServerIdentity"
                      );
                this.opts.extraHeaders && (n.headers = this.opts.extraHeaders);
                try {
                  this.ws = st ? new it(t, e, n) : e ? new it(t, e) : new it(t);
                } catch (t) {
                  return this.emit("error", t);
                }
                (this.ws.binaryType = this.socket.binaryType || "arraybuffer"),
                  this.addEventListeners();
              }
            }
          },
          {
            key: "addEventListeners",
            value: function() {
              var t = this;
              (this.ws.onopen = function() {
                t.opts.autoUnref && t.ws._socket.unref(), t.onOpen();
              }),
                (this.ws.onclose = this.onClose.bind(this)),
                (this.ws.onmessage = function(e) {
                  return t.onData(e.data);
                }),
                (this.ws.onerror = function(e) {
                  return t.onError("websocket error", e);
                });
            }
          },
          {
            key: "write",
            value: function(t) {
              var e = this;
              this.writable = !1;
              for (
                var n = function(n) {
                    var r = t[n],
                      o = n === t.length - 1;
                    x(r, e.supportsBinary, function(t) {
                      try {
                        e.ws.send(t);
                      } catch (t) {}
                      o &&
                        ot(function() {
                          (e.writable = !0), e.emit("drain");
                        }, e.setTimeoutFn);
                    });
                  },
                  r = 0;
                r < t.length;
                r++
              )
                n(r);
            }
          },
          {
            key: "doClose",
            value: function() {
              void 0 !== this.ws && (this.ws.close(), (this.ws = null));
            }
          },
          {
            key: "uri",
            value: function() {
              var t = this.query || {},
                e = this.opts.secure ? "wss" : "ws",
                n = "";
              this.opts.port &&
                (("wss" === e && 443 !== Number(this.opts.port)) ||
                  ("ws" === e && 80 !== Number(this.opts.port))) &&
                (n = ":" + this.opts.port),
                this.opts.timestampRequests &&
                  (t[this.opts.timestampParam] = X()),
                this.supportsBinary || (t.b64 = 1);
              var r = G.encode(t);
              return (
                e +
                "://" +
                (-1 !== this.opts.hostname.indexOf(":")
                  ? "[" + this.opts.hostname + "]"
                  : this.opts.hostname) +
                n +
                this.opts.path +
                (r.length ? "?" + r : "")
              );
            }
          },
          {
            key: "check",
            value: function() {
              return !(
                !it ||
                ("__initialize" in it && this.name === o.prototype.name)
              );
            }
          }
        ]),
        o
      );
    })(H),
    ct = { websocket: at, polling: et },
    ut = (function(n) {
      i(a, n);
      var s = h(a);
      function a(n) {
        var r,
          i =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return (
          e(this, a),
          (r = s.call(this)),
          n && "object" === t(n) && ((i = n), (n = null)),
          n
            ? ((n = v(n)),
              (i.hostname = n.host),
              (i.secure = "https" === n.protocol || "wss" === n.protocol),
              (i.port = n.port),
              n.query && (i.query = n.query))
            : i.host && (i.hostname = v(i.host).host),
          A(c(r), i),
          (r.secure =
            null != i.secure
              ? i.secure
              : "undefined" != typeof location &&
                "https:" === location.protocol),
          i.hostname && !i.port && (i.port = r.secure ? "443" : "80"),
          (r.hostname =
            i.hostname ||
            ("undefined" != typeof location ? location.hostname : "localhost")),
          (r.port =
            i.port ||
            ("undefined" != typeof location && location.port
              ? location.port
              : r.secure
              ? "443"
              : "80")),
          (r.transports = i.transports || ["polling", "websocket"]),
          (r.readyState = ""),
          (r.writeBuffer = []),
          (r.prevBufferLen = 0),
          (r.opts = o(
            {
              path: "/engine.io",
              agent: !1,
              withCredentials: !1,
              upgrade: !0,
              timestampParam: "t",
              rememberUpgrade: !1,
              rejectUnauthorized: !0,
              perMessageDeflate: { threshold: 1024 },
              transportOptions: {},
              closeOnBeforeunload: !0
            },
            i
          )),
          (r.opts.path = r.opts.path.replace(/\/$/, "") + "/"),
          "string" == typeof r.opts.query &&
            (r.opts.query = G.decode(r.opts.query)),
          (r.id = null),
          (r.upgrades = null),
          (r.pingInterval = null),
          (r.pingTimeout = null),
          (r.pingTimeoutTimer = null),
          "function" == typeof addEventListener &&
            (r.opts.closeOnBeforeunload &&
              addEventListener(
                "beforeunload",
                function() {
                  r.transport &&
                    (r.transport.removeAllListeners(), r.transport.close());
                },
                !1
              ),
            "localhost" !== r.hostname &&
              ((r.offlineEventListener = function() {
                r.onClose("transport close");
              }),
              addEventListener("offline", r.offlineEventListener, !1))),
          r.open(),
          r
        );
      }
      return (
        r(a, [
          {
            key: "createTransport",
            value: function(t) {
              var e = (function(t) {
                var e = {};
                for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
                return e;
              })(this.opts.query);
              (e.EIO = 4), (e.transport = t), this.id && (e.sid = this.id);
              var n = o({}, this.opts.transportOptions[t], this.opts, {
                query: e,
                socket: this,
                hostname: this.hostname,
                secure: this.secure,
                port: this.port
              });
              return new ct[t](n);
            }
          },
          {
            key: "open",
            value: function() {
              var t,
                e = this;
              if (
                this.opts.rememberUpgrade &&
                a.priorWebsocketSuccess &&
                -1 !== this.transports.indexOf("websocket")
              )
                t = "websocket";
              else {
                if (0 === this.transports.length)
                  return void this.setTimeoutFn(function() {
                    e.emitReserved("error", "No transports available");
                  }, 0);
                t = this.transports[0];
              }
              this.readyState = "opening";
              try {
                t = this.createTransport(t);
              } catch (t) {
                return this.transports.shift(), void this.open();
              }
              t.open(), this.setTransport(t);
            }
          },
          {
            key: "setTransport",
            value: function(t) {
              var e = this;
              this.transport && this.transport.removeAllListeners(),
                (this.transport = t),
                t
                  .on("drain", this.onDrain.bind(this))
                  .on("packet", this.onPacket.bind(this))
                  .on("error", this.onError.bind(this))
                  .on("close", function() {
                    e.onClose("transport close");
                  });
            }
          },
          {
            key: "probe",
            value: function(t) {
              var e = this,
                n = this.createTransport(t),
                r = !1;
              a.priorWebsocketSuccess = !1;
              var o = function() {
                r ||
                  (n.send([{ type: "ping", data: "probe" }]),
                  n.once("packet", function(t) {
                    if (!r)
                      if ("pong" === t.type && "probe" === t.data) {
                        if (
                          ((e.upgrading = !0),
                          e.emitReserved("upgrading", n),
                          !n)
                        )
                          return;
                        (a.priorWebsocketSuccess = "websocket" === n.name),
                          e.transport.pause(function() {
                            r ||
                              ("closed" !== e.readyState &&
                                (f(),
                                e.setTransport(n),
                                n.send([{ type: "upgrade" }]),
                                e.emitReserved("upgrade", n),
                                (n = null),
                                (e.upgrading = !1),
                                e.flush()));
                          });
                      } else {
                        var o = new Error("probe error");
                        (o.transport = n.name),
                          e.emitReserved("upgradeError", o);
                      }
                  }));
              };
              function i() {
                r || ((r = !0), f(), n.close(), (n = null));
              }
              var s = function(t) {
                var r = new Error("probe error: " + t);
                (r.transport = n.name), i(), e.emitReserved("upgradeError", r);
              };
              function c() {
                s("transport closed");
              }
              function u() {
                s("socket closed");
              }
              function h(t) {
                n && t.name !== n.name && i();
              }
              var f = function() {
                n.removeListener("open", o),
                  n.removeListener("error", s),
                  n.removeListener("close", c),
                  e.off("close", u),
                  e.off("upgrading", h);
              };
              n.once("open", o),
                n.once("error", s),
                n.once("close", c),
                this.once("close", u),
                this.once("upgrading", h),
                n.open();
            }
          },
          {
            key: "onOpen",
            value: function() {
              if (
                ((this.readyState = "open"),
                (a.priorWebsocketSuccess = "websocket" === this.transport.name),
                this.emitReserved("open"),
                this.flush(),
                "open" === this.readyState &&
                  this.opts.upgrade &&
                  this.transport.pause)
              )
                for (var t = 0, e = this.upgrades.length; t < e; t++)
                  this.probe(this.upgrades[t]);
            }
          },
          {
            key: "onPacket",
            value: function(t) {
              if (
                "opening" === this.readyState ||
                "open" === this.readyState ||
                "closing" === this.readyState
              )
                switch (
                  (this.emitReserved("packet", t),
                  this.emitReserved("heartbeat"),
                  t.type)
                ) {
                  case "open":
                    this.onHandshake(JSON.parse(t.data));
                    break;
                  case "ping":
                    this.resetPingTimeout(),
                      this.sendPacket("pong"),
                      this.emitReserved("ping"),
                      this.emitReserved("pong");
                    break;
                  case "error":
                    var e = new Error("server error");
                    (e.code = t.data), this.onError(e);
                    break;
                  case "message":
                    this.emitReserved("data", t.data),
                      this.emitReserved("message", t.data);
                }
            }
          },
          {
            key: "onHandshake",
            value: function(t) {
              this.emitReserved("handshake", t),
                (this.id = t.sid),
                (this.transport.query.sid = t.sid),
                (this.upgrades = this.filterUpgrades(t.upgrades)),
                (this.pingInterval = t.pingInterval),
                (this.pingTimeout = t.pingTimeout),
                this.onOpen(),
                "closed" !== this.readyState && this.resetPingTimeout();
            }
          },
          {
            key: "resetPingTimeout",
            value: function() {
              var t = this;
              this.clearTimeoutFn(this.pingTimeoutTimer),
                (this.pingTimeoutTimer = this.setTimeoutFn(function() {
                  t.onClose("ping timeout");
                }, this.pingInterval + this.pingTimeout)),
                this.opts.autoUnref && this.pingTimeoutTimer.unref();
            }
          },
          {
            key: "onDrain",
            value: function() {
              this.writeBuffer.splice(0, this.prevBufferLen),
                (this.prevBufferLen = 0),
                0 === this.writeBuffer.length
                  ? this.emitReserved("drain")
                  : this.flush();
            }
          },
          {
            key: "flush",
            value: function() {
              "closed" !== this.readyState &&
                this.transport.writable &&
                !this.upgrading &&
                this.writeBuffer.length &&
                (this.transport.send(this.writeBuffer),
                (this.prevBufferLen = this.writeBuffer.length),
                this.emitReserved("flush"));
            }
          },
          {
            key: "write",
            value: function(t, e, n) {
              return this.sendPacket("message", t, e, n), this;
            }
          },
          {
            key: "send",
            value: function(t, e, n) {
              return this.sendPacket("message", t, e, n), this;
            }
          },
          {
            key: "sendPacket",
            value: function(t, e, n, r) {
              if (
                ("function" == typeof e && ((r = e), (e = void 0)),
                "function" == typeof n && ((r = n), (n = null)),
                "closing" !== this.readyState && "closed" !== this.readyState)
              ) {
                (n = n || {}).compress = !1 !== n.compress;
                var o = { type: t, data: e, options: n };
                this.emitReserved("packetCreate", o),
                  this.writeBuffer.push(o),
                  r && this.once("flush", r),
                  this.flush();
              }
            }
          },
          {
            key: "close",
            value: function() {
              var t = this,
                e = function() {
                  t.onClose("forced close"), t.transport.close();
                },
                n = function n() {
                  t.off("upgrade", n), t.off("upgradeError", n), e();
                },
                r = function() {
                  t.once("upgrade", n), t.once("upgradeError", n);
                };
              return (
                ("opening" !== this.readyState && "open" !== this.readyState) ||
                  ((this.readyState = "closing"),
                  this.writeBuffer.length
                    ? this.once("drain", function() {
                        t.upgrading ? r() : e();
                      })
                    : this.upgrading
                    ? r()
                    : e()),
                this
              );
            }
          },
          {
            key: "onError",
            value: function(t) {
              (a.priorWebsocketSuccess = !1),
                this.emitReserved("error", t),
                this.onClose("transport error", t);
            }
          },
          {
            key: "onClose",
            value: function(t, e) {
              ("opening" !== this.readyState &&
                "open" !== this.readyState &&
                "closing" !== this.readyState) ||
                (this.clearTimeoutFn(this.pingTimeoutTimer),
                this.transport.removeAllListeners("close"),
                this.transport.close(),
                this.transport.removeAllListeners(),
                "function" == typeof removeEventListener &&
                  removeEventListener("offline", this.offlineEventListener, !1),
                (this.readyState = "closed"),
                (this.id = null),
                this.emitReserved("close", t, e),
                (this.writeBuffer = []),
                (this.prevBufferLen = 0));
            }
          },
          {
            key: "filterUpgrades",
            value: function(t) {
              for (var e = [], n = 0, r = t.length; n < r; n++)
                ~this.transports.indexOf(t[n]) && e.push(t[n]);
              return e;
            }
          }
        ]),
        a
      );
    })(R);
  ut.protocol = 4;
  var ht = "function" == typeof ArrayBuffer,
    ft = Object.prototype.toString,
    lt =
      "function" == typeof Blob ||
      ("undefined" != typeof Blob &&
        "[object BlobConstructor]" === ft.call(Blob)),
    pt =
      "function" == typeof File ||
      ("undefined" != typeof File &&
        "[object FileConstructor]" === ft.call(File));
  function dt(t) {
    return (
      (ht &&
        (t instanceof ArrayBuffer ||
          (function(t) {
            return "function" == typeof ArrayBuffer.isView
              ? ArrayBuffer.isView(t)
              : t.buffer instanceof ArrayBuffer;
          })(t))) ||
      (lt && t instanceof Blob) ||
      (pt && t instanceof File)
    );
  }
  function yt(e, n) {
    if (!e || "object" !== t(e)) return !1;
    if (Array.isArray(e)) {
      for (var r = 0, o = e.length; r < o; r++) if (yt(e[r])) return !0;
      return !1;
    }
    if (dt(e)) return !0;
    if (e.toJSON && "function" == typeof e.toJSON && 1 === arguments.length)
      return yt(e.toJSON(), !0);
    for (var i in e)
      if (Object.prototype.hasOwnProperty.call(e, i) && yt(e[i])) return !0;
    return !1;
  }
  function vt(t) {
    var e = [],
      n = t.data,
      r = t;
    return (
      (r.data = mt(n, e)), (r.attachments = e.length), { packet: r, buffers: e }
    );
  }
  function mt(e, n) {
    if (!e) return e;
    if (dt(e)) {
      var r = { _placeholder: !0, num: n.length };
      return n.push(e), r;
    }
    if (Array.isArray(e)) {
      for (var o = new Array(e.length), i = 0; i < e.length; i++)
        o[i] = mt(e[i], n);
      return o;
    }
    if ("object" === t(e) && !(e instanceof Date)) {
      var s = {};
      for (var a in e) e.hasOwnProperty(a) && (s[a] = mt(e[a], n));
      return s;
    }
    return e;
  }
  function gt(t, e) {
    return (t.data = kt(t.data, e)), (t.attachments = void 0), t;
  }
  function kt(e, n) {
    if (!e) return e;
    if (e && e._placeholder) return n[e.num];
    if (Array.isArray(e)) for (var r = 0; r < e.length; r++) e[r] = kt(e[r], n);
    else if ("object" === t(e))
      for (var o in e) e.hasOwnProperty(o) && (e[o] = kt(e[o], n));
    return e;
  }
  var bt;
  !(function(t) {
    (t[(t.CONNECT = 0)] = "CONNECT"),
      (t[(t.DISCONNECT = 1)] = "DISCONNECT"),
      (t[(t.EVENT = 2)] = "EVENT"),
      (t[(t.ACK = 3)] = "ACK"),
      (t[(t.CONNECT_ERROR = 4)] = "CONNECT_ERROR"),
      (t[(t.BINARY_EVENT = 5)] = "BINARY_EVENT"),
      (t[(t.BINARY_ACK = 6)] = "BINARY_ACK");
  })(bt || (bt = {}));
  var wt = (function() {
      function t() {
        e(this, t);
      }
      return (
        r(t, [
          {
            key: "encode",
            value: function(t) {
              return (t.type !== bt.EVENT && t.type !== bt.ACK) || !yt(t)
                ? [this.encodeAsString(t)]
                : ((t.type =
                    t.type === bt.EVENT ? bt.BINARY_EVENT : bt.BINARY_ACK),
                  this.encodeAsBinary(t));
            }
          },
          {
            key: "encodeAsString",
            value: function(t) {
              var e = "" + t.type;
              return (
                (t.type !== bt.BINARY_EVENT && t.type !== bt.BINARY_ACK) ||
                  (e += t.attachments + "-"),
                t.nsp && "/" !== t.nsp && (e += t.nsp + ","),
                null != t.id && (e += t.id),
                null != t.data && (e += JSON.stringify(t.data)),
                e
              );
            }
          },
          {
            key: "encodeAsBinary",
            value: function(t) {
              var e = vt(t),
                n = this.encodeAsString(e.packet),
                r = e.buffers;
              return r.unshift(n), r;
            }
          }
        ]),
        t
      );
    })(),
    _t = (function(n) {
      i(a, n);
      var o = h(a);
      function a() {
        return e(this, a), o.call(this);
      }
      return (
        r(
          a,
          [
            {
              key: "add",
              value: function(t) {
                var e;
                if ("string" == typeof t)
                  (e = this.decodeString(t)).type === bt.BINARY_EVENT ||
                  e.type === bt.BINARY_ACK
                    ? ((this.reconstructor = new Et(e)),
                      0 === e.attachments &&
                        f(s(a.prototype), "emitReserved", this).call(
                          this,
                          "decoded",
                          e
                        ))
                    : f(s(a.prototype), "emitReserved", this).call(
                        this,
                        "decoded",
                        e
                      );
                else {
                  if (!dt(t) && !t.base64)
                    throw new Error("Unknown type: " + t);
                  if (!this.reconstructor)
                    throw new Error(
                      "got binary data when not reconstructing a packet"
                    );
                  (e = this.reconstructor.takeBinaryData(t)) &&
                    ((this.reconstructor = null),
                    f(s(a.prototype), "emitReserved", this).call(
                      this,
                      "decoded",
                      e
                    ));
                }
              }
            },
            {
              key: "decodeString",
              value: function(t) {
                var e = 0,
                  n = { type: Number(t.charAt(0)) };
                if (void 0 === bt[n.type])
                  throw new Error("unknown packet type " + n.type);
                if (n.type === bt.BINARY_EVENT || n.type === bt.BINARY_ACK) {
                  for (var r = e + 1; "-" !== t.charAt(++e) && e != t.length; );
                  var o = t.substring(r, e);
                  if (o != Number(o) || "-" !== t.charAt(e))
                    throw new Error("Illegal attachments");
                  n.attachments = Number(o);
                }
                if ("/" === t.charAt(e + 1)) {
                  for (var i = e + 1; ++e; ) {
                    if ("," === t.charAt(e)) break;
                    if (e === t.length) break;
                  }
                  n.nsp = t.substring(i, e);
                } else n.nsp = "/";
                var s = t.charAt(e + 1);
                if ("" !== s && Number(s) == s) {
                  for (var c = e + 1; ++e; ) {
                    var u = t.charAt(e);
                    if (null == u || Number(u) != u) {
                      --e;
                      break;
                    }
                    if (e === t.length) break;
                  }
                  n.id = Number(t.substring(c, e + 1));
                }
                if (t.charAt(++e)) {
                  var h = (function(t) {
                    try {
                      return JSON.parse(t);
                    } catch (t) {
                      return !1;
                    }
                  })(t.substr(e));
                  if (!a.isPayloadValid(n.type, h))
                    throw new Error("invalid payload");
                  n.data = h;
                }
                return n;
              }
            },
            {
              key: "destroy",
              value: function() {
                this.reconstructor &&
                  this.reconstructor.finishedReconstruction();
              }
            }
          ],
          [
            {
              key: "isPayloadValid",
              value: function(e, n) {
                switch (e) {
                  case bt.CONNECT:
                    return "object" === t(n);
                  case bt.DISCONNECT:
                    return void 0 === n;
                  case bt.CONNECT_ERROR:
                    return "string" == typeof n || "object" === t(n);
                  case bt.EVENT:
                  case bt.BINARY_EVENT:
                    return Array.isArray(n) && n.length > 0;
                  case bt.ACK:
                  case bt.BINARY_ACK:
                    return Array.isArray(n);
                }
              }
            }
          ]
        ),
        a
      );
    })(R);
  var Et = (function() {
      function t(n) {
        e(this, t),
          (this.packet = n),
          (this.buffers = []),
          (this.reconPack = n);
      }
      return (
        r(t, [
          {
            key: "takeBinaryData",
            value: function(t) {
              if (
                (this.buffers.push(t),
                this.buffers.length === this.reconPack.attachments)
              ) {
                var e = gt(this.reconPack, this.buffers);
                return this.finishedReconstruction(), e;
              }
              return null;
            }
          },
          {
            key: "finishedReconstruction",
            value: function() {
              (this.reconPack = null), (this.buffers = []);
            }
          }
        ]),
        t
      );
    })(),
    At = Object.freeze({
      __proto__: null,
      protocol: 5,
      get PacketType() {
        return bt;
      },
      Encoder: wt,
      Decoder: _t
    });
  function Rt(t, e, n) {
    return (
      t.on(e, n),
      function() {
        t.off(e, n);
      }
    );
  }
  var Tt = Object.freeze({
      connect: 1,
      connect_error: 1,
      disconnect: 1,
      disconnecting: 1,
      newListener: 1,
      removeListener: 1
    }),
    Ct = (function(t) {
      i(o, t);
      var n = h(o);
      function o(t, r, i) {
        var s;
        return (
          e(this, o),
          ((s = n.call(this)).connected = !1),
          (s.disconnected = !0),
          (s.receiveBuffer = []),
          (s.sendBuffer = []),
          (s.ids = 0),
          (s.acks = {}),
          (s.flags = {}),
          (s.io = t),
          (s.nsp = r),
          i && i.auth && (s.auth = i.auth),
          s.io._autoConnect && s.open(),
          s
        );
      }
      return (
        r(o, [
          {
            key: "subEvents",
            value: function() {
              if (!this.subs) {
                var t = this.io;
                this.subs = [
                  Rt(t, "open", this.onopen.bind(this)),
                  Rt(t, "packet", this.onpacket.bind(this)),
                  Rt(t, "error", this.onerror.bind(this)),
                  Rt(t, "close", this.onclose.bind(this))
                ];
              }
            }
          },
          {
            key: "active",
            get: function() {
              return !!this.subs;
            }
          },
          {
            key: "connect",
            value: function() {
              return (
                this.connected ||
                  (this.subEvents(),
                  this.io._reconnecting || this.io.open(),
                  "open" === this.io._readyState && this.onopen()),
                this
              );
            }
          },
          {
            key: "open",
            value: function() {
              return this.connect();
            }
          },
          {
            key: "send",
            value: function() {
              for (
                var t = arguments.length, e = new Array(t), n = 0;
                n < t;
                n++
              )
                e[n] = arguments[n];
              return e.unshift("message"), this.emit.apply(this, e), this;
            }
          },
          {
            key: "emit",
            value: function(t) {
              if (Tt.hasOwnProperty(t))
                throw new Error('"' + t + '" is a reserved event name');
              for (
                var e = arguments.length,
                  n = new Array(e > 1 ? e - 1 : 0),
                  r = 1;
                r < e;
                r++
              )
                n[r - 1] = arguments[r];
              n.unshift(t);
              var o = { type: bt.EVENT, data: n, options: {} };
              if (
                ((o.options.compress = !1 !== this.flags.compress),
                "function" == typeof n[n.length - 1])
              ) {
                var i = this.ids++,
                  s = n.pop();
                this._registerAckCallback(i, s), (o.id = i);
              }
              var a =
                  this.io.engine &&
                  this.io.engine.transport &&
                  this.io.engine.transport.writable,
                c = this.flags.volatile && (!a || !this.connected);
              return (
                c ||
                  (this.connected ? this.packet(o) : this.sendBuffer.push(o)),
                (this.flags = {}),
                this
              );
            }
          },
          {
            key: "_registerAckCallback",
            value: function(t, e) {
              var n = this,
                r = this.flags.timeout;
              if (void 0 !== r) {
                var o = this.io.setTimeoutFn(function() {
                  delete n.acks[t];
                  for (var r = 0; r < n.sendBuffer.length; r++)
                    n.sendBuffer[r].id === t && n.sendBuffer.splice(r, 1);
                  e.call(n, new Error("operation has timed out"));
                }, r);
                this.acks[t] = function() {
                  n.io.clearTimeoutFn(o);
                  for (
                    var t = arguments.length, r = new Array(t), i = 0;
                    i < t;
                    i++
                  )
                    r[i] = arguments[i];
                  e.apply(n, [null].concat(r));
                };
              } else this.acks[t] = e;
            }
          },
          {
            key: "packet",
            value: function(t) {
              (t.nsp = this.nsp), this.io._packet(t);
            }
          },
          {
            key: "onopen",
            value: function() {
              var t = this;
              "function" == typeof this.auth
                ? this.auth(function(e) {
                    t.packet({ type: bt.CONNECT, data: e });
                  })
                : this.packet({ type: bt.CONNECT, data: this.auth });
            }
          },
          {
            key: "onerror",
            value: function(t) {
              this.connected || this.emitReserved("connect_error", t);
            }
          },
          {
            key: "onclose",
            value: function(t) {
              (this.connected = !1),
                (this.disconnected = !0),
                delete this.id,
                this.emitReserved("disconnect", t);
            }
          },
          {
            key: "onpacket",
            value: function(t) {
              if (t.nsp === this.nsp)
                switch (t.type) {
                  case bt.CONNECT:
                    if (t.data && t.data.sid) {
                      var e = t.data.sid;
                      this.onconnect(e);
                    } else
                      this.emitReserved(
                        "connect_error",
                        new Error(
                          "It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"
                        )
                      );
                    break;
                  case bt.EVENT:
                  case bt.BINARY_EVENT:
                    this.onevent(t);
                    break;
                  case bt.ACK:
                  case bt.BINARY_ACK:
                    this.onack(t);
                    break;
                  case bt.DISCONNECT:
                    this.ondisconnect();
                    break;
                  case bt.CONNECT_ERROR:
                    this.destroy();
                    var n = new Error(t.data.message);
                    (n.data = t.data.data),
                      this.emitReserved("connect_error", n);
                }
            }
          },
          {
            key: "onevent",
            value: function(t) {
              var e = t.data || [];
              null != t.id && e.push(this.ack(t.id)),
                this.connected
                  ? this.emitEvent(e)
                  : this.receiveBuffer.push(Object.freeze(e));
            }
          },
          {
            key: "emitEvent",
            value: function(t) {
              if (this._anyListeners && this._anyListeners.length) {
                var e,
                  n = p(this._anyListeners.slice());
                try {
                  for (n.s(); !(e = n.n()).done; ) {
                    e.value.apply(this, t);
                  }
                } catch (t) {
                  n.e(t);
                } finally {
                  n.f();
                }
              }
              f(s(o.prototype), "emit", this).apply(this, t);
            }
          },
          {
            key: "ack",
            value: function(t) {
              var e = this,
                n = !1;
              return function() {
                if (!n) {
                  n = !0;
                  for (
                    var r = arguments.length, o = new Array(r), i = 0;
                    i < r;
                    i++
                  )
                    o[i] = arguments[i];
                  e.packet({ type: bt.ACK, id: t, data: o });
                }
              };
            }
          },
          {
            key: "onack",
            value: function(t) {
              var e = this.acks[t.id];
              "function" == typeof e &&
                (e.apply(this, t.data), delete this.acks[t.id]);
            }
          },
          {
            key: "onconnect",
            value: function(t) {
              (this.id = t),
                (this.connected = !0),
                (this.disconnected = !1),
                this.emitBuffered(),
                this.emitReserved("connect");
            }
          },
          {
            key: "emitBuffered",
            value: function() {
              var t = this;
              this.receiveBuffer.forEach(function(e) {
                return t.emitEvent(e);
              }),
                (this.receiveBuffer = []),
                this.sendBuffer.forEach(function(e) {
                  return t.packet(e);
                }),
                (this.sendBuffer = []);
            }
          },
          {
            key: "ondisconnect",
            value: function() {
              this.destroy(), this.onclose("io server disconnect");
            }
          },
          {
            key: "destroy",
            value: function() {
              this.subs &&
                (this.subs.forEach(function(t) {
                  return t();
                }),
                (this.subs = void 0)),
                this.io._destroy(this);
            }
          },
          {
            key: "disconnect",
            value: function() {
              return (
                this.connected && this.packet({ type: bt.DISCONNECT }),
                this.destroy(),
                this.connected && this.onclose("io client disconnect"),
                this
              );
            }
          },
          {
            key: "close",
            value: function() {
              return this.disconnect();
            }
          },
          {
            key: "compress",
            value: function(t) {
              return (this.flags.compress = t), this;
            }
          },
          {
            key: "volatile",
            get: function() {
              return (this.flags.volatile = !0), this;
            }
          },
          {
            key: "timeout",
            value: function(t) {
              return (this.flags.timeout = t), this;
            }
          },
          {
            key: "onAny",
            value: function(t) {
              return (
                (this._anyListeners = this._anyListeners || []),
                this._anyListeners.push(t),
                this
              );
            }
          },
          {
            key: "prependAny",
            value: function(t) {
              return (
                (this._anyListeners = this._anyListeners || []),
                this._anyListeners.unshift(t),
                this
              );
            }
          },
          {
            key: "offAny",
            value: function(t) {
              if (!this._anyListeners) return this;
              if (t) {
                for (var e = this._anyListeners, n = 0; n < e.length; n++)
                  if (t === e[n]) return e.splice(n, 1), this;
              } else this._anyListeners = [];
              return this;
            }
          },
          {
            key: "listenersAny",
            value: function() {
              return this._anyListeners || [];
            }
          }
        ]),
        o
      );
    })(R),
    Ot = St;
  function St(t) {
    (t = t || {}),
      (this.ms = t.min || 100),
      (this.max = t.max || 1e4),
      (this.factor = t.factor || 2),
      (this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0),
      (this.attempts = 0);
  }
  (St.prototype.duration = function() {
    var t = this.ms * Math.pow(this.factor, this.attempts++);
    if (this.jitter) {
      var e = Math.random(),
        n = Math.floor(e * this.jitter * t);
      t = 0 == (1 & Math.floor(10 * e)) ? t - n : t + n;
    }
    return 0 | Math.min(t, this.max);
  }),
    (St.prototype.reset = function() {
      this.attempts = 0;
    }),
    (St.prototype.setMin = function(t) {
      this.ms = t;
    }),
    (St.prototype.setMax = function(t) {
      this.max = t;
    }),
    (St.prototype.setJitter = function(t) {
      this.jitter = t;
    });
  var Bt = (function(n) {
      i(s, n);
      var o = h(s);
      function s(n, r) {
        var i, a;
        e(this, s),
          ((i = o.call(this)).nsps = {}),
          (i.subs = []),
          n && "object" === t(n) && ((r = n), (n = void 0)),
          ((r = r || {}).path = r.path || "/socket.io"),
          (i.opts = r),
          A(c(i), r),
          i.reconnection(!1 !== r.reconnection),
          i.reconnectionAttempts(r.reconnectionAttempts || 1 / 0),
          i.reconnectionDelay(r.reconnectionDelay || 1e3),
          i.reconnectionDelayMax(r.reconnectionDelayMax || 5e3),
          i.randomizationFactor(
            null !== (a = r.randomizationFactor) && void 0 !== a ? a : 0.5
          ),
          (i.backoff = new Ot({
            min: i.reconnectionDelay(),
            max: i.reconnectionDelayMax(),
            jitter: i.randomizationFactor()
          })),
          i.timeout(null == r.timeout ? 2e4 : r.timeout),
          (i._readyState = "closed"),
          (i.uri = n);
        var u = r.parser || At;
        return (
          (i.encoder = new u.Encoder()),
          (i.decoder = new u.Decoder()),
          (i._autoConnect = !1 !== r.autoConnect),
          i._autoConnect && i.open(),
          i
        );
      }
      return (
        r(s, [
          {
            key: "reconnection",
            value: function(t) {
              return arguments.length
                ? ((this._reconnection = !!t), this)
                : this._reconnection;
            }
          },
          {
            key: "reconnectionAttempts",
            value: function(t) {
              return void 0 === t
                ? this._reconnectionAttempts
                : ((this._reconnectionAttempts = t), this);
            }
          },
          {
            key: "reconnectionDelay",
            value: function(t) {
              var e;
              return void 0 === t
                ? this._reconnectionDelay
                : ((this._reconnectionDelay = t),
                  null === (e = this.backoff) || void 0 === e || e.setMin(t),
                  this);
            }
          },
          {
            key: "randomizationFactor",
            value: function(t) {
              var e;
              return void 0 === t
                ? this._randomizationFactor
                : ((this._randomizationFactor = t),
                  null === (e = this.backoff) || void 0 === e || e.setJitter(t),
                  this);
            }
          },
          {
            key: "reconnectionDelayMax",
            value: function(t) {
              var e;
              return void 0 === t
                ? this._reconnectionDelayMax
                : ((this._reconnectionDelayMax = t),
                  null === (e = this.backoff) || void 0 === e || e.setMax(t),
                  this);
            }
          },
          {
            key: "timeout",
            value: function(t) {
              return arguments.length
                ? ((this._timeout = t), this)
                : this._timeout;
            }
          },
          {
            key: "maybeReconnectOnOpen",
            value: function() {
              !this._reconnecting &&
                this._reconnection &&
                0 === this.backoff.attempts &&
                this.reconnect();
            }
          },
          {
            key: "open",
            value: function(t) {
              var e = this;
              if (~this._readyState.indexOf("open")) return this;
              this.engine = new ut(this.uri, this.opts);
              var n = this.engine,
                r = this;
              (this._readyState = "opening"), (this.skipReconnect = !1);
              var o = Rt(n, "open", function() {
                  r.onopen(), t && t();
                }),
                i = Rt(n, "error", function(n) {
                  r.cleanup(),
                    (r._readyState = "closed"),
                    e.emitReserved("error", n),
                    t ? t(n) : r.maybeReconnectOnOpen();
                });
              if (!1 !== this._timeout) {
                var s = this._timeout;
                0 === s && o();
                var a = this.setTimeoutFn(function() {
                  o(), n.close(), n.emit("error", new Error("timeout"));
                }, s);
                this.opts.autoUnref && a.unref(),
                  this.subs.push(function() {
                    clearTimeout(a);
                  });
              }
              return this.subs.push(o), this.subs.push(i), this;
            }
          },
          {
            key: "connect",
            value: function(t) {
              return this.open(t);
            }
          },
          {
            key: "onopen",
            value: function() {
              this.cleanup(),
                (this._readyState = "open"),
                this.emitReserved("open");
              var t = this.engine;
              this.subs.push(
                Rt(t, "ping", this.onping.bind(this)),
                Rt(t, "data", this.ondata.bind(this)),
                Rt(t, "error", this.onerror.bind(this)),
                Rt(t, "close", this.onclose.bind(this)),
                Rt(this.decoder, "decoded", this.ondecoded.bind(this))
              );
            }
          },
          {
            key: "onping",
            value: function() {
              this.emitReserved("ping");
            }
          },
          {
            key: "ondata",
            value: function(t) {
              this.decoder.add(t);
            }
          },
          {
            key: "ondecoded",
            value: function(t) {
              this.emitReserved("packet", t);
            }
          },
          {
            key: "onerror",
            value: function(t) {
              this.emitReserved("error", t);
            }
          },
          {
            key: "socket",
            value: function(t, e) {
              var n = this.nsps[t];
              return n || ((n = new Ct(this, t, e)), (this.nsps[t] = n)), n;
            }
          },
          {
            key: "_destroy",
            value: function(t) {
              for (var e = 0, n = Object.keys(this.nsps); e < n.length; e++) {
                var r = n[e];
                if (this.nsps[r].active) return;
              }
              this._close();
            }
          },
          {
            key: "_packet",
            value: function(t) {
              for (var e = this.encoder.encode(t), n = 0; n < e.length; n++)
                this.engine.write(e[n], t.options);
            }
          },
          {
            key: "cleanup",
            value: function() {
              this.subs.forEach(function(t) {
                return t();
              }),
                (this.subs.length = 0),
                this.decoder.destroy();
            }
          },
          {
            key: "_close",
            value: function() {
              (this.skipReconnect = !0),
                (this._reconnecting = !1),
                this.onclose("forced close"),
                this.engine && this.engine.close();
            }
          },
          {
            key: "disconnect",
            value: function() {
              return this._close();
            }
          },
          {
            key: "onclose",
            value: function(t) {
              this.cleanup(),
                this.backoff.reset(),
                (this._readyState = "closed"),
                this.emitReserved("close", t),
                this._reconnection && !this.skipReconnect && this.reconnect();
            }
          },
          {
            key: "reconnect",
            value: function() {
              var t = this;
              if (this._reconnecting || this.skipReconnect) return this;
              var e = this;
              if (this.backoff.attempts >= this._reconnectionAttempts)
                this.backoff.reset(),
                  this.emitReserved("reconnect_failed"),
                  (this._reconnecting = !1);
              else {
                var n = this.backoff.duration();
                this._reconnecting = !0;
                var r = this.setTimeoutFn(function() {
                  e.skipReconnect ||
                    (t.emitReserved("reconnect_attempt", e.backoff.attempts),
                    e.skipReconnect ||
                      e.open(function(n) {
                        n
                          ? ((e._reconnecting = !1),
                            e.reconnect(),
                            t.emitReserved("reconnect_error", n))
                          : e.onreconnect();
                      }));
                }, n);
                this.opts.autoUnref && r.unref(),
                  this.subs.push(function() {
                    clearTimeout(r);
                  });
              }
            }
          },
          {
            key: "onreconnect",
            value: function() {
              var t = this.backoff.attempts;
              (this._reconnecting = !1),
                this.backoff.reset(),
                this.emitReserved("reconnect", t);
            }
          }
        ]),
        s
      );
    })(R),
    Nt = {};
  function xt(e, n) {
    "object" === t(e) && ((n = e), (e = void 0));
    var r,
      o = (function(t) {
        var e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
          n = arguments.length > 2 ? arguments[2] : void 0,
          r = t;
        (n = n || ("undefined" != typeof location && location)),
          null == t && (t = n.protocol + "//" + n.host),
          "string" == typeof t &&
            ("/" === t.charAt(0) &&
              (t = "/" === t.charAt(1) ? n.protocol + t : n.host + t),
            /^(https?|wss?):\/\//.test(t) ||
              (t = void 0 !== n ? n.protocol + "//" + t : "https://" + t),
            (r = v(t))),
          r.port ||
            (/^(http|ws)$/.test(r.protocol)
              ? (r.port = "80")
              : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")),
          (r.path = r.path || "/");
        var o = -1 !== r.host.indexOf(":") ? "[" + r.host + "]" : r.host;
        return (
          (r.id = r.protocol + "://" + o + ":" + r.port + e),
          (r.href =
            r.protocol +
            "://" +
            o +
            (n && n.port === r.port ? "" : ":" + r.port)),
          r
        );
      })(e, (n = n || {}).path || "/socket.io"),
      i = o.source,
      s = o.id,
      a = o.path,
      c = Nt[s] && a in Nt[s].nsps;
    return (
      n.forceNew || n["force new connection"] || !1 === n.multiplex || c
        ? (r = new Bt(i, n))
        : (Nt[s] || (Nt[s] = new Bt(i, n)), (r = Nt[s])),
      o.query && !n.query && (n.query = o.queryKey),
      r.socket(o.path, n)
    );
  }
  return o(xt, { Manager: Bt, Socket: Ct, io: xt, connect: xt }), xt;
});

// Promise Polyfill@8

!(function(e, n) {
  "object" == typeof exports && "undefined" != typeof module
    ? n()
    : "function" == typeof define && define.amd
    ? define(n)
    : n();
})(0, function() {
  "use strict";
  function e(e) {
    var n = this.constructor;
    return this.then(
      function(t) {
        return n.resolve(e()).then(function() {
          return t;
        });
      },
      function(t) {
        return n.resolve(e()).then(function() {
          return n.reject(t);
        });
      }
    );
  }
  function n(e) {
    return !(!e || "undefined" == typeof e.length);
  }
  function t() {}
  function o(e) {
    if (!(this instanceof o))
      throw new TypeError("Promises must be constructed via new");
    if ("function" != typeof e) throw new TypeError("not a function");
    (this._state = 0),
      (this._handled = !1),
      (this._value = undefined),
      (this._deferreds = []),
      c(e, this);
  }
  function r(e, n) {
    for (; 3 === e._state; ) e = e._value;
    0 !== e._state
      ? ((e._handled = !0),
        o._immediateFn(function() {
          var t = 1 === e._state ? n.onFulfilled : n.onRejected;
          if (null !== t) {
            var o;
            try {
              o = t(e._value);
            } catch (r) {
              return void f(n.promise, r);
            }
            i(n.promise, o);
          } else (1 === e._state ? i : f)(n.promise, e._value);
        }))
      : e._deferreds.push(n);
  }
  function i(e, n) {
    try {
      if (n === e)
        throw new TypeError("A promise cannot be resolved with itself.");
      if (n && ("object" == typeof n || "function" == typeof n)) {
        var t = n.then;
        if (n instanceof o) return (e._state = 3), (e._value = n), void u(e);
        if ("function" == typeof t)
          return void c(
            (function(e, n) {
              return function() {
                e.apply(n, arguments);
              };
            })(t, n),
            e
          );
      }
      (e._state = 1), (e._value = n), u(e);
    } catch (r) {
      f(e, r);
    }
  }
  function f(e, n) {
    (e._state = 2), (e._value = n), u(e);
  }
  function u(e) {
    2 === e._state &&
      0 === e._deferreds.length &&
      o._immediateFn(function() {
        e._handled || o._unhandledRejectionFn(e._value);
      });
    for (var n = 0, t = e._deferreds.length; t > n; n++) r(e, e._deferreds[n]);
    e._deferreds = null;
  }
  function c(e, n) {
    var t = !1;
    try {
      e(
        function(e) {
          t || ((t = !0), i(n, e));
        },
        function(e) {
          t || ((t = !0), f(n, e));
        }
      );
    } catch (o) {
      if (t) return;
      (t = !0), f(n, o);
    }
  }
  var a = setTimeout;
  (o.prototype["catch"] = function(e) {
    return this.then(null, e);
  }),
    (o.prototype.then = function(e, n) {
      var o = new this.constructor(t);
      return (
        r(
          this,
          new (function(e, n, t) {
            (this.onFulfilled = "function" == typeof e ? e : null),
              (this.onRejected = "function" == typeof n ? n : null),
              (this.promise = t);
          })(e, n, o)
        ),
        o
      );
    }),
    (o.prototype["finally"] = e),
    (o.all = function(e) {
      return new o(function(t, o) {
        function r(e, n) {
          try {
            if (n && ("object" == typeof n || "function" == typeof n)) {
              var u = n.then;
              if ("function" == typeof u)
                return void u.call(
                  n,
                  function(n) {
                    r(e, n);
                  },
                  o
                );
            }
            (i[e] = n), 0 == --f && t(i);
          } catch (c) {
            o(c);
          }
        }
        if (!n(e)) return o(new TypeError("Promise.all accepts an array"));
        var i = Array.prototype.slice.call(e);
        if (0 === i.length) return t([]);
        for (var f = i.length, u = 0; i.length > u; u++) r(u, i[u]);
      });
    }),
    (o.resolve = function(e) {
      return e && "object" == typeof e && e.constructor === o
        ? e
        : new o(function(n) {
            n(e);
          });
    }),
    (o.reject = function(e) {
      return new o(function(n, t) {
        t(e);
      });
    }),
    (o.race = function(e) {
      return new o(function(t, r) {
        if (!n(e)) return r(new TypeError("Promise.race accepts an array"));
        for (var i = 0, f = e.length; f > i; i++) o.resolve(e[i]).then(t, r);
      });
    }),
    (o._immediateFn =
      ("function" == typeof setImmediate &&
        function(e) {
          setImmediate(e);
        }) ||
      function(e) {
        a(e, 0);
      }),
    (o._unhandledRejectionFn = function(e) {
      void 0 !== console &&
        console &&
        console.warn("Possible Unhandled Promise Rejection:", e);
    });
  var l = (function() {
    if ("undefined" != typeof self) return self;
    if ("undefined" != typeof window) return window;
    if ("undefined" != typeof global) return global;
    throw Error("unable to locate global object");
  })();
  "Promise" in l
    ? l.Promise.prototype["finally"] || (l.Promise.prototype["finally"] = e)
    : (l.Promise = o);
});
// Fingerprintjs2 - Copyright (c) 2019 Valentin Vasilyev (valentin.vasilyev@outlook.com)
// Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.

!(function(e, t, a) {
  "use strict";
  "undefined" != typeof window && "function" == typeof define && define.amd
    ? define(a)
    : "undefined" != typeof module && module.exports
    ? (module.exports = a())
    : t.exports
    ? (t.exports = a())
    : (t.Fingerprint2 = a());
})(0, this, function() {
  "use strict";
  var d = function(e, t) {
      (e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]]),
        (t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]]);
      var a = [0, 0, 0, 0];
      return (
        (a[3] += e[3] + t[3]),
        (a[2] += a[3] >>> 16),
        (a[3] &= 65535),
        (a[2] += e[2] + t[2]),
        (a[1] += a[2] >>> 16),
        (a[2] &= 65535),
        (a[1] += e[1] + t[1]),
        (a[0] += a[1] >>> 16),
        (a[1] &= 65535),
        (a[0] += e[0] + t[0]),
        (a[0] &= 65535),
        [(a[0] << 16) | a[1], (a[2] << 16) | a[3]]
      );
    },
    g = function(e, t) {
      (e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]]),
        (t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]]);
      var a = [0, 0, 0, 0];
      return (
        (a[3] += e[3] * t[3]),
        (a[2] += a[3] >>> 16),
        (a[3] &= 65535),
        (a[2] += e[2] * t[3]),
        (a[1] += a[2] >>> 16),
        (a[2] &= 65535),
        (a[2] += e[3] * t[2]),
        (a[1] += a[2] >>> 16),
        (a[2] &= 65535),
        (a[1] += e[1] * t[3]),
        (a[0] += a[1] >>> 16),
        (a[1] &= 65535),
        (a[1] += e[2] * t[2]),
        (a[0] += a[1] >>> 16),
        (a[1] &= 65535),
        (a[1] += e[3] * t[1]),
        (a[0] += a[1] >>> 16),
        (a[1] &= 65535),
        (a[0] += e[0] * t[3] + e[1] * t[2] + e[2] * t[1] + e[3] * t[0]),
        (a[0] &= 65535),
        [(a[0] << 16) | a[1], (a[2] << 16) | a[3]]
      );
    },
    f = function(e, t) {
      return 32 === (t %= 64)
        ? [e[1], e[0]]
        : t < 32
        ? [(e[0] << t) | (e[1] >>> (32 - t)), (e[1] << t) | (e[0] >>> (32 - t))]
        : ((t -= 32),
          [
            (e[1] << t) | (e[0] >>> (32 - t)),
            (e[0] << t) | (e[1] >>> (32 - t))
          ]);
    },
    h = function(e, t) {
      return 0 === (t %= 64)
        ? e
        : t < 32
        ? [(e[0] << t) | (e[1] >>> (32 - t)), e[1] << t]
        : [e[1] << (t - 32), 0];
    },
    m = function(e, t) {
      return [e[0] ^ t[0], e[1] ^ t[1]];
    },
    T = function(e) {
      return (
        (e = m(e, [0, e[0] >>> 1])),
        (e = g(e, [4283543511, 3981806797])),
        (e = m(e, [0, e[0] >>> 1])),
        (e = g(e, [3301882366, 444984403])),
        (e = m(e, [0, e[0] >>> 1]))
      );
    },
    l = function(e, t) {
      t = t || 0;
      for (
        var a = (e = e || "").length % 16,
          n = e.length - a,
          r = [0, t],
          i = [0, t],
          o = [0, 0],
          l = [0, 0],
          s = [2277735313, 289559509],
          c = [1291169091, 658871167],
          u = 0;
        u < n;
        u += 16
      )
        (o = [
          (255 & e.charCodeAt(u + 4)) |
            ((255 & e.charCodeAt(u + 5)) << 8) |
            ((255 & e.charCodeAt(u + 6)) << 16) |
            ((255 & e.charCodeAt(u + 7)) << 24),
          (255 & e.charCodeAt(u)) |
            ((255 & e.charCodeAt(u + 1)) << 8) |
            ((255 & e.charCodeAt(u + 2)) << 16) |
            ((255 & e.charCodeAt(u + 3)) << 24)
        ]),
          (l = [
            (255 & e.charCodeAt(u + 12)) |
              ((255 & e.charCodeAt(u + 13)) << 8) |
              ((255 & e.charCodeAt(u + 14)) << 16) |
              ((255 & e.charCodeAt(u + 15)) << 24),
            (255 & e.charCodeAt(u + 8)) |
              ((255 & e.charCodeAt(u + 9)) << 8) |
              ((255 & e.charCodeAt(u + 10)) << 16) |
              ((255 & e.charCodeAt(u + 11)) << 24)
          ]),
          (o = g(o, s)),
          (o = f(o, 31)),
          (o = g(o, c)),
          (r = m(r, o)),
          (r = f(r, 27)),
          (r = d(r, i)),
          (r = d(g(r, [0, 5]), [0, 1390208809])),
          (l = g(l, c)),
          (l = f(l, 33)),
          (l = g(l, s)),
          (i = m(i, l)),
          (i = f(i, 31)),
          (i = d(i, r)),
          (i = d(g(i, [0, 5]), [0, 944331445]));
      switch (((o = [0, 0]), (l = [0, 0]), a)) {
        case 15:
          l = m(l, h([0, e.charCodeAt(u + 14)], 48));
        case 14:
          l = m(l, h([0, e.charCodeAt(u + 13)], 40));
        case 13:
          l = m(l, h([0, e.charCodeAt(u + 12)], 32));
        case 12:
          l = m(l, h([0, e.charCodeAt(u + 11)], 24));
        case 11:
          l = m(l, h([0, e.charCodeAt(u + 10)], 16));
        case 10:
          l = m(l, h([0, e.charCodeAt(u + 9)], 8));
        case 9:
          (l = m(l, [0, e.charCodeAt(u + 8)])),
            (l = g(l, c)),
            (l = f(l, 33)),
            (l = g(l, s)),
            (i = m(i, l));
        case 8:
          o = m(o, h([0, e.charCodeAt(u + 7)], 56));
        case 7:
          o = m(o, h([0, e.charCodeAt(u + 6)], 48));
        case 6:
          o = m(o, h([0, e.charCodeAt(u + 5)], 40));
        case 5:
          o = m(o, h([0, e.charCodeAt(u + 4)], 32));
        case 4:
          o = m(o, h([0, e.charCodeAt(u + 3)], 24));
        case 3:
          o = m(o, h([0, e.charCodeAt(u + 2)], 16));
        case 2:
          o = m(o, h([0, e.charCodeAt(u + 1)], 8));
        case 1:
          (o = m(o, [0, e.charCodeAt(u)])),
            (o = g(o, s)),
            (o = f(o, 31)),
            (o = g(o, c)),
            (r = m(r, o));
      }
      return (
        (r = m(r, [0, e.length])),
        (i = m(i, [0, e.length])),
        (r = d(r, i)),
        (i = d(i, r)),
        (r = T(r)),
        (i = T(i)),
        (r = d(r, i)),
        (i = d(i, r)),
        ("00000000" + (r[0] >>> 0).toString(16)).slice(-8) +
          ("00000000" + (r[1] >>> 0).toString(16)).slice(-8) +
          ("00000000" + (i[0] >>> 0).toString(16)).slice(-8) +
          ("00000000" + (i[1] >>> 0).toString(16)).slice(-8)
      );
    },
    e = {
      preprocessor: null,
      audio: { timeout: 1e3, excludeIOS11: !0 },
      fonts: {
        swfContainerId: "fingerprintjs2",
        swfPath: "flash/compiled/FontList.swf",
        userDefinedFonts: [],
        extendedJsFonts: !1
      },
      screen: { detectScreenOrientation: !0 },
      plugins: { sortPluginsFor: [/palemoon/i], excludeIE: !1 },
      extraComponents: [],
      excludes: {
        enumerateDevices: !0,
        pixelRatio: !0,
        doNotTrack: !0,
        fontsFlash: !0
      },
      NOT_AVAILABLE: "not available",
      ERROR: "error",
      EXCLUDED: "excluded"
    },
    c = function(e, t) {
      if (Array.prototype.forEach && e.forEach === Array.prototype.forEach)
        e.forEach(t);
      else if (e.length === +e.length)
        for (var a = 0, n = e.length; a < n; a++) t(e[a], a, e);
      else for (var r in e) e.hasOwnProperty(r) && t(e[r], r, e);
    },
    s = function(e, n) {
      var r = [];
      return null == e
        ? r
        : Array.prototype.map && e.map === Array.prototype.map
        ? e.map(n)
        : (c(e, function(e, t, a) {
            r.push(n(e, t, a));
          }),
          r);
    },
    a = function() {
      return navigator.mediaDevices && navigator.mediaDevices.enumerateDevices;
    },
    n = function(e) {
      var t = [window.screen.width, window.screen.height];
      return e.screen.detectScreenOrientation && t.sort().reverse(), t;
    },
    r = function(e) {
      if (window.screen.availWidth && window.screen.availHeight) {
        var t = [window.screen.availHeight, window.screen.availWidth];
        return e.screen.detectScreenOrientation && t.sort().reverse(), t;
      }
      return e.NOT_AVAILABLE;
    },
    i = function(e) {
      if (null == navigator.plugins) return e.NOT_AVAILABLE;
      for (var t = [], a = 0, n = navigator.plugins.length; a < n; a++)
        navigator.plugins[a] && t.push(navigator.plugins[a]);
      return (
        u(e) &&
          (t = t.sort(function(e, t) {
            return e.name > t.name ? 1 : e.name < t.name ? -1 : 0;
          })),
        s(t, function(e) {
          var t = s(e, function(e) {
            return [e.type, e.suffixes];
          });
          return [e.name, e.description, t];
        })
      );
    },
    o = function(t) {
      var e = [];
      if (
        (Object.getOwnPropertyDescriptor &&
          Object.getOwnPropertyDescriptor(window, "ActiveXObject")) ||
        "ActiveXObject" in window
      ) {
        e = s(
          [
            "AcroPDF.PDF",
            "Adodb.Stream",
            "AgControl.AgControl",
            "DevalVRXCtrl.DevalVRXCtrl.1",
            "MacromediaFlashPaper.MacromediaFlashPaper",
            "Msxml2.DOMDocument",
            "Msxml2.XMLHTTP",
            "PDF.PdfCtrl",
            "QuickTime.QuickTime",
            "QuickTimeCheckObject.QuickTimeCheck.1",
            "RealPlayer",
            "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)",
            "RealVideo.RealVideo(tm) ActiveX Control (32-bit)",
            "Scripting.Dictionary",
            "SWCtl.SWCtl",
            "Shell.UIHelper",
            "ShockwaveFlash.ShockwaveFlash",
            "Skype.Detection",
            "TDCCtl.TDCCtl",
            "WMPlayer.OCX",
            "rmocx.RealPlayer G2 Control",
            "rmocx.RealPlayer G2 Control.1"
          ],
          function(e) {
            try {
              return new window.ActiveXObject(e), e;
            } catch (e) {
              return t.ERROR;
            }
          }
        );
      } else e.push(t.NOT_AVAILABLE);
      return navigator.plugins && (e = e.concat(i(t))), e;
    },
    u = function(e) {
      for (var t = !1, a = 0, n = e.plugins.sortPluginsFor.length; a < n; a++) {
        var r = e.plugins.sortPluginsFor[a];
        if (navigator.userAgent.match(r)) {
          t = !0;
          break;
        }
      }
      return t;
    },
    p = function(t) {
      try {
        return !!window.sessionStorage;
      } catch (e) {
        return t.ERROR;
      }
    },
    v = function(t) {
      try {
        return !!window.localStorage;
      } catch (e) {
        return t.ERROR;
      }
    },
    A = function(t) {
      try {
        return !!window.indexedDB;
      } catch (e) {
        return t.ERROR;
      }
    },
    S = function(e) {
      return navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency
        : e.NOT_AVAILABLE;
    },
    C = function(e) {
      return navigator.cpuClass || e.NOT_AVAILABLE;
    },
    B = function(e) {
      return navigator.platform ? navigator.platform : e.NOT_AVAILABLE;
    },
    w = function(e) {
      return navigator.doNotTrack
        ? navigator.doNotTrack
        : navigator.msDoNotTrack
        ? navigator.msDoNotTrack
        : window.doNotTrack
        ? window.doNotTrack
        : e.NOT_AVAILABLE;
    },
    t = function() {
      var t,
        e = 0;
      void 0 !== navigator.maxTouchPoints
        ? (e = navigator.maxTouchPoints)
        : void 0 !== navigator.msMaxTouchPoints &&
          (e = navigator.msMaxTouchPoints);
      try {
        document.createEvent("TouchEvent"), (t = !0);
      } catch (e) {
        t = !1;
      }
      return [e, t, "ontouchstart" in window];
    },
    y = function(e) {
      var t = [],
        a = document.createElement("canvas");
      (a.width = 2e3), (a.height = 200), (a.style.display = "inline");
      var n = a.getContext("2d");
      return (
        n.rect(0, 0, 10, 10),
        n.rect(2, 2, 6, 6),
        t.push(
          "canvas winding:" +
            (!1 === n.isPointInPath(5, 5, "evenodd") ? "yes" : "no")
        ),
        (n.textBaseline = "alphabetic"),
        (n.fillStyle = "#f60"),
        n.fillRect(125, 1, 62, 20),
        (n.fillStyle = "#069"),
        e.dontUseFakeFontInCanvas
          ? (n.font = "11pt Arial")
          : (n.font = "11pt no-real-font-123"),
        n.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 2, 15),
        (n.fillStyle = "rgba(102, 204, 0, 0.2)"),
        (n.font = "18pt Arial"),
        n.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 4, 45),
        (n.globalCompositeOperation = "multiply"),
        (n.fillStyle = "rgb(255,0,255)"),
        n.beginPath(),
        n.arc(50, 50, 50, 0, 2 * Math.PI, !0),
        n.closePath(),
        n.fill(),
        (n.fillStyle = "rgb(0,255,255)"),
        n.beginPath(),
        n.arc(100, 50, 50, 0, 2 * Math.PI, !0),
        n.closePath(),
        n.fill(),
        (n.fillStyle = "rgb(255,255,0)"),
        n.beginPath(),
        n.arc(75, 100, 50, 0, 2 * Math.PI, !0),
        n.closePath(),
        n.fill(),
        (n.fillStyle = "rgb(255,0,255)"),
        n.arc(75, 75, 75, 0, 2 * Math.PI, !0),
        n.arc(75, 75, 25, 0, 2 * Math.PI, !0),
        n.fill("evenodd"),
        a.toDataURL && t.push("canvas fp:" + a.toDataURL()),
        t
      );
    },
    E = function() {
      var o,
        e = function(e) {
          return (
            o.clearColor(0, 0, 0, 1),
            o.enable(o.DEPTH_TEST),
            o.depthFunc(o.LEQUAL),
            o.clear(o.COLOR_BUFFER_BIT | o.DEPTH_BUFFER_BIT),
            "[" + e[0] + ", " + e[1] + "]"
          );
        };
      if (!(o = F())) return null;
      var l = [],
        t = o.createBuffer();
      o.bindBuffer(o.ARRAY_BUFFER, t);
      var a = new Float32Array([
        -0.2,
        -0.9,
        0,
        0.4,
        -0.26,
        0,
        0,
        0.732134444,
        0
      ]);
      o.bufferData(o.ARRAY_BUFFER, a, o.STATIC_DRAW),
        (t.itemSize = 3),
        (t.numItems = 3);
      var n = o.createProgram(),
        r = o.createShader(o.VERTEX_SHADER);
      o.shaderSource(
        r,
        "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}"
      ),
        o.compileShader(r);
      var i = o.createShader(o.FRAGMENT_SHADER);
      o.shaderSource(
        i,
        "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}"
      ),
        o.compileShader(i),
        o.attachShader(n, r),
        o.attachShader(n, i),
        o.linkProgram(n),
        o.useProgram(n),
        (n.vertexPosAttrib = o.getAttribLocation(n, "attrVertex")),
        (n.offsetUniform = o.getUniformLocation(n, "uniformOffset")),
        o.enableVertexAttribArray(n.vertexPosArray),
        o.vertexAttribPointer(n.vertexPosAttrib, t.itemSize, o.FLOAT, !1, 0, 0),
        o.uniform2f(n.offsetUniform, 1, 1),
        o.drawArrays(o.TRIANGLE_STRIP, 0, t.numItems);
      try {
        l.push(o.canvas.toDataURL());
      } catch (e) {}
      l.push("extensions:" + (o.getSupportedExtensions() || []).join(";")),
        l.push(
          "webgl aliased line width range:" +
            e(o.getParameter(o.ALIASED_LINE_WIDTH_RANGE))
        ),
        l.push(
          "webgl aliased point size range:" +
            e(o.getParameter(o.ALIASED_POINT_SIZE_RANGE))
        ),
        l.push("webgl alpha bits:" + o.getParameter(o.ALPHA_BITS)),
        l.push(
          "webgl antialiasing:" +
            (o.getContextAttributes().antialias ? "yes" : "no")
        ),
        l.push("webgl blue bits:" + o.getParameter(o.BLUE_BITS)),
        l.push("webgl depth bits:" + o.getParameter(o.DEPTH_BITS)),
        l.push("webgl green bits:" + o.getParameter(o.GREEN_BITS)),
        l.push(
          "webgl max anisotropy:" +
            (function(e) {
              var t =
                e.getExtension("EXT_texture_filter_anisotropic") ||
                e.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
                e.getExtension("MOZ_EXT_texture_filter_anisotropic");
              if (t) {
                var a = e.getParameter(t.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                return 0 === a && (a = 2), a;
              }
              return null;
            })(o)
        ),
        l.push(
          "webgl max combined texture image units:" +
            o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
        ),
        l.push(
          "webgl max cube map texture size:" +
            o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE)
        ),
        l.push(
          "webgl max fragment uniform vectors:" +
            o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS)
        ),
        l.push(
          "webgl max render buffer size:" +
            o.getParameter(o.MAX_RENDERBUFFER_SIZE)
        ),
        l.push(
          "webgl max texture image units:" +
            o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS)
        ),
        l.push("webgl max texture size:" + o.getParameter(o.MAX_TEXTURE_SIZE)),
        l.push(
          "webgl max varying vectors:" + o.getParameter(o.MAX_VARYING_VECTORS)
        ),
        l.push(
          "webgl max vertex attribs:" + o.getParameter(o.MAX_VERTEX_ATTRIBS)
        ),
        l.push(
          "webgl max vertex texture image units:" +
            o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS)
        ),
        l.push(
          "webgl max vertex uniform vectors:" +
            o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS)
        ),
        l.push(
          "webgl max viewport dims:" + e(o.getParameter(o.MAX_VIEWPORT_DIMS))
        ),
        l.push("webgl red bits:" + o.getParameter(o.RED_BITS)),
        l.push("webgl renderer:" + o.getParameter(o.RENDERER)),
        l.push(
          "webgl shading language version:" +
            o.getParameter(o.SHADING_LANGUAGE_VERSION)
        ),
        l.push("webgl stencil bits:" + o.getParameter(o.STENCIL_BITS)),
        l.push("webgl vendor:" + o.getParameter(o.VENDOR)),
        l.push("webgl version:" + o.getParameter(o.VERSION));
      try {
        var s = o.getExtension("WEBGL_debug_renderer_info");
        s &&
          (l.push(
            "webgl unmasked vendor:" + o.getParameter(s.UNMASKED_VENDOR_WEBGL)
          ),
          l.push(
            "webgl unmasked renderer:" +
              o.getParameter(s.UNMASKED_RENDERER_WEBGL)
          ));
      } catch (e) {}
      return (
        o.getShaderPrecisionFormat &&
          c(["FLOAT", "INT"], function(i) {
            c(["VERTEX", "FRAGMENT"], function(r) {
              c(["HIGH", "MEDIUM", "LOW"], function(n) {
                c(["precision", "rangeMin", "rangeMax"], function(e) {
                  var t = o.getShaderPrecisionFormat(
                    o[r + "_SHADER"],
                    o[n + "_" + i]
                  )[e];
                  "precision" !== e && (e = "precision " + e);
                  var a = [
                    "webgl ",
                    r.toLowerCase(),
                    " shader ",
                    n.toLowerCase(),
                    " ",
                    i.toLowerCase(),
                    " ",
                    e,
                    ":",
                    t
                  ].join("");
                  l.push(a);
                });
              });
            });
          }),
        l
      );
    },
    M = function() {
      try {
        var e = F(),
          t = e.getExtension("WEBGL_debug_renderer_info");
        return (
          e.getParameter(t.UNMASKED_VENDOR_WEBGL) +
          "~" +
          e.getParameter(t.UNMASKED_RENDERER_WEBGL)
        );
      } catch (e) {
        return null;
      }
    },
    x = function() {
      var e = document.createElement("div");
      e.innerHTML = "&nbsp;";
      var t = !(e.className = "adsbox");
      try {
        document.body.appendChild(e),
          (t = 0 === document.getElementsByClassName("adsbox")[0].offsetHeight),
          document.body.removeChild(e);
      } catch (e) {
        t = !1;
      }
      return t;
    },
    O = function() {
      if (void 0 !== navigator.languages)
        try {
          if (
            navigator.languages[0].substr(0, 2) !==
            navigator.language.substr(0, 2)
          )
            return !0;
        } catch (e) {
          return !0;
        }
      return !1;
    },
    b = function() {
      return (
        window.screen.width < window.screen.availWidth ||
        window.screen.height < window.screen.availHeight
      );
    },
    P = function() {
      var e,
        t = navigator.userAgent.toLowerCase(),
        a = navigator.oscpu,
        n = navigator.platform.toLowerCase();
      if (
        ((e =
          0 <= t.indexOf("windows phone")
            ? "Windows Phone"
            : 0 <= t.indexOf("win")
            ? "Windows"
            : 0 <= t.indexOf("android")
            ? "Android"
            : 0 <= t.indexOf("linux") || 0 <= t.indexOf("cros")
            ? "Linux"
            : 0 <= t.indexOf("iphone") || 0 <= t.indexOf("ipad")
            ? "iOS"
            : 0 <= t.indexOf("mac")
            ? "Mac"
            : "Other"),
        ("ontouchstart" in window ||
          0 < navigator.maxTouchPoints ||
          0 < navigator.msMaxTouchPoints) &&
          "Windows Phone" !== e &&
          "Android" !== e &&
          "iOS" !== e &&
          "Other" !== e)
      )
        return !0;
      if (void 0 !== a) {
        if (
          0 <= (a = a.toLowerCase()).indexOf("win") &&
          "Windows" !== e &&
          "Windows Phone" !== e
        )
          return !0;
        if (0 <= a.indexOf("linux") && "Linux" !== e && "Android" !== e)
          return !0;
        if (0 <= a.indexOf("mac") && "Mac" !== e && "iOS" !== e) return !0;
        if (
          (-1 === a.indexOf("win") &&
            -1 === a.indexOf("linux") &&
            -1 === a.indexOf("mac")) !=
          ("Other" === e)
        )
          return !0;
      }
      return (
        (0 <= n.indexOf("win") && "Windows" !== e && "Windows Phone" !== e) ||
        ((0 <= n.indexOf("linux") ||
          0 <= n.indexOf("android") ||
          0 <= n.indexOf("pike")) &&
          "Linux" !== e &&
          "Android" !== e) ||
        ((0 <= n.indexOf("mac") ||
          0 <= n.indexOf("ipad") ||
          0 <= n.indexOf("ipod") ||
          0 <= n.indexOf("iphone")) &&
          "Mac" !== e &&
          "iOS" !== e) ||
        (n.indexOf("win") < 0 &&
          n.indexOf("linux") < 0 &&
          n.indexOf("mac") < 0 &&
          n.indexOf("iphone") < 0 &&
          n.indexOf("ipad") < 0) !==
          ("Other" === e) ||
        (void 0 === navigator.plugins &&
          "Windows" !== e &&
          "Windows Phone" !== e)
      );
    },
    L = function() {
      var e,
        t = navigator.userAgent.toLowerCase(),
        a = navigator.productSub;
      if (
        ("Chrome" ===
          (e =
            0 <= t.indexOf("firefox")
              ? "Firefox"
              : 0 <= t.indexOf("opera") || 0 <= t.indexOf("opr")
              ? "Opera"
              : 0 <= t.indexOf("chrome")
              ? "Chrome"
              : 0 <= t.indexOf("safari")
              ? "Safari"
              : 0 <= t.indexOf("trident")
              ? "Internet Explorer"
              : "Other") ||
          "Safari" === e ||
          "Opera" === e) &&
        "20030107" !== a
      )
        return !0;
      var n,
        r = eval.toString().length;
      if (37 === r && "Safari" !== e && "Firefox" !== e && "Other" !== e)
        return !0;
      if (39 === r && "Internet Explorer" !== e && "Other" !== e) return !0;
      if (33 === r && "Chrome" !== e && "Opera" !== e && "Other" !== e)
        return !0;
      try {
        throw "a";
      } catch (e) {
        try {
          e.toSource(), (n = !0);
        } catch (e) {
          n = !1;
        }
      }
      return n && "Firefox" !== e && "Other" !== e;
    },
    I = function() {
      var e = document.createElement("canvas");
      return !(!e.getContext || !e.getContext("2d"));
    },
    k = function() {
      if (!I()) return !1;
      var e = F();
      return !!window.WebGLRenderingContext && !!e;
    },
    R = function() {
      return (
        "Microsoft Internet Explorer" === navigator.appName ||
        !(
          "Netscape" !== navigator.appName ||
          !/Trident/.test(navigator.userAgent)
        )
      );
    },
    D = function() {
      return void 0 !== window.swfobject;
    },
    N = function() {
      return window.swfobject.hasFlashPlayerVersion("9.0.0");
    },
    _ = function(t, e) {
      var a = "___fp_swf_loaded";
      window[a] = function(e) {
        t(e);
      };
      var n,
        r,
        i = e.fonts.swfContainerId;
      (r = document.createElement("div")).setAttribute(
        "id",
        n.fonts.swfContainerId
      ),
        document.body.appendChild(r);
      var o = { onReady: a };
      window.swfobject.embedSWF(
        e.fonts.swfPath,
        i,
        "1",
        "1",
        "9.0.0",
        !1,
        o,
        { allowScriptAccess: "always", menu: "false" },
        {}
      );
    },
    F = function() {
      var e = document.createElement("canvas"),
        t = null;
      try {
        t = e.getContext("webgl") || e.getContext("experimental-webgl");
      } catch (e) {}
      return t || (t = null), t;
    },
    G = [
      {
        key: "userAgent",
        getData: function(e) {
          e(navigator.userAgent);
        }
      },
      {
        key: "webdriver",
        getData: function(e, t) {
          e(
            null == navigator.webdriver ? t.NOT_AVAILABLE : navigator.webdriver
          );
        }
      },
      {
        key: "language",
        getData: function(e, t) {
          e(
            navigator.language ||
              navigator.userLanguage ||
              navigator.browserLanguage ||
              navigator.systemLanguage ||
              t.NOT_AVAILABLE
          );
        }
      },
      {
        key: "colorDepth",
        getData: function(e, t) {
          e(window.screen.colorDepth || t.NOT_AVAILABLE);
        }
      },
      {
        key: "deviceMemory",
        getData: function(e, t) {
          e(navigator.deviceMemory || t.NOT_AVAILABLE);
        }
      },
      {
        key: "pixelRatio",
        getData: function(e, t) {
          e(window.devicePixelRatio || t.NOT_AVAILABLE);
        }
      },
      {
        key: "hardwareConcurrency",
        getData: function(e, t) {
          e(S(t));
        }
      },
      {
        key: "screenResolution",
        getData: function(e, t) {
          e(n(t));
        }
      },
      {
        key: "availableScreenResolution",
        getData: function(e, t) {
          e(r(t));
        }
      },
      {
        key: "timezoneOffset",
        getData: function(e) {
          e(new Date().getTimezoneOffset());
        }
      },
      {
        key: "timezone",
        getData: function(e, t) {
          window.Intl && window.Intl.DateTimeFormat
            ? e(new window.Intl.DateTimeFormat().resolvedOptions().timeZone)
            : e(t.NOT_AVAILABLE);
        }
      },
      {
        key: "sessionStorage",
        getData: function(e, t) {
          e(p(t));
        }
      },
      {
        key: "localStorage",
        getData: function(e, t) {
          e(v(t));
        }
      },
      {
        key: "indexedDb",
        getData: function(e, t) {
          e(A(t));
        }
      },
      {
        key: "addBehavior",
        getData: function(e) {
          e(!(!document.body || !document.body.addBehavior));
        }
      },
      {
        key: "openDatabase",
        getData: function(e) {
          e(!!window.openDatabase);
        }
      },
      {
        key: "cpuClass",
        getData: function(e, t) {
          e(C(t));
        }
      },
      {
        key: "platform",
        getData: function(e, t) {
          e(B(t));
        }
      },
      {
        key: "doNotTrack",
        getData: function(e, t) {
          e(w(t));
        }
      },
      {
        key: "plugins",
        getData: function(e, t) {
          R() ? (t.plugins.excludeIE ? e(t.EXCLUDED) : e(o(t))) : e(i(t));
        }
      },
      {
        key: "canvas",
        getData: function(e, t) {
          I() ? e(y(t)) : e(t.NOT_AVAILABLE);
        }
      },
      {
        key: "webgl",
        getData: function(e, t) {
          k() ? e(E()) : e(t.NOT_AVAILABLE);
        }
      },
      {
        key: "webglVendorAndRenderer",
        getData: function(e) {
          k() ? e(M()) : e();
        }
      },
      {
        key: "adBlock",
        getData: function(e) {
          e(x());
        }
      },
      {
        key: "hasLiedLanguages",
        getData: function(e) {
          e(O());
        }
      },
      {
        key: "hasLiedResolution",
        getData: function(e) {
          e(b());
        }
      },
      {
        key: "hasLiedOs",
        getData: function(e) {
          e(P());
        }
      },
      {
        key: "hasLiedBrowser",
        getData: function(e) {
          e(L());
        }
      },
      {
        key: "touchSupport",
        getData: function(e) {
          e(t());
        }
      },
      {
        key: "fonts",
        getData: function(e, t) {
          var u = ["monospace", "sans-serif", "serif"],
            d = [
              "Andale Mono",
              "Arial",
              "Arial Black",
              "Arial Hebrew",
              "Arial MT",
              "Arial Narrow",
              "Arial Rounded MT Bold",
              "Arial Unicode MS",
              "Bitstream Vera Sans Mono",
              "Book Antiqua",
              "Bookman Old Style",
              "Calibri",
              "Cambria",
              "Cambria Math",
              "Century",
              "Century Gothic",
              "Century Schoolbook",
              "Comic Sans",
              "Comic Sans MS",
              "Consolas",
              "Courier",
              "Courier New",
              "Geneva",
              "Georgia",
              "Helvetica",
              "Helvetica Neue",
              "Impact",
              "Lucida Bright",
              "Lucida Calligraphy",
              "Lucida Console",
              "Lucida Fax",
              "LUCIDA GRANDE",
              "Lucida Handwriting",
              "Lucida Sans",
              "Lucida Sans Typewriter",
              "Lucida Sans Unicode",
              "Microsoft Sans Serif",
              "Monaco",
              "Monotype Corsiva",
              "MS Gothic",
              "MS Outlook",
              "MS PGothic",
              "MS Reference Sans Serif",
              "MS Sans Serif",
              "MS Serif",
              "MYRIAD",
              "MYRIAD PRO",
              "Palatino",
              "Palatino Linotype",
              "Segoe Print",
              "Segoe Script",
              "Segoe UI",
              "Segoe UI Light",
              "Segoe UI Semibold",
              "Segoe UI Symbol",
              "Tahoma",
              "Times",
              "Times New Roman",
              "Times New Roman PS",
              "Trebuchet MS",
              "Verdana",
              "Wingdings",
              "Wingdings 2",
              "Wingdings 3"
            ];
          t.fonts.extendedJsFonts &&
            (d = d.concat([
              "Abadi MT Condensed Light",
              "Academy Engraved LET",
              "ADOBE CASLON PRO",
              "Adobe Garamond",
              "ADOBE GARAMOND PRO",
              "Agency FB",
              "Aharoni",
              "Albertus Extra Bold",
              "Albertus Medium",
              "Algerian",
              "Amazone BT",
              "American Typewriter",
              "American Typewriter Condensed",
              "AmerType Md BT",
              "Andalus",
              "Angsana New",
              "AngsanaUPC",
              "Antique Olive",
              "Aparajita",
              "Apple Chancery",
              "Apple Color Emoji",
              "Apple SD Gothic Neo",
              "Arabic Typesetting",
              "ARCHER",
              "ARNO PRO",
              "Arrus BT",
              "Aurora Cn BT",
              "AvantGarde Bk BT",
              "AvantGarde Md BT",
              "AVENIR",
              "Ayuthaya",
              "Bandy",
              "Bangla Sangam MN",
              "Bank Gothic",
              "BankGothic Md BT",
              "Baskerville",
              "Baskerville Old Face",
              "Batang",
              "BatangChe",
              "Bauer Bodoni",
              "Bauhaus 93",
              "Bazooka",
              "Bell MT",
              "Bembo",
              "Benguiat Bk BT",
              "Berlin Sans FB",
              "Berlin Sans FB Demi",
              "Bernard MT Condensed",
              "BernhardFashion BT",
              "BernhardMod BT",
              "Big Caslon",
              "BinnerD",
              "Blackadder ITC",
              "BlairMdITC TT",
              "Bodoni 72",
              "Bodoni 72 Oldstyle",
              "Bodoni 72 Smallcaps",
              "Bodoni MT",
              "Bodoni MT Black",
              "Bodoni MT Condensed",
              "Bodoni MT Poster Compressed",
              "Bookshelf Symbol 7",
              "Boulder",
              "Bradley Hand",
              "Bradley Hand ITC",
              "Bremen Bd BT",
              "Britannic Bold",
              "Broadway",
              "Browallia New",
              "BrowalliaUPC",
              "Brush Script MT",
              "Californian FB",
              "Calisto MT",
              "Calligrapher",
              "Candara",
              "CaslonOpnface BT",
              "Castellar",
              "Centaur",
              "Cezanne",
              "CG Omega",
              "CG Times",
              "Chalkboard",
              "Chalkboard SE",
              "Chalkduster",
              "Charlesworth",
              "Charter Bd BT",
              "Charter BT",
              "Chaucer",
              "ChelthmITC Bk BT",
              "Chiller",
              "Clarendon",
              "Clarendon Condensed",
              "CloisterBlack BT",
              "Cochin",
              "Colonna MT",
              "Constantia",
              "Cooper Black",
              "Copperplate",
              "Copperplate Gothic",
              "Copperplate Gothic Bold",
              "Copperplate Gothic Light",
              "CopperplGoth Bd BT",
              "Corbel",
              "Cordia New",
              "CordiaUPC",
              "Cornerstone",
              "Coronet",
              "Cuckoo",
              "Curlz MT",
              "DaunPenh",
              "Dauphin",
              "David",
              "DB LCD Temp",
              "DELICIOUS",
              "Denmark",
              "DFKai-SB",
              "Didot",
              "DilleniaUPC",
              "DIN",
              "DokChampa",
              "Dotum",
              "DotumChe",
              "Ebrima",
              "Edwardian Script ITC",
              "Elephant",
              "English 111 Vivace BT",
              "Engravers MT",
              "EngraversGothic BT",
              "Eras Bold ITC",
              "Eras Demi ITC",
              "Eras Light ITC",
              "Eras Medium ITC",
              "EucrosiaUPC",
              "Euphemia",
              "Euphemia UCAS",
              "EUROSTILE",
              "Exotc350 Bd BT",
              "FangSong",
              "Felix Titling",
              "Fixedsys",
              "FONTIN",
              "Footlight MT Light",
              "Forte",
              "FrankRuehl",
              "Fransiscan",
              "Freefrm721 Blk BT",
              "FreesiaUPC",
              "Freestyle Script",
              "French Script MT",
              "FrnkGothITC Bk BT",
              "Fruitger",
              "FRUTIGER",
              "Futura",
              "Futura Bk BT",
              "Futura Lt BT",
              "Futura Md BT",
              "Futura ZBlk BT",
              "FuturaBlack BT",
              "Gabriola",
              "Galliard BT",
              "Gautami",
              "Geeza Pro",
              "Geometr231 BT",
              "Geometr231 Hv BT",
              "Geometr231 Lt BT",
              "GeoSlab 703 Lt BT",
              "GeoSlab 703 XBd BT",
              "Gigi",
              "Gill Sans",
              "Gill Sans MT",
              "Gill Sans MT Condensed",
              "Gill Sans MT Ext Condensed Bold",
              "Gill Sans Ultra Bold",
              "Gill Sans Ultra Bold Condensed",
              "Gisha",
              "Gloucester MT Extra Condensed",
              "GOTHAM",
              "GOTHAM BOLD",
              "Goudy Old Style",
              "Goudy Stout",
              "GoudyHandtooled BT",
              "GoudyOLSt BT",
              "Gujarati Sangam MN",
              "Gulim",
              "GulimChe",
              "Gungsuh",
              "GungsuhChe",
              "Gurmukhi MN",
              "Haettenschweiler",
              "Harlow Solid Italic",
              "Harrington",
              "Heather",
              "Heiti SC",
              "Heiti TC",
              "HELV",
              "Herald",
              "High Tower Text",
              "Hiragino Kaku Gothic ProN",
              "Hiragino Mincho ProN",
              "Hoefler Text",
              "Humanst 521 Cn BT",
              "Humanst521 BT",
              "Humanst521 Lt BT",
              "Imprint MT Shadow",
              "Incised901 Bd BT",
              "Incised901 BT",
              "Incised901 Lt BT",
              "INCONSOLATA",
              "Informal Roman",
              "Informal011 BT",
              "INTERSTATE",
              "IrisUPC",
              "Iskoola Pota",
              "JasmineUPC",
              "Jazz LET",
              "Jenson",
              "Jester",
              "Jokerman",
              "Juice ITC",
              "Kabel Bk BT",
              "Kabel Ult BT",
              "Kailasa",
              "KaiTi",
              "Kalinga",
              "Kannada Sangam MN",
              "Kartika",
              "Kaufmann Bd BT",
              "Kaufmann BT",
              "Khmer UI",
              "KodchiangUPC",
              "Kokila",
              "Korinna BT",
              "Kristen ITC",
              "Krungthep",
              "Kunstler Script",
              "Lao UI",
              "Latha",
              "Leelawadee",
              "Letter Gothic",
              "Levenim MT",
              "LilyUPC",
              "Lithograph",
              "Lithograph Light",
              "Long Island",
              "Lydian BT",
              "Magneto",
              "Maiandra GD",
              "Malayalam Sangam MN",
              "Malgun Gothic",
              "Mangal",
              "Marigold",
              "Marion",
              "Marker Felt",
              "Market",
              "Marlett",
              "Matisse ITC",
              "Matura MT Script Capitals",
              "Meiryo",
              "Meiryo UI",
              "Microsoft Himalaya",
              "Microsoft JhengHei",
              "Microsoft New Tai Lue",
              "Microsoft PhagsPa",
              "Microsoft Tai Le",
              "Microsoft Uighur",
              "Microsoft YaHei",
              "Microsoft Yi Baiti",
              "MingLiU",
              "MingLiU_HKSCS",
              "MingLiU_HKSCS-ExtB",
              "MingLiU-ExtB",
              "Minion",
              "Minion Pro",
              "Miriam",
              "Miriam Fixed",
              "Mistral",
              "Modern",
              "Modern No. 20",
              "Mona Lisa Solid ITC TT",
              "Mongolian Baiti",
              "MONO",
              "MoolBoran",
              "Mrs Eaves",
              "MS LineDraw",
              "MS Mincho",
              "MS PMincho",
              "MS Reference Specialty",
              "MS UI Gothic",
              "MT Extra",
              "MUSEO",
              "MV Boli",
              "Nadeem",
              "Narkisim",
              "NEVIS",
              "News Gothic",
              "News GothicMT",
              "NewsGoth BT",
              "Niagara Engraved",
              "Niagara Solid",
              "Noteworthy",
              "NSimSun",
              "Nyala",
              "OCR A Extended",
              "Old Century",
              "Old English Text MT",
              "Onyx",
              "Onyx BT",
              "OPTIMA",
              "Oriya Sangam MN",
              "OSAKA",
              "OzHandicraft BT",
              "Palace Script MT",
              "Papyrus",
              "Parchment",
              "Party LET",
              "Pegasus",
              "Perpetua",
              "Perpetua Titling MT",
              "PetitaBold",
              "Pickwick",
              "Plantagenet Cherokee",
              "Playbill",
              "PMingLiU",
              "PMingLiU-ExtB",
              "Poor Richard",
              "Poster",
              "PosterBodoni BT",
              "PRINCETOWN LET",
              "Pristina",
              "PTBarnum BT",
              "Pythagoras",
              "Raavi",
              "Rage Italic",
              "Ravie",
              "Ribbon131 Bd BT",
              "Rockwell",
              "Rockwell Condensed",
              "Rockwell Extra Bold",
              "Rod",
              "Roman",
              "Sakkal Majalla",
              "Santa Fe LET",
              "Savoye LET",
              "Sceptre",
              "Script",
              "Script MT Bold",
              "SCRIPTINA",
              "Serifa",
              "Serifa BT",
              "Serifa Th BT",
              "ShelleyVolante BT",
              "Sherwood",
              "Shonar Bangla",
              "Showcard Gothic",
              "Shruti",
              "Signboard",
              "SILKSCREEN",
              "SimHei",
              "Simplified Arabic",
              "Simplified Arabic Fixed",
              "SimSun",
              "SimSun-ExtB",
              "Sinhala Sangam MN",
              "Sketch Rockwell",
              "Skia",
              "Small Fonts",
              "Snap ITC",
              "Snell Roundhand",
              "Socket",
              "Souvenir Lt BT",
              "Staccato222 BT",
              "Steamer",
              "Stencil",
              "Storybook",
              "Styllo",
              "Subway",
              "Swis721 BlkEx BT",
              "Swiss911 XCm BT",
              "Sylfaen",
              "Synchro LET",
              "System",
              "Tamil Sangam MN",
              "Technical",
              "Teletype",
              "Telugu Sangam MN",
              "Tempus Sans ITC",
              "Terminal",
              "Thonburi",
              "Traditional Arabic",
              "Trajan",
              "TRAJAN PRO",
              "Tristan",
              "Tubular",
              "Tunga",
              "Tw Cen MT",
              "Tw Cen MT Condensed",
              "Tw Cen MT Condensed Extra Bold",
              "TypoUpright BT",
              "Unicorn",
              "Univers",
              "Univers CE 55 Medium",
              "Univers Condensed",
              "Utsaah",
              "Vagabond",
              "Vani",
              "Vijaya",
              "Viner Hand ITC",
              "VisualUI",
              "Vivaldi",
              "Vladimir Script",
              "Vrinda",
              "Westminster",
              "WHITNEY",
              "Wide Latin",
              "ZapfEllipt BT",
              "ZapfHumnst BT",
              "ZapfHumnst Dm BT",
              "Zapfino",
              "Zurich BlkEx BT",
              "Zurich Ex BT",
              "ZWAdobeF"
            ]));
          d = (d = d.concat(t.fonts.userDefinedFonts)).filter(function(e, t) {
            return d.indexOf(e) === t;
          });
          var a = document.getElementsByTagName("body")[0],
            r = document.createElement("div"),
            g = document.createElement("div"),
            n = {},
            i = {},
            f = function() {
              var e = document.createElement("span");
              return (
                (e.style.position = "absolute"),
                (e.style.left = "-9999px"),
                (e.style.fontSize = "72px"),
                (e.style.fontStyle = "normal"),
                (e.style.fontWeight = "normal"),
                (e.style.letterSpacing = "normal"),
                (e.style.lineBreak = "auto"),
                (e.style.lineHeight = "normal"),
                (e.style.textTransform = "none"),
                (e.style.textAlign = "left"),
                (e.style.textDecoration = "none"),
                (e.style.textShadow = "none"),
                (e.style.whiteSpace = "normal"),
                (e.style.wordBreak = "normal"),
                (e.style.wordSpacing = "normal"),
                (e.innerHTML = "mmmmmmmmmmlli"),
                e
              );
            },
            o = function(e) {
              for (var t = !1, a = 0; a < u.length; a++)
                if (
                  (t =
                    e[a].offsetWidth !== n[u[a]] ||
                    e[a].offsetHeight !== i[u[a]])
                )
                  return t;
              return t;
            },
            l = (function() {
              for (var e = [], t = 0, a = u.length; t < a; t++) {
                var n = f();
                (n.style.fontFamily = u[t]), r.appendChild(n), e.push(n);
              }
              return e;
            })();
          a.appendChild(r);
          for (var s = 0, c = u.length; s < c; s++)
            (n[u[s]] = l[s].offsetWidth), (i[u[s]] = l[s].offsetHeight);
          var h = (function() {
            for (var e, t, a, n = {}, r = 0, i = d.length; r < i; r++) {
              for (var o = [], l = 0, s = u.length; l < s; l++) {
                var c =
                  ((e = d[r]),
                  (t = u[l]),
                  (a = void 0),
                  ((a = f()).style.fontFamily = "'" + e + "'," + t),
                  a);
                g.appendChild(c), o.push(c);
              }
              n[d[r]] = o;
            }
            return n;
          })();
          a.appendChild(g);
          for (var m = [], T = 0, p = d.length; T < p; T++)
            o(h[d[T]]) && m.push(d[T]);
          a.removeChild(g), a.removeChild(r), e(m);
        },
        pauseBefore: !0
      },
      {
        key: "fontsFlash",
        getData: function(t, e) {
          return D()
            ? N()
              ? e.fonts.swfPath
                ? void _(function(e) {
                    t(e);
                  }, e)
                : t("missing options.fonts.swfPath")
              : t("flash not installed")
            : t("swf object not loaded");
        },
        pauseBefore: !0
      },
      {
        key: "audio",
        getData: function(a, e) {
          var t = e.audio;
          if (
            t.excludeIOS11 &&
            navigator.userAgent.match(/OS 11.+Version\/11.+Safari/)
          )
            return a(e.EXCLUDED);
          var n =
            window.OfflineAudioContext || window.webkitOfflineAudioContext;
          if (null == n) return a(e.NOT_AVAILABLE);
          var r = new n(1, 44100, 44100),
            i = r.createOscillator();
          (i.type = "triangle"), i.frequency.setValueAtTime(1e4, r.currentTime);
          var o = r.createDynamicsCompressor();
          c(
            [
              ["threshold", -50],
              ["knee", 40],
              ["ratio", 12],
              ["reduction", -20],
              ["attack", 0],
              ["release", 0.25]
            ],
            function(e) {
              void 0 !== o[e[0]] &&
                "function" == typeof o[e[0]].setValueAtTime &&
                o[e[0]].setValueAtTime(e[1], r.currentTime);
            }
          ),
            i.connect(o),
            o.connect(r.destination),
            i.start(0),
            r.startRendering();
          var l = setTimeout(function() {
            return (
              console.warn(
                'Audio fingerprint timed out. Please report bug at https://github.com/Valve/fingerprintjs2 with your user agent: "' +
                  navigator.userAgent +
                  '".'
              ),
              (r.oncomplete = function() {}),
              (r = null),
              a("audioTimeout")
            );
          }, t.timeout);
          r.oncomplete = function(e) {
            var t;
            try {
              clearTimeout(l),
                (t = e.renderedBuffer
                  .getChannelData(0)
                  .slice(4500, 5e3)
                  .reduce(function(e, t) {
                    return e + Math.abs(t);
                  }, 0)
                  .toString()),
                i.disconnect(),
                o.disconnect();
            } catch (e) {
              return void a(e);
            }
            a(t);
          };
        }
      },
      {
        key: "enumerateDevices",
        getData: function(t, e) {
          if (!a()) return t(e.NOT_AVAILABLE);
          navigator.mediaDevices
            .enumerateDevices()
            .then(function(e) {
              t(
                e.map(function(e) {
                  return (
                    "id=" +
                    e.deviceId +
                    ";gid=" +
                    e.groupId +
                    ";" +
                    e.kind +
                    ";" +
                    e.label
                  );
                })
              );
            })
            .catch(function(e) {
              t(e);
            });
        }
      }
    ],
    U = function(e) {
      throw new Error(
        "'new Fingerprint()' is deprecated, see https://github.com/Valve/fingerprintjs2#upgrade-guide-from-182-to-200"
      );
    };
  return (
    (U.get = function(a, n) {
      n ? a || (a = {}) : ((n = a), (a = {})),
        (function(e, t) {
          if (null == t) return;
          var a, n;
          for (n in t)
            null == (a = t[n]) ||
              Object.prototype.hasOwnProperty.call(e, n) ||
              (e[n] = a);
        })(a, e),
        (a.components = a.extraComponents.concat(G));
      var r = {
          data: [],
          addPreprocessedComponent: function(e, t) {
            "function" == typeof a.preprocessor && (t = a.preprocessor(e, t)),
              r.data.push({ key: e, value: t });
          }
        },
        i = -1,
        o = function(e) {
          if ((i += 1) >= a.components.length) n(r.data);
          else {
            var t = a.components[i];
            if (a.excludes[t.key]) o(!1);
            else {
              if (!e && t.pauseBefore)
                return (
                  (i -= 1),
                  void setTimeout(function() {
                    o(!0);
                  }, 1)
                );
              try {
                t.getData(function(e) {
                  r.addPreprocessedComponent(t.key, e), o(!1);
                }, a);
              } catch (e) {
                r.addPreprocessedComponent(t.key, String(e)), o(!1);
              }
            }
          }
        };
      o(!1);
    }),
    (U.getPromise = function(a) {
      return new Promise(function(e, t) {
        U.get(a, e);
      });
    }),
    (U.getV18 = function(i, o) {
      return (
        null == o && ((o = i), (i = {})),
        U.get(i, function(e) {
          for (var t = [], a = 0; a < e.length; a++) {
            var n = e[a];
            if (n.value === (i.NOT_AVAILABLE || "not available"))
              t.push({ key: n.key, value: "unknown" });
            else if ("plugins" === n.key)
              t.push({
                key: "plugins",
                value: s(n.value, function(e) {
                  var t = s(e[2], function(e) {
                    return e.join ? e.join("~") : e;
                  }).join(",");
                  return [e[0], e[1], t].join("::");
                })
              });
            else if (-1 !== ["canvas", "webgl"].indexOf(n.key))
              t.push({ key: n.key, value: n.value.join("~") });
            else if (
              -1 !==
              [
                "sessionStorage",
                "localStorage",
                "indexedDb",
                "addBehavior",
                "openDatabase"
              ].indexOf(n.key)
            ) {
              if (!n.value) continue;
              t.push({ key: n.key, value: 1 });
            } else
              n.value
                ? t.push(
                    n.value.join ? { key: n.key, value: n.value.join(";") } : n
                  )
                : t.push({ key: n.key, value: n.value });
          }
          var r = l(
            s(t, function(e) {
              return e.value;
            }).join("~~~"),
            31
          );
          o(r, t);
        })
      );
    }),
    (U.x64hash128 = l),
    (U.VERSION = "2.1.0"),
    U
  );
});

const textMap = {
  "zh-cn": {
    C_WS_DEPOSIT: "您的款项已入帐，请前往查看",
    C_WS_WITHDRAW: "您的取款已完成，请前往查看",
    C_WS_REBATE: "您的返水已入帐，请前往查看",
    C_WS_ACTIVITY: "您有 1 笔优惠已入帐，请前往查看",
    C_WS_INBOX: "您有 1 封新的站内信，请前往查看",
    COMMON_MAINTAIN_NOTICE:
      "网站系统公告\n网站即将进行系统维护，如有不便之处，敬请见谅 !\n预计完成 :\n美东时间 %s\n北京时间 %s\n於 %s 分钟後开始",
    C_WS_FEEDBACK_REPLY: "您有1封新的回覆信件，请前往查看",
    C_WS_WAGE: "您的返利已入帐，请前往查看",
    C_WS_WAGE_SELF: "您有返利可领取，请前往查看",
    verification_code: "验证码已发送，请前往查看",
    C_WS_RECYCLE_OK: "一键归户完成",
    C_WS_RECYCLE_FAIL: "%s额度无法转移，请稍后再试",
    C_WS_RECYCLE_ALL_FAIL: "额度无法移转，请再试一次"
  },
  "zh-tw": {
    C_WS_DEPOSIT: "您的款項已入帳，請前往查看",
    C_WS_WITHDRAW: "您的取款已完成，請前往查看",
    C_WS_REBATE: "您的返水已入帳，請前往查看",
    C_WS_ACTIVITY: "您有 1 筆優惠已入帳，請前往查看",
    C_WS_INBOX: "您有 1 封新的站內信，請前往查看",
    COMMON_MAINTAIN_NOTICE:
      "網站系統公告\n網站即將進行系統維護，如有不便之處，敬請見諒 !\n預計完成 :\n美東時間 %s\n北京時間 %s\n於 %s 分鐘後開始",
    C_WS_FEEDBACK_REPLY: "您有1封新的回覆信件，請前往查看",
    C_WS_WAGE: "您的返利已入帳，請前往查看",
    C_WS_WAGE_SELF: "您有返利可領取，請前往查看",
    verification_code: "驗證碼已發送，請前往查看",
    C_WS_RECYCLE_OK: "一鍵歸戶完成",
    C_WS_RECYCLE_FAIL: "%s額度無法轉移，請稍後再試",
    C_WS_RECYCLE_ALL_FAIL: "額度無法移轉，請再試一次"
  },
  ja: {
    C_WS_DEPOSIT: "入金処理が完了しました。押して確認",
    C_WS_WITHDRAW: "出金処理が完了しました。押して確認",
    C_WS_REBATE: "リベート処理が完了しました。押して確認",
    C_WS_ACTIVITY: "処理完了のボーナスが1件あります。押して確認",
    C_WS_INBOX: "新着メッセージが1件あります。押して確認",
    COMMON_MAINTAIN_NOTICE:
      "システムのお知らせ\n間もなくメンテナンスが開始いたします。ご不便をおかけして申し訳ございません。\n完成予定日：\n米国東部標準時 %s\n中国標準時 %s\n%s分後に始まる",
    C_WS_FEEDBACK_REPLY: "新着メールが1件あります",
    verification_code: "認証コードを送信しました。ご確認をお願いします。",
    C_WS_RECYCLE_OK: "ワンクリック移動成功",
    C_WS_RECYCLE_FAIL:
      "%sの残高が移動できません。しばらくしてからもう一度お試しください。",
    C_WS_RECYCLE_ALL_FAIL:
      "移動できません。しばらくしてからもう一度お試しください。"
  },
  en: {
    C_WS_DEPOSIT: "Your deposit is received. Please go to check.",
    C_WS_WITHDRAW: "Your withdrawal is completed. Please go to check.",
    C_WS_REBATE: "You received the rebate. Please go to check.",
    C_WS_ACTIVITY: "You received 1 promotion bonus. Please go to check.",
    C_WS_INBOX: "You have 1 new message(s). Please go to check.",
    COMMON_MAINTAIN_NOTICE:
      "Site Notice\nThe website is going to do the maintenance soon. We express sincere apologies for the inconvenience.\nCompletion date:\n%s (EST)\n%s (Beijing Time)\nIt will start after %s minutes.",
    C_WS_FEEDBACK_REPLY: "You have 1 new response(s). Please go to check.",
    C_WS_WAGE: "Your reward has been deposited. Please go to check.",
    C_WS_WAGE_SELF:
      "You have reward which can be collected. Please go to check.",
    verification_code: "Verification code has been sent. Please go to check.",
    C_WS_RECYCLE_OK: "Complete One click to give back",
    C_WS_RECYCLE_FAIL:
      "%s amount cannot be transferred. Please try again later.",
    C_WS_RECYCLE_ALL_FAIL:
      "The amount cannot be transferred. Please try again later."
  },
  vi: {
    C_WS_DEPOSIT: "Món tiền của bạn đã vào tài khoản, vui lòng vào xem",
    C_WS_WITHDRAW: "Món rút của bạn đã hoàn thành, vui lòng vào xem",
    C_WS_REBATE: "Hoàn trả của bạn đã vào tài khoản, vui lòng vào xem",
    C_WS_ACTIVITY: "Bạn có 1 món khuyến mãi đã vào tài khoản, vui lòng vào xem",
    C_WS_INBOX: "Bạn có 1 tin nhắn mới, vui lòng vào xem",
    COMMON_MAINTAIN_NOTICE:
      "THÔNG BÁO\nTrang mạng sắp tiến hành bảo trì. Chúng tôi thành thực xin lỗi vì sự bất tiện này!\nDự kiến bảo trì đến:\n%s (EST)\n%s (Giờ Bắc Kinh)\nHệ thống sẽ bảo trì trong vòng %s phút nữa.",
    C_WS_FEEDBACK_REPLY: "Bạn có 1 lá thư trả lời mới , vui lòng kiểm tra.",
    C_WS_WAGE: "Hoàn trả của bạn đã vào tài khoản, vui lòng kiểm tra lịch sử.",
    C_WS_WAGE_SELF: "Bạn có hoàn trả có thể nhận, vui lòng kiểm tra.",
    verification_code: "Mã xác thực đã gửi đi, vui lòng kiểm tra.",
    C_WS_RECYCLE_OK: "Hoàn thành một click về tài khoản chính",
    C_WS_RECYCLE_FAIL:
      "Không thể chuyển hạn mức tại sảnh %s, vui lòng thử lại sau",
    C_WS_RECYCLE_ALL_FAIL: "Không thể chuyển hạn mức, vui lòng thử lại sau"
  }
};
let dataLang = "",
  initialWebSocket = function() {
    const wsClass = document.querySelector('script[data-id="ws-bc"]');
    var msgFunc = null,
      displayFunction;
    function setMsgAction(e) {
      var t;
      e || (e = defalutShowMsg);
      var n = { path: "/api/socket.io", reconnectionAttempts: 5 },
        i = io("/namespace", n);
      i.on("namespace", function(o) {
        (t = o.nsp),
          i.disconnect(),
          io(t, n).on("message", t => {
            //onmessage 存進addeventlistener????
            const n = dataLang || getCookie("lang"),
              i = t.message.content;
            (t.message.text = (textMap[n] && textMap[n][i]) || i),
              "verification_code" === t.message.extend &&
                (t.message.text = textMap[n][t.message.extend]),
              "c_recycle_fail" === t.message.type &&
                (n in t.message.vendorName || (t.message.vendorName[n] = ""),
                (t.message.text = replaceMsg(
                  t.message.text,
                  "%s",
                  t.message.vendorName[n]
                )),
                delete t.message.vendorName),
              console.log(t),
              e(t); // main.js的window.notice(t)
          });
      });
    }
    function getCookie(e) {
      const t = e + "=",
        n = document.cookie
          .split(";")
          .map(e => e.trim())
          .filter(e => e.startsWith(t));
      return n.length ? n[0].substring(t.length) : "";
    }
    wsClass &&
      ((dataLang = wsClass.getAttribute("data-lang")),
      (msgFunc = wsClass.getAttribute("data-msg-func"))),
      (displayFunction = eval(msgFunc) || void 0),
      setMsgAction(displayFunction);
    var wsTimer = null,
      wsQueue = [];
    function defalutShowMsg(e) {
      var t = document.createElement("div");
      t.setAttribute(
        "style",
        "word-wrap: break-word; width: 300px; position: fixed; bottom: 10px; right: 10px; color: #2185d0; border: 1px solid #2185d0; background-color: #dff0ff; padding: 10px; border-radius: 5px"
      ),
        document.body.appendChild(t),
        t.remove();
      var n,
        o,
        s,
        a,
        _ = (e = JSON.parse(JSON.stringify(e))).event,
        c = e.message;
      function r() {
        if (wsTimer) {
          var e = Date.now() - 1e4;
          if (
            (t.firstElementChild && t.firstElementChild.remove(),
            !(wsQueue = wsQueue.filter(t => t.at > e)) || wsQueue.length < 1)
          )
            return (wsTimer = null), void t.remove();
          var n = document.createElement("ul");
          for (i in wsQueue) {
            var o = wsQueue[i],
              s = document.createElement("li");
            s.appendChild(document.createTextNode(`[${o.time}] ${o.msg.text}`)),
              n.appendChild(s);
          }
          t.appendChild(n), (wsTimer = setTimeout(r, 1e3));
        }
      }
      "maintain_notice" === _ &&
        ((endAt = (function(e) {
          function t(e, t, n, i, ...o) {
            return `${t} ${i}`;
          }
          return e.replace(/([\d-]*)(T)([\d:]*)([-+\d]*)/, t);
        })(c.end_at)),
        (endAtToEst = (function(e) {
          function t(e) {
            return e < 10 ? `0${e}` : e;
          }
          const n = -4,
            i = new Date(e),
            o = i.getTime() + 6e4 * i.getTimezoneOffset(),
            s = new Date(o + 36e5 * n),
            a = s.getFullYear(),
            _ = s.getMonth() + 1,
            c = s.getDate(),
            r = t(s.getHours()),
            C = t(s.getMinutes()),
            l = t(s.getSeconds());
          return `${a}-${_}-${c} ${r}:${C}:${l}`;
        })(c.end_at)),
        (c.text = replaceMsg(c.text, "%s", [endAtToEst, endAt, c.countdown]))),
        (n = {
          at: Date.now(),
          time:
            ((o = new Date()),
            (s = o.getTime() + 6e4 * o.getTimezoneOffset()),
            (a = new Date(s + -144e5)),
            a.getHours() + ":" + a.getMinutes()),
          msg: c
        }),
        wsQueue.push(n),
        wsTimer ||
          (document.body.appendChild(t), (wsTimer = setTimeout(r, 100)));
    }
    function replaceMsg(e, t, n) {
      return (
        Array.isArray(n) || (n = [n]),
        n.forEach(n => {
          e = e.replace(t, n);
        }),
        e
      );
    }
  };
initialWebSocket();

function send(n) {
  fetch(window.location.origin + "/api/v1/c/fingerprint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fingerprint: n })
  })
    .then(function(n) {
      console.log(n);
      n.json().then(function(n) {
        console.log("fp res:", n);
      });
    })
    .catch(function(n) {
      n.json().then(function(n) {
        console.log("fp err:", n);
      });
    });
}
window.requestIdleCallback
  ? requestIdleCallback(function() {
      Fingerprint2.getV18({}, function(n, e) {
        send(n);
      });
    })
  : setTimeout(function() {
      Fingerprint2.getV18({}, function(n, e) {
        send(n);
      });
    }, 500);
