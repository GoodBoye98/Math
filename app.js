let x0, x1;
let correctCount = 0;
let incorrectCount = 0;
const totalTime = 60;
let timeLeft = totalTime;  // Timer in seconds
let timerInterval;

// Function to generate a new question
function generateQuestion() {
    // Generate random numbers and the LaTeX string for the question
    const a = Math.floor(Math.random() * 15) - 7;
    const b = Math.floor(Math.random() * 15) - 7;

    num1 = a + b
    num2 = a * b

    // Format num1 as a string
    let num1_string = num1 === 0 ? '' :
        num1 === -1 ? '-x' :
        num1 === 1 ? '+x' :
        (num1 > 0 ? `+${num1}` : `${num1}`) + 'x';

    // Format num2 as a string
    const num2_string = num2 === 0 ? '' : (num2 > 0 ? `+${num2}` : `${num2}`);

    document.getElementById('equation').textContent = `\\(x^2${num1_string}${num2_string}=0\\)`;

    // Re-render MathJax to display the LaTeX
    MathJax.typesetPromise();

    // Store the correct roots in x0 and x1
    x0 = -a;
    x1 = -b;
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-text').textContent = `${timeLeft}`;

        // Calculate the percentage of time left and update the CSS variable
        const percentage = (1 - timeLeft / totalTime) * 100;
        document.querySelector('.timer-circle').style.setProperty('--time-percentage', `${percentage}%`);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

// End game
function endGame() {
    // Redirect to results.html with the score as query parameters
    window.location.href = `results.html?correct=${correctCount}&incorrect=${incorrectCount}`;
}

// Update progress bar
function updateProgress() {
    const total = correctCount + incorrectCount;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('incorrectCount').textContent = incorrectCount;
    document.getElementById('percentage').textContent = `${percentage}%`;
    document.getElementById('progress').style.width = `${percentage}%`;
}

// Function to check the answer
function checkAnswer() {
    const userX0 = parseInt(document.getElementById('x0').value, 10);
    const userX1 = parseInt(document.getElementById('x1').value, 10);
    const correctBox = document.getElementById('correctCount').parentNode;
    const wrongBox = document.getElementById('incorrectCount').parentNode;

    // Check if the entered roots match the generated roots, in any order
    if ((userX0 === x0 && userX1 === x1) || (userX0 === x1 && userX1 === x0)) {
        generateQuestion(); // Generate a new question if correct
        document.getElementById('x0').value = ''; // Clear the input fields
        document.getElementById('x1').value = '';
        correctCount += 1;
        
        // Add and remove flash animation class
        correctBox.classList.add('correct-animation');
        setTimeout(() => correctBox.classList.remove('correct-animation'), 600);
    } else {
        generateQuestion(); // Generate a new question if correct
        document.getElementById('x0').value = ''; // Clear the input fields
        document.getElementById('x1').value = '';
        incorrectCount += 1;
        
        // Add and remove shake animation class
        wrongBox.classList.add('wrong-animation');
        setTimeout(() => wrongBox.classList.remove('wrong-animation'), 400);
    }

    updateProgress();
}

// Event listener for the submit button
document.getElementById('submit').addEventListener('click', checkAnswer);
document.getElementById('timer-text').textContent = `${timeLeft}`;
document.querySelector('.timer-circle').style.setProperty('--time-percentage', `${0}%`);

// Initialize the first question
startTimer();
generateQuestion();
