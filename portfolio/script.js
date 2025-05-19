document.addEventListener('DOMContentLoaded', function () {
    // Elements to animate
    const animatedElements = [
        { selector: '#home .glitch-text', parent: '#home' },
        { selector: '#home .letter-stagger', parent: '#home' },
        { selector: '#home .subtitle', parent: '#home' },
        { selector: '#about .section-title .word', parent: '#about' },
        { selector: '#about .skills-title', parent: '#about' },
        { selector: '#about .skills-title span', parent: '#about' },
        { selector: '#about .experience-title', parent: '#about' },
        { selector: '#projects .section-title', parent: '#projects' },
        { selector: '#projects .section-title span', parent: '#projects' },
        { selector: '#contact .section-title', parent: '#contact' },
        { selector: '#contact .section-title span', parent: '#contact' }
    ];

    // Setup animation for all elements
    function setupAllAnimations() {
        animatedElements.forEach(item => {
            const elements = document.querySelectorAll(item.selector);
            elements.forEach(el => {
                setupAnimation(el);
            });
        });
    }

    // Split text into letters and wrap them in spans
    function setupAnimation(element) {
        // Skip if already processed or doesn't need letter animation
        if (element.classList.contains('letters-processed') ||
            element.classList.contains('glitch-text')) return;

        element.classList.add('letters-processed');
        const text = element.textContent;
        element.innerHTML = '';

        text.split('').forEach((letter, index) => {
            if (letter.trim() === '') {
                element.innerHTML += ' ';
                return;
            }

            const span = document.createElement('span');
            span.className = 'letter';
            span.textContent = letter;
            span.style.transitionDelay = `${index * 0.05}s`;
            element.appendChild(span);
        });
    }

    // Check if element is in viewport (more precise detection)
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight * 0.75) &&
            rect.bottom >= (window.innerHeight * 0.25)
        );
    }

    // Handle scroll event with throttling
    let isScrolling;
    function handleScroll() {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            animatedElements.forEach(item => {
                const parent = document.querySelector(item.parent);
                if (parent && isInViewport(parent)) {
                    const elements = parent.querySelectorAll(item.selector);
                    elements.forEach(el => {
                        el.classList.add('animate');
                    });
                }
            });
        }, 100);
    }

    setupAllAnimations();
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check







    // Create message element function
    function createMessageElement(message, isError = false) {
        const messageEl = document.createElement('div');
        messageEl.className = `message-box ${isError ? 'error' : 'success'}`;
        messageEl.textContent = message;

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => messageEl.remove(), 300);
        }, 5000);

        return messageEl;
    }

    // Show message function
    function showMessage(message, isError = false) {
        const messageEl = createMessageElement(message, isError);
        document.body.appendChild(messageEl);

        // Position the message box
        const existingMessages = document.querySelectorAll('.message-box');
        const offset = existingMessages.length * 60;
        messageEl.style.bottom = `${20 + offset}px`;
    }

    // Mobile Navigation
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') ?
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // Close mobile menu when clicking a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function () {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });
    }

    // Sticky Navigation
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.footer-newsletter form');
    const newsletterEmail = document.querySelector('.footer-newsletter input[type="email"]');

    if (newsletterForm && newsletterEmail) {
        newsletterForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Sanitize and validate email
            const email = sanitizeInput(newsletterEmail.value.trim());
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address', true);
                newsletterEmail.focus();
                return;
            }

            try {
                // Show loading state
                const submitBtn = newsletterForm.querySelector('button[type="submit"]');
                if (!submitBtn) return;

                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;

                // Add subscriber with sanitized email
                const success = await addSubscriber(email);

                // Reset button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;

                if (success) {
                    showMessage('Thank you for subscribing!');
                    newsletterForm.reset();
                } else {
                    showMessage('Subscription failed. Please try again.', true);
                }
            } catch (error) {
                console.error('Newsletter subscription error:', error);
                showMessage('There was an error with your subscription. Please try again.', true);
            }
        });
    }

    // Active Navigation Link
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    if (sections.length && navItems.length) {
        window.addEventListener('scroll', function () {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (pageYOffset >= sectionTop - 300) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${current}`) {
                    item.classList.add('active');
                }
            });
        });
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        backToTopBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    // Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const viewMoreBtn = document.querySelector('.view-more .btn');

    if (filterBtns.length && projectCards.length) {
        // Initially show only first 3 projects
        projectCards.forEach((card, index) => {
            card.style.display = index < 3 ? 'block' : 'none';
        });

        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                // Remove active class from all buttons
                filterBtns.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                projectCards.forEach((card, index) => {
                    if (filterValue === 'all') {
                        // For 'All', show only first 3 projects
                        card.style.display = index < 3 ? 'block' : 'none';
                    } else {
                        // For other filters (like 'Web'), show all matching projects
                        if (card.getAttribute('data-category') === filterValue) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });

                // Update view more button visibility
                updateViewMoreButton();
            });
        });

        // Function to update view more button visibility
        function updateViewMoreButton() {
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            if (activeFilter === 'all') {
                viewMoreBtn.style.display = 'inline-block';
            } else {
                viewMoreBtn.style.display = 'none';
            }
        }

        // Initialize button visibility
        updateViewMoreButton();
    }

    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', function (e) {
            e.preventDefault();
            projectCards.forEach(card => {
                card.style.display = 'block';
            });
            this.style.display = 'none';
        });
    }


    // Project Modal
    const projectModal = document.getElementById('projectModal');
    const closeModal = document.querySelector('.close-modal');

    if (projectModal && closeModal && projectCards.length) {
        projectCards.forEach((card, index) => {
            card.addEventListener('click', function (e) {
                // Don't trigger if clicking on links inside the card
                if (e.target.closest('.project-link') || e.target.tagName === 'A' || e.target.tagName === 'I') {
                    return;
                }

                // Get project elements with null checks
                const projectImgEl = card.querySelector('.project-img img');
                const projectTitleEl = card.querySelector('.project-info h3');
                const projectDescEl = card.querySelector('.project-info p');
                const projectTagEls = card.querySelectorAll('.project-tags span');
                const projectLinks = card.querySelectorAll('.project-link');

                if (!projectImgEl || !projectTitleEl || !projectDescEl) return;

                const projectImg = projectImgEl.src;
                const projectTitle = projectTitleEl.textContent;
                const projectDesc = projectDescEl.textContent;
                const projectTags = Array.from(projectTagEls).map(tag => tag.textContent);
                const codeLink = projectLinks[0]?.href || '#';
                const demoLink = projectLinks[1]?.href || '#';

                // Different details for each project
                const projectDetails = [
                    [
                        "Responsive design for all devices",
                        "Member management system",
                        "Payment tracking integration",
                        "Class scheduling functionality",
                        "Admin dashboard"
                    ],
                    [
                        "Expense categorization",
                        "Income/expense tracking",
                        "Data visualization",
                        "Local storage support",
                        "Responsive design"
                    ],
                    [
                        "Clean and modern single-page portfolio layout",
                        "Smooth scroll navigation with active section highlighting",
                        "Interactive project gallery with category filtering",
                        "Contact form integrated with email service",
                        "Responsive design optimized for all devices",
                        "Animated skill bars showcasing proficiency levels",
                        "Downloadable resume with tracking of downloads",
                        "Social media and professional network links",
                        "Customizable theme with dark and light modes",
                        "Form input validation and spam protection"
                    ],
                    [
                        "Product catalog",
                        "Shopping cart functionality",
                        "Responsive design",
                        "Category filtering",
                        "Product details page"
                    ],
                    [
                        "Responsive multi-page layout mimicking Netflix UI",
                        "Dynamic movie and TV show browsing with category filters",
                        "User authentication and profile management",
                        "Integration with third-party API for movie data",
                        "Search functionality with real-time suggestions",
                        "Video player with custom controls and fullscreen mode",
                        "Watchlist feature to save favorite titles",
                        "Responsive design for desktop and mobile devices",
                        "Smooth animations and transitions using CSS and JavaScript",
                        "Form validation for signup and login inputs"
                    ]
                ];

                // Generate tags HTML
                let tagsHtml = projectTags.map(tag => `<span>${tag.trim()}</span>`).join('');

                // Generate details HTML for the current project
                let detailsHtml = '';
                if (projectDetails[index]) {
                    detailsHtml = projectDetails[index].map(detail => `<li>${detail}</li>`).join('');
                }

                // Generate modal content
                const modalBody = document.querySelector('.modal-body');
                if (modalBody) {
                    modalBody.innerHTML = `
                        <div class="project-img">
                            <img src="${projectImg}" alt="${projectTitle}">
                        </div>
                        <div class="project-info">
                            <h3>${projectTitle}</h3>
                            <p>${projectDesc}</p>
                            <div class="project-tags">
                                ${tagsHtml}
                            </div>
                            <div class="project-details">
                                <h4>Project Details</h4>
                                <ul>
                                    ${detailsHtml}
                                </ul>
                            </div>
                            <div class="project-links">
                                <a href="${codeLink}" target="_blank" class="code-link">
                                    <i class="fas fa-link"></i> View Code
                                </a>
                                <a href="${demoLink}" target="_blank" class="demo-link">
                                    <i class="fas fa-search"></i> Live Demo
                                </a>
                            </div>
                        </div>
                    `;

                    projectModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        closeModal.addEventListener('click', function () {
            projectModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        window.addEventListener('click', function (e) {
            if (e.target === projectModal) {
                projectModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Skill Categories Filtering and Progress Bars
    const categoryCards = document.querySelectorAll('.category-card');
    const skillBars = document.querySelectorAll('.skill-bar');

    // Function to initialize and animate skill bars
    function initializeSkillBars() {
        const progressBars = document.querySelectorAll('.progress');

        progressBars.forEach(bar => {
            // Store the original width from the data-percent attribute
            const targetWidth = bar.parentElement.getAttribute('data-percent') || bar.getAttribute('data-percent');
            if (targetWidth) {
                // Set the width to 0 initially
                bar.style.width = '0';

                // After a short delay, animate to the target width
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 100);
            }
        });
    }

    if (categoryCards.length && skillBars.length) {
        // Function to show skills for a specific category
        function showSkillsForCategory(category) {
            // Hide all skill bars
            skillBars.forEach(skill => {
                skill.classList.remove('active');
            });

            // Show skills for the selected category
            const skillsToShow = document.querySelectorAll(`.skill-bar[data-category="${category}"]`);
            skillsToShow.forEach(skill => {
                skill.classList.add('active');
            });

            // Initialize and animate the skill bars
            initializeSkillBars();
        }

        // Set Language as active by default
        const defaultCategory = document.querySelector('.category-card[data-category="Language"]');
        if (defaultCategory) {
            defaultCategory.classList.add('active');
            showSkillsForCategory('Language');
        }

        categoryCards.forEach(card => {
            card.addEventListener('click', function () {
                // Remove active class from all cards
                categoryCards.forEach(c => c.classList.remove('active'));

                // Add active class to clicked card
                this.classList.add('active');

                // Get selected category
                const category = this.getAttribute('data-category');

                // Show skills for the selected category
                showSkillsForCategory(category);
            });
        });
    }

    // Form Validation and Submission
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            let isValid = true;

            // Reset error states
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });

            // Sanitize inputs first
            const sanitizedName = sanitizeInput(name.value);
            const sanitizedEmail = sanitizeInput(email.value);
            const sanitizedSubject = sanitizeInput(subject.value);
            const sanitizedMessage = sanitizeInput(message.value);

            // Validate name
            if (sanitizedName === '') {
                name.parentElement.classList.add('error');
                showMessage('Please enter your name', true);
                isValid = false;
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(sanitizedEmail)) {
                email.parentElement.classList.add('error');
                showMessage('Please enter a valid email address', true);
                isValid = false;
            }

            // Validate subject
            if (sanitizedSubject === '') {
                subject.parentElement.classList.add('error');
                showMessage('Please enter a subject', true);
                isValid = false;
            }

            // Validate message
            if (sanitizedMessage === '') {
                message.parentElement.classList.add('error');
                showMessage('Please enter your message', true);
                isValid = false;
            }

            if (isValid) {
                try {
                    // Show loading state
                    const submitBtn = contactForm.querySelector('button[type="submit"]');
                    const originalBtnText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    submitBtn.disabled = true;

                    // Use the sanitized values
                    const success = await addContact(
                        sanitizedName,
                        sanitizedEmail,
                        sanitizedSubject,
                        sanitizedMessage
                    );

                    // Reset button state
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;

                    if (success) {
                        showMessage('Thank you for your message! I will get back to you soon.');
                        contactForm.reset();
                    } else {
                        showMessage('There was an error sending your message. Please try again later.', true);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showMessage('There was an error sending your message. Please try again later.', true);
                }
            }
        });
    }

    // Resume Modal
    const resumeBtn = document.getElementById('resume-btn');
    const resumeModal = document.getElementById('resumeModal');
    const closeResumeModal = resumeModal?.querySelector('.close-modal');
    const resumeForm = document.getElementById('resumeForm');

    if (resumeBtn) {
        resumeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            resumeModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeResumeModal) {
        closeResumeModal.addEventListener('click', function () {
            resumeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    if (resumeForm) {
        resumeForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const emailInput = document.getElementById('resumeEmail');
            const email = emailInput.value.trim();

            // Validate email if provided
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showMessage('Please enter a valid email address or leave it blank', true);
                emailInput.focus();
                return;
            }

            try {
                // Show loading state
                const submitBtn = resumeForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;

                // Track the download attempt
                const success = await trackResumeDownload(email || null);

                // Reset button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;

                if (success) {
                    // Proceed with download
                    window.open('img/resume.pdf', '_blank');

                    // Close modal and reset form
                    resumeModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    resumeForm.reset();

                    showMessage('Resume downloaded successfully!');
                } else {
                    showMessage('There was an error processing your request. Please try again.', true);
                }
            } catch (error) {
                console.error('Error tracking resume download:', error);
                showMessage('There was an error processing your request. Please try again.', true);
            }
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function (e) {
        if (e.target === resumeModal) {
            resumeModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'skills') {
                    initializeSkillBars();
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    // Check if device supports hover (not touch devices)
    if (matchMedia('(hover: hover)').matches) {
        // Mouse move event
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Update cursor position immediately
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Animation loop for follower
        gsap.to({}, {
            duration: 0.016,
            repeat: -1,
            onRepeat: function () {
                posX += (mouseX - posX) / 9;
                posY += (mouseY - posY) / 9;

                cursorFollower.style.left = posX + 'px';
                cursorFollower.style.top = posY + 'px';
            }
        });

        // Hover effects for interactive elements
        const hoverElements = document.querySelectorAll('a, button, .project-card, .nav-link, .filter-btn, .category-card');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (el.classList.contains('btn') || el.tagName === 'BUTTON') {
                    cursor.classList.add('hover-btn');
                    cursorFollower.classList.add('hover-btn');
                } else {
                    cursor.classList.add('hover-link');
                    cursorFollower.classList.add('hover-link');
                }
            });

            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover-link', 'hover-btn');
                cursorFollower.classList.remove('hover-link', 'hover-btn');
            });
        });

        // Active state when clicking
        document.addEventListener('mousedown', () => {
            cursor.classList.add('active');
        });

        document.addEventListener('mouseup', () => {
            cursor.classList.remove('active');
        });
    } else {
        // Hide cursor elements on touch devices
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
    }
    // Initialize skill bars on page load
    setTimeout(initializeSkillBars, 500);

});