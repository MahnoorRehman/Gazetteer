<?php
ini_set('display errors', 'on');
//error_reporting(E_ALL);
error_reporting(E_ERROR | E_PARSE);



//$url="http://api.geonames.org/earthquakesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&username=drawinghub6";
$url="http://api.geonames.org/earthquakesJSON?north=". $_REQUEST['north'] ."&south=". $_REQUEST['south'] ."&east=".$_REQUEST['east']."&west=". $_REQUEST['west'] ."&lang=de&username=drawinghub6";


$ch=curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);


$result=curl_exec($ch);
curl_close($ch);
$decode=json_decode($result, true);
$output["status"]["code"] = "200";
$output['status']['name']='ok';
$output['status']['description']='success';
$output['data']= $decode['earthquakes'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output)

?>