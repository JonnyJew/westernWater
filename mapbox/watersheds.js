    
function addWatersheds(map){
    map.addSource('HU8',{
                "type": "geojson",
                "data": "WBDHU8HUC14Simplified.geojson"
            });
        //add WBD 
    map.addLayer({
        "id": "WBD-hilite",
        "type": "fill",
        "source": 'HU8',
        "layout": {
        },
        "paint": {
            "fill-color": "#0909ff",
            "fill-opacity": 0.1,
            "fill-outline-color": "#000"
        },
        "filter" : ["==","HUC8","-99"]
        },'water');

    map.addLayer({
        "id": "WBD",
        "type": "fill",
        "source": 'HU8',
        "layout": {
        },
        "paint": {
            "fill-color": "#0909ff",
            "fill-opacity": 0,
            //"fill-outline-color": "#000"
        },

        },'water');
    
}

map.on('mousemove', 'WBD', function (e) {
    //console.log(e.features[0].properties["HUC8"]);
    var huc8=e.features[0].properties["HUC8"];
    map.setFilter('WBD-hilite',["==","HUC8",huc8]);


});


//array to hold ids of HUCs already loaded
var loadedHUCs=[];
map.on('click', 'WBD-hilite', function (e) {
    var huc8=e.features[0].properties["HUC8"];
    map.setFilter('WBD-hilite',["==","HUC8",huc8]);
    var url="..\\GEOJSON\\riversHUC8\\"+huc8+".GeoJSON";
    
    //hide other HUCs Rivers and disable listeners
    loadedHUCs.forEach(function(loadedHUC){
        map.setLayoutProperty(loadedHUC,'visibility','none');
        map.off('mousemove',huc8,riverHover);
        map.off('mousemove',huc8,riverUnhover);
    });
    
    if(!loadedHUCs.includes(huc8)){
        loadedHUCs.push(huc8);
        map.addSource(huc8+'src',{
                "type": "geojson",
                "data": url
        });
        
        map.addLayer({
            "id": huc8,
            "type": "line",
            "source": huc8+'src',
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
           // "maxzoom": 17,
            "paint": {
                "line-color": "#096390",
                "line-width": 2
            }
             //,
            //"filter":["==","ZOOM",7]
        
            },'water');
        
        
        setRiverListener(huc8);//defined in rivers.js
    }
    
    else{
        map.setLayoutProperty(huc8,'visibility','visible')
    }
    
    

});

//map.on('click','HU8Rivers', function(e){
//    var riverID = e.features[0].properties.GNIS_ID;
//    var HU8=HU8Key[riverID];
//
//    //filter so highlighted river is part of "selectedRiver"
//    map.setFilter('selectedRiver',["==","GNIS_ID",riverID]);
//    //make accompanying watershed visible
//    //map.setFilter('WBD-Fill',["==","HUC8",HU8]);
//    //must queryALL to get properties of json
//   // var selectedFeature = map.querySourceFeatures('HU8',{
//    //filter: ['==',"HUC8",HU8]});       
//
//   //document.getElementById('watershedInfo').innerHTML = 
//       //"Name:"+selectedFeature[0]['properties']['NAME']
//       //+"<br/>"+"Acres:"+selectedFeature[0]['properties']["AREAACRES"];
//
//    //var description = e.features[0].properties.description;
//
//});