// Mobile Navigation
const menuIcon = document.getElementById('menu-icon');
const mobileNav = document.getElementById('mobileNav');
const overlay = document.getElementById('overlay');

function openMobileNav() {
    mobileNav.classList.add('active');
    overlay.classList.add('active');
    menuIcon.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Change icon to X
    menuIcon.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    menuIcon.setAttribute('aria-label', 'Fermer le menu');
}

function closeMobileNav() {
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    menuIcon.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Change icon back to bars
    menuIcon.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    menuIcon.setAttribute('aria-label', 'Ouvrir le menu');
}

menuIcon.addEventListener('click', () => {
    if (mobileNav.classList.contains('active')) {
        closeMobileNav();
    } else {
        openMobileNav();
    }
});

// Close mobile nav on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        closeMobileNav();
    }
});

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.padding = '0.5rem 1.5rem';
        header.style.backgroundColor = 'rgba(22, 22, 22, 0.95)';
    } else {
        header.style.padding = '0.75rem 2rem';
        header.style.backgroundColor = 'rgba(22, 22, 22, 0.85)';
    }
    
    lastScroll = currentScroll;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.info-box > *').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
});
// ==================== LIGHTBOX GALLERY ====================
let currentGallery = [];
let currentIndex = 0;

function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    // Get all images from the same gallery
    const gallery = element.closest('.gallery-masonry, .club-carousel');
    const items = gallery.querySelectorAll('.gallery-item, .carousel-main');
    
    currentGallery = Array.from(items).map(item => ({
        src: item.querySelector('img').src,
        caption: item.querySelector('.gallery-overlay span, .carousel-caption p')?.textContent || ''
    }));
    
    // Find current index
    const clickedSrc = element.querySelector('img').src;
    currentIndex = currentGallery.findIndex(item => item.src === clickedSrc);
    
    // Show lightbox
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateLightbox() {
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    lightboxImg.src = currentGallery[currentIndex].src;
    lightboxCaption.textContent = currentGallery[currentIndex].caption;
}

function closeLightbox(event) {
    if (event.target === event.currentTarget || event.target.closest('.lightbox-close')) {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function navigateLightbox(direction) {
    currentIndex += direction;
    
    if (currentIndex < 0) {
        currentIndex = currentGallery.length - 1;
    } else if (currentIndex >= currentGallery.length) {
        currentIndex = 0;
    }
    
    updateLightbox();
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox({ target: lightbox, currentTarget: lightbox });
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ==================== CLUB CAROUSEL ====================
const clubPhotos = [
    {
        src: 'assets/images/clubs/hackathon-team.jpg',
        caption: '2nd Place — AI-powered solution for campus navigation',
        badge: 'Hackathon 2025'
    },
    {
        src: 'assets/images/clubs/gdsc-workshop.jpg',
        caption: 'Leading a workshop on React hooks and state management',
        badge: 'GDSC Workshop'
    },
    {
        src: 'assets/images/clubs/art-exhibition.jpg',
        caption: 'Our annual art exhibition — 50+ student artworks displayed',
        badge: 'Art Exhibition'
    },
    {
        src: 'assets/images/clubs/tech-talk.jpg',
        caption: 'Speaking about women in tech and my journey into software engineering',
        badge: 'Tech Talk'
    }
];

function changeCarousel(index) {
    const mainImg = document.getElementById('carouselMain');
    const caption = document.querySelector('.carousel-caption p');
    const badge = document.querySelector('.caption-badge');
    const thumbs = document.querySelectorAll('.thumb');
    
    // Update main image with fade
    mainImg.style.opacity = '0';
    setTimeout(() => {
        mainImg.src = clubPhotos[index].src;
        caption.textContent = clubPhotos[index].caption;
        badge.textContent = clubPhotos[index].badge;
        mainImg.style.opacity = '1';
    }, 200);
    
    // Update thumbs
    thumbs.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Touch swipe for carousel
let touchStartX = 0;
let touchEndX = 0;

const carousel = document.getElementById('clubCarousel');
if (carousel) {
    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const currentThumb = document.querySelector('.thumb.active');
    const thumbs = Array.from(document.querySelectorAll('.thumb'));
    const currentIndex = thumbs.indexOf(currentThumb);
    
    if (touchEndX < touchStartX - 50 && currentIndex < thumbs.length - 1) {
        changeCarousel(currentIndex + 1);
    }
    if (touchEndX > touchStartX + 50 && currentIndex > 0) {
        changeCarousel(currentIndex - 1);
    }
}