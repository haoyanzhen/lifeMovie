# 图像制作记录

2026-10-03 · 使用内置 image_gen 模式，无 API CLI 调用。

最终资产保存在项目 `assets/` 中。原始 PNG 保留于 `assets/originals/`；网页使用 WebP。转换格式不改变构图。三幅均为 1536 × 1024，人物为非肖像性艺术形象，不还原姜淑梅本人面貌。

## 共用方向

Use case: illustration-story. Quiet Chinese domestic life album; refined hand-painted gouache and oil-on-paper, realistic proportions, soft textured edges, matte film grain; dusty sage green, warm ivory, muted honey and restrained vermilion. No text, lettering, collage, border or watermark. Not a documentary photograph.

## desk.webp — 窗边练字

Single wide landscape 1536x1024 cinematic painterly image. An ordinary elderly Chinese woman about 70, silver hair in a neat short bob, faded indigo cardigan, sits in profile at the right third of a worn wooden table beside a tall old green-painted window. She gently holds a pencil over an open exercise book, calmly learning to write. View from a little behind, her face small and not a portrait of any identifiable person. A quiet sunlit wall, a terracotta pot of green leaves, cream enamel cup. Modest lived-in northern Chinese home, warm late-afternoon sunlight with soft window shadows. Restrained and deeply humane, not cartoon, no nostalgia kitsch.

## empty.webp — 空位

Single wide landscape 1536x1024 painterly scene. Modest older northern Chinese home in soft overcast morning light. Two old wooden chairs at a small weathered table, one chair slightly pulled out and empty; an unmarked cream enamel mug, folded indigo cardigan resting on one chair, a closed plain exercise book. Tall faded green wooden window to the right, fine sheer curtain, leafy plant in terracotta pot. No people. The empty chair carries a quiet absence without dramatization. Warm ivory, muted brown, grey blue shadows. Everyday and tender, not gloomy, not a luxury interior.

## paint.webp — 新的颜色

Single wide landscape 1536x1024 close view of an elderly Chinese woman's gently wrinkled hands beginning a simple painting at a worn wooden table near an old green window. Faded indigo cardigan, no face visible. One hand rests naturally on warm white paper; the other holds a small brush painting a very simple red flower and green leaves. Colored pencils, small watercolor palette, unmarked cream enamel cup, terracotta plant at far edge. Natural believable hand anatomy. The painting is intentionally simple and earnest, not masterful. Warm morning light, paper texture, soft realistic shadows.

实际完整提交的提示词另存于 `image-prompts.json`，便于迭代复用。

## 第二版新增资产

同日使用内置 image_gen，新增 `childhood`、`mother`、`soup`、`snow`、`family`、`teaching` 六幅场景，以 `desk.png` 作为画风参考。完整提交提示词见 `image-prompts-v2.json`。

第七幅 `return` 以 `paint.png` 为编辑目标、`childhood.png` 为画中女孩参考，仅改变纸上的画。完整编辑提示词与输入关系见 `image-prompt-return.json`。由花朵改为童年的女孩，服务于前后呼应。

最终网页资产：`assets/childhood.webp`、`assets/mother.webp`、`assets/soup.webp`、`assets/snow.webp`、`assets/family.webp`、`assets/teaching.webp`、`assets/return.webp`，加上沿用的 `desk.webp` 与 `empty.webp`。源 PNG 保存在 `assets/originals/`。已检查画中人物、手、主体、参考关系；所有生成场景仍属于艺术重构。
