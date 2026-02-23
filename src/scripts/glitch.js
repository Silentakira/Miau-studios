import { scrambleText } from './scramble.js';

window.addEventListener('load', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const h1 = document.querySelector('h1.glitch');
    if (!h1) return;

    // Step 1: Set data-text for the glitch effect
    h1.setAttribute('data-text', h1.textContent);

    // Step 2: Glitch runs via CSS animation (1.5s set in CSS)
    // Step 3: After glitch finishes, run scramble
    setTimeout(() => {
        scrambleText(h1);
    }, 1500);
});
