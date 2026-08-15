"""Create temporary placeholder villa images for projects 10–12."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

root = Path(r"imgs/Exterior/Villa")

# Names sort after existing Villa folders so they become cases 10–12.
projects = [
    ("villa 10 viv", "10", "V I V", "Kfar Qasim · 2025"),
    ("villa 11 vi12", "11", "V I 12", "Kfar Qasim · 2025"),
    ("villa 12 bh", "12", "B.H Villa", "Ramallah · 2026"),
]

BG = (18, 18, 16)
PANEL = (28, 27, 24)
GOLD = (198, 162, 78)
MUTED = (160, 152, 138)
WHITE = (235, 228, 214)


def font(size: int) -> ImageFont.ImageFont:
    for name in [
        r"C:\Windows\Fonts\georgia.ttf",
        r"C:\Windows\Fonts\Georgia.ttf",
        r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arial.ttf",
    ]:
        p = Path(name)
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()


title_font = font(72)
meta_font = font(28)
label_font = font(22)


def make_image(order: str, title: str, meta: str, variant: int) -> Image.Image:
    w, h = 1600, 1200
    img = Image.new("RGB", (w, h), BG)
    draw = ImageDraw.Draw(img)

    for y in range(h):
        t = y / h
        r = int(BG[0] + (PANEL[0] - BG[0]) * t * 0.5)
        g = int(BG[1] + (PANEL[1] - BG[1]) * t * 0.5)
        b = int(BG[2] + (PANEL[2] - BG[2]) * t * 0.5)
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    margin = 48 + variant * 8
    draw.rectangle([margin, margin, w - margin, h - margin], outline=GOLD, width=2)

    draw.rectangle(
        [120 + variant * 40, 180, 520 + variant * 20, 820],
        fill=PANEL,
        outline=(60, 56, 48),
        width=1,
    )
    draw.rectangle(
        [480 + variant * 30, 320, 1180, 980],
        outline=(70, 64, 54),
        width=2,
    )

    draw.text((margin + 36, margin + 28), f"CASE {order}", font=label_font, fill=GOLD)
    draw.text((margin + 36, margin + 90), "OD ARCHITECTS", font=label_font, fill=MUTED)
    draw.text((margin + 36, h // 2 - 40), title, font=title_font, fill=WHITE)
    draw.text((margin + 36, h // 2 + 60), meta, font=meta_font, fill=MUTED)
    draw.text(
        (margin + 36, h - margin - 70),
        "Placeholder — replace with final renders",
        font=label_font,
        fill=(110, 104, 92),
    )
    return img


def main() -> None:
    for folder, order, title, meta in projects:
        out_dir = root / folder
        out_dir.mkdir(parents=True, exist_ok=True)
        make_image(order, title, meta, 0).save(
            out_dir / "ODAY_result.webp", "WEBP", quality=82, method=4
        )
        for i, v in enumerate([1, 2, 3], start=1):
            make_image(order, title, meta, v).save(
                out_dir / f"{i}_result.webp", "WEBP", quality=80, method=4
            )
        print(f"created {out_dir}")
    print("done")


if __name__ == "__main__":
    main()
