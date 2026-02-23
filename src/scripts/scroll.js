const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    // 2. Intersection Observer
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    const isMobile = window.innerWidth < 768;

    const ioOptions = {
        threshold: (isTouchDevice || isMobile) ? 0.1 : 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('active');

            // Trigger children stagger
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

    document.querySelectorAll('.reveal-split, .reveal-stagger, .reveal, #community').forEach(el => {
        observer.observe(el);
    });

    // 3. Social Proof Counter
    const counterEl = document.getElementById('social-counter');
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
                    }
                };
                requestAnimationFrame(step);
            }
        });
        countObserver.observe(counterEl);
    }
});
