// Family activities data
const familyActivities = [
    {
        image: '/Family/images/mom-cooking.jpg',
        description: 'Mom Khalida is cooking delicious food in the kitchen! 👩‍🍳',
        answer: ['mom khalida cooking', 'mom cooking', 'khalida cooking', 'cooking in kitchen', 'mom is cook', 'mom is cooking']
    },
    {
        image: '/Family/images/dad-garden.jpg',
        description: 'Dad Ahmad is taking care of the garden! 🌺',
        answer: ['dad ahmad gardening', 'dad gardening', 'ahmad gardening', 'gardening', 'dad is gardening', 'dad is in garden']
    },
    {
        image: '/Family/images/sister-homework.jpg',
        description: 'Sister Sara is doing her homework! 📚',
        answer: ['sister sara homework', 'sara homework', 'doing homework', 'sister is doing homework', 'sister is studying']
    },
    {
        image: '/Family/images/brother-sleeping.jpg',
        description: 'Brother Tarek is sleeping! 🛌',
        answer: ['brother ahmad sleeping', 'ahmad sleeping', 'sleeping', 'brother is sleeping', 'brother is asleep']
    },
    // Add more activities as needed
];

let currentCard = 0;
let testMode = false;
let currentTestQuestion = 0;

// Add sound effects
const successSound = new Audio('memory/sounds/success.mp3');
const wrongSound = new Audio('memory/sounds/wrong-answer.mp3');

// Initialize the game
function initGame() {
    updateCard();
    createProgressDots();
    addFloatingStars();
}

// Create floating star animations
function addFloatingStars() {
    const starsContainer = document.querySelector('.floating-stars');
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('span');
        star.textContent = '⭐';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animation = `float ${3 + Math.random() * 4}s infinite`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        starsContainer.appendChild(star);
    }
}

// Update card content
function updateCard() {
    const activity = familyActivities[currentCard];
    document.getElementById('family-image').src = activity.image;
    document.getElementById('description').textContent = activity.description;
    updateProgressDots();
}

// Create progress dots
function createProgressDots() {
    const dotsContainer = document.querySelector('.progress-dots');
    dotsContainer.innerHTML = '';
    for (let i = 0; i < familyActivities.length; i++) {
        const dot = document.createElement('div');
        dot.className = `dot ${i === currentCard ? 'active' : ''}`;
        dotsContainer.appendChild(dot);
    }
}

// Update progress dots
function updateProgressDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.className = `dot ${index === currentCard ? 'active' : ''}`;
    });
}

// Navigation functions
function nextCard() {
    if (currentCard < familyActivities.length - 1) {
        currentCard++;
        updateCard();
    }
}

function previousCard() {
    if (currentCard > 0) {
        currentCard--;
        updateCard();
    }
}

// Start test mode
function startTest() {
    testMode = true;
    currentTestQuestion = 0;
    document.getElementById('learning-mode').classList.add('hidden');
    document.getElementById('test-mode').classList.remove('hidden');
    updateTestQuestion();
}

// Update test question
function updateTestQuestion() {
    const activity = familyActivities[currentTestQuestion];
    document.getElementById('test-image').src = activity.image;
    document.getElementById('feedback').innerHTML = '';
    displayChoices(activity.answer);
}

// Display choices for the user to select
function displayChoices(choices) {
    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';
    
    // Shuffle and select 4 choices, ensuring only one is correct
    const correctAnswer = choices[Math.floor(Math.random() * choices.length)];
    const incorrectAnswers = choices.filter(choice => choice !== correctAnswer);
    const selectedChoices = [correctAnswer, ...getRandomElements(incorrectAnswers, 3)];
    
    // Shuffle selected choices to randomize their order
    const shuffledChoices = selectedChoices.sort(() => Math.random() - 0.5);
    
    shuffledChoices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.className = 'choice-button';
        button.onclick = () => checkAnswer(choice);
        choicesContainer.appendChild(button);
    });
}

// Get random elements from an array
function getRandomElements(arr, num) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

// Check answer
function checkAnswer(selectedAnswer) {
    const currentActivity = familyActivities[currentTestQuestion];
    const feedback = document.getElementById('feedback');
    
    if (currentActivity.answer.includes(selectedAnswer)) {
        feedback.className = 'feedback correct';
        feedback.innerHTML = '🎉 Correct! Well done! 🌟';
        successSound.play(); // Play success sound
        
        setTimeout(() => {
            if (currentTestQuestion < familyActivities.length - 1) {
                currentTestQuestion++;
                updateTestQuestion();
            } else {
                showCompletionMessage();
            }
        }, 1500);
    } else {
        feedback.className = 'feedback incorrect';
        feedback.innerHTML = '❌ Try again! You can do it! ����';
        wrongSound.play(); // Play wrong answer sound
    }
}

// Return to learning mode
function returnToLearning() {
    testMode = false;
    document.getElementById('test-mode').classList.add('hidden');
    document.getElementById('learning-mode').classList.remove('hidden');
}

// Show completion message
function showCompletionMessage() {
    document.getElementById('test-mode').innerHTML = `
        <h1 class="rainbow-title">🎉 Congratulations! 🎉</h1>
        <div class="completion-message">
            <p>You've learned all about family activities!</p>
            <button class="rainbow-button" onclick="returnToLearning()">
                Learn Again! 📚
            </button>
        </div>
    `;
}

// Initialize the game when the page loads
window.onload = initGame;