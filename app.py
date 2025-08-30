from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

# Quiz questions (Python code related)
quiz_questions = [
    {
        "id": 1,
        "question": "What is the output of the following code?\n\n```python\nx = 10\ny = 20\nprint(x + y)\n```",
        "options": ["Berlin", "Madrid", "Paris", "Rome"],
        "answer": "Paris"
    },
    {
        "id": 2,
        "question": "Which planet is known as the Red Planet?",
        "options": ["Earth", "Mars", "Jupiter", "Venus"],
        "answer": "Mars"
    },
    {
        "id": 3,
        "question": "What is the largest ocean on Earth?",
        "options": ["Atlantic", "Indian", "Arctic", "Pacific"],
        "answer": "Pacific"
    }
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/question')
def get_question():
    question = random.choice(quiz_questions)
    return jsonify({
        "id": question["id"],
        "question": question["question"],
        "options": question["options"]
    })

@app.route('/api/answer', methods=['POST'])
def check_answer():
    data = request.get_json()
    question_id = data.get('question_id')
    user_answer = data.get('answer')

    question = next((q for q in quiz_questions if q["id"] == question_id), None)

    if question and question["answer"] == user_answer:
        return jsonify(correct=True)
    else:
        return jsonify(correct=False)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
