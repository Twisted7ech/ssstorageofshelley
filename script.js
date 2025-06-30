// Ensure the DOM is fully loaded before running script
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking outside (optional, but good for UX)
    document.addEventListener('click', (event) => {
        if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target) && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Dark/Light Mode Toggle
    // Get the theme toggle button and icons
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    // Function to update the icons based on the current theme
    function updateThemeIcons() {
        if (document.documentElement.classList.contains('dark')) {
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        } else {
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        }
    }

    // Event listener for the theme toggle button
    themeToggle.addEventListener('click', () => {
        // Toggle the 'dark' class on the html element (Tailwind's JIT mode often uses html tag)
        document.documentElement.classList.toggle('dark');

        // Save the current theme preference to localStorage
        if (document.documentElement.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }

        // Update the visibility of sun/moon icons
        updateThemeIcons();
    });

    // Call updateThemeIcons initially when the script loads to ensure correct icon display
    // This will reflect the theme set by the inline script in the head
    updateThemeIcons();
});
