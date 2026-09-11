// --- Setup Background Particles ---
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        let particle = document.createElement('i');
        particle.classList.add('fas', 'fa-heart', 'heart-particle');
        
        // Randomize position, size, and animation duration
        let size = Math.random() * 20 + 10;
        let left = Math.random() * 100;
        let animDuration = Math.random() * 10 + 10;
        let delay = Math.random() * 10;

        particle.style.fontSize = `${size}px`;
        particle.style.left = `${left}vw`;
        particle.style.animationDuration = `${animDuration}s`;
        particle.style.animationDelay = `${delay}s`;

        particlesContainer.appendChild(particle);
    }
}

// --- Screen Transitions ---
function nextScreen(currentId, nextId) {
    const current = document.getElementById(currentId);
    const next = document.getElementById(nextId);

    current.classList.remove('active');
    current.classList.add('hidden-screen');

    setTimeout(() => {
        next.classList.remove('hidden-screen');
        next.classList.add('active');

        // Trigger specific logic based on screen
        if (nextId === 'gallery') {
            triggerFestiveCelebration();
        } else if (nextId === 'menu-screen') {
            triggerConfetti();
        }
    }, 800); // Wait for transition
}

// --- Welcome Screen Envelope ---
let envelopeOpened = false;
function openEnvelope() {
    if(envelopeOpened) return;
    envelopeOpened = true;

    // Mainkan lagu saat amplop diklik
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.play().catch(err => console.log("Audio autoplay prevented", err));
    }
    
    const envelope = document.querySelector('.envelope');
    envelope.classList.add('open');
    
    document.querySelector('.click-hint').innerHTML = 'Opening... <i class="fas fa-heart pulse"></i>';

    setTimeout(() => {
        nextScreen('welcome', 'gallery');
    }, 1800);
}

// --- Festive Celebration Effects (Audio Fanfare & GPU Confetti Burst) ---
function playCelebrationFanfare() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const now = ctx.currentTime;
        
        // Melodi perayaan ceria: C5, E5, G5, B5, C6 (chord arpeggio gembira)
        const notes = [
            { freq: 523.25, time: 0.00, dur: 0.18 },
            { freq: 659.25, time: 0.11, dur: 0.18 },
            { freq: 783.99, time: 0.22, dur: 0.20 },
            { freq: 987.77, time: 0.33, dur: 0.22 },
            { freq: 1046.50, time: 0.45, dur: 0.55 }
        ];

        notes.forEach(n => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(n.freq, now + n.time);
            
            gain.gain.setValueAtTime(0.12, now + n.time);
            gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + n.time);
            osc.stop(now + n.time + n.dur);
        });
    } catch (e) {}
}

function playSparkleSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.16);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
    } catch (e) {}
}

function triggerFestiveCelebration() {
    playCelebrationFanfare();

    // Confetti burst dari sisi kiri dan kanan bawah
    const confettiCount = 38; // Jumlah ideal: sangat meriah tapi 100% smooth di HP
    const colors = ['#ff4d6d', '#ff758f', '#ffd166', '#06d6a0', '#118ab2', '#a0c4ff', '#ffb703', '#ffffff'];
    const emojis = ['💖', '✨', '🎉', '🌸', '⭐', '🎈'];

    for (let i = 0; i < confettiCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('confetti-burst-particle');

        const fromLeft = i % 2 === 0;
        const startX = fromLeft ? (Math.random() * 25) : (75 + Math.random() * 25);
        const startY = 85 + Math.random() * 10;
        
        particle.style.left = `${startX}vw`;
        particle.style.top = `${startY}vh`;

        const midX = (fromLeft ? 1 : -1) * (Math.random() * 120 + 40);
        const midY = -(Math.random() * 320 + 260);
        const endX = midX + (fromLeft ? 1 : -1) * (Math.random() * 80);
        const endY = midY + Math.random() * 450 + 200;
        const rot1 = (Math.random() * 360) + 'deg';
        const rot2 = (Math.random() * 1080 - 540) + 'deg';

        particle.style.setProperty('--mid-x', `${midX}px`);
        particle.style.setProperty('--mid-y', `${midY}px`);
        particle.style.setProperty('--end-x', `${endX}px`);
        particle.style.setProperty('--end-y', `${endY}px`);
        particle.style.setProperty('--rot1', rot1);
        particle.style.setProperty('--rot2', rot2);

        if (Math.random() > 0.6) {
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            particle.style.fontSize = `${Math.random() * 12 + 14}px`;
        } else {
            const sizeW = Math.random() * 8 + 6;
            const sizeH = Math.random() > 0.5 ? sizeW : Math.random() * 14 + 10;
            particle.style.width = `${sizeW}px`;
            particle.style.height = `${sizeH}px`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        }

        const duration = (Math.random() * 0.8 + 2.2).toFixed(2);
        const delay = (Math.random() * 0.35).toFixed(2);
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        document.body.appendChild(particle);

        // Self-cleaning: otomatis hapus node dari DOM setelah animasi selesai
        particle.addEventListener('animationend', () => {
            particle.remove();
        }, { once: true });
    }
}

// --- Interactive Tap Burst saat Foto Disentuh ---
function celebrateBurst(event) {
    playSparkleSound();

    let clientX = event ? event.clientX : null;
    let clientY = event ? event.clientY : null;

    if (!clientX || !clientY) {
        const target = document.getElementById('photoShowcase') || document.body;
        const rect = target.getBoundingClientRect();
        clientX = rect.left + rect.width / 2;
        clientY = rect.top + rect.height / 2;
    }

    const emojis = ['💖', '✨', '🥰', '⭐', '🎉', '💕'];
    const particleCount = 10;

    for (let i = 0; i < particleCount; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'tap-sparkle';
        sparkle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        const angle = (Math.PI * 2 / particleCount) * i + (Math.random() * 0.5 - 0.25);
        const distance = Math.random() * 70 + 40;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        sparkle.style.left = `${clientX}px`;
        sparkle.style.top = `${clientY}px`;
        sparkle.style.setProperty('--tx', `${tx}px`);
        sparkle.style.setProperty('--ty', `${ty}px`);

        document.body.appendChild(sparkle);

        sparkle.addEventListener('animationend', () => {
            sparkle.remove();
        }, { once: true });
    }
}

// --- Notification System ---
function showNotification(title, message, icon = 'fa-heart-crack') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    // Remove older toasts if more than 2
    if (container.children.length >= 2) {
        container.firstElementChild.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="toast-body">
            <div class="toast-title">${title}</div>
            <div class="toast-msg">${message}</div>
        </div>
        <button class="toast-close" title="Tutup">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.onclick = () => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    };

    container.appendChild(toast);

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('hide');
            setTimeout(() => {
                if (toast.parentElement) toast.remove();
            }, 300);
        }
    }, 3500);
}

// Sound effects using Web Audio API
function playWrongSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.25);
        
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
}

function playSuccessSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.12, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.22);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.22);
        });
    } catch (e) {}
}

// --- Passcode Game Logic ---
const correctCode = "1209";
let currentCode = "";
let isCheckingCode = false;
let wrongAttemptCount = 0;
const maxDigits = 4;
const finishBtn = document.getElementById('finishGameBtn');
const errorMsg = document.getElementById('errorMessage');

const wrongMessages = [
    "Kode rahasianya salah ayanggggg... 🥺 Coba tebak lagi ya!",
    "Tetot! Masih salah nih.. Masa lupa tanggal spesial kita? 😜",
    "Aduh salah lagi 🥺 Clue: Tanggal jadian/spesial kita ❤️",
    "Masih belum tepat cintaa.. Jangan menyerah, coba lagi! 💕"
];

function updateDots() {
    for (let i = 1; i <= maxDigits; i++) {
        const dot = document.getElementById(`dot-${i}`);
        if (dot) {
            if (i <= currentCode.length) {
                dot.classList.add('filled');
            } else {
                dot.classList.remove('filled');
            }
        }
    }
}

function pressKey(num) {
    if (isCheckingCode) return;
    if (currentCode.length < maxDigits) {
        currentCode += num.toString();
        updateDots();
        if (errorMsg) errorMsg.classList.add('hidden');
        
        if (currentCode.length === maxDigits) {
            checkCode();
        }
    }
}

function deleteKey() {
    if (isCheckingCode) return;
    if (currentCode.length > 0) {
        currentCode = currentCode.slice(0, -1);
        updateDots();
        if (errorMsg) errorMsg.classList.add('hidden');
    }
}

function clearCode(hideError = true) {
    currentCode = "";
    updateDots();
    if (hideError && errorMsg) {
        errorMsg.classList.add('hidden');
    }
}

function checkCode() {
    isCheckingCode = true;

    if (currentCode === correctCode) {
        // Correct code!
        playSuccessSound();
        showNotification("Berhasil! 🎉", "Yeay kode rahasianya benar! Selamat membuka kado ❤️", "fa-heart");
        
        setTimeout(() => {
            document.querySelector('.keypad').style.display = 'none';
            document.querySelector('.subtitle').innerHTML = "Akses Diberikan! ❤️";
            if (errorMsg) errorMsg.classList.add('hidden');
            finishBtn.classList.remove('hidden');
            isCheckingCode = false;
        }, 500);
    } else {
        // Wrong code!
        playWrongSound();

        const passcodeDisplay = document.querySelector('.passcode-display');
        if (passcodeDisplay) {
            passcodeDisplay.classList.add('shake');
        }

        // Highlight dots red
        for (let i = 1; i <= maxDigits; i++) {
            const dot = document.getElementById(`dot-${i}`);
            if (dot) dot.classList.add('error');
        }

        // Select message
        const msg = wrongMessages[wrongAttemptCount % wrongMessages.length];
        wrongAttemptCount++;

        // Show Toast Notification
        showNotification("Kode Rahasia Salah! 🥺", msg, "fa-heart-crack");

        // Update inline error message
        if (errorMsg) {
            errorMsg.textContent = msg;
            errorMsg.classList.remove('hidden');
            errorMsg.style.animation = 'none';
            errorMsg.offsetHeight; /* trigger reflow */
            errorMsg.style.animation = null;
        }

        // Reset after shake
        setTimeout(() => {
            if (passcodeDisplay) {
                passcodeDisplay.classList.remove('shake');
            }
            for (let i = 1; i <= maxDigits; i++) {
                const dot = document.getElementById(`dot-${i}`);
                if (dot) dot.classList.remove('error');
            }
            clearCode(false); // keep error message visible
            isCheckingCode = false;
        }, 650);
    }
}

// --- Confetti Logic ---
function triggerConfetti() {
    const container = document.getElementById('confettiContainer');
    
    // Kosongkan confetti sebelumnya agar tidak menumpuk dan bikin berat
    container.innerHTML = '';
    
    const colors = ['#ff4d6d', '#ffb3c1', '#ffd166', '#06d6a0', '#118ab2'];
    
    for(let i=0; i<100; i++) {
        let confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Randomize
        let left = Math.random() * 100;
        let color = colors[Math.floor(Math.random() * colors.length)];
        let animDuration = Math.random() * 3 + 2;
        let delay = Math.random() * 2;
        
        confetti.style.left = `${left}vw`;
        confetti.style.backgroundColor = color;
        confetti.style.animationDuration = `${animDuration}s`;
        confetti.style.animationDelay = `${delay}s`;
        
        // Random shape (some circles, some squares)
        if(Math.random() > 0.5) confetti.style.borderRadius = '50%';
        
        container.appendChild(confetti);
    }
}

// --- Modal Logic ---
function openModal(imgElement) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');

    // Update modal content
    modalImg.src = imgElement.src;
    modalTitle.textContent = imgElement.getAttribute('data-title') || 'Memory';
    modalDesc.textContent = imgElement.getAttribute('data-desc') || 'Sebuah kenangan indah.';

    // Show modal
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.add('hidden');
}

const lyricsData = {
    'lagu1': '🎶 <i>Put your head on my shoulder...</i><br><br>Hold me in your arms, baby<br>Squeeze me oh-so-tight<br>Show me that you love me too',
    'lagu2': '🎶 <i>I found a love for me...</i><br><br>Darling just dive right in<br>And follow my lead<br>Well I found a girl beautiful and sweet',
    'lagu3': '🎶 <i>Cause all of me<br>Loves all of you</i><br><br>Love your curves and all your edges<br>All your perfect imperfections',
    'lagu4': '🎶 <i>Take my hand, take my whole life too</i><br><br>For I can\'t help falling in love with you',
    'lagu5': '🎶 <i>You\'re still the one I run to</i><br><br>The one that I belong to<br>You\'re still the one I want for life'
};

function openMusicModal(title, audioSrc, coverSrc, lyricsId = null) {
    const modal = document.getElementById('musicModal');
    const modalTitle = document.getElementById('musicModalTitle');
    const audioPlayer = document.getElementById('favAudioPlayer');
    const vinyl = document.getElementById('vinylRecord');
    const lyricsContent = document.getElementById('musicLyricsContent');
    
    // Update content
    if(modalTitle) modalTitle.textContent = title;
    if(audioPlayer) audioPlayer.src = audioSrc;
    if(vinyl) vinyl.src = coverSrc;

    if (lyricsContent) {
        if (lyricsId && lyricsData[lyricsId]) {
            lyricsContent.innerHTML = lyricsData[lyricsId];
        } else {
            lyricsContent.innerHTML = "<i>Lirik belum tersedia untuk lagu ini... 🎶</i>";
        }
    }
    
    // Reset view to vinyl
    toggleMusicView('vinyl');
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Auto play when opened
    if(audioPlayer) {
        audioPlayer.play().catch(e => console.log("Auto-play prevented", e));
    }
}

function toggleMusicView(view) {
    const vinylView = document.getElementById('vinylView');
    const lyricsView = document.getElementById('lyricsView');
    const btnVinyl = document.getElementById('btnVinyl');
    const btnLyrics = document.getElementById('btnLyrics');

    if (view === 'vinyl') {
        vinylView.classList.remove('hidden-view');
        vinylView.classList.add('active-view');
        lyricsView.classList.remove('active-view');
        lyricsView.classList.add('hidden-view');
        
        btnVinyl.classList.add('active');
        btnLyrics.classList.remove('active');
    } else {
        lyricsView.classList.remove('hidden-view');
        lyricsView.classList.add('active-view');
        vinylView.classList.remove('active-view');
        vinylView.classList.add('hidden-view');
        
        btnLyrics.classList.add('active');
        btnVinyl.classList.remove('active');
    }
}

function closeMusicModal() {
    const modal = document.getElementById('musicModal');
    modal.classList.add('hidden');
    // Pause audio when modal is closed
    const audioPlayer = document.getElementById('favAudioPlayer');
    if(audioPlayer) {
        audioPlayer.pause();
    }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const imgModal = document.getElementById('imageModal');
    const musicModal = document.getElementById('musicModal');
    if (event.target === imgModal) {
        closeModal();
    }
    if (event.target === musicModal) {
        closeMusicModal();
    }
}

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
    createParticles();

    // Vinyl animation sync with audio
    const audioPlayer = document.getElementById('favAudioPlayer');
    const vinyl = document.getElementById('vinylRecord');
    if(audioPlayer && vinyl) {
        audioPlayer.addEventListener('play', () => {
            vinyl.classList.add('playing');
        });
        audioPlayer.addEventListener('pause', () => {
            vinyl.classList.remove('playing');
        });
    }
});
