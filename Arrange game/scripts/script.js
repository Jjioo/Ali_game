        // Create floating bubbles
function createBubbles() {
    for (let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.width = `${20 + Math.random() * 30}px`;
        bubble.style.height = bubble.style.width;
        bubble.style.animationDuration = `${8 + Math.random() * 10}s`;
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        document.body.appendChild(bubble);
    }
}

let wordElements = document.querySelectorAll('.word');
let container = document.querySelector('.sentence');

const sentences = [
    ['the', 'cat', 'drinks', 'milk'],
    ['birds', 'fly', 'in', 'sky'],
    ['fish', 'swim', 'in', 'water'],
    ['children', 'play', 'with', 'toys'],
    ['sun', 'shines', 'very', 'bright']
];

let currentSentenceIndex = 0;
let correctOrder = sentences[0];
let scoreElement = document.getElementById('score');
let timerElement = document.getElementById('timer');
let score = 0;
let wrongAttempts = 0;
let timeLeft = 60; // 1 minute timer
let timerInterval;
let successSound = new Audio('/memory/sounds/success.mp3'); // Load the success sound
let wrongAnswerSound = new Audio('/memory/sounds/wrong-answer.mp3'); // Load the wrong answer sound
let gameOverSound = new Audio('/memory/sounds/game-over.mp3'); // Load the game over sound

function updateProgress() {
    const progress = ((currentSentenceIndex + 1) / sentences.length) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

// Start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time Left: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOverSound.play(); // Play game over sound
            showGameOver(); // Call function to show game over message
        }
    }, 1000);
}

// Drag and Drop Event Handlers
wordElements.forEach(word => {
    word.addEventListener('dragstart', handleDragStart);
    word.addEventListener('dragend', handleDragEnd);
});

container.addEventListener('dragover', handleDragOver);
container.addEventListener('drop', handleDrop);

function handleDragStart(e) {
    draggedWord = e.target;
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedWord = null;
}

function handleDragOver(e) {
    e.preventDefault();
    let afterElement = getDragAfterElement(e.clientX);
    if (afterElement == null) {
        container.appendChild(draggedWord);
    } else {
        container.insertBefore(draggedWord, afterElement);
    }
}

function handleDrop(e) {
    e.preventDefault();
}

function getDragAfterElement(x) {
    const draggableElements = [...container.querySelectorAll('.word:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function createFirework(x, y) {
    const colors = ['#e94560', '#fff', '#1f4068', '#ffd700'];
    
    for (let i = 0; i < 8; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = `${x}px`;
        firework.style.top = `${y}px`;
        firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        firework.style.transform = `rotate(${i * 45}deg)`;
        document.body.appendChild(firework);
        
        setTimeout(() => firework.remove(), 800);
    }
}

function redirectToMenu() {
    setTimeout(() => {
        window.location.href = '/menu/menu.html';
    }, 3000);
}

function verifyArrangement() {
    let userOrder = [...document.querySelectorAll('.word')].map(word => word.innerHTML);
    if (userOrder.join(' ') === correctOrder.join(' ')) {
        successSound.play(); // Play success sound
        // Create multiple fireworks
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                createFirework(x, y);
            }, i * 200);
        }

        score += 10; // Increment score for correct answer
        scoreElement.innerHTML = `Score: ${score}`;
        
        if (currentSentenceIndex === sentences.length - 1) {
            scoreElement.innerHTML += '<span class="success-message">🎉 Congratulations! You completed all sentences! 🎉</span>';
            redirectToMenu();
            return;
        }
        currentSentenceIndex++;
        correctOrder = sentences[currentSentenceIndex];
        updateWords();
        updateProgress();
        scoreElement.innerHTML += '<span class="success-message">✨ Good job! Next sentence... ✨</span>';
    } else {
        wrongAnswerSound.play(); // Play wrong answer sound
        wrongAttempts++;
        score -= 1; // Deduct score for wrong answer
        scoreElement.innerHTML = `Score: ${score} (Wrong Attempts: ${wrongAttempts})`;
        scoreElement.innerHTML += `<span class="error">Wrong! Try again.</span>`;
        vibrateScreen();
        highlightWrongWords(); // Call function to highlight wrong words
    }
}

function vibrateScreen() {
    document.body.classList.add('shake');
    setTimeout(() => {
        document.body.classList.remove('shake');
    }, 500);
}

function updateWords() {
    container.innerHTML = '';
    correctOrder.forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word';
        wordDiv.draggable = true;
        wordDiv.innerHTML = word;
        wordDiv.addEventListener('dragstart', handleDragStart);
        wordDiv.addEventListener('dragend', handleDragEnd);
        container.appendChild(wordDiv);
    });
    // Shuffle the words
    for (let i = container.children.length; i >= 0; i--) {
        container.appendChild(container.children[Math.random() * i | 0]);
    }
}

function highlightWrongWords() {
    const wordElements = document.querySelectorAll('.word');
    wordElements.forEach(word => {
        word.classList.add('wrong'); // Add 'wrong' class to highlight
        setTimeout(() => {
            word.classList.remove('wrong'); // Remove class after a short delay
        }, 1000);
    });
}


function restartGame() {
    // Reset game variables
    score = 0;
    wrongAttempts = 0;
    timeLeft = 60; // Reset timer to 60 seconds
    currentSentenceIndex = 0;
    correctOrder = sentences[0];

    // Clear the game over card if it exists
    const gameOverCard = document.querySelector('.game-over-card');
    if (gameOverCard) {
        gameOverCard.remove();
    }

    // Reset UI elements
    scoreElement.innerHTML = `Score: ${score}`;
    timerElement.textContent = `Time Left: ${timeLeft}s`;
    updateWords(); // Reset words in the container
    updateProgress(); // Reset progress bar
    startTimer(); // Restart the timer
    createBubbles(); // Restart the floating bubbles if needed
}


function showGameOver() {
    // Remove any existing game over card
    const existingCard = document.querySelector('.game-over-card');
    if (existingCard) {
        existingCard.remove();
    }

    const gameOverCard = document.createElement('div');
    gameOverCard.className = 'game-over-card';
    gameOverCard.innerHTML = `
        <h2>Game Over!</h2>
        <p>Your score: ${score}</p>
        <button class="restart-btn" onclick="restartGame()">Restart</button>
    `;
    document.body.appendChild(gameOverCard);
}

// Initialize the game
createBubbles();
updateWords();
updateProgress();
startTimer(); // Start the timer
setTimeout(() => {
    // Disable dragging after 5 seconds
    wordElements.forEach(word => {
        word.setAttribute('draggable', 'false');
    });
}, 5000); // Allow words to be draggable after 5 seconds
