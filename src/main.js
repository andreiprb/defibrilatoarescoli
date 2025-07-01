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
        // Load both constants and partners in parallel
        await Promise.all([
            this.loadConstants(),
            this.loadPartners()
        ]);

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
     * Load constants (contact info) from JSON file
     */
    async loadConstants() {
        try {
            const response = await fetch('./constants/contact.json');
            this.constants = await response.json();
            this.updateContactInfo();
        } catch (error) {
            console.error('Failed to load contact constants:', error);
            // Fallback values
            this.constants = {
                contact: {
                    email: "defibrilatoareinscoli@gmail.com",
                    phone: "+40751234567",
                    phoneDisplay: "0751 234 567"
                }
            };
            this.updateContactInfo();
        }
    }

    /**
     * Load partners from JSON file
     */
    async loadPartners() {
        try {
            const response = await fetch('./constants/partners.json');
            const partnersData = await response.json();

            if (partnersData && partnersData.partners && Array.isArray(partnersData.partners)) {
                this.renderPartners(partnersData.partners);
            } else {
                console.warn('Partners data is not in expected format or is empty');
                this.hidePartnersSection();
            }
        } catch (error) {
            console.error('Failed to load partners:', error);
            this.hidePartnersSection();
        }
    }

    /**
     * Hide partners section if no data available
     */
    hidePartnersSection() {
        const partnersSection = document.querySelector('.partners');
        if (partnersSection) {
            partnersSection.style.display = 'none';
        }
    }

    /**
     * Show partners section
     */
    showPartnersSection() {
        const partnersSection = document.querySelector('.partners');
        if (partnersSection) {
            partnersSection.style.display = 'block';
        }
    }

    /**
     * Render partners in the DOM
     */
    renderPartners(partners) {
        const container = document.getElementById('partners-container');
        if (!container) {
            console.error('Partners container not found');
            return;
        }

        if (!partners || !partners.length) {
            console.warn('No partners to render');
            this.hidePartnersSection();
            return;
        }

        // Show partners section
        this.showPartnersSection();

        // Clear existing content
        container.innerHTML = '';

        partners.forEach((partner, index) => {
            // Validate partner data
            if (!partner.name || !partner.imageUrl) {
                console.warn('Invalid partner data:', partner);
                return;
            }

            const partnerCard = document.createElement('div');
            partnerCard.className = 'partner-card animate-on-scroll';
            partnerCard.style.transitionDelay = `${index * 0.1}s`;

            partnerCard.innerHTML = `
                <img src="${partner.imageUrl}" alt="${partner.name}" class="partner-image" 
                     onerror="this.style.display='none'" 
                     onload="this.style.display='block'">
                <h3>${partner.name}</h3>
            `;

            container.appendChild(partnerCard);
        });

        // Re-setup animations for new elements
        this.setupAnimationsForPartners();
    }

    /**
     * Setup animations for dynamically added partners
     */
    setupAnimationsForPartners() {
        const partnerCards = document.querySelectorAll('.partner-card');

        if (this.observer) {
            partnerCards.forEach(card => {
                this.observer.observe(card);
            });
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
            { selector: '.founders .animate-on-scroll', baseDelay: 0, increment: 0.15 },
            { selector: '.partners .animate-on-scroll', baseDelay: 0, increment: 0.1 },
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
     * Public method to add new partners dynamically
     */
    addPartner(partner) {
        if (!partner || !partner.name || !partner.imageUrl) {
            console.error('Invalid partner data');
            return;
        }

        const container = document.getElementById('partners-container');
        if (!container) return;

        const partnerCard = document.createElement('div');
        partnerCard.className = 'partner-card animate-on-scroll';

        partnerCard.innerHTML = `
            <img src="${partner.imageUrl}" alt="${partner.name}" class="partner-image" onerror="this.style.display='none'">
            <h3>${partner.name}</h3>
        `;

        container.appendChild(partnerCard);

        // Setup animation for new element
        if (this.observer) {
            this.observer.observe(partnerCard);
        }
    }

    /**
     * Public method to reload contact information
     */
    async reloadContactInfo() {
        await this.loadConstants();
    }

    /**
     * Public method to reload partners
     */
    async reloadPartners() {
        await this.loadPartners();
    }

    /**
     * Public method to reload all data
     */
    async reloadAllData() {
        await Promise.all([
            this.loadConstants(),
            this.loadPartners()
        ]);
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

// Partners Management Utility (for dynamic partner management)
class PartnersManager {
    constructor(landingPageInstance) {
        this.landingPage = landingPageInstance;
        this.partners = [];
    }

    /**
     * Add a new partner
     */
    async addPartner(name, imageUrl) {
        const partner = { name, imageUrl };
        this.partners.push(partner);

        if (this.landingPage) {
            this.landingPage.addPartner(partner);
        }

        return partner;
    }

    /**
     * Remove a partner by name
     */
    removePartner(name) {
        this.partners = this.partners.filter(p => p.name !== name);

        // Remove from DOM
        const container = document.getElementById('partners-container');
        if (container) {
            const partnerCards = container.querySelectorAll('.partner-card');
            partnerCards.forEach(card => {
                const partnerName = card.querySelector('h3')?.textContent;
                if (partnerName === name) {
                    card.remove();
                }
            });
        }
    }

    /**
     * Get all partners
     */
    getPartners() {
        return [...this.partners];
    }

    /**
     * Clear all partners
     */
    clearPartners() {
        this.partners = [];
        const container = document.getElementById('partners-container');
        if (container) {
            container.innerHTML = '';
        }
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

    // Partners manager for dynamic management
    const partnersManager = new PartnersManager(landingPage);

    // Expose to global scope for debugging in development
    if (typeof window !== 'undefined') {
        window.landingPage = landingPage;
        window.statsCounter = statsCounter;
        window.contactForm = contactForm;
        window.partnersManager = partnersManager;
    }
});