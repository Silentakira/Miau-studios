// Floating Elements - Add subtle motion around the page
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const body = document.body;

  // Create floating shapes
  const createFloatingShape = () => {
    const shape = document.createElement('div');
    shape.className = 'floating-shape';

    // Random properties
    const size = Math.random() * 40 + 20; // 20-60px
    const startX = Math.random() * 100;
    const duration = Math.random() * 15 + 10; // 10-25s
    const delay = Math.random() * 5;
    const colors = ['var(--yellow)', 'var(--pink)', 'var(--blue)'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    shape.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '30%'};
      opacity: ${Math.random() * 0.08 + 0.02};
      left: ${startX}vw;
      top: -100px;
      pointer-events: none;
      z-index: 0;
      filter: blur(1px);
      animation: floatShape ${duration}s linear ${delay}s infinite;
    `;

    body.appendChild(shape);
  };

  // Create multiple floating shapes
  for (let i = 0; i < 8; i++) {
    createFloatingShape();
  }

  // Add keyframes if not exists
  if (!document.getElementById('floating-animations')) {
    const style = document.createElement('style');
    style.id = 'floating-animations';
    style.textContent = `
      @keyframes floatShape {
        0% {
          transform: translateY(0) rotate(0deg) translateX(0);
          opacity: 0;
        }
        10% {
          opacity: var(--target-opacity);
        }
        90% {
          opacity: var(--target-opacity);
        }
        100% {
          transform: translateY(calc(100vh + 200px)) rotate(360deg) translateX(${Math.random() * 100 - 50}px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
});
