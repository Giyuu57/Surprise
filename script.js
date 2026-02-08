/* ============================================
   VALENTINE WEEK APP - JAVASCRIPT
   ============================================ */

// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
    password: "Mukuu",
    unlockDates: {
        1: "2026-02-07",  // Rose Day
        2: "2026-02-08",  // Propose Day
        3: "2026-02-09",  // Chocolate Day
        4: "2026-02-10",  // Teddy Day
        5: "2026-02-11",  // Promise Day
        6: "2026-02-12",  // Hug Day
        7: "2026-02-13",  // Kiss Day
        8: "2026-02-14"   // Valentine's Day
    },
    testMode: false
};

// ========================================
// MUSIC PLAYER (CONTINUOUS ACROSS PAGES)
// ========================================
let musicAudio = null;
let isMusicPlaying = false;

function initMusic() {
    musicAudio = document.getElementById('backgroundMusic');
    if (!musicAudio) return;
    
    // Set the music source to xyz.mp3
    musicAudio.src = 'xyz.mp3';
    musicAudio.volume = 0.3;
    musicAudio.loop = true;
    
    // Restore playback position from localStorage
    const savedTime = localStorage.getItem('valentine_music_time');
    const savedPlaying = localStorage.getItem('valentine_music_playing');
    
    if (savedTime) {
        musicAudio.currentTime = parseFloat(savedTime);
    }
    
    // Auto-resume if music was playing
    if (savedPlaying === 'true') {
        playMusic();
    }
    
    // Save playback position every second
    setInterval(() => {
        if (musicAudio && !musicAudio.paused) {
            localStorage.setItem('valentine_music_time', musicAudio.currentTime.toString());
        }
    }, 1000);
}

function toggleMusic() {
    if (!musicAudio) {
        initMusic();
    }
    
    if (isMusicPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    if (!musicAudio) {
        initMusic();
    }
    
    const toggle = document.getElementById('musicToggle');
    const playing = toggle?.querySelector('.playing');
    const paused = toggle?.querySelector('.paused');
    
    musicAudio.play().then(() => {
        isMusicPlaying = true;
        localStorage.setItem('valentine_music_playing', 'true');
        if (playing) playing.classList.remove('hidden');
        if (paused) paused.classList.add('hidden');
        if (toggle) toggle.classList.add('playing-animation');
    }).catch(err => {
        console.log('Music play failed:', err);
        console.log('Make sure xyz.mp3 file is in the same folder!');
    });
}

function pauseMusic() {
    if (!musicAudio) return;
    
    const toggle = document.getElementById('musicToggle');
    const playing = toggle?.querySelector('.playing');
    const paused = toggle?.querySelector('.paused');
    
    musicAudio.pause();
    isMusicPlaying = false;
    localStorage.setItem('valentine_music_playing', 'false');
    if (playing) playing.classList.add('hidden');
    if (paused) paused.classList.remove('hidden');
    if (toggle) toggle.classList.remove('playing-animation');
}

// Initialize music when page loads
document.addEventListener('DOMContentLoaded', () => {
    initMusic();
});

// Auto-play music on first user interaction (only if not played before)
let hasInteracted = false;
document.addEventListener('click', () => {
    if (!hasInteracted) {
        hasInteracted = true;
        const hasPlayedBefore = localStorage.getItem('valentine_music_playing');
        if (!hasPlayedBefore) {
            playMusic();
        }
    }
}, { once: true });

// ========================================
// PASSWORD GATE
// ========================================
function checkPassword() {
    const input = document.getElementById('passwordInput');
    const error = document.getElementById('passwordError');
    const gate = document.getElementById('passwordGate');
    const mainApp = document.getElementById('mainApp');
    
    if (!CONFIG.password) {
        if (gate) gate.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');
        initializeApp();
        return;
    }
    
    const userInput = input.value.trim().toLowerCase();
    const correctPassword = CONFIG.password.toLowerCase();
    
    if (userInput === correctPassword) {
        gate.style.animation = 'fadeOutScale 0.5s ease-out forwards';
        setTimeout(() => {
            gate.classList.add('hidden');
            mainApp.classList.remove('hidden');
            initializeApp();
        }, 500);
    } else {
        error.textContent = "That's not quite right, try again! 💕";
        input.value = '';
        input.style.animation = 'shake 0.5s ease';
        setTimeout(() => input.style.animation = '', 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkPassword();
        });
    }
    
    if (!CONFIG.password || CONFIG.password === "") {
        const gate = document.getElementById('passwordGate');
        const mainApp = document.getElementById('mainApp');
        if (gate) gate.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');
        initializeApp();
    }
});

// ========================================
// APP INITIALIZATION
// ========================================
function initializeApp() {
    for (let day = 1; day <= 8; day++) {
        updateDayStatus(day);
    }
    
    setInterval(() => {
        if (Math.random() > 0.7) createFloatingHearts(1);
    }, 3000);
}

// ========================================
// DATE UNLOCK LOGIC
// ========================================
function isDateUnlocked(unlockDateString) {
    if (CONFIG.testMode) return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const unlockDate = new Date(unlockDateString);
    unlockDate.setHours(0, 0, 0, 0);
    
    return today >= unlockDate;
}

function updateDayStatus(dayNumber) {
    const lockElement = document.getElementById(`lock-${dayNumber}`);
    if (!lockElement) return;
    
    const unlockDate = CONFIG.unlockDates[dayNumber];
    const isUnlocked = isDateUnlocked(unlockDate);
    
    if (isUnlocked) {
        lockElement.innerHTML = `
            <span class="lock-icon">✅</span>
            <span class="lock-text">Unlocked!</span>
        `;
        lockElement.classList.add('unlocked');
    } else {
        const formattedDate = formatDate(unlockDate);
        lockElement.innerHTML = `
            <span class="lock-icon">🔒</span>
            <span class="lock-text">Unlocks ${formattedDate}</span>
        `;
        lockElement.classList.remove('unlocked');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ========================================
// NAVIGATION
// ========================================
function goToDay(dayNumber) {
    const unlockDate = CONFIG.unlockDates[dayNumber];
    const isUnlocked = isDateUnlocked(unlockDate);
    
    if (!isUnlocked && !CONFIG.testMode) {
        const formattedDate = formatDate(unlockDate);
        alert(`This day is still locked! 💖\nCome back on ${formattedDate} to unlock it!`);
        return;
    }
    
    window.location.href = `day${dayNumber}.html`;
}

function checkDayUnlock(dayNumber, unlockDateString) {
    const lockedScreen = document.getElementById('lockedScreen');
    const unlockedContent = document.getElementById('unlockedContent');
    const unlockDateElement = document.getElementById('unlockDate');
    
    if (!lockedScreen || !unlockedContent) return;
    
    const isUnlocked = isDateUnlocked(unlockDateString);
    
    if (isUnlocked || CONFIG.testMode) {
        lockedScreen.classList.add('hidden');
        unlockedContent.classList.remove('hidden');
    } else {
        lockedScreen.classList.remove('hidden');
        unlockedContent.classList.add('hidden');
        
        if (unlockDateElement) {
            unlockDateElement.textContent = formatDate(unlockDateString);
        }
    }
}

// ========================================
// ANIMATIONS
// ========================================
function createFloatingHearts(count) {
    const container = document.body;
    
    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = ['💕', '💗', '💖', '💝'][Math.floor(Math.random() * 4)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 1 + 's';
        heart.style.animationDuration = (3 + Math.random() * 2) + 's';
        
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 6000);
    }
}

function createConfetti() {
    const container = document.body;
    const colors = ['#FFB3C6', '#FF8FAB', '#FB6F92', '#FFE5EC', '#FFC0CB'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
        
        container.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}

// ========================================
// EXPORTS
// ========================================
window.checkPassword = checkPassword;
window.goToDay = goToDay;
window.checkDayUnlock = checkDayUnlock;
window.createFloatingHearts = createFloatingHearts;
window.createConfetti = createConfetti;
window.toggleMusic = toggleMusic;
window.playMusic = playMusic;
window.pauseMusic = pauseMusic;

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOutScale {
        to { opacity: 0; transform: scale(0.8); }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

console.log('%c💖 Valentine Week App Ready! 💖', 'color: #FB6F92; font-size: 20px; font-weight: bold;');
console.log('%c🎵 Place xyz.mp3 in the same folder for music!', 'color: #FFB3C6; font-size: 14px;');

