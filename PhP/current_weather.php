<?php

ini_set('display errors', 'on');
error_reporting(E_ALL|E_PARSE);

$url="http://api.openweathermap.org/data/2.5/weather?q=".$_REQUEST['country']."&appid=8c797837211bd55bafdcadd9bc8cb2fc";


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
$output['data']= $decode;


echo json_encode($output);



?>