function chart() {
	var chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	title:{
		text: "Website Traffic"
	},
	axisX:{
		valueFormatString: "DD MMM"
	},
	axisY: {
		title: "Stock Price",
		includeZero: false,
		scaleBreaks: {
			autoCalculate: true
		}
	},
	data: [{
		type: "line",
		xValueFormatString: "DD MMM",
		color: "green",
		dataPoints: [
			{ x: new Date(2017, 0, 1), y: 610 },
			{ x: new Date(2017, 0, 2), y: 680 },
			{ x: new Date(2017, 0, 3), y: 690 },
			{ x: new Date(2017, 0, 4), y: 700 },
			{ x: new Date(2017, 0, 5), y: 710 },
			{ x: new Date(2017, 0, 6), y: 658 },
			{ x: new Date(2017, 0, 7), y: 734 },
			{ x: new Date(2017, 0, 8), y: 963 },
			{ x: new Date(2017, 0, 9), y: 847 },
			{ x: new Date(2017, 0, 10), y: 853 },
			{ x: new Date(2017, 0, 11), y: 869 },
			{ x: new Date(2017, 0, 12), y: 943 },
			{ x: new Date(2017, 0, 13), y: 970 },
			{ x: new Date(2017, 0, 14), y: 869 },
			{ x: new Date(2017, 0, 15), y: 890 },
			{ x: new Date(2017, 0, 16), y: 930 },
			{ x: new Date(2017, 0, 17), y: 1850 },
			{ x: new Date(2017, 0, 18), y: 1905 },
			{ x: new Date(2017, 0, 19), y: 1980 },
			{ x: new Date(2017, 0, 20), y: 1858 },
			{ x: new Date(2017, 0, 21), y: 1034 },
			{ x: new Date(2017, 0, 22), y: 963 },
			{ x: new Date(2017, 0, 23), y: 847 },
			{ x: new Date(2017, 0, 24), y: 853 },
			{ x: new Date(2017, 0, 25), y: 869 },
			{ x: new Date(2017, 0, 26), y: 943 },
			{ x: new Date(2017, 0, 27), y: 970 },
			{ x: new Date(2017, 0, 28), y: 869 },
			{ x: new Date(2017, 0, 29), y: 890 },
			{ x: new Date(2017, 0, 30), y: 930 },
			{ x: new Date(2017, 0, 31), y: 750 }
			]
		}]
	});
	chart.render();	
}

var t=setInterval(myFunction, 10000);

function myFunction() {
	var symbol, url;
	var api = "0XUH5ZVKMA8NIJ2J";

	// Get the value of the input field with id="numb"
	symbol = document.getElementById("numb").value;
	url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="
		+ symbol + "&interval=3600min&apikey=" + api; 

	console.log(url);
	
	fetch(url, {method: 'get'
	}).then(function(response) {
		// Examine the text in the response
      response.json().then(function(data) {
        //document.getElementById("demo").innerHTML = JSON.stringify(data);

        var str = JSON.stringify(data);
        var obj = JSON.parse(str);
        var time = obj["Meta Data"]["3. Last Refreshed"].split(" ");
        var timeNowObj = obj["Time Series (Daily)"][time[0]];
        var stockNow = timeNowObj["4. close"];

		var dailys = obj["Time Series (Daily)"];
		var timePrev;
		var index = 0;

		var myMap = new Map();

		// get previous close
		for(var prop in dailys) {
			if (index == 1){
				timePrev = dailys[prop];
			}
			index++;

			document.getElementById("demo").innerHTML = "prop " + prop + " val " +
			dailys[prop]["4. close"];

			var keyString = prop;
			var data = dailys[prop["4. close"]];

			myMap.set(keyString, data);
		}

		var stockPrev = timePrev["4. close"];

        // document.getElementById("demo").innerHTML = 
        // "At " + time + ", the stock for " + symbol + " is "
        // + stockNow + ". The previous stock close was " + stockPrev;

        for (var [key, value] of myMap) {
				console.log(value);
		}
      });
	}).catch(function(err) {
		alert('Error occured. Restart the page.');
	});	
}

function stopFunc() {
	clearInterval(t);
}	