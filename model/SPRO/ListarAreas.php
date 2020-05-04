<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select * from areas;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Area = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $area=$row['area'];
    $responsable=$row['responsable'];

    $Area[] = array(
    						'code'=>$code,
    						'area'=>$area,
    						'responsable'=>$responsable
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Area);

echo $json_string;
?>