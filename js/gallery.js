/**
 * Gallery and Lightbox JavaScript for Musikcafe Zilini
 * Handles image gallery interactions and lightbox functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentImageIndex = 0;
    const images = [];

    // Collect all gallery images
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        images.push({
            src: img.src,
            alt: img.alt
        });

        // Click event to open lightbox
        item.addEventListener('click', function() {
            openLightbox(index);
        });

        // Keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Bild ansehen: ${img.alt}`);

        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    // Open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus management for accessibility
        lightboxClose.focus();
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Update lightbox image
    function updateLightboxImage() {
        const image = images[currentImageIndex];
        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
    }

    // Navigate to previous image
    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }

    // Navigate to next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    }

    // Event listeners
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function(e) {
            e.stopPropagation();
            showPreviousImage();
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', function(e) {
            e.stopPropagation();
            showNextImage();
        });
    }

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe right - show previous
                showPreviousImage();
            } else {
                // Swipe left - show next
                showNextImage();
            }
        }
    }

    // Preload adjacent images for better performance
    function preloadImage(index) {
        if (index >= 0 && index < images.length) {
            const img = new Image();
            img.src = images[index].src;
        }
    }

    // Preload next and previous images when lightbox opens or navigates
    function preloadAdjacentImages() {
        const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
        const nextIndex = (currentImageIndex + 1) % images.length;
        preloadImage(prevIndex);
        preloadImage(nextIndex);
    }

    // Call preload when opening lightbox or navigating
    lightbox.addEventListener('transitionend', function() {
        if (lightbox.classList.contains('active')) {
            preloadAdjacentImages();
        }
    });

    // Gallery hover effects
    galleryItems.forEach(item => {
        const img = item.querySelector('img');

        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });

        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    // Loading animation for images
    const galleryImages = document.querySelectorAll('.gallery-item img');

    galleryImages.forEach(img => {
        // Add loading state
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';

        // Show image when loaded
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });

            img.addEventListener('error', function() {
                console.error('Failed to load image:', this.src);
                // Add error styling or placeholder
                this.style.opacity = '0.5';
            });
        }
    });

    // Gallery filter/category functionality (if needed in future)
    function filterGallery(category) {
        galleryItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    // Expose filterGallery for potential future use
    window.filterGallery = filterGallery;

    // Image zoom on hover (subtle effect)
    galleryItems.forEach(item => {
        const overlay = item.querySelector('.gallery-overlay');

        item.addEventListener('mouseenter', function() {
            if (overlay) {
                overlay.style.transition = 'opacity 0.3s ease';
            }
        });
    });

    // Accessibility: Announce current image in lightbox
    function announceCurrentImage() {
        const announcement = `Bild ${currentImageIndex + 1} von ${images.length}`;
        // You could add a screen reader announcement here
        console.log(announcement);
    }

    // Call announce when navigating
    lightboxPrev?.addEventListener('click', announceCurrentImage);
    lightboxNext?.addEventListener('click', announceCurrentImage);

    console.log('🖼️ Gallery initialized with', images.length, 'images');
});