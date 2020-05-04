<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Tabla = $_POST['_Tabla'];
$_Year = $_POST['_Year'];
$_Month = $_POST['_Month'];
$_Month = $_Month + 1; 
$_LineaProduccion = $_POST['_LineaProduccion'];
$_Diametro = $_POST['_Diametro'];

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$sql = "delete from {$_Tabla} where year = {$_Year} and month = {$_Month} and linea_produccion = '".$_LineaProduccion."' and diametro = '".$_Diametro."';";

$result = mysqli_query($con,$sql);


if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}


close_conection($con);

echo $result;

?>
