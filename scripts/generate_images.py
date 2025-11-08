from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter


def create_charcoal_image(path: Path, label: str) -> None:
    width, height = 1200, 800
    base = Image.new("RGB", (width, height), "#1b1b20")
    draw = ImageDraw.Draw(base)

    for y in range(height):
        shade = int(24 + (y / height) * 80)
        draw.line([(0, y), (width, y)], fill=(shade, shade, min(shade + 5, 255)))

    overlay = Image.new("L", (width, height), 0)
    overlay_draw = ImageDraw.Draw(overlay)
    overlay_draw.ellipse([(-240, height // 2 - 260), (width // 2 + 160, height // 2 + 260)], fill=110)
    overlay_draw.ellipse([(width // 2 - 120, -220), (width + 220, height // 2 + 220)], fill=95)
    overlay_draw.rectangle([(width // 2 - 320, height // 2 - 180), (width - 40, height // 2 + 200)], fill=70)
    overlay = overlay.filter(ImageFilter.GaussianBlur(60))

    textured = Image.composite(base, Image.new("RGB", (width, height), "#111116"), overlay)
    draw = ImageDraw.Draw(textured)
    draw.line([(80, height - 220), (width - 80, height - 280)], fill="#d0d0d0", width=8)
    draw.line([(120, 240), (width - 140, 260)], fill="#3a3a3a", width=10)

    try:
        font = ImageFont.truetype("arial.ttf", 48)
    except OSError:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), label, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    draw.text(((width - text_width) / 2, height - text_height - 90), label, fill="#f0f0f0", font=font)

    textured.save(path, quality=90)


def main() -> None:
    root = Path(__file__).resolve().parents[1] / "assets" / "images"
    root.mkdir(parents=True, exist_ok=True)

    specs = [
        ("charcoal-portrait.jpg", "Portrait Study"),
        ("charcoal-landscape.jpg", "Coastal Mist"),
        ("charcoal-abstract.jpg", "Abstract Resonance"),
        ("charcoal-stilllife.jpg", "Still Life"),
        ("charcoal-architecture.jpg", "Urban Reflections"),
        ("charcoal-gesture.jpg", "Gesture Study"),
    ]

    for filename, label in specs:
        target_path = root / filename
        create_charcoal_image(target_path, label)
        print(f"Generated {target_path}")


if __name__ == "__main__":
    main()

