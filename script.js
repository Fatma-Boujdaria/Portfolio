// ==================== MOBILE NAVIGATION ====================
document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.getElementById('menu-icon');
    const mobileNav = document.getElementById('mobileNav');
    const overlay = document.getElementById('overlay');

    if (!menuIcon) return; 

    
    function openMobileNav() {
        mobileNav.classList.add('active');
        if (overlay) overlay.classList.add('active');
        menuIcon.setAttribute('aria-expanded', 'true');
        mobileNav.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark');
        menuIcon.setAttribute('aria-label', 'Fermer le menu');
    }

    
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

    
    menuIcon.addEventListener('click', function() {
        if (mobileNav.classList.contains('active')) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    });

    
    if (overlay) {
        overlay.addEventListener('click', closeMobileNav);
    }

    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileNav();
        }
    });

    
    window.closeMobileNav = closeMobileNav;
});


// ==================== ANIMATIONS & SMOOTH SCROLL ====================

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

// Intersection Observer 
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

    
    mainImg.style.opacity = '0';
    setTimeout(() => {
        mainImg.src = clubPhotos[index].src;
        if (caption) caption.textContent = clubPhotos[index].caption;
        if (badge) badge.textContent = clubPhotos[index].badge;
        mainImg.style.opacity = '1';
    }, 200);
    
    
    thumbs.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}


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
    
    
    if (touchEndX < touchStartX - 50 && currentIndex < thumbs.length - 1) {
        changeCarousel(currentIndex + 1);
    }
    
    if (touchEndX > touchStartX + 50 && currentIndex > 0) {
        changeCarousel(currentIndex - 1);
    }
}
const form = document.getElementById('contactForm');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    formData.append("access_key", "9ae81a24-2bd4-4ed6-8325-d218ca2373bd");

    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

try {
        const object = Object.fromEntries(formData);
        object.access_key = "9ae81a24-2bd4-4ed6-8325-d218ca2373bd"; 

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(object)
        });

        const data = await response.json();

        if (data.success) { 
            alert("Success! Your message has been sent.");
            form.reset();
        } else {
            alert("Error: " + data.message);
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});