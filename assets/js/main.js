document.addEventListener('DOMContentLoaded', () => {
    const year = document.getElementById('year');
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length && !prefersReducedMotion) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('is-visible'));
    }

    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        const setProgress = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY;
            const width = scrollable > 0 ? (scrolled / scrollable) * 100 : 0;
            progressBar.style.width = `${Math.min(Math.max(width, 0), 100)}%`;
        };

        window.addEventListener('scroll', setProgress, { passive: true });
        window.addEventListener('resize', setProgress);
        setProgress();
    }

    const navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
    const sectionDots = Array.from(document.querySelectorAll('.section-nav a[href^="#"]'));
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;

    if (navLinks.length) {
        navLinks[0].classList.add('is-active');
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                const targetId = link.getAttribute('href');
                if (!targetId || targetId === '#' || targetId.startsWith('http')) {
                    return;
                }
                const target = document.querySelector(targetId);
                if (!target) {
                    return;
                }
                event.preventDefault();
                navLinks.forEach(item => item.classList.toggle('is-active', item === link));
                if (prefersReducedMotion) {
                    target.scrollIntoView();
                } else {
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            });
        });
    }

    if (sectionDots.length) {
        sectionDots[0].classList.add('is-active');
        sectionDots.forEach(link => {
            link.addEventListener('click', (event) => {
                const targetId = link.getAttribute('href');
                if (!targetId || targetId === '#' || targetId.startsWith('http')) {
                    return;
                }
                const target = document.querySelector(targetId);
                if (!target) {
                    return;
                }
                event.preventDefault();
                if (prefersReducedMotion) {
                    target.scrollIntoView();
                } else {
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            });
        });
    }

    const sections = document.querySelectorAll('main section[id]');
    if (sections.length && (navLinks.length || sectionDots.length)) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = `#${entry.target.id}`;
                    const toggleActive = (links) => {
                        links.forEach(link => {
                            const isMatch = link.getAttribute('href') === activeId;
                            link.classList.toggle('is-active', isMatch);
                        });
                    };
                    if (navLinks.length) {
                        toggleActive(navLinks);
                    }
                    if (sectionDots.length) {
                        toggleActive(sectionDots);
                    }
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-30% 0px -40% 0px'
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    const floatingIcon = document.querySelector('.floating-icon');
    if (floatingIcon && !prefersReducedMotion) {
        const animateIcon = () => {
            const offset = Math.sin(window.scrollY * 0.015) * 12;
            const rotation = window.scrollY * 0.1;
            floatingIcon.style.transform = `translate3d(0, ${offset}px, 0) rotate(${rotation}deg)`;
        };
        window.addEventListener('scroll', animateIcon, { passive: true });
        animateIcon();
    }

    if (!prefersReducedMotion) {
        const hero = document.getElementById('hero');
        const parallaxElements = hero ? hero.querySelectorAll('[data-parallax]') : null;
        if (hero && parallaxElements && parallaxElements.length) {
            const handleParallax = (event) => {
                const rect = hero.getBoundingClientRect();
                const x = event.clientX - (rect.left + rect.width / 2);
                const y = event.clientY - (rect.top + rect.height / 2);
                parallaxElements.forEach((el) => {
                    const factor = parseFloat(el.getAttribute('data-parallax') || '0.25');
                    const translateX = (x / rect.width) * factor * -150;
                    const translateY = (y / rect.height) * factor * -150;
                    el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
                });
            };
            hero.addEventListener('pointermove', handleParallax);
            hero.addEventListener('pointerleave', () => {
                parallaxElements.forEach((el) => {
                    el.style.transform = '';
                });
            });
        }
    }

    const customCursor = document.querySelector('.custom-cursor');
    const canUseCustomCursor = customCursor && window.matchMedia('(pointer: fine)').matches;
    if (canUseCustomCursor) {
        let cursorX = 0;
        let cursorY = 0;
        const updateCursorPosition = (event) => {
            cursorX = event.clientX;
            cursorY = event.clientY;
            const scale = customCursor.classList.contains('is-clicked') ? 0.85 : 1;
            customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(${scale})`;
            if (!customCursor.classList.contains('is-visible')) {
                customCursor.classList.add('is-visible');
            }
        };

        window.addEventListener('mousemove', updateCursorPosition, { passive: true });
        window.addEventListener('mouseleave', () => customCursor.classList.remove('is-visible'));
        window.addEventListener('mouseenter', () => customCursor.classList.add('is-visible'));
        window.addEventListener('mousedown', () => {
            customCursor.classList.add('is-clicked');
            customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(0.85)`;
        });
        window.addEventListener('mouseup', () => {
            customCursor.classList.remove('is-clicked');
            customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(1)`;
        });

        const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .gallery-item, .section-nav a');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => customCursor.classList.add('is-hovering'));
            element.addEventListener('mouseleave', () => customCursor.classList.remove('is-hovering'));
        });
    }

    if (!prefersReducedMotion) {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        const maxTilt = 18;

        tiltElements.forEach(element => {
            element.addEventListener('pointermove', (event) => {
                const rect = element.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const rotateY = ((x / rect.width) - 0.5) * (maxTilt * 2);
                const rotateX = ((y / rect.height) - 0.5) * (maxTilt * -2);
                element.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`;
                element.classList.add('is-tilting');
            });

            element.addEventListener('pointerleave', () => {
                element.style.transform = '';
                element.classList.remove('is-tilting');
            });
        });

        const magneticTargets = document.querySelectorAll('[data-magnetic="true"]');
        magneticTargets.forEach(target => {
            const strength = 40;
            target.addEventListener('pointermove', (event) => {
                const rect = target.getBoundingClientRect();
                const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
                const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * strength;
                target.style.setProperty('--magnet-x', `${offsetX}px`);
                target.style.setProperty('--magnet-y', `${offsetY}px`);
            });
            target.addEventListener('pointerleave', () => {
                target.style.removeProperty('--magnet-x');
                target.style.removeProperty('--magnet-y');
            });
        });
    }

    if (!prefersReducedMotion) {
        const floatElements = document.querySelectorAll('[data-float]');
        if (floatElements.length) {
            const updateFloating = () => {
                const scrollY = window.pageYOffset || window.scrollY;
                const windowHeight = window.innerHeight;
                
                floatElements.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    const elementTop = rect.top + scrollY;
                    const elementCenter = elementTop + (rect.height / 2);
                    const viewportCenter = scrollY + (windowHeight / 2);
                    
                    const distanceFromCenter = elementCenter - viewportCenter;
                    const floatFactor = parseFloat(element.getAttribute('data-float') || '0.2');
                    const maxDistance = windowHeight * 1.5;
                    
                    if (Math.abs(distanceFromCenter) < maxDistance) {
                        const normalizedDistance = distanceFromCenter / maxDistance;
                        const floatOffset = normalizedDistance * floatFactor * 100;
                        element.style.setProperty('--float-y', `${floatOffset}px`);
                        element.classList.add('is-floating');
                    } else {
                        element.style.setProperty('--float-y', '0px');
                        element.classList.remove('is-floating');
                    }
                });
            };

            let ticking = false;
            const handleScroll = () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateFloating();
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
            window.addEventListener('resize', updateFloating);
            updateFloating();

            const floatObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateFloating();
                    }
                });
            }, {
                threshold: 0,
                rootMargin: '200px 0px 200px 0px'
            });

            floatElements.forEach(el => floatObserver.observe(el));
        }
    }

    const modal = document.getElementById('lightbox');
    const galleryNodes = document.querySelectorAll('.gallery-item[data-full]');
    if (modal && galleryNodes.length) {
        const modalImage = modal.querySelector('#lightbox-image');
        const modalCaption = modal.querySelector('#lightbox-caption');
        const modalClose = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');
        const prevBtn = modal.querySelector('.modal-prev');
        const nextBtn = modal.querySelector('.modal-next');
        const pip = modal.querySelector('#lightbox-pip');
        const pipImage = modal.querySelector('#lightbox-pip-image');

        const gallery = Array.from(galleryNodes).map(node => ({
            src: node.getAttribute('data-full'),
            caption: node.querySelector('figcaption')?.textContent?.trim() || 'Charcoal artwork'
        }));

        let currentIndex = -1;
        let pointerDown = false;
        let startX = 0;
        let lastTranslate = 0;

        const preload = (src) => { if (!src) return; const i = new Image(); i.src = src; };

        const updatePip = (index) => {
            if (!pipImage) return;
            const nextIndex = (index + 1) % gallery.length;
            pipImage.src = gallery[nextIndex].src;
        };

        const setImage = (index, {instant = false} = {}) => {
            if (index < 0 || index >= gallery.length) return;
            if (!modalImage) return;

            const item = gallery[index];
            if (!instant) {
                modalImage.classList.add('fade-out');
                setTimeout(() => {
                    modalImage.src = item.src;
                    modalImage.alt = item.caption || 'Charcoal artwork';
                    if (modalCaption) modalCaption.textContent = item.caption || '';
                    modalImage.classList.remove('fade-out');
                }, 220);
            } else {
                modalImage.src = item.src;
                modalImage.alt = item.caption || 'Charcoal artwork';
                if (modalCaption) modalCaption.textContent = item.caption || '';
            }

            updatePip(index);
            preload(gallery[(index + 1) % gallery.length].src);
            preload(gallery[(index - 1 + gallery.length) % gallery.length].src);
        };

        const openAt = (index) => {
            currentIndex = index;
            modal.setAttribute('data-visible', 'true');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            setImage(index, {instant: true});
            // ensure pip is visible
            if (pip) pip.style.display = 'block';
        };

        const closeModalEnhanced = () => {
            modal.removeAttribute('data-visible');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (modalImage) {
                modalImage.src = '';
                modalImage.alt = '';
            }
            if (modalCaption) modalCaption.textContent = '';
            if (pip) pip.style.display = 'none';
            currentIndex = -1;
        };

        const showNext = () => {
            if (gallery.length <= 1) return;
            currentIndex = (currentIndex + 1) % gallery.length;
            setImage(currentIndex);
        };

        const showPrev = () => {
            if (gallery.length <= 1) return;
            currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
            setImage(currentIndex);
        };

        galleryNodes.forEach((node, i) => {
            node.addEventListener('click', () => openAt(i));
        });

        modalClose?.addEventListener('click', closeModalEnhanced);
        backdrop?.addEventListener('click', closeModalEnhanced);
        prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
        nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

        // keyboard navigation
        document.addEventListener('keydown', (event) => {
            if (modal.getAttribute('data-visible') !== 'true') return;
            if (event.key === 'Escape') {
                closeModalEnhanced();
            } else if (event.key === 'ArrowRight') {
                showNext();
            } else if (event.key === 'ArrowLeft') {
                showPrev();
            }
        });

        // pointer swipe/drag support on the image
        if (modalImage) {
            modalImage.addEventListener('pointerdown', (e) => {
                pointerDown = true;
                startX = e.clientX;
                lastTranslate = 0;
                modal.classList.add('is-dragging');
                modalImage.setPointerCapture(e.pointerId);
            });

            modalImage.addEventListener('pointermove', (e) => {
                if (!pointerDown) return;
                const dx = e.clientX - startX;
                lastTranslate = dx;
                modalImage.style.transform = `translateX(${dx}px) scale(${1 - Math.min(Math.abs(dx) / 2000, 0.03)})`;
                modalImage.style.transition = 'none';
            });

            const onPointerUp = (e) => {
                if (!pointerDown) return;
                pointerDown = false;
                modal.classList.remove('is-dragging');
                modalImage.releasePointerCapture?.(e.pointerId);
                modalImage.style.transition = '';
                modalImage.style.transform = '';
                const threshold = 80;
                if (lastTranslate <= -threshold) {
                    showNext();
                } else if (lastTranslate >= threshold) {
                    showPrev();
                }
                lastTranslate = 0;
            };

            modalImage.addEventListener('pointerup', onPointerUp);
            modalImage.addEventListener('pointercancel', onPointerUp);
            modalImage.addEventListener('pointerleave', (e) => {
                // if pointer leaves while down, treat as up
                if (pointerDown) onPointerUp(e);
            });
        }
    }

    /* Background logo parallax behavior (keeps logo decorative in background while scrolling) */
    const logoBg = document.querySelector('.site-logo-bg');
    if (logoBg) {
        if (prefersReducedMotion) {
            // keep static and subtle for accessibility
            logoBg.style.willChange = 'auto';
            logoBg.style.transition = 'opacity 300ms linear';
        } else {
            let tickingLogo = false;
            const maxTranslate = 200; // px cap
            const updateLogo = () => {
                const scrollY = window.scrollY || window.pageYOffset;
                // gentle parallax effect: move at ~15% of scroll, capped
                const translate = Math.min(scrollY * 0.15, maxTranslate);
                // slight scale down as we scroll for depth
                const scale = 1 - Math.min(scrollY / 4000, 0.12);
                logoBg.style.transform = `translate3d(-50%, ${translate}px, 0) scale(${scale})`;
                tickingLogo = false;
            };

            window.addEventListener('scroll', () => {
                if (!tickingLogo) {
                    window.requestAnimationFrame(updateLogo);
                    tickingLogo = true;
                }
            }, { passive: true });
            window.addEventListener('resize', updateLogo);
            updateLogo();
        }
    }
});

