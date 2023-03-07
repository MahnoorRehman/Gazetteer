<?php
// Read the JSON file
$data = file_get_contents('./../data/countryBorders.json');

// Decode the JSON data into an associative array
$countries = json_decode($data, true);

// Initialize an empty array to store the ISO code and name
$options = array();

// Loop through the countries array
foreach ($countries['features'] as $country) {
    // Get the ISO code and name
    $isoCode = $country['properties']['iso_a2'];
    $name = $country['properties']['name'];
    
    // Add the ISO code and name to the options array
    $options[] = array(
        'isoCode' => $isoCode,
        'name' => $name
    );
}

// Sort the options array by name
usort($options, function($a, $b) {
    return strcmp($a['name'], $b['name']);
});

// Encode the options array as a JSON string
$optionsJson = json_encode($options);

// Set the Content-Type header to application/json
header('Content-Type: application/json');

// Output the JSON string
echo $optionsJson;
?>
