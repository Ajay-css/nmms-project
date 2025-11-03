import cv2
import numpy as np

def process_omr(image_path, answer_key):
    # Load image
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5,5), 0)
    thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

    # Find contours
    cnts = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = cnts[0] if len(cnts) == 2 else cnts[1]
    cnts = sorted(cnts, key=lambda x: cv2.boundingRect(x)[1])

    bubbles = []
    for c in cnts:
        (x, y, w, h) = cv2.boundingRect(c)
        if 20 < w < 60 and 20 < h < 60:
            bubbles.append(c)

    # Split into rows of questions
    bubbles = sorted(bubbles, key=lambda c: cv2.boundingRect(c)[1])

    marked = []
    for i, c in enumerate(bubbles):
        mask = np.zeros(thresh.shape, dtype="uint8")
        cv2.drawContours(mask, [c], -1, 255, -1)
        total = cv2.countNonZero(cv2.bitwise_and(thresh, thresh, mask=mask))
        marked.append(total)

    # Detect answers
    answers = []
    for i in range(0, len(marked), 4):
        options = marked[i:i+4]
        if len(options) == 4:
            marked_idx = np.argmax(options)
            answers.append(chr(65 + marked_idx))

    # Compare with answer key
    score = 0
    for i in range(len(answer_key)):
        if i < len(answers) and answers[i] == answer_key[i]:
            score += 1

    return {"answers": answers, "score": score}