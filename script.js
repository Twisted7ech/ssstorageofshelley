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
        // Check the 'dark' class on the html element
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

    // Storage Size Recommender Logic (Gemini API Integration)
    const storageItemsInput = document.getElementById('storage-items-input');
    const getRecommendationButton = document.getElementById('get-recommendation-button');
    const recommendationResults = document.getElementById('recommendation-results');
    const recommendationText = document.getElementById('recommendation-text');
    const loadingSpinner = document.getElementById('loading-spinner');

    getRecommendationButton.addEventListener('click', async () => {
        const items = storageItemsInput.value.trim();
        if (!items) {
            recommendationResults.classList.remove('hidden');
            recommendationText.innerHTML = '<p class="text-red-500">Please enter some items to get a recommendation.</p>';
            return;
        }

        recommendationResults.classList.remove('hidden');
        recommendationText.innerHTML = ''; // Clear previous results
        loadingSpinner.classList.remove('hidden'); // Show loading spinner
        getRecommendationButton.disabled = true; // Disable button during loading

        try {
            const prompt = `Given the following items that a user wants to store, recommend the best storage unit size from the options: 8'x10', 10'x12', and 10'x20'. Provide only the recommended size and a brief reason.
            Items: ${items}
            `;

            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });

            const payload = { contents: chatHistory };
            const apiKey = ""; // Canvas will automatically provide the API key
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                recommendationText.innerHTML = `<p>${text}</p>`;
            } else {
                recommendationText.innerHTML = '<p class="text-red-500">Could not get a recommendation. Please try again.</p>';
                console.error('Unexpected API response structure:', result);
            }
        } catch (error) {
            recommendationText.innerHTML = `<p class="text-red-500">An error occurred: ${error.message}. Please try again.</p>`;
            console.error('Error fetching recommendation:', error);
        } finally {
            loadingSpinner.classList.add('hidden'); // Hide loading spinner
            getRecommendationButton.disabled = false; // Re-enable button
        }
    });
});
