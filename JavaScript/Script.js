// Playlist of audio tracks
const playlist = [
    { 
        title: "Carefree", 
        artist: "Kevin MacLeod",
        src: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Carefree.mp3",
        duration: "2:15"
    },
    { 
        title: "Merry Go", 
        artist: "Kevin MacLeod",
        src: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Merry%20Go.mp3",
        duration: "2:20"
    },
    { 
        title: "Pixel Peeker Polka", 
        artist: "Kevin MacLeod",
        src: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Pixel%20Peeker%20Polka.mp3",
        duration: "2:45"
    },
    { 
        title: "Sneaky Snitch", 
        artist: "Kevin MacLeod",
        src: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Sneaky%20Snitch.mp3",
        duration: "2:35"
    },
    { 
        title: "Monkeys Spinning Monkeys", 
        artist: "Kevin MacLeod",
        src: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Monkeys%20Spinning%20Monkeys.mp3",
        duration: "2:55"
    }
];

// DOM Elements
const audio = document.getElementById('myAudio');
const playPauseBtn = document.getElementById('play-pause-btn');
const stopBtn = document.getElementById('stop-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const stepBackBtn = document.getElementById('step-back-btn');
const stepForwardBtn = document.getElementById('step-forward-btn');
const muteBtn = document.getElementById('mute-btn');
const volumeSlider = document.getElementById('volume');
const volumeValue = document.getElementById('volume-value');
const progressBar = document.getElementById('progress');
const currentTimeSpan = document.getElementById('current-time');
const totalTimeSpan = document.getElementById('total-time');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const playlistContainer = document.getElementById('playlist-container');

// State variables
let currentTrackIndex = 0;
let isMuted = false;
let previousVolume = 1;

// Format time in MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Create playlist tracks in the DOM
function createPlaylist() {
    playlistContainer.innerHTML = ''; // Clear existing playlist
    playlist.forEach((track, index) => {
        const trackElement = document.createElement('div');
        trackElement.classList.add('playlist-track');
        trackElement.dataset.index = index;
        
        trackElement.innerHTML = `
            <div class="playlist-track-info">
                <strong>${track.title}</strong>
                <div class="playlist-track-artist">${track.artist}</div>
            </div>
            <div class="playlist-track-duration">${track.duration}</div>
        `;
        
        trackElement.addEventListener('click', () => {
            loadTrack(index);
            audio.play();
            updateActiveTrack(index);
        });
        
        playlistContainer.appendChild(trackElement);
    });
}

// Update active track in playlist
function updateActiveTrack(index) {
    const playlistTracks = document.querySelectorAll('.playlist-track');
    playlistTracks.forEach(track => track.classList.remove('active'));
    playlistTracks[index].classList.add('active');
    
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

// Load track
function loadTrack(index) {
    if (index < 0) index = playlist.length - 1;
    if (index >= playlist.length) index = 0;

    currentTrackIndex = index;
    audio.src = playlist[index].src;
    trackTitle.textContent = playlist[index].title;
    trackArtist.textContent = playlist[index].artist;
    updateActiveTrack(index);

    // Set total time when metadata is loaded
    audio.addEventListener('loadedmetadata', () => {
        totalTimeSpan.textContent = formatTime(audio.duration);
    });
}

// Play/Pause functionality
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

// Stop functionality
stopBtn.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
});

// Step back 10 seconds
stepBackBtn.addEventListener('click', () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
});

// Step forward 10 seconds
stepForwardBtn.addEventListener('click', () => {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
});

// Previous track
prevBtn.addEventListener('click', () => {
    loadTrack(currentTrackIndex - 1);
    audio.play();
});

// Next track
nextBtn.addEventListener('click', () => {
    loadTrack(currentTrackIndex + 1);
    audio.play();
});

// Mute toggle
muteBtn.addEventListener('click', () => {
    if (audio.muted) {
        audio.muted = false;
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        volumeSlider.value = previousVolume;
        audio.volume = previousVolume;
        volumeValue.textContent = `${Math.round(previousVolume * 100)}%`;
    } else {
        previousVolume = audio.volume;
        audio.muted = true;
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        volumeSlider.value = 0;
        volumeValue.textContent = '0%';
    }
});

// Volume slider
volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
    volumeValue.textContent = `${Math.round(volumeSlider.value * 100)}%`;
    muteBtn.innerHTML = volumeSlider.value > 0 
        ? '<i class="fas fa-volume-up"></i>' 
        : '<i class="fas fa-volume-mute"></i>';
});

// Progress bar and time update
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    
    // Update current time
    currentTimeSpan.textContent = formatTime(audio.currentTime);
});

// Seek functionality
progressBar.addEventListener('input', () => {
    const time = (progressBar.value / 100) * audio.duration;
    audio.currentTime = time;
});

// Auto play next track
audio.addEventListener('ended', () => {
    loadTrack(currentTrackIndex + 1);
    audio.play();
});

// Initialize playlist and first track
createPlaylist();
loadTrack(0);