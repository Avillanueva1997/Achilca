<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Comment = $_POST['_Comment'];
$_Comment = mb_strtoupper($_Comment, 'UTF-8');
$_Date = $_POST['_Date'];
$_Mtto = $_POST['_Mtto'];
$_Year = $_POST['_Year'];
$_Month = $_POST['_Month'];
$_Month = $_Month + 1;
$_Linea = $_POST['_Linea'];

$sql = "insert into produccion_comments(year, month, linea_produccion, comment, fecha, mtto) values('".$_Year."', '".$_Month."', '".$_Linea."', '".$_Comment."', '".$_Date."', '".$_Mtto."');";

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

//mysqli_free_result($result);

close_conection($con);

echo $result;

?>