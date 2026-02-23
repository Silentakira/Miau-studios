let lastScrollY = window.scrollY;

function handleScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    const currentScrollY = window.scrollY;

    if (currentScrollY <= 0) {
        nav.classList.remove('nav-pill', 'nav-hidden');
    } else if (currentScrollY < lastScrollY) {
        // Scrolling UP
        nav.classList.add('nav-pill');
        nav.classList.remove('nav-hidden');
    } else {
        // Scrolling DOWN
        nav.classList.add('nav-hidden');
        nav.classList.remove('nav-pill');
    }

    lastScrollY = currentScrollY;
}

window.addEventListener('scroll', handleScroll);

// Mobile Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            toggle.classList.toggle('open');
        });
    }
});
