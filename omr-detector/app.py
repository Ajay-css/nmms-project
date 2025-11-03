from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import tempfile
import os

app = Flask(__name__)
CORS(app)

@app.route("/scan", methods=["POST"])
def scan_omr():
    file = request.files.get("file")
    answer_key = request.form.get("answer_key", "")
    if not file:
        return jsonify({"error": "No file received"}), 400

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    file.save(tmp.name)

    img = cv2.imread(tmp.name)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)

    # Dummy scores
    scores = {
        "MAT": np.random.randint(30, 50),
        "SAT": np.random.randint(30, 50),
        "MATHS": np.random.randint(15, 25),
        "SCIENCE": np.random.randint(10, 20),
        "SOCIAL": np.random.randint(10, 15),
        "TOTAL": np.random.randint(70, 100)
    }

    os.remove(tmp.name)
    return jsonify({"scores": scores})

if __name__ == "__main__":
    app.run(port=5000, debug=True)