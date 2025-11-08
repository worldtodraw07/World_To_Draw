// Modern scroll animations and interactions
document.addEventListener('DOMContentLoaded', () => {
    // Scroll-triggered animation observer
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        child.style.animationDelay = `${index * 0.1}s`;
                        child.classList.add('animate-in');
                    });
                }
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '-50px'
    });

    // Parallax scroll effect
    const parallaxObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const speed = entry.target.dataset.parallaxSpeed || 0.2;
                const scroll = window.pageYOffset - entry.target.offsetTop;
                entry.target.style.transform = `translateY(${scroll * speed}px)`;
            }
        });
    }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] });

    // Enhanced gallery image interactions
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('gallery-visible');
                
                // Add tilt effect on mousemove
                entry.target.addEventListener('mousemove', (e) => {
                    if (!entry.target.classList.contains('gallery-visible')) return;
                    
                    const rect = entry.target.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;
                    
                    entry.target.style.transform = 
                        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                });
                
                // Reset transform on mouseleave
                entry.target.addEventListener('mouseleave', () => {
                    entry.target.style.transform = '';
                });
            }
        });
    }, {
        threshold: 0.2
    });

    // Initialize animations for elements
    document.querySelectorAll('.scroll-animate').forEach(el => scrollObserver.observe(el));
    document.querySelectorAll('.parallax').forEach(el => parallaxObserver.observe(el));
    document.querySelectorAll('.gallery-item').forEach(el => galleryObserver.observe(el));

    // Smooth scroll to section
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});