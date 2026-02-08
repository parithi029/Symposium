// DOM Elements
const navbar = document.getElementById('navbar');
const registrationForm = document.getElementById('registrationForm');
const modal = document.getElementById('successModal');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModal');
const emailInput = document.getElementById('email');
const mobileInput = document.getElementById('mobile');
const emailError = document.getElementById('emailError');
const mobileError = document.getElementById('mobileError');

// Scroll Effect for Navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg', 'bg-deepBlue/95');
    } else {
        navbar.classList.remove('shadow-lg', 'bg-deepBlue/80');
    }
});

// Countdown Timer Logic
function updateCountdown() {
    const targetDate = new Date('February 5, 2026 00:00:00').getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<div class="text-2xl font-bold text-white">Event Started!</div>';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const timeUnits = [
        { value: days, label: 'Days' },
        { value: hours, label: 'Hours' },
        { value: minutes, label: 'Minutes' },
        { value: seconds, label: 'Seconds' }
    ];

    const countdownContainer = document.getElementById('countdown');
    countdownContainer.innerHTML = timeUnits.map(unit => `
        <div class="countdown-box text-center">
            <div class="countdown-number">${unit.value < 10 ? '0' + unit.value : unit.value}</div>
            <div class="countdown-label">${unit.label}</div>
        </div>
    `).join('');
}

setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Form Validation and Submission
registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailError.classList.remove('hidden');
        emailInput.classList.add('border-red-500');
        isValid = false;
    } else {
        emailError.classList.add('hidden');
        emailInput.classList.remove('border-red-500');
    }

    // Mobile Validation (Exactly 10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobileInput.value)) {
        mobileError.classList.remove('hidden');
        mobileInput.classList.add('border-red-500');
        isValid = false;
    } else {
        mobileError.classList.add('hidden');
        mobileInput.classList.remove('border-red-500');
    }

    if (isValid) {
        // Save to localStorage
        const formData = {
            id: Date.now(), // Simple unique ID
            teamLeader: registrationForm.elements['teamLeader'].value,
            college: registrationForm.elements['college'].value,
            department: registrationForm.elements['department'].value,
            year: registrationForm.elements['year'].value,
            email: emailInput.value,
            mobile: mobileInput.value,
            event: registrationForm.elements['event'].value,
            timestamp: new Date().toLocaleString()
        };

        const existingRegistrations = JSON.parse(localStorage.getItem('symposium_registrations') || '[]');
        existingRegistrations.push(formData);
        localStorage.setItem('symposium_registrations', JSON.stringify(existingRegistrations));

        // Show Success Modal
        modal.classList.remove('hidden');
        // Small delay for animation
        setTimeout(() => {
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 10);

        // Optional: Reset form
        registrationForm.reset();
    }
});

// Close Modal Logic
closeModalBtn.addEventListener('click', () => {
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // Match transition duration
});

// Close modal on outside click
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalBtn.click();
    }
});

// Real-time Validation Feedback
emailInput.addEventListener('input', () => {
    if (emailError.classList.contains('hidden')) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(emailInput.value)) {
        emailError.classList.add('hidden');
        emailInput.classList.remove('border-red-500');
    }
});

mobileInput.addEventListener('input', (e) => {
    // specific behavior: only allow numbers
    e.target.value = e.target.value.replace(/[^0-9]/g, '');

    if (mobileError.classList.contains('hidden')) return;
    if (e.target.value.length === 10) {
        mobileError.classList.add('hidden');
        mobileInput.classList.remove('border-red-500');
    }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');

        // Change icon based on state
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });

    // Close mobile menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        });
    });
}
