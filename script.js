const carousel = document.getElementById('carousel');
const totalImages = 20; 
let currentIndex = 0;


for (let i = 1; i <= totalImages; i++) {
    const wrapper = document.createElement('div');
    wrapper.className = 'image-wrapper';
    const imgPath = `llb-${i.toString().padStart(2, '0')}.jpg`;
    wrapper.style.backgroundImage = `url(${imgPath})`;
    
    const img = document.createElement('img');
    img.src = imgPath;
    img.className = 'gallery-img';
    
    wrapper.appendChild(img);
    carousel.appendChild(wrapper);
}

const wrappers = document.querySelectorAll('.image-wrapper');

function updateGallery() {
    wrappers.forEach((wrapper, index) => {
        let offset = index - currentIndex;
        if (offset > totalImages / 2) offset -= totalImages;
        if (offset < -totalImages / 2) offset += totalImages;

        const absOffset = Math.abs(offset);
        const translateX = offset * 125; 
        const translateZ = -absOffset * 220; 
        const rotateY = offset * -35; 
        const scale = 1 - (absOffset * 0.15);
        const opacity = absOffset > 2 ? 0 : 1 - (absOffset * 0.35);

        wrapper.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
        wrapper.style.opacity = opacity;
        wrapper.style.zIndex = 100 - absOffset;
        wrapper.style.filter = absOffset === 0 ? "none" : "brightness(0.35)";
    });
}

function rotateGallery(dir) {
    currentIndex = (currentIndex + dir + totalImages) % totalImages;
    updateGallery();
}

const audio = document.getElementById('audio');
const playIcon = document.getElementById('play-icon');
const progressFill = document.getElementById('progress-fill');
const lyricsScroll = document.getElementById('lyrics-scroll');
const words = document.querySelectorAll('.lyric-word');

function startApp() { 
    document.getElementById('launchScreen').classList.add('hidden'); 
}

function togglePlay() {
    if (audio.paused) { 
        audio.play(); 
        playIcon.className = "fa-solid fa-pause"; 
    } else { 
        audio.pause(); 
        playIcon.className = "fa-solid fa-play"; 
    }
}

audio.ontimeupdate = () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + "%";
    document.getElementById('current-time').innerText = formatTime(audio.currentTime);
    
    let lastActiveWord = null;
    words.forEach(word => {
        if (audio.currentTime >= parseFloat(word.dataset.time)) {
            word.classList.add('active');
            lastActiveWord = word;
        } else {
            word.classList.remove('active');
        }
    });

    if (lastActiveWord) {
        const line = lastActiveWord.parentElement;
        const top = line.offsetTop - lyricsScroll.offsetTop - 60;
        lyricsScroll.scrollTo({ top: top, behavior: 'smooth' });
    }
};

function setProgress(e) {
    const rect = document.getElementById('progressBar').getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
}

function formatTime(t) {
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function toggleLike() {
    const btn = document.getElementById('heartBtn');
    btn.classList.toggle('fa-regular'); 
    btn.classList.toggle('fa-solid'); 
    btn.classList.toggle('liked');
}

audio.onloadedmetadata = () => { 
    document.getElementById('duration').innerText = formatTime(audio.duration); 
};


updateGallery();