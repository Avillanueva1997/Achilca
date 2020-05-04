<?php

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_LineaProduccion = $_POST['_LineaProduccion'];
$_Moye = $_POST['_Moye'];

$explodeMoye = explode(".", $_Moye);

$month = $explodeMoye[0];
$month = $month + 1;
$year = $explodeMoye[1];

$date = $year.'-'.$month.'-'.'01';

$firstDayMonth = date('Y-m-01', strtotime($date));
$endDayMonth = date('Y-m-t', strtotime($date));

$sql = "select * from cierre_okrs where fecha between '".$firstDayMonth."' and '".$endDayMonth."' and linea_produccion = '".$_LineaProduccion."';";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$AcumuladoFinal = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    
    $code = $row['code'];
    $fecha = $row['fecha'];
    $carga_fria = $row['carga_fria'];
    $produccion_neta = $row['produccion_neta'];
    $eficiencia = $row['eficiencia'];
    $bola_observada = $row['bola_observada'];
    $bola_observada_second = $row['bola_observada_second'];

    $AcumuladoFinal[] = array(
                            'code' => $code,
                            'fecha' => $fecha,
                            'carga_fria' => $carga_fria,
                            'produccion_neta' => $produccion_neta,
                            'eficiencia' => $eficiencia,
                            'bola_observada' => $bola_observada,
                            'bola_observada_second' => $bola_observada_second
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode(compact('AcumuladoFinal'));

echo $json_string;

?>