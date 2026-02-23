let lastScrollY = window.scrollY;

function handleScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    // Don't run pill logic on mobile
    if (window.innerWidth <= 768) return;


    const currentScrollY = window.scrollY;

    // Don't hide/show if menu is open
    const navLinks = document.getElementById('nav-links');
    if (navLinks && navLinks.classList.contains('open')) return;

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

window.addEventListener('scroll', handleScroll, { passive: true });

// Mobile Toggle Logic
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('nav-links');
    const mainNav = document.getElementById('main-nav');

    if (hamburger && navLinks && mainNav) {
        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            hamburger.classList.toggle('open', isOpen);
            mainNav.classList.toggle('menu-open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen.toString());
        });

        // close menu when a link is tapped or when clicking outside
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                mainNav.classList.remove('menu-open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close when clicking outside of nav
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                mainNav.classList.remove('menu-open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }
});
