/* ==========================================================================
   MOBILE-FIRST ROSE BLUSH INTERACTION ENGINE
   Lightweight, Battery-Efficient, Zero Lag on Mobile Phone Browsers
   ========================================================================== */

// --- Global State ---
let isAudioPlaying = false;
let isAmbientSynthPlaying = false;
let ambientSynthInterval = null;
let audioCtx = null;
let currentScreen = 'welcome';

// --- Unified Playlist Engine (Auto-Next & Shuffle) ---
const playlist = [
    {
        id: 'nadin',
        title: 'Semua Aku Dirayakan',
        artist: 'Nadin Amizah',
        src: 'semua-aku-dirayakan.mp3',
        cover: 'foto-utama.webp',
        badge: 'Lagu Utama',
        lyrics: '🎵 <b>Semua Aku Dirayakan — Nadin Amizah</b><br><br><i>"Hatiku seberat dunia, namun kau rengkuh seadanya..."</i><br><br>Katakan padaku semua yang kau tahu<br>Tentang duniaku yang mungkin kau ragu<br>Biar kutahu bahwa kau sungguh-sungguh<br>Merayakan aku seutuhnya...<br><br>Terima kasih telah merayakanku,<br>Dengan segala lebih dan kurangku. ❤️'
    },
    {
        id: 'lany',
        title: 'you! — LANY',
        artist: 'LANY',
        src: 'you-lany.mp3',
        cover: 'foto-utama.webp',
        badge: 'Favorit Spesial',
        lyrics: '🎵 <b>you! — LANY</b><br><br><i>"Like water in the desert, impossible to find<br>You found me when I was broken, put me back together, gave me life...<br><br>One in a million, my miracle<br>Out of the blue, you saved my soul<br><br>It\'s you, it\'s always been you<br>If I\'m ever gonna fall in love, I know it\'s gon\' be you<br>It\'s you, it\'s always been you<br>Met a lot of people, but nobody feels like you...<br><br>So, hot summer, cold winter<br>Through every storm, you\'re my shelter<br>It\'s you, it\'s always been you! ❤️"</i>'
    }
];

let currentTrackIndex = 0;
let isShuffle = false;
let currentTrackTitle = playlist[0].title;

// --- Web Audio API Polyphonic Synthesizer ---
function getAudioContext() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

// 1. Crystal Keypad Chimes (Pentatonic Scale)
const keypadNotes = [
    523.25, // 0: C5
    587.33, // 1: D5
    659.25, // 2: E5
    783.99, // 3: G5
    880.00, // 4: A5
    1046.50,// 5: C6
    1174.66,// 6: D6
    1318.51,// 7: E6
    1567.98,// 8: G6
    1760.00 // 9: A6
];

function playKeyTone(digit) {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const freq = keypadNotes[digit % keypadNotes.length] || 523.25;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.16);
    } catch (e) {}
}

// 2. Wax Seal Crack Sound
function playSealCrackSound() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);

        // Chime sweep
        [659.25, 880, 1174.66].forEach((f, i) => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.setValueAtTime(f, now + 0.06 + i * 0.04);
            g.gain.setValueAtTime(0.05, now + 0.06 + i * 0.04);
            g.gain.exponentialRampToValueAtTime(0.0001, now + 0.28 + i * 0.04);
            o.connect(g);
            g.connect(ctx.destination);
            o.start(now + 0.06 + i * 0.04);
            o.stop(now + 0.28 + i * 0.04);
        });
    } catch (e) {}
}

// 3. Sparkle Harp Sound for photo tap
function playSparkleSound() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        const chord = [783.99, 987.77, 1318.51, 1567.98];
        chord.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.035);
            gain.gain.setValueAtTime(0.04, now + idx * 0.035);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.035 + 0.22);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.035);
            osc.stop(now + idx * 0.035 + 0.22);
        });
    } catch (e) {}
}

// 4. Passcode Wrong Sound
function playWrongSound() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.24);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
    } catch (e) {}
}

// 5. Passcode Unlock Euphoric Fanfare
function playSuccessSound() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        const arpeggio = [
            { f: 523.25, t: 0.00, d: 0.22 }, // C5
            { f: 659.25, t: 0.08, d: 0.22 }, // E5
            { f: 783.99, t: 0.16, d: 0.22 }, // G5
            { f: 1046.50, t: 0.26, d: 0.35 }, // C6
            { f: 1318.51, t: 0.38, d: 0.50 }  // E6
        ];

        arpeggio.forEach(n => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(n.f, now + n.t);
            gain.gain.setValueAtTime(0.12, now + n.t);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + n.t);
            osc.stop(now + n.t + n.d);
        });
    } catch (e) {}
}

// 6. Romantic Music Box Synthesizer (Fallback when lagu.mp3 is not present)
function startAmbientSynth() {
    if (isAmbientSynthPlaying) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    isAmbientSynthPlaying = true;
    updateHudState(true, 'Melodi Kotak Musik');

    const melodyChords = [
        [523.25, 659.25, 783.99, 987.77],   // Cmaj7
        [440.00, 523.25, 659.25, 783.99],   // Am7
        [349.23, 440.00, 523.25, 659.25],   // Fmaj7
        [392.00, 493.88, 587.33, 783.99]    // G7
    ];

    let chordIdx = 0;
    let noteIdx = 0;

    ambientSynthInterval = setInterval(() => {
        if (!isAmbientSynthPlaying) return;
        try {
            const now = ctx.currentTime;
            const currentChord = melodyChords[chordIdx];
            const freq = currentChord[noteIdx];

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.035, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.65);

            noteIdx = (noteIdx + 1) % currentChord.length;
            if (noteIdx === 0) {
                chordIdx = (chordIdx + 1) % melodyChords.length;
            }
        } catch (e) {}
    }, 480);
}

function stopAmbientSynth() {
    isAmbientSynthPlaying = false;
    if (ambientSynthInterval) {
        clearInterval(ambientSynthInterval);
        ambientSynthInterval = null;
    }
    updateHudState(false);
}

function updateHudState(playing, customTitle = null) {
    isAudioPlaying = playing;
    if (customTitle) {
        currentTrackTitle = customTitle;
    }

    const eq = document.getElementById('hudEqualizer');
    const text = document.getElementById('hudMusicText');
    const playIcon = document.getElementById('hudPlayIcon');
    const turntableArm = document.getElementById('turntableTonearm');
    const vinyl = document.getElementById('vinylRecord');
    const modalVinyl = document.getElementById('modalVinylRecord');

    if (playing) {
        if (eq) eq.classList.add('playing');
        if (playIcon) playIcon.className = 'fas fa-pause';
        if (text) text.textContent = currentTrackTitle;
        if (turntableArm) turntableArm.classList.add('playing');
        if (vinyl) vinyl.classList.add('playing');
        if (modalVinyl) modalVinyl.classList.add('playing');
    } else {
        if (eq) eq.classList.remove('playing');
        if (playIcon) playIcon.className = 'fas fa-play';
        if (text) text.textContent = `${currentTrackTitle} (Jeda)`;
        if (turntableArm) turntableArm.classList.remove('playing');
        if (vinyl) vinyl.classList.remove('playing');
        if (modalVinyl) modalVinyl.classList.remove('playing');
    }

    updatePlaylistUI();
}

function updatePlaylistUI() {
    playlist.forEach((_, idx) => {
        const card = document.getElementById(`trackCard${idx}`);
        const statusIcon = document.getElementById(`trackStatus${idx}`);
        if (card) {
            if (idx === currentTrackIndex) {
                card.classList.add('active-track');
                if (statusIcon) {
                    statusIcon.innerHTML = isAudioPlaying 
                        ? '<i class="fas fa-volume-high"></i>' 
                        : '<i class="fas fa-pause"></i>';
                }
            } else {
                card.classList.remove('active-track');
                if (statusIcon) {
                    statusIcon.innerHTML = '<i class="fas fa-music"></i>';
                }
            }
        }
    });

    const playlistPlayIcon = document.getElementById('playlistPlayIcon');
    const modalPlayIcon = document.getElementById('modalPlayIcon');
    if (playlistPlayIcon) {
        playlistPlayIcon.className = isAudioPlaying ? 'fas fa-pause' : 'fas fa-play';
    }
    if (modalPlayIcon) {
        modalPlayIcon.className = isAudioPlaying ? 'fas fa-pause' : 'fas fa-play';
    }
}

function playTrack(index, openModal = false) {
    if (index < 0 || index >= playlist.length) index = 0;
    currentTrackIndex = index;
    const track = playlist[index];
    currentTrackTitle = track.title;

    const bgMusic = document.getElementById('bgMusic');
    if (isAmbientSynthPlaying) stopAmbientSynth();

    if (bgMusic) {
        const currentSrc = bgMusic.src ? bgMusic.src.split('/').pop() : '';
        if (currentSrc !== track.src) {
            bgMusic.src = track.src;
        }

        bgMusic.play().then(() => {
            updateHudState(true, track.title);
        }).catch((err) => {
            console.log("Audio play error:", err);
            startAmbientSynth();
        });
    }

    syncModalInfo(track);

    if (openModal) {
        const modal = document.getElementById('musicModal');
        toggleMusicView('vinyl');
        if (modal) modal.classList.remove('hidden');
    }
}

function playNextTrack(isAuto = false) {
    let nextIndex;
    if (isShuffle && playlist.length > 1) {
        do {
            nextIndex = Math.floor(Math.random() * playlist.length);
        } while (nextIndex === currentTrackIndex);
    } else {
        nextIndex = (currentTrackIndex + 1) % playlist.length;
    }

    playTrack(nextIndex, false);
    const track = playlist[nextIndex];
    if (isAuto) {
        showNotification("⏭ Otomatis Lanjut", `${track.title} — ${track.artist}`, "fa-forward");
    } else {
        showNotification("Lagu Berikutnya", `${track.title} — ${track.artist}`, "fa-forward-step");
    }
}

function playPrevTrack() {
    let prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    playTrack(prevIndex, false);
    const track = playlist[prevIndex];
    showNotification("Lagu Sebelumnya", `${track.title} — ${track.artist}`, "fa-backward-step");
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    const btnShuffle = document.getElementById('btnShuffle');
    const modalShuffleBtn = document.getElementById('modalShuffleBtn');
    const label = document.getElementById('shuffleLabel');

    if (isShuffle) {
        if (btnShuffle) btnShuffle.classList.add('active');
        if (modalShuffleBtn) modalShuffleBtn.classList.add('active');
        if (label) label.textContent = 'Acak: ON';
        showNotification("🔀 Mode Acak (Shuffle)", "Lagu berikutnya akan diputar secara acak!", "fa-shuffle");
    } else {
        if (btnShuffle) btnShuffle.classList.remove('active');
        if (modalShuffleBtn) modalShuffleBtn.classList.remove('active');
        if (label) label.textContent = 'Acak: OFF';
        showNotification("🔁 Mode Berurutan", "Lagu akan diputar berurutan!", "fa-repeat");
    }
}

function toggleAmbientMusic() {
    const bgMusic = document.getElementById('bgMusic');
    getAudioContext();

    if (!bgMusic) return;

    if (!bgMusic.paused) {
        bgMusic.pause();
        updateHudState(false);
        showNotification("Musik Dijeda", `Menjeda "${currentTrackTitle}"`, "fa-pause");
    } else if (isAmbientSynthPlaying) {
        stopAmbientSynth();
        updateHudState(false);
        showNotification("Audio Dijeda", "Melodi synthesizer dijeda", "fa-pause");
    } else {
        bgMusic.play().then(() => {
            updateHudState(true, currentTrackTitle);
            showNotification("Melanjutkan", currentTrackTitle, "fa-play");
        }).catch((e) => {
            console.log("Audio play error:", e);
            startAmbientSynth();
        });
    }
}

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function seekAudio(event) {
    const bgMusic = document.getElementById('bgMusic');
    const track = document.getElementById('modalProgressTrack');
    if (!bgMusic || !track || !bgMusic.duration) return;

    const rect = track.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    bgMusic.currentTime = Math.max(0, Math.min(1, pos)) * bgMusic.duration;
}

function syncModalInfo(track) {
    const modalTitle = document.getElementById('musicModalTitle');
    const modalArtist = document.getElementById('musicModalArtist');
    const vinyl = document.getElementById('modalVinylRecord');
    const lyricsContent = document.getElementById('musicLyricsContent');

    if (modalTitle) modalTitle.textContent = track.title;
    if (modalArtist) modalArtist.textContent = track.artist;
    if (vinyl) vinyl.src = track.cover;
    if (lyricsContent) {
        lyricsContent.innerHTML = track.lyrics || "<i>Lirik belum tersedia... 🎶</i>";
    }
}

// ==========================================================================
// LIGHTWEIGHT STARLIGHT CANVAS (MAX 25 STARS - ZERO MOBILE LAG)
// ==========================================================================
function initStarlightCanvas() {
    const canvas = document.getElementById('starlightCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }, { passive: true });

    // Only 22 twinkling stars to keep mobile CPU at 0%
    const stars = [];
    const starCount = 22;

    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.7 + 0.2,
            speed: Math.random() * 0.015 + 0.005,
            direction: Math.random() > 0.5 ? 1 : -1
        });
    }

    function animateStars() {
        ctx.clearRect(0, 0, width, height);

        stars.forEach(s => {
            s.alpha += s.speed * s.direction;
            if (s.alpha > 0.85) { s.alpha = 0.85; s.direction = -1; }
            if (s.alpha < 0.15) { s.alpha = 0.15; s.direction = 1; }

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 77, 109, ${s.alpha * 0.5})`;
            ctx.fill();
        });

        requestAnimationFrame(animateStars);
    }
    animateStars();
}

// Background Floating Hearts (Only 8 particles for lightweight mobile battery)
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const particleCount = 8;

    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('i');
        p.classList.add('fas', 'fa-heart', 'heart-particle');

        const size = Math.random() * 12 + 10;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 12;
        const delay = Math.random() * 8;

        p.style.fontSize = `${size}px`;
        p.style.left = `${left}vw`;
        p.style.animationDuration = `${duration}s`;
        p.style.animationDelay = `${delay}s`;

        container.appendChild(p);
    }
}

// ==========================================================================
// SCREEN TRANSITIONS (SMOOTH & INSTANT ON MOBILE)
// ==========================================================================
function nextScreen(currentId, nextId) {
    const current = document.getElementById(currentId);
    const next = document.getElementById(nextId);
    if (!current || !next) return;

    // Pause greeting video if leaving love letter screen
    if (currentId === 'love-letter') {
        const video = document.getElementById('greetingVideo');
        if (video && !video.paused) {
            video.pause();
        }
    }

    current.style.opacity = '0';
    current.style.transform = 'scale(0.97)';

    setTimeout(() => {
        current.classList.remove('active');
        current.classList.add('hidden-screen');
        current.style.opacity = '';
        current.style.transform = '';

        next.classList.remove('hidden-screen');
        next.classList.add('active');
        next.style.opacity = '0';
        next.style.transform = 'scale(0.97)';

        window.scrollTo({ top: 0, behavior: 'smooth' });

        requestAnimationFrame(() => {
            next.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            next.style.opacity = '1';
            next.style.transform = 'scale(1)';
            currentScreen = nextId;

            if (nextId === 'gallery' || nextId === 'menu-screen') {
                triggerConfetti();
            }
        });
    }, 320);
}

// ==========================================================================
// SECTION 1: 3D WAX SEAL ENVELOPE OPENING
// ==========================================================================
let envelopeOpened = false;

function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    playSealCrackSound();

    // Start playlist from track 0 ("Semua Aku Dirayakan - Nadin Amizah")
    playTrack(0, false);
    showNotification("🎵 Sekarang Memutar", "Semua Aku Dirayakan — Nadin Amizah ❤️", "fa-music");

    const envelope = document.getElementById('mainEnvelope');
    if (envelope) {
        envelope.classList.add('open');
    }

    const hint = document.getElementById('envelopeHint');
    if (hint) {
        hint.innerHTML = 'Membuka amplop cinta... <i class="fas fa-heart pulse"></i>';
    }

    celebrateBurst();

    setTimeout(() => {
        nextScreen('welcome', 'gallery');
    }, 1700);
}

// ==========================================================================
// SECTION 2: TAP CELEBRATION (NO HEAVY MOTION TILT ON MOBILE BATTERY)
// ==========================================================================
function celebrateBurst(event) {
    playSparkleSound();

    let clientX = event ? event.clientX : null;
    let clientY = event ? event.clientY : null;

    if (!clientX || !clientY) {
        const showcase = document.getElementById('photoShowcase') || document.body;
        const rect = showcase.getBoundingClientRect();
        clientX = rect.left + rect.width / 2;
        clientY = rect.top + rect.height / 2;
    }

    const icons = ['💖', '✨', '👑', '🥰', '⭐', '🎉', '💕'];
    const count = 10; // Lightweight count for mobile

    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'tap-sparkle';
        sparkle.textContent = icons[Math.floor(Math.random() * icons.length)];

        const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.4 - 0.2);
        const distance = Math.random() * 70 + 35;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        sparkle.style.left = `${clientX}px`;
        sparkle.style.top = `${clientY}px`;
        sparkle.style.setProperty('--tx', `${tx}px`);
        sparkle.style.setProperty('--ty', `${ty}px`);

        document.body.appendChild(sparkle);
        sparkle.addEventListener('animationend', () => sparkle.remove(), { once: true });
    }
}

// ==========================================================================
// SECTION 3: PASSCODE VAULT (CODE: 1209)
// ==========================================================================
const correctCode = "1209";
let currentCode = "";
let isCheckingCode = false;
let wrongAttemptCount = 0;
const maxDigits = 4;

const wrongMessages = [
    "Kode rahasianya salah ayanggggg... 🥺 Coba tebak lagi ya!",
    "Tetot! Masih belum tepat nih.. Masa lupa tanggal spesial kita? 😜",
    "Aduh salah lagi 🥺 Petunjuk: Tanggal jadian/spesial kitaa ❤️",
    "Masih belum pas cintaaa.. Jangan menyerah, coba lagi ya! 💕"
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
    playKeyTone(num);

    if (currentCode.length < maxDigits) {
        currentCode += num.toString();
        updateDots();

        const errorMsg = document.getElementById('errorMessage');
        if (errorMsg) errorMsg.classList.add('hidden');

        if (currentCode.length === maxDigits) {
            checkCode();
        }
    }
}

function deleteKey() {
    if (isCheckingCode) return;
    playKeyTone(0);
    if (currentCode.length > 0) {
        currentCode = currentCode.slice(0, -1);
        updateDots();
        const errorMsg = document.getElementById('errorMessage');
        if (errorMsg) errorMsg.classList.add('hidden');
    }
}

function clearCode(hideError = true) {
    currentCode = "";
    updateDots();
    const errorMsg = document.getElementById('errorMessage');
    if (hideError && errorMsg) {
        errorMsg.classList.add('hidden');
    }
}

function showPasscodeHint() {
    showNotification("💡 Petunjuk Spesial", "Clue: Tanggal jadian / momen spesial terindah kita berdua! (1209) 💕", "fa-lightbulb");
}

function checkCode() {
    isCheckingCode = true;
    const scanner = document.getElementById('vaultScanner');
    if (scanner) scanner.classList.add('active');

    setTimeout(() => {
        if (scanner) scanner.classList.remove('active');

        if (currentCode === correctCode) {
            // UNLOCK SUCCESS
            playSuccessSound();

            const lockOrb = document.getElementById('vaultLockOrb');
            const lockIcon = document.getElementById('vaultLockIcon');
            if (lockOrb) lockOrb.classList.add('unlocked');
            if (lockIcon) lockIcon.className = 'fas fa-unlock';

            showNotification("Akses Diberikan! 🎉", "Yeay kode rahasianya benar! Selamat membuka kado spesial ❤️", "fa-heart");
            triggerConfetti();

            setTimeout(() => {
                const keypad = document.querySelector('.keypad');
                const actions = document.querySelector('.passcode-actions');
                const finishBtn = document.getElementById('finishGameBtn');
                if (keypad) keypad.style.display = 'none';
                if (actions) actions.style.display = 'none';
                if (finishBtn) finishBtn.classList.remove('hidden');
                isCheckingCode = false;
            }, 500);
        } else {
            // WRONG CODE
            playWrongSound();

            const passcodeDisplay = document.querySelector('.passcode-display');
            if (passcodeDisplay) passcodeDisplay.classList.add('shake');

            for (let i = 1; i <= maxDigits; i++) {
                const dot = document.getElementById(`dot-${i}`);
                if (dot) dot.classList.add('error');
            }

            const msg = wrongMessages[wrongAttemptCount % wrongMessages.length];
            wrongAttemptCount++;

            showNotification("Kode Salah! 🥺", msg, "fa-heart-crack");

            const errorMsg = document.getElementById('errorMessage');
            if (errorMsg) {
                errorMsg.textContent = msg;
                errorMsg.classList.remove('hidden');
            }

            setTimeout(() => {
                if (passcodeDisplay) passcodeDisplay.classList.remove('shake');
                for (let i = 1; i <= maxDigits; i++) {
                    const dot = document.getElementById(`dot-${i}`);
                    if (dot) dot.classList.remove('error');
                }
                clearCode(false);
                isCheckingCode = false;
            }, 600);
        }
    }, 350);
}

// ==========================================================================
// TOAST NOTIFICATIONS & CONFETTI (LIGHTWEIGHT FOR MOBILE)
// ==========================================================================
function showNotification(title, message, icon = 'fa-heart') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    if (container.children.length >= 2) {
        container.firstElementChild.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas ${icon}"></i></div>
        <div class="toast-body">
            <div class="toast-title">${title}</div>
            <div class="toast-msg">${message}</div>
        </div>
        <button class="toast-close" title="Tutup">&times;</button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.onclick = () => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 250);
    };

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('hide');
            setTimeout(() => {
                if (toast.parentElement) toast.remove();
            }, 250);
        }
    }, 3400);
}

function triggerConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    container.innerHTML = '';

    const colors = ['#ff3366', '#ff758f', '#ffd166', '#06d6a0', '#ffb703', '#ffffff'];
    const emojis = ['💖', '✨', '🎉', '🌸', '⭐'];
    const confettiCount = 30; // 30 items is smooth on all smartphones

    for (let i = 0; i < confettiCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('confetti-burst-particle');

        const fromLeft = i % 2 === 0;
        const startX = fromLeft ? (Math.random() * 25) : (75 + Math.random() * 25);
        const startY = 85 + Math.random() * 10;

        particle.style.left = `${startX}vw`;
        particle.style.top = `${startY}vh`;

        const midX = (fromLeft ? 1 : -1) * (Math.random() * 100 + 40);
        const midY = -(Math.random() * 280 + 200);
        const endX = midX + (fromLeft ? 1 : -1) * (Math.random() * 60);
        const endY = midY + Math.random() * 400 + 160;

        particle.style.setProperty('--mid-x', `${midX}px`);
        particle.style.setProperty('--mid-y', `${midY}px`);
        particle.style.setProperty('--end-x', `${endX}px`);
        particle.style.setProperty('--end-y', `${endY}px`);

        if (Math.random() > 0.6) {
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            particle.style.fontSize = `${Math.random() * 8 + 14}px`;
        } else {
            const sizeW = Math.random() * 6 + 6;
            const sizeH = Math.random() > 0.5 ? sizeW : Math.random() * 12 + 8;
            particle.style.width = `${sizeW}px`;
            particle.style.height = `${sizeH}px`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        }

        const duration = (Math.random() * 0.6 + 1.8).toFixed(2);
        const delay = (Math.random() * 0.25).toFixed(2);
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        document.body.appendChild(particle);
        particle.addEventListener('animationend', () => particle.remove(), { once: true });
    }
}

// ==========================================================================
// SECTION 6: MEMORY VAULT & LIGHTBOX (MOBILE)
// ==========================================================================
let allGalleryItems = [];
let currentPhotoIndex = 0;

function filterGallery(category, tabBtn) {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(t => t.classList.remove('active'));
    if (tabBtn) tabBtn.classList.add('active');

    const cards = document.querySelectorAll('.polaroid-card');
    cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function initGalleryItems() {
    allGalleryItems = Array.from(document.querySelectorAll('.polaroid-card, .fav-item'));
}

function openPhotoModal(element) {
    initGalleryItems();
    currentPhotoIndex = allGalleryItems.indexOf(element);
    if (currentPhotoIndex === -1) currentPhotoIndex = 0;

    displayPhotoInModal(element);

    const modal = document.getElementById('imageModal');
    if (modal) modal.classList.remove('hidden');
}

function displayPhotoInModal(element) {
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalCounter = document.getElementById('modalCounter');

    const img = element.querySelector('img');
    const captionEl = element.querySelector('.polaroid-caption') || element.querySelector('p');

    if (modalImg && img) modalImg.src = img.src;
    if (modalTitle && captionEl) modalTitle.textContent = captionEl.getAttribute('data-title') || captionEl.textContent;
    if (modalDesc && captionEl) modalDesc.textContent = captionEl.getAttribute('data-desc') || 'Sebuah kenangan indah yang abadi bersamamu.';
    if (modalCounter) modalCounter.textContent = `Foto ${currentPhotoIndex + 1} dari ${allGalleryItems.length}`;
}

function prevPhoto(e) {
    if (e) e.stopPropagation();
    if (allGalleryItems.length === 0) initGalleryItems();
    currentPhotoIndex = (currentPhotoIndex - 1 + allGalleryItems.length) % allGalleryItems.length;
    displayPhotoInModal(allGalleryItems[currentPhotoIndex]);
}

function nextPhoto(e) {
    if (e) e.stopPropagation();
    if (allGalleryItems.length === 0) initGalleryItems();
    currentPhotoIndex = (currentPhotoIndex + 1) % allGalleryItems.length;
    displayPhotoInModal(allGalleryItems[currentPhotoIndex]);
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) modal.classList.add('hidden');
}

// ==========================================================================
// SECTION 7: TURNTABLE & MUSIC MODAL (MOBILE)
// ==========================================================================
function openMusicModal(title, audioSrc, coverSrc, lyricsId = null) {
    const modal = document.getElementById('musicModal');
    const track = playlist[currentTrackIndex];
    if (track) syncModalInfo(track);
    toggleMusicView('vinyl');
    if (modal) modal.classList.remove('hidden');
}

function toggleMusicView(view) {
    const vinylView = document.getElementById('vinylView');
    const lyricsView = document.getElementById('lyricsView');
    const btnVinyl = document.getElementById('btnVinyl');
    const btnLyrics = document.getElementById('btnLyrics');

    if (view === 'vinyl') {
        if (vinylView) { vinylView.classList.remove('hidden-view'); vinylView.classList.add('active-view'); }
        if (lyricsView) { lyricsView.classList.remove('active-view'); lyricsView.classList.add('hidden-view'); }
        if (btnVinyl) btnVinyl.classList.add('active');
        if (btnLyrics) btnLyrics.classList.remove('active');
    } else {
        if (lyricsView) { lyricsView.classList.remove('hidden-view'); lyricsView.classList.add('active-view'); }
        if (vinylView) { vinylView.classList.remove('active-view'); vinylView.classList.add('hidden-view'); }
        if (btnLyrics) btnLyrics.classList.add('active');
        if (btnVinyl) btnVinyl.classList.remove('active');
    }
}

function closeMusicModal() {
    const modal = document.getElementById('musicModal');
    if (modal) modal.classList.add('hidden');
}

function handleModalBackdrop(event, modalId) {
    const modal = document.getElementById(modalId);
    if (event.target === modal) {
        if (modalId === 'imageModal') closeModal();
        if (modalId === 'musicModal') closeMusicModal();
    }
}

// Equalizer Visualizer Bars Animation
function initTurntableVisualizer() {
    const bars = document.querySelectorAll('.turntable-visualizer .vis-bar');
    if (bars.length === 0) return;

    setInterval(() => {
        if (isAudioPlaying || isAmbientSynthPlaying) {
            bars.forEach(bar => {
                const h = Math.random() * 22 + 4;
                bar.style.height = `${h}px`;
            });
        } else {
            bars.forEach(bar => {
                bar.style.height = '3px';
            });
        }
    }, 140);
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initStarlightCanvas();
    createParticles();
    initGalleryItems();
    initTurntableVisualizer();

    // Date in letter
    const letterDate = document.getElementById('letterDate');
    if (letterDate) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        letterDate.textContent = today.toLocaleDateString('id-ID', options);
    }

    // Master Playlist Audio Engine Listeners
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.addEventListener('play', () => {
            updateHudState(true);
        });
        bgMusic.addEventListener('pause', () => {
            updateHudState(false);
        });
        bgMusic.addEventListener('timeupdate', () => {
            const fill = document.getElementById('modalProgressFill');
            const curr = document.getElementById('modalCurrentTime');
            const dur = document.getElementById('modalDuration');

            if (bgMusic.duration) {
                const percent = (bgMusic.currentTime / bgMusic.duration) * 100;
                if (fill) fill.style.width = `${percent}%`;
                if (curr) curr.textContent = formatTime(bgMusic.currentTime);
                if (dur) dur.textContent = formatTime(bgMusic.duration);
            }
        });
        // Auto-play next track when song finishes!
        bgMusic.addEventListener('ended', () => {
            console.log("Track finished. Auto-playing next track...");
            playNextTrack(true);
        });
    }

    // Greeting Video Listeners
    const greetingVideo = document.getElementById('greetingVideo');
    if (greetingVideo) {
        greetingVideo.addEventListener('play', () => {
            // Automatically pause background music so audio doesn't overlap
            const bgMusic = document.getElementById('bgMusic');
            if (bgMusic && !bgMusic.paused) bgMusic.pause();
            if (isAmbientSynthPlaying) stopAmbientSynth();
            updateHudState(false);
            showNotification("Memutar Video", "Audio musik dijeda otomatis 🎬", "fa-video");
        });
    }
});
