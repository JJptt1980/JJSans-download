// ==UserScript==
// @name         JJ Sans for Facebook／Instagram／Threads（字型載入）
// @namespace    github.com/JJptt1980/JJSans-download
// @version      1.1.0
// @description  Meta 的網站（Facebook、Instagram、Threads）不允許從外部或 data: 載入字型，這個腳本改用 FontFace API 把 JJ Sans 加進頁面，並隱藏 Instagram、Threads 的「開啟應用程式」按鈕。字體套用、行距由 Stylus 樣式 jjsans-facebook.user.css 負責。
// @author       JJptt
// @homepageURL  https://github.com/JJptt1980/JJSans-download
// @updateURL    https://raw.githubusercontent.com/JJptt1980/JJSans-download/main/userscript/jjsans-facebook.user.js
// @downloadURL  https://raw.githubusercontent.com/JJptt1980/JJSans-download/main/userscript/jjsans-facebook.user.js
// @match        *://*.facebook.com/*
// @match        *://*.instagram.com/*
// @match        *://*.threads.com/*
// @match        *://*.threads.net/*
// @run-at       document-start
// @grant        GM_getResourceURL
// @resource     jj400 https://raw.githubusercontent.com/JJptt1980/JJSans-download/main/web/jj-sans-400.woff2
// @resource     jj700 https://raw.githubusercontent.com/JJptt1980/JJSans-download/main/web/jj-sans-700.woff2
// @license      OFL-1.1
// ==/UserScript==

/*
JJ Sans：SIL Open Font License 1.1（https://openfontlicense.org）
Latin glyphs: Copyright (c) 2016 The Inter Project Authors
CJK glyphs: Copyright 2014-2021 Adobe, with Reserved Font Name 'Source'（JJ Sans 沒有使用 'Source' 這個名稱）

為什麼要用腳本：登入後 m.facebook.com 的 CSP font-src 不允許 data: 和外部網址，
Stylus 的 @font-face 會載入失敗。FontFace API 用 ArrayBuffer 建字型，不經過網路，不受 font-src 限制。
字型檔在安裝腳本時由腳本管理器（@resource）下載並存起來，之後不會每次連線。
*/

(function () {
  'use strict';

  const FAMILY = 'JJ Sans';
  // 和 Stylus 樣式一致：把 Noto CJK 很高的上下留白縮成接近 Roboto 的行高
  const DESCRIPTORS = { ascentOverride: '93%', descentOverride: '24%', lineGapOverride: '0%', display: 'swap' };

  // 把 @resource 轉成 ArrayBuffer。腳本管理器可能給 data: 網址或 blob: 網址
  async function loadBuffer(name) {
    const url = GM_getResourceURL(name, false);
    if (url.startsWith('data:')) {
      const base64 = url.slice(url.indexOf(',') + 1);
      const bin = atob(base64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return bytes.buffer;
    }
    const res = await fetch(url);
    return res.arrayBuffer();
  }

  // 先在腳本自己的環境加；Firefox 的沙箱如果加不到頁面，就改用頁面環境（unsafeWindow）
  async function addFace(buffer, weight) {
    const desc = Object.assign({ weight: weight, style: 'normal' }, DESCRIPTORS);
    try {
      const face = new FontFace(FAMILY, buffer, desc);
      await face.load();
      document.fonts.add(face);
      // document.fonts.check() 在找不到字型時也會回 true，所以直接看清單裡有沒有這個字型
      const added = Array.from(document.fonts).some(
        (f) => f.family.replace(/["']/g, '') === FAMILY && String(f.weight) === weight && f.status === 'loaded'
      );
      if (added) return 'sandbox';
    } catch (e) {
      // 換下一種方法
    }
    const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const clone = typeof cloneInto === 'function' ? (o) => cloneInto(o, win) : (o) => o;
    const pageBuffer = clone(buffer);
    const face = new win.FontFace(FAMILY, pageBuffer, clone(desc));
    await face.load();
    win.document.fonts.add(face);
    return 'page';
  }

  (async function main() {
    const results = [];
    for (const [name, weight] of [['jj400', '400'], ['jj700', '700']]) {
      try {
        const buffer = await loadBuffer(name);
        results.push(`${weight}: ${await addFace(buffer, weight)}`);
      } catch (e) {
        results.push(`${weight}: 失敗 ${e && e.message ? e.message : e}`);
      }
    }
    console.log('[JJ Sans] 字型載入', results.join('、'));
  })();

  // ---------- Instagram、Threads：隱藏「開啟應用程式」按鈕 ----------
  // class 名稱是混淆過的、會變，所以用按鈕上的文字判斷
  const host = location.hostname;
  const isInstagram = /(^|\.)instagram\.com$/.test(host);
  const isThreads = /(^|\.)threads\.(com|net)$/.test(host);
  if (!isInstagram && !isThreads) return;

  const APP_TEXTS = new Set(['使用應用程式', '開啟應用程式', '在應用程式中開啟', '使用应用', '打开应用', 'Open app', 'Use the app', 'Open in app', 'Use app']);

  function fixedAncestor(el) {
    for (let node = el; node && node !== document.body; node = node.parentElement) {
      const pos = getComputedStyle(node).position;
      if (pos === 'fixed' || pos === 'sticky') return node;
    }
    return null;
  }

  function hide(el) {
    el.style.setProperty('display', 'none', 'important');
    el.dataset.jjHidden = '1';
  }

  function scan() {
    if (!document.body) return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const hits = [];
    for (let t = walker.nextNode(); t; t = walker.nextNode()) {
      if (APP_TEXTS.has(t.nodeValue.trim())) hits.push(t.parentElement);
    }
    for (const el of hits) {
      if (!el || el.closest('[data-jj-hidden]')) continue;
      const button = el.closest('button, [role="button"], a') || el;
      const bar = fixedAncestor(el);
      if (isInstagram && bar && bar.getBoundingClientRect().height < 120) {
        hide(bar); // Instagram：底部那一整條（含 ✕）
      } else {
        hide(button); // Threads：頂部列裡還有選單、搜尋，只藏按鈕本身
      }
    }
  }

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      scan();
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  document.addEventListener('DOMContentLoaded', scan);
})();
