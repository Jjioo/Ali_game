
        const flags = [
            { image: '/flags/images/usa.png', country: 'United States' },
            { image: '/flags/images/palastina.png', country: 'Palastina' },
            { image: '/flags/images/japan.png', country: 'Japan' },
            { image: '/flags/images/brazil.png', country: 'Brazil' },
            { image: '/flags/images/saudi-arabia.png', country: 'Saudi Arabia' }
        ];

        let currentFlag = 0;
        let correctAnswers = 0;
        let totalQuestions = 0;
        const MAX_QUESTIONS = 6;

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function displayFlag() {
            const flag = flags[currentFlag];
            document.getElementById('flag').src = flag.image;
            
            let options = [flag.country];
            while (options.length < 4) {
                const randomFlag = flags[Math.floor(Math.random() * flags.length)];
                if (!options.includes(randomFlag.country)) {
                    options.push(randomFlag.country);
                }
            }
            
            options = shuffleArray(options);
            
            const optionsContainer = document.getElementById('options');
            optionsContainer.innerHTML = '';
            
            options.forEach(option => {
                const button = document.createElement('button');
                button.className = 'option';
                button.textContent = option;
                button.onclick = () => checkAnswer(option, flag.country, button);
                optionsContainer.appendChild(button);
            });
        }

        function checkAnswer(selected, correct, button) {
            totalQuestions++;
            document.getElementById('total').textContent = totalQuestions;
            
            const buttons = document.querySelectorAll('.option');
            buttons.forEach(btn => btn.disabled = true);
            
            if (selected === correct) {
                correctAnswers++;
                document.getElementById('correct').textContent = correctAnswers;
                button.classList.add('correct');
                playSound('correct');
            } else {
                button.classList.add('wrong');
                buttons.forEach(btn => {
                    if (btn.textContent === correct) {
                        btn.classList.add('correct');
                    }
                });
                playSound('wrong');
            }

            updateProgress();
            
            setTimeout(() => {
                if (totalQuestions >= MAX_QUESTIONS) {
                    endGame();
                } else {
                    currentFlag = (currentFlag + 1) % flags.length;
                    displayFlag();
                }
            }, 1500);
        }

        function updateProgress() {
            const progress = (correctAnswers / totalQuestions) * 100;
            document.getElementById('progress').style.width = progress + '%';
        }

        function playSound(type) {
            const sound = document.getElementById(type + 'Sound');
            sound.currentTime = 0;
            sound.play();
            
            if (type === 'wrong') {
                const flagImage = document.getElementById('flag');
                flagImage.style.animation = 'wrong-answer 0.5s';
                setTimeout(() => {
                    flagImage.style.animation = 'float 3s ease-in-out infinite';
                }, 500);
            }
        }

        function endGame() {
            const optionsContainer = document.getElementById('options');
            optionsContainer.innerHTML = '';
            
            const resultMessage = document.createElement('h2');
            resultMessage.style.marginBottom = '20px';
            
            if (correctAnswers === MAX_QUESTIONS) {
                resultMessage.textContent = `Congratulations! Perfect score: ${correctAnswers}/${MAX_QUESTIONS}`;
            } else {
                resultMessage.textContent = `Game Over! Your score is: ${correctAnswers}/${MAX_QUESTIONS}`;
            }
            
            optionsContainer.appendChild(resultMessage);
            
            const playAgainBtn = document.createElement('button');
            playAgainBtn.className = 'option';
            playAgainBtn.style.gridColumn = '1 / -1';  // Make button span full width
            playAgainBtn.textContent = 'Play Again';
            playAgainBtn.onclick = resetGame;
            optionsContainer.appendChild(playAgainBtn);
        }

        function resetGame() {
            currentFlag = 0;
            correctAnswers = 0;
            totalQuestions = 0;
            document.getElementById('correct').textContent = '0';
            document.getElementById('total').textContent = '0';
            document.getElementById('progress').style.width = '0%';
            displayFlag();
        }

        displayFlag();
   