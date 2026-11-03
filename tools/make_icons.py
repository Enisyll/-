"""Рисует пиксельные иконки приложения (Claude на фоне)."""
from PIL import Image
rows = ['....h..h....', '...hO..Oh...', '..OOOOOOOO..', '.OOhhOOOOOO.', 'OOhOOOOOOOOO', 'OOOWKOOWKOOO', 'OOOKKOOKKOOO', 'OpOOOOOOOOpO', 'OOOOOooOOOOO', '.OOOOOOOOOO.', '..OOOOOOOO..', '..DD....DD..', '..DD....DD..']
pal = {'O': '#d97757', 'o': '#b85c3e', 'h': '#f5b393', 'W': '#ffffff', 'K': '#1a1c2c', 'D': '#8a4630', 'p': '#ff9eaa'}
G = 20  # сетка 20x20
img = Image.new('RGB', (G, G), '#1a1c2c')
for x in range(G):
    for y in range(15, G):
        img.putpixel((x, y), (62, 137, 72) if y > 15 else (99, 199, 77))
for x in range(7, 13):
    for y in range(16, G):
        img.putpixel((x, y), (194, 133, 105))
ox, oy = 4, 3
for y, r in enumerate(rows):
    for x, c in enumerate(r):
        if c != '.':
            h = pal[c].lstrip('#'); img.putpixel((ox + x, oy + y), tuple(int(h[i:i+2], 16) for i in (0, 2, 4)))
for s in (180, 192, 512):
    img.resize((s, s), Image.NEAREST).save(f'icons/icon-{s}.png')
