<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select * from tipo_incidente;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$TipoIncidente = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $description=$row['description'];

    $TipoIncidente[] = array(
    						'code'=>$code,
    						'description'=>$description
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($TipoIncidente);

echo $json_string;
?>