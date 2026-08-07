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
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburgerBtn && navMenu) {
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
});
