#!/usr/bin/env python3
"""
Generate NX036 launcher icons and splash screen assets.
Replicates the web splash: blue gradient (#1a5276 → #2e86c1) rounded square with "NX" in white.
"""
import math
from PIL import Image, ImageDraw, ImageFont

BASE = "/home/nexaplaform/Documentos/ecomerce/mobile/NX036"

# ── Helper: draw rounded rectangle with gradient ──────────────────────
def draw_gradient_rounded_rect(draw, img, bbox, radius, color1, color2):
    """Fill a rounded rectangle with a 135° linear gradient."""
    x0, y0, x1, y1 = bbox
    w, h = x1 - x0, y1 - y0
    # direction vector for 135° (top-left → bottom-right)
    cos_a, sin_a = math.cos(math.radians(135)), math.sin(math.radians(135))
    # project range
    corners = [(0, 0), (w, 0), (0, h), (w, h)]
    projs = [cx * cos_a + cy * sin_a for cx, cy in corners]
    pmin, pmax = min(projs), max(projs)

    for py in range(y0, y1):
        for px in range(x0, x1):
            t = ((px - x0) * cos_a + (py - y0) * sin_a - pmin) / (pmax - pmin)
            t = max(0.0, min(1.0, t))
            r = int(color1[0] + (color2[0] - color1[0]) * t)
            g = int(color1[1] + (color2[1] - color1[1]) * t)
            b = int(color1[2] + (color2[2] - color1[2]) * t)
            img.putpixel((px, py), (r, g, b, 255))

    # Now apply rounded corner mask
    mask = Image.new("L", (w, h), 255)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([(0, 0), (w - 1, h - 1)], radius=radius, fill=255)
    # Clear pixels outside the mask
    for py in range(h):
        for px in range(w):
            if mask.getpixel((px, py)) == 0:
                img.putpixel((x0 + px, y0 + py), (0, 0, 0, 0))


def create_icon(size, radius_ratio=0.22, text="NX"):
    """Create a single icon image."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    radius = int(size * radius_ratio)

    # Gradient colors from the web splash
    c1 = (26, 82, 118)   # #1a5276
    c2 = (46, 134, 193)  # #2e86c1

    draw_gradient_rounded_rect(draw, img, (0, 0, size, size), radius, c1, c2)

    # Draw "NX" text centered
    font_size = int(size * 0.38)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except OSError:
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", font_size)
        except OSError:
            font = ImageFont.load_default()

    bb = draw.textbbox((0, 0), text, font=font)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    tx = (size - tw) // 2
    ty = (size - th) // 2 - bb[1]
    draw.text((tx, ty), text, fill=(255, 255, 255, 255), font=font)

    return img


def create_round_icon(size, text="NX"):
    """Create a circular icon."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    c1 = (26, 82, 118)
    c2 = (46, 134, 193)
    cos_a, sin_a = math.cos(math.radians(135)), math.sin(math.radians(135))
    corners = [(0, 0), (size, 0), (0, size), (size, size)]
    projs = [cx * cos_a + cy * sin_a for cx, cy in corners]
    pmin, pmax = min(projs), max(projs)

    center = size / 2.0
    r_sq = (size / 2.0) ** 2

    for py in range(size):
        for px in range(size):
            dx, dy = px - center, py - center
            if dx * dx + dy * dy <= r_sq:
                t = (px * cos_a + py * sin_a - pmin) / (pmax - pmin)
                t = max(0.0, min(1.0, t))
                rv = int(c1[0] + (c2[0] - c1[0]) * t)
                gv = int(c1[1] + (c2[1] - c1[1]) * t)
                bv = int(c1[2] + (c2[2] - c1[2]) * t)
                img.putpixel((px, py), (rv, gv, bv, 255))

    font_size = int(size * 0.38)
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except OSError:
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", font_size)
        except OSError:
            font = ImageFont.load_default()

    bb = draw.textbbox((0, 0), text, font=font)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    tx = (size - tw) // 2
    ty = (size - th) // 2 - bb[1]
    draw.text((tx, ty), text, fill=(255, 255, 255, 255), font=font)

    return img


def create_splash(width, height):
    """Create splash screen matching web: light bg, centered NX logo with ring, loading text."""
    img = Image.new("RGBA", (width, height), (249, 250, 251, 255))  # #f9fafb
    draw = ImageDraw.Draw(img)

    # Logo size
    logo_size = 160
    ring_size = 220
    cx, cy = width // 2, height // 2 - 40

    # Draw ring (border)
    ring_radius = int(ring_size * 0.24)
    ring_x0 = cx - ring_size // 2
    ring_y0 = cy - ring_size // 2
    draw.rounded_rectangle(
        [(ring_x0, ring_y0), (ring_x0 + ring_size, ring_y0 + ring_size)],
        radius=ring_radius,
        outline=(46, 134, 193, 80),  # #2e86c1 at ~30%
        width=3
    )

    # Draw the logo
    logo = create_icon(logo_size)
    paste_x = cx - logo_size // 2
    paste_y = cy - logo_size // 2
    img.paste(logo, (paste_x, paste_y), logo)

    # "Cargando NX036..." text
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
    except OSError:
        font = ImageFont.load_default()

    text = "NX036"
    bb = draw.textbbox((0, 0), text, font=font)
    tw = bb[2] - bb[0]
    draw.text((cx - tw // 2, cy + ring_size // 2 + 30), text, fill=(100, 116, 139, 255), font=font)

    return img


# ── Main ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # Android mipmap sizes
    android_sizes = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192,
    }

    res_dir = f"{BASE}/android/app/src/main/res"

    for folder, size in android_sizes.items():
        path = f"{res_dir}/{folder}"
        # Square icon
        icon = create_icon(size)
        icon.save(f"{path}/ic_launcher.png", "PNG")
        print(f"✓ {folder}/ic_launcher.png ({size}x{size})")

        # Round icon
        round_icon = create_round_icon(size)
        round_icon.save(f"{path}/ic_launcher_round.png", "PNG")
        print(f"✓ {folder}/ic_launcher_round.png ({size}x{size})")

    # Splash screen for Android (1080x1920)
    splash = create_splash(1080, 1920)
    splash_rgb = splash.convert("RGB")
    splash_rgb.save(f"{res_dir}/drawable/splash_screen.png", "PNG")
    print(f"✓ drawable/splash_screen.png (1080x1920)")

    # iOS AppIcon (1024x1024 base)
    ios_icon = create_icon(1024)
    ios_path = f"{BASE}/ios/NX036/Images.xcassets/AppIcon.appiconset"
    ios_icon.save(f"{ios_path}/icon-1024.png", "PNG")
    print(f"✓ iOS AppIcon icon-1024.png (1024x1024)")

    # Splash for RN component (used as reference asset)
    logo_only = create_icon(512)
    logo_only.save(f"{BASE}/src/assets/nx_logo.png", "PNG")
    print(f"✓ src/assets/nx_logo.png (512x512)")

    print("\n✅ All icons generated successfully!")
