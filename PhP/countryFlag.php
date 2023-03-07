


<?php
ini_set('display errors', 'on');
//error_reporting(E_ALL);
error_reporting(E_ERROR | E_PARSE);



//$url="https://restcountries.com/v2/alpha/pk?fields=flag";
$url="https://restcountries.com/v2/alpha/".$_REQUEST['isoCode']."?fields=flag";


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
$output['data']= $decode['flag'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output)

?>

