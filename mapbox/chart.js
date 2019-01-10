var guageChart=null;

function drawGuageChart(guageName, guageStats, YTDflow){
      
    var canvas=document.getElementById('guageChart');
    var ctx = canvas.getContext('2d');
    if (guageChart!= null){
     guageChart.destroy();   
    }
    
    

    guageChart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
        ////referenc: guageData=[monthday,begin_dt,end_dt,min,p25,p50,mean,p75,max];

        labels: guageStats[0],
        datasets: [
            {label: "YTD Flow",
            //backgroundColor: 'rgb(165, 226, 253)',
            borderColor: 'rgb(90, 85, 235)',
            fill: false,
            data: YTDflow,
            pointRadius: 0},
            
            {label: "25% flow",
            fill: 'origin',
            backgroundColor: 'rgb(255, 255, 255)',
            borderColor: 'rgb(255, 255, 255)',
            borderWidth: 0,
           
            data: guageStats[4],//p25
            pointRadius:0
            },
            
            {label: "Median Flow",
            fill: '-1',
            backgroundColor: 'rgb(247, 100, 104,0.2)',
            borderColor: 'rgb(247, 100, 104,0.2)',
            borderWidth: 0,
            
            data: guageStats[5],//p50
             pointRadius: 0 },    
            
            {label: "75% flow",
            backgroundColor: 'rgb(120, 200, 253,0.2)',
            borderColor: 'rgb(120, 200, 253,0.2)',
            borderWidth: 0,
            fill: '-1',
            data: guageStats[6],//p75
            pointRadius: 0 
            }]
    },
    

    // Configuration options go here
    options: {
        plugins:{
         filler:{
            propagate: true
        }
        },
        title:{
            display: true,
            text: guageName
        },
        scales: {
            xAxes: [{
                ticks: {
                    autoSkip: true,
                    autoSkipPadding:10
                }
            }],
            
            yAxes: [{
                scaleLabel:{
                display: true,
                labelString:'ft'+String.fromCharCode(0179)+'/s'
                }
            }]
        },
        responsive: true,
        maintainAspectRatio: false
    }
});
}


