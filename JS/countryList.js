$('#iso-country').ready(function () {
   // console.log('i am loading');
    const dropdown = document.getElementById('iso-country');
    $.ajax({
        url: 'PhP/countryList.php',
        type: 'POST',
        dataType: 'json',
        success: function (result) {
            let jsondata = JSON.stringify(result);
            const data = JSON.parse(jsondata);
            data.forEach(item => {
                const option = document.createElement("option");
                // console.log(option);
                option.value = item.isoCode;
                option.text = item.name;
                dropdown.appendChild(option);
                
            });
        }

    });
});
