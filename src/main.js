/**
 * Defibrilatoare în Școli - Main JavaScript
 * Author: Landing Page System
 * Description: Interactive functionality for the defibrillators in schools project
 */

class DefibrillatorLanding {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.animatedElements = document.querySelectorAll('.animate-on-scroll');
        this.navLinks = document.querySelectorAll('a[href^="#"]');
        this.observer = null;
        this.isScrolling = false;
        this.constants = null;

        this.init();
    }

    /**
     * Initialize all functionality
     */
    async init() {
        // Load constants first
        await this.loadConstants();

        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupAllFeatures();
            });
        } else {
            this.setupAllFeatures();
        }
    }

    /**
     * Load constants from JSON file
     */
    async loadConstants() {
        try {
            const response = await fetch('./constants/constants.json');
            this.constants = await response.json();
            this.updateContactInfo();
        } catch (error) {
            console.error('Failed to load constants:', error);
            // Fallback values
            this.constants = {
                contact: {
                    email: "contact@defibrilatoareinscoli.ro",
                    phone: "+40751234567",
                    phoneDisplay: "0751 234 567"
                }
            };
            this.updateContactInfo();
        }
    }

    /**
     * Update contact information in HTML
     */
    updateContactInfo() {
        if (!this.constants) return;

        const { email, phone, phoneDisplay } = this.constants.contact;

        // Update CTA buttons
        const donateBtn = document.getElementById('donate-btn');
        const contactBtn = document.getElementById('contact-btn');
        const footerEmail = document.getElementById('footer-email');

        if (donateBtn) {
            donateBtn.href = `mailto:${email}`;
        }

        if (contactBtn) {
            contactBtn.href = `tel:${phone}`;
            contactBtn.innerHTML = `<i class="fas fa-phone"></i> ${phoneDisplay}`;
        }

        if (footerEmail) {
            footerEmail.href = `mailto:${email}`;
            footerEmail.textContent = 'Email';
        }
    }

    /**
     * Setup all features
     */
    setupAllFeatures() {
        this.setupScrollEffects();
        this.setupSmoothScrolling();
        this.setupScrollAnimations();
        this.setupStaggeredAnimations();
        this.setupPerformanceOptimizations();
    }

    /**
     * Setup navbar scroll effects with performance optimization
     */
    setupScrollEffects() {
        if (!this.navbar) return;

        let ticking = false;

        const updateNavbar = () => {
            if (!this.navbar) return;

            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Setup smooth scrolling for navigation links
     */
    setupSmoothScrolling() {
        this.navLinks.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = anchor.getAttribute('href');

                if (!targetId) return;

                const target = document.querySelector(targetId);

                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Update URL hash without jumping
                    history.pushState(null, '', targetId);
                }
            });
        });
    }

    /**
     * Setup scroll-triggered animations using Intersection Observer
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');

                    // Unobserve element after animation to improve performance
                    if (this.observer) {
                        this.observer.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);

        this.animatedElements.forEach(element => {
            if (this.observer) {
                this.observer.observe(element);
            }
        });
    }

    /**
     * Add staggered animation delays for better visual effect
     */
    setupStaggeredAnimations() {
        const sections = [
            { selector: '.hero .animate-on-scroll', baseDelay: 0, increment: 0.2 },
            { selector: '.about .animate-on-scroll', baseDelay: 0, increment: 0.3 },
            { selector: '.cardiac-info .animate-on-scroll', baseDelay: 0, increment: 0.2 },
            { selector: '.steps .animate-on-scroll', baseDelay: 0, increment: 0.2 },
            { selector: '.partners .animate-on-scroll', baseDelay: 0, increment: 0.15 },
            { selector: '.cta .animate-on-scroll', baseDelay: 0, increment: 0.1 }
        ];

        sections.forEach(section => {
            const elements = document.querySelectorAll(section.selector);

            elements.forEach((element, index) => {
                const delay = section.baseDelay + (index * section.increment);
                element.style.transitionDelay = `${delay}s`;
            });
        });
    }

    /**
     * Setup performance optimizations
     */
    setupPerformanceOptimizations() {
        // Optimize scroll events
        let scrollTimer = null;

        window.addEventListener('scroll', () => {
            this.isScrolling = true;

            if (scrollTimer !== null) {
                clearTimeout(scrollTimer);
            }

            scrollTimer = setTimeout(() => {
                this.isScrolling = false;
            }, 150);
        }, { passive: true });

        // Preload critical animations
        this.preloadAnimations();
    }

    /**
     * Preload critical animations to prevent layout shifts
     */
    preloadAnimations() {
        // Force browser to calculate initial styles
        this.animatedElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            // Touch the opacity property to force calculation
            void computedStyle.opacity;
        });
    }

    /**
     * Public method to manually trigger animations (useful for testing)
     */
    triggerAnimation(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('animated');
        }
    }

    /**
     * Public method to reset animations
     */
    resetAnimations() {
        this.animatedElements.forEach(element => {
            element.classList.remove('animated');
        });
    }

    /**
     * Clean up resources when needed
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// Enhanced Statistics Counter Animation
class StatisticsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = element.textContent || '';
        const isPercentage = target.includes('%');
        const numericValue = parseInt(target.replace(/[^\d]/g, ''));

        if (isNaN(numericValue)) return;

        let current = 0;
        const increment = numericValue / 60; // 60 frames for 1 second at 60fps
        const timer = setInterval(() => {
            current += increment;

            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }

            const displayValue = Math.floor(current);
            element.textContent = isPercentage
                ? `${displayValue}%`
                : displayValue.toLocaleString();
        }, 16); // ~60fps
    }
}

// Contact Form Handler (if needed in the future)
class ContactFormHandler {
    constructor(formSelector = '#contact-form') {
        this.form = document.querySelector(formSelector);
        if (this.form) {
            this.init();
        }
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.form) return;

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        try {
            // Here you would typically send the data to your backend
            console.log('Form data:', data);
            this.showSuccessMessage();
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage();
        }
    }

    showSuccessMessage() {
        // Implementation for success message
        console.log('Form submitted successfully!');
    }

    showErrorMessage() {
        // Implementation for error message
        console.log('Form submission failed!');
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Main landing page functionality
    const landingPage = new DefibrillatorLanding();

    // Statistics counter animation
    const statsCounter = new StatisticsCounter();

    // Contact form handler (optional)
    const contactForm = new ContactFormHandler();

    // Expose to global scope for debugging in development
    if (typeof window !== 'undefined') {
        window.landingPage = landingPage;
        window.statsCounter = statsCounter;
        window.contactForm = contactForm;
    }
});