<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select * from factor_linea;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$FactorLinea = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $linea_produccion=$row['linea_produccion'];
    $factor=$row['factor'];

    $FactorLinea[] = array(
    						'code'=>$code,
    						'linea_produccion'=>$linea_produccion,
    						'factor'=>$factor   
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($FactorLinea);

echo $json_string;
?>