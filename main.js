/**
 * Defibrilatoare în Școli - Main JavaScript
 * Complete rewrite with embedded data and modern functionality
 */

// Configuration and Data
const CONFIG = {
    contact: {
        email: "defibrilatoareinscoli@gmail.com",
        phone: "+40748273883",
        phoneDisplay: "0748 273 883"
    },
    partners: [],
    animations: {
        scrollThreshold: 0.1,
        staggerDelay: 0.2
    }
};

// Main Application Class
class DefibrillatorApp {
    constructor() {
        this.navbar = null;
        this.isScrolling = false;
        this.observers = [];

        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }

    /**
     * Setup all application features
     */
    setupApp() {
        this.updateContactInfo();
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupStatisticsCounter();
        this.setupSmoothScrolling();
        this.setupPerformanceOptimizations();
    }

    /**
     * Update contact information in the DOM
     */
    updateContactInfo() {
        const { email, phone, phoneDisplay } = CONFIG.contact;

        // Update donate button (email)
        const donateBtn = document.getElementById('donate-btn');
        if (donateBtn) {
            donateBtn.href = `mailto:${email}`;
        }

        // Update contact button (phone)
        const contactBtn = document.getElementById('contact-btn');
        if (contactBtn) {
            contactBtn.href = `tel:${phone}`;
            contactBtn.innerHTML = `<i class="fas fa-phone"></i> ${phoneDisplay}`;
        }

        // Update footer email link
        const footerEmail = document.getElementById('footer-email');
        if (footerEmail) {
            footerEmail.href = `mailto:${email}`;
        }
    }

    /**
     * Setup navigation functionality
     */
    setupNavigation() {
        this.navbar = document.getElementById('navbar');

        if (!this.navbar) return;

        // Navbar scroll effect with throttling
        let scrollTimer = null;

        const handleScroll = () => {
            if (scrollTimer) return;

            scrollTimer = requestAnimationFrame(() => {
                if (window.scrollY > 100) {
                    this.navbar.classList.add('scrolled');
                } else {
                    this.navbar.classList.remove('scrolled');
                }
                scrollTimer = null;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    /**
     * Setup smooth scrolling for navigation links
     */
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);

                if (target) {
                    const navbarHeight = this.navbar ? this.navbar.offsetHeight : 80;
                    const targetTop = target.offsetTop - navbarHeight;

                    window.scrollTo({
                        top: targetTop,
                        behavior: 'smooth'
                    });

                    // Update URL without jumping
                    history.pushState(null, '', targetId);
                }
            });
        });
    }

    /**
     * Setup scroll-triggered animations
     */
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        if (!animatedElements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: CONFIG.animations.scrollThreshold,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        // Add staggered delays for better visual effect
        this.addStaggeredDelays(animatedElements);

        // Observe all animated elements
        animatedElements.forEach(element => observer.observe(element));

        this.observers.push(observer);
    }

    /**
     * Add staggered animation delays
     */
    addStaggeredDelays(elements) {
        const sections = [
            { selector: '.hero .animate-on-scroll', baseDelay: 0, increment: 0.2 },
            { selector: '.about .animate-on-scroll', baseDelay: 0, increment: 0.3 },
            { selector: '.cardiac-info .animate-on-scroll', baseDelay: 0, increment: 0.2 },
            { selector: '.steps .animate-on-scroll', baseDelay: 0, increment: 0.2 },
            { selector: '.partners .animate-on-scroll', baseDelay: 0, increment: 0.15 },
            { selector: '.cta .animate-on-scroll', baseDelay: 0, increment: 0.1 }
        ];

        sections.forEach(section => {
            const sectionElements = document.querySelectorAll(section.selector);

            sectionElements.forEach((element, index) => {
                const delay = section.baseDelay + (index * section.increment);
                element.style.transitionDelay = `${delay}s`;
            });
        });
    }

    /**
     * Setup statistics counter animation
     */
    setupStatisticsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');

        if (!statNumbers.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateStatistic(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        statNumbers.forEach(stat => observer.observe(stat));
        this.observers.push(observer);
    }

    /**
     * Animate a single statistic counter
     */
    animateStatistic(element) {
        const originalText = element.textContent || '';
        const isPercentage = originalText.includes('%');
        const numericValue = parseInt(originalText.replace(/[^\d]/g, ''));

        if (isNaN(numericValue)) return;

        let currentValue = 0;
        const duration = 1500; // 1.5 seconds
        const steps = 60;
        const increment = numericValue / steps;
        const stepDuration = duration / steps;

        const timer = setInterval(() => {
            currentValue += increment;

            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }

            const displayValue = Math.floor(currentValue);
            element.textContent = isPercentage
                ? `${displayValue}%`
                : displayValue.toLocaleString('ro-RO');
        }, stepDuration);
    }

    /**
     * Setup performance optimizations
     */
    setupPerformanceOptimizations() {
        // Optimize scroll performance
        let scrollTimeout = null;

        window.addEventListener('scroll', () => {
            this.isScrolling = true;

            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
            }, 150);
        }, { passive: true });

        // Preload critical styles
        this.preloadCriticalStyles();
    }

    /**
     * Preload critical styles to prevent layout shifts
     */
    preloadCriticalStyles() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        animatedElements.forEach(element => {
            // Force style calculation to prevent layout shifts
            const style = window.getComputedStyle(element);
            void style.opacity;
            void style.transform;
        });
    }

    /**
     * Utility method to trigger animations manually (for testing)
     */
    triggerAnimation(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('animated');
        }
    }

    /**
     * Reset all animations (for testing/debugging)
     */
    resetAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(element => {
            element.classList.remove('animated');
            element.style.transitionDelay = '';
        });
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// Additional utility functions

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Initialize the application
let defibrillatorApp;

document.addEventListener('DOMContentLoaded', () => {
    defibrillatorApp = new DefibrillatorApp();

    // Expose to global scope for debugging
    if (typeof window !== 'undefined') {
        window.defibrillatorApp = defibrillatorApp;
        window.CONFIG = CONFIG;
    }
});

// Handle page visibility changes for performance
// document.addEventListener('visibilitychange', () => {
//     if (document.hidden) {
//         // Page is hidden, pause non-essential animations
//         console.log('Page hidden - pausing animations');
//     } else {
//         // Page is visible, resume animations
//         console.log('Page visible - resuming animations');
//     }
// });