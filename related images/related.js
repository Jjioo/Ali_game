// Game data
const themes = [
    {
        images: [
            '/related images/images/student.jpg',
            '/related images/images/teacher.jpg',
            '/related images/images/classroom.jpg'
        ],
        answer: 'teacher',
        hint: "This is a profession that educates students! 📚"
    },
    {
        images: [
            '/related images/images/doctor.jpg',
            '/related images/images/hospital.jpg',
            '/related images/images/stethoscope.jpg'
        ],
        answer: 'doctor',
        hint: "This person helps you when you're sick! 🩺"
    },
    // Add more themes here
];

let currentTheme = 0;
let score = 0;

// Initialize the game
function initGame() {
    displayTheme(currentTheme);
    updateScore();
}

// Display current theme images and choices
function displayTheme(themeIndex) {
    const container = document.getElementById('imagesContainer');
    const choicesContainer = document.getElementById('choicesContainer');
    container.innerHTML = '';
    choicesContainer.innerHTML = '';

    // Display images
    themes[themeIndex].images.forEach((image) => {
        const img = document.createElement('img');
        img.src = image;
        img.className = 'theme-image';
        container.appendChild(img);
    });

    // Display job choices
    const choices = ['teacher', 'doctor', 'nurse', 'engineer']; // Example choices
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice.charAt(0).toUpperCase() + choice.slice(1);
        button.className = 'choice-button';
        button.onclick = () => checkAnswer(choice);
        choicesContainer.appendChild(button);
    });

    // Reset feedback
    document.getElementById('feedback').style.display = 'none';
}

// Check player's answer
function checkAnswer(userAnswer) {
    const currentAnswer = themes[currentTheme].answer;
    const feedback = document.getElementById('feedback');
    const imgElements = document.querySelectorAll('.theme-image');

    if (userAnswer === currentAnswer) {
        // Correct answer
        feedback.textContent = '🎉 Wonderful! You got it right! 🌟';
        score += 10; // Add points for correct answer
        playSound('correct'); // Play correct sound
    } else {
        // Incorrect answer
        feedback.textContent = `❌ Not quite right. The correct answer is: ${currentAnswer}. You lost 5 points.`;
        score -= 5; // Deduct points for incorrect answer
        playSound('wrong'); // Play wrong sound

        // Apply the wrong class to the images
        imgElements.forEach(img => {
            img.classList.add('wrong');
        });
    }

    feedback.style.display = 'block';
    updateScore();
    document.getElementById('nextButton').style.display = 'inline-block'; // Show next button

    // Remove the wrong class after the animation is done
    setTimeout(() => {
        imgElements.forEach(img => {
            img.classList.remove('wrong');
        });
    }, 500); // Match this duration with the animation duration
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Show hint
function showHint() {
    const hintText = document.getElementById('hintText');
    hintText.textContent = themes[currentTheme].hint;
    hintText.style.display = 'block';
}

// Move to next theme
function nextQuestion() {
    currentTheme++;
    
    if (currentTheme >= themes.length) {
        // Game completed
        showGameComplete();
    } else {
        displayTheme(currentTheme);
    }
}

// Show game completion
function showGameComplete() {
    const container = document.querySelector('.game-container');
    container.innerHTML = `
        <h1 class="game-title">🎉 Amazing Job! 🎉</h1>
        <div class="score-display">Final Score: ${score} 🌟</div>
        <p style="font-size: 1.2rem; margin: 2rem 0;">You've completed all the themes!</p>
        <button onclick="restartGame()" class="check-button">
            Play Again! 🎮
        </button>
    `;
}

// Restart game
function restartGame() {
    // Reload the current page
    window.location.reload();
}

// Play sound for correct and wrong answers
function playSound(type) {
    const sound = document.getElementById(type + 'Sound');
    sound.currentTime = 0; // Reset sound to start
    sound.play();
}

// Initialize game when page loads
window.onload = initGame;