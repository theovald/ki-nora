document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');

    // Check for saved theme preference or use system preference, with dark as fallback default
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        body.classList.remove('dark-theme');
        updateIcons(false);
    } else {
        // Default is dark (either explicitly saved, system prefers dark, or fallback)
        body.classList.add('dark-theme');
        updateIcons(true);
    }

    // Listen for OS theme changes (only applies if the user hasn't manually overridden via toggle)
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                body.classList.remove('dark-theme');
                updateIcons(false);
            } else {
                body.classList.add('dark-theme');
                updateIcons(true);
            }
        }
    });

    themeToggle.addEventListener('click', () => {
        const isDark = body.classList.contains('dark-theme');

        if (isDark) {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
            updateIcons(false);
        } else {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            updateIcons(true);
        }
    });

    function updateIcons(isDark) {
        if (isDark) {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
    }

    // Hamburger menu logic
    const hamburgerBtn = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-cta-link');

    if (hamburgerBtn && navMenu) {
        // Toggle menu when clicking hamburger
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    hamburgerBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    // Handle form submission asynchronously
    const bookingForm = document.getElementById('booking-form');
    // Handle Path Buttons Toggle
    const pathButtons = document.querySelectorAll('.path-btn');
    const inquiryType = document.getElementById('inquiry-type');
    const subjectGroup = document.getElementById('subject-group');
    const subjectInput = document.getElementById('subject');
    const subjectLabel = document.getElementById('subject-label');
    const dateGroup = document.getElementById('date-group');
    const bodyLabel = document.getElementById('body-label');
    const bodyTextarea = document.getElementById('body');

    if (pathButtons.length > 0) {
        pathButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all
                pathButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked
                this.classList.add('active');
                
                // Update hidden input
                const selectedPath = this.getAttribute('data-path');

                if (selectedPath === 'foredrag') {
                    inquiryType.value = 'Foredrag';

                    // Show Foredrag specific fields
                    subjectGroup.style.display = 'block';
                    subjectInput.required = false;
                    // Tøm feltet dersom det inneholder den generiske rådgivnings-tittelen
                    if (subjectInput.value === 'Strategisk rådgivning' || subjectInput.value === 'KI-utvikling og prosjekt') {
                        subjectInput.value = '';
                    }
                    dateGroup.style.display = 'block';

                    // Update labels
                    bodyLabel.textContent = 'Litt om arrangementet og målgruppen (valgfritt)';
                    bodyTextarea.placeholder = 'Skriv din melding her...';

                } else if (selectedPath === 'radgivning') {
                    inquiryType.value = 'Strategisk rådgivning';
                    
                    // Hide Foredrag specific fields
                    subjectGroup.style.display = 'none';
                    subjectInput.required = false;
                    subjectInput.value = 'Strategisk rådgivning';
                    dateGroup.style.display = 'none';
                    
                    // Update labels
                    bodyLabel.textContent = 'Kort beskrivelse av behovet (valgfritt)';
                    bodyTextarea.placeholder = 'Skriv litt om hva dere ønsker hjelp med...';
                    
                } else if (selectedPath === 'utvikling') {
                    inquiryType.value = 'KI-utvikling & prosjekt';
                    
                    // Hide Foredrag specific fields
                    subjectGroup.style.display = 'none';
                    subjectInput.required = false;
                    subjectInput.value = 'KI-utvikling og prosjekt';
                    dateGroup.style.display = 'none';
                    
                    // Update labels
                    bodyLabel.textContent = 'Kort beskrivelse av prosjektet/behovet (valgfritt)';
                    bodyTextarea.placeholder = 'Skriv litt om hva dere ønsker å bygge eller løse...';
                }
            });
        });
    }
    const formStatus = document.getElementById('form-status');
    const submitButton = document.getElementById('submit-button');

    if (bookingForm) {
        bookingForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent the default form submission (redirect)

            const data = new FormData(bookingForm);

            // Show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sender...';
            formStatus.style.display = 'none';

            try {
                const response = await fetch(bookingForm.action, {
                    method: bookingForm.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = 'Takk for forespørselen! Jeg tar kontakt så snart som mulig.';
                    formStatus.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                    formStatus.style.color = '#4CAF50';
                    formStatus.style.border = '1px solid #4CAF50';
                    formStatus.style.display = 'block';
                    bookingForm.reset();
                } else {
                    const responseData = await response.json();
                    let errorMsg = 'Beklager, det oppstod en feil under sending.';
                    if (responseData.hasOwnProperty('errors')) {
                        errorMsg = responseData.errors.map(error => error.message).join(', ');
                    }
                    throw new Error(errorMsg);
                }
            } catch (error) {
                formStatus.textContent = error.message || 'Beklager, det oppstod en feil under sending. Vennligst send en e-post direkte i stedet.';
                formStatus.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
                formStatus.style.color = '#F44336';
                formStatus.style.border = '1px solid #F44336';
                formStatus.style.display = 'block';
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Send forespørsel';
            }
        });
    }
});