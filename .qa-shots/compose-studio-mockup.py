"""Premium 9:16 27-inch studio display mockup compositor."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent
SCREEN_PATH = ROOT / "oday-hero-2560.png"
OUT_2X = ROOT / "oday-27inch-mockup-9x16.png"
OUT_1X = ROOT / "oday-27inch-mockup-9x16-1080x1920.png"

W, H = 2160, 3840  # 9:16 at 2x Instagram story


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def hex_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def vertical_gradient(size: tuple[int, int], stops: list[tuple[float, str]]) -> Image.Image:
    w, h = size
    strip = Image.new("RGB", (1, h))
    px = strip.load()
    stops = sorted(stops, key=lambda s: s[0])
    colors = [(p, hex_rgb(c)) for p, c in stops]
    for y in range(h):
        t = y / max(h - 1, 1)
        for i in range(len(colors) - 1):
            p0, c0 = colors[i]
            p1, c1 = colors[i + 1]
            if t <= p1 or i == len(colors) - 2:
                local = 0 if p1 == p0 else (t - p0) / (p1 - p0)
                local = max(0.0, min(1.0, local))
                px[0, y] = (
                    int(lerp(c0[0], c1[0], local)),
                    int(lerp(c0[1], c1[1], local)),
                    int(lerp(c0[2], c1[2], local)),
                )
                break
    return strip.resize((w, h), Image.Resampling.BILINEAR)


def radial_glow(size: tuple[int, int], color: tuple[int, int, int], radius: float) -> Image.Image:
    w, h = size
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    cx, cy = w / 2, h / 2
    draw.ellipse(
        [cx - radius, cy - radius, cx + radius, cy + radius],
        fill=(*color, 255),
    )
    return layer.filter(ImageFilter.GaussianBlur(radius * 0.55))


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius, fill=255)
    return mask


def add_noise(img: Image.Image, amount: float = 0.035) -> Image.Image:
    noise = Image.effect_noise(img.size, 28).convert("L")
    noise = ImageEnhance.Contrast(noise).enhance(1.15)
    noise_rgb = ImageOps.colorize(noise, "#000000", "#ffffff").convert(img.mode)
    return Image.blend(img, noise_rgb, amount)


def main() -> None:
    canvas = vertical_gradient(
        (W, H),
        [
            (0.00, "#3d3732"),
            (0.22, "#322d29"),
            (0.48, "#2a2522"),
            (0.62, "#241f1c"),
            (1.00, "#141110"),
        ],
    )
    canvas = add_noise(canvas, 0.028)

    # Recessed gold light slit on the right wall
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g = ImageDraw.Draw(glow)
    slit_x = int(W * 0.86)
    g.rectangle([slit_x - 90, int(H * 0.02), slit_x + 90, int(H * 0.58)], fill=(201, 164, 92, 38))
    glow = glow.filter(ImageFilter.GaussianBlur(48))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), glow).convert("RGB")

    slit = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s = ImageDraw.Draw(slit)
    s.rectangle([slit_x - 2, int(H * 0.06), slit_x + 3, int(H * 0.54)], fill=(236, 214, 150, 255))
    s.rectangle([slit_x - 1, int(H * 0.10), slit_x + 2, int(H * 0.48)], fill=(255, 244, 210, 255))
    slit = slit.filter(ImageFilter.GaussianBlur(1.2))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), slit).convert("RGB")

    # Limestone slab with a dark architectural void beneath
    desk_y = int(H * 0.705)
    slab_h = 168
    void = vertical_gradient(
        (W, H - desk_y - slab_h + 40),
        [(0.00, "#1a1614"), (0.45, "#100e0d"), (1.00, "#0a0908")],
    )
    canvas.paste(void, (0, desk_y + slab_h - 20))

    slab = vertical_gradient(
        (W, slab_h),
        [
            (0.00, "#c4bbb1"),
            (0.12, "#aea49a"),
            (0.55, "#8d847a"),
            (1.00, "#5c554e"),
        ],
    )
    slab = add_noise(slab, 0.04)
    canvas.paste(slab, (0, desk_y))

    edge = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(edge).rectangle([0, desk_y, W, desk_y + 5], fill=(240, 232, 222, 170))
    ImageDraw.Draw(edge).rectangle(
        [0, desk_y + slab_h - 18, W, desk_y + slab_h],
        fill=(28, 24, 21, 90),
    )
    canvas = Image.alpha_composite(canvas.convert("RGBA"), edge).convert("RGB")

    screen = Image.open(SCREEN_PATH).convert("RGB")
    # 27" 16:9 panel occupying most of the width
    screen_w = 1760
    screen_h = int(screen_w * 9 / 16)
    screen = screen.resize((screen_w, screen_h), Image.Resampling.LANCZOS)

    bezel = 11
    chin = 18
    radius_outer = 22
    radius_screen = 5
    frame_w = screen_w + bezel * 2
    frame_h = screen_h + bezel + chin
    frame_x = (W - frame_w) // 2
    frame_y = desk_y - frame_h - 154

    # Soft contact shadow under the whole display
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle(
        [frame_x + 40, frame_y + 70, frame_x + frame_w - 40, desk_y + 36],
        40,
        fill=(0, 0, 0, 160),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(48))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), shadow)

    # Warm screen glow onto wall and desk
    glow2 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow2)
    gd.ellipse(
        [frame_x - 80, frame_y + 80, frame_x + frame_w + 80, frame_y + frame_h + 120],
        fill=(186, 168, 132, 42),
    )
    glow2 = glow2.filter(ImageFilter.GaussianBlur(64))
    canvas = Image.alpha_composite(canvas, glow2)

    # Aluminum chassis
    chassis = Image.new("RGBA", (frame_w, frame_h), (0, 0, 0, 0))
    metal = Image.new("RGB", (frame_w, frame_h), "#d8d3cc")
    metal = vertical_gradient(
        (frame_w, frame_h),
        [
            (0.00, "#f0ece6"),
            (0.18, "#ddd8d1"),
            (0.55, "#cfc9c1"),
            (1.00, "#b9b3ab"),
        ],
    )
    metal = add_noise(metal, 0.018)
    chassis_mask = rounded_mask((frame_w, frame_h), radius_outer)
    chassis.paste(metal, (0, 0))
    chassis.putalpha(chassis_mask)

    # Inner dark lip
    lip = ImageDraw.Draw(chassis)
    lip.rounded_rectangle(
        [bezel - 5, bezel - 5, frame_w - bezel + 4, bezel + screen_h + 4],
        radius_screen + 4,
        fill=(28, 26, 24, 255),
    )

    screen_rgba = screen.convert("RGBA")
    screen_mask = rounded_mask((screen_w, screen_h), radius_screen)
    screen_rgba.putalpha(screen_mask)
    chassis.alpha_composite(screen_rgba, (bezel, bezel))

    # Glass glare
    glare = Image.new("RGBA", (screen_w, screen_h), (0, 0, 0, 0))
    ImageDraw.Draw(glare).polygon(
        [(0, 0), (int(screen_w * 0.38), 0), (int(screen_w * 0.14), screen_h), (0, screen_h)],
        fill=(255, 255, 255, 12),
    )
    ImageDraw.Draw(glare).polygon(
        [(int(screen_w * 0.78), 0), (screen_w, 0), (screen_w, int(screen_h * 0.42))],
        fill=(255, 255, 255, 6),
    )
    glare.putalpha(ImageChops.multiply(glare.split()[-1], screen_mask))
    chassis.alpha_composite(glare, (bezel, bezel))

    # Hairline highlight on top bezel
    hi = Image.new("RGBA", (frame_w, frame_h), (0, 0, 0, 0))
    ImageDraw.Draw(hi).arc(
        [6, 4, frame_w - 7, 52],
        200,
        340,
        fill=(255, 255, 255, 90),
        width=2,
    )
    chassis.alpha_composite(hi)

    canvas.alpha_composite(chassis, (frame_x, frame_y))

    # Stand neck
    neck_w, neck_h = 96, 142
    neck = Image.new("RGBA", (neck_w + 40, neck_h + 20), (0, 0, 0, 0))
    nd = ImageDraw.Draw(neck)
    nd.polygon(
        [
            (20 + 32, 0),
            (20 + neck_w - 32, 0),
            (20 + neck_w - 4, neck_h),
            (20 + 4, neck_h),
        ],
        fill=(220, 214, 206, 255),
    )
    nd.polygon(
        [
            (20 + 40, 10),
            (20 + neck_w - 48, 10),
            (20 + neck_w - 16, neck_h),
            (20 + 16, neck_h),
        ],
        fill=(248, 244, 238, 80),
    )
    neck_x = (W - neck.size[0]) // 2
    neck_y = frame_y + frame_h - 6
    canvas.alpha_composite(neck, (neck_x, neck_y))

    # Stand foot
    foot_w, foot_h = 268, 22
    foot = Image.new("RGBA", (foot_w, foot_h + 16), (0, 0, 0, 0))
    fd = ImageDraw.Draw(foot)
    fd.rounded_rectangle([0, 0, foot_w - 1, foot_h - 1], 11, fill=(232, 227, 220, 255))
    fd.rounded_rectangle([8, 3, foot_w - 9, 11], 6, fill=(255, 255, 255, 50))
    foot_x = (W - foot_w) // 2
    foot_y = neck_y + neck_h - 8
    # foot shadow
    fshadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(fshadow).ellipse(
        [foot_x - 10, foot_y + 8, foot_x + foot_w + 10, foot_y + 34],
        fill=(0, 0, 0, 90),
    )
    fshadow = fshadow.filter(ImageFilter.GaussianBlur(10))
    canvas.alpha_composite(fshadow)
    canvas.alpha_composite(foot, (foot_x, foot_y))

    # Faint reflection of the screen on the stone
    refl_h = 78
    refl = screen.resize((screen_w, refl_h), Image.Resampling.LANCZOS).transpose(
        Image.Transpose.FLIP_TOP_BOTTOM
    )
    refl = ImageEnhance.Brightness(refl).enhance(0.32)
    refl = ImageEnhance.Color(refl).enhance(0.5)
    fade_strip = Image.new("L", (1, refl_h), 0)
    fsp = fade_strip.load()
    for y in range(refl_h):
        fsp[0, y] = int(58 * (1 - y / max(refl_h - 1, 1)) ** 1.7)
    fade = fade_strip.resize((screen_w, refl_h), Image.Resampling.BILINEAR)
    refl.putalpha(fade)
    refl = refl.filter(ImageFilter.GaussianBlur(1.6))
    canvas.alpha_composite(refl, (frame_x + bezel, desk_y + 8))

    # Vignette
    vig = Image.new("L", (W, H), 0)
    ImageDraw.Draw(vig).ellipse(
        [-int(W * 0.12), -int(H * 0.08), int(W * 1.12), int(H * 1.02)],
        fill=255,
    )
    vig = vig.filter(ImageFilter.GaussianBlur(120))
    vig_rgb = Image.new("RGB", (W, H), "#0c0a09")
    canvas_rgb = canvas.convert("RGB")
    canvas_rgb = Image.composite(canvas_rgb, vig_rgb, ImageEnhance.Brightness(vig).enhance(1.0))
    # Mix vignette gently
    canvas_rgb = Image.blend(canvas.convert("RGB"), canvas_rgb, 0.42)

    # Export
    canvas_rgb = canvas_rgb.convert("RGB")
    canvas_rgb.save(OUT_2X, "PNG", optimize=True)
    small = canvas_rgb.resize((1080, 1920), Image.Resampling.LANCZOS)
    small.save(OUT_1X, "PNG", optimize=True)
    print(f"wrote {OUT_2X} {canvas_rgb.size}")
    print(f"wrote {OUT_1X} {small.size}")


if __name__ == "__main__":
    main()
