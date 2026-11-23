# JJSans-download — 狀態

公開下載用的 repo：只放 README、OFL 和預覽圖，字型 zip 放在 GitHub Release。
字型本身在私人 repo JJptt1980/JJSans（本機 ~/Projects/Fonts）產生。

## 目前進度
- 1.0.0（2026-11-23）：full／lite／web 三種，含補字和等寬數字 tnum

- stylus/jjsans-facebook.user.css 1.0.0（2026-11-23）：Facebook 用 Stylus 樣式檔，內嵌 Fonts 專案 lite-for-webview/ 的 400、700 WOFF2（base64，約 2.3 MB）。由 Fonts 的 scripts/make_userstyle.py 產生。Facebook CSP 的 font-src 只允許 data: 和 Facebook 網域，所以不能用外部網址

## 怎麼發新版
1. 在 Fonts 專案產生字型（完整版要跑 scripts/patch_glyphs.py 的 patch；精簡版 make_subset.py small --out；網頁版 lite-for-webview/）
2. 打包成 JJSans-<版本>.zip（full/、lite/、web/、OFL.txt）
3. gh release create v<版本>，一天最多一次正式版

## 已知問題
- 中文字形是日文字形；Inter 的 kerning 沒有帶進來
