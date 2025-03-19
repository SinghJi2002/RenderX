import cv2
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)  # Fixed _name_ to __name__

def dodge_v2(x, y):
    return cv2.divide(x, 255 - y, scale=256)

def convert_to_sketch(image_path, output_path="sketch.jpg"):
    """ Converts an image to a pencil sketch and saves it. """
    image = cv2.imread(image_path)
    if image is None:
        raise FileNotFoundError(f"Image '{image_path}' not found.")
    
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    inverted_image = 255 - gray_image
    blurred_image = cv2.GaussianBlur(inverted_image, (21, 21), 0)
    sketch = dodge_v2(gray_image, blurred_image)
    
    cv2.imwrite(output_path, sketch)
    return output_path

@app.route("/convert", methods=["POST"])
def convert_image():
    """ API endpoint to accept an image and return a sketch version. """
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    image_file = request.files["image"]
    input_path = "input.jpg"
    output_path = "sketch.jpg"
    image_file.save(input_path)
    
    try:
        convert_to_sketch(input_path, output_path)
        return jsonify({"message": "Conversion successful", "output": output_path})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":  # Fixed _name_ to __name__
    import argparse
    
    parser = argparse.ArgumentParser(description="Convert an image to a pencil sketch.")
    parser.add_argument("image_path", type=str, help="Path to the input image.")
    parser.add_argument("--output", type=str, default="sketch.jpg", help="Path to save the output sketch.")
    
    args, unknown = parser.parse_known_args()
    
    if args.image_path:
        convert_to_sketch(args.image_path, args.output)
    else:
        app.run(debug=True)
