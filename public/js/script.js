/* ========================================
   script.js - CSE Motors
   ======================================== */

/* Mobile Menu Toggle (if you add a hamburger menu) */
const menuToggle = document.querySelector('#menu-toggle');
const nav = document.querySelector('nav');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

/* Smooth Scroll for Anchor Links */
const links = document.querySelectorAll('a[href^="#"]');

links.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* Optional: Floating Card Effects (additional shadow on hover) */
const cards = document.querySelectorAll('.car-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
        card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
    });
});

/* Optional: Any future interactive scripts can be added here */