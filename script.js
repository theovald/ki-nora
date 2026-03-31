document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');

    // Check for saved theme preference or use dark as default
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        updateIcons(false);
    } else {
        // Default is dark
        body.classList.add('dark-theme');
        updateIcons(true);
    }

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

    // Handle form submission asynchronously
    const bookingForm = document.getElementById('booking-form');
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