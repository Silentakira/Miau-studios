const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none)').matches;

let mX = -100, mY = -100;
let cX = -100, cY = -100;
let gX = -100, gY = -100;
let isHovering = false;
let firstMove = true;

const cursor = document.getElementById('custom-cursor');
const cursorLabel = document.getElementById('cursor-label');
const glow = document.getElementById('cursor-glow');

if (isTouchDevice) {
    if (cursor) cursor.style.display = 'none';
    if (glow) glow.style.display = 'none';
    document.body.style.cursor = 'auto';
}

function isOverColoredSection(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return false;
    const section = el.closest('section, footer, [data-section]');
    if (!section) return false;
    const bg = window.getComputedStyle(section).backgroundColor;
    const isWhite = bg === 'rgba(0, 0, 0, 0)' || bg === 'rgb(255, 255, 255)' || bg === 'transparent';
    return !isWhite;
}

window.addEventListener('mousemove', (e) => {
    if (isTouchDevice) return;
    mX = e.clientX;
    mY = e.clientY;

    if (firstMove) {
        if (cursor) cursor.style.opacity = '1';
        if (glow) glow.style.opacity = '1';
        firstMove = false;
    }
});

function animate() {
    if (prefersReducedMotion || isTouchDevice) return;

    // LERP factor 0.15
    let dx = mX - cX;
    let dy = mY - cY;
    cX += dx * 0.15;
    cY += dy * 0.15;

    // Glow LERP (0.06)
    if (glow) {
        gX += (mX - gX) * 0.06;
        gY += (mY - gY) * 0.06;
        glow.style.left = `${gX}px`;
        glow.style.top = `${gY}px`;

        if (isOverColoredSection(mX, mY)) {
            glow.style.opacity = '0';
        } else if (!firstMove) {
            glow.style.opacity = '1';
        }
    }

    if (cursor) {
        let speedX = Math.abs(dx);
        let speedY = Math.abs(dy);

        // Velocity stretch up to 1.6
        let stretchX = 1 + Math.min(speedX * 0.015, 0.6);
        let stretchY = 1 + Math.min(speedY * 0.015, 0.6);

        if (isHovering) {
            stretchX = 1;
            stretchY = 1;
        }

        // We use translateX/Y to position it (since translate(-50%, -50%) is in CSS)
        // Actually, CSS says transform: translate(-100px, -100px). 
        // We will overwrite it with JS.
        cursor.style.transform = `translate(${cX}px, ${cY}px) translate(-50%, -50%) scale(${stretchX}, ${stretchY})`;
    }

    requestAnimationFrame(animate);
}

const labelMap = {
    'WISHLIST': 'WISHLIST',
    'EXPLORE': 'EXPLORE',
    'READ': 'READ',
    'PLAY': 'PLAY',
    'GO': 'GO',
    'VIEW': 'VIEW'
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia("(pointer: fine)").matches && !isTouchDevice) {
        animate();

        // WHITE SWAP ON DARK SECTIONS
        const darkThemeElements = document.querySelectorAll('.game-section, footer, .dark-section');
        darkThemeElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (cursor) cursor.style.borderColor = '#FFFFFF';
            });
            el.addEventListener('mouseleave', () => {
                if (cursor) cursor.style.borderColor = '#000000';
            });
        });

        // HOVER LOGIC
        document.querySelectorAll('.cursor-interact').forEach(el => {
            el.addEventListener('mouseenter', () => {
                isHovering = true;
                if (cursor) cursor.classList.add('hovering');
                if (cursorLabel) {
                    const rawText = el.getAttribute('data-cursor') || 'VIEW';
                    // We can map it or just use it. The prompt suggests mapping.
                    // "Wishlist button: WISHLIST", "Discover button: EXPLORE", etc.
                    // I will look for keywords.
                    let displayText = 'VIEW';
                    if (rawText.includes('WISHLIST')) displayText = 'WISHLIST';
                    else if (rawText.includes('EXPLORE') || rawText.includes('DISCOVER')) displayText = 'EXPLORE';
                    else if (rawText.includes('READ')) displayText = 'READ';
                    else if (rawText.includes('PLAY')) displayText = 'PLAY';
                    else if (rawText.includes('GO')) displayText = 'GO';

                    cursorLabel.innerText = displayText;
                }
            });
            el.addEventListener('mouseleave', () => {
                isHovering = false;
                if (cursor) cursor.classList.remove('hovering');
                if (cursorLabel) cursorLabel.innerText = '';
            });
        });
    }
});
