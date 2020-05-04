<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select * from turno_trabajo;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$TurnoTrabajo = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $name=$row['name'];
    $type=$row['type'];

    $TurnoTrabajo[] = array(
    						'code'=>$code,
    						'name'=>$name,
    						'type'=>$type
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($TurnoTrabajo);

echo $json_string;
?>