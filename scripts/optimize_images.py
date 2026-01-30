import os
import subprocess
import shutil
import sys

def optimize_images():
    # Configuration
    target_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../public/images/articles'))
    backup_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../public/images/articles_backup'))
    max_dimension = 1200  # Max width or height in pixels

    print(f"Target Directory: {target_dir}")
    
    if not os.path.exists(target_dir):
        print("Target directory not found.")
        return

    # Create backup directory
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
        print(f"Created backup directory: {backup_dir}")

    # Files to process
    files = [f for f in os.listdir(target_dir) if f.lower().endswith('.png')]
    files.sort()

    if not files:
        print("No PNG files found.")
        return

    print(f"Found {len(files)} PNG files.")
    print("-" * 60)
    print(f"{'Filename':<30} | {'Original Size':<15} | {'New Size':<15} | {'Reduction':<10}")
    print("-" * 60)

    total_original_size = 0
    total_new_size = 0

    for filename in files:
        file_path = os.path.join(target_dir, filename)
        backup_path = os.path.join(backup_dir, filename)

        # Backup if not exists
        if not os.path.exists(backup_path):
            shutil.copy2(file_path, backup_path)

        # Get original size
        original_size = os.path.getsize(file_path)
        total_original_size += original_size

        # Optimize using sips (Mac built-in tool)
        # -Z maintains aspect ratio and resamples keeping the max dimension to the specified value
        try:
            subprocess.run(
                ['sips', '-Z', str(max_dimension), file_path],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
        except subprocess.CalledProcessError as e:
            print(f"Error processing {filename}: {e}")
            continue

        # Get new size
        new_size = os.path.getsize(file_path)
        total_new_size += new_size

        reduction = (1 - new_size / original_size) * 100
        
        print(f"{filename:<30} | {format_size(original_size):<15} | {format_size(new_size):<15} | {reduction:.1f}%")

    print("-" * 60)
    print(f"Total Original Size: {format_size(total_original_size)}")
    print(f"Total New Size:      {format_size(total_new_size)}")
    print(f"Total Reduction:     {(1 - total_new_size / total_original_size) * 100:.1f}%")
    print("-" * 60)
    print(f"Backup is available at: {backup_dir}")

def format_size(size_bytes):
    if size_bytes == 0:
        return "0B"
    size_name = ("B", "KB", "MB", "GB", "TB")
    i = int(os.path.dirname(os.path.abspath(__file__)).count('/')) # dummy logic to avoid import math
    import math
    i = int(math.floor(math.log(size_bytes, 1024)))
    p = math.pow(1024, i)
    s = round(size_bytes / p, 2)
    return "%s %s" % (s, size_name[i])

if __name__ == "__main__":
    optimize_images()
