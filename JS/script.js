

setTimeout(function () {
    var preloader = document.querySelector(".preloader-container");
    preloader.style.display = "none";
    var realData = document.querySelector(".real-data-container");
    // realData.style.display = "block";
}, 1000);


let lati = 55.3781;
let lngi = 3.4360;
let map;
let countryLayer;
let east_value;
let west_value;
let north_value;
let south_value;
let city_lat;
let city_lng;
let wikipedia;
let city_name;
let wiki_summary;
let wiki_thumbnail;
let wiki_url;
// countrty Info
let cou_populatin;
let cou_capital;
let cou_name;
let cou_currency;
let cou_area;
let cou_language;
let cou_code;
let cou_continent;

let i;
let polygonLayer;
var popupClassName = 'my-popup';

//eathquake
var earthquake_button_added = false;
let earth_lat;
let earth_lng;
let earth_dateTime;
let earth_magnitude;
let eartg_deapth;
var earth_markers;
let eqCity;

//weather 
let weather_city;


//Currency
let currencyInput;
let currencyValue;
let currencyName;

var earthquakeLayer = L.layerGroup();
let wiki_marker;
var myIcon = L.icon({
    iconUrl: 'images/wiki.png',
    iconSize: [30, 38],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
});
var earthMarker = L.icon({
    iconUrl: 'images/crack.png',
    iconSize: [30, 38],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
});
let weather_markers;
var weatherMarker = L.icon({
    iconUrl: 'images/cloudy.png',
    iconSize: [30, 38],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
});

// Initialize the Leaflet map
function initMap() {

    map = L.map('map').setView([lati, lngi], 4);
    var openStreetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    openStreetMap.options.attribution = '';
    openStreetMap.addTo(map);
    L.control.attribution();
    var satalite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    var overlayMap = {
        //'EarthQuake': earthquakeLayer,
    }
    var baseMaps = {

        "Satalite": satalite,
        "Street": openStreetMap,
    };
    var layerControl = L.control.layers(baseMaps, overlayMap, { checked: false }).addTo(map);

}

// Call initMap on document ready
$(document).ready(function () {
    initMap();
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            $.ajax({
                url: "PhP/countryCode.php",
                dataType: 'json',
                type: 'POST',
                data: {
                    latitude: lat,
                    longitude: lng
                },
                success: function (result_code) {
                    $("#iso-country").val(result_code.data.countryCode).change();
                },
                error: function (error) {
                    console.log(error);

                }
            });
        });
    } else {
        map = L.map('mapid').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
        }).addTo(map);
    }

    easyButtonMap();

});



$('#iso-country').change(function () {
    var countryCode = $(this).val();

    $.ajax({
        url: 'PhP/polygone.php',
        dataType: 'json',
        type: 'POST',
        data: { country: countryCode },
        success: function (result) {
            // Create a new GeoJSON layer with the fetched polygon data
            let jsondata = JSON.stringify(result);
            const data = JSON.parse(jsondata);
            //Remove previous layer
            if (polygonLayer) {
                map.removeLayer(polygonLayer);
            }
            polygonLayer = L.geoJSON(data).addTo(map);
            map.fitBounds(polygonLayer.getBounds());
            polygonLayer.setStyle({ fillColor: 'yellow', color: '#FFA700' });
        },
        error: function (xhr, status, error) {
            console.error('Error fetching polygon:', error);
        }
    });


    //function to get north, east, west and south of a country
    $.ajax({
        url: 'PhP/countryInfo.php',
        type: 'POST',
        dataType: 'json',
        data: {
            countrycode: countryCode
        },
        success: function (result_EWNS) {
            if (result_EWNS.status.name == 'ok') {
                east_value = result_EWNS.data[0].east;
                west_value = result_EWNS.data[0].west;
                north_value = result_EWNS.data[0].north;
                south_value = result_EWNS.data[0].south;
                cou_name = result_EWNS.data[0].countryName;
                cou_populatin = result_EWNS.data[0].population;
                cou_area = result_EWNS.data[0].areaInSqKm;
                cou_code = result_EWNS.data[0].countryCode;
                cou_capital = result_EWNS.data[0].capital;
                cou_continent = result_EWNS.data[0].continentName;
                cou_language = result_EWNS.data[0].languages;
                cou_currency = result_EWNS.data[0].currencyCode;

                $("#name").html(cou_name);
                $("#txtcapital").html(cou_capital);
                $("#txtpopulation").html(cou_populatin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
                $("#txtarea").html(cou_area + " km<sup>2</sup>");
                $("#txtlanguage").html(cou_language);
                $("#txtcode").html(cou_code);
                $("#txtcontinent").html(cou_continent);
                $("#txtcurrency").html(cou_currency);
            } else {
                console.error('Error: Unable to get EWNS data');
            };
            //Ajax for EarthQuakes
            earthQukae();

            //city List
            $.ajax({
                url: 'PhP/cityList.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    countrycode: countryCode
                },
                success: function (city_result) {
                    // console.log(city_result);
                    let json_city = JSON.stringify(city_result);
                    const city_data = JSON.parse(json_city);
                    if (wiki_marker) {
                        map.removeLayer(wiki_marker);
                    }
                    wiki_marker = L.markerClusterGroup();
                    wiki_marker.clearLayers();
                    if (weather_markers) {
                        map.removeLayer(weather_markers);
                    }
                    weather_markers = L.markerClusterGroup();
                    weather_markers.clearLayers();
                    $('#city-table').empty();
                    for (i = 0; i < city_result.data.length; i++) {
                        (function (i) {
                            var city_lat = city_result.data[i].lat;
                            var city_lng = city_result.data[i].lng;
                            var city_name = city_result.data[i].name;
                            var city_population = city_result.data[i].population;
                            $("#county-name").html(cou_name + `'s Most Populated Cities`);
                            $('#city-table').append("<tr><td>" + city_name + "</td><td>" + city_population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "</td></tr>");

                            try {
                                $.ajax({
                                    url: 'PhP/wikipedia.php',
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        city: city_name,
                                    },
                                    success: function (wiki_result) {
                                        // console.log(wiki_result);

                                        //  if (typeof wiki_result.data[i] !== 'undefined' && wiki_result.data[i] !== null) {
                                        wiki_summary = wiki_result.data[0].summary;
                                        wiki_url = wiki_result.data[0].wikipediaUrl;


                                        wiki_marker.addLayer(L.marker([city_lat, city_lng], { icon: myIcon }).bindPopup(
                                            '<h2>' + city_name + '</h2>' +
                                            //'<img src="' + wiki_thumbnail + '">' +
                                            '<p>' + wiki_summary + '</p>' +
                                            //'<button onclick="window.location.href=' + wiki_url + '">Click me to go to the Wikipedia page for Kabul</button>' +

                                            `<a   style="color: white;" target="_blank" href="https://${wiki_url.trim()}">Read More</a>`,
                                            { className: popupClassName }
                                        ));
                                    }
                                });

                                //CITY Weather AjAX
                                $.ajax({
                                    url: 'PhP/cityWeather.php',
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
                    map.addLayer(wiki_marker);
                    map.addLayer(weather_markers);
                },
                error: function (xhr, status, error) {
                    console.log("Error: " + error);
                }
            });



            $.ajax({
                url: 'PhP/countryNews.php',
                dataType: 'json',
                type: 'POST',
                data: {
                    country: cou_name
                },
                success: function (result_news) {
                    // console.log(result_news);
                    $('#newsCountry').empty();
                    let articleHtml = '';
                    for (let n = 0; n < result_news.data.length; n++) {
                        $('#newsCountry').html(cou_name + `'s Latest News`);
                        //console.log(cou_name);
                        let news_img = result_news.data[n].image;
                        let news_title = result_news.data[n].title;
                        let news_des = result_news.data[n].description;
                        let news_url = result_news.data[n].url;

                        const newsContainer = $('#newsBody');

                        articleHtml += `

                        <div class="newsContainer">
                            <div class="row">
                             <div class="col-sm-6">
                                <a href="${news_url}" target="_blank">
                                <img id="newsImg" class="img-fluid img-thumbnail" src="${news_img}">
                                </a>
                            </div>
                        <div class="col-sm-6">
                            <a href="${news_url}" target="_blank" class="text-decoration-none">
                            <h6 id="newstitle" class="fs-5 mt-3 mt-sm-1">${news_title}</h6>
                            </a>
                        </div>
                        </div>
                    <div class="row">
                         <p id="newsDesc" class="mt-3 mb-4">${news_des}</p>
                               </div>
                            <hr>
                            </div>
                            `;

                        newsContainer.html(articleHtml);

                    }
                }, error: function (xhr, status, error) {
                    console.error('Error fetching News:', error);
                }

            });


            // Country Current Weather
            $.ajax({
                url: 'PhP/current_weather.php',
                dataType: 'json',
                type: 'POST',
                data: {
                    country: cou_name,
                },
                success: function (cou_weather_result) {
                    //console.log(cou_weather_result);
                    $('#weatherCountry').empty();
                    $('#weatherCountry').html(cou_name);
                    let current_temp = cou_weather_result.data.main['temp'];
                    let temp_feel = cou_weather_result.data.main['feels_like'];
                    let description = cou_weather_result.data.weather[0]['description'];
                    let icon = cou_weather_result.data.weather[0]['icon'];
                    let sunRise = cou_weather_result.data.sys['sunrise'];
                    let sunSet = cou_weather_result.data.sys['sunset'];
                    const sunRiseTime = new Date(sunRise * 1000).toLocaleTimeString();
                    const sunSetTime = new Date(sunSet * 1000).toLocaleTimeString();
                    // console.log(sunriseTime);
                    //  console.log(temp_feel);
                    // console.log(description);
                    // console.log(icon);
                    // console.log(sunRise);
                    // console.log(sunSet);
                    let celsius_temp = (current_temp - 273.15).toFixed(0);
                    let celsius_feel = (temp_feel - 273.15).toFixed(0);
                    $('#nowWeatherImg').attr('src', "http://openweathermap.org/img/wn/" + icon + "@4x.png");
                    $('#nowWeatherDescription').html(description);
                    $('#noewTemp').html('Temperature: ' + celsius_temp + "°C");
                    $('#feelTemp').html('Feels Like: ' + celsius_feel + "°C");
                    $('#sunRise').html('Sun Rise: ' + sunRiseTime);
                    $('#sunSet').html('Sun Set: ' + sunSetTime);
                }
            });


            //country Wikipedia
            $.ajax({
                url: 'PhP/wikipedia.php',
                dataType: 'json',
                type: 'POST',
                data: {
                    city: cou_name,
                },
                success: function (cou_wikipedia) {
                    //  console.log(cou_wikipedia);
                    $('#wikiCountryName').empty();
                    $('#wikipediaSummary').empty();
                    let cou_wikiSummary = cou_wikipedia.data[0].summary;
                    let cou_wikiUrl = cou_wikipedia.data[0].wikipediaUrl;
                    let cou_image = cou_wikipedia.data[0].thumbnailImg;
                    $('#wikiCountryName').html(cou_name);
                    $('#wikipediaSummary').html(cou_wikiSummary);
                    //  $(wikipediaThumbnail).attr('src', cou_image);
                    $('#wikipedialink').attr('href', `https://${cou_wikiUrl.trim()}`);
                    $('#wikipedialink').html(`https://${cou_wikiUrl.trim()}`);


                },
                error: function (xhr, status, error) {
                    console.error('Error fetching Country WikiPedia:', error);
                }
            });

            // Curreny

            $.ajax({
                url: 'PhP/currency.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    cCode: cou_currency
                },
                success: function (currency_result) {

                    $('#currencyTitle').html(cou_name);
                    $('#currencyCode').html(cou_currency);
                    if (currency_result.status.name == 'ok') {

                        let codes = Object.keys(currency_result.data);

                        let value = Object.values(currency_result.data);

                        let dropdown = document.getElementById('currencyCodeList');
                        dropdown.innerHTML = '';
                        for (let i = 0; i < codes.length; i++) {
                            const option = document.createElement('option');
                            option.value = value[i];
                            option.textContent = codes[i];
                            dropdown.appendChild(option);
                        }

                        let numberVal = document.querySelector('#number');
                        numberVal.value = '';
                        let currencyCodeList = document.querySelector('#currencyCodeList');
                        let finalCurrency;

                        numberVal.addEventListener('input', () => {
                            currencyInput = numberVal.value;
                            //    console.log("Chnage Value is" + currencyInput);
                            finalCurrency = currencyInput * parseFloat(currencyCodeList.value);
                            //  console.log("final Currancy" + finalCurrency);
                            $('#finalCurrency').html(finalCurrency);

                        });
                        $('#onePoundOfCurrency').empty();
                        $('#finalCurrency').empty();
                        currencyCodeList.addEventListener('change', function () {
                            currencyValue = $(this).val();
                            currencyName = $(this).find('option:selected').text();
                            //console.log(currencyValue);
                            //console.log(currencyName);
                            $('#onePoundOfCurrency').html("1 " + cou_currency + "=" + currencyValue + " " + currencyName);
                            finalCurrency = currencyInput * parseFloat(currencyCodeList.value);
                            $('#finalCurrency').html(finalCurrency + " " + currencyName);
                        });
                    } else {
                        console.log('error');
                    }

                }

            });

        }
    });
    $.ajax({
        url: 'PhP/countryFlag.php',
        type: 'POST',
        dataType: 'json',
        data: {
            isoCode: countryCode
        },
        success: function (flag_result) {
            //  console.log(flag_result);
            $('#flag').attr('src', flag_result.data);
        }
    });


});






function easyButtonMap() {

    // sample bootstap modal 
    L.easyButton('<img src="images/info1.png" style="width: 25px; height:25px; display: block; margin: auto;">', function (btn, map) {
        $("#infoModal").modal('show');

    }).addTo(map);

    L.easyButton('<img src="images/city.png" style="width: 25px; height:25px; display: block; margin: auto;">', function (btn, map) {
        $("#cityModal").modal('show');

    }).addTo(map);
    L.easyButton('<img src="images/cloudy.png" style="width: 25px; height:25px; display: block; margin: auto;">', function (btn, map) {
        $("#weatherMOdal").modal('show');

    }).addTo(map);
    L.easyButton('<img src="images/news.png" style="width: 25px; height:25px; display: block; margin: auto;">', function (btn, map) {
        $("#newsModal").modal('show');

    }).addTo(map);
    L.easyButton('<img src="images/wikipedia.png" style="width: 25px; height:25px; display: block; margin: auto;">', function (btn, map) {
        $("#countrywikipediaModal").modal('show');

    }).addTo(map);
    L.easyButton('<img src="images/money.png" style="width: 25px; height:25px; display: block; margin: auto;">', function (btn, map) {
        $("#currencyModal").modal('show');

    }).addTo(map);

}



function earthQukae() {
    //  if (!earthquake_button_added) {
    //    L.easyButton('<img src="images/crack.png" style="width: 25px; height:25px; display: block; margin: auto;">', function (btn, map) {

    $.ajax({
        url: 'PhP/earthquake.php',
        type: 'POST',
        dataType: 'json',
        data: {
            north: north_value,
            south: south_value,
            east: east_value,
            west: west_value,

        },
        success: function (earth_result) {
            // console.log(earth_result);
            earth_markers = L.markerClusterGroup();
            //  earth_markers.clearLayers();
            earthquakeLayer.clearLayers();
            for (j = 0; j < earth_result.data.length; j++) {
                (function (j) {
                    earth_lat = earth_result.data[j].lat;
                    earth_lng = earth_result.data[j].lng;
                    earth_dateTime = earth_result.data[j].datetime;
                    earth_magnitude = earth_result.data[j].magnitude;
                    eartg_deapth = earth_result.data[j].depth;
                    // console.log("Lati" + earth_lat);
                    // console.log("Langi" + earth_lng);

                    const [date, time] =
                        earth_dateTime.split(' ');
                    try {
                        $.ajax({
                            url: 'PhP/earthequake_city.php',
                            type: "POST",
                            dataType: "json",
                            data: {
                                latitude: earth_lat,
                                longitude: earth_lng
                            },
                            success: function (eqCityName_result) {
                                // console.log(eqCityName_result);
                                if (typeof eqCityName_result !== 'undefined' && eqCityName_result.data !== null) {
                                    eqCity = eqCityName_result.data[0].name;
                                    // console.log(eqCity)
                                    earthquakeLayer.addLayer(L.marker([earth_result.data[j].lat, earth_result.data[j].lng], { icon: earthMarker }).bindPopup(
                                        '<h5 style="font-weight: bold;">' + eqCity + '</h5>' +
                                        '<div class="container"><table class="table">' +
                                        //'<thead><th style="background: none;">' + eqCity + '</th></thead>' +
                                        '<tbody><tr><td> Date: </td><td>' + date + '</td></tr>' +
                                        '<tr><td>Time: </td><td>' + time + '</td></tr>' +
                                        '<tr><td>Magnitude: </td><td>' + earth_magnitude + '</td></tr>' +
                                        '<tr><td> Depth: </td><td>' + eartg_deapth + '</td></tr></table></div>'

                                    ));
                                    // earthquakeLayer.addLayer(earth_markers);

                                } else {
                                    console.log('Earthquake Error');
                                }
                            }, error: function (xhr, status, error) {
                                console.log(xhr.responseText);
                                console.log(status);
                                console.log(error);
                            }
                        });
                    } catch (error) {
                        console.log('try catch ' + error);
                    }
                })(j);

            }
            map.addLayer(earthquakeLayer);
        }
    });

    //    }).addTo(map);
    //   earthquake_button_added = true;
    //  }
}



