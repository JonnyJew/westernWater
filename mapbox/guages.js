function addGuages(map){   
    //add guages
    map.addLayer({
    "id": "guages",
    "type": "circle",
    "source": {
    "type": "geojson",
    "data": "../GEOJSON/huc14guages.geojson"
    },
    "layout": {
    },
    "paint": {
        "circle-opacity": 0.4,
        //"circle-stroke-width":1,
        "circle-stroke-color": "#9be4ff"

    }, 

    },'water');
}

map.on('mouseenter', 'guages', function (e) {
    map.getCanvas().style.cursor = 'pointer';
    var description = e.features[0].properties.GNIS_NAME;
});

map.on('mouseleave', 'guages', function () {
    map.getCanvas().style.cursor = '';
});

 //get YTD flow for guage
function getYTDGuageStats(myGuageID){
    var currentYear=new Date().getFullYear();
    var beginDate= new Date(currentYear,0,1);
    var nDays=parseInt((new Date()-beginDate)/1000/60/60/24);
    myGuageIDuageID="09180500";

    //var guageQuery = 'https://waterservices.usgs.gov/nwis/dv/?format=json&indent=on&sites=09180500&period=P5D&siteStatus=all';
    var guageQuery='https://waterservices.usgs.gov/nwis/dv/?format=json&indent=on&sites='+myGuageID+'&period=P'+nDays+'D&siteStatus=all';
    return guageQuery;
}
    
map.on('click','guages', function(e){
    
    var guageID = e.features[0].properties.siteID;
    var guageName = e.features[0].properties.name;
    var guageStatFile="../guagestats/"+guageID+".txt";
    document.getElementById('guageDisclaimer').innerHTML='';


    getFileFromServer(guageStatFile, function(text) {
        if (text === null) {
            alert("failed to load gauge:"+guageID)
	    document.getElementById('guageDisclaimer').innerHTML='Historic Avgs unavailable';
        }
        else {
            var monthday=[];
            var begin_dt=[];
            var end_dt	=[];
            var count_nu=[];
            var mean=[];
            var std	=[];
            var min	=[];
            var max=[];
            var p25=[];
            var p50=[];
            var p75=[];

            // By lines
            var lines = text.split('\n');
            lines=lines.slice(2,-1);//omits column headers and null row at end of data
            lines.map(function(item){
                  var tabs = item.split('\t');
                  monthday.push(tabs[1]);
                  begin_dt.push(tabs[2]);
                  end_dt.push(tabs[3]);
                  count_nu.push(tabs[4]);
                  mean.push(tabs[5]);
                  std.push(tabs[6]);
                  min.push(tabs[7]);
                  max.push(tabs[8]);
                  p25.push(tabs[14]);
                  p50.push(tabs[19]);
                  p75.push(tabs[24]);
            });

            //format monthday
            for(var i=0;i<monthday.length;i++){
                monthday[i]=monthday[i].slice(0,2)+"/"+monthday[i].slice(2);
            }

            var guageStats=[monthday,begin_dt,end_dt,min,p25,p50,mean,p75,max];
            var YTDflow=[];//empty array to be filled by asynch call below 

            getFileFromServer(getYTDGuageStats(guageID), function(text) {
                if (text === null) {
                    alert("failed to load")
                }
                else {
                    //console.log(text);
                    var guageData=JSON.parse(text);

                    //console.log(guageData.value.timeSeries)
                    for(var i = 0; i< guageData.value.timeSeries.length; i++){
                        //console.log(guageData.value.timeSeries[i].name.slice(-11,-6));
                        if( guageData.value.timeSeries[i].name.slice(-11,-6)=="00060"){//check that we are looking at CFS data
                            //console.log(guageData.value.timeSeries[i]);
                            var flowData=guageData.value.timeSeries[i].values[0].value;
                            for (var j =0; j<flowData.length; j++){
				if(flowData[j].value<0){//handles when gauge data records are error ex -999999
					flowData[j].value=null;
					document.getElementById('guageDisclaimer').innerHTML='Some YTD flows are unavailable and will not be shown. '
				}
                                YTDflow.push(flowData[j].value);
                            }
//                                for (var i=0; i < YTDflow.length; i ++){
//                                    console.log(YTDflow[i])   
//                                }
                        }
                    }
                }
                 //document.getElementById("map-overlay").style.width='30vw';
                drawGuageChart(guageName,guageStats,YTDflow);
                //resizes chart container 
                document.getElementById('chartContainer').style.height='350px';

            });



      };

    });


});
