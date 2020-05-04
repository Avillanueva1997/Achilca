<?php

require_once('../../security.php');
require '../DatosBD.php';

$title = $_POST['title'];
$info = $_POST['info'];
$start = $_POST['start'];
$end = $_POST['end'];
$turno = $_POST['turno'];
$mecanico = $_POST['mecanico'];

$explodeStart = explode(" ", $start);
$explodeEnd = explode(" ", $end);

$dateStart = str_replace("/", "-", $explodeStart[0]);
$dateEnd = str_replace("/", "-", $explodeEnd[0]);

$justStart = explode("-", $dateStart);
$justStart = $justStart[2].'-'.$justStart[1].'-'.$justStart[0];
$justEnd = explode("-", $dateEnd);
$justEnd = $justEnd[2].'-'.$justEnd[1].'-'.$justEnd[0];

$start = $justStart.' '.$explodeStart[1];
$end = $justEnd.' '.$explodeEnd[1];

$sql = "insert into tt_mecanico(start_date, end_date, title, info, turno, mecanico) values('".$start."', '".$end."', '".$title."', '".$info."', '".$turno."', '".$mecanico."');";

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

mysqli_free_result($result);

close_conection($con);

echo $result;

?>