# 真实音乐接入验证

- ACE-Step task: 4c078558-d66d-4d37-88d4-69a436292178；GPU 0，A100 80GB，提交前空闲显存 58401 MiB，门槛16384 MiB，加载XL SFT及4B LM，未改部署。
- 原始WAV：90秒、48kHz、双声道、16bit PCM；哈希与远端一致；可解码，所有样本为有限值，无削波样本、无连续异常低电平区段。
- 网页用MP3 192kbps，无裁切、拼接、归一化；原始WAV与生成记录保留在 assets/lamp-film/audio/source-v1。
- `node scripts/verify-film-audio.cjs` 通过：用户开始、暂停、章节跳转后同步、音乐开关、片尾停止与重播、Range请求、手机宽度、无浏览器错误。
- 无声测试环境需 Chrome --disable-audio-output；测试的是音频解码、播放状态与实际时钟，不能替代听感验收。
- 2026-10-04 已通过 Codex 内置 image_gen.imagegen 完成十张图片，不使用CLI/API或API Key。带图片参考的请求曾返回网络错误；最终逐张原生文本生图成功。请求详情及源路径见 native-image-prompts-v2.json。
- 原件PNG保留；sips派生JPEG供网页使用，不改变图片构图、内容或颜色。
- 十张图片均在生成返回时人工目检；桌面首幕及手机育儿、空椅、收尾截图复核。手机保留完整横向画面，字幕放在画面下方深色区域。
- 独立HyperFrames时间线由 scripts/export-film.cjs 从当前网页生成，lint 0错误0警告。validate在本机无声环境遇到AudioContext设备错误，不能记为通过；主网页使用关闭设备输出的Chrome已验证音乐真实解码及播放时钟。未生成MP4。

## 2026-10-04 音乐无声修复

实际读取用户内置浏览器：音轨停在11.8秒，readyState=1，无显式媒体错误；已打开的音乐开关不能代表真正播放。运行中服务未加载最新MP3 MIME表，实际返回application/octet-stream。重启项目服务后返回audio/mpeg并保留Range支持，刷新实测readyState=4，音轨时间从0.168推进到30.280秒，未出现媒体错误。

按钮新增真实播放/加载/失败状态；失败后的点击会重新load，不再只切换布尔开关。以实际用户浏览器验证，不把无声自动化环境的播放时钟当作听感证明。
