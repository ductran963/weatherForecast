//API Key =cecc77009772e5320e98463eaff874a5
//api.openweathermap.org/data/2.5/weather?q={city name}
// var currentDay = moment().format('(M/D/YYYY)');
// $('#weatherInfo').append(currentDay);
renderSaveBtn1();

// this function get values stored within text1 and append it to class description1
function renderSaveBtn1() {
    var cityList = $("<li>")
    var cityLink = $("<a href=''>");
    var storedCityLink = cityLink.append(localStorage.getItem("text1"));
    var storedCityList = cityList.append(storedCityLink);
    $("#city-list").append(storedCityList);
    
}

//making ajax call on a click of a button and retrieve data
$('.searchBtn').on('click', function (event) {
    event.preventDefault();
     //on click I want to save val from text box to local storage then I want to add it to the id= city list
     
     //this function set values submitDescription1 to text1 and call renderSaveBtn1 to get that value(stored in text1) and append it to whereever
     
 
    var cityName = $('.searchBox').val();
    localStorage.setItem("text1", cityName);
    renderSaveBtn1();
    

    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&APPID=cecc77009772e5320e98463eaff874a5';
    // console.log(queryURL);
    $.ajax({ //making ajax call on a click of a button and retrieve data
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // console.log(response);
        //add weather info to the div js then add that div to DOM
        var lat = response.coord.lon;
        var lon = response.coord.lat;
        $("#weatherInfo").empty();
        var weatherDiv = $("<div class='weatherDiv'>");
        var currentDay = moment().format("(M/D/YYYY)");
        var cityNameHeading = $("<p>").text(cityName + ' ' + currentDay).css({ "font-weight": "bold", "font-size": "36px" });
        weatherDiv.append(cityNameHeading);
        var temperature = response.main.temp;
        var pOne = $("<p>").text("Temperature: " + temperature + " °F");
        weatherDiv.append(pOne);
        var humidity = response.main.humidity;
        var pTwo = $("<p>").text("Humidity: " + humidity + "%");
        weatherDiv.append(pTwo);
        var windSpeed = response.wind.speed;
        var pThree = $("<p>").text("Wind Speed: " + windSpeed + " MPH");
        weatherDiv.append(pThree);
        $("#weatherInfo").append(weatherDiv);
        var queryURL2 = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&APPID=cecc77009772e5320e98463eaff874a5';
        //second ajax call to get UV Index and add the UV index to the weatherDiv before adding weatherDiv to DOM
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (response2) {
            // console.log(response2);
            var uvIndex = response2.value;
            var pFour = $("<p>").text("UV index: " + uvIndex);
            weatherDiv.append(pFour);
            var iconImage = response.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/w/" + iconImage + ".png";
            var image = $("<img>").attr("src", iconURL);
            cityNameHeading.append(image);
        });
    });

    //Third ajax call to get weather forecasts for the next 5 days
    var queryURL3 = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&units=imperial&APPID=cecc77009772e5320e98463eaff874a5';
    $.ajax({
        url: queryURL3,
        method: "GET"
    }).then(function (response3) {
        console.log(response3);
        $("#weatherImages").empty();
       
        var fiveDaysTitle = $("<h2  class = 'col-12'>5 Days Forecasts</h2>").css("font-weight", "bold");
        $("#weatherImages").append(fiveDaysTitle);


        for (var i = 0; i < response3.list.length; i += 8) {
            console.log("hello");

            var forecastDiv = $("<div class='forecastDiv col-2'>");

            var forecastDay = response3.list[i].dt_txt;
            var forecastHeading = $("<p>").text(forecastDay).css("font-size", "16px");
            forecastDiv.append(forecastHeading);
            var forecastIcon = response3.list[i].weather[0].icon;
            var forecastIconURL = "http://openweathermap.org/img/w/" + forecastIcon + ".png";
            var forecastImage = $("<img>").attr("src", forecastIconURL);
            forecastDiv.append(forecastImage);
            var forecastTemperature = response3.list[i].main.temp;
            var pTemp = $("<p>").text("Temp: " + forecastTemperature + " °F").css("font-size", "16px");
            forecastDiv.append(pTemp);
            var forecastHumidity = response3.list[i].main.humidity;
            var pHumid = $("<p>").text("Humidity: " + forecastHumidity + " %").css("font-size", "16px");
            forecastDiv.append(pHumid);
            forecastDiv.attr('class', 'card text-white bg-light');
            $("#weatherImages").append(forecastDiv);
        };

    });

});
    