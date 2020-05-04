<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Tabla = $_POST['_Tabla'];
$_FirstDate = $_POST['_FirstDate'];
$_EndDate = $_POST['_EndDate'];
$_LineaProduccion = $_POST['_LineaProduccion'];
$_Turno = $_POST['_Turno'];

/*$explodeStartDate = explode('-', $_FirstDate);
$_FirstDate = $explodeStartDate[1].'/'.$explodeStartDate[2].'/'.$explodeStartDate[0];
$explodeEndDate = explode('-', $_EndDate);
$_EndDate = $explodeEndDate[1].'/'.$explodeEndDate[2].'/'.$explodeEndDate[0];
$_EndDate = date('m/d/Y',strtotime($_EndDate . "+1 days"));*/

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$sql = "delete from {$_Tabla} where fecha between '".$_FirstDate."' and '".$_EndDate."' and linea_produccion  = '".$_LineaProduccion."' and turno = '".$_Turno."';";

$result = mysqli_query($con,$sql);


if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

close_conection($con);

echo $result;

?>
