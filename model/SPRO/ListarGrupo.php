<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select * from grupo;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Grupo = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $description=$row['description'];

    $Grupo[] = array(
    						'code'=>$code,
    						'description'=>$description
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Grupo);

echo $json_string;
?>