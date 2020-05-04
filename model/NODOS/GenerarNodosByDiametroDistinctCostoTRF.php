<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Year = $_POST['_Year'];
$_Prefijo = $_POST['_Prefijo'];

$sql = "select distinct diametro from costo_trf where year = {$_Year};";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");


$result = mysqli_query($con,$sql);

$TileCollection = array();

while($row = mysqli_fetch_array($result)){
	    
    $diametro=$row['diametro'];

    $TileCollection[] = array(
    						'title'=>$diametro,
    						'view'=>$_Prefijo.'-'.$diametro
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode(compact('TileCollection'));

echo $json_string;

?>