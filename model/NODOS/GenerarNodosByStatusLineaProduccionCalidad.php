<?php

require_once('../../security.php');
require '../DatosBD.php';

$_status = $_POST['_status'];
$_prefijo = $_POST['_prefijo'];

$sql = "select * from lineas_produccion where status = '".$_status."';";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");


$result = mysqli_query($con,$sql);

$TileCollection = array();

while($row = mysqli_fetch_array($result)){
	    
    $code=$row['code'];

    $TileCollection[] = array(
    						'title'=>$code,
    						'view'=>$_prefijo.'-'.$code
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode(compact('TileCollection'));

echo $json_string;

?>