/**
 * Hairport Salon by Santinoo - Interactive Logic
 * Mobile-First, Touch-Friendly & Accessible
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Mobile Menu Drawer Navigation ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMobileDrawerBtn = document.getElementById('close-mobile-drawer');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function openDrawer() {
        if (mobileDrawer) {
            mobileDrawer.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeDrawer() {
        if (mobileDrawer) {
            mobileDrawer.classList.add('translate-x-full');
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
    if (closeMobileDrawerBtn) closeMobileDrawerBtn.addEventListener('click', closeDrawer);
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // --- 2. Hero Background Carousel / Slider ---
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroPrevBtn = document.getElementById('hero-prev-btn');
    const heroNextBtn = document.getElementById('hero-next-btn');
    let currentSlide = 0;
    let heroInterval = null;

    function showSlide(index) {
        if (!heroSlides.length) return;
        heroSlides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.remove('opacity-0', 'pointer-events-none');
                slide.classList.add('opacity-100');
            } else {
                slide.classList.remove('opacity-100');
                slide.classList.add('opacity-0', 'pointer-events-none');
            }
        });
        currentSlide = index;
    }

    function nextHeroSlide() {
        let nextIndex = (currentSlide + 1) % heroSlides.length;
        showSlide(nextIndex);
    }

    function prevHeroSlide() {
        let prevIndex = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
        showSlide(prevIndex);
    }

    if (heroNextBtn) heroNextBtn.addEventListener('click', () => {
        nextHeroSlide();
        resetHeroAutoPlay();
    });
    if (heroPrevBtn) heroPrevBtn.addEventListener('click', () => {
        prevHeroSlide();
        resetHeroAutoPlay();
    });

    function startHeroAutoPlay() {
        heroInterval = setInterval(nextHeroSlide, 5000);
    }

    function resetHeroAutoPlay() {
        clearInterval(heroInterval);
        startHeroAutoPlay();
    }

    if (heroSlides.length > 1) {
        startHeroAutoPlay();
    }

    // --- 3. Services Gender Tabs & Horizontal Carousel Scroll ---
    const genderTabs = document.querySelectorAll('.gender-tab-btn');
    const tabPanes = document.querySelectorAll('.service-tab-pane');
    const svcScrollPrev = document.getElementById('svc-scroll-prev');
    const svcScrollNext = document.getElementById('svc-scroll-next');

    genderTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetGender = btn.getAttribute('data-gender');

            // Tab button active state
            genderTabs.forEach(b => {
                b.classList.remove('bg-primary', 'text-on-primary', 'border-primary', 'font-bold');
                b.classList.add('bg-surface-container-lowest', 'text-on-surface-variant', 'border-primary/20');
            });
            btn.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant', 'border-primary/20');
            btn.classList.add('bg-primary', 'text-on-primary', 'border-primary', 'font-bold');

            // Show active tab pane
            tabPanes.forEach(pane => {
                if (pane.id === `services-${targetGender}`) {
                    pane.classList.remove('hidden');
                    pane.classList.add('flex');
                } else {
                    pane.classList.add('hidden');
                    pane.classList.remove('flex');
                }
            });
        });
    });

    function getActiveServiceContainer() {
        return document.querySelector('.service-tab-pane:not(.hidden)');
    }

    if (svcScrollPrev) {
        svcScrollPrev.addEventListener('click', () => {
            const container = getActiveServiceContainer();
            if (container) {
                container.scrollBy({ left: -320, behavior: 'smooth' });
            }
        });
    }

    if (svcScrollNext) {
        svcScrollNext.addEventListener('click', () => {
            const container = getActiveServiceContainer();
            if (container) {
                container.scrollBy({ left: 320, behavior: 'smooth' });
            }
        });
    }

    // --- 4. Interactive 2-Step Booking Modal & Beauty Boarding Pass ---
    const bookingModal = document.getElementById('booking-modal');
    const openBookingBtns = document.querySelectorAll('.open-booking-modal');
    const closeBookingBtn = document.getElementById('close-booking-modal');
    const bookingStep1 = document.getElementById('booking-step-1');
    const bookingStep2 = document.getElementById('booking-step-2');
    const boardingPassResult = document.getElementById('boarding-pass-result');
    const nextStep1Btn = document.getElementById('next-step-1');
    const prevStep2Btn = document.getElementById('prev-step-2');
    const bookingForm = document.getElementById('booking-form');
    const bkServiceSelect = document.getElementById('bk-service');
    const bkDateInput = document.getElementById('bk-date');

    // Pre-fill today's / tomorrow's date for appointment selector
    if (bkDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        bkDateInput.value = tomorrow.toISOString().split('T')[0];
        bkDateInput.min = new Date().toISOString().split('T')[0];
    }

    function openBooking(preselectedService = '') {
        if (bookingModal) {
            bookingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (preselectedService && bkServiceSelect) {
                // If service matches options, select it, otherwise append or set value
                let found = false;
                for (let i = 0; i < bkServiceSelect.options.length; i++) {
                    if (bkServiceSelect.options[i].text.toLowerCase().includes(preselectedService.toLowerCase())) {
                        bkServiceSelect.selectedIndex = i;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    const opt = new Option(preselectedService, preselectedService, true, true);
                    bkServiceSelect.add(opt);
                }
            }
            // Reset modal state to step 1
            if (bookingStep1) bookingStep1.classList.remove('hidden');
            if (bookingStep2) bookingStep2.classList.add('hidden');
            if (boardingPassResult) boardingPassResult.classList.add('hidden');
        }
    }

    function closeBooking() {
        if (bookingModal) {
            bookingModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    openBookingBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceName = btn.getAttribute('data-service') || '';
            openBooking(serviceName);
        });
    });

    if (closeBookingBtn) closeBookingBtn.addEventListener('click', closeBooking);
    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) closeBooking();
        });
    }

    if (nextStep1Btn) {
        nextStep1Btn.addEventListener('click', () => {
            if (bookingStep1) bookingStep1.classList.add('hidden');
            if (bookingStep2) bookingStep2.classList.remove('hidden');
        });
    }

    if (prevStep2Btn) {
        prevStep2Btn.addEventListener('click', () => {
            if (bookingStep2) bookingStep2.classList.add('hidden');
            if (bookingStep1) bookingStep1.classList.remove('hidden');
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('bk-name')?.value || 'Valued Guest';
            const service = document.getElementById('bk-service')?.value || 'Bespoke Haircut & Styling';
            const date = document.getElementById('bk-date')?.value || new Date().toISOString().split('T')[0];
            const time = document.getElementById('bk-time')?.value || '10:30 AM';

            // Generate Random PNR Flight Code
            const randomCode = 'HP-' + Math.floor(100000 + Math.random() * 900000);

            // Populate Boarding Pass
            const passPassenger = document.getElementById('pass-passenger-name');
            const passService = document.getElementById('pass-service-name');
            const passDateTime = document.getElementById('pass-date-time');
            const passPnr = document.getElementById('pass-pnr');

            if (passPassenger) passPassenger.textContent = name.toUpperCase();
            if (passService) passService.textContent = service;
            if (passDateTime) passDateTime.textContent = `${date} | ${time}`;
            if (passPnr) passPnr.textContent = randomCode;

            // Show Boarding Pass Result
            if (bookingStep2) bookingStep2.classList.add('hidden');
            if (boardingPassResult) boardingPassResult.classList.remove('hidden');
        });
    }

    // --- 6. Terms & Privacy Modals ---
    const termsModal = document.getElementById('terms-modal');
    const privacyModal = document.getElementById('privacy-modal');
    const openTermsBtns = document.querySelectorAll('.open-terms-modal');
    const openPrivacyBtns = document.querySelectorAll('.open-privacy-modal');
    const closeTermsBtn = document.getElementById('close-terms-modal');
    const closePrivacyBtn = document.getElementById('close-privacy-modal');

    openTermsBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (termsModal) {
                termsModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    openPrivacyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (privacyModal) {
                privacyModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (closeTermsBtn && termsModal) {
        closeTermsBtn.addEventListener('click', () => {
            termsModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    if (closePrivacyBtn && privacyModal) {
        closePrivacyBtn.addEventListener('click', () => {
            privacyModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Keyboard ESC listener for all modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeBooking();
            if (termsModal) termsModal.classList.remove('active');
            if (privacyModal) privacyModal.classList.remove('active');
            closeDrawer();
            document.body.style.overflow = '';
        }
    });
});
