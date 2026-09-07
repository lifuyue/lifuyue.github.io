# Hero portrait v3

Mode: built-in image_gen. Final image: `public/images/lifuyue-halfbody-v3.webp`.

The first whole-person draft was used only to establish torso scale. Its generated head is discarded. The final lower-torso edit has no face in its input. `scripts/compose_hero_portrait.py` preserves the original photo above the fabric join, removes the generated checkerboard, and creates lossless RGBA. The source photograph and previous hero asset are unchanged.

## Final lower-torso prompt

```text
Use case: precise-object-edit
Asset type: lower-body-only patch to composite under an unchanged original portrait.
Input: EDIT TARGET. This cropped image contains ONLY the torso below the neck, no head.
Primary request: change the short-sleeve T-shirt to a plain black LONG-SLEEVE crew-neck top, close to a lightweight black cotton sweatshirt. Extend black sleeves to cover both arms fully to the wrists. No exposed arm skin or hands. Keep hands concealed in the trouser pockets / outside the crop.
Invariants: preserve the exact image bounds, torso scale, pose, shoulder slope, black crew neck and top 80 pixels, black trousers, light direction, natural fabric texture, and current silhouette as closely as possible. Make the sleeve fit natural and relaxed, with subtle folds around elbows. Do not add a face, head, text, logos, props, white areas or accessories. Do not zoom or reframe.
Output a LOWER TORSO PATCH ONLY, same framing as input, for direct stitching at its upper edge into the source photo. Genuinely transparent alpha background, not a checkerboard pattern.
```

## Initial proportion draft prompt (not used for the final face)

```text
Use case: identity-preserve
Asset type: transparent photographic portrait for a personal portfolio website hero.
Input image 1: EDIT TARGET, the supplied real man's square portrait.
Primary request: OUTPAINT only, extend the existing portrait downward to show a natural waist-up / upper-hip portrait with complete black T-shirt torso and relaxed upper arms. Extend the canvas below the existing crop and a little on the sides if necessary. Do not zoom into the face.
Invariants: keep the existing head, hair strands, face, black glasses, eyes, expression, skin texture, neck, neckline and existing shoulder pose EXACTLY unchanged. Do not reinterpret, retouch, beautify, relight or redraw this upper region. Preserve the original slight head tilt and perspective. The face must remain recognizably the exact original photograph.
Composition: vertical 2:3 canvas, complete hair near top with modest headroom; lower torso extends to bottom edge, natural narrow casual silhouette, arms relaxed near body, hands below crop. The shirt is the same plain black cotton crew-neck short-sleeve shirt. The added fabric must seamlessly continue the photographed material, folds, light direction and color. The existing head should be about 35 percent of total image height, not a close-up.
Background: genuinely transparent alpha around the person including fine hair edges, no wall, no shadow plane, no faux checkerboard.
Avoid: altered face, changed hairstyle, studio glamour retouch, bodybuilder shoulders, crossed arms, new objects, accessories, text, watermark.
Output only the extended transparent person, intended to place over a flat warm-gray website background.
```
