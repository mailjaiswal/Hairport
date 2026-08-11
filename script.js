/* ==========================================================================
   HAIRPORT BY SANTINO - STICKY SECTION CARD STACKING & HORIZONTAL SLIDER
   Features: Single-Row Horizontal Services Slider + Side Arrow Controls + 
             Touch Swipe + Sticky Deck Stacking + Curtain Fade + 
             Scroll Progress Bar + Dynamic Ambient Vignette + Parallax Beams
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initHeroCarousel();
    initScrollReveal();
    initScrollOverlays();
    initStickyCardStacking();
    initGenderServiceTabs();
    initServicesSliderControls();
    init3DTiltEffect();
    initMagneticButtons();
    initCursorSpotlight();
    initClickParticleBurst();
    initRateCardLightbox();
    initBookingModal();
    initPolicyModals();
    initMobileNav();
    initNavScrollEffect();
});

/* --------------------------------------------------------------------------
   1. GOLD FLOATING PARTICLES CANVAS
   -------------------------------------------------------------------------- */
function initParticles() {
    const canvas = document.getElementById('gold-particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = canvas.parentElement.offsetWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight;
    
    window.addEventListener('resize', () => {
        if (!canvas.parentElement) return;
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    });

    const particles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            color: Math.random() > 0.5 ? 'rgba(244, 189, 115, ' : 'rgba(186, 137, 69, ',
            alpha: Math.random() * 0.6 + 0.2,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -Math.random() * 0.5 - 0.2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.y < 0) {
                p.y = height;
                p.x = Math.random() * width;
            }
            if (p.x < 0 || p.x > width) {
                p.vx *= -1;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ')';
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(244, 189, 115, 0.8)';
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* --------------------------------------------------------------------------
   2. HERO CAROUSEL WITH AUTOPLAY & PROGRESS BAR
   -------------------------------------------------------------------------- */
function initHeroCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const progressBar = document.querySelector('.carousel-progress-bar');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    if (!slides.length) return;

    let currentIndex = 0;
    const intervalTime = 6000;
    let timer = null;
    let progressInterval = null;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        resetProgress();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
    }

    function resetProgress() {
        if (!progressBar) return;
        clearInterval(progressInterval);
        progressBar.style.width = '0%';
        let start = Date.now();
        
        progressInterval = setInterval(() => {
            let elapsed = Date.now() - start;
            let percent = (elapsed / intervalTime) * 100;
            if (percent >= 100) {
                progressBar.style.width = '100%';
                clearInterval(progressInterval);
            } else {
                progressBar.style.width = percent + '%';
            }
        }, 50);
    }

    function startAutoplay() {
        stopAutoplay();
        resetProgress();
        timer = setInterval(nextSlide, intervalTime);
    }

    function stopAutoplay() {
        if (timer) clearInterval(timer);
        if (progressInterval) clearInterval(progressInterval);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });

    startAutoplay();
}

/* --------------------------------------------------------------------------
   3. SCROLL REVEAL OBSERVER
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-zoom-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. STICKY SECTION CARD STACKING & OVERLAPPING CURTAIN FADE
   -------------------------------------------------------------------------- */
function initStickyCardStacking() {
    const stackSections = document.querySelectorAll('.stack-section');
    if (!stackSections.length || window.innerWidth < 768) return;

    window.addEventListener('scroll', () => {
        const viewportHeight = window.innerHeight;

        stackSections.forEach((section, idx) => {
            const nextSection = stackSections[idx + 1];
            if (nextSection) {
                const nextRect = nextSection.getBoundingClientRect();
                
                if (nextRect.top <= viewportHeight && nextRect.top > 0) {
                    const overlapProgress = (viewportHeight - nextRect.top) / viewportHeight;
                    
                    const scale = 1 - (overlapProgress * 0.08); // 1.0 to 0.92
                    const opacity = 1 - (overlapProgress * 0.6); // 1.0 to 0.4

                    section.style.transform = `scale(${scale})`;
                    section.style.opacity = opacity;
                } else if (nextRect.top <= 0) {
                    section.style.transform = `scale(0.92)`;
                    section.style.opacity = `0.3`;
                } else {
                    section.style.transform = `scale(1)`;
                    section.style.opacity = `1`;
                }
            }
        });
    });
}

/* --------------------------------------------------------------------------
   5. SINGLE-ROW SERVICES SLIDER CONTROLS (ARROW BUTTONS)
   -------------------------------------------------------------------------- */
function initServicesSliderControls() {
    const prevBtn = document.getElementById('svc-scroll-prev');
    const nextBtn = document.getElementById('svc-scroll-next');

    function getActivePane() {
        return document.querySelector('.gender-tab-pane:not(.hidden)');
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const pane = getActivePane();
            if (pane) {
                pane.scrollBy({ left: -340, behavior: 'smooth' });
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const pane = getActivePane();
            if (pane) {
                pane.scrollBy({ left: 340, behavior: 'smooth' });
            }
        });
    }
}

/* --------------------------------------------------------------------------
   6. SCROLL OVERLAY INDICATORS
   -------------------------------------------------------------------------- */
function initScrollOverlays() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress-overlay';
    document.body.appendChild(progressBar);

    const vignette = document.createElement('div');
    vignette.id = 'scroll-ambient-vignette';
    document.body.appendChild(vignette);

    const lightBeams = document.createElement('div');
    lightBeams.id = 'parallax-light-beams';
    document.body.appendChild(lightBeams);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        progressBar.style.width = scrollPercent + '%';
        lightBeams.style.transform = `translateY(${scrollTop * 0.15}px)`;

        if (scrollPercent < 20) {
            vignette.style.background = 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(14, 14, 14, 0.6) 90%)';
        } else if (scrollPercent < 60) {
            vignette.style.background = 'radial-gradient(circle at 50% 50%, rgba(186, 137, 69, 0.05) 0%, rgba(14, 14, 14, 0.7) 90%)';
        } else {
            vignette.style.background = 'radial-gradient(circle at 50% 50%, rgba(244, 189, 115, 0.06) 0%, rgba(14, 14, 14, 0.8) 95%)';
        }
    });
}

/* --------------------------------------------------------------------------
   7. MEN, WOMEN, & KIDS SERVICE TAB SWITCHER
   -------------------------------------------------------------------------- */
function initGenderServiceTabs() {
    const tabBtns = document.querySelectorAll('.gender-tab-btn');
    const tabPanes = document.querySelectorAll('.gender-tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetGender = btn.getAttribute('data-gender');

            tabBtns.forEach(b => {
                b.classList.remove('bg-burnished-copper', 'text-obsidian-deep', 'font-bold');
                b.classList.add('text-on-surface-variant', 'border-burnished-copper/30', 'bg-surface');
            });
            btn.classList.add('bg-burnished-copper', 'text-obsidian-deep', 'font-bold');
            btn.classList.remove('text-on-surface-variant', 'border-burnished-copper/30', 'bg-surface');

            tabPanes.forEach(pane => {
                if (pane.id === `services-${targetGender}`) {
                    pane.classList.remove('hidden');
                    pane.scrollLeft = 0; // reset horizontal scroll
                } else {
                    pane.classList.add('hidden');
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   8. 3D TILT HOVER MICRO-INTERACTION FOR LUXURY CARDS
   -------------------------------------------------------------------------- */
function init3DTiltEffect() {
    const tiltCards = document.querySelectorAll('.glass-panel-hover');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });
}

/* --------------------------------------------------------------------------
   9. MAGNETIC BUTTON PULL MICRO-INTERACTION
   -------------------------------------------------------------------------- */
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-gold, .btn-outline-gold');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.03)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px) scale(1)`;
        });
    });
}

/* --------------------------------------------------------------------------
   10. CURSOR SPOTLIGHT TRACKING BACKDROP
   -------------------------------------------------------------------------- */
function initCursorSpotlight() {
    const spotlight = document.createElement('div');
    spotlight.id = 'cursor-spotlight';
    document.body.appendChild(spotlight);

    window.addEventListener('mousemove', (e) => {
        spotlight.style.left = e.clientX + 'px';
        spotlight.style.top = e.clientY + 'px';
    });
}

/* --------------------------------------------------------------------------
   11. MICRO-BURST GOLD PARTICLES ON BUTTON CLICK
   -------------------------------------------------------------------------- */
function initClickParticleBurst() {
    document.querySelectorAll('.btn-gold, .btn-outline-gold').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const rect = btn.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            for (let i = 0; i < 12; i++) {
                const particle = document.createElement('span');
                particle.className = 'click-gold-particle';
                
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 40 + 10;
                const destX = clickX + Math.cos(angle) * distance;
                const destY = clickY + Math.sin(angle) * distance;

                particle.style.left = clickX + 'px';
                particle.style.top = clickY + 'px';
                particle.style.position = 'absolute';
                particle.style.width = '4px';
                particle.style.height = '4px';
                particle.style.borderRadius = '50%';
                particle.style.background = '#F4BD73';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '99';
                particle.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

                btn.appendChild(particle);

                setTimeout(() => {
                    particle.style.transform = `translate(${destX - clickX}px, ${destY - clickY}px) scale(0)`;
                    particle.style.opacity = '0';
                }, 10);

                setTimeout(() => particle.remove(), 600);
            }
        });
    });
}

/* --------------------------------------------------------------------------
   12. RATE CARD LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
function initRateCardLightbox() {
    const modal = document.getElementById('rate-card-modal');
    const modalImg = document.getElementById('rate-card-img');
    const closeBtn = document.getElementById('close-rate-modal');
    const prevBtn = document.getElementById('rate-prev');
    const nextBtn = document.getElementById('rate-next');
    const openBtns = document.querySelectorAll('.open-rate-card');

    const rateCards = ['assets/rate1.jpg', 'assets/rate2.jpg', 'assets/rate3.jpg'];
    let currentIndex = 0;

    function openModal(index = 0) {
        currentIndex = index;
        modalImg.src = rateCards[currentIndex];
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    openBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const page = parseInt(btn.getAttribute('data-page') || 0);
            openModal(page);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (prevBtn) prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + rateCards.length) % rateCards.length;
        modalImg.src = rateCards[currentIndex];
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % rateCards.length;
        modalImg.src = rateCards[currentIndex];
    });

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
}

/* --------------------------------------------------------------------------
   13. 3-STEP BOOKING MODAL WITH BOARDING PASS CONFIRMATION
   -------------------------------------------------------------------------- */
function initBookingModal() {
    const modal = document.getElementById('booking-modal');
    const openBtns = document.querySelectorAll('.open-booking-modal');
    const closeBtn = document.getElementById('close-booking-modal');
    const form = document.getElementById('booking-form');

    const step1 = document.getElementById('booking-step-1');
    const step2 = document.getElementById('booking-step-2');
    const nextStep1 = document.getElementById('next-step-1');
    const prevStep2 = document.getElementById('prev-step-2');
    const passCard = document.getElementById('boarding-pass-result');

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (passCard) passCard.classList.add('hidden');
        if (step1) step1.classList.remove('hidden');
        if (step2) step2.classList.add('hidden');
    }

    openBtns.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    }));

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    if (nextStep1) {
        nextStep1.addEventListener('click', () => {
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
        });
    }

    if (prevStep2) {
        prevStep2.addEventListener('click', () => {
            step2.classList.add('hidden');
            step1.classList.remove('hidden');
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('bk-name').value;
            const service = document.getElementById('bk-service').value;
            const date = document.getElementById('bk-date').value;
            const time = document.getElementById('bk-time').value;

            document.getElementById('pass-passenger-name').innerText = name.toUpperCase();
            document.getElementById('pass-service-name').innerText = service;
            document.getElementById('pass-date-time').innerText = `${date} | ${time}`;
            document.getElementById('pass-pnr').innerText = 'HP-' + Math.floor(100000 + Math.random() * 900000);

            step2.classList.add('hidden');
            passCard.classList.remove('hidden');
        });
    }
}

/* --------------------------------------------------------------------------
   14. TERMS & PRIVACY POLICY MODALS
   -------------------------------------------------------------------------- */
function initPolicyModals() {
    const termsModal = document.getElementById('terms-modal');
    const privacyModal = document.getElementById('privacy-modal');

    const openTermsBtns = document.querySelectorAll('.open-terms-modal');
    const openPrivacyBtns = document.querySelectorAll('.open-privacy-modal');

    const closeTermsBtn = document.getElementById('close-terms-modal');
    const closePrivacyBtn = document.getElementById('close-privacy-modal');

    openTermsBtns.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        termsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }));

    openPrivacyBtns.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        privacyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }));

    if (closeTermsBtn) closeTermsBtn.addEventListener('click', () => {
        termsModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    if (closePrivacyBtn) closePrivacyBtn.addEventListener('click', () => {
        privacyModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    [termsModal, privacyModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    });
}

/* --------------------------------------------------------------------------
   15. MOBILE DRAWER MENU & NAVBAR SCROLL
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const closeBtn = document.getElementById('close-mobile-drawer');
    const links = document.querySelectorAll('.mobile-nav-link');

    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', () => {
        drawer.classList.remove('translate-x-full');
    });

    if (closeBtn) closeBtn.addEventListener('click', () => {
        drawer.classList.add('translate-x-full');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            drawer.classList.add('translate-x-full');
        });
    });
}

function initNavScrollEffect() {
    const nav = document.getElementById('main-navbar');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('bg-obsidian/95', 'border-b', 'border-burnished-copper/40', 'py-3', 'shadow-2xl');
            nav.classList.remove('py-5', 'border-transparent');
        } else {
            nav.classList.remove('bg-obsidian/95', 'border-b', 'border-burnished-copper/40', 'py-3', 'shadow-2xl');
            nav.classList.add('py-5', 'border-transparent');
        }
    });
}
