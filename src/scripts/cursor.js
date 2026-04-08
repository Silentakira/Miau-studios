const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

let mX = -100, mY = -100;
let cX = -100, cY = -100;
let gX = -100, gY = -100;
let isHovering = false;
let firstMove = true;
let isOnDark = false;

const cursor = document.getElementById('custom-cursor');
const glow = document.getElementById('cursor-glow');

// Disable custom cursor on touch devices and mobile
if (isTouchDevice || isMobile) {
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
    if (prefersReducedMotion || isTouchDevice || isMobile) return;

    let dx = mX - cX;
    let dy = mY - cY;
    cX += dx * 0.15;
    cY += dy * 0.15;

    if (glow) {
        gX += (mX - gX) * 0.06;
        gY += (mY - gY) * 0.06;
        glow.style.left = `${gX}px`;
        glow.style.top = `${gY}px`;

        if (!firstMove) {
            glow.style.opacity = '1';
        }
    }

    if (cursor) {
        const speed = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const stretch = isHovering ? 1 : 1 + Math.min(speed * 0.015, 1.5);
        const squash = isHovering ? 1 : 1 / stretch;

        // Use will-change for better performance across browsers
        cursor.style.willChange = 'transform';
        cursor.style.transform = `translate3d(${cX}px, ${cY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${stretch}, ${squash})`;
    }

    requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia("(pointer: fine)").matches && !isTouchDevice && !isMobile) {
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
                    cursor.style.width = '12px';
                    cursor.style.height = '12px';
                    cursor.style.transition = 'width 0.15s ease, height 0.15s ease, background-color 0.15s ease, border 0.15s ease';
                }
                updateCursorColor();
            });
            el.addEventListener('mouseleave', () => {
                isHovering = false;
                if (cursor) {
                    cursor.style.width = '20px';
                    cursor.style.height = '20px';
                    cursor.style.transition = 'width 0.2s ease, height 0.2s ease, background-color 0.2s ease, border 0.2s ease';
                }
                updateCursorColor();
            });
        });
    }
});