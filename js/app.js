document.addEventListener('DOMContentLoaded', () => {
    // Typewriter Effect
    const textElement = document.getElementById('typewriter');
    const role = "Desenvolvedor júnior";
    let index = 0;

    function type() {
        if (index < role.length) {
            textElement.textContent += role.charAt(index);
            index++;
            setTimeout(type, 100);
        } else {
            // Blinking cursor effect manually if needed, or CSS animation
            textElement.style.borderRight = "none";
        }
    }

    // Start typing after a short delay (aligned with hero animations)
    setTimeout(type, 1500);

    // Smooth Scroll for anchor links (safeguard for older browsers if css scroll-behavior fails)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Console Easter Egg
    console.log(
        "%c Hello, Friend! ",
        "background: #1e1e1e; color: #569cd6; font-size: 24px; border: 1px solid #569cd6; padding: 10px; border-radius: 5px;"
    );
    console.log("Looking for the source code? It's all vanilla.");

    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once visible (optional, but good for one-time reveal)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to observe
    const scrollElements = document.querySelectorAll('.section-title, .stack-item, .project-card, .contact-section');

    // Add staggered delay to stack items
    let stackDelay = 0;
    document.querySelectorAll('.stack-item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 50}ms`; // 50ms stagger
    });

    // Check if on mobile to possibly disable stagger or change logic, but keeping simple for now

    // Stagger delay for project cards
    document.querySelectorAll('.project-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 150}ms`;
    });

    scrollElements.forEach(el => observer.observe(el));

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Project Card Glow Effect (kept for hover state before expansion)
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (card.classList.contains('expanded')) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        // Expansion Logic
        card.addEventListener('click', (e) => {
            // Prevent expanding if clicking a link or close button directly
            if (e.target.tagName === 'A' || e.target.closest('a') || e.target.classList.contains('close-btn')) return;

            if (!card.classList.contains('expanded')) {
                openCard(card);
            }
        });

        const closeBtn = card.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeCard(card);
            });
        }
    });

    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop');
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', () => {
        const expandedCard = document.querySelector('.project-card.expanded');
        if (expandedCard) closeCard(expandedCard);
    });

    function openCard(card) {
        card.classList.add('expanded');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCard(card) {
        card.classList.remove('expanded');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }
});
