<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Year = $_POST['_Year'];
$_Month = $_POST['_Month'];
$_Month = $_Month + 1;

$sql = "select distinct diametro from costo_trf where year = {$_Year} and month = {$_Month} and objetivo != 0;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");


$result = mysqli_query($con,$sql);

$Data = array();

while($row = mysqli_fetch_array($result)){
	    
    $diametro=$row['diametro'];

    $Data[] = array(
    						'diametro'=>$diametro
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;

?>