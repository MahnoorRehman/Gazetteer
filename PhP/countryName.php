<?php


ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);


    $API_KEY= '023a8870b7e6429494f6df6afc55d2b2';
	//$url = 'https://api.opencagedata.com/geocode/v1/json?q=' . $_REQUEST['country'] . '&key=' . $API_KEY;
	$url = 'https://api.opencagedata.com/geocode/v1/json?q=PK&key='. $API_KEY;



    $ch= curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);
    curl_close($ch);

	$decode = json_decode($result,true);	
	echo($decode)
    $output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status'];
	$output['data'] = $decode['results'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
?>
