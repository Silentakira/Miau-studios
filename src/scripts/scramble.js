const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

export function scrambleText(el) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const originalText = el.innerText;
    const duration = 800;
    const intervalTime = 30;
    const maxIterations = duration / intervalTime;
    let iterations = 0;

    const interval = setInterval(() => {
        el.innerText = originalText.split('').map((char, index) => {
            if (char === ' ' || char === '\n') return char;
            if (index < (iterations / maxIterations) * originalText.length) return char;
            return chars[Math.floor(Math.random() * chars.length)];
        }).join('');

        iterations++;

        if (iterations >= maxIterations) {
            clearInterval(interval);
            el.innerText = originalText;
        }
    }, intervalTime);
}

// Auto-run for elements with .scramble-text:not(.glitch)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.scramble-text:not(.glitch)').forEach(el => scrambleText(el));
});
