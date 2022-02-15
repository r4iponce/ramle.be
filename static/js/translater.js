/*! translater.js v1.0.12 | MIT (c) 2018 kenny wong <wowohoo@qq.com> | http://jaywcjlove.github.io/translater.js/ */
!(function (e) {
  if ("object" == typeof exports && "undefined" != typeof module)
    module.exports = e();
  else if ("function" == typeof define && define.amd) define([], e);
  else {
    var t;
    (t =
      "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : this),
      (t.Translater = e());
  }
})(function () {
  function e(e) {
    for (
      var t = e + "=", n = document.cookie.split(";"), a = 0;
      a < n.length;
      a++
    ) {
      for (var l = n[a]; " " == l.charAt(0); ) l = l.substring(1, l.length);
      if (0 == l.indexOf(t)) return unescape(l.substring(t.length, l.length));
    }
    return !1;
  }
  function t(e, t, n) {
    var a = new Date();
    a.setTime(a.getTime() + 3600 * Number(n) * 1e3),
      (document.cookie = e + "=" + t + "; path=/;expires = " + a.toGMTString());
  }
  function n() {
    for (
      var e = Array.prototype.concat(
          f(document),
          i(document, "IMG"),
          i(document, "INPUT")
        ),
        t = [],
        n = new Object(),
        a = 0;
      a < e.length;
      a++
    ) {
      n = r(e[a]);
      var l = Object.getOwnPropertyNames(n);
      ((l.length >= 2 && "0" == l[0]) || l.length > 2) && t.push(n);
    }
    return t;
  }
  function a(e) {
    var t = {},
      n = e.nodeValue,
      a = 0;
    if (
      ((t.element = e.parentElement),
      (t["lang-default"] = n.replace(/<!--(.*)-->.*/, "")),
      n && (n = e.nodeValue.match(/<!--\{\w+\}[\s\S]*?-->/gi)),
      n && n.length > 0)
    )
      for (; a < n.length; a++) {
        var l = n[a].match(/\{([^\ ]*)\}/)[0];
        (l = l.replace(/\{([^\ ]*)\}/g, "$1")),
          (t["lang-" + l] = n[a].replace(/<!--\{\w+\}(.*)-->/g, "$1"));
      }
    return (e.parentElement.innerHTML = t["lang-default"]), t;
  }
  function l(e) {
    var t = 0,
      n = [],
      a = e.outerHTML,
      l = a.match(/src=\"(.*?)\"/),
      r = a.match(/alt=\"(.*?)\"/),
      o = a.match(/title=\"(.*?)\"/),
      u = a.match(/placeholder=\"(.*?)\"/),
      g = a.match(/value=\"(.*?)\"/),
      i = function (n, l, r) {
        var o = {},
          u = new RegExp(r + '.(\\w+).\\".*?\\"', "g"),
          g = new RegExp(r + "(.*?)="),
          i = new RegExp(r + '(.*?)=\\"(.*?)\\"');
        if (
          ((o.element = e),
          (o.default = 2 === n.length ? n[1] : ""),
          (n = a.match(u)),
          n && n.length > 0)
        )
          for (t = 0; t < n.length; t++)
            (o[n[t].match(g, "$1")[1]] = n[t].match(i, "$1")[2]), (o.type = l);
        return o;
      };
    return (
      l && n.push(i(l, "src", "data-lang-")),
      r && n.push(i(r, "alt", "alt-")),
      o && n.push(i(o, "title", "title-")),
      u && n.push(i(u, "placeholder", "placeholder-")),
      g && n.push(i(g, "value", "value-")),
      n
    );
  }
  function r(e, t) {
    if (((t = t || {}), e.parentElement && "TITLE" === e.parentElement.tagName))
      return a(e);
    if ("IMG" === e.tagName && 1 === e.nodeType) return l(e);
    if ("INPUT" === e.tagName && 1 === e.nodeType) return l(e);
    var n = "lang-default",
      o = e.nodeValue,
      g = /^\{\w+\}/;
    8 === e.nodeType &&
      g.test(o) &&
      ((n = o.match(g)[0]),
      (n = "lang-" + (n ? n.replace(/\{([^\ ]*)\}/g, "$1") : "")),
      (o = o.replace(g, "")),
      "" !== u(o) && (t[n] = o)),
      "" === u(o) || t["lang-default"] || ((t[n] = o), (t.element = e));
    var i = e.nextSibling;
    return i && 1 !== i.nodeType && r(i, t), t;
  }
  function u(e) {
    return (
      "" +
      (null == e
        ? ""
        : (e + "")
            .replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
            .replace(/[\r\n]+/g, ""))
    );
  }
  function g(e, t) {
    var n = t || location.search,
      a = {};
    if (n.indexOf("?") != -1)
      for (var l = n.substr(1).split("&"), r = 0, o = l.length; r < o; r++) {
        var u = l[r].split("=");
        a[u[0]] = u[1] && decodeURIComponent(u[1]);
      }
    return e ? a[e] : a;
  }
  function i(e, t) {
    for (var n = 0, a = [], l = e.getElementsByTagName(t); n < l.length; n++)
      a.push(l[n]);
    return a;
  }
  var c = function (a, l) {
    (a = a || {}),
      g("lang") && (a.lang = g("lang")),
      a.lang
        ? (t("t-lang", a.lang, 24), (this.lang_name = a.lang))
        : (this.lang_name = "default"),
      (this.callback = l || function () {}),
      (this.langs = n() || []),
      "default" !== this.lang_name && this.setLang(a.lang);
    var r = e("t-lang");
    r && "default" !== r && this.setLang(r);
  };
  c.prototype = {
    setLang: function (e, n) {
      var a = n || this.langs,
        l = "";
      this.lang_name = e;
      for (var r = 0; r < a.length; r++)
        a[r]["lang-" + e] || a[r][e]
          ? ((l =
              "TITLE" === a[r].element.tagName
                ? "innerHTML"
                : "IMG" === a[r].element.tagName
                ? a[r].type
                : "INPUT" === a[r].element.tagName
                ? a[r].type
                : "nodeValue"),
            (a[r].element[l] = a[r]["lang-" + e] || a[r][e]))
          : this.setLang(e, a[r]);
      t("t-lang", e, 24);
    },
    getLang: function () {
      return this.lang_name;
    },
  };
  var f = window.NodeFilter
    ? function (e) {
        var t,
          n,
          a = [];
        for (
          n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, null, null);
          (t = n.nextNode());

        )
          "SCRIPT" !== t.parentElement.tagName &&
            "STYLE" !== t.parentElement.tagName &&
            "CODE" !== t.parentElement.tagName &&
            "" !== u(t.nodeValue) &&
            a.push(t);
        return a;
      }
    : function (e) {
        switch (e.nodeType) {
          case 3:
            return [e];
          case 1:
          case 9:
            var t,
              n = e.childNodes,
              a = [];
            if (
              "SCRIPT" !== e.tagName &&
              "STYLE" !== e.tagName &&
              "CODE" !== e.tagName &&
              "" !== u(o.nodeValue)
            ) {
              for (t = 0; t < n.length; t++) f(n[t]) && a.push(f(n[t]));
              return Array.prototype.concat.apply([], a);
            }
        }
      };
  return c;
});
