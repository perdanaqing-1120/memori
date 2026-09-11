import os
from PIL import Image, ImageOps

source_dir = "best folder"
target_dir = "thumbnails"
os.makedirs(target_dir, exist_ok=True)

# List of photos to optimize for the mobile memory vault
photos_to_optimize = [
    "DSC_0026.JPG",
    "DSC_0042.JPG",
    "DSC_0089.JPG",
    "DSC_0168.JPG",
    "IMG_2641.JPG",
    "IMG_2684.JPG",
    "IMG_6654.JPG",
    "Shessh.JPG"
]

print("Optimizing photos for mobile devices...")
for filename in photos_to_optimize:
    src_path = os.path.join(source_dir, filename)
    if os.path.exists(src_path):
        base_name = os.path.splitext(filename)[0]
        out_path = os.path.join(target_dir, f"{base_name}.webp")
        try:
            with Image.open(src_path) as img:
                # Handle EXIF orientation
                img = ImageOps.exif_transpose(img)
                # Resize for mobile phone screens (max 600px width/height)
                img.thumbnail((600, 600), Image.Resampling.LANCZOS)
                # Convert to RGB if needed and save as lightweight WebP
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                img.save(out_path, "WEBP", quality=82, method=4)
                size_kb = os.path.getsize(out_path) / 1024
                print(f"Saved: {out_path} ({size_kb:.1f} KB)")
        except Exception as e:
            print(f"Error processing {filename}: {e}")
    else:
        print(f"File not found: {src_path}")

print("Done generating mobile thumbnails!")
