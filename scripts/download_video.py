import urllib.request
import os

video_dest = r"d:\Allied-infotech\src\assets\videos\industrial_loop.mp4"

urls = [
    # Mixkit robotic assembly preview loop
    "https://assets.mixkit.co/videos/preview/mixkit-robotic-arm-assembling-parts-in-a-factory-39906-large.mp4",
    # Mixkit circuit board robotic arm
    "https://assets.mixkit.co/videos/preview/mixkit-robotic-arm-assembling-circuits-in-a-factory-39907-large.mp4",
    # Google test video
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
}

success = False
for url in urls:
    try:
        print(f"Attempting to download video from: {url}")
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            content_length = response.getheader('Content-Length')
            if content_length:
                size_mb = int(content_length) / (1024 * 1024)
                print(f"Content-Length: {size_mb:.2f} MB")
                # If size is too small (e.g. less than 1KB), it might be an error page, skip it
                if int(content_length) < 5000:
                    print("File is too small. Skipping.")
                    continue
            
            with open(video_dest, 'wb') as out_file:
                out_file.write(response.read())
            
            print(f"Successfully saved to {video_dest}!")
            success = True
            break
    except Exception as e:
        print(f"Failed to download from {url}. Error: {e}")

if not success:
    print("Could not download any video loops. Creating a 0-byte placeholder video so imports won't fail.")
    with open(video_dest, 'wb') as out_file:
        out_file.write(b'')
