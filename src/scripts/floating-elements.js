// Floating Elements - Hero section only with explosion effect
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const heroRect = hero.getBoundingClientRect();
  const heroBottom = heroRect.height;

  // Create floating shapes container
  const container = document.createElement('div');
  container.className = 'floating-shapes-container';
  container.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  `;
  hero.appendChild(container);

  // Create explosion particles
  const createExplosion = (x, y, color) => {
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const angle = (i / particleCount) * Math.PI * 2;
      const velocity = Math.random() * 50 + 30;
      const size = Math.random() * 6 + 2;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        opacity: 1;
        pointer-events: none;
        transform: translate(-50%, -50%);
      `;

      container.appendChild(particle);

      // Animate explosion
      const animate = () => {
        const time = Date.now() / 1000;
        const newX = x + Math.cos(angle) * velocity * time;
        const newY = y + Math.sin(angle) * velocity * time + time * time * 20;
        const opacity = Math.max(0, 1 - time * 2);

        particle.style.left = `${newX}px`;
        particle.style.top = `${newY}px`;
        particle.style.opacity = opacity;

        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };

      requestAnimationFrame(animate);
    }
  };

  // Create floating shape
  const createFloatingShape = () => {
    const shape = document.createElement('div');
    shape.className = 'floating-shape';

    // Random properties
    const size = Math.random() * 30 + 15; // 15-45px
    const startX = Math.random() * 100;
    const duration = Math.random() * 8 + 6; // 6-14s
    const delay = Math.random() * 3;
    const colors = ['var(--yellow)', 'var(--pink)', 'var(--blue)'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const opacity = Math.random() * 0.06 + 0.02;

    shape.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '30%'};
      opacity: 0;
      left: ${startX}%;
      top: -50px;
      filter: blur(1px);
    `;

    container.appendChild(shape);

    // Animate shape
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / 1000;
      const adjustedProgress = Math.max(0, progress - delay);

      if (adjustedProgress <= 0) {
        requestAnimationFrame(animate);
        return;
      }

      const yPos = (adjustedProgress / duration) * (heroBottom + 100) - 50;
      const currentOpacity = adjustedProgress < 0.5 ? opacity * (adjustedProgress * 2) : opacity * (2 - adjustedProgress * 2);

      shape.style.top = `${yPos}px`;
      shape.style.opacity = currentOpacity;
      shape.style.transform = `rotate(${adjustedProgress * 360}deg)`;

      // Check if reached bottom
      if (yPos >= heroBottom - 20) {
        // Create explosion
        const rect = shape.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        createExplosion(
          rect.left - containerRect.left + size / 2,
          rect.top - containerRect.top + size / 2,
          color
        );
        shape.remove();
        return;
      }

      if (adjustedProgress < duration) {
        requestAnimationFrame(animate);
      } else {
        shape.remove();
      }
    };

    requestAnimationFrame(animate);
  };

  // Create floating shapes periodically
  const createShapes = () => {
    if (document.visibilityState === 'visible') {
      createFloatingShape();
    }
  };

  // Initial shapes
  for (let i = 0; i < 3; i++) {
    setTimeout(createShapes, i * 500);
  }

  // Continuously create new shapes
  setInterval(createShapes, 2000);
});
