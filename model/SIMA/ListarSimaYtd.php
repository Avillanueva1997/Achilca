<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select * from sima_ytd;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$SimaYtd = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $year=$row['year'];
    $num_accidentes=$row['num_accidentes'];
    $num_incidentes=$row['num_incidentes'];
    $indice_frecuencia=$row['indice_frecuencia'];
    $indice_severidad=$row['indice_severidad'];

    $SimaYtd[] = array(
    						'code'=>$code,
    						'year'=>$year,
    						'num_accidentes'=>$num_accidentes,
    						'num_incidentes'=>$num_incidentes,
    						'indice_frecuencia'=>$indice_frecuencia,
    						'indice_severidad'=>$indice_severidad
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($SimaYtd);

echo $json_string;
?>