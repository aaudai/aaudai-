// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Don't prevent default for links that just have "#"
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            // Close mobile menu if open
            navMenu.classList.remove('active');

            // Smooth scroll to target
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Update active nav link
            updateActiveNavLink(href);
        }
    });
});

// Update Active Navigation Link
function updateActiveNavLink(sectionId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === sectionId) {
            link.classList.add('active');
        }
    });
}

// Intersection Observer for Active Navigation on Scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = `#${entry.target.id}`;
            updateActiveNavLink(sectionId);
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Modal Functionality
const modal = document.getElementById('purchaseModal');
const buyButtons = document.querySelectorAll('.btn-buy');
const closeModal = document.querySelector('.modal-close');

// Store e-book data
const ebookData = {
    'German for Beginners': '$19.99',
    'German Intermediate Complete': '$29.99',
    'German Advanced Mastery': '$34.99',
    'Complete Grammar Reference': '$24.99',
    'Essential German Vocabulary': '$19.99',
    'German Conversation Practice': '$22.99',
    'Master German - Complete Collection': '$99.99'
};

// Open modal when buy button is clicked
buyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();

        // Get the e-book card
        const card = button.closest('.ebook-card, .bundle-card');
        let title, price;

        if (card.classList.contains('bundle-card')) {
            title = 'Master German - Complete Collection';
            price = '$99.99';
        } else {
            title = card.querySelector('.ebook-title').textContent;
            const priceElement = card.querySelector('.price');
            price = priceElement.textContent.trim();

            // If there's an old price, get just the new price
            const newPriceSpan = priceElement.querySelector('.old-price');
            if (newPriceSpan) {
                price = priceElement.childNodes[priceElement.childNodes.length - 1].textContent.trim();
            }
        }

        // Set modal content
        document.getElementById('modalEbookTitle').textContent = title;
        document.getElementById('modalEbookPrice').textContent = price;

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close modal
if (closeModal) {
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Handle purchase form submission
const purchaseForm = document.querySelector('.purchase-form');
if (purchaseForm) {
    purchaseForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('buyerName').value;
        const email = document.getElementById('buyerEmail').value;
        const ebookTitle = document.getElementById('modalEbookTitle').textContent;
        const ebookPrice = document.getElementById('modalEbookPrice').textContent;

        // In a real application, this would process the payment
        // For now, we'll just show a success message
        alert(`Thank you for your purchase, ${name}!\n\nYou will receive "${ebookTitle}" at ${email} shortly.\n\nTotal: ${ebookPrice}\n\nIn a production environment, this would redirect to a secure payment processor.`);

        // Close modal and reset form
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        purchaseForm.reset();
    });
}

// Handle contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // In a real application, this would send the message to a server
        alert(`Thank you for your message, ${name}!\n\nWe'll respond to ${email} as soon as possible.\n\nYour message:\n${message}`);

        // Reset form
        contactForm.reset();
    });
}

// Add scroll animation for feature cards
const featureCards = document.querySelectorAll('.feature-card, .ebook-card');

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 50);
            cardObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

featureCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    cardObserver.observe(card);
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }

    lastScroll = currentScroll;
});

// Add loading state to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Only add loading state if it's a form submit button
        if (this.type === 'submit') {
            const originalText = this.textContent;
            this.textContent = 'Processing...';
            this.disabled = true;

            // Re-enable after form handling (this would be removed in production)
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
        }
    });
});

// Countdown timer for special offers (optional enhancement)
function createCountdown() {
    const bundleCard = document.querySelector('.bundle-card');
    if (!bundleCard) return;

    // Set countdown end time (24 hours from now for demo)
    const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);

    const countdownElement = document.createElement('div');
    countdownElement.className = 'countdown';
    countdownElement.style.cssText = `
        text-align: center;
        padding: 1rem;
        background: rgba(239, 68, 68, 0.1);
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        color: #ef4444;
        font-weight: 600;
    `;

    bundleCard.insertBefore(countdownElement, bundleCard.firstChild);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endTime - now;

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance > 0) {
            countdownElement.innerHTML = `⏰ Special offer ends in: ${hours}h ${minutes}m ${seconds}s`;
        } else {
            countdownElement.innerHTML = '🎉 New offer coming soon!';
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Initialize countdown on page load
createCountdown();

// Add to cart functionality (for future enhancement)
let cart = [];

function addToCart(ebookTitle, ebookPrice) {
    cart.push({ title: ebookTitle, price: ebookPrice });
    updateCartDisplay();
}

function updateCartDisplay() {
    // This would update a cart icon/counter in the navigation
    console.log('Cart updated:', cart);
}

// Performance optimization: Lazy load images if any are added later
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add print styles trigger
function printEbookInfo(ebookTitle) {
    window.print();
}

// Console welcome message
console.log('%c📚 Welcome to Deutsch Lernen!', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%cStart your German learning journey today!', 'color: #10b981; font-size: 14px;');
