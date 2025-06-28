/**
 * Privacy Policy Page JavaScript
 * Handles animations, scroll effects, and user interactions
 */

// DOM Elements
const scrollProgress = document.getElementById('scrollProgress');
const sections = document.querySelectorAll('.section');
const floatingShapes = document.querySelectorAll('.shape');
const contactEmail = document.querySelector('.contact-email');

// Configuration
const CONFIG = {
    scrollThrottle: 16, // ~60fps
    intersectionThreshold: 0.1,
    parallaxIntensity: 0.15,
    debounceDelay: 100
};

// Utility Functions
const throttle = (func, limit) => {
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
};

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const lerp = (start, end, factor) => {
    return start + (end - start) * factor;
};

// Scroll Progress Indicator
const updateScrollProgress = () => {
    if (!scrollProgress) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(Math.max((scrollTop / docHeight) * 100, 0), 100);
    
    scrollProgress.style.width = `${scrollPercent}%`;
};

// Parallax Effect for Floating Shapes
const updateParallax = () => {
    const scrolled = window.pageYOffset;
    
    floatingShapes.forEach((shape, index) => {
        const rate = scrolled * (CONFIG.parallaxIntensity + index * 0.05);
        const translateY = -rate;
        
        // Apply transform with hardware acceleration
        shape.style.transform = `translate3d(0, ${translateY}px, 0)`;
    });
};

// Intersection Observer for Section Animations
const createIntersectionObserver = () => {
    const options = {
        threshold: CONFIG.intersectionThreshold,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add stagger animation for child elements
                const childElements = entry.target.querySelectorAll('.feature-list li, .permission-card');
                childElements.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    return observer;
};

// Smooth Scroll for Anchor Links
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// Enhanced Hover Effects
const initHoverEffects = () => {
    // Section hover effects
    sections.forEach(section => {
        let hoverTimeout;
        
        section.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            section.style.transform = 'translateY(-3px)';
            section.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        section.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                section.style.transform = 'translateY(0)';
            }, 50);
        });
    });

    // Interactive elements
    const interactiveElements = document.querySelectorAll('.feature-list li, .permission-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateX(8px) translateY(-2px)';
            element.style.transition = 'transform 0.3s ease';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateX(0) translateY(0)';
        });
    });
};

// Contact Email Interaction
const initContactEmailInteraction = () => {
    if (!contactEmail) return;
    
    contactEmail.addEventListener('click', (e) => {
        // Add click animation
        contactEmail.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            contactEmail.style.transform = '';
        }, 150);
    });

    // Add tooltip functionality
    const tooltip = document.createElement('div');
    tooltip.className = 'email-tooltip';
    tooltip.textContent = 'contact.hakomsoft@gmail.com';
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        pointer-events: none;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        z-index: 1000;
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    
    contactEmail.addEventListener('mouseenter', (e) => {
        const rect = contactEmail.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 40}px`;
        tooltip.style.transform = 'translateX(-50%) translateY(-10px)';
        tooltip.style.opacity = '1';
    });
    
    contactEmail.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        tooltip.style.transform = 'translateX(-50%) translateY(-20px)';
    });
};

// Page Load Animation
const initPageLoadAnimation = () => {
    // Add loaded class to body for fade-in effect
    document.body.classList.add('loaded');
    
    // Animate elements in sequence
    const animationSequence = [
        { elements: ['.header'], delay: 0 },
        { elements: ['.effective-date'], delay: 300 },
        { elements: ['.intro-section'], delay: 600 },
        { elements: ['.section'], delay: 900, stagger: 200 }
    ];
    
    animationSequence.forEach(({ elements, delay, stagger = 0 }) => {
        elements.forEach(selector => {
            const els = document.querySelectorAll(selector);
            els.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animate-in');
                }, delay + (index * stagger));
            });
        });
    });
};

// Keyboard Navigation
const initKeyboardNavigation = () => {
    document.addEventListener('keydown', (e) => {
        // Scroll to top on Home key
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Scroll to bottom on End key
        if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    });
};

// Performance Optimization
const initPerformanceOptimizations = () => {
    // Throttled scroll handler
    const throttledScrollHandler = throttle(() => {
        updateScrollProgress();
        updateParallax();
    }, CONFIG.scrollThrottle);
    
    // Debounced resize handler
    const debouncedResizeHandler = debounce(() => {
        // Recalculate positions on resize
        updateScrollProgress();
    }, CONFIG.debounceDelay);
    
    // Event listeners
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    window.addEventListener('resize', debouncedResizeHandler, { passive: true });
};

// Error Handling
const handleErrors = () => {
    window.addEventListener('error', (e) => {
        console.warn('Privacy Policy Page Error:', e.error);
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.warn('Unhandled Promise Rejection:', e.reason);
    });
};

// Accessibility Enhancements
const initAccessibilityFeatures = () => {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-fast', '0.01ms');
        document.documentElement.style.setProperty('--transition-medium', '0.01ms');
        document.documentElement.style.setProperty('--transition-slow', '0.01ms');
    }
    
    // Focus management
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
};

// Initialize everything when DOM is ready
const init = () => {
    try {
        // Core functionality
        initPageLoadAnimation();
        initPerformanceOptimizations();
        
        // UI enhancements
        createIntersectionObserver();
        initSmoothScroll();
        initHoverEffects();
        initContactEmailInteraction();
        
        // Accessibility and keyboard support
        initKeyboardNavigation();
        initAccessibilityFeatures();
        
        // Error handling
        handleErrors();
        
        console.log('Privacy Policy Page initialized successfully');
    } catch (error) {
        console.error('Error initializing Privacy Policy Page:', error);
    }
};

// DOM Content Loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid var(--accent-gold) !important;
        outline-offset: 2px !important;
    }
    
    .email-tooltip {
        font-family: 'Inter', sans-serif;
    }
    
    .email-tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 6px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.8);
    }
`;
document.head.appendChild(style);

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init,
        updateScrollProgress,
        updateParallax
    };
}