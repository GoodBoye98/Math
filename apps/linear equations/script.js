document.addEventListener('DOMContentLoaded', () => {
    const equationElement = document.getElementById('equation');
    const xInput = document.getElementById('x');
    const submitButton = document.getElementById('submit');
    const returnButton = document.getElementById('return');
    const correctCountElement = document.getElementById('correctCount');
    const incorrectCountElement = document.getElementById('incorrectCount');
    const progressElement = document.getElementById('progress');
    const percentageElement = document.getElementById('percentage');

    let correctCount = 0;
    let incorrectCount = 0;
    const totalTime = 60;
    let timeLeft = totalTime;
    let timerInterval;

    function generateEquation() {
        const a = Math.floor(Math.random() * 21) - 10;
        const b = Math.floor(Math.random() * 21) - 10;
        const c = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 21) - 10;
        const d = Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 21) - 10;

        if (a === c) {
            return generateEquation();
        }
        
        let a_string = a === 0 ? '' : a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`;
        let b_string = b === 0 ? '' : b > 0 ? `+${b}` : `${b}`;
        let c_string = c === 0 ? '' : c === 1 ? 'x' : c === -1 ? '-x' : `${c}x`;
        let d_string = d === 0 ? '' : d > 0 ? `+${d}` : `${d}`;
        if (c === 0) {
            d_string = d === 0 ? '' : d > 0 ? `${d}` : `${d}`;
        }
        if (c_string == '' && d_string == '') {
            d_string = '0';
        }

        equationElement.textContent = `\\(${a_string}${b_string} = ${c_string}${d_string}\\)`;
        MathJax.typesetPromise();
        return { a, b, c, d };
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

    document.getElementById('timer-text').textContent = `${timeLeft}`;
    document.querySelector('.timer-circle').style.setProperty('--time-percentage', `${0}%`);

    let currentEquation = generateEquation();

    returnButton.addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    submitButton.addEventListener('click', () => {
        
        let xValue;
        try {
            const sanitizedInput = xInput.value.replace(/\s+/g, '');
            xValue = math.evaluate(sanitizedInput);
        } catch (error) {
            xValue = null;
        }
        const correctAnswer = (currentEquation.d - currentEquation.b) / (currentEquation.a - currentEquation.c);

        if (Math.abs(xValue - correctAnswer) < 0.01) {
            correctCount++;
            correctCountElement.textContent = correctCount;
            equationElement.classList.add('correct-animation');
        } else {
            incorrectCount++;
            incorrectCountElement.textContent = incorrectCount;
            equationElement.classList.add('wrong-animation');
        }

        setTimeout(() => {
            equationElement.classList.remove('correct-animation', 'wrong-animation');
        }, 600);

        const total = correctCount + incorrectCount;
        const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
        progressElement.style.width = `${percentage}%`;
        percentageElement.textContent = `${percentage}%`;

        currentEquation = generateEquation();
        xInput.value = '';
    });

    xInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            submitButton.click();
        }
    });

    startTimer();
});