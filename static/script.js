document.addEventListener('DOMContentLoaded', function() {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const submitButton = document.getElementById('submit-answer-btn');
    const feedbackElement = document.getElementById('feedback');

    let currentQuestionId = null;

    function fetchQuestion() {
        fetch('/api/question')
            .then(response => response.json())
            .then(data => {
                currentQuestionId = data.id;
                questionElement.textContent = data.question;
                optionsElement.innerHTML = ''; // Clear previous options
                data.options.forEach(option => {
                    const label = document.createElement('label');
                    label.innerHTML = `<input type="radio" name="answer" value="${option}"> ${option}`;
                    optionsElement.appendChild(label);
                });
                feedbackElement.textContent = ''; // Clear previous feedback
            })
            .catch(error => {
                console.error('Error fetching question:', error);
                questionElement.textContent = 'Failed to load question.';
            });
    }

    submitButton.addEventListener('click', function() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
            const userAnswer = selectedOption.value;
            fetch('/api/answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question_id: currentQuestionId, answer: userAnswer })
            })
            .then(response => response.json())
            .then(data => {
                if (data.correct) {
                    feedbackElement.textContent = 'Correct!';
                    feedbackElement.style.color = 'green';
                } else {
                    feedbackElement.textContent = 'Incorrect. Try again!';
                    feedbackElement.style.color = 'red';
                }
                // Fetch a new question after a short delay
                setTimeout(fetchQuestion, 1500);
            })
            .catch(error => {
                console.error('Error submitting answer:', error);
                feedbackElement.textContent = 'Error checking answer.';
                feedbackElement.style.color = 'black';
            });
        } else {
            feedbackElement.textContent = 'Please select an answer.';
            feedbackElement.style.color = 'orange';
        }
    });

    // Initial question load
    fetchQuestion();
});