# Hero portrait v4 — hands behind the back

Mode: built-in image_gen edit. Only the lower torso was sent to image_gen; the head and neck are taken from the original photograph by `scripts/compose_hero_portrait.py`. The v3 image is preserved. Framing and frontend sizing are unchanged.

Final asset: `public/images/lifuyue-halfbody-v4.webp`

Generated lower patch: `output/imagegen/lifuyue-hands-behind-lower-v4.png`

## Final prompt

```text
Use case: precise-object-edit
Asset type: lower-torso-only photographic patch for compositing beneath an unchanged real portrait.
Input image: EDIT TARGET, cropped torso only. No head is included or should be generated.
Primary request: Change ONLY the arm pose to BOTH HANDS HELD BEHIND THE BACK, like a relaxed editorial standing portrait. Both upper arms angle slightly backward from the shoulders, elbows tucked behind the torso. Forearms and hands are fully hidden BEHIND the body. The front of the black long-sleeve crew-neck top is uninterrupted. Remove the prominent bent arm and sleeve at viewer right, remove all hands-in-pockets cues. The front silhouette should be quietly narrow, natural and relaxed, with just subtle upper-sleeve contours; no arm hanging forward or separately alongside the waist.
Preserve exactly: canvas size/aspect ratio and crop, torso position, neck opening, top 80 pixels including shoulders, body lean, natural slim build, plain black long sleeves, black fabric texture, original lighting and trouser position. Keep the body-to-head scale implicit in this torso unchanged. This patch will be stitched at the upper edge, so no zoom or reframing. Do not generate a face or head.
Background: genuinely transparent alpha, not a painted checkerboard. No props, accessories, words or watermark.
Avoid: crossed arms, hands in pockets, visible fingers, exposed wrists, short sleeves, arms held in front, exaggerated biceps, altered neckline.
```
