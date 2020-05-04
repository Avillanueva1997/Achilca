<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select * from coord_inspect;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$CoordInspect = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $coord=$row['coord'];
    $inspect=$row['inspect'];
    $grupo=$row['grupo'];

    $CoordInspect[] = array(
    						'code'=>$code,
    						'coord'=>$coord,
    						'inspect'=>$inspect,
    						'grupo'=>$grupo
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($CoordInspect);

echo $json_string;
?>