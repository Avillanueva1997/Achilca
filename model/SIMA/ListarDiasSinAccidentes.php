<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select * from dias_sin_accidentes;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $fecha=$row['fecha'];

    $Data[] = array(
    						'code'=>$code,
    						'fecha'=>$fecha
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>