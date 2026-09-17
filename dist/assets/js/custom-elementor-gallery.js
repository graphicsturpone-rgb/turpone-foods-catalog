document.addEventListener('DOMContentLoaded', function() {
    var container = document.querySelector('.elementor-gallery__container');
    if(!container) return;

    // Inject Responsive CSS for the Gallery Items
    var style = document.createElement('style');
    style.textContent = \
        .elementor-gallery__container {
            padding-bottom: 0 !important;
            height: auto !important; /* Let Isotope set the height */
        }
        .e-gallery-item {
            display: block !important;
            position: absolute;
            width: 25%;
            padding: 10px; /* Gap between items */
        }
        @media (max-width: 1024px) {
            .e-gallery-item { width: 33.333%; }
        }
        @media (max-width: 768px) {
            .e-gallery-item { width: 50%; }
        }
        @media (max-width: 480px) {
            .e-gallery-item { width: 100%; }
        }
    \;
    document.head.appendChild(style);

    container.style.paddingBottom = '0px';

    // Map tags to classes for foolproof Isotope filtering
    var items = container.querySelectorAll('.e-gallery-item');
    items.forEach(function(item) {
        var tagsStr = item.getAttribute('data-e-gallery-tags') || '';
        if(tagsStr) {
            tagsStr.split(',').forEach(function(tag) {
                item.classList.add('tag-' + tag.trim());
            });
        }
    });

    window.iso = new Isotope(container, {
        itemSelector: '.e-gallery-item',
        layoutMode: 'masonry',
        percentPosition: true,
        transitionDuration: '0.4s'
    });

    // Layout when any image loads
    var images = container.querySelectorAll('img');
    images.forEach(function(img) {
        img.addEventListener('load', function() {
            window.iso.layout();
        });
    });
    
    setTimeout(function() { window.iso.layout(); }, 500);

    // Bind filter clicks
    var titles = document.querySelectorAll('.elementor-gallery-title');
    titles.forEach(function(title) {
        title.style.pointerEvents = 'auto';
        title.style.cursor = 'pointer';
        
        title.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active class
            titles.forEach(t => t.classList.remove('elementor-item-active'));
            title.classList.add('elementor-item-active');
            
            var filterValue = title.getAttribute('data-gallery-index');
            var filterClass = (filterValue === 'all') ? '*' : '.tag-' + filterValue;
            
            window.iso.arrange({
                filter: filterClass
            });
        });
    });
});
