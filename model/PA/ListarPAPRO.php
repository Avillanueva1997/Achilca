<?php

require_once('../../security.php');
require '../DatosBD.php';

$_LineaProduccion = $_POST['_LineaProduccion'];
$_Type = $_POST['_Type'];

$sql = "select * from pa_pro where linea_produccion = '".$_LineaProduccion."' and type = '".$_Type."';";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $activity=$row['activity'];
    $fecha_evento=$row['fecha_evento'];
    $fecha_inicio=$row['fecha_inicio'];
    $fecha_fin=$row['fecha_fin'];
    $responsable=$row['responsable'];
    $status=$row['status'];
    $linea_produccion=$row['linea_produccion'];
    $type=$row['type'];
    $date_create=$row['date_create'];
    $date_update=$row['date_update'];
    $user=$row['user'];

    $Data[] = array(
    						'code'=>$code,
                            'activity'=>$activity,
                            'fecha_evento'=>$fecha_evento,
    						'fecha_inicio'=>$fecha_inicio,
    						'fecha_fin'=>$fecha_fin,
    						'responsable'=>$responsable,
    						'status'=>$status,
    						'linea_produccion'=>$linea_produccion,
    						'type'=>$type,
    						'date_create'=>$date_create,
    						'date_update'=>$date_update,
    						'user'=>$user
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>