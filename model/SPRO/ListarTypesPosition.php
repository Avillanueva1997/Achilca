<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select * from types_position;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$TypesPosition = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $type=$row['type'];

    $TypesPosition[] = array(
    						'code'=>$code,
    						'type'=>$type
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($TypesPosition);

echo $json_string;
?>