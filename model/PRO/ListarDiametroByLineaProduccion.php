<?php

require_once('../../security.php');
require '../DatosBD.php';

$_LineaProduccion = $_POST['_LineaProduccion'];

$sql = "select length from ball where linea_produccion = '".$_LineaProduccion."';";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$InfoBall = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $length=$row['length'];

    $InfoBall[] = array(
    						'length'=>$length
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($InfoBall);

echo $json_string;
?>