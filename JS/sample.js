$.ajax({

    url: 'PhP/cityList.php',
    type: 'POST',
    dataType: 'json',
    data: {
        north: north_value,
        south: south_value,
        east: east_value,
        west: west_value,
    },
    success: function (city_result) {
        console.log(city_result);
        let json_city = JSON.stringify(city_result);
        const city_data = JSON.parse(json_city);
        //console.log(city_data)
        // console.log(city_result.data.length);
        var markers = L.markerClusterGroup();
        markers.clearLayers();
        var weather_markers = L.markerClusterGroup();
        weather_markers.clearLayers();
        $('#city-table').empty();
        for (i = 0; i < city_result.data.length; i++) {
            (function (i) {
                var city_lat = city_result.data[i].lat;
                var city_lng = city_result.data[i].lng;
                var wikipedia = city_result.data[i].wikipedia;
                var city_name = city_result.data[i].name;
                //  console.log(city_name);
                var city_countryCode = city_result.data[i].countrycode;
                var city_population = city_result.data[i].population;
                $("#county-name").html(cou_name + " Most Populated Cities");
                $('#city-table').append("<tr><td>" + city_name + "</td><td>" + city_population + "</td></tr>");

                try {
                    $.ajax({
                        url: 'PhP/wikipedia.php',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            city: city_name,
                        },
                        success: function (wiki_result) {
                            //   console.log(wiki_result);

                            if (typeof wiki_result.data[i] !== 'undefined' && wiki_result.data[i] !== null) {
                                wiki_summary = wiki_result.data[0].summary;
                                wiki_thumbnail = wiki_result.data[0].thumbnailImg;
                                wiki_url = wiki_result.data[0].wikipediaUrl;
                                //  console.log(wiki_url);
                                // console.log(wiki_summary);
                            } else {
                                console.log('wiki_result.data[i] is undefined or null');
                            }

                            markers.addLayer(L.marker([city_lat, city_lng], { icon: myIcon }).bindPopup(
                                '<h2>' + city_name + '</h2>' +
                                '<img src="' + wiki_thumbnail + '">' +
                                '<p>' + wiki_summary + '</p>' +
                                //'<button onclick="window.location.href=' + wiki_url + '">Click me to go to the Wikipedia page for Kabul</button>' +

                                `<a   style="color: white;" target="_blank" href="https://${wiki_url.trim()}">Read More</a>`,
                                { className: popupClassName }
                            ));
                        }
                    });

                    //Weather AjAX

                    $.ajax({
                        url: 'PhP/weather.php',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            latitude: city_lat,
                            longitude: city_lng
                        },
                        success: function (weather_result) {
                            //console.log(weather_result);
                            if (typeof weather_result.data !== 'undefined' && weather_result.data !== null) {
                                var weather_lat = weather_result.data.lat;
                                var weather_lng = weather_result.data.lng;
                                var weather_clouds = weather_result.data.clouds;
                                var weather_temp = weather_result.data.temperature;
                                var weather_wind = weather_result.data.windSpeed;
                                weather_city = weather_result.data.stationName;

                                weather_markers.addLayer(L.marker([weather_lat, weather_lng], { icon: weatherMarker }).bindPopup(
                                    '<h2>' + city_name + '</h2>' +
                                    '<div class="container"><table class="table table-striped">' +
                                    "<tbody><tr><td> Clouds: </td><td>" +
                                    weather_clouds +
                                    "</td></tr>" +
                                    "<tr><td>Temperature: </td><td>" +
                                    weather_temp +
                                    "°C</td></tr>" +
                                    "<tr><td> Wind Speed: </td><td>" +
                                    weather_wind +
                                    "mph</td></tr>"
                                ));
                            }
                            else {
                                console.log('weather_result.data is undefined or null');
                            }

                        }, error: function (xhr, status, error) {
                            console.log(xhr.responseText);
                            console.log(status);
                            console.log(error);
                        }
                    });
                } catch (error) {
                    console.log(error);
                }
            })(i);
        }
        map.addLayer(markers);
        map.addLayer(weather_markers);
    },
    error: function (xhr, status, error) {
        console.log("Error: " + error);
    }

});