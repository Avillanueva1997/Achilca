<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Tabla = $_POST['_Tabla'];
$_LineaProduccion = $_POST['_LineaProduccion'];
$_Turno = $_POST['_Turno'];
$_CodeCabecera = $_POST['_CodeCabecera'];

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$sql = "delete from {$_Tabla} where linea_produccion = '".$_LineaProduccion."' and turno = '".$_Turno."' and code_cabecera = '".$_CodeCabecera."';";

$result = mysqli_query($con,$sql);


if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}


close_conection($con);

echo $result;

?>
