<?php


ini_set('display errors', 'on');
error_reporting(E_ALL |E_PARSE);

//$url="https://gnews.io/api/v4/search?q=United%20Kingdom&lang=en&country=uk&max=8&token=9f8e0ae551851d6129530b0c7e1ad47e";

$url="https://gnews.io/api/v4/search?q=".$_REQUEST['country']."&lang=en&country=uk&max=10&token=9f8e0ae551851d6129530b0c7e1ad47e";

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
$output['data']= $decode['articles'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output)




?>