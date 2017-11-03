function chart() {

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

			var dailys = obj["Time Series (Daily)"];
			var myMap = new Map();

			for(var prop in dailys) {
				var keyString = prop;
				var data = dailys[prop]["4. close"];

				myMap.set(keyString, data);
			}

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

		//year-month-date and price (int)
		array.push ({x : new Date(keyDate[0], keyDate[1], keyDate[2]),
					y : parseFloat(value)});
		//console.log(keyDate[0] + value);
	}
	return array;
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

         //"2017-11-03 13:07:00" or "2017-11-03"
        var time = obj["Meta Data"]["3. Last Refreshed"].split(" ");

        /* {
	        	"1. open": "1022.1100", 
	        	"2. high": "1028.3800", 	
	    		"3. low": "1020.3100", 
	        	"4. close": "1028.1900",
	            "5. volume": "266535"
        	} */
        var timeNowObj = obj["Time Series (Daily)"][time[0]];

        //"1028.1900"
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
				//console.log(value);
		}
      });
	}).catch(function(err) {
		alert('Error occured. Restart the page.');
	});	
}

function stopFunc() {
	clearInterval(t);
}	