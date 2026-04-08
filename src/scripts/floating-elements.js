// Floating Elements - Hero section only with explosion effect
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

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

          let startTime = null;
          const animateMini = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const time = (timestamp - startTime) / 1000;

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

  // Create floating shape
  const createFloatingShape = () => {
    const heroRect = hero.getBoundingClientRect();
    const heroBottom = heroRect.height;

    const shape = document.createElement('div');
    shape.className = 'floating-shape';

    // Random properties
    const size = Math.random() * 30 + 15; // 15-45px
    const startX = Math.random() * 100;
    const duration = Math.random() * 8 + 6; // 6-14s
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

  // Create floating shapes periodically
  const createShapes = () => {
    if (document.visibilityState === 'visible') {
      createFloatingShape();
    }
  };

  // Initial shapes
  for (let i = 0; i < 4; i++) {
    setTimeout(createShapes, i * 400);
  }

  // Continuously create new shapes
  setInterval(createShapes, 1800);
});
