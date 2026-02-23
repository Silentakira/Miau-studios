const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none)').matches;

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.interactive-card');

    cards.forEach(card => {
        if (isTouchDevice) return;
        let spotlight = card.querySelector('.card-spotlight');
        if (!spotlight) {
            spotlight = document.createElement('div');
            spotlight.className = 'card-spotlight';
            card.prepend(spotlight);
        }

        if (prefersReducedMotion) return;

        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;

            // Tilt logic
            const tiltX = ((y - cy) / cy) * -12;
            const tiltY = ((x - cx) / cx) * 12;

            card.style.transition = 'transform 0.1s ease-out';
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.04)`;

            // Spotlight positioning
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            spotlight.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            spotlight.style.opacity = '0';
        });
    });
});
