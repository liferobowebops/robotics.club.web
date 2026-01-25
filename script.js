// ==========================================
// ROBO ROBOTICS CLUB - Interactive Scripts
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initCounterAnimation();
    initFormHandler();
    initParallax();
    initTypingEffect();
    initTiltEffect();
    initThreeJSBackground();
});

// ==========================================
// TYPING EFFECT
// ==========================================
function initTypingEffect() {
    const text = "University of Lucknow's premier robotics club. Where innovation meets engineering excellence.";
    const element = document.querySelector('.typing-text');
    if (!element) return;

    element.textContent = '';
    element.classList.add('typing-cursor');

    let index = 0;

    setTimeout(() => {
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
                // Blink cursor for 3 more seconds then remove
                setTimeout(() => {
                    element.classList.remove('typing-cursor');
                }, 3000);
            }
        }, 30); // Typing speed
    }, 1500); // Initial delay
}

// ==========================================
// 3D TILT EFFECT
// ==========================================
function initTiltEffect() {
    const cards = document.querySelectorAll('.glass');

    cards.forEach(card => {
        card.classList.add('tilt-card');

        // Wrap content if needed, but for now apply to card directly
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// ==========================================
// SCROLL-TRIGGERED ANIMATIONS
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for multiple elements
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, observerOptions);

    // Observe all elements with scroll animation class
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
    });
}

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');

            // Create mobile menu if it doesn't exist
            let mobileMenu = document.querySelector('.mobile-menu');

            if (!mobileMenu) {
                mobileMenu = document.createElement('div');
                mobileMenu.className = 'mobile-menu';
                mobileMenu.innerHTML = `
                    <a href="#about">About</a>
                    <a href="#projects">Projects</a>
                    <a href="#events">Events</a>
                    <a href="#team">Team</a>
                    <a href="#contact">Contact</a>
                    <a href="#contact" class="btn btn-primary">Join Us</a>
                `;
                document.querySelector('.navbar').appendChild(mobileMenu);

                // Add styles dynamically
                const style = document.createElement('style');
                style.textContent = `
                    .mobile-menu {
                        display: none;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: rgba(10, 10, 15, 0.98);
                        backdrop-filter: blur(20px);
                        padding: 24px;
                        flex-direction: column;
                        gap: 16px;
                        border-bottom: 1px solid rgba(255,255,255,0.08);
                    }
                    .mobile-menu.active {
                        display: flex;
                    }
                    .mobile-menu a {
                        padding: 12px 0;
                        font-size: 1rem;
                        color: #a1a1aa;
                        border-bottom: 1px solid rgba(255,255,255,0.05);
                    }
                    .mobile-menu a:hover {
                        color: #fff;
                    }
                    .mobile-toggle.active span:nth-child(1) {
                        transform: rotate(45deg) translate(5px, 5px);
                    }
                    .mobile-toggle.active span:nth-child(2) {
                        opacity: 0;
                    }
                    .mobile-toggle.active span:nth-child(3) {
                        transform: rotate(-45deg) translate(5px, -5px);
                    }
                `;
                document.head.appendChild(style);
            }

            mobileMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mobile-menu a')) {
                document.querySelector('.mobile-menu')?.classList.remove('active');
                toggle.classList.remove('active');
            }
        });
    }
}

// ==========================================
// SMOOTH SCROLL FOR NAVIGATION
// ==========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// COUNTER ANIMATION FOR STATS
// ==========================================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ==========================================
// FORM HANDLER
// ==========================================
function initFormHandler() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Simulate form submission
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<span>Sending...</span>';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = '<span>Message Sent! ✓</span>';
                btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

                // Reset form
                form.reset();

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
}

// ==========================================
// PARALLAX EFFECT FOR HERO ORBS
// ==========================================
function initParallax() {
    const orbs = document.querySelectorAll('.glow-orb');

    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 15;
            const xOffset = x * speed;
            const yOffset = y * speed;

            orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
}

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');

    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.9)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.7)';
        navbar.style.boxShadow = 'none';
    }
});

// ==========================================
// CURSOR GLOW EFFECT (Optional Enhancement)
// ==========================================
function initCursorGlow() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
}

// Uncomment to enable cursor glow effect
initCursorGlow();

// ==========================================
// THREE.JS HERO BACKGROUND (OPTIMIZED)
// ==========================================
function initThreeJSBackground() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    // Adjusted camera for a better isometric-style view
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 12, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance" 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance

    // --- SHARED RESOURCES (PERFORMANCE OPTIMIZATION) ---
    // Create geometries and materials ONCE here, reuse them later.
    
    // Materials
    const gridColor = 0x6366f1;
    const orangeColor = 0xff6b35;
    const cyanColor = 0x4ecdc4;
    const darkColor = 0x333333;

    const mainMaterial = new THREE.LineBasicMaterial({ color: orangeColor, transparent: true, opacity: 0.8 });
    const cyanMaterial = new THREE.LineBasicMaterial({ color: cyanColor, transparent: true, opacity: 0.8 });
    const wheelMaterial = new THREE.LineBasicMaterial({ color: darkColor, transparent: true, opacity: 0.6 });

    // Geometries
    const carBodyGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 0.8, 1));
    const wheelGeo = new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 8));
    
    // Arm Geometries
    const baseGeo = new THREE.EdgesGeometry(new THREE.CylinderGeometry(1, 1.2, 0.5, 16));
    const segmentGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.3, 2, 0.3));
    const gripperGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.8, 0.4, 0.2));

    // --- ENVIRONMENT ---
    const gridHelper = new THREE.GridHelper(100, 20, gridColor, gridColor);
    gridHelper.position.y = -10;
    gridHelper.material.opacity = 0.15;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Particles
    const particleCount = 50; // Reduced density
    const particleGeometry = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);
    const pSpeeds = new Float32Array(particleCount); // Store individual speeds

    for (let i = 0; i < particleCount; i++) {
        pPositions[i * 3] = (Math.random() - 0.5) * 60;
        pPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        pPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;

        pColors[i * 3] = 0.6 + Math.random() * 0.4;
        pColors[i * 3 + 1] = 0.4 + Math.random() * 0.4;
        pColors[i * 3 + 2] = 1.0;
        
        pSpeeds[i] = 0.02 + Math.random() * 0.05;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({
        size: 0.15, vertexColors: true, transparent: true, opacity: 0.6
    }));
    scene.add(particles);

    // --- ROBOTIC ARM ---
    const armGroup = new THREE.Group();
    const base = new THREE.LineSegments(baseGeo, mainMaterial);
    armGroup.add(base);

    // Create segments with pivots for better animation
    const lowerArm = new THREE.Group();
    const lowerArmMesh = new THREE.LineSegments(segmentGeo, cyanMaterial);
    lowerArmMesh.position.y = 1; // Half length
    lowerArm.add(lowerArmMesh);
    lowerArm.position.y = 0.25; // On top of base
    armGroup.add(lowerArm);

    const upperArm = new THREE.Group();
    const upperArmMesh = new THREE.LineSegments(segmentGeo, cyanMaterial);
    upperArmMesh.position.y = 1;
    upperArm.add(upperArmMesh);
    upperArm.position.y = 2; // Length of lower arm
    lowerArmMesh.add(upperArm);

    const gripper = new THREE.LineSegments(gripperGeo, mainMaterial);
    gripper.position.y = 2; // Length of upper arm
    upperArmMesh.add(gripper);

    armGroup.position.set(20, -8, 20); // Corner placement
    scene.add(armGroup);

    // --- ROBOT CARS ---
    const robotCars = [];
    const wheelPositions = [
        [-0.8, -0.3, 0.4], [0.8, -0.3, 0.4], [-0.8, -0.3, -0.4], [0.8, -0.3, -0.4]
    ];

    // Car materials - greenish and sky bluish for first two cars, orange for others
    const greenMaterial = new THREE.LineBasicMaterial({ color: 0x4ade80, transparent: true, opacity: 0.8 });
    const blueMaterial = new THREE.LineBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.8 });

    // Helper to generate a random target on the grid
    const getRandomTarget = () => {
        return new THREE.Vector3(
            (Math.floor(Math.random() * 8) - 4) * 5, // Snap to 5-unit grid
            -9.5,
            (Math.floor(Math.random() * 8) - 4) * 5
        );
    };

    for (let i = 0; i < 4; i++) {
        const carGroup = new THREE.Group();
        // Use new colors for first two cars, original orange for the other two
        const carMaterial = i < 2 ? (i === 0 ? greenMaterial : blueMaterial) : mainMaterial;
        const carBody = new THREE.LineSegments(carBodyGeo, carMaterial);
        carGroup.add(carBody);

        const carWheels = [];
        wheelPositions.forEach(pos => {
            const wheel = new THREE.LineSegments(wheelGeo, wheelMaterial);
            wheel.position.set(pos[0], pos[1], pos[2]);
            wheel.rotation.z = Math.PI / 2;
            carGroup.add(wheel);
            carWheels.push(wheel);
        });

        // Initialize positions widely spread
        const startPos = getRandomTarget();
        carGroup.position.copy(startPos);

        // Physics/Movement Data
        carGroup.userData = {
            velocity: new THREE.Vector3(),
            speed: 0.02 + Math.random() * 0.03,
            target: getRandomTarget(),
            wheels: carWheels,
            state: 'moving' // moving, turning, waiting
        };

        scene.add(carGroup);
        robotCars.push(carGroup);
    }

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;
        const delta = clock.getDelta(); // Use delta for smooth movement regardless of framerate

        // 1. Animate Particles
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3 + 1] += Math.sin(time + positions[i * 3]) * 0.02; // Organic floating
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // 2. Animate Arm (Enhanced Robotic Movement)
        // Create dynamic targets for the arm to reach
        if (!armGroup.userData || !armGroup.userData.targetPos) {
            armGroup.userData = {
                targetPos: new THREE.Vector3(15, -6, 15),
                phase: 'scanning',
                phaseTime: 0,
                pickPos: new THREE.Vector3(15, -9, 15),
                placePos: new THREE.Vector3(25, -6, 25)
            };
        }

        const armData = armGroup.userData;
        armData.phaseTime += delta;

        // Update target based on phase
        let currentTarget = new THREE.Vector3(15, -6, 15); // Default fallback
        switch (armData.phase) {
            case 'scanning':
                // Scan around looking for work
                armData.targetPos.set(
                    20 + Math.sin(time * 0.3) * 8,
                    -6 + Math.sin(time * 0.5) * 2,
                    20 + Math.cos(time * 0.3) * 8
                );
                currentTarget.copy(armData.targetPos);
                if (armData.phaseTime > 3) {
                    armData.phase = 'reaching';
                    armData.phaseTime = 0;
                }
                break;
            case 'reaching':
                // Reach down to pick up
                armData.targetPos.copy(armData.pickPos);
                currentTarget.copy(armData.targetPos);
                if (armData.phaseTime > 1.5) {
                    armData.phase = 'grasping';
                    armData.phaseTime = 0;
                }
                break;
            case 'grasping':
                // Close gripper and lift
                armData.targetPos.set(15, -4, 15);
                currentTarget.copy(armData.targetPos);
                if (armData.phaseTime > 1) {
                    armData.phase = 'transporting';
                    armData.phaseTime = 0;
                }
                break;
            case 'transporting':
                // Move to place position
                armData.targetPos.copy(armData.placePos);
                currentTarget.copy(armData.targetPos);
                if (armData.phaseTime > 2) {
                    armData.phase = 'placing';
                    armData.phaseTime = 0;
                }
                break;
            case 'placing':
                // Lower down to place
                armData.targetPos.set(25, -8, 25);
                currentTarget.copy(armData.targetPos);
                if (armData.phaseTime > 1) {
                    armData.phase = 'scanning';
                    armData.phaseTime = 0;
                }
                break;
        }

        // Simple inverse kinematics for 3-joint arm
        const armBase = new THREE.Vector3().copy(armGroup.position);
        const targetVector = new THREE.Vector3().subVectors(currentTarget, armBase);

        // Base rotation to face target
        const baseAngle = Math.atan2(targetVector.x, targetVector.z);
        armGroup.rotation.y += (baseAngle - armGroup.rotation.y) * 0.02;

        // Calculate arm segment angles (2D IK in XZ plane)
        const targetDist = Math.sqrt(targetVector.x * targetVector.x + targetVector.z * targetVector.z);
        const targetHeight = targetVector.y;

        // Arm segment lengths (approximate based on geometry)
        const l1 = 2; // lower arm length
        const l2 = 2; // upper arm length

        // 2D inverse kinematics for shoulder and elbow
        if (targetDist > 0.1 && targetDist < l1 + l2) {
            // Distance from shoulder to target in XZ plane
            const r = targetDist;

            // Elbow angle (θ2) using law of cosines
            const cosElbow = (r * r + l1 * l1 - l2 * l2) / (2 * r * l1);
            const elbowAngle = Math.acos(Math.max(-1, Math.min(1, cosElbow)));

            // Shoulder angle (θ1) - angle to target
            const shoulderToTarget = Math.atan2(targetVector.z, targetVector.x);

            // Shoulder angle adjustment
            const cosShoulder = (l1 * l1 + r * r - l2 * l2) / (2 * l1 * r);
            const shoulderAngle = shoulderToTarget - Math.acos(Math.max(-1, Math.min(1, cosShoulder)));

            // Apply angles with smoothing (convert to local rotations)
            const currentLowerAngle = lowerArm.rotation.z;
            const currentUpperAngle = upperArm.rotation.z;

            // For proper IK, we need to set absolute angles, not incremental
            lowerArm.rotation.z = shoulderAngle;
            upperArm.rotation.z = elbowAngle - Math.PI; // Adjust for coordinate system
        }

        // Add some secondary motion for realism
        lowerArm.rotation.x = Math.sin(time * 1.5 + armData.phaseTime) * 0.05;
        upperArm.rotation.x = Math.sin(time * 2 + armData.phaseTime) * 0.03;

        // Animate gripper based on phase
        const gripperOpen = (armData.phase === 'scanning' || armData.phase === 'placing') ? 0.2 : 0;
        gripper.rotation.z += (gripperOpen - gripper.rotation.z) * 0.1;

        // Add subtle base movement
        armGroup.position.y = -8 + Math.sin(time * 0.8) * 0.1;

        // 3. Animate Cars
        robotCars.forEach(car => {
            const data = car.userData;
            const pos = car.position;
            const target = data.target;

            // Distance to target
            const dist = pos.distanceTo(target);

            // If we reached the target (or are very close), pick a new one
            if (dist < 1) {
                data.target = getRandomTarget();
                // Ensure new target isn't the same as current position
                while (data.target.distanceTo(pos) < 5) {
                    data.target = getRandomTarget();
                }
            }

            // --- MOVEMENT LOGIC (Steering) ---
            
            // Calculate direction vector to target
            const direction = new THREE.Vector3().subVectors(target, pos).normalize();
            
            // Calculate desired angle
            const targetRotation = Math.atan2(direction.x, direction.z); // Math.atan2(x, z) for Y-axis rotation

            // Smoothly rotate car to face target (Interpolation)
            // Determine shortest rotation path
            let rotDiff = targetRotation - car.rotation.y;
            // Normalize angle to -PI to PI
            while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
            while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
            
            car.rotation.y += rotDiff * 0.05; // Turn speed (lower is smoother)

            // Move forward based on current rotation (Tank controls style)
            const forwardDir = new THREE.Vector3(Math.sin(car.rotation.y), 0, Math.cos(car.rotation.y));
            
            // Collision Avoidance (Simple Repulsion)
            let repulsion = new THREE.Vector3();
            robotCars.forEach(otherCar => {
                if (car === otherCar) return;
                const d = car.position.distanceTo(otherCar.position);
                if (d < 4) { // Too close
                    const push = new THREE.Vector3().subVectors(car.position, otherCar.position).normalize();
                    repulsion.add(push.multiplyScalar(0.05)); // Push away strength
                }
            });

            // Apply movement
            car.position.add(forwardDir.multiplyScalar(data.speed));
            car.position.add(repulsion);

            // Wheel rotation
            data.wheels.forEach(w => w.rotation.x -= data.speed * 5);

            // Bobbing effect
            car.position.y = -9.5 + Math.sin(time * 5 + car.id) * 0.05;
        });

        // Camera Orbit (Subtle)
        camera.position.x = Math.sin(time * 0.1) * 25;
        camera.position.z = Math.cos(time * 0.1) * 25;
        camera.lookAt(0, -2, 0);

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}