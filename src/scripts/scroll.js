const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none)').matches;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal-split setup
    document.querySelectorAll('.reveal-split').forEach(el => {
        if (prefersReducedMotion || el.dataset.splitDone === "true") return;

        // Use textContent to strip any existing HTML tags (like previous spans)
        const text = el.textContent.trim();
        if (!text) return;

        el.dataset.splitDone = "true";
        el.innerHTML = `
            <span class="split-hidden">${text}</span>
            <span class="split-top" aria-hidden="true">${text}</span>
            <span class="split-bottom" aria-hidden="true">${text}</span>
        `;
    });

    // 2. Intersection Observers
    const isMobile = window.innerWidth < 768;

    const ioOptions = {
        threshold: 0.1, // Consistently low for mobile stability
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            // Trigger both for CSS safety
            entry.target.classList.add('active', 'is-visible');

            // Trigger children stagger for .active elements
            if (entry.target.classList.contains('reveal-stagger')) {
                const children = entry.target.children;
                for (let i = 0; i < children.length; i++) {
                    children[i].style.transitionDelay = `${i * 0.08}s`;
                }
            }

            // Community BG trigger
            if (entry.target.id === 'community') {
                entry.target.classList.add('active-bg');
            }

            observer.unobserve(entry.target);
        });
    }, ioOptions);

    // Observe all possible animatable elements
    const selectors = '.section-label, .interactive-card, .blog-card, .profile-img-wrap, .reveal, .reveal-split, .reveal-scale, .reveal-left, .reveal-right, .social-proof, #community, .reveal-stagger';

    document.querySelectorAll(selectors).forEach(el => {
        observer.observe(el);
    });

    // 4. Game Title Letter Drop (Mobile Only)
    if ((isTouchDevice || isMobile) && !prefersReducedMotion) {
        const gameTitle = document.querySelector('.game-logo-large');
        if (gameTitle && !gameTitle.dataset.lettersDone) {
            gameTitle.dataset.lettersDone = "true";
            // Process each child span (line)
            const lines = Array.from(gameTitle.children);
            const content = lines.map((line, lineIdx) => {
                const text = line.textContent.trim();
                const words = text.split(' ');
                return `<div style="white-space: nowrap;">${words.map(word => {
                    return word.split('').map((l, i) =>
                        `<span class="letter" style="
                            display: inline-block;
                            opacity: 0;
                            transform: translateY(-30px);
                            transition: opacity 0.4s ease ${(lineIdx * 200) + (i * 40)}ms, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${(lineIdx * 200) + (i * 40)}ms
                        ">${l}</span>`
                    ).join('');
                }).join('&nbsp;')}</div>`;
            }).join('');

            gameTitle.innerHTML = content;

            const titleObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        gameTitle.querySelectorAll('.letter').forEach(span => {
                            span.style.opacity = '1';
                            span.style.transform = 'translateY(0)';
                        });
                        titleObserver.unobserve(gameTitle);
                    }
                });
            }, { threshold: 0.1 });
            titleObserver.observe(gameTitle);
        }
    }

    // 5. Community Background Pulse (Mobile Only)
    if ((isTouchDevice || isMobile) && !prefersReducedMotion) {
        const communitySection = document.querySelector('.community');
        if (communitySection) {
            const commObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Background becomes yellow immediately via CSS transition
                        communitySection.style.backgroundColor = '#FFE100';
                        setTimeout(() => {
                            communitySection.style.transition = 'background-color 0.3s ease';
                            communitySection.style.backgroundColor = '#FFD000'; // Saturate pulse
                            setTimeout(() => {
                                communitySection.style.backgroundColor = '#FFE100'; // Settle
                            }, 300);
                        }, 400);
                        commObserver.unobserve(communitySection);
                    }
                });
            }, { threshold: 0.5 });
            commObserver.observe(communitySection);
        }
    }

    // 7. Parallax Effects (Desktop Only)
    if (!isTouchDevice && !prefersReducedMotion) {
        const parallaxElements = document.querySelectorAll('.bg-shape, .hero-cat');
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.scrollY;

                    parallaxElements.forEach((el, index) => {
                        const speed = (index + 1) * 0.05;
                        const yPos = -(scrolled * speed);
                        el.style.transform = `translateY(${yPos}px)`;
                    });

                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // 8. Scale on scroll for hero content
    if (!prefersReducedMotion) {
        const heroContent = document.querySelector('.hero');
        if (heroContent) {
            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY;
                const heroHeight = heroContent.offsetHeight;
                const progress = Math.min(scrolled / heroHeight, 1);

                // Subtle scale and fade as you scroll
                heroContent.style.transform = `scale(${1 - progress * 0.05})`;
                heroContent.style.opacity = 1 - (progress * 0.3);
            }, { passive: true });
        }
    }

    // 3. Social Proof Counter (With Mobile Pulse)
    const counterEl = document.getElementById('social-counter');
    const socialProofRow = document.querySelector('.social-proof');
    let counted = false;

    if (counterEl) {
        const countObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !counted) {
                counted = true;
                if (prefersReducedMotion) {
                    counterEl.innerText = "2,847";
                    return;
                }

                let start = null;
                const duration = 1500;
                const finalValue = 2847;

                const step = (timestamp) => {
                    if (!start) start = timestamp;
                    const progress = Math.min((timestamp - start) / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 4); // Quartic ease out
                    counterEl.innerText = Math.floor(ease * finalValue).toLocaleString();

                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        counterEl.innerText = finalValue.toLocaleString();

                        // Mobile Counter Pulse
                        if (isTouchDevice && socialProofRow) {
                            socialProofRow.style.transition = 'transform 0.2s ease';
                            socialProofRow.style.transform = 'scale(1.06)';
                            setTimeout(() => {
                                socialProofRow.style.transform = 'scale(1)';
                            }, 200);
                        }
                    }
                };
                requestAnimationFrame(step);
            }
        });
        countObserver.observe(counterEl);
    }
});
