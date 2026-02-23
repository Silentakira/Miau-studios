const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none)').matches;

document.addEventListener('DOMContentLoaded', () => {
    if (prefersReducedMotion || isTouchDevice) return;

    document.querySelectorAll('.magnet-wrap').forEach(wrap => {
        const btn = wrap.querySelector('.magnetic');
        if (!btn) return;

        wrap.addEventListener('mousemove', e => {
            const rect = wrap.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Limit the pull to max 6px as requested
            const pullX = (x - centerX) * 0.15;
            const pullY = (y - centerY) * 0.15;

            const limitedX = Math.max(Math.min(pullX, 6), -6);
            const limitedY = Math.max(Math.min(pullY, 6), -6);

            wrap.classList.add('magnet-active');
            btn.style.transform = `translate(${limitedX}px, ${limitedY}px)`;
        });

        wrap.addEventListener('mouseleave', () => {
            wrap.classList.remove('magnet-active');
            btn.style.transform = `translate(0px, 0px)`;
        });
    });
});
