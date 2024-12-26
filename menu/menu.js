document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const icon = darkModeToggle.querySelector('i');
    const hoverSound = document.getElementById('hoverSound');
    
    // Check for saved user preference
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    // Play sound on hover over game cards
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            hoverSound.currentTime = 0;
            hoverSound.play();
        });
    });
    
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Toggle icon
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('darkMode', null);
        }
    });
});
