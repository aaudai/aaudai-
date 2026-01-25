#!/usr/bin/env python3
"""
Generate beautiful Islamic landscape images for TikTok video.
Each image features serene nature scenes with Islamic architectural elements.
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os

# TikTok vertical format: 1080x1920 (9:16 aspect ratio)
WIDTH = 1080
HEIGHT = 1920

# Create output directory
os.makedirs('/home/user/aaudai-/tiktok_frames', exist_ok=True)

def create_gradient(draw, width, height, color1, color2, color3=None):
    """Create a smooth vertical gradient background."""
    for y in range(height):
        ratio = y / height
        if color3 and ratio > 0.5:
            # Transition from color2 to color3 in bottom half
            local_ratio = (ratio - 0.5) * 2
            r = int(color2[0] + (color3[0] - color2[0]) * local_ratio)
            g = int(color2[1] + (color3[1] - color2[1]) * local_ratio)
            b = int(color2[2] + (color3[2] - color2[2]) * local_ratio)
        elif color3:
            # Transition from color1 to color2 in top half
            local_ratio = ratio * 2
            r = int(color1[0] + (color2[0] - color1[0]) * local_ratio)
            g = int(color1[1] + (color2[1] - color1[1]) * local_ratio)
            b = int(color1[2] + (color2[2] - color1[2]) * local_ratio)
        else:
            r = int(color1[0] + (color2[0] - color1[0]) * ratio)
            g = int(color1[1] + (color2[1] - color1[1]) * ratio)
            b = int(color1[2] + (color2[2] - color1[2]) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

def draw_crescent_moon(draw, x, y, size, color=(255, 248, 220)):
    """Draw a crescent moon."""
    # Outer circle
    draw.ellipse([x - size, y - size, x + size, y + size], fill=color)
    # Inner circle to create crescent (offset to the right)
    offset = size * 0.4
    draw.ellipse([x - size + offset, y - size - offset/3, x + size + offset, y + size - offset/3],
                 fill=None)  # This won't work, need different approach

def draw_crescent_moon_proper(draw, x, y, size, color=(255, 248, 220), bg_color=None):
    """Draw a crescent moon using two overlapping circles."""
    # Create a temporary image for the moon
    moon_img = Image.new('RGBA', (size*3, size*3), (0, 0, 0, 0))
    moon_draw = ImageDraw.Draw(moon_img)

    center = size * 1.5
    # Draw main circle
    moon_draw.ellipse([center - size, center - size, center + size, center + size],
                      fill=color)
    # Cut out part with background color to make crescent
    offset = size * 0.5
    if bg_color:
        moon_draw.ellipse([center - size + offset, center - size - offset/4,
                          center + size + offset, center + size - offset/4],
                         fill=bg_color)
    return moon_img, (int(x - size*1.5), int(y - size*1.5))

def draw_stars(draw, width, height, count=50, max_y=None):
    """Draw twinkling stars."""
    import random
    random.seed(42)  # For reproducibility
    max_y = max_y or height // 2
    for _ in range(count):
        sx = random.randint(0, width)
        sy = random.randint(0, max_y)
        size = random.randint(1, 3)
        brightness = random.randint(200, 255)
        color = (brightness, brightness, brightness - 20)
        draw.ellipse([sx-size, sy-size, sx+size, sy+size], fill=color)

def draw_mosque_silhouette(draw, x, y, scale=1.0, color=(20, 20, 40)):
    """Draw a mosque silhouette with dome and minarets."""
    s = scale

    # Main dome
    dome_width = int(200 * s)
    dome_height = int(150 * s)
    draw.ellipse([x - dome_width//2, y - dome_height,
                  x + dome_width//2, y + dome_height//3], fill=color)

    # Main building body
    body_width = int(300 * s)
    body_height = int(200 * s)
    draw.rectangle([x - body_width//2, y,
                    x + body_width//2, y + body_height], fill=color)

    # Left minaret
    minaret_width = int(30 * s)
    minaret_height = int(280 * s)
    minaret_x = x - int(180 * s)
    draw.rectangle([minaret_x - minaret_width//2, y - minaret_height + 50,
                    minaret_x + minaret_width//2, y + body_height], fill=color)
    # Minaret top
    draw.polygon([(minaret_x - minaret_width//2, y - minaret_height + 50),
                  (minaret_x, y - minaret_height - 30),
                  (minaret_x + minaret_width//2, y - minaret_height + 50)], fill=color)
    # Crescent on top
    draw.ellipse([minaret_x - 8, y - minaret_height - 50,
                  minaret_x + 8, y - minaret_height - 34], fill=color)

    # Right minaret
    minaret_x = x + int(180 * s)
    draw.rectangle([minaret_x - minaret_width//2, y - minaret_height + 50,
                    minaret_x + minaret_width//2, y + body_height], fill=color)
    draw.polygon([(minaret_x - minaret_width//2, y - minaret_height + 50),
                  (minaret_x, y - minaret_height - 30),
                  (minaret_x + minaret_width//2, y - minaret_height + 50)], fill=color)
    draw.ellipse([minaret_x - 8, y - minaret_height - 50,
                  minaret_x + 8, y - minaret_height - 34], fill=color)

    # Small dome finial
    finial_y = y - dome_height - int(20 * s)
    draw.ellipse([x - 10, finial_y - 20, x + 10, finial_y], fill=color)
    draw.polygon([(x, finial_y - 40), (x - 5, finial_y - 20), (x + 5, finial_y - 20)], fill=color)

def draw_mountains(draw, width, height, base_y, color=(30, 40, 60), peaks=5):
    """Draw a mountain range silhouette."""
    import random
    random.seed(123)
    points = [(0, height)]

    peak_width = width // peaks
    for i in range(peaks + 1):
        peak_x = i * peak_width
        peak_height = random.randint(int(base_y * 0.3), int(base_y * 0.7))
        points.append((peak_x, peak_height))

    points.append((width, height))
    draw.polygon(points, fill=color)

def draw_palm_trees(draw, positions, height, color=(20, 35, 20)):
    """Draw palm tree silhouettes."""
    for x, base_y in positions:
        # Trunk
        trunk_height = height
        draw.polygon([(x - 10, base_y), (x + 10, base_y),
                     (x + 5, base_y - trunk_height), (x - 5, base_y - trunk_height)],
                    fill=color)

        # Palm fronds
        frond_y = base_y - trunk_height
        for angle in range(-60, 61, 20):
            rad = math.radians(angle)
            length = 80
            end_x = x + int(math.sin(rad) * length)
            end_y = frond_y - int(math.cos(rad) * length * 0.5) + 20
            # Draw curved frond
            for t in range(20):
                t_ratio = t / 20
                curve_x = x + int(math.sin(rad) * length * t_ratio)
                curve_y = frond_y + int(t_ratio * 30 - (1 - t_ratio) * 30)
                curve_y += int(math.sin(t_ratio * 3.14) * 20)
                draw.ellipse([curve_x - 3, curve_y - 2, curve_x + 3, curve_y + 2], fill=color)

def draw_water_reflection(draw, y_start, width, height, base_colors):
    """Draw water with subtle reflection."""
    for y in range(y_start, height):
        ratio = (y - y_start) / (height - y_start)
        # Darker blue water
        r = int(base_colors[0] * 0.3 + 20 * ratio)
        g = int(base_colors[1] * 0.4 + 40 * ratio)
        b = int(base_colors[2] * 0.6 + 60 * ratio)
        # Add wave effect
        wave = int(math.sin(y * 0.1) * 5)
        draw.line([(0, y), (width, y)], fill=(r + wave, g + wave, b + wave))

def draw_dunes(draw, width, height, base_y, color1, color2):
    """Draw sand dunes."""
    import random
    random.seed(456)

    # Multiple layers of dunes
    for layer in range(3):
        layer_y = base_y + layer * 100
        points = [(0, height)]

        x = 0
        while x < width:
            # Create smooth dune curves
            dune_width = random.randint(150, 300)
            dune_height = random.randint(50, 150) - layer * 30

            # Bezier-like curve points
            for t in range(0, dune_width, 10):
                curve_x = x + t
                curve_y = layer_y - int(math.sin(t / dune_width * math.pi) * dune_height)
                points.append((curve_x, curve_y))
            x += dune_width

        points.append((width, height))

        # Interpolate color for each layer
        ratio = layer / 3
        r = int(color1[0] + (color2[0] - color1[0]) * ratio)
        g = int(color1[1] + (color2[1] - color1[1]) * ratio)
        b = int(color1[2] + (color2[2] - color1[2]) * ratio)

        draw.polygon(points, fill=(r, g, b))

def add_text(draw, text, y_pos, font_size=60, color=(255, 255, 255)):
    """Add centered text with shadow."""
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()

    # Get text bounding box
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2

    # Draw shadow
    shadow_offset = 3
    draw.text((x + shadow_offset, y_pos + shadow_offset), text, fill=(0, 0, 0, 180), font=font)
    # Draw main text
    draw.text((x, y_pos), text, fill=color, font=font)

def add_arabic_decoration(draw, y, color=(255, 215, 0, 150)):
    """Add decorative Arabic-style border."""
    # Simple geometric pattern
    for x in range(0, WIDTH, 40):
        # Diamond pattern
        draw.polygon([(x + 20, y), (x + 30, y + 15), (x + 20, y + 30), (x + 10, y + 15)],
                    outline=color, width=2)

# Scene 1: Sunset over mosque
def create_scene_1():
    img = Image.new('RGB', (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)

    # Sunset gradient: deep orange to purple to dark blue
    create_gradient(draw, WIDTH, HEIGHT,
                   (255, 100, 50), (180, 80, 120), (30, 20, 60))

    # Sun
    sun_y = HEIGHT // 3
    draw.ellipse([WIDTH//2 - 100, sun_y - 100, WIDTH//2 + 100, sun_y + 100],
                fill=(255, 200, 100))

    # Mosque silhouette
    draw_mosque_silhouette(draw, WIDTH//2, HEIGHT - 400, scale=1.5, color=(20, 15, 35))

    # Ground
    draw.rectangle([0, HEIGHT - 200, WIDTH, HEIGHT], fill=(20, 15, 35))

    add_text(draw, "Subhanallah", HEIGHT - 150, 70, (255, 220, 180))
    add_text(draw, "سبحان الله", HEIGHT - 70, 80, (255, 220, 180))

    img.save('/home/user/aaudai-/tiktok_frames/frame_01.png')
    print("Created scene 1: Sunset Mosque")

# Scene 2: Starry night with crescent moon
def create_scene_2():
    img = Image.new('RGB', (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)

    # Night sky gradient
    create_gradient(draw, WIDTH, HEIGHT,
                   (5, 10, 30), (20, 30, 60), (10, 20, 40))

    # Stars
    draw_stars(draw, WIDTH, HEIGHT, count=100, max_y=HEIGHT - 400)

    # Crescent moon
    moon_x, moon_y = WIDTH - 200, 300
    draw.ellipse([moon_x - 60, moon_y - 60, moon_x + 60, moon_y + 60],
                fill=(255, 250, 220))
    draw.ellipse([moon_x - 30, moon_y - 70, moon_x + 90, moon_y + 50],
                fill=(10, 20, 50))

    # Mosque silhouette
    draw_mosque_silhouette(draw, WIDTH//2, HEIGHT - 350, scale=1.3, color=(10, 15, 25))

    # Ground
    draw.rectangle([0, HEIGHT - 150, WIDTH, HEIGHT], fill=(10, 15, 25))

    add_text(draw, "Allahu Akbar", HEIGHT - 120, 65, (200, 220, 255))
    add_text(draw, "الله أكبر", HEIGHT - 50, 75, (200, 220, 255))

    img.save('/home/user/aaudai-/tiktok_frames/frame_02.png')
    print("Created scene 2: Starry Night")

# Scene 3: Desert oasis
def create_scene_3():
    img = Image.new('RGB', (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)

    # Warm desert sky
    create_gradient(draw, WIDTH, HEIGHT,
                   (135, 180, 220), (220, 180, 140), (210, 160, 100))

    # Sun high in sky
    draw.ellipse([WIDTH//2 - 80, 200, WIDTH//2 + 80, 360], fill=(255, 240, 200))

    # Sand dunes
    draw_dunes(draw, WIDTH, HEIGHT, HEIGHT - 600, (230, 190, 130), (200, 160, 100))

    # Oasis water
    water_y = HEIGHT - 400
    draw.ellipse([WIDTH//4, water_y, WIDTH*3//4, water_y + 150], fill=(100, 160, 200))

    # Palm trees around oasis
    palm_color = (30, 60, 30)
    draw_palm_trees(draw, [(200, water_y + 50), (WIDTH - 200, water_y + 30),
                          (WIDTH//2 - 100, water_y), (WIDTH//2 + 150, water_y + 20)],
                   200, palm_color)

    add_text(draw, "Alhamdulillah", HEIGHT - 120, 65, (80, 60, 40))
    add_text(draw, "الحمد لله", HEIGHT - 50, 75, (80, 60, 40))

    img.save('/home/user/aaudai-/tiktok_frames/frame_03.png')
    print("Created scene 3: Desert Oasis")

# Scene 4: Mountain sunrise
def create_scene_4():
    img = Image.new('RGB', (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)

    # Sunrise gradient
    create_gradient(draw, WIDTH, HEIGHT,
                   (255, 150, 100), (255, 200, 150), (100, 150, 200))

    # Sun rising
    sun_y = HEIGHT // 2 - 100
    draw.ellipse([WIDTH//2 - 120, sun_y, WIDTH//2 + 120, sun_y + 240],
                fill=(255, 230, 180))

    # Mountain layers
    draw_mountains(draw, WIDTH, HEIGHT, HEIGHT - 300, (80, 100, 120), 7)
    draw_mountains(draw, WIDTH, HEIGHT, HEIGHT - 200, (50, 70, 90), 5)
    draw_mountains(draw, WIDTH, HEIGHT, HEIGHT - 100, (30, 45, 60), 4)

    add_text(draw, "La ilaha illallah", HEIGHT - 120, 55, (255, 255, 255))
    add_text(draw, "لا إله إلا الله", HEIGHT - 50, 70, (255, 255, 255))

    img.save('/home/user/aaudai-/tiktok_frames/frame_04.png')
    print("Created scene 4: Mountain Sunrise")

# Scene 5: Peaceful lake reflection
def create_scene_5():
    img = Image.new('RGB', (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)

    # Twilight gradient
    create_gradient(draw, WIDTH, HEIGHT,
                   (70, 100, 150), (150, 120, 140), (80, 90, 120))

    # Stars appearing
    draw_stars(draw, WIDTH, HEIGHT//2, count=30, max_y=HEIGHT//3)

    # Mountains in background
    draw_mountains(draw, WIDTH, HEIGHT, HEIGHT - 700, (60, 70, 90), 6)

    # Lake
    lake_start = HEIGHT - 500
    for y in range(lake_start, HEIGHT):
        ratio = (y - lake_start) / (HEIGHT - lake_start)
        r = int(60 + ratio * 20)
        g = int(80 + ratio * 30)
        b = int(120 + ratio * 30)
        # Reflection effect
        if (y - lake_start) % 20 < 10:
            r, g, b = r + 10, g + 10, b + 15
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

    # Small mosque on shore
    draw_mosque_silhouette(draw, WIDTH//2, lake_start + 50, scale=0.8, color=(40, 50, 70))

    add_text(draw, "Bismillah", HEIGHT - 120, 70, (200, 210, 230))
    add_text(draw, "بسم الله", HEIGHT - 50, 80, (200, 210, 230))

    img.save('/home/user/aaudai-/tiktok_frames/frame_05.png')
    print("Created scene 5: Lake Reflection")

# Scene 6: Golden hour mosque
def create_scene_6():
    img = Image.new('RGB', (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)

    # Golden hour gradient
    create_gradient(draw, WIDTH, HEIGHT,
                   (255, 180, 100), (255, 140, 80), (180, 100, 80))

    # Large sun
    sun_y = HEIGHT // 2
    draw.ellipse([WIDTH//2 - 200, sun_y - 200, WIDTH//2 + 200, sun_y + 200],
                fill=(255, 220, 150))

    # Mosque in foreground
    draw_mosque_silhouette(draw, WIDTH//2, HEIGHT - 300, scale=1.8, color=(60, 40, 30))

    # Ground
    draw.rectangle([0, HEIGHT - 100, WIDTH, HEIGHT], fill=(60, 40, 30))

    # Decorative border
    add_arabic_decoration(draw, HEIGHT - 180, (255, 200, 100))

    add_text(draw, "MashaAllah", HEIGHT - 130, 65, (255, 240, 200))
    add_text(draw, "ما شاء الله", HEIGHT - 55, 75, (255, 240, 200))

    img.save('/home/user/aaudai-/tiktok_frames/frame_06.png')
    print("Created scene 6: Golden Hour")

# Scene 7: Ocean waves at dusk
def create_scene_7():
    img = Image.new('RGB', (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)

    # Dusk sky
    create_gradient(draw, WIDTH, HEIGHT,
                   (100, 80, 120), (180, 100, 100), (60, 80, 120))

    # Setting sun
    sun_y = HEIGHT // 3
    draw.ellipse([WIDTH//2 - 90, sun_y - 90, WIDTH//2 + 90, sun_y + 90],
                fill=(255, 150, 100))

    # Ocean
    ocean_start = HEIGHT // 2
    for y in range(ocean_start, HEIGHT):
        ratio = (y - ocean_start) / (HEIGHT - ocean_start)
        r = int(40 + ratio * 20)
        g = int(80 + ratio * 40)
        b = int(130 + ratio * 30)
        # Wave pattern
        wave = int(math.sin(y * 0.05 + ratio * 10) * 10)
        draw.line([(0, y), (WIDTH, y)], fill=(r + wave, g + wave, b + wave))

    # Sun reflection on water
    for y in range(ocean_start, ocean_start + 300):
        ratio = (y - ocean_start) / 300
        alpha = int(255 * (1 - ratio) * 0.3)
        width = int(50 + ratio * 100)
        draw.line([(WIDTH//2 - width, y), (WIDTH//2 + width, y)],
                 fill=(255, 200 - int(ratio * 50), 150 - int(ratio * 50)))

    add_text(draw, "Astaghfirullah", HEIGHT - 120, 60, (200, 180, 200))
    add_text(draw, "أستغفر الله", HEIGHT - 50, 70, (200, 180, 200))

    img.save('/home/user/aaudai-/tiktok_frames/frame_07.png')
    print("Created scene 7: Ocean Dusk")

# Scene 8: Forest path
def create_scene_8():
    img = Image.new('RGB', (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)

    # Forest gradient
    create_gradient(draw, WIDTH, HEIGHT,
                   (100, 150, 100), (60, 100, 60), (30, 60, 30))

    # Light rays through trees
    for i in range(5):
        x_start = WIDTH // 6 + i * WIDTH // 5
        for y in range(HEIGHT):
            ratio = y / HEIGHT
            alpha = int(50 * (1 - abs(0.5 - ratio)))
            width = int(20 + ratio * 40)
            x = x_start + int(math.sin(ratio * 2) * 30)
            draw.line([(x - width, y), (x + width, y)],
                     fill=(200 + alpha, 220 + alpha, 150 + alpha))

    # Tree silhouettes on sides
    for x in [50, 150, WIDTH - 50, WIDTH - 150, WIDTH - 100]:
        tree_height = 800
        base_y = HEIGHT - 100
        # Trunk
        draw.rectangle([x - 20, base_y - tree_height, x + 20, base_y], fill=(20, 40, 20))
        # Foliage layers
        for layer in range(5):
            y = base_y - tree_height + layer * 150
            size = 80 + layer * 20
            draw.polygon([(x - size, y + 100), (x, y), (x + size, y + 100)],
                        fill=(25 + layer * 5, 50 + layer * 10, 25 + layer * 5))

    # Path
    draw.polygon([(WIDTH//2 - 100, HEIGHT), (WIDTH//2 + 100, HEIGHT),
                 (WIDTH//2 + 30, HEIGHT - 400), (WIDTH//2 - 30, HEIGHT - 400)],
                fill=(100, 80, 60))

    add_text(draw, "Tawakkul", HEIGHT - 120, 70, (200, 230, 200))
    add_text(draw, "التوكل على الله", HEIGHT - 50, 55, (200, 230, 200))

    img.save('/home/user/aaudai-/tiktok_frames/frame_08.png')
    print("Created scene 8: Forest Path")

# Scene 9: Desert night caravan
def create_scene_9():
    img = Image.new('RGB', (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)

    # Night desert gradient
    create_gradient(draw, WIDTH, HEIGHT,
                   (20, 30, 60), (40, 50, 80), (60, 50, 40))

    # Stars
    draw_stars(draw, WIDTH, HEIGHT * 2 // 3, count=80)

    # Moon
    moon_x, moon_y = 200, 250
    draw.ellipse([moon_x - 50, moon_y - 50, moon_x + 50, moon_y + 50],
                fill=(255, 250, 230))
    draw.ellipse([moon_x - 25, moon_y - 60, moon_x + 70, moon_y + 35],
                fill=(25, 35, 65))

    # Sand dunes
    draw_dunes(draw, WIDTH, HEIGHT, HEIGHT - 400, (80, 60, 40), (60, 45, 30))

    # Camel caravan silhouettes (simplified)
    caravan_y = HEIGHT - 300
    for i, x in enumerate([200, 400, 600, 800]):
        # Camel body
        draw.ellipse([x - 40, caravan_y - 30, x + 40, caravan_y + 30], fill=(30, 25, 20))
        # Camel hump
        draw.ellipse([x - 20, caravan_y - 50, x + 20, caravan_y - 10], fill=(30, 25, 20))
        # Legs
        draw.rectangle([x - 30, caravan_y + 20, x - 20, caravan_y + 60], fill=(30, 25, 20))
        draw.rectangle([x + 20, caravan_y + 20, x + 30, caravan_y + 60], fill=(30, 25, 20))
        # Head and neck
        draw.polygon([(x + 35, caravan_y - 10), (x + 60, caravan_y - 40),
                     (x + 70, caravan_y - 35), (x + 45, caravan_y)], fill=(30, 25, 20))

    add_text(draw, "Sabr", HEIGHT - 120, 80, (200, 180, 150))
    add_text(draw, "الصبر", HEIGHT - 50, 90, (200, 180, 150))

    img.save('/home/user/aaudai-/tiktok_frames/frame_09.png')
    print("Created scene 9: Desert Caravan")

# Scene 10: Peaceful garden
def create_scene_10():
    img = Image.new('RGB', (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)

    # Soft daylight gradient
    create_gradient(draw, WIDTH, HEIGHT,
                   (150, 200, 255), (200, 230, 255), (100, 180, 100))

    # Clouds
    for cx, cy in [(200, 200), (500, 150), (800, 250), (350, 300)]:
        for offset in range(-60, 61, 30):
            size = 50 - abs(offset) // 2
            draw.ellipse([cx + offset - size, cy - size//2, cx + offset + size, cy + size//2],
                        fill=(255, 255, 255))

    # Garden ground
    draw.rectangle([0, HEIGHT - 600, WIDTH, HEIGHT], fill=(80, 140, 80))

    # Flowers
    import random
    random.seed(789)
    flower_colors = [(255, 100, 100), (255, 200, 100), (200, 100, 255), (255, 150, 200)]
    for _ in range(50):
        fx = random.randint(50, WIDTH - 50)
        fy = random.randint(HEIGHT - 550, HEIGHT - 100)
        color = random.choice(flower_colors)
        # Flower petals
        for angle in range(0, 360, 60):
            rad = math.radians(angle)
            px = fx + int(math.cos(rad) * 15)
            py = fy + int(math.sin(rad) * 15)
            draw.ellipse([px - 8, py - 8, px + 8, py + 8], fill=color)
        draw.ellipse([fx - 6, fy - 6, fx + 6, fy + 6], fill=(255, 220, 100))

    # Fountain in center
    fountain_x, fountain_y = WIDTH // 2, HEIGHT - 350
    # Base
    draw.ellipse([fountain_x - 100, fountain_y, fountain_x + 100, fountain_y + 50],
                fill=(150, 140, 130))
    # Water
    draw.ellipse([fountain_x - 80, fountain_y + 10, fountain_x + 80, fountain_y + 40],
                fill=(100, 150, 200))
    # Center column
    draw.rectangle([fountain_x - 15, fountain_y - 80, fountain_x + 15, fountain_y + 25],
                  fill=(160, 150, 140))
    # Water spray
    for angle in range(-40, 41, 10):
        rad = math.radians(angle)
        for t in range(30):
            spray_x = fountain_x + int(math.sin(rad) * t * 2)
            spray_y = fountain_y - 80 - t + int(t * t * 0.02)
            draw.ellipse([spray_x - 2, spray_y - 2, spray_x + 2, spray_y + 2],
                        fill=(150, 200, 255))

    add_text(draw, "Jannah", HEIGHT - 120, 80, (50, 100, 50))
    add_text(draw, "الجنة", HEIGHT - 50, 90, (50, 100, 50))

    img.save('/home/user/aaudai-/tiktok_frames/frame_10.png')
    print("Created scene 10: Peaceful Garden")

# Scene 11: Snowy mountains
def create_scene_11():
    img = Image.new('RGB', (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)

    # Cold blue gradient
    create_gradient(draw, WIDTH, HEIGHT,
                   (180, 200, 230), (220, 230, 245), (240, 245, 255))

    # Snowy mountain peaks
    import random
    random.seed(321)

    # Background mountains
    points = [(0, HEIGHT)]
    x = 0
    while x < WIDTH + 100:
        peak_height = random.randint(400, 700)
        points.append((x, HEIGHT - peak_height))
        x += random.randint(100, 200)
    points.append((WIDTH, HEIGHT))
    draw.polygon(points, fill=(200, 210, 230))

    # Snow caps
    for i in range(1, len(points) - 2):
        px, py = points[i]
        # Snow triangle on peak
        draw.polygon([(px - 30, py + 50), (px, py), (px + 30, py + 50)],
                    fill=(255, 255, 255))

    # Foreground mountains
    points2 = [(0, HEIGHT)]
    x = 50
    while x < WIDTH:
        peak_height = random.randint(200, 400)
        points2.append((x, HEIGHT - peak_height))
        x += random.randint(150, 250)
    points2.append((WIDTH, HEIGHT))
    draw.polygon(points2, fill=(150, 170, 200))

    # Snow on ground
    draw.rectangle([0, HEIGHT - 150, WIDTH, HEIGHT], fill=(250, 252, 255))

    # Snowflakes
    for _ in range(100):
        sx = random.randint(0, WIDTH)
        sy = random.randint(0, HEIGHT - 100)
        size = random.randint(2, 5)
        draw.ellipse([sx - size, sy - size, sx + size, sy + size], fill=(255, 255, 255))

    add_text(draw, "Shukr", HEIGHT - 120, 80, (80, 100, 140))
    add_text(draw, "الشكر", HEIGHT - 50, 90, (80, 100, 140))

    img.save('/home/user/aaudai-/tiktok_frames/frame_11.png')
    print("Created scene 11: Snowy Mountains")

# Scene 12: Final - Calligraphy focus
def create_scene_12():
    img = Image.new('RGB', (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)

    # Elegant dark gradient
    create_gradient(draw, WIDTH, HEIGHT,
                   (30, 40, 60), (20, 30, 50), (40, 30, 50))

    # Decorative pattern background
    for y in range(0, HEIGHT, 80):
        for x in range(0, WIDTH, 80):
            # Geometric Islamic pattern
            draw.polygon([(x + 40, y), (x + 60, y + 20), (x + 40, y + 40), (x + 20, y + 20)],
                        outline=(60, 70, 90), width=1)

    # Central decorative frame
    frame_margin = 100
    draw.rectangle([frame_margin, HEIGHT//4, WIDTH - frame_margin, HEIGHT * 3 // 4],
                  outline=(180, 150, 100), width=5)
    draw.rectangle([frame_margin + 15, HEIGHT//4 + 15, WIDTH - frame_margin - 15, HEIGHT * 3 // 4 - 15],
                  outline=(180, 150, 100), width=2)

    # Decorative corners
    corner_size = 50
    for cx, cy in [(frame_margin, HEIGHT//4), (WIDTH - frame_margin, HEIGHT//4),
                   (frame_margin, HEIGHT * 3 // 4), (WIDTH - frame_margin, HEIGHT * 3 // 4)]:
        draw.ellipse([cx - corner_size//2, cy - corner_size//2,
                     cx + corner_size//2, cy + corner_size//2],
                    fill=(180, 150, 100))

    # Main text
    add_text(draw, "Follow @aaudai", HEIGHT//2 - 100, 55, (255, 220, 150))
    add_text(draw, "For More", HEIGHT//2, 55, (255, 220, 150))
    add_text(draw, "Islamic Content", HEIGHT//2 + 100, 55, (255, 220, 150))

    # Bottom text
    add_text(draw, "Like & Share", HEIGHT - 150, 50, (200, 180, 140))
    add_text(draw, "جزاكم الله خيرا", HEIGHT - 80, 60, (200, 180, 140))

    img.save('/home/user/aaudai-/tiktok_frames/frame_12.png')
    print("Created scene 12: Outro")

# Generate all scenes
if __name__ == "__main__":
    print("Generating Islamic Landscape frames for TikTok...")
    print("=" * 50)

    create_scene_1()   # Sunset mosque
    create_scene_2()   # Starry night
    create_scene_3()   # Desert oasis
    create_scene_4()   # Mountain sunrise
    create_scene_5()   # Lake reflection
    create_scene_6()   # Golden hour
    create_scene_7()   # Ocean dusk
    create_scene_8()   # Forest path
    create_scene_9()   # Desert caravan
    create_scene_10()  # Peaceful garden
    create_scene_11()  # Snowy mountains
    create_scene_12()  # Outro with call to action

    print("=" * 50)
    print("All 12 frames generated successfully!")
    print("Frames saved to: /home/user/aaudai-/tiktok_frames/")
