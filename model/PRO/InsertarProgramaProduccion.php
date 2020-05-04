<?php

require_once('../../security.php');
require '../DatosBD.php';

$title = $_POST['title'];
$info = $_POST['info'];
$start = $_POST['start'];
$end = $_POST['end'];
$linea_produccion = $_POST['linea_produccion'];
$turno = $_POST['turno'];
$option = $_POST['option'];
$diametro = $_POST['diametro'];
$hrs_pp = $_POST['hrs_pp'];
$tm = $_POST['tm'];

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

$sql = "insert into programa_produccion(start_date, end_date, title, info, linea_produccion, turno, `option`, diametro, hrs_pp, tm) values('".$start."', '".$end."', '".$title."', '".$info."', '".$linea_produccion."', '".$turno."', '".$option."', '".$diametro."', '".$hrs_pp."', {$tm});";

print_r($sql);

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