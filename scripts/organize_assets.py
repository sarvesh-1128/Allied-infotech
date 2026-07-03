import os
import shutil
from PIL import Image

src_dir = r"C:\Users\Sarvesh\.gemini\antigravity-ide\brain\aef2101f-9b6d-4f01-bdb5-28e263f6cb98\scratch\images"
dest_root = r"d:\Allied-infotech\src\assets\images"

# Define destination subfolders
folders = ["products", "gallery", "partners", "certificates", "logos"]
for f in folders:
    os.makedirs(os.path.join(dest_root, f), exist_ok=True)

# File mappings
mappings = {
    # Logos
    "slide_2_img_0.jpg": ("logos", "allied_iconic_logo"),
    "slide_10_img_22.png": ("logos", "szy_logo"),
    "slide_10_img_26.jpg": ("logos", "szy_badge"),
    
    # Certificates
    "slide_4_img_1.jpg": ("certificates", "shangzhiyou_auth"),
    "slide_4_img_2.png": ("certificates", "konger_auth"),
    "slide_5_img_3.jpg": ("certificates", "mopu_auth"),
    "slide_5_img_4.jpg": ("certificates", "ant_brother_auth"),
    
    # Products
    "slide_10_img_23.jpg": ("products", "hydraulic_clamp_system"),
    "slide_10_img_24.jpg": ("products", "clamp_unit_1"),
    "slide_10_img_25.jpg": ("products", "clamp_unit_2"),
    
    "slide_11_img_27.jpg": ("products", "hydraulic_qmc_installed_1"),
    "slide_11_img_28.jpg": ("products", "hydraulic_qmc_installed_2"),
    
    "slide_12_img_29.jpg": ("products", "mould_cleaning_machine_front"),
    "slide_12_img_30.jpg": ("products", "mould_cleaning_machine_active"),
    "slide_12_img_31.jpg": ("products", "mould_cleaning_bucket"),
    "slide_12_img_32.jpg": ("products", "mould_cleaning_screen"),
    
    "slide_13_img_33.jpg": ("products", "mould_cleaning_debris"),
    "slide_13_img_34.jpg": ("products", "mould_cleaning_dirty_water"),
    "slide_13_img_35.jpg": ("products", "mould_cleaning_clean_pipe"),
    
    "slide_14_img_36.jpg": ("products", "screw_barrel_render_1"),
    "slide_14_img_37.jpg": ("products", "screw_barrel_render_2"),
    "slide_14_img_38.jpg": ("products", "shut_off_nozzle_render_1"),
    "slide_14_img_39.jpg": ("products", "shut_off_nozzle_render_2"),
    
    # Gallery
    "slide_6_img_5.jpg": ("gallery", "anhui_reception"),
    "slide_6_img_6.jpg": ("gallery", "mould_plate_cores"),
    "slide_6_img_7.jpg": ("gallery", "imm_factory_floor"),
    "slide_6_img_8.jpg": ("gallery", "office_meeting_1"),
    "slide_6_img_9.jpg": ("gallery", "assembly_floor_qmc_bed"),
    
    "slide_7_img_10.jpg": ("gallery", "factory_building_exterior_1"),
    "slide_7_img_11.jpg": ("gallery", "factory_building_exterior_2"),
    "slide_7_img_12.jpg": ("gallery", "brief_introduction_hall"),
    "slide_7_img_13.jpg": ("gallery", "vertical_imm_row"),
    "slide_7_img_14.jpg": ("gallery", "production_hall_vertical_imms"),
    "slide_7_img_15.jpg": ("gallery", "wrapped_vertical_imm"),
    
    "slide_8_img_16.jpg": ("gallery", "office_meeting_2"),
    "slide_8_img_17.jpg": ("gallery", "ant_brother_team_group"),
    "slide_8_img_18.jpg": ("gallery", "three_men_group"),
    "slide_8_img_19.jpg": ("gallery", "lobby_team_group"),
    "slide_8_img_20.jpg": ("gallery", "factory_workers_imm"),
    "slide_8_img_21.jpg": ("gallery", "two_men_lobby"),
}

def process_image(src_path, dest_dir, base_name):
    # Open image
    img = Image.open(src_path)
    # Determine format
    original_format = img.format
    
    # Target file paths
    ext = ".jpg" if original_format == "JPEG" or src_path.endswith(".jpg") else ".png"
    dest_path = os.path.join(dest_dir, base_name + ext)
    webp_path = os.path.join(dest_dir, base_name + ".webp")
    
    # Save original optimized
    img.save(dest_path, optimize=True, quality=85)
    print(f"  Optimized: {dest_path}")
    
    # Save WebP
    img.save(webp_path, format="WEBP", quality=80)
    print(f"  WebP: {webp_path}")

print("Starting asset organization pipeline...")

for filename, (subfolder, semantic_name) in mappings.items():
    src_path = os.path.join(src_dir, filename)
    dest_dir = os.path.join(dest_root, subfolder)
    
    if os.path.exists(src_path):
        print(f"Processing {filename} -> {subfolder}/{semantic_name}")
        process_image(src_path, dest_dir, semantic_name)
    else:
        print(f"Warning: Source image {src_path} not found")

print("Asset organization pipeline finished!")
