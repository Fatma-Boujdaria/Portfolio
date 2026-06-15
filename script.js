// ==================== MOBILE NAVIGATION ====================
document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.getElementById('menu-icon');
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.getElementById('overlay');

    if (!menuIcon) return; 

    // 1. Fonction d'ouverture
    function openMobileNav() {
        mobileNav.classList.add('active');
        if (overlay) overlay.classList.add('active');
        menuIcon.setAttribute('aria-expanded', 'true');
        mobileNav.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Échange de classes propre pour la croix (pas de innerHTML)
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark');
        menuIcon.setAttribute('aria-label', 'Fermer le menu');
    }

    // 2. Fonction de fermeture
    function closeMobileNav() {
        mobileNav.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        menuIcon.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restaure le scroll proprement
        
        // Échange de classes propre pour les 3 traits
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
        menuIcon.setAttribute('aria-label', 'Ouvrir le menu');
    }

    // 3. Écouteur de clic sur le bouton burger
    menuIcon.addEventListener('click', function() {
        if (mobileNav.classList.contains('active')) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    });

    // 4. Fermeture au clic sur l'overlay
    if (overlay) {
        overlay.addEventListener('click', closeMobileNav);
    }

    // 5. Fermeture avec la touche Échap (Escape)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileNav();
        }
    });

    // Expose la fonction globalement pour les onclick="closeMobileNav()" du HTML
    window.closeMobileNav = closeMobileNav;
});


// ==================== ANIMATIONS & SMOOTH SCROLL ====================
// Smooth scroll pour les liens d'ancrage
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

// Intersection Observer pour les animations d'affichage (Fade-in)
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

// Observe les éléments enfants de la boîte d'info pour les animer
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
    const gallery = element.closest('.gallery-masonry, .club-carousel');
    const items = gallery.querySelectorAll('.gallery-item, .carousel-main');
    
    currentGallery = Array.from(items).map(item => ({
        src: item.querySelector('img').src,
        caption: item.querySelector('.gallery-overlay span, .carousel-caption p')?.textContent || ''
    }));
    
    const clickedSrc = element.querySelector('img').src;
    currentIndex = currentGallery.findIndex(item => item.src === clickedSrc);
    
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

// Navigation Lightbox au clavier
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !lightbox.classList.contains('active')) return;
    
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
    
    if (!mainImg) return;

    // Animation de transition fluide (Fade)
    mainImg.style.opacity = '0';
    setTimeout(() => {
        mainImg.src = clubPhotos[index].src;
        if (caption) caption.textContent = clubPhotos[index].caption;
        if (badge) badge.textContent = clubPhotos[index].badge;
        mainImg.style.opacity = '1';
    }, 200);
    
    // Mise à jour de la classe active des miniatures
    thumbs.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Gestion du balayage tactile (Swipe) pour mobile sur le Carousel
let touchStartX = 0;
let touchEndX = 0;

const carousel = document.getElementById('clubCarousel');
if (carousel) {
    carousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const currentThumb = document.querySelector('.thumb.active');
    const thumbs = Array.from(document.querySelectorAll('.thumb'));
    if (!currentThumb || thumbs.length === 0) return;

    const currentIndex = thumbs.indexOf(currentThumb);
    
    // Swipe vers la gauche (suivant)
    if (touchEndX < touchStartX - 50 && currentIndex < thumbs.length - 1) {
        changeCarousel(currentIndex + 1);
    }
    // Swipe vers la droite (précédent)
    if (touchEndX > touchStartX + 50 && currentIndex > 0) {
        changeCarousel(currentIndex - 1);
    }
}