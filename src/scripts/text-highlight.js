// Text Highlight Effect
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hoverIndicator = document.querySelector('.hover-indicator');
  let hasHoveredText = false;

  // Add hover effect to all text elements
  const textSelectors = [
    'h1', 'h2', 'h3', 'h4',
    'p', 'span', 'a', 'li',
    '.text-hover-effect'
  ];

  const processTextElement = (element) => {
    // Skip if already processed
    if (element.classList.contains('text-highlight-processed')) return;

    // Skip cursor interact elements
    if (element.classList.contains('cursor-interact')) return;

    // Skip interactive elements
    if (element.tagName === 'BUTTON' || element.tagName === 'INPUT') return;

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

  // Also process text nodes within elements
  const wrapTextNodes = (element) => {
    const childNodes = Array.from(element.childNodes);
    let hasText = false;

    childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        hasText = true;
        const span = document.createElement('span');
        span.className = 'text-hover-effect text-highlight-processed';
        span.textContent = node.textContent;
        node.parentNode.replaceChild(span, node);
      }
    });

    return hasText;
  };

  // Process elements that might contain text
  const containerSelectors = ['.section-label', '.display-text', '.reveal', '.reveal-stagger > *'];
  containerSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      if (!element.classList.contains('text-highlight-processed')) {
        wrapTextNodes(element);
        element.classList.add('text-highlight-processed');
      }
    });
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
