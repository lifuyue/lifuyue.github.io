"""Create a transparent portrait with OpenCV; preserve the original RGB photograph.

Run from the repository root with a Python environment containing cv2 and numpy.
The silhouette seeds are specific to the supplied 1254 × 1254 portrait.
"""
from pathlib import Path
import cv2
import numpy as np

source = Path('public/images/lifuyue-portrait.png')
output = Path('public/images/lifuyue-cutout.webp')
image = cv2.imread(str(source))
h, w = image.shape[:2]
# A loose outline is only a segmentation seed. GrabCut resolves the actual edge.
outline = np.array([
    (110,1253),(150,1100),(210,1000),(280,940),(405,885),(545,845),
    (545,740),(528,670),(522,585),(510,495),(512,400),(535,295),
    (580,215),(650,185),(720,165),(790,150),(890,170),(975,205),
    (1035,270),(1060,360),(1050,455),(1030,545),(1005,630),
    (952,710),(908,770),(864,832),(842,884),(900,930),(1025,990),
    (1100,1040),(1190,1120),(1253,1210),(1253,1253)
], np.int32)
outline = (outline * np.array([w/1254, h/1254])).astype(np.int32)
seed = np.zeros((h,w), np.uint8)
cv2.fillPoly(seed, [outline], 255)
loose = cv2.dilate(seed, cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(61,61)))
sure = cv2.erode(seed, cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(75,75)))
mask = np.full((h,w), cv2.GC_BGD, np.uint8)
mask[loose > 0] = cv2.GC_PR_BGD
mask[seed > 0] = cv2.GC_PR_FGD
mask[sure > 0] = cv2.GC_FGD
# The wall beside the right jaw has similar tones to skin; explicit background
# seeds keep the colour model from absorbing this wedge into the neck.
wall = np.array([(984,650),(966,700),(935,760),(890,822),(858,866),
                 (856,895),(925,938),(1000,930),(1080,650)],np.int32)
cv2.fillPoly(mask,[wall],cv2.GC_BGD)
cv2.grabCut(image, mask, None, np.zeros((1,65),np.float64), np.zeros((1,65),np.float64), 7, cv2.GC_INIT_WITH_MASK)
foreground = np.isin(mask, [cv2.GC_FGD,cv2.GC_PR_FGD]).astype(np.float32)
# Edge-aware alpha smoothing, preserving strands instead of a blurred silhouette.
guide = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY).astype(np.float32)/255
radius = 4
mean = lambda a: cv2.boxFilter(a,-1,(radius*2+1,radius*2+1))
mi, mp = mean(guide), mean(foreground)
a = (mean(guide*foreground)-mi*mp)/(mean(guide*guide)-mi*mi+0.0006)
b = mp-a*mi
alpha = np.clip(mean(a)*guide+mean(b),0,1)
alpha[alpha < .025] = 0
alpha[alpha > .98] = 1
# Fit the smooth wall's illumination from known background pixels, then
# estimate partial hair coverage by luminance instead of retaining wall colour.
yy,xx = np.mgrid[0:h,0:w].astype(np.float32)
xx,yy = xx/w,yy/h
features=np.stack([np.ones_like(xx),xx,yy,xx*xx,xx*yy,yy*yy],axis=-1)
samples=(mask==cv2.GC_BGD)&(np.indices((h,w))[0]%8==0)&(np.indices((h,w))[1]%8==0)
coef=np.linalg.lstsq(features[samples],image[samples].astype(np.float32)/255,rcond=None)[0]
background=np.clip(features@coef,0,1)
bg_luma=cv2.cvtColor(background,cv2.COLOR_BGR2GRAY)
# Hair is much darker than the smoothly lit wall. A fixed dark endpoint
# avoids the block artefacts produced by local minimum filters around wisps.
hair_alpha=np.clip(((bg_luma-guide)/np.maximum(bg_luma-.08,.1)-.10)/.90,0,1)
inside_distance=cv2.distanceTransform((foreground>0).astype(np.uint8),cv2.DIST_L2,5)
border_weight=np.clip((40-inside_distance)/25,0,1)
height_weight=np.clip((.48-yy)/.10,0,1)
weight=np.maximum(border_weight,np.clip((.30-yy)/.06,0,1))*height_weight
alpha=alpha*(1-weight)+np.minimum(alpha,hair_alpha)*weight
alpha[alpha<.04]=0
# Remove the original wall contribution only from partially transparent edges.
colour=image.astype(np.float32)/255
edge=(alpha>.04)&(alpha<.98)
colour[edge]=np.clip((colour[edge]-(1-alpha[edge,None])*background[edge])/alpha[edge,None],0,1)
rgba = np.dstack([(colour*255).astype(np.uint8), (alpha*255).astype(np.uint8)])
cv2.imwrite(str(output), rgba, [cv2.IMWRITE_WEBP_QUALITY, 96])
# Local QA backgrounds, outside the site's public assets.
for name, color in [('light',(237,237,236)),('dark',(29,30,34))]:
    bg = np.full_like(image,color)
    composite=(colour*255*alpha[...,None]+bg*(1-alpha[...,None])).astype(np.uint8)
    cv2.imwrite('/tmp/lifuyue-matte-'+name+'.jpg',composite)
print(f'Wrote {output}: {output.stat().st_size:,} bytes')
