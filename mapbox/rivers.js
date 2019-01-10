    var riverPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'riverLabel',
        minWidth:250
    });


    // Change the cursor to a pointer when the mouse is over the places layer. (in conjunction with 'mouseenter' listener)
    function riverHover(e) {
            map.getCanvas().style.cursor = 'pointer';
            var description = e.features[0].properties.GNIS_NAME;

            riverPopup
                .setLngLat(mouseCoord)
                .setHTML(description)
                .addTo(map);
            document.getElementsByClassName('mapboxgl-popup-content')[0].classList.add('riverLabel');

        }
    function riverUnhover() {
            map.getCanvas().style.cursor = '';
            riverPopup.remove();
        }

    function setRiverListener(target){
        map.on('mouseenter', target,riverHover);
        // Change it back to a pointer when it leaves.
        map.on('mouseleave', target, riverUnhover);
    }

    setRiverListener('riverTarget')
    
    
    map.on('zoom', function() {
       // map.setFilter('HU8Rivers',["<=","ZOOM",map.getZoom()]);
});