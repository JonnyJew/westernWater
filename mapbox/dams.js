function addDams(map){
    map.addSource("damSource",{
                "type": "geojson",
                "data": "../GEOJSON/dams.geojson"
            })
            //add Dams
            map.addLayer({
            "id": "damsCapacity",
            "type": "circle",
            "source":"damSource",
            "layout":{},
            "filter":["<",-1,["to-number",["get","MAXCAP"]]],
            "paint": {
                "circle-color": "#c496cc",
                ///linear sizing of circle radius
                "circle-radius": [
                "interpolate", ["linear"], ["zoom"],
                // when zoom is 0, set each feature's circle radius to the value of its "NORMCAP" property
                5, ["/",["to-number",["get", "NORMCAP"]],1500000],
                8, ["/",["to-number",["get", "NORMCAP"]],100000],
                //14, ["/",["to-number",["get", "NORMCAP"]],70000]
            ],
                "circle-opacity": 0.3
   
            }
            },'riverTarget');
            
            map.addLayer({
            "id": "allDams",
            "type": "circle",
            "source":"damSource",
            "layout":{},
            "filter":["<",-1,["to-number",["get","MAXCAP"]]],
            "paint": {
                "circle-color": "#cb2be6",
                "circle-radius":5,
                "circle-opacity":0.3
                
            }
            },'riverTarget');
}






var damPopup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
}); 

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


map.on('mouseenter', 'damsCapacity', function (e) {
    map.getCanvas().style.cursor = 'pointer';
   var description = e.features[0].properties.DAMNAME + "<br/>Normal* capacity: " +numberWithCommas(e.features[0].properties.NORMCAP);

    damPopup
        .setLngLat(mouseCoord)
        .setHTML(toTitleCase(description))
        .addTo(map);
});
map.on('mouseenter', 'allDams', function (e) {
    map.getCanvas().style.cursor = 'pointer';
   var description = e.features[0].properties.DAMNAME + "<br/>Normal* capacity: "+numberWithCommas(e.features[0].properties.NORMCAP);

    damPopup
        .setLngLat(mouseCoord)
        .setHTML(toTitleCase(description))
        .addTo(map);
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'damsCapacity', function () {
    map.getCanvas().style.cursor = '';
    damPopup.remove();
});
map.on('mouseleave', 'allDams', function () {
    map.getCanvas().style.cursor = '';
    damPopup.remove();
});

map.on('click','damsCapacity', function(e){
    var damName = e.features[0].properties.DAMNAME;
    var resName = e.features[0].properties.RESNAME;
    var ownerName = e.features[0].properties.OWNERNAME;
    var isFed="No";
    var ownerCode = e.features[0].properties.OWNERCODE;
    if (ownerCode == 2){
        ownerName="U.S. Bureau of Reclamation";
        isFed="Yes";
    }
    else if (ownerCode ==3) {
        ownerName= "U.S. Army Corps of Engineers";
        isFed="Yes";
    }
    else{
        ownerName=toTitleCase(ownerName);   
    }
    if (ownerCode==5){
     isFed="Yes";   
    }
    var maxCap = numberWithCommas(e.features[0].properties.MAXCAP);
    var normCap = numberWithCommas(e.features[0].properties.NORMCAP);
    var river = e.features[0].properties.RIVER;
    var year = e.features[0].properties.YEAR;
    var purpCode = e.features[0].properties.PURP;
    var purp=''
    if (purpCode.indexOf('C') > -1)
        { purp=purp+"Flood Control "; }
    if (purpCode.indexOf('D') > -1)
        { purp=purp+"Debris Control "; }
    if (purpCode.indexOf('H') > -1)
        { purp=purp+"HydroElectric "; }
    if (purpCode.indexOf('I') > -1)
        { purp=purp+"Irrigation "; }
    if (purpCode.indexOf('N') > -1)
        { purp=purp+"Navigation "; }
    if (purpCode.indexOf('O') > -1)
        { purp=purp+"Other "; }
    if (purpCode.indexOf('P') > -1)
        { purp=purp+"Stock/Farm Pond "; }
    if (purpCode.indexOf('R') > -1)
        { purp=purp+"Recreation "; }
    if (purpCode.indexOf('S') > -1)
        { purp=purp+"Water Supply "; }
    

   document.getElementById('damInfo').innerHTML = 
       "Dam Name: "+toTitleCase(damName)+"<br/>"+
       "Reservoir Name: "+toTitleCase(resName)+"<br/>"+
       "River Dammed: "+toTitleCase(river)+"<br/>"+
       "Owner: "+ownerName+"<br/>"+
       "Max Capacity: "+maxCap+" Acre Feet<br/>"+
       "Normal Capacity: "+normCap+" Acre Feet<br/>"+
       "Year Constructed: "+year+"<br/>"+
       "Purpose: "+ purp+"<br/>"+
        "Federally Managed: "+isFed;
   
       


});

map.on('click','allDams', function(e){
    if (guageChart!= null){
     guageChart.destroy();   
    }
    var damName = e.features[0].properties.DAMNAME;
    var resName = e.features[0].properties.RESNAME;
    var ownerName = e.features[0].properties.OWNERNAME;
    var isFed="No";
    var ownerCode = e.features[0].properties.OWNERCODE;
    if (ownerCode == 2){
        ownerName="U.S. Bureau of Reclamation";
        isFed="Yes";
    }
    else if (ownerCode ==3) {
        ownerName= "U.S. Army Corps of Engineers";
        isFed="Yes";
    }
    else{
        ownerName=toTitleCase(ownerName);   
    }
    if (ownerCode==5){
     isFed="Yes";   
    }
    var maxCap = numberWithCommas(e.features[0].properties.MAXCAP);
    var normCap = numberWithCommas(e.features[0].properties.NORMCAP);
    var river = e.features[0].properties.RIVER;
    var year = e.features[0].properties.YEAR;
    var purpCode = e.features[0].properties.PURP;
    var purp=''
    if (purpCode.indexOf('C') > -1)
        { purp=purp+"Flood Control "; }
    if (purpCode.indexOf('D') > -1)
        { purp=purp+"Debris Control "; }
    if (purpCode.indexOf('H') > -1)
        { purp=purp+"HydroElectric "; }
    if (purpCode.indexOf('I') > -1)
        { purp=purp+"Irrigation "; }
    if (purpCode.indexOf('N') > -1)
        { purp=purp+"Navigation "; }
    if (purpCode.indexOf('O') > -1)
        { purp=purp+"Other "; }
    if (purpCode.indexOf('P') > -1)
        { purp=purp+"Stock/Farm Pond "; }
    if (purpCode.indexOf('R') > -1)
        { purp=purp+"Recreation "; }
    if (purpCode.indexOf('S') > -1)
        { purp=purp+"Water Supply "; }
    

   document.getElementById('damInfo').innerHTML = 
       "Dam Name: "+toTitleCase(damName)+"<br/>"+
       "Reservoir Name: "+toTitleCase(resName)+"<br/>"+
       "River Dammed: "+toTitleCase(river)+"<br/>"+
       "Owner: "+ownerName+"<br/>"+
       "Max Capacity: "+maxCap+" Acre Feet<br/>"+
       "Normal Capacity: "+normCap+" Acre Feet<br/>"+
       "Year Constructed: "+year+"<br/>"+
       "Purpose: "+ purp+"<br/>"+
        "Federally Managed: "+isFed;
   
       


});

