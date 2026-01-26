// ==========================================
// ROBO ROBOTICS CLUB - OPTIMIZED CORE
// ==========================================

// Global State for Input Coalescing
// We update these on event triggers, but read them in the render loop
// to avoid layout thrashing.
const MouseState = {
    x: 0,
    y: 0,
    normalizedX: 0, // -1 to 1
    normalizedY: 0  // -1 to 1
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Input Listeners first
    initGlobalInputListeners();

    // 2. Initialize UI Components
    initScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initCounterAnimation();
    initFormHandler();
    initTypingEffect();
    
    // 3. Initialize Visual Effects (synced to common RAF)
    initVisualEffects(); // Parallax & Tilt merged here
    
    // 4. Initialize Heavy 3D Context
    initThreeJSBackground();
});

// ==========================================
// CENTRALIZED INPUT HANDLING
// ==========================================
function initGlobalInputListeners() {
    // Passive listener for better scroll performance
    window.addEventListener('mousemove', (e) => {
        MouseState.x = e.clientX;
        MouseState.y = e.clientY;
        MouseState.normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
        MouseState.normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });
}

// ==========================================
// 1. TYPING EFFECT (Cleaned)
// ==========================================
function initTypingEffect() {
    const text = "University of Lucknow's premier robotics club. Where innovation meets engineering excellence.";
    const element = document.querySelector('.typing-text');
    if (!element) return;

    element.textContent = '';
    element.classList.add('typing-cursor');

    let index = 0;
    // Use requestAnimationFrame for timing if high precision needed, 
    // but setInterval is acceptable here for text.
    setTimeout(() => {
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => element.classList.remove('typing-cursor'), 3000);
            }
        }, 30);
    }, 1500);
}

// ==========================================
// 2. VISUAL EFFECTS (Parallax, Tilt, Cursor)
// ==========================================
function initVisualEffects() {
    const orbs = document.querySelectorAll('.glow-orb');
    const tiltCards = document.querySelectorAll('.glass');
    const cursor = createCursorElement();

    // We use a single loop for DOM effects to avoid multiple RAF calls
    function loop() {
        // A. Parallax (Orbs)
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 15;
            const x = MouseState.normalizedX * speed;
            const y = MouseState.normalizedY * -speed; // Invert Y for natural feel
            orb.style.transform = `translate3d(${x}px, ${y}px, 0)`; // translate3d forces GPU acceleration
        });

        // B. Tilt Effect
        tiltCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            // Check if mouse is near/over the card to save calculation
            if (
                MouseState.x > rect.left - 50 && MouseState.x < rect.right + 50 &&
                MouseState.y > rect.top - 50 && MouseState.y < rect.bottom + 50
            ) {
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const x = (MouseState.x - centerX) / (rect.width / 2);
                const y = (MouseState.y - centerY) / (rect.height / 2);
                
                // Clamp values
                const rotateX = Math.max(-10, Math.min(10, -y * 10));
                const rotateY = Math.max(-10, Math.min(10, x * 10));

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            } else {
                // Reset if mouse moves away
                if (card.style.transform !== 'none') {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                }
            }
        });

        // C. Cursor Glow
        if (cursor) {
            // Simple lerp for smooth cursor trailing could be added here
            cursor.style.transform = `translate3d(${MouseState.x}px, ${MouseState.y}px, 0) translate(-50%, -50%)`;
        }

        requestAnimationFrame(loop);
    }
    loop();
}

function createCursorElement() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    // Styles moved to CSS class ideally, but inline for now
    cursor.style.cssText = `
        position: fixed; top: 0; left: 0; width: 300px; height: 300px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
        border-radius: 50%; pointer-events: none; z-index: 9999;
        will-change: transform; /* Hint to browser */
    `;
    document.body.appendChild(cursor);
    return cursor;
}

// ==========================================
// 3. SCROLL & NAV UTILITIES
// ==========================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible to save memory
                // observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((el, i) => {
        el.style.transitionDelay = `${i * 50}ms`; // CSS-based stagger is more performant than setTimeout
        observer.observe(el);
    });
}

function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    if (!toggle) return;

    // Create menu once
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
        <a href="#about">About</a><a href="#projects">Projects</a>
        <a href="#events">Events</a><a href="#team">Team</a>
        <a href="#contact">Contact</a><a href="#contact" class="btn btn-primary">Join Us</a>
    `;
    // Styles should ideally be in CSS file
    Object.assign(mobileMenu.style, {
        display: 'none', position: 'absolute', top: '100%', left: '0', right: '0',
        background: 'rgba(10, 10, 15, 0.98)', backdropFilter: 'blur(20px)',
        padding: '24px', flexDirection: 'column', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)'
    });
    document.querySelector('.navbar').appendChild(mobileMenu);

    toggle.addEventListener('click', () => {
        const isActive = toggle.classList.toggle('active');
        mobileMenu.style.display = isActive ? 'flex' : 'none';
    });

    mobileMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            toggle.classList.remove('active');
            mobileMenu.style.display = 'none';
        }
    });
}

function initSmoothScroll() {
    // Delegation: One listener for the whole document
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        }
    });
    
    // Navbar Background Scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const navbar = document.querySelector('.navbar');
                if (window.scrollY > 100) {
                    navbar.style.background = 'rgba(10, 10, 15, 0.9)';
                    navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
                } else {
                    navbar.style.background = 'rgba(10, 10, 15, 0.7)';
                    navbar.style.boxShadow = 'none';
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

function initCounterAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                // Use requestAnimationFrame for smoother counter
                let startTimestamp = null;
                const duration = 2000;
                
                const step = (timestamp) => {
                    if (!startTimestamp) startTimestamp = timestamp;
                    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                    el.textContent = Math.floor(progress * target);
                    if (progress < 1) window.requestAnimationFrame(step);
                    else el.textContent = target;
                };
                window.requestAnimationFrame(step);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat-number').forEach(c => observer.observe(c));
}

function initFormHandler() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Sending...</span>';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<span>Message Sent! ✓</span>';
            btn.style.background = '#22c55e'; // simplified color
            form.reset();
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

// ==========================================
// 4. THREE.JS BACKGROUND (ALIGNED)
// ==========================================
function initThreeJSBackground() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // --- SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Moved camera slightly higher for a clearer "board game" view of the grid
    camera.position.set(0, 15, 25);
    camera.lookAt(0, -5, 0);

    const renderer = new THREE.WebGLRenderer({ 
        canvas, alpha: true, antialias: true, powerPreference: "high-performance" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- CONSTANTS ---
    const CELL_SIZE = 5; 
    const GRID_Y = -10;
    // Calculate exact Car Y so wheels touch the line:
    // Grid Height + Wheel Radius (0.4) + Wheel Offset correction (0.1)
    const CAR_Y = GRID_Y + 0.5; 

    // --- REUSABLE MEMORY ---
    const _vec3_1 = new THREE.Vector3();
    const _dir = new THREE.Vector3();
    
    // Helper: Snaps strictly to the 5-unit grid intersections
    const getGridTarget = (targetVec) => {
        targetVec.set(
            (Math.floor(Math.random() * 8) - 4) * CELL_SIZE, // -20, -15... 15, 20
            CAR_Y, 
            (Math.floor(Math.random() * 8) - 4) * CELL_SIZE
        );
    };

    // --- MATERIALS & GEOMETRY (Optimized) ---
    const materials = {
        main: new THREE.LineBasicMaterial({ color: 0xff6b35, transparent: true, opacity: 0.8 }),
        cyan: new THREE.LineBasicMaterial({ color: 0x4ecdc4, transparent: true, opacity: 0.8 }),
        green: new THREE.LineBasicMaterial({ color: 0x4ade80, transparent: true, opacity: 0.8 }),
        blue: new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.8 }),
        dark: new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.6 }),
        detail: new THREE.LineBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.8 })
    };

    const geometries = {
        front: new THREE.EdgesGeometry(createTaperedBox(1.6, 1.0, 1.4, 0.4)),
        rear: new THREE.EdgesGeometry(new THREE.BoxGeometry(1.8, 1.0, 1.6)),
        cage: new THREE.EdgesGeometry(new THREE.BoxGeometry(1.6, 0.8, 1.4)),
        bumper: new THREE.EdgesGeometry(new THREE.BoxGeometry(1.4, 0.4, 0.2)),
        // Wheel radius is 0.4
        wheel: new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 12)), 
        base: new THREE.EdgesGeometry(new THREE.CylinderGeometry(1, 1.2, 0.5, 16)),
        segment: new THREE.EdgesGeometry(new THREE.BoxGeometry(0.3, 2, 0.3)),
        gripper: new THREE.EdgesGeometry(new THREE.BoxGeometry(0.8, 0.4, 0.2))
    };

    function createTaperedBox(w, h, d, taperScale) {
        const geom = new THREE.BoxGeometry(w, h, d);
        const pos = geom.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            if (pos.getZ(i) > d/4) pos.setX(i, pos.getX(i) * taperScale);
        }
        return geom;
    }

    // --- ENVIRONMENT ---
    // GridHelper(size, divisions). 100 / 20 = 5 units per square. Matches CELL_SIZE.
    const gridHelper = new THREE.GridHelper(100, 20, 0x6366f1, 0x6366f1);
    gridHelper.position.y = GRID_Y;
    gridHelper.material.opacity = 0.15;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Particles (Visuals)
    const particleCount = 30;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pCol = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        pPos[i*3] = (Math.random()-0.5)*60;
        pPos[i*3+1] = (Math.random()-0.5)*30;
        pPos[i*3+2] = (Math.random()-0.5)*60;
        pCol[i*3] = 0.6 + Math.random()*0.4;
        pCol[i*3+1] = 0.4 + Math.random()*0.4;
        pCol[i*3+2] = 1.0;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
        size: 0.15, vertexColors: true, transparent: true, opacity: 0.6
    }));
    scene.add(particles);

    // Arm (Background element)
    const armGroup = new THREE.Group();
    armGroup.position.set(30, GRID_Y, 20); // Base sits on grid
    armGroup.scale.set(1.5, 1.5, 1.5);
    armGroup.add(new THREE.LineSegments(geometries.base, materials.main));
    
    // Simple arm structure
    const lowerArm = new THREE.Group(); lowerArm.position.y = 0.25;
    const lMesh = new THREE.LineSegments(geometries.segment, materials.cyan); lMesh.position.y = 1; lowerArm.add(lMesh);
    armGroup.add(lowerArm);
    
    const upperArm = new THREE.Group(); upperArm.position.y = 2;
    const uMesh = new THREE.LineSegments(geometries.segment, materials.cyan); uMesh.position.y = 1; upperArm.add(uMesh);
    lowerArm.add(upperArm);
    
    const gripper = new THREE.LineSegments(geometries.gripper, materials.main); gripper.position.y = 2.2;
    upperArm.add(gripper);
    scene.add(armGroup);

   // --- CARS LOGIC (PATTERN MODE) ---
    const robotCars = [];
    const carColors = [materials.green, materials.blue, materials.main, materials.cyan];

    // Define 4 safe "Patrol Zones" (Square loops)
    // Each array contains the 4 corners of a square path
    const patrolPaths = [
        // Car 0: Top Right Quadrant (Clockwise)
        [new THREE.Vector3(5, CAR_Y, 5), new THREE.Vector3(20, CAR_Y, 5), new THREE.Vector3(20, CAR_Y, 20), new THREE.Vector3(5, CAR_Y, 20)],
        // Car 1: Top Left Quadrant (Counter-Clockwise)
        [new THREE.Vector3(-5, CAR_Y, 5), new THREE.Vector3(-5, CAR_Y, 20), new THREE.Vector3(-20, CAR_Y, 20), new THREE.Vector3(-20, CAR_Y, 5)],
        // Car 2: Bottom Left Quadrant (Clockwise)
        [new THREE.Vector3(-5, CAR_Y, -5), new THREE.Vector3(-20, CAR_Y, -5), new THREE.Vector3(-20, CAR_Y, -20), new THREE.Vector3(-5, CAR_Y, -20)],
        // Car 3: Bottom Right Quadrant (Counter-Clockwise)
        [new THREE.Vector3(5, CAR_Y, -5), new THREE.Vector3(5, CAR_Y, -20), new THREE.Vector3(20, CAR_Y, -20), new THREE.Vector3(20, CAR_Y, -5)]
    ];

    // Initialize Cars
    for(let i=0; i<4; i++) {
        const carGroup = new THREE.Group();
        const mat = carColors[i];

        // --- BUILD CAR (Geometry reuse) ---
        const front = new THREE.LineSegments(geometries.front, mat); front.position.set(0, 0.2, 1.0); carGroup.add(front);
        const rear = new THREE.LineSegments(geometries.rear, mat); rear.position.set(0, 0.2, -0.8); carGroup.add(rear);
        const cage = new THREE.LineSegments(geometries.cage, materials.detail); cage.position.set(0, 0.6, -0.8); carGroup.add(cage);
        const bumper = new THREE.LineSegments(geometries.bumper, materials.detail); bumper.position.set(0, -0.1, 1.7); carGroup.add(bumper);

        const wheels = [];
        [[0.7,-0.1,0.8], [-0.7,-0.1,0.8], [0.9,-0.1,-1.0], [-0.9,-0.1,-1.0]].forEach(p => {
            const w = new THREE.LineSegments(geometries.wheel, materials.dark);
            w.position.set(...p); w.rotation.z = Math.PI/2;
            carGroup.add(w); wheels.push(w);
        });

        // --- PATTERN SETUP ---
        // Start at the first point of their specific path
        const startPoint = patrolPaths[i][0];
        carGroup.position.copy(startPoint);

        carGroup.userData = {
            path: patrolPaths[i], // The array of 4 points
            targetIndex: 1,       // Go to the second point first
            wheels: wheels,
            speed: 0.12,          // Fast, consistent speed
            axis: 'x'             // Movement axis
        };
        
        // Orient initially to face target
        carGroup.lookAt(patrolPaths[i][1]);

        scene.add(carGroup);
        robotCars.push(carGroup);
    }

    // --- ANIMATION ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001;

        // 1. Arm Sway
        lowerArm.rotation.z = Math.sin(time) * 0.2 + 0.5;
        upperArm.rotation.z = Math.cos(time) * 0.3 - 0.5;
        armGroup.rotation.y = Math.sin(time * 0.5) * 0.5;

        // 2. Car Logic (Patrol Mode)
        robotCars.forEach(car => {
            const data = car.userData;
            const targetVec = data.path[data.targetIndex];
            
            // Move
            const dist = car.position.distanceTo(targetVec);
            
            if (dist < data.speed) {
                // Arrived at corner
                car.position.copy(targetVec);
                
                // Advance to next point in the square loop
                data.targetIndex = (data.targetIndex + 1) % 4; // 0,1,2,3 -> 0
                
                // Snap Rotation instantly for robotic feel, or use lookAt
                car.lookAt(data.path[data.targetIndex]);
            } else {
                // Move Forward
                car.translateZ(data.speed); // Simple forward movement since we used lookAt
                
                // Wheels
                data.wheels.forEach(w => w.rotation.x -= data.speed * 8);
                
                // Bobbing
                car.position.y = CAR_Y + Math.sin(time * 20 + car.id) * 0.02;
            }
        });

        // 3. Camera Orbit
        camera.position.x += ((Math.sin(time * 0.1) * 20) - camera.position.x) * 0.02;
        camera.position.z += ((Math.cos(time * 0.1) * 20) - camera.position.z) * 0.02;
        camera.lookAt(0, -5, 0);

        renderer.render(scene, camera);
    }

    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}