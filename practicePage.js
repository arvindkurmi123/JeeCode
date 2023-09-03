window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const questionId = urlParams.get('questionId');

    try {
        const response = await fetch(`/getQuestionById/${questionId}`);
        const question = await response.json();

        document.querySelector('.text').textContent = question.description;
        document.querySelector('.difficulty').textContent = "Difficulty: " + question.difficulty;
        const optionElems = document.querySelectorAll('.option span');
        optionElems[0].textContent = question.optionA;
        optionElems[1].textContent = question.optionB;
        optionElems[2].textContent = question.optionC;
        optionElems[3].textContent = question.optionD;

        document.getElementById('checkBtn').addEventListener('click', function() {
            const selectedOption = document.querySelector('.options input[type="radio"]:checked');
            if (selectedOption) {
                if (selectedOption.value === "option" + question.correctAnswer) {
                    alert('Correct Answer!');
                } else {
                    alert('Wrong Answer! The correct answer is: ' + question["option" + question.correctAnswer]);
                }
            } else {
                alert('Please select an option.');
            }
        });

        // Timer functionality here...
        let remainingTime = 120;  // 2 minutes in seconds

// ... your existing code ...

// Timer functionality
const timerElem = document.getElementById('timer');
const timerInterval = setInterval(function() {
    remainingTime--;

    // Convert the remaining time to MM:SS format
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timerElem.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    // When time's up
    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        alert('Time is up!');
    }
}, 1000);


    } catch (error) {
        console.error("Error fetching question:", error);
    }
}
