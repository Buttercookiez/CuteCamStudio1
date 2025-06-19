document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');
    const backToTopBtn = document.getElementById('back-to-top');
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const sections = document.querySelectorAll('section');
    const header = document.querySelector('.main-header');
    
    // State variables
    let currentTestimonial = 0;
    let isScrolling = false;
    let lastScrollTop = 0;
    let testimonialInterval;
    
    // Initialize
    checkThemePreference();
    setupEventListeners();
    startTestimonialSlider();
    setupScrollAnimations();
    
    // Functions
    function checkThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark-mode');
            document.documentElement.classList.remove('light-mode');
            updateThemeToggleIcon(true);
        } else {
            document.documentElement.classList.add('light-mode');
            document.documentElement.classList.remove('dark-mode');
            updateThemeToggleIcon(false);
        }
    }
    
    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }
    
    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
    
    function toggleTheme() {
        const isDark = !document.documentElement.classList.contains('dark-mode');
        
        if (isDark) {
            document.documentElement.classList.add('dark-mode');
            document.documentElement.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.add('light-mode');
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
        
        updateThemeToggleIcon(isDark);
        animateThemeToggle();
    }
    
    function updateThemeToggleIcon(isDark) {
        const sunMoon = themeToggle.querySelector('.sun-moon');
        if (isDark) {
            sunMoon.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            sunMoon.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    function animateThemeToggle() {
        themeToggle.classList.add('animate');
        setTimeout(() => {
            themeToggle.classList.remove('animate');
        }, 500);
    }
    
    function showTestimonial(index) {
        // Wrap around if at ends
        if (index >= testimonials.length) index = 0;
        if (index < 0) index = testimonials.length - 1;
        
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        // Update dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show selected testimonial
        testimonials[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentTestimonial = index;
        
        // Reset auto-advance timer
        resetTestimonialInterval();
    }
    
    function nextTestimonial() {
        showTestimonial(currentTestimonial + 1);
    }
    
    function prevTestimonial() {
        showTestimonial(currentTestimonial - 1);
    }
    
    function startTestimonialSlider() {
        testimonialInterval = setInterval(nextTestimonial, 8000);
    }
    
    function resetTestimonialInterval() {
        clearInterval(testimonialInterval);
        startTestimonialSlider();
    }
    
    function handleScroll() {
        // Back to top button
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
        
        // Header scroll effect
        const scrollTop = window.scrollY;
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
        
        // Section animations
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                animateSectionsOnScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }
    
    function animateSectionsOnScroll() {
        const windowHeight = window.innerHeight;
        const windowTop = window.scrollY;
        const windowBottom = windowTop + windowHeight;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Check if section is in view
            if (sectionBottom >= windowTop && sectionTop <= windowBottom) {
                section.classList.add('in-view');
            }
        });
    }
    
    function setupScrollAnimations() {
        // Initial check
        animateSectionsOnScroll();
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    function setupEventListeners() {
        // Mobile menu
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Close mobile menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);
        
        // Testimonial slider controls
        prevBtn.addEventListener('click', prevTestimonial);
        nextBtn.addEventListener('click', nextTestimonial);
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showTestimonial(index);
            });
        });
        
        // Back to top button
        backToTopBtn.addEventListener('click', scrollToTop);
        
        // Scroll events
        window.addEventListener('scroll', debounce(handleScroll));
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Debounce function for scroll events
    function debounce(func, wait = 10, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // Initialize animations after load
    setTimeout(() => {
        document.body.classList.add('animations-loaded');
    }, 500);
});