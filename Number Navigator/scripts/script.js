const numbers = [
    { number: "1", correct: "one" },
    { number: "2", correct: "two" },
    { number: "3", correct: "three" },
    { number: "4", correct: "four" },
    { number: "5", correct: "five" },
    { number: "6", correct: "six" },
    { number: "7", correct: "seven" },
    { number: "8", correct: "eight" },
    { number: "9", correct: "nine" },
    { number: "10", correct: "ten" }
];

let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;
let timer;
let timeLeft = 60; // 1 minute
let score = 0;
let isModalOpen = false;
let modalMessage = '';

function createCard(content, type) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-face card-front">?</div>
        <div class="card-face card-back">${content}</div>
    `;
    card.dataset.value = content;
    card.dataset.type = type;
    card.addEventListener('click', flipCard);
    return card;
}

// Replace alert calls with showModal
function showModal(message) {
    if (document.querySelector('.modal-overlay')) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">X</button>
            <p>${message}</p>
            <button class="restart-btn">Restart Game</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Freeze game
    canFlip = false;
    clearInterval(timer);
    
    // Event listeners
    modal.querySelector('.modal-close').onclick = () => {
        document.body.removeChild(modal);
        resetGame();
    };
    
    modal.querySelector('.restart-btn').onclick = () => {
        document.body.removeChild(modal);
        resetGame();
    };
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showPreviewMessage(show) {
    const message = document.getElementById('previewMessage');
    if (show) {
        message.classList.add('show');
    } else {
        message.classList.remove('show');
    }
}

function initializeGame() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    let cards = [];
    numbers.forEach(item => {
        cards.push({ content: item.number, type: 'number' });
        cards.push({ content: item.correct, type: 'word' });
    });
    
    cards = shuffleArray(cards);
    
    cards.forEach(card => {
        gameBoard.appendChild(createCard(card.content, card.type));
    });

    startCountdown();
}


function startCountdown() {
    const countdownElement = document.createElement('div');
    countdownElement.className = 'countdown';
    document.body.appendChild(countdownElement);

    let countdown = 3;
    countdownElement.textContent = countdown;

    // Show all cards immediately
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.add('flipped'));

    const countdownInterval = setInterval(() => {
        document.getElementById('countdownSound').play();
        countdownElement.textContent = countdown;
        countdown--;

        if (countdown < 0) {
            clearInterval(countdownInterval);
            document.body.removeChild(countdownElement);
            // Hide cards and start game
            allCards.forEach(card => card.classList.remove('flipped'));
            canFlip = true;
            startTimer();
        }
    }, 1000);
}


function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('progress').style.width = (timeLeft / 60) * 100 + '%';
        document.getElementById('timer').textContent = `Time Left: ${timeLeft}s`; // Update timer display
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById('timer').textContent = 'Time is up!';
            showModal('Your score is: ' + score);
        }
    }, 1000);
}

function flipCard() {
    if (!canFlip || this.classList.contains('flipped') || this.classList.contains('matched')) {
        return;
    }

    document.getElementById('flipSound').play();
    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        canFlip = false;
        checkMatch();
    }
}

function normalizeInput(input) {
    // Remove unwanted characters and normalize the string
    return input
        .toLowerCase() // Convert to lowercase for case-insensitive comparison
        .replace(/[.,]/g, '') // Remove periods and commas
        .replace(/[^a-z0-9\s]/g, '') // Remove all non-alphanumeric characters except spaces
        .trim(); // Trim whitespace from the start and end
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const value1 = normalizeInput(card1.dataset.value);
    const value2 = normalizeInput(card2.dataset.value);
    
    // Check for matches with more flexible logic
    const match = numbers.some(item => {
        const normalizedNumber = normalizeInput(item.number.toString());
        const normalizedCorrect = normalizeInput(item.correct.toString());
        
        // Allow for matching with or without punctuation
        return (value1 === normalizedNumber && value2 === normalizedCorrect) ||
               (value1 === normalizedCorrect && value2 === normalizedNumber);
    });

    moves++;
    document.getElementById('moves').textContent = moves;

    if (match) {
        document.getElementById('matchSound').play();
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        document.getElementById('score').textContent = `Score: ${matchedPairs}/${numbers.length}`; // Update score display
        if (matchedPairs === numbers.length) {
            setTimeout(() => {
                document.getElementById('successSound').play();
                showModal(`Congratulations! You won in ${moves} moves with a score of ${matchedPairs}/${numbers.length}!`);
                clearInterval(timer);
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 1000);
    }

    setTimeout(() => {
        flippedCards = [];
        canFlip = true;
    }, 1000);
}

function resetGame() {
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    canFlip = true;
    timeLeft = 2; // Reset time
    document.getElementById('moves').textContent = '0';
    document.getElementById('progress').style.width = '100%'; // Reset progress bar
    document.getElementById('score').textContent = 'Score: 0'; // Reset score display
    initializeGame();
}

// Initialize the game when the page loads
initializeGame();