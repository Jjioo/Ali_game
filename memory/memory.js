let currentLevel = 1;
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;
let moves = 0;
let timer = null;
let seconds = 0;
let isGameStarted = false;


const cards = {
    level1: [
        { id: 1, image: 'images/cat.jpg' },
        { id: 1, image: 'images/cat.jpg' },
        { id: 2, image: 'images/dog.jpg' },
        { id: 2, image: 'images/dog.jpg' }
    ],
    level2: [
        { id: 1, image: 'images/cat.jpg' },
        { id: 1, image: 'images/cat.jpg' },
        { id: 2, image: 'images/dog.jpg' },
        { id: 2, image: 'images/dog.jpg' },
        { id: 3, image: 'images/bird.jpg' },
        { id: 3, image: 'images/bird.jpg' },
        { id: 4, image: 'images/fish.jpg' },
        { id: 4, image: 'images/fish.jpg' }
    ],
};

// Sound effects
const flipSound = document.getElementById('flipSound');
const matchSound = document.getElementById('matchSound');
const successSound = document.getElementById('successSound');
function playSound(sound) {
   sound.currentTime = 0;
   sound.play().catch(e => console.log("Sound play failed:", e));
}

function updateTimer() {
   const minutes = Math.floor(seconds / 60);
   const remainingSeconds = seconds % 60;
   document.getElementById('timer').textContent = 
       `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
   seconds++;
}

function startTimer() {
   if (!isGameStarted) {
       isGameStarted = true;
       timer = setInterval(updateTimer, 1000);
   }
}

function stopTimer() {
   clearInterval(timer);
   isGameStarted = false;
}

function updateProgress() {
   const totalPairs = cards[`level${currentLevel}`].length / 2;
   const progress = (matchedPairs / totalPairs) * 100;
   document.querySelector('.progress').style.width = `${progress}%`;
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

function shuffleCards(level) {
   return [...cards[`level${level}`]].sort(() => Math.random() - 0.5);
}


function showAllCardsTemporarily() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.add('flipped')); // Show the back side (image)
    
    setTimeout(() => {
        allCards.forEach(card => card.classList.remove('flipped')); // Flip back to front side
        canFlip = true; // Allow flipping after initial reveal
    }, 3000); // Show for 3 seconds
}


function createBoard(level) {
    const gameBoard = document.querySelector('.game-board');
    gameBoard.className = `game-board level-${level}`;
    const shuffledCards = shuffleCards(level);
    gameBoard.innerHTML = '';
    matchedPairs = 0;
    moves = 0;
    updateMoves();
    updateProgress();

    document.getElementById('current-level').textContent = level;

    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.id = card.id;
        cardElement.dataset.index = index;

        cardElement.innerHTML = `
        <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back" style="background-image: url('${card.image}')"></div>
        </div>
    `;

        cardElement.addEventListener('click', () => flipCard(cardElement));
        gameBoard.appendChild(cardElement);
    });

    canFlip = false; // Disable flipping during initial reveal
    showAllCardsTemporarily(); // Show all cards at the start
}


function updateMoves() {
   document.getElementById('moves').textContent = moves;
   document.getElementById('matches').textContent = matchedPairs;
}

function flipCard(card) {
   if (!canFlip || card.classList.contains('flipped') || flippedCards.length >= 2) return;
   
   startTimer();
   playSound(flipSound);
   
   card.classList.add('flipped');
   flippedCards.push(card);
   
   if (flippedCards.length === 2) {
       moves++;
       updateMoves();
       canFlip = false;
       checkMatch();
   }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.id === card2.dataset.id;
    
    if (match) {
        matchedPairs++;
        updateMoves();
        updateProgress();
        playSound(matchSound);
        
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        canFlip = true;
        
        // Fireworks effect
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createFirework(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight
                );
            }, i * 200);
        }
        
        // Only check level completion after animation
        setTimeout(checkLevelComplete, 500);
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

function checkLevelComplete() {
   const totalPairs = cards[`level${currentLevel}`].length / 2;
   
   if (matchedPairs === totalPairs) {
       playSound(successSound);
       
       if (currentLevel === 2) {
           // Game completed
           stopTimer();
           const scoreElement = document.getElementById('score');
           
           const successMessage = document.querySelector('.success-message');
           successMessage.style.display = 'block'; // Show the message
           
           setTimeout(() => {
               successMessage.style.display = 'none'; // Hide the message after 2 seconds
           }, 2000);
           
           setTimeout(redirectToMenu, 3000); // Redirect after 3 seconds
       } else {
           // Next level
           currentLevel++;
           document.getElementById('score').innerHTML = 
               `<div class="success-message">
                  
               </div>`;
           setTimeout(() => {
               createBoard(currentLevel);
           }, 1500);
       }
   }
}

function redirectToMenu() {
    window.location.href = '/menu/menu.html'; // Adjust the path as necessary
}

function restartGame() {
   currentLevel = 1;
   seconds = 0;
   stopTimer();
   createBoard(currentLevel);
}

// Initialize the game
document.getElementById('restart').addEventListener('click', restartGame);
createBoard(currentLevel);