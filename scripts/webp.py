import os
from PIL import Image

# 指定目录
directory = r'..\src\assets'

# 遍历文件
for (path, folders, files) in os.walk(directory):
    for file_name in files:
        if file_name.endswith('.png'):
            webp_file_name = os.path.splitext(file_name)[0] + '.webp'
            webp_file_path = os.path.join(path, webp_file_name)
            if os.path.exists(webp_file_path):
                continue
            file_path = os.path.join(path, file_name)
            png_image = Image.open(file_path)
            png_image.save(webp_file_path, 'webp', lossless=True)
            png_image.close()
            print(f"已转换文件: {file_name} -> {webp_file_name}")
