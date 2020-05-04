<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select fecha from dias_sin_accidentes where fecha = (select max(fecha) from dias_sin_accidentes);";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $fecha=$row['fecha'];

    $Data[] = array(
    						'fecha'=>$fecha
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>