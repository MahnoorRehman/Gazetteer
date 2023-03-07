// $('#iso-country').click(function () {
//     console.log('i am dropdown');

//     $.ajax({
//         url: 'PhP/countryName.php',
//         type: 'POST',
//         dataType: 'json',
//         data: {
//             country: $('#iso-country').val(),

//         },
//         success: function (result) {
//             console.log(JSON.stringify(result));

//         },
//         error: function (jqXHR, textStatus, errorThrown) {
//             // your error code
//         }
//     })
// });



// $.ajax({
    //     url: 'PhP/countryName.php',
    //     type: 'POST',
    //     dataType: 'json',
    //     data: {
    //         country: $('#iso-country').val(),
    //     },
    //     success: function (result) {
    //         let jsondata = JSON.stringify(result);
    //         const data = JSON.parse(jsondata);
    //         console.log(data);
    //         const lat = data.data[0].annotations.DMS.lat.replace(/[^\d.-]/g, '');
    //         const lng = data.data[0].annotations.DMS.lng.replace(/[^\d.-]/g, '') * -1;

    //         var marker1 = L.marker([lat, lng]).addTo(map);
    //         marker1.bindPopup("<b>Hello world!</b><br />" + { lat } + { lng });
    //     },

    //     error: function (jqXHR, textStatus, errorThrown) {
    //         // your error code
    //     }
    // });










    