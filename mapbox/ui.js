var damsLoaded=false;
var guagesLoaded=false;
var watershedsLoaded=false;

$('#watersheds').change(function() {
   if($(this).is(":checked")) {
       if (watershedsLoaded ==false){
            addWatersheds(map);
           watershedsLoaded=true;
           console.log("loading watersheds");
       }
       map.setLayoutProperty('WBD','visibility','visible');
//       map.setLayoutProperty('allDams','visibility','visible');
//       document.getElementById('damContainer').style.display="block";
      
   }
   else {
        map.setLayoutProperty('WBD','visibility','none');
        map.setLayoutProperty('WBD-hilite','visibility','none');
       
   }
});

$('#dams').change(function() {
   if($(this).is(":checked")) {
       if (damsLoaded ==false){
            addDams(map);
           damsLoaded=true;
       }
       map.setLayoutProperty('damsCapacity','visibility','visible');
       map.setLayoutProperty('allDams','visibility','visible');
       document.getElementById('damContainer').style.display="block";
      
   }
   else {
        map.setLayoutProperty('damsCapacity','visibility','none');
        map.setLayoutProperty('allDams','visibility','none');
       document.getElementById('damInfo').innerHTML = "";
       document.getElementById('damContainer').style.display="none";
       
   }
});


$('#guages').change(function() {
   if($(this).is(":checked")) {
       if (guagesLoaded ==false){
            addGuages(map);
           guagesLoaded=true;
       }
       map.setLayoutProperty('guages','visibility','visible');
       document.getElementById('chartContainer').style.display = "block";
   }
   else {
        map.setLayoutProperty('guages','visibility','none');
        if (guageChart!= null){
         guageChart.destroy();   
        }
        //document.getElementById('watershedInfo').innerHTML = "";
        document.getElementById('chartContainer').style.display = "none";
        document.getElementById('guageDisclaimer').innerHTML = '';


   }
});
