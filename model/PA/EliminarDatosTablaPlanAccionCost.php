<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Tabla = $_POST['_Tabla'];
$_Type = $_POST['_Type'];
$_Diametro = $_POST['_Diametro'];

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$sql = "delete from {$_Tabla} where type = '".$_Type."' and diametro = '".$_Diametro."';";

$result = mysqli_query($con,$sql);


if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

close_conection($con);

echo $result;

?>
