const words = ['visceral', 'kinetic', 'unapologetic', 'hyper-reactive', 'quietly feral', 'pixel-perfect', 'always online'];
let cycleIdx = 0;

function cycleWord() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cycleWordEl = document.querySelector('.cycle-word');
    if (prefersReducedMotion || !cycleWordEl) return;

    // Fade out
    cycleWordEl.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    cycleWordEl.style.opacity = '0';
    cycleWordEl.style.transform = 'translateY(-8px)';

    setTimeout(() => {
        // Swap text
        cycleIdx = (cycleIdx + 1) % words.length;
        cycleWordEl.textContent = words[cycleIdx];

        // Reset for fade in from below
        cycleWordEl.style.transition = 'none';
        cycleWordEl.style.transform = 'translateY(8px)';
        cycleWordEl.style.opacity = '0';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                cycleWordEl.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                cycleWordEl.style.opacity = '1';
                cycleWordEl.style.transform = 'translateY(0)';
            });
        });
    }, 250);
}

document.addEventListener('DOMContentLoaded', () => {
    const cycleWordEl = document.querySelector('.cycle-word');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && cycleWordEl) {
        setInterval(cycleWord, 2000);
    }
});
