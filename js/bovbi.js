$('.carousel').carousel({
	interval: 5000 //changes the speed
});


google.charts.load('current', {'packages':['geochart']});
google.charts.setOnLoadCallback(drawAddressMap);

function drawAddressMap() {

	var data = google.visualization.arrayToDataTable([
		['City',   'Population', {type: 'string', role: 'tooltip'}],
		['Campo Grande',      1, 'Rua Inácio de Souza, 723 - Campo Grande - MS, CEP 79041-220'],
		['Ponta Porã',     1, 'Rua Antônio João, 2523 - Ponta Porã - MS, CEP 79904-556'],
	]);

	var options = {
		region: 'BR',
		displayMode: 'markers', //'text',
		colorAxis: {colors: ['green']},
		tooltip: {isHtml: true},
		keepAspectRatio : false,
		legend: 'none',
		minValue: 1,
		maxValue:1,
		minSize:1,  
		maxSize: 1,
		//backgroundColor: '#81d4fa',
		//datalessRegionColor: '#f8bbd0',
		//defaultColor: '#f5f5f5'
	};

	var chart = new google.visualization.GeoChart(document.getElementById('address-geochart-div'));

	chart.draw(data, options);
}