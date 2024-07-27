# Cloudinary image and video compression

Cloudinary provides several other options for the quality parameter that are not automatic. You can specify a numerical value or use keywords to control the quality and compression of your images. Here are some options:

Numerical Quality
You can set a specific percentage for the quality:

quality: "80": Sets the quality to 80%.
Keyword Quality
Cloudinary also provides keyword-based quality settings:

quality: "auto": Automatically adjusts quality based on the image content.
quality: "auto:low": Automatically adjusts to a low quality.
quality: "auto:eco": Automatically adjusts to an economical balance between quality and file size.
quality: "auto:good": Automatically adjusts to a good quality.
quality: "auto:best": Automatically adjusts to the best quality.
quality: "jpegmini": Uses the JPEGmini algorithm for lossy compression.
quality: "low": Low quality.
quality: "medium": Medium quality.
quality: "high": High quality.
Compression and Format-Specific Quality
You can specify quality for different formats:

quality: "jpeg_quality:70": Sets JPEG quality to 70%.
quality: "png_quality:50": Sets PNG quality to 50%.
quality: "webp_quality:80": Sets WebP quality to 80%.



When using Cloudinary with resource_type: "auto", Cloudinary will automatically detect the type of the file (image, video, etc.) and handle it accordingly. You can still use the quality parameter for videos, but the way it's applied might differ from images.

For videos, you might want to use the quality parameter along with other video-specific transformation options such as bit_rate, width, height, etc. Here's how you can adjust your function to handle both images and videos while applying appropriate quality settings:

For Images
quality: Sets the quality level.
For Videos
quality: Sets the video quality level.
bit_rate: Sets the video bitrate.
width, height: Sets the video resolution.