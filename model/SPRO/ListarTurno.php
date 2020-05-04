<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select * from turno;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Turno = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $description=$row['description'];
    $start_time=$row['start_time'];
    $end_time=$row['end_time'];

    $Turno[] = array(
    						'code'=>$code,
    						'description'=>$description,
    						'start_time'=>$start_time,
    						'end_time'=>$end_time
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Turno);

echo $json_string;
?>