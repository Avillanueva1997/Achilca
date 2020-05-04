<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Type = $_POST['_Type'];

$sql = "select * from pa_cost where type = '".$_Type."'
ORDER BY CAST(code as SIGNED INTEGER) ASC;";
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
    $type=$row['type'];
    $diametro=$row['diametro'];
    $activity=$row['activity'];
    $fecha_inicio=$row['fecha_inicio'];
    $fecha_fin=$row['fecha_fin'];
    $responsable=$row['responsable'];
    $status=$row['status'];
    $date_create=$row['date_create'];
    $date_update=$row['date_update'];
    $user=$row['user'];

    $Data[] = array(
                            'code'=>$code,
                            'type'=>$type,
                            'diametro'=>$diametro,
                            'activity'=>$activity,
    						'fecha_inicio'=>$fecha_inicio,
    						'fecha_fin'=>$fecha_fin,
    						'responsable'=>$responsable,
    						'status'=>$status,
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