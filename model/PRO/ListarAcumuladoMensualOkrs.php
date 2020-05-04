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

$sql = "select fecha, sum(carga_fria) as carga_fria, sum(produccion_neta) as produccion_neta, sum(bola_observada) as bola_observada from okrs where fecha between '".$firstDayMonth."' and '".$endDayMonth."' and linea_produccion = '".$_LineaProduccion."' group by fecha;";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$AcumuladoReal = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    
    $fecha = $row['fecha'];
    $carga_fria = $row['carga_fria'];
    $produccion_neta = $row['produccion_neta'];
    $bola_observada = $row['bola_observada'];
    $eficiencia = ($carga_fria > 0) ? $produccion_neta / $carga_fria : 0;
    $eficiencia = $eficiencia * 100;
    $eficiencia = toFixed($eficiencia, 1);
    $bola_observada_second = ($bola_observada > 0 || $produccion_neta > 0) ? $bola_observada / ($bola_observada + $produccion_neta) : 0;
    $bola_observada_second = toFixed($bola_observada_second, 1);

    $AcumuladoReal[] = array(
                            'fecha_second' => $fecha,
                            'carga_fria_second' => $carga_fria,
                            'produccion_neta_second' => $produccion_neta,
                            'eficiencia_second' => $eficiencia,
                            'bola_observada_second' => $bola_observada,
                            'bola_observada_second_second' => $bola_observada_second
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode(compact('AcumuladoReal'));

echo $json_string;

?>