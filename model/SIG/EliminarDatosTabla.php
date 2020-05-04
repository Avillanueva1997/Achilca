<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Tabla = $_POST['_Tabla'];
$_Auditoria = $_POST['_Auditoria'];

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$sql = "delete from {$_Tabla} where auditoria = '".$_Auditoria."';";

$result = mysqli_query($con,$sql);


if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}


close_conection($con);

echo $result;

?>
