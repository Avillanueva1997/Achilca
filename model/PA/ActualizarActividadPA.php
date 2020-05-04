<?php

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_Code = $_POST['_Code'];
$_CodeCab = $_POST['_CodeCab'];
$_Actividad = $_POST['_Actividad'];
$_FechaEje = $_POST['_FechaEje'];
$_Area = $_POST['_Area'];
$_Responsable = $_POST['_Responsable'];
$_Table = $_POST['_Table'];

$sql = "update {$_Table} set actividad = '".$_Actividad."', fecha_eje = '".$_FechaEje."', area_res = '".$_Area."', persona_res = '".$_Responsable."' where code = '".$_Code."' and code_cab = '".$_CodeCab."';";

$result = mysqli_query($con,$sql);

if (!$result ) {
    printf("Error message: %s\n", mysqli_error($con));
}

close_conection($con);

echo $result;

?>