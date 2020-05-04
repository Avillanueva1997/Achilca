<?php

date_default_timezone_set('America/Lima');

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_Year = $_POST['_Year'];
$_Month = $_POST['_Month'];
$_Month = $_Month + 1;
$_LineaProduccion = $_POST['_LineaProduccion'];
$_Turno = $_POST['_Turno'];
$evaluation = false;
$secondEvaluation = false;
$hour = date('G');
$hour = $hour.':00';

$secondEvaluation = evaluateHour($hour, '0:00', '8:00');

if($_Turno == 'A'){
    $evaluation = evaluateHour($hour, '8:00', '20:15');
} else {
    $evaluation = evaluateHour($hour, '20:00', '8:15');
}

$sqlLastRecordByDate = "select fecha 
from okrs 
where fecha = (select max(fecha) from okrs where linea_produccion = '".$_LineaProduccion."' and turno = '".$_Turno."' and MONTH(fecha) = {$_Month} and YEAR(fecha) = {$_Year});";

$resultLastRecordByDate = mysqli_query($con, $sqlLastRecordByDate);

if (!$resultLastRecordByDate ) {
    printf("Error message: %s\n", mysqli_error($con));
}

$row_count_lastDate = mysqli_num_rows($resultLastRecordByDate);

if($row_count_lastDate == 1){

    $row_lastDate = mysqli_fetch_assoc($resultLastRecordByDate);
    $lastFecha = $row_lastDate['fecha'];

    mysqli_free_result($resultLastRecordByDate);

}

if(isset($lastFecha) && $lastFecha != ''){
    $root = array(
        'status' => true,
        'value' => $lastFecha,
        'rango' => $evaluation,
        'evaluation' => $secondEvaluation
    );    
} else {
    $root = array(
        'status' => false,
        'rango' => $evaluation,
        'evaluation' => $secondEvaluation
    );    
}

close_conection($con);

$json_string = json_encode(compact('root'));

echo $json_string;

function evaluateHour($hour, $start, $end){
    $currentTime = strtotime($hour);
    $startTime = strtotime($start);
    $endTime = strtotime($end);

    if (
            (
            $startTime < $endTime &&
            $currentTime >= $startTime &&
            $currentTime <= $endTime
            ) ||
            (
            $startTime > $endTime && (
            $currentTime >= $startTime ||
            $currentTime <= $endTime
            )
            )
    ) {
        return true;
    } else {
        return false;
    }
}

?>