// Text Highlight Effect
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hoverIndicator = document.querySelector('.hover-indicator');
  let hasHoveredText = false;

  // Add hover effect to all text elements
  const textSelectors = [
    'h1', 'h2', 'h3', 'h4',
    'p', 'span:not(.cycle-word):not(.tag-pill):not(.tag-yellow-black):not(.tag-pink)',
    'a:not(.btn):not(.social-link):not(.nav-link)',
    'li'
  ];

  const processTextElement = (element) => {
    // Skip if already processed
    if (element.classList.contains('text-highlight-processed')) return;

    // Skip specific classes
    if (element.classList.contains('cursor-interact') ||
        element.classList.contains('scramble-text') ||
        element.classList.contains('glitch') ||
        element.classList.contains('section-label') ||
        element.classList.contains('title-outline') ||
        element.classList.contains('title-filled') ||
        element.closest('blockquote') ||
        element.closest('.footer-middle') ||
        element.closest('.footer-bottom')) {
      return;
    }

    // Skip interactive elements
    if (element.tagName === 'BUTTON' || element.tagName === 'INPUT') return;

    // Skip parent elements that contain interactive children
    if (element.querySelector('.cursor-interact, .btn, button, a[href], input')) {
      return;
    }

    // Add class and mark as processed
    element.classList.add('text-hover-effect', 'text-highlight-processed');

    // Hide indicator on first text hover
    element.addEventListener('mouseenter', () => {
      if (!hasHoveredText && hoverIndicator) {
        hoverIndicator.classList.add('hidden');
        hasHoveredText = true;

        // Remove from DOM after animation
        setTimeout(() => {
          if (hoverIndicator && hoverIndicator.parentNode) {
            hoverIndicator.remove();
          }
        }, 500);
      }
    });
  };

  // Process all text elements
  textSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(processTextElement);
  });

  // Apply to dynamically added content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          textSelectors.forEach(selector => {
            if (node.matches && node.matches(selector)) {
              processTextElement(node);
            }
            node.querySelectorAll && node.querySelectorAll(selector).forEach(processTextElement);
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});
