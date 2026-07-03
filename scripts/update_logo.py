import os
from PIL import Image

logo_src = r"C:\Users\Sarvesh\.gemini\antigravity-ide\brain\aef2101f-9b6d-4f01-bdb5-28e263f6cb98\media__1783064847997.png"
logo_dest_webp = r"d:\Allied-infotech\src\assets\images\logos\allied_iconic_logo.webp"
logo_dest_png = r"d:\Allied-infotech\src\assets\images\logos\allied_iconic_logo.png"

# Load image
img = Image.open(logo_src)

# Save as WebP optimized
img.save(logo_dest_webp, format="WEBP", quality=85)
print(f"Updated logo as WebP: {logo_dest_webp}")

# Save as PNG optimized
img.save(logo_dest_png, format="PNG", optimize=True)
print(f"Updated logo as PNG: {logo_dest_png}")

print("Logo update pipeline finished successfully!")
