let lastScrollY = window.scrollY;
let currentNavState = 'normal'; // 'normal', 'pill', 'hidden'

function handleScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    // Don't run pill logic on mobile
    if (window.innerWidth <= 768) return;


    const currentScrollY = window.scrollY;

    // Don't hide/show if menu is open
    const navLinks = document.getElementById('nav-links');
    if (navLinks && navLinks.classList.contains('open')) return;

    let newState = currentNavState;

    if (currentScrollY <= 0) {
        newState = 'normal';
    } else if (currentScrollY < lastScrollY) {
        // Scrolling UP
        newState = 'pill';
    } else {
        // Scrolling DOWN
        newState = 'hidden';
    }

    // Only update if state is actually changing
    if (newState !== currentNavState) {
        // Add animating class for smooth transition
        nav.classList.add('nav-animating');

        // Remove all state classes first
        nav.classList.remove('nav-pill', 'nav-hidden', 'nav-normal');

        // Small delay for animation to start
        setTimeout(() => {
            // Add new state
            switch(newState) {
                case 'normal':
                    nav.classList.add('nav-normal');
                    break;
                case 'pill':
                    nav.classList.add('nav-pill');
                    break;
                case 'hidden':
                    nav.classList.add('nav-hidden');
                    break;
            }

            // Remove animating class after transition
            setTimeout(() => {
                nav.classList.remove('nav-animating');
            }, 500);
        }, 10);

        currentNavState = newState;
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
