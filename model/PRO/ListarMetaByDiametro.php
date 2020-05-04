<?php

require_once('../../security.php');
require '../DatosBD.php';

$diametro = $_POST['_diametro'];
$linea_produccion = $_POST['_lineaProduccion'];

$sql = "select meta from ball where length = '".$diametro."' and linea_produccion = '".$linea_produccion."';";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Ball = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $meta=$row['meta'];

    $Ball[] = array(
    						'meta'=>$meta
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Ball);

echo $json_string;
?>