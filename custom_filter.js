<script>
document.addEventListener('DOMContentLoaded', function() {
    console.log('Custom filter initialized!');
    var galleries = document.querySelectorAll('.elementor-widget-gallery');
    
    galleries.forEach(function(widget) {
        var titles = widget.querySelectorAll('.elementor-gallery-title');
        var container = widget.querySelector('.elementor-gallery__container');
        var items = widget.querySelectorAll('.e-gallery-item');
        
        if(!container) return;
        
        // Force flex layout to override Elementor's absolute masonry positioning
        container.style.position = 'relative';
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.justifyContent = 'center';
        container.style.gap = '20px';
        container.style.height = 'auto';
        
        items.forEach(function(item) {
            item.style.position = 'relative';
            item.style.left = 'auto';
            item.style.top = 'auto';
            item.style.transform = 'none';
            item.style.width = 'calc(25% - 20px)'; // 4 columns
            item.style.minWidth = '250px';
            item.style.display = 'block';
            item.style.transition = 'opacity 0.4s ease';
        });

        titles.forEach(function(title) {
            // Remove Elementor's default pointer events block
            title.style.pointerEvents = 'auto';
            title.style.cursor = 'pointer';
            
            title.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Update active class
                titles.forEach(t => t.classList.remove('elementor-item-active'));
                title.classList.add('elementor-item-active');
                
                var filterValue = title.getAttribute('data-gallery-index');
                
                // Filter items
                items.forEach(function(item) {
                    var tagsStr = item.getAttribute('data-e-gallery-tags') || '';
                    var tags = tagsStr.split(',');
                    
                    if (filterValue === 'all' || tags.includes(filterValue)) {
                        item.style.display = 'block';
                        setTimeout(() => { item.style.opacity = '1'; }, 50);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => { item.style.display = 'none'; }, 400);
                    }
                });
            });
        });
    });
});
</script>
