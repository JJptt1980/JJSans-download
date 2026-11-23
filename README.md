# JJ Sans

**下載：[最新版 Release](https://github.com/JJptt1980/JJSans-download/releases/latest)**（`JJSans-<版本>.zip`）

JJ Sans 是一套合併字型：英文用 [Inter](https://github.com/rsms/inter)，中日文用 [Noto Sans CJK JP](https://github.com/notofonts/noto-cjk)。風格是乾淨、筆畫粗細一致的黑體，有 Regular（400）和 Bold（700）兩種粗細。

![JJ Sans](docs/preview.png)

## zip 裡有什麼

| 資料夾 | 內容 | 適合 |
|---|---|---|
| `full/` | 完整版，約 45,000 字，每個檔約 12.5 MB | 電腦安裝、排版 |
| `lite/` | 精簡版，約 6,200 字（台灣教育部常用國字＋日本常用漢字＋假名英數標點），每個檔約 1.8 MB | 放進 App |
| `lite/android-res-font/` | 精簡版，檔名已改成 Android 可用的 `jj_sans_regular.ttf`、`jj_sans_bold.ttf`，附 `jj_sans.xml` | 直接複製到 Android 專案的 `res/font/` |
| `web/` | 網頁字型 WOFF2，約 6,300 字，每個檔約 0.85 MB | 網頁、WebView |
| `OFL.txt` | 授權條款 | |

網頁用法：

```css
@font-face { font-family: "JJ Sans"; src: url("jj-sans-400.woff2") format("woff2"); font-weight: 400; font-display: swap; }
@font-face { font-family: "JJ Sans"; src: url("jj-sans-700.woff2") format("woff2"); font-weight: 700; font-display: swap; }
```

## 讓 Facebook、Instagram、Threads 網頁改用 JJ Sans

這三個網站登入後都不允許網頁從外部或 data: 載入字型，所以要裝兩樣東西：

1. **使用者腳本**（負責載入字型、隱藏 Instagram 和 Threads 的「開啟應用程式」按鈕）：裝好 Violentmonkey 或 Tampermonkey 後，打開
   https://raw.githubusercontent.com/JJptt1980/JJSans-download/main/userscript/jjsans-facebook.user.js
2. **Stylus 樣式**（負責把文字換成 JJ Sans、調行距、隱藏 Facebook 首頁限時動態）：裝好 Stylus 後，打開
   https://raw.githubusercontent.com/JJptt1980/JJSans-download/main/stylus/jjsans-facebook.user.css

字型只收常用字，沒有的字（含 emoji）由系統字型顯示；Facebook 自己的圖示不受影響。

## 特色

- 原始字型沒有的幾個字，用 JJ Sans 自己的筆畫或線條補上，例如罕見地名字「石＋屚」「魚＋桀」，以及 ✕ ⌂ ⚙ ⇣ ↺ 等符號。
- 有等寬數字（OpenType `tnum`）：網頁用 `font-variant-numeric: tabular-nums`，Android 用 `fontFeatureSettings = "tnum"`。

## 注意

- 中文字形是日文字形（來自 Noto Sans CJK JP），有些字和台灣習慣的寫法不一樣。
- 精簡版和網頁版只收常用字，沒有的字會由系統字型顯示。
- Inter 的字距微調（kerning）沒有帶進來。

## 授權

SIL Open Font License 1.1，見 [`OFL.txt`](OFL.txt)。可以免費使用，也可以用在商業作品裡；不能單獨販售字型檔。改版散布時要沿用 OFL，並保留著作權聲明。

- Latin：Copyright (c) 2016 The Inter Project Authors
- CJK：Copyright 2014-2021 Adobe, with Reserved Font Name 'Source'（JJ Sans 沒有使用 'Source' 這個名稱）

---

JJ Sans combines Inter (Latin) and Noto Sans CJK JP (CJK), licensed under the SIL Open Font License 1.1. Download the zip from [Releases](https://github.com/JJptt1980/JJSans-download/releases/latest).
