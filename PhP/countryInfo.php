<?php

ini_set('display errors', 'on' );
error_reporting(E_ALL);

$url="http://api.geonames.org/countryInfoJSON?country=".$_REQUEST['countrycode']."&username=drawinghub6&style=full";
//$url="http://api.geonames.org/countryInfoJSON?country=PK&username=drawinghub6&style=full";

$ch=curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);


$result= curl_exec($ch);
curl_close($ch);


//yaha ake variable 
$decode=json_decode($result, true);

$output["status"]["code"] = "200";
$output['status']['name']='ok';
$output['status']['description']='success';
$output['data']= $decode['geonames'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output)


?>