"""Join the original portrait to an AI-generated long-sleeve lower torso.

Requires OpenCV and NumPy. The original face/neck are never generated.
The affine mapping was fitted from 90 matching features in the original photo.
"""
from pathlib import Path
import argparse
import cv2
import numpy as np

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--lower', default='output/imagegen/lifuyue-hands-behind-lower-v4.png')
parser.add_argument('--output', default='public/images/lifuyue-halfbody-v4.webp')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
source = cv2.imread(str(root / 'public/images/lifuyue-portrait.png'))
cutout = cv2.imread(str(root / 'public/images/lifuyue-cutout.webp'), cv2.IMREAD_UNCHANGED)
lower = cv2.imread(str(root / args.lower))
lower = cv2.resize(lower, (1024, 926), interpolation=cv2.INTER_AREA)
height, width = 1536, 1024

# The generated patch includes a pale checkerboard, not an alpha channel.
# Its black clothing is separable by luminance; keep the largest silhouette.
gray = cv2.cvtColor(lower, cv2.COLOR_BGR2GRAY)
mask = (gray < 160).astype(np.uint8)
count, labels, stats, _ = cv2.connectedComponentsWithStats(mask)
mask = (labels == (1 + np.argmax(stats[1:, cv2.CC_STAT_AREA]))).astype(np.uint8)
alpha = cv2.GaussianBlur(mask.astype(np.float32), (3, 3), .55)
alpha[alpha < .01] = 0
rgb = lower.astype(np.float32) / 255
edge = (alpha > .01) & (alpha < .99)
rgb[edge] = np.clip((rgb[edge] - (1 - alpha[edge, None]) * .96) / alpha[edge, None], 0, 1)
patch = np.dstack((rgb * alpha[..., None], alpha))
canvas = np.zeros((height, width, 4), np.float32)
canvas[610:] = patch

# Use source RGB inside the silhouette and the existing matte's decontaminated
# colors only on partially transparent hair edges. Warp premultiplied RGBA.
original_alpha = cutout[..., 3].astype(np.float32) / 255
original_rgb = np.where((original_alpha > .98)[..., None], source, cutout[..., :3]).astype(np.float32) / 255
original = np.dstack((original_rgb * original_alpha[..., None], original_alpha))
mapping = np.array([[.5880141289738346, -.002489258695433074, 163.7812006400343],
                    [.002489258695433074, .5880141289738346, 38.15008007001074]])
upper = cv2.warpAffine(original, mapping, (width, height), flags=cv2.INTER_LINEAR)
# The join lies entirely in black fabric, below the untouched face and neck.
weight = np.clip((730 - np.arange(height)) / 60, 0, 1)[:, None, None]
result = upper * weight + canvas * (1 - weight)
assert np.array_equal(result[:670], upper[:670]), 'The join must not modify the original upper portrait'
opaque = result[..., 3] > 0
result[opaque, :3] /= result[opaque, 3, None]
# Interpolate silhouette distances at the fabric join rather than retaining
# two translucent shoulder outlines from slightly different crops.
def distance(alpha):
    binary = (alpha > .5).astype(np.uint8)
    return cv2.distanceTransform(binary, cv2.DIST_L2, 5) - cv2.distanceTransform(1 - binary, cv2.DIST_L2, 5)
silhouette = distance(upper[..., 3]) * weight[..., 0] + distance(canvas[..., 3]) * (1 - weight[..., 0])
result[670:730, :, 3] = np.clip(silhouette[670:730] + .5, 0, 1)
rgba = np.clip(np.rint(result * 255), 0, 255).astype(np.uint8)
out = root / args.output
cv2.imwrite(str(out), rgba, [cv2.IMWRITE_WEBP_QUALITY, 101])
# Verify lossless encoding preserves every visible upper-portrait pixel.
saved = cv2.imread(str(out), cv2.IMREAD_UNCHANGED)
visible = rgba[:670, :, 3] > 0
assert np.array_equal(saved[:670][visible], rgba[:670][visible])
for label, color in [('gray', (158, 156, 152)), ('dark', (45, 42, 40))]:
    preview = rgba[..., :3] * (rgba[..., 3:] / 255) + np.array(color) * (1 - rgba[..., 3:] / 255)
    cv2.imwrite(f'/tmp/{out.stem}-{label}.jpg', preview.astype(np.uint8))
print(f'{out}: {out.stat().st_size:,} bytes, {width} × {height}, lossless RGBA')
