<?php

require_once('../../security.php');
require '../DatosBD.php';


$_Year = $_POST['_Year'];
$_Month = $_POST['_Month'];
$_Month = $_Month + 1;
$_LineaProduccion = $_POST['_LineaProduccion'];
$_Diametro = $_POST['_Diametro'];

$sql = "select * from dist_bola_obs where year = {$_Year} and month = {$_Month} and linea_produccion = '".$_LineaProduccion."' and diametro = '".$_Diametro."' ;";

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
    $defecto=$row['defecto'];
    $quantity=$row['quantity'];

    $DistBolaObs[] = array(
    						'diametro'=>$diametro,
    						'defecto'=>$defecto,
    						'quantity'=>$quantity
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($DistBolaObs);

echo $json_string;
?>