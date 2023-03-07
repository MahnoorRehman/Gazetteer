

setTimeout(function () {
    var preloader = document.querySelector(".preloader-container");
    preloader.style.display = "none";
    var realData = document.querySelector(".real-data-container");
    realData.style.display = "block";
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
var popupClassName = 'my-popup';

//eathquake
var earthquake_button_added = false;
let earth_lat;
let earth_lng;
let earth_dateTime;
let earth_magnitude;
let eartg_deapth;
var earth_markers;

//weather 
let weather_city;
//let weather_lat;
//let weather_lng;
//let weather_clouds;
//let weather_temp;
//let weather_wind;


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
var weatherMarker = L.icon({
    iconUrl: 'images/cloudy.png',
    iconSize: [30, 38],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
});

// Initialize the Leaflet map
function initMap() {

    map = L.map('map').setView([lati, lngi], 4);
    var openStreetMap = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });
    openStreetMap.options.attribution = '';
    openStreetMap.addTo(map);
    L.control.attribution()
    //var marker = L.marker([lati, lngi]).addTo(map);
    //marker.bindPopup("<b>Hello world!</b><br />I am a popup.");
    var satalite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    // var overlayMap = {
    //     'Earth': earth_markers,
    // }
    var baseMaps = {

        "Satalite": satalite,
        "Street": openStreetMap,
    };
    var layerControl = L.control.layers(baseMaps).addTo(map);

}

// Call initMap on document ready
$(document).ready(function () {
    //  initMap();
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            $.ajax({
                url: "PhP/countryCode.php",
                dataType: 'json',
                data: {
                    latitude: lat,
                    longitude: lng
                },
                success: function (result_code) {
                    console.log(result_code)
                    $("#iso-country").val(result_code.data.countryCode).change();
                    map = L.map('map').setView([lat, lng], 13);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                        maxZoom: 18,
                    }).addTo(map);
                    L.marker([lat, lng]).addTo(map);
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
        easyButton([51.505, -0.09], map);
    }


    easyButton();
});


// Call initMap when dropdown menu is changed
$('#iso-country').change(function () {
    var countryCode = $(this).val();
    // console.log(countryCode);
    //console.log('i am dropdown');
    $.ajax({
        url: 'PhP/polygone.php',
        dataType: 'json',
        type: 'POST',
        data: { country: countryCode },
        success: function (result) {
            // Create a new GeoJSON layer with the fetched polygon data
            let jsondata = JSON.stringify(result);
            const data = JSON.parse(jsondata);
            var polygonLayer = L.geoJSON(data).addTo(map);
            map.fitBounds(polygonLayer.getBounds());
            polygonLayer.setStyle({ fillColor: 'pink', color: '#FFA700' });
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
                //Ajax for EarthQuakes
                earthQukae();
            } else {
                console.error('Error: Unable to get EWNS data');
            };


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
                    var markers = L.markerClusterGroup();
                    markers.clearLayers();
                    var weather_markers = L.markerClusterGroup();
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

                                        //if (typeof wiki_result.data[i] !== 'undefined' && wiki_result.data[i] !== null) {
                                        wiki_summary = wiki_result.data[0].summary;
                                        wiki_url = wiki_result.data[0].wikipediaUrl;
                                        //  console.log(wiki_url);
                                        // console.log(wiki_summary);
                                        // } else {
                                        //     console.log('');
                                        // }

                                        markers.addLayer(L.marker([city_lat, city_lng], { icon: myIcon }).bindPopup(
                                            '<h2>' + city_name + '</h2>' +
                                            //'<img src="' + wiki_thumbnail + '">' +
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




function easyButton() {

    // sample bootstap modal 
    L.easyButton('<img src="images/info1.png" style="width: 25px; height:25px; display: block; margin: auto;">', function (btn, map) {
        $("#exampleModal").modal('show');

    }).addTo(map);

    L.easyButton('<img src="images/city.png" style="width: 25px; height:25px; display: block; margin: auto;">', function (btn, map) {
        $("#cityModal").modal('show');

    }).addTo(map);

}



function earthQukae() {
    if (!earthquake_button_added) {
        L.easyButton('<img src="images/crack.png" style="width: 25px; height:25px; display: block; margin: auto;">', function (btn, map) {

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
                    earth_markers.clearLayers();
                    for (j = 0; j < earth_result.data.length; j++) {
                        earth_lat = earth_result.data[j].lat;
                        earth_lng = earth_result.data[j].lng;
                        earth_dateTime = earth_result.data[j].datetime;
                        earth_magnitude = earth_result.data[j].magnitude;
                        eartg_deapth = earth_result.data[j].depth;
                        // console.log(earth_lat);
                        //console.log(earth_lng);
                        earth_markers.addLayer(L.marker([earth_lat, earth_lng], { icon: earthMarker }).bindPopup(
                            '<div class="container"><table class="table table-striped">' +
                            "<thead><tr><th>Earthquake Details</th></thead>" +
                            "<tbody><tr><td> DateTime: </td><td>" +
                            earth_dateTime +
                            "</td></tr>" +
                            "<tr><td>Magnitude: </td><td>" +
                            earth_magnitude +
                            "</td></tr>" +
                            "<tr><td> Depth: </td><td>" +
                            eartg_deapth +
                            "</td></tr>"

                        ));
                    }
                    map.addLayer(earth_markers);
                }
            });

        }).addTo(map);
        earthquake_button_added = true;
    }
}



