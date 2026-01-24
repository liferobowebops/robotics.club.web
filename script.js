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
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
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
// initCursorGlow();
