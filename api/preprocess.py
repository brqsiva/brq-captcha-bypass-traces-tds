from PIL import Image
import numpy as np
from io import BytesIO

def preprocess_image(file_bytes):
    # Step 1: Load original image from bytes
    img = Image.open(BytesIO(file_bytes)).convert("RGBA")  # <-- use BytesIO here

    # Step 2: Flatten onto white background
    background = Image.new("RGBA", img.size, (255, 255, 255, 255))
    background.paste(img, mask=img.split()[3])
    flattened = background.convert("RGB")

    # Step 3: Replace all non-exact-black pixels with white
    pixels = flattened.load()
    width, height = flattened.size
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            if (r, g, b) != (0, 0, 0):
                pixels[x, y] = (255, 255, 255)

    # Step 4: Replace edge pixels with white
    for x in range(width):
        pixels[x, 0] = (255, 255, 255)
        pixels[x, height - 1] = (255, 255, 255)
        pixels[x, height - 2] = (255, 255, 255)
    for y in range(height):
        pixels[0, y] = (255, 255, 255)
        pixels[width - 1, y] = (255, 255, 255)
        pixels[width - 2, y] = (255, 255, 255)

    # Convert to NumPy for processing
    pixels_np = np.array(flattened)
    black_mask = np.all(pixels_np == [0, 0, 0], axis=-1)
    mask = black_mask.copy()

    # Step 5: Remove 1-pixel-wide horizontal or vertical black lines
    for y in range(height):
        for x in range(1, width-1):
            if black_mask[y, x] and not black_mask[y, x-1] and not black_mask[y, x+1]:
                mask[y, x] = False
    for x in range(width):
        for y in range(1, height-1):
            if black_mask[y, x] and not black_mask[y-1, x] and not black_mask[y+1, x]:
                mask[y, x] = False

    # Step 6: Remove isolated single black pixels
    for y in range(1, height-1):
        for x in range(1, width-1):
            if mask[y, x]:
                neighbors = mask[y-1:y+2, x-1:x+2]
                if np.sum(neighbors) == 1:
                    mask[y, x] = False

    pixels_np[~mask] = [255, 255, 255]

    return Image.fromarray(pixels_np)
