const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none)').matches;

let mX = -100, mY = -100;
let cX = -100, cY = -100;
let gX = -100, gY = -100;
let isHovering = false;
let firstMove = true;
let isOnDark = false;

const cursor = document.getElementById('custom-cursor');
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
    const isWhite = bg === 'rgba(30, 29, 29, 0)' || bg === 'rgb(255, 255, 255)' || bg === 'transparent';
    return !isWhite;
}

function updateCursorColor() {
    if (!cursor) return;
    if (isHovering) {
        cursor.style.background = '#FFE100';
        cursor.style.borderColor = 'transparent';
    } else {
        cursor.style.background = 'transparent';
        cursor.style.borderColor = isOnDark ? '#FFFFFF' : '#000000';
    }
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

    let dx = mX - cX;
    let dy = mY - cY;
    cX += dx * 0.15;
    cY += dy * 0.15;

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

        let stretchX = isHovering ? 1 : 1 + Math.min(speedX * 0.015, 0.6);
        let stretchY = isHovering ? 1 : 1 + Math.min(speedY * 0.015, 0.6);

        cursor.style.transform = `translate(${cX}px, ${cY}px) translate(-50%, -50%) scale(${stretchX}, ${stretchY})`;
    }

    requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia("(pointer: fine)").matches && !isTouchDevice) {
        animate();

        // DARK SECTION DETECTION
        const darkElements = document.querySelectorAll('.game-section, footer, .dark-section');
        darkElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                isOnDark = true;
                updateCursorColor();
            });
            el.addEventListener('mouseleave', () => {
                isOnDark = false;
                updateCursorColor();
            });
        });

        // HOVER — shrink to dot
        document.querySelectorAll('.cursor-interact').forEach(el => {
            el.addEventListener('mouseenter', () => {
                isHovering = true;
                if (cursor) {
                    cursor.style.width = '16px';
                    cursor.style.height = '16px';
                }
                updateCursorColor();
            });
            el.addEventListener('mouseleave', () => {
                isHovering = false;
                if (cursor) {
                    cursor.style.width = '20px';
                    cursor.style.height = '20px';
                }
                updateCursorColor();
            });
        });
    }
});