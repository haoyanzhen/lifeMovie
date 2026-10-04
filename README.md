# 留一盏灯

当前首页为 90 秒原创虚构网页印象短片：修表匠与裁缝从相识走过一生。十幕写实怀旧画面已通过 Codex 内置生图生成并接入，支持播放暂停、进度拖动、章节跳转、ACE-Step 生成配乐、全屏和手机布局。无旁白。用户点击播放后音乐同步开始，可随时关闭。

运行 `npm run dev` 后打开 http://127.0.0.1:4173 。`npm run build` 输出静态网站到 dist。

- 前作保留在 [album.html](album.html)。
- 创作与节奏：[docs/film-design.md](docs/film-design.md)。
- 最终图片提示词与源文件：[docs/lamp-film/native-image-prompts-v2.json](docs/lamp-film/native-image-prompts-v2.json)。
- 图片原件：`assets/lamp-film/originals/`；网页图片：`assets/lamp-film/*.jpg`；音乐原件及生成记录：`assets/lamp-film/audio/source-v1/`。
- 独立 HyperFrames 时间线：[film/composition/index.html](film/composition/index.html)。网页播放器和独立时间线均为 90 秒；尚未导出 MP4。
- 浏览器验收：`node scripts/verify-film.cjs`，脚本使用本机已有 Playwright 与 Chromium 路径。

---

# 一生，又一生

人生相片集第二版。从童年、养育、迁徙和失去，走到姜淑梅晚年的重新学习。十三页，每页一个画面、一两句文字。来源来自本人公开讲述与新闻采访，图像为 AI 艺术重构。

## 前作浏览

需要 Node.js，无需 npm 安装依赖。

```sh
npm run dev
```

打开 http://127.0.0.1:4173 。支持箭头、底部圆点、左右方向键及画面上轻滑翻页。末页回转箭头重读。三处可选操作：回忆蒙太奇、绘画显色、童年回望。用户点击播放后音乐同步开始，可随时关闭。

## 构建

```sh
npm run build
```

`dist/` 是静态网站。本项目目前只在本地预览，尚未发布 GitHub Pages。

## GitHub 与项目级 Pages

远程仓库：`git@github.com:haoyanzhen/lifeMovie.git`。

已准备 `.github/workflows/pages.yml`，仅允许手动触发；推送代码不会自动发布。当前不启用 Pages、不运行部署工作流。

以后需要发布时：

1. 在仓库 **Settings → Pages** 中将 **Source** 设置为 **GitHub Actions**。
2. 在 **Actions → Publish GitHub Pages manually → Run workflow** 中选择 `main` 并运行。
3. 部署成功后的预期地址为 `https://haoyanzhen.github.io/lifeMovie/`（当前尚未上线）。

工作流执行 `npm run build`，只发布 `dist/`。页面和资源使用相对路径，适配项目级 `/lifeMovie/` 路径。无需安装 npm 依赖。

`dist/`、`output/`、`tmp/`、本地环境变量与音频生成任务中间文件不提交；最终配乐 MP3、插画原件和独立短片时间线保留在仓库中。

## 许可

项目自有代码采用 [MIT License](LICENSE)。第三方库与引用资料说明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

## 文档

- [当前设计](docs/design.md)
- [选材、来源与事实边界](docs/research.md)
- [第一版设计记录](docs/design-v1.md)
- [图像制作记录](docs/image-prompts.md)
- [第二版完整图像提示词](docs/image-prompts-v2.json)
- [验证记录](docs/verification.md)

没有账号、后端、埋点或外部字体依赖。插画与声音在本地运行；来源链接在新标签打开。验收脚本为 `scripts/verify.py`，需要 Python Playwright 与 Chromium。
