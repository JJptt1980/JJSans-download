# JJSans-download — 狀態

公開下載用的 repo：只放 README、OFL 和預覽圖，字型 zip 放在 GitHub Release。
字型本身在私人 repo JJptt1980/JJSans（本機 ~/Projects/Fonts）產生。

## 目前進度
- 1.0.0（2026-11-23）：full／lite／web 三種，含補字和等寬數字 tnum

- stylus/jjsans-facebook.user.css 1.0.0（2026-11-23）：Facebook 用 Stylus 樣式檔，內嵌 Fonts 專案 lite-for-webview/ 的 400、700 WOFF2（base64，約 2.3 MB）。由 Fonts 的 scripts/make_userstyle.py 產生。Facebook CSP 的 font-src 只允許 data: 和 Facebook 網域，所以不能用外部網址
- 1.0.1（2026-11-23）：@font-face 加 ascent／descent／line-gap-override（93%／24%／0%，接近 Roboto），line-height:normal 的地方不再太鬆；新增 @var 行距（預設 1.3，1.1～1.6），只套文字元素，不動 div、i、svg
- 1.0.2（2026-11-23）：改用 @preprocessor uso；新增 @var「字的大小」（size-adjust，100%～30%），行距改成 行距×字的大小，字縮小時行距一起縮
- 1.0.3（2026-11-23）：新增 @var select「首頁的限時動態」，預設隱藏：.hscroller 和 *:has(> .hscroller) 設 display:none（uso 沒有 if，所以用 select 換選擇器；「顯示」換成不會命中的選擇器）。選擇器是推測的，要在手機確認
- 1.0.4（2026-11-23）：退回 1.0.1 的內容（只改版本號）。原因：手機實測 1.0.3 會把 m.facebook.com 的圖示變成灰色方塊，限時動態的空白也沒消失。1.0.2 的「字的大小」（uso＋size-adjust）和 1.0.3 的「隱藏限時動態」先拿掉，原因還沒查出來
- 1.0.5（2026-11-23）：查出原因（Parallels 對話用 Firefox 遠端除錯讀 DOM）：FB 圖示是補充私用區字元（span.f3），靠 popular-symbols、lite-glyphs-* 、snaptu-symbols 圖示字型畫，1.0.1 起把 font-family 蓋掉就會變灰色方塊。修法：JJ Sans 後面接上這些圖示字型。限時動態固定隱藏：.displayed:has(.hscroller)（外層 div.m.displayed 有固定高度）。兩項都已在手機注入實測
- 1.0.6＋使用者腳本 1.0.0（2026-11-23）：登入後 CSP font-src 不允許 data:，1.0.5 的 @font-face 其實載入失敗。新增 userscript/jjsans-facebook.user.js：@resource 抓 web/ 的 woff2（安裝時由腳本管理器下載），用 FontFace API（ArrayBuffer）加進 document.fonts，沙箱加不到就改用 unsafeWindow＋cloneInto。Stylus 1.0.6 拿掉內嵌字型（檔案從 2.3 MB 變成約 2 KB），只負責 font-family、行距、隱藏限時動態

## 怎麼發新版
1. 在 Fonts 專案產生字型（完整版要跑 scripts/patch_glyphs.py 的 patch；精簡版 make_subset.py small --out；網頁版 lite-for-webview/）
2. 打包成 JJSans-<版本>.zip（full/、lite/、web/、OFL.txt）
3. gh release create v<版本>，一天最多一次正式版

## 已知問題
- 「字的大小」選項（1.0.2）還沒加回來；FB 改版後 class 名稱（f3、displayed、hscroller）或圖示字型名稱可能會變
- 中文字形是日文字形；Inter 的 kerning 沒有帶進來
