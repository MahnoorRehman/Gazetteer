<?php


ini_set('display errors', 'on');
error_reporting(E_ALL |E_PARSE);


//$url="https://openexchangerates.org/api/latest.json?app_id=3359b9f23d8e474e928a5c58d66bcea8&symbols=pkr";
//$url=`https://openexchangerates.org/api/latest.json?app_id=3359b9f23d8e474e928a5c58d66bcea8&symbols=`. $_REQUEST['cCode'];
$url = "https://v6.exchangerate-api.com/v6/9c23b3845db22fad07473ca0/latest/" . $_REQUEST['cCode'];

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
$output['data']= $decode['conversion_rates'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output)
?>