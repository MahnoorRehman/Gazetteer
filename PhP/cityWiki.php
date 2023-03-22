<?php

ini_set('display errors', 'on');
error_reporting(E_ERROR|E_PARSE);
$city = urlencode($_REQUEST['city']);
//$city=$_REQUEST['city'];

//$url='http://api.geonames.org/wikipediaSearchJSON?q=quetta&maxRows=10&username=drawinghub6';
//$url="http://api.geonames.org/wikipediaSearchJSON?q=$city&maxRows=30&username=drawinghub6";
//$url="http://api.geonames.org/findNearbyWikipediaJSON?lat=".$_REQUEST['lat']."&lng=".$_REQUEST['lng']."&username=drawinghub6";
$url="http://api.geonames.org/wikipediaBoundingBoxJSON?formatted=true&north=". $_REQUEST['north'] ."&south=". $_REQUEST['south'] ."&east=".$_REQUEST['east']."&west=". $_REQUEST['west'] ."&maxRows=30&username=drawinghub6&style=full";
$ch=curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);


$result= curl_exec($ch);
curl_close($ch);
$decode=json_decode($result, true);
$output["status"]["code"] = "200";
$output['status']['name']='ok';
$output['status']['description']='success';
$output['data']= $decode['geonames'];

echo json_encode($output);






?>