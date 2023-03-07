<?php
error_log(print_r($_POST, true));

if(isset($_POST['country'])) {
    $countryCode = $_POST['country'];

    $data = file_get_contents("./../data/countryBorders.json");
    $polygons = json_decode($data, true);

    // Find the polygon for the selected country
    foreach ($polygons['features'] as $polygon) {
        $isoCode = $polygon['properties']['iso_a2'];

        if ($isoCode === $countryCode) {
            $selectedPolygon = array(
                'type' => 'FeatureCollection',
                'features' => array($polygon)
            );
            break;
        }
    }

    if (isset($selectedPolygon)) {
        $selectedPolygonJson = json_encode($selectedPolygon);

        // Set the Content-Type header to application/json
        header('Content-Type: application/json');

        // Output the JSON string for the selected polygon
        echo $selectedPolygonJson;
    } else {
        // Return an error message if the selected country code is not found
        http_response_code(400);
        echo json_encode(array('message' => 'Invalid country code'));
    }
} else {
    // Return an error message if the country code is not provided
    http_response_code(400);
    echo json_encode(array('message' => 'Country code is required'));
}
?>
