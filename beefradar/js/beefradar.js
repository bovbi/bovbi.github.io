$( document ).ready(function() {
    getDataBeefradarGauge();
    getDataBeefradarBarWeek();

    Highcharts.setOptions({
        lang: {
            decimalPoint: ',',
            thousandsSep: '.'
        }
    });

});

function getDataBeefradarGauge(){
    var d = new Date();
    $.ajax({
        dataType: "json",
        url: "datasource/sheet_beefradar.js",
        data: {t : d.getTime()},
        success: function(data){
            renderBeefradarGauge(data.data);
            var inicio = data.data[0].inicio;
            var fim = data.data[0].fim;
            
            $('#beefradar-inicio').text(inicio);
            $('#beefradar-fim').text(fim);
        }
    });
}

function getDataBeefradarBarWeek(){
    var d = new Date();
    $.ajax({
        dataType: "json",
        url: "datasource/sheet_precos.js",
        data: {t : d.getTime()},
        success: function(data){
            renderBeefradarBarWeek(data.data);
            renderBeefradarBoxPlot(data.data)
        }
    });
}

function renderBeefradarGauge(data){
    var series=[];
    //console.log(data);
    $.each(data, function( index, value ) {
        series[index] = {
            name : value.status,
            y : value.percentual,
            color : value.cor
        };
    });

    
    $('#beefradar-gauge').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Status Beef Radar'
        },
        subtitle: {
            text: 'Fonte: NF2R'
        },
        credits: {
            enabled: true,
            href: "http://www.bovbi.com.br",
            text: "bovbi.com.br"
        }, 
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: false
            },
            series: {
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        //console.log(this);
                        return this.key + ' '+this.percentage.toFixed(0) + '%';
                    },
                    distance: -50,
                    style : {"color": "contrast", "fontSize": "14px", "fontWeight": "bold", "textShadow": "0 0 6px contrast, 0 0 3px contrast" }
                        //color:'white'
                    }
                }
            },
            series: [{
                name: 'Percentual',
                data: series
            }]
        });
}

//Box Plot automatized functions
//source: http://stackoverflow.com/questions/30893443/highcharts-boxplots-how-to-get-five-point-summary
//get any percentile from an array
function getPercentile(data, percentile) {
    data.sort(numSort);
    var index = (percentile/100) * data.length;
    var result;
    if (Math.floor(index) == index) {
         result = (data[(index-1)] + data[index])/2;
    }
    else {
        result = data[Math.floor(index)];
    }
    return result;
}
//because .sort() doesn't sort numbers correctly
function numSort(a,b) { 
    return a - b; 
} 

//wrap the percentile calls in one method
function getBoxValues(data) {
    var boxValues = [];
    boxValues.push(Math.min.apply(Math,data));
    boxValues.push(getPercentile(data, 25));
    boxValues.push(getPercentile(data, 50));
    boxValues.push(getPercentile(data, 75));
    boxValues.push(Math.max.apply(Math,data));
    return boxValues;
}
//end Box Plot automatized functions

function renderBeefradarBoxPlot(data){
    var series=[];
    var estatistics=[];
    var apelidos=[];
    
    $.each(data, function( index, value ) {
        apelidos.push(value.apelido);
    });
    apelidos = removeDuplicateValuesInArray(apelidos);

    $.each(apelidos, function( index, value ) {
        var name = value;
        var array = [];
        $.each(data, function( index, value ) {
            value.apelido === name ? array.push(value.valor) : '';
        });
        
        estatistics.push(getBoxValues(array));

    });
    
    series = [{ 
        name : "Estatísticas",
        data : estatistics,
        tooltip: {
               headerFormat: '<em>{point.key}</em><br/>'
        }
    }];

    $('#beefradar-box-plot').highcharts({
        chart: {
            type: 'boxplot'
        },

        title: {
            text: 'ESTATÍSTICAS DO PERÍODO'
        },

        subtitle: {
            text: 'Fonte: Esalq/BMF'
        },

        credits: {
            enabled: true,
            href: "http://www.bovbi.com.br",
            text: "bovbi.com.br"
        },

        legend: {
            enabled: false
        },

        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat:
                              'Máximo: {point.high}<br/>' +
                              'Quartil 3: {point.q3}<br/>' +
                              'Mediana: {point.median}<br/>' +
                              'Quartil 1: {point.q1}<br/>' +
                              'Mínino: {point.low}<br/>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },

        xAxis: {
            categories: apelidos,
            title: {
                text: 'Mercadoria'
            }
        },

        yAxis: {
            title: {
                text: 'Valor @'
            },
            labels: {
                formatter: function () {
                    //console.log(this);
                    return 'R$ ' + Highcharts.numberFormat(this.value,2);
                }
            }
        },
        series: series
    });
}

function removeDuplicateValuesInArray(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
        var item = a[i];
            if(seen[item] !== 1) {
                seen[item] = 1;
                out[j++] = item;
            }
        }
    return out;
}

function renderBeefradarBarWeek(data){
    var series=[];
    var categories=[];
    var apelidos=[];
    
    $.each(data, function( index, value ) {
        categories.push(value.data);
        apelidos.push(value.apelido);
    });
    categories = removeDuplicateValuesInArray(categories);
    apelidos = removeDuplicateValuesInArray(apelidos);

    $.each(apelidos, function( index, value ) {
        var name = value;
        var array = [];
        $.each(data, function( index, value ) {
            value.apelido === name ? array.push(value.valor) : '';
        });
        
        series[index] = { 
            name : value,
            data : array
        };
    });


    $('#beefradar-bar').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'SEMANA DE PREÇOS'
        },
        subtitle: {
            text: 'Fonte: Esalq/BMF'
        },
        credits: {
            enabled: true,
            href: "http://www.bovbi.com.br",
            text: "bovbi.com.br"
        }, 
        xAxis: {
            categories:categories,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Valor @'
            },
            labels: {
                formatter: function () {
                    //console.log(this);
                    return 'R$ ' + Highcharts.numberFormat(this.value,2);
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>R$ {point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0,
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: series
    });
}