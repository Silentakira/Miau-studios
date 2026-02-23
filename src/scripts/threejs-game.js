export function initGameBackground() {
    const canvas = document.getElementById('game-bg-canvas');
    const section = document.getElementById('game');
    if (!canvas || !section || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, section.clientWidth / section.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(section.clientWidth, section.clientHeight);

    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    const isMobile = window.innerWidth < 768;

    // 1. Icosahedron
    const geo1 = new THREE.IcosahedronGeometry(2.8, (isMobile || isTouchDevice) ? 0 : 1);
    const edges1 = new THREE.EdgesGeometry(geo1);
    const mat1 = new THREE.LineBasicMaterial({ color: 0xFFE100, opacity: 0.35, transparent: true });
    const mesh1 = new THREE.LineSegments(edges1, mat1);

    if (isTouchDevice || isMobile) mesh1.scale.set(0.6, 0.6, 0.6);

    const mesh1Group = new THREE.Group();
    mesh1Group.add(mesh1);
    scene.add(mesh1Group);

    // 2. Octahedron
    const geo2 = new THREE.OctahedronGeometry(1.5);
    const edges2 = new THREE.EdgesGeometry(geo2);
    const mat2 = new THREE.LineBasicMaterial({ color: 0xFD82CB, opacity: 0.25, transparent: true });
    const mesh2 = new THREE.LineSegments(edges2, mat2);
    mesh2.position.set(3.5, 0, -1);
    if (isTouchDevice || isMobile) mesh2.scale.set(0.6, 0.6, 0.6);
    scene.add(mesh2);

    // 3. Tetrahedron
    const geo3 = new THREE.TetrahedronGeometry(0.8);
    const edges3 = new THREE.EdgesGeometry(geo3);
    const mat3 = new THREE.LineBasicMaterial({ color: 0x4DBAFD, opacity: 0.25, transparent: true });
    const mesh3 = new THREE.LineSegments(edges3, mat3);
    mesh3.position.set(-3.5, -1, 0);
    if (isTouchDevice || isMobile) mesh3.scale.set(0.6, 0.6, 0.6);
    scene.add(mesh3);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    let targetTiltX = 0, targetTiltY = 0;
    let currentTiltX = 0, currentTiltY = 0;

    if (!isMobile && !isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            // Checking if mouse is within vertical bounds of game section (roughly)
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            targetTiltY = x * 0.5;
            targetTiltX = -y * 0.5;
        });
    }

    const rotationFactor = (isTouchDevice || isMobile) ? 0.5 : 1;

    function animate() {
        requestAnimationFrame(animate);

        mesh1.rotation.y += 0.002 * rotationFactor;
        mesh1.rotation.x += 0.0008 * rotationFactor;
        mesh2.rotation.y -= 0.003 * rotationFactor;
        mesh3.rotation.x += 0.004 * rotationFactor;
        mesh3.rotation.y += 0.002 * rotationFactor;

        if (!isMobile && !isTouchDevice) {
            currentTiltX += (targetTiltX - currentTiltX) * 0.05;
            currentTiltY += (targetTiltY - currentTiltY) * 0.05;
            mesh1Group.rotation.x = currentTiltX;
            mesh1Group.rotation.y = currentTiltY;
        }

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        const w = section.clientWidth;
        const h = section.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    animate();
}

document.addEventListener('DOMContentLoaded', initGameBackground);
