<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select * from cump_fecha_atencion;";
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
    $fecha_real=$row['fecha_real'];
    $fecha_proy=$row['fecha_proy'];
    $result=$row['result'];

    $Data[] = array(
    						'code'=>$code,
    						'fecha_real'=>$fecha_real,
    						'fecha_proy'=>$fecha_proy,
    						'result'=>$result
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>