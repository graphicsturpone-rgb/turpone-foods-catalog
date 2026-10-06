/**
 * Hero Background Slider Controller
 * Sequence:
 *   Slide 0: web-slider-1 (5s)
 *   Slide 1: web-slider-2 (5s)
 *   Slide 2: web-slider-3 (5s)
 *   Slide 3: turponefoods-hero-website.mp4 (plays until video finishes)
 *   -> loops back to Slide 0
 */
(function() {
    function initHeroSlider() {
        const sliderContainer = document.querySelector('.hero-slider-bg');
        if (!sliderContainer) return;

        const slides = sliderContainer.querySelectorAll('.hero-slide');
        if (!slides.length) return;

        const video = sliderContainer.querySelector('video');
        let currentSlide = 0;
        let slideTimer = null;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            currentSlide = index;
            clearTimeout(slideTimer);

            const activeSlide = slides[index];
            const isVideoSlide = activeSlide.classList.contains('hero-slide-video');

            if (isVideoSlide && video) {
                video.currentTime = 0;
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(err => {
                        console.warn('Hero video autoplay error:', err);
                        // Fallback if autoplay is blocked: advance after 8 seconds
                        slideTimer = setTimeout(nextSlide, 8000);
                    });
                }
            } else {
                if (video && !video.paused) {
                    video.pause();
                }
                // Image slides stay for exactly 5 seconds
                slideTimer = setTimeout(nextSlide, 5000);
            }
        }

        function nextSlide() {
            const nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }

        // When the video ends, transition to the next slide (Slide 0)
        if (video) {
            video.addEventListener('ended', function() {
                nextSlide();
            });
        }

        // Start slider with slide 0
        showSlide(0);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeroSlider);
    } else {
        initHeroSlider();
    }
})();
