document.addEventListener('DOMContentLoaded', () => {
    const soundToggle = document.getElementById('soundToggle');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;

    if (soundToggle && bgMusic) {
        soundToggle.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                soundToggle.innerHTML = '🔇 Sound';
                soundToggle.classList.remove('playing');
            } else {
                bgMusic.play().catch(err => console.error("Audio playback failed:", err));
                soundToggle.innerHTML = '🎵 Sound';
                soundToggle.classList.add('playing');
            }
            isPlaying = !isPlaying;
        });
    }
});
