<?php

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_Fecha = $_POST['_Fecha'];
$_LineaProduccion = $_POST['_LineaProduccion'];
$_Turno = $_POST['_Turno'];

$sql = "select * from okrs where fecha = '".$_Fecha."' and linea_produccion = '".$_LineaProduccion."' and turno = '".$_Turno."';";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $linea_produccion=$row['linea_produccion'];
    $turno=$row['turno'];
    $fecha=$row['fecha'];
    $bar_charg=$row['bar_charg'];
    $bar_proces=$row['bar_proces'];
    $bar_reject=$row['bar_reject'];
    $coord=$row['coord'];
    $produccion_neta=$row['produccion_neta'];
    $scrap=$row['scrap'];
    $bola_observada=$row['bola_observada'];
    $diametro=$row['diametro'];
    $uptime=$row['uptime'];

    $Data[] = array(
    						'linea_produccion'=>$linea_produccion,
    						'turno'=>$turno,
    						'fecha'=>$fecha,
    						'bar_charg'=>$bar_charg,
    						'bar_proces'=>$bar_proces,
    						'bar_reject'=>$bar_reject,
    						'coord'=>$coord,
    						'produccion_neta'=>$produccion_neta,
    						'scrap'=>$scrap,
    						'bola_observada'=>$bola_observada,
    						'diametro'=>$diametro,
    						'uptime'=>$uptime
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>