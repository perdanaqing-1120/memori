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
        if(nextId === 'menu-screen') {
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
    }, 2000);
}

// --- Carousel Logic ---
const photos = [
    { url: 'https://images.unsplash.com/photo-1518199266791-5375a83164ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', caption: 'Our first date' },
    { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', caption: 'That amazing vacation' },
    { url: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', caption: 'Silly moments together' },
    { url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', caption: 'I love your smile' }
];

let currentSlideIndex = 0;
const track = document.getElementById('carouselTrack');
const indicatorsContainer = document.getElementById('carouselIndicators');

function initCarousel() {
    photos.forEach((photo, index) => {
        // Create slide
        const slide = document.createElement('div');
        slide.classList.add('carousel-slide');
        slide.innerHTML = `
            <img src="${photo.url}" alt="${photo.caption}">
            <div class="carousel-caption">${photo.caption}</div>
        `;
        track.appendChild(slide);

        // Create indicator
        const dot = document.createElement('div');
        dot.classList.add('indicator');
        if(index === 0) dot.classList.add('active');
        dot.onclick = () => goToSlide(index);
        indicatorsContainer.appendChild(dot);
    });
}

function updateCarousel() {
    track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    
    // Update indicators
    const dots = document.querySelectorAll('.indicator');
    dots.forEach((dot, index) => {
        if(index === currentSlideIndex) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

function moveCarousel(direction) {
    currentSlideIndex += direction;
    if(currentSlideIndex < 0) currentSlideIndex = photos.length - 1;
    if(currentSlideIndex >= photos.length) currentSlideIndex = 0;
    updateCarousel();
}

function goToSlide(index) {
    currentSlideIndex = index;
    updateCarousel();
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
const correctCode = "1510";
let currentCode = "";
let isCheckingCode = false;
let wrongAttemptCount = 0;
const maxDigits = 4;
const finishBtn = document.getElementById('finishGameBtn');
const errorMsg = document.getElementById('errorMessage');

const wrongMessages = [
    "Kode rahasianya salah ayang... 🥺 Coba tebak lagi ya!",
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

function openMusicModal(title, audioSrc, coverSrc) {
    const modal = document.getElementById('musicModal');
    const modalTitle = document.getElementById('musicModalTitle');
    const audioPlayer = document.getElementById('favAudioPlayer');
    const vinyl = document.getElementById('vinylRecord');
    
    // Update content
    if(modalTitle) modalTitle.textContent = title;
    if(audioPlayer) audioPlayer.src = audioSrc;
    if(vinyl) vinyl.src = coverSrc;
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Auto play when opened
    if(audioPlayer) {
        audioPlayer.play().catch(e => console.log("Auto-play prevented", e));
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
    initCarousel();

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
