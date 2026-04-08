// Floating Elements - Everywhere on page + Hero section with explosions
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ========== GLOBAL FALLING ELEMENTS (Everywhere) ==========
  const body = document.body;

  // Create floating shapes for entire page
  const createGlobalFallingShape = () => {
    const shape = document.createElement('div');
    shape.className = 'global-floating-shape';

    // Random properties
    const size = Math.random() * 40 + 25; // 25-65px
    const startX = Math.random() * 100;
    const duration = Math.random() * 15 + 10; // 10-25s
    const delay = Math.random() * 5;
    const colors = ['var(--yellow)', 'var(--pink)', 'var(--blue)'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const opacity = Math.random() * 0.15 + 0.08; // 8-23% opacity (much more visible!)

    shape.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '30%'};
      opacity: 0;
      left: ${startX}vw;
      top: -100px;
      pointer-events: none;
      z-index: 5;
      filter: blur(0.5px);
    `;

    body.appendChild(shape);

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

      const yPos = (adjustedProgress / duration) * (window.innerHeight + 200) - 100;
      const currentOpacity = adjustedProgress < 0.5 ? opacity * (adjustedProgress * 2) : opacity * (2 - adjustedProgress * 2);
      const rotation = adjustedProgress * 360;
      const xOffset = Math.sin(adjustedProgress * 2) * 50;

      shape.style.top = `${yPos}px`;
      shape.style.opacity = currentOpacity;
      shape.style.transform = `translateX(${xOffset}px) rotate(${rotation}deg)`;

      if (adjustedProgress < duration && yPos < window.innerHeight + 200) {
        requestAnimationFrame(animate);
      } else {
        shape.remove();
      }
    };

    requestAnimationFrame(animate);
  };

  // Create multiple global falling shapes
  for (let i = 0; i < 8; i++) {
    setTimeout(createGlobalFallingShape, i * 600);
  }

  // Continuously create new global shapes
  setInterval(createGlobalFallingShape, 2500);

  // ========== HERO SECTION FLOATING ELEMENTS (With explosions) ==========
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Create floating shapes container for hero
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
    overflow: visible;
  `;
  hero.style.position = 'relative';
  hero.appendChild(container);

  // Create explosion particles
  const createExplosion = (x, y, color) => {
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const angle = (i / particleCount) * Math.PI * 2;
      const velocity = Math.random() * 80 + 40;
      const size = Math.random() * 8 + 3;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        opacity: 1;
        pointer-events: auto;
        cursor: pointer;
        transform: translate(-50%, -50%);
        z-index: 10;
      `;

      container.appendChild(particle);

      // Click to pop
      particle.addEventListener('click', (e) => {
        e.stopPropagation();
        // Create mini explosion
        const miniCount = 6;
        for (let j = 0; j < miniCount; j++) {
          const miniParticle = document.createElement('div');
          const miniAngle = (j / miniCount) * Math.PI * 2;
          const miniVelocity = Math.random() * 30 + 20;
          const miniSize = Math.random() * 4 + 2;

          miniParticle.style.cssText = `
            position: absolute;
            width: ${miniSize}px;
            height: ${miniSize}px;
            background: ${color};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            opacity: 1;
            pointer-events: none;
            z-index: 11;
          `;

          container.appendChild(miniParticle);

          let miniStartTime = null;
          const animateMini = (timestamp) => {
            if (!miniStartTime) miniStartTime = timestamp;
            const time = (timestamp - miniStartTime) / 1000;

            const newX = x + Math.cos(miniAngle) * miniVelocity * time;
            const newY = y + Math.sin(miniAngle) * miniVelocity * time;
            const opacity = Math.max(0, 1 - time * 3);

            miniParticle.style.left = `${newX}px`;
            miniParticle.style.top = `${newY}px`;
            miniParticle.style.opacity = opacity;
            miniParticle.style.transform = `translate(-50%, -50%) scale(${1 - time})`;

            if (opacity > 0) {
              requestAnimationFrame(animateMini);
            } else {
              miniParticle.remove();
            }
          };

          requestAnimationFrame(animateMini);
        }

        // Pop effect on original particle
        particle.style.transform = 'translate(-50%, -50%) scale(2)';
        particle.style.opacity = '0';
        setTimeout(() => particle.remove(), 200);
      });

      // Animate explosion
      let startTime = null;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const time = (timestamp - startTime) / 1000;
        const newX = x + Math.cos(angle) * velocity * time;
        const newY = y + Math.sin(angle) * velocity * time + time * time * 30;
        const opacity = Math.max(0, 1 - time * 1.5);

        particle.style.left = `${newX}px`;
        particle.style.top = `${newY}px`;
        particle.style.opacity = opacity;
        particle.style.transform = `translate(-50%, -50%) scale(${1 + time * 0.5})`;

        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };

      requestAnimationFrame(animate);
    }
  };

  // Create hero floating shape
  const createHeroFloatingShape = () => {
    const heroRect = hero.getBoundingClientRect();
    const heroBottom = heroRect.height;

    const shape = document.createElement('div');
    shape.className = 'floating-shape';

    // Random properties
    const size = Math.random() * 35 + 20; // 20-55px (slightly bigger)
    const startX = Math.random() * 100;
    const duration = Math.random() * 8 + 6; // 6-14s
    const colors = ['var(--yellow)', 'var(--pink)', 'var(--blue)'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const opacity = Math.random() * 0.18 + 0.10; // 10-28% opacity (much more visible!)

    shape.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '30%'};
      opacity: 0;
      left: ${startX}%;
      top: -50px;
      filter: blur(0.5px);
      pointer-events: auto;
      cursor: pointer;
      z-index: 1;
    `;

    container.appendChild(shape);

    // Click to pop
    shape.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = shape.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Create explosion at current position
      createExplosion(
        rect.left - containerRect.left + size / 2,
        rect.top - containerRect.top + size / 2,
        color
      );

      // Pop effect
      shape.style.transform = 'scale(1.5)';
      shape.style.opacity = '0';
      setTimeout(() => shape.remove(), 200);
    });

    // Animate shape
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / 1000;

      const yPos = (progress / duration) * (heroBottom + 100) - 50;
      const currentOpacity = progress < 0.5 ? opacity * (progress * 2) : opacity * (2 - progress * 2);

      shape.style.top = `${yPos}px`;
      shape.style.opacity = currentOpacity;
      shape.style.transform = `rotate(${progress * 360}deg)`;

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

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        shape.remove();
      }
    };

    requestAnimationFrame(animate);
  };

  // Create hero floating shapes periodically
  const createHeroShapes = () => {
    if (document.visibilityState === 'visible') {
      createHeroFloatingShape();
    }
  };

  // Initial hero shapes
  for (let i = 0; i < 4; i++) {
    setTimeout(createHeroShapes, i * 400);
  }

  // Continuously create new hero shapes
  setInterval(createHeroShapes, 1800);
});
