<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select t2.description as year, indice_frecuencia 
from sima_ytd t1
inner join year t2 on t1.year = t2.code;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $year=$row['year'];
    $indice_frecuencia=$row['indice_frecuencia'];

    $Data[] = array(
    						'year'=>$year,
    						'indice_frecuencia'=>$indice_frecuencia
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>