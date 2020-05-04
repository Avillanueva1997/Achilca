<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select * from bpm;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$BPM = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $linea_produccion=$row['linea_produccion'];
    $diametro=$row['diametro'];
    $cantidad=$row['cantidad'];

    $BPM[] = array(
    						'code'=>$code,
    						'linea_produccion'=>$linea_produccion,
    						'diametro'=>$diametro,
    						'cantidad'=>$cantidad
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($BPM);

echo $json_string;
?>