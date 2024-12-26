const seasons = [
    {
        image: "/Season/images/summer.jpg",
        correct: "Summer",
        options: ["Spring", "Summer", "Autumn", "Winter"]
    },
    {
        image: "/Season/images/winter.jpg",
        correct: "Winter",
        options: ["Spring", "Summer", "Autumn", "Winter"]
    },
    {
        image: "/Season/images/autumn.jpg",
        correct: "Autumn",
        options: ["Spring", "Summer", "Autumn", "Winter"]
    }
];

// Create floating clouds
function createClouds() {
    const cloudsContainer = document.querySelector('.clouds');
    for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.top = `${Math.random() * 70}%`;
        cloud.style.width = `${80 + Math.random() * 100}px`;
        cloud.style.height = `${50 + Math.random() * 50}px`;
        cloud.style.animationDuration = `${15 + Math.random() * 10}s`;
        cloud.style.animationDelay = `${Math.random() * 5}s`;
        cloudsContainer.appendChild(cloud);
    }
}

let currentSeasonIndex = 0;
const imageElement = document.getElementById('seasonImage');
const choicesContainer = document.querySelector('.choices');
const scoreElement = document.getElementById('score');

let successSound = new Audio('/memory/sounds/success.mp3'); // Load the success sound
let wrongAnswerSound = new Audio('/memory/sounds/wrong-answer.mp3'); // Load the wrong answer sound

function redirectToMenu() {
    setTimeout(() => {
        window.location.href = '/menu/menu.html';
    }, 3000);
}

function createFirework(x, y) {
    const colors = ['#ff69b4', '#ffd700', '#66a6ff', '#4CAF50'];
    
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

function checkAnswer(selectedOption) {
    const currentSeason = seasons[currentSeasonIndex];
    
    if (selectedOption === currentSeason.correct) {
        successSound.play(); // Play success sound
        // Create multiple fireworks
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                createFirework(x, y);
            }, i * 200);
        }

        if (currentSeasonIndex === seasons.length - 1) {
            scoreElement.innerHTML = '<span class="success-message">🎉 Hooray! You know all the seasons! 🎉</span>';
            redirectToMenu();
            return;
        }
        
        currentSeasonIndex++;
        updateDisplay();
        scoreElement.innerHTML = '<span class="success-message">✨ Wonderful! Let\'s try the next season! ✨</span>';
    } else {
        wrongAnswerSound.play(); // Play wrong answer sound
        scoreElement.innerHTML = '<span class="error">Oops! Try again! You can do it! 🌟</span>';
        highlightWrongChoices(selectedOption); // Highlight the wrong choice
    }
}

function highlightWrongChoices(selectedOption) {
    const buttons = document.querySelectorAll('.choice-btn');
    buttons.forEach(button => {
        if (button.textContent === selectedOption) {
            button.classList.add('wrong'); // Add 'wrong' class to highlight
            setTimeout(() => {
                button.classList.remove('wrong'); // Remove class after a short delay
            }, 1000);
        }
    });
}

function updateDisplay() {
    const currentSeason = seasons[currentSeasonIndex];
    imageElement.src = currentSeason.image;
    
    choicesContainer.innerHTML = '';
    
    const shuffledOptions = [...currentSeason.options].sort(() => Math.random() - 0.5);
    
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        choicesContainer.appendChild(button);
    });
}

// Initialize the game and create clouds
createClouds();
updateDisplay();
