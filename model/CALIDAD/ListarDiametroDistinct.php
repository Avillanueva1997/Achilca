<?php

require_once('../../security.php');
require '../DatosBD.php';

$_LineaProduccion = $_POST['_LineaProduccion'];
$_Moye = $_POST['_Moye'];
$_Moye = explode(".", $_Moye);
$_Month = $_Moye[0];
$_Month = $_Month + 1;
$_Year = $_Moye[1];

$sql = "select distinct diametro from dist_bola_obs where linea_produccion = '".$_LineaProduccion."' and year = {$_Year} and month = {$_Month};";

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");


$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$DistBolaObs = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $diametro=$row['diametro'];

    $DistBolaObs[] = array(
    						'diametro'=>$diametro
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($DistBolaObs);

echo $json_string;

?>