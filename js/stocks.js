// variables global
var myMap = new Map();
var api = "0XUH5ZVKMA8NIJ2J";
var url, timeout = 120000;
var chart;

function chart() {

	var symbol = document.getElementById("numb").value;
	
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

			var dailys = obj["Time Series (Daily)"];

			for(var prop in dailys) {
				var keyString = prop;
				var data = dailys[prop]["4. close"];

				myMap.set(keyString, data);
			}

			chart = new CanvasJS.Chart("chartContainer", {
				animationEnabled: true,
				title:{
					text: "Stocks Quotes: " + symbol,
					fontColor: "orange"
				},
				axisX:{
					title : "Date",
					titleFontColor: "black",
					valueFormatString: "DD MMM"
				},
				axisY: {
					title: "Stock Price",
					titleFontColor: "black",
					includeZero: false,
					scaleBreaks: {
						autoCalculate: true
					}
				},
				data: [{
					type: "line",
					xValueFormatString: "DD MMM",
					color: "green",
					dataPoints: dataPoints(myMap)
				}]
			});
		
			chart.render();	
			});
  		}).catch(function(err) {
		alert('Error occured. Restart the page.');
	});
}

function dataPoints(myMap) {
	
	var array = [];
	var i = 0, j = 10;
	for (var [key, value] of myMap) {
		var keyDate = key.split("-");
		var month = parseInt(keyDate[1]) - 1;

		//year-month-date and price (int)
		array.push ({x : new Date(keyDate[0], month.toString(), keyDate[2]),
					y : parseFloat(value)});
		//console.log(keyDate[0] + value);
	}
	return array;
}

// every 2 mins 
var t=setInterval(myFunction, timeout);

function myFunction() {

	console.log("Fetching...");
	
	// Get the value of the input field with id="numb"
	symbol = document.getElementById("numb").value;
	
	url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="
		+ symbol + "&interval=3600min&apikey=" + api; 

	fetch(url, {method: 'get'
	}).then(function(response) {
		// Examine the text in the response
      response.json().then(function(data) {
        //document.getElementById("demo").innerHTML = JSON.stringify(data);

        var str = JSON.stringify(data);
        var obj = JSON.parse(str);

        //"2017-11-03 13:07:00" or "2017-11-03"
        if (hasWhiteSpace(obj["Meta Data"]["3. Last Refreshed"])) {
        	var time = obj["Meta Data"]["3. Last Refreshed"].split(" ");	
        } else {
	        var time = obj["Meta Data"]["3. Last Refreshed"];
        }

        /* {
	        	"1. open": "1022.1100", 
	        	"2. high": "1028.3800", 	
	    		"3. low": "1020.3100", 
	        	"4. close": "1028.1900",
	            "5. volume": "266535"
        	} */
        var timeNowObj = obj["Time Series (Daily)"][time];

        //"1028.1900"
        var stockNow = timeNowObj["4. close"];

        document.getElementById("demo").innerHTML = "The current stock price is " + 
        	parseFloat(stockNow).toFixed(2);

        //latest entry
        chart.options.data[0].dataPoints[0].y = parseFloat(stockNow);


//		chart.render();
      });
	}).catch(function(err) {
		alert('Error occured. Restart the page.');
	});

	console.log("Next fetch in " + Math.floor(timeout / 60000) + " minutes...");
}

function hasWhiteSpace(s) {
  return s.indexOf(' ') >= 0;
}

function stopFunc() {
	console.log("Stopped fetching...");
	clearInterval(t);
}	