const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    if (prefersReducedMotion) return;

    const blobs = document.querySelectorAll('.hero-blob');
    if (blobs.length < 2) return;

    let mX = window.innerWidth / 2;
    let mY = window.innerHeight / 2;
    let b1X = mX, b1Y = mY;
    let b2X = mX, b2Y = mY;

    window.addEventListener('mousemove', (e) => {
        mX = e.clientX;
        mY = e.clientY;
    });

    function animateBlobs() {
        b1X += (mX - b1X) * 0.05;
        b1Y += (mY - b1Y) * 0.05;

        b2X += (mX - b2X) * 0.08;
        b2Y += (mY - b2Y) * 0.08;

        // Applying subtle movement based on cursor position
        blobs[0].style.transform = `translate(${b1X / 10}px, ${b1Y / 10}px)`;
        blobs[1].style.transform = `translate(${b2X / 5}px, ${b2Y / 5}px)`;

        requestAnimationFrame(animateBlobs);
    }

    if (window.matchMedia("(pointer: fine)").matches) {
        animateBlobs();
    }
});
