document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Theme Toggling
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');
    const logoImg = document.querySelector('.logo-img');
    const heroLogo = document.querySelector('.mockup-content img');

    function updateAssets(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            logoImg.src = 'assets/logo-dark.png';
            if (heroLogo) heroLogo.src = 'assets/logo-dark.gif';
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            logoImg.src = 'assets/logo.png';
            if (heroLogo) heroLogo.src = 'assets/logo.gif';
        }
    }

    // Default to system preference if no saved theme
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    // Apply initial theme
    html.setAttribute('data-theme', currentTheme);
    updateAssets(currentTheme);

    // Toggle event
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', currentTheme);
            localStorage.setItem('theme', currentTheme);
            updateAssets(currentTheme);
        });
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');

            // Change icon
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (menuToggle) {
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animateElements = document.querySelectorAll('.feature-card, .hero-content, .hero-image, .timeline-item, .cta-box');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add fade-in class style dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // --- Carousel Logic ---
    const row1 = document.getElementById('carousel-row-1');
    const row2 = document.getElementById('carousel-row-2');

    if (row1 && row2) {
        // Create 14 items split between rows
        // Using standard naming: screen_1.jpg ... screen_14.jpg
        // Provide placeholders if files don't exist yet

        function createItem(index) {
            const div = document.createElement('div');
            div.className = 'carousel-item';
            const img = document.createElement('img');
            img.className = 'carousel-screenshot';
            // Store theme paths
            img.dataset.light = `assets/screenshots/light/screen_${index}.jpg`;
            img.dataset.dark = `assets/screenshots/dark/screen_${index}.jpg`;
            img.alt = `Screenshot ${index}`;
            img.loading = "lazy";

            // Set initial src
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            img.src = isDark ? img.dataset.dark : img.dataset.light;

            // Fallback for missing images (handled by onerror if needed, but we assume assets exist)
            img.onerror = function () {
                // this.style.display='none'; // Hide if missing? Or show placeholder
                // For dev, let's keep it visible so user knows to add file
            };

            div.appendChild(img);
            return div;
        }

        // Populate Rows with Duplicates for Infinite Loop
        function populateRow(row, start, end) {
            row.innerHTML = '';
            // Original Set
            for (let i = start; i <= end; i++) {
                row.appendChild(createItem(i));
            }
            // Duplicate Set (Clones)
            for (let i = start; i <= end; i++) {
                const clone = createItem(i);
                clone.setAttribute('aria-hidden', 'true');
                row.appendChild(clone);
            }
            // Triplicate Set (Safety buffer)
            for (let i = start; i <= end; i++) {
                const clone = createItem(i);
                clone.setAttribute('aria-hidden', 'true');
                row.appendChild(clone);
            }
        }

        if (row1) populateRow(row1, 1, 7);
        if (row2) populateRow(row2, 8, 14);

        // Independent Navigation Logic (Infinite Loop)
        const scrollPositions = {
            'carousel-row-1': 0,
            'carousel-row-2': 0
        };
        const autoScrollSpeed = 0.5;

        document.querySelectorAll('.carousel-nav').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = btn.getAttribute('data-target');
                const row = document.getElementById(targetId);
                const isNext = btn.classList.contains('next-btn');
                const step = 250;

                if (row && targetId) {
                    if (isNext) {
                        scrollPositions[targetId] += step;
                    } else {
                        scrollPositions[targetId] -= step;
                    }
                }
            });
        });

        // Auto Scroll (Infinite Loop)
        let isPaused = false;

        // Pause on hover
        document.querySelectorAll('.carousel-track-wrapper').forEach(wrapper => {
            wrapper.addEventListener('mouseenter', () => isPaused = true);
            wrapper.addEventListener('mouseleave', () => isPaused = false);
        });

        function animateCarousel() {
            ['carousel-row-1', 'carousel-row-2'].forEach(id => {
                const row = document.getElementById(id);
                if (!row) return;

                if (!isPaused) {
                    scrollPositions[id] += autoScrollSpeed;
                }

                // Infinite Loop Check
                const firstItem = row.querySelector('.carousel-item');
                let singleSetWidth = 0;
                if (firstItem) {
                    const itemWidth = firstItem.offsetWidth;
                    const style = window.getComputedStyle(row);
                    const gap = parseFloat(style.gap) || 20;
                    singleSetWidth = (itemWidth + gap) * 7;
                }

                if (singleSetWidth > 0) {
                    if (scrollPositions[id] >= singleSetWidth) {
                        scrollPositions[id] %= singleSetWidth;
                    } else if (scrollPositions[id] < 0) {
                        while (scrollPositions[id] < 0) {
                            scrollPositions[id] += singleSetWidth;
                        }
                    }
                }

                row.style.transform = `translateX(-${scrollPositions[id]}px)`;
            });
            requestAnimationFrame(animateCarousel);
        }

        // Start animation immediately
        requestAnimationFrame(animateCarousel);

        // Extend theme toggle logic to update carousel images
        const originalUpdateAssets = window.updateCarouselAssets || function () { };

        // We need to override or hook into the theme button click. 
        // Since everything is inside DOMContentLoaded, we can just find the toggle again or add a mutation observer?
        // Easiest is to add a listener to the toggle button again, specifically for screenshots.

        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                // Small delay to ensure theme attribute is updated
                setTimeout(() => {
                    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                    document.querySelectorAll('.carousel-screenshot').forEach(img => {
                        img.src = isDark ? img.dataset.dark : img.dataset.light;
                    });
                }, 50);
            });
        }
    }
});
