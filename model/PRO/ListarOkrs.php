<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select * from okrs;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Okrs = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $fecha=$row['fecha'];
    $diametro=$row['diametro'];
    $coord=$row['coord'];
    $bar_charg=$row['bar_charg'];
    $bar_proces=$row['bar_proces'];
    $bar_reject=$row['bar_reject'];
    $hrs_disp=$row['hrs_disp'];
    $hrs_pp=$row['hrs_pp'];
    $sobre_peso=$row['sobre_peso'];
    $bpm=$row['bpm'];
    $carga_fria=$row['carga_fria'];
    $produccion_neta=$row['produccion_neta'];
    $bola_observada=$row['bola_observada'];
    $barra_rechazada=$row['barra_rechazada'];
    $scrap=$row['scrap'];
    $cascarilla=$row['cascarilla'];
    $eficiencia=$row['eficiencia'];
    $barra_chatarra=$row['barra_chatarra'];
    $uptime=$row['uptime'];
    $rendimiento=$row['rendimiento'];
    $calidad=$row['calidad'];
    $oee=$row['oee'];
    $cuota=$row['cuota'];
    $por_cumplimiento=$row['por_cumplimiento'];

    $Okrs[] = array(
    						'code'=>$code,
    						'fecha'=>$fecha,
    						'diametro'=>$diametro,
    						'coord'=>$coord,
    						'bar_charg'=>$bar_charg,
    						'bar_proces'=>$bar_proces,
    						'bar_reject'=>$bar_reject,
    						'hrs_disp'=> 12,
    						'hrs_pp'=>$hrs_pp,
    						'sobre_peso'=>$sobre_peso,
    						'bpm'=>$bpm,
    						'carga_fria'=>$carga_fria,
    						'produccion_neta'=>$produccion_neta,
    						'bola_observada'=>$bola_observada,
    						'barra_rechazada'=>$barra_rechazada,
    						'scrap'=>$scrap,
    						'cascarilla'=>$cascarilla,
    						'eficiencia'=>$eficiencia,
    						'barra_chatarra'=>$barra_chatarra,
    						'uptime'=>$uptime,
    						'rendimiento'=>$rendimiento,
    						'calidad'=>$calidad,
    						'oee'=>$oee,
    						'cuota'=>$cuota,
                            'por_cumplimiento'=>$por_cumplimiento
    );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Okrs);

echo $json_string;
?>