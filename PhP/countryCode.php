<?php

// ini_set('display_errors', 'on');
// error_reporting(E_ERROR|E_PARSE);

// //$url = 'http://api.geonames.org/countryCodeJSON?lat=47.03&lng=10.2&username=drawinghub6';
// $url = "http://api.geonames.org/countryCodeJSON?lat=".$_REQUEST['latitude']."&lng=".$_REQUEST['longitude']."&username=drawinghub6";
// $ch = curl_init();
// curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// curl_setopt($ch, CURLOPT_URL, $url);

// $result = curl_exec($ch);
// curl_close($ch);
// $decode=json_decode($result, true);


// $output["status"]["code"] = "200";
// $output['status']['name'] = 'ok';
// $output['status']['description'] = 'success';
// $output['data'] =  $decode; // use the result as it is
// echo json_encode($output);










 

ini_set('display_errors', 'on');

error_reporting(E_ERROR|E_PARSE);

 

//$url = 'http://api.geonames.org/countryCodeJSON?lat=47.03&lng=10.2&username=drawinghub6';

$url = "http://api.geonames.org/countryCodeJSON?lat=".$_REQUEST['latitude']."&lng=".$_REQUEST['longitude']."&username=drawinghub6";

$ch = curl_init();

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

curl_setopt($ch, CURLOPT_URL, $url);

 

$result = curl_exec($ch);

curl_close($ch);

 

$decode=json_decode($result, true);

 

$output["status"]["code"] = "200";

$output['status']['name'] = 'ok';

$output['status']['description'] = 'success';

$output['data'] =  $decode; // use the result as it is

 

echo json_encode($output);

 




?>
