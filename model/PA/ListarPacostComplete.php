<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Table = $_POST['_Table'];

$sql = "select * from {$_Table} ORDER BY date_create ASC;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

$correlativo = 1;

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $type=$row['type'];
    $diametro=$row['diametro'];
    $activity=$row['activity'];
    $fecha_inicio=$row['fecha_inicio'];
    $fecha_fin=$row['fecha_fin'];
    $responsable=$row['responsable'];
    $responsable= explode("|", $responsable);

    $responsableString = '';

    for ($i=0; $i < sizeof($responsable) ; $i++) {
        $codeRes = $responsable[$i];

        $sqlResponsable = "select name from responsable where code = {$codeRes};";

        $resultResponsable = mysqli_query($con,$sqlResponsable);
    
        if (!$resultResponsable) {
            printf("Error message: %s\n", mysqli_error($con));
        }

        $rowResponsable = mysqli_fetch_assoc($resultResponsable);
        $responsableString .= $rowResponsable['name'] . ' | '; 
        mysqli_free_result($resultResponsable);
    }

    $responsableString = rtrim ($responsableString, ' | ');

    $status=$row['status'];
    $date_create=$row['date_create'];
    $date_update=$row['date_update'];
    $user=$row['user'];

    $Data[] = array(
                            'correlativo'=>$correlativo,
                            'code'=>$code,
                            'type'=>$type,
                            'diametro'=>$diametro,                            
                            'activity'=>$activity,
    						'fecha_inicio'=>$fecha_inicio,
    						'fecha_fin'=>$fecha_fin,
    						'responsable'=>$responsableString,
    						'status'=>$status,
    						'date_create'=>$date_create,
    						'date_update'=>$date_update,
    						'user'=>$user
                         );
                         
                         $correlativo++;
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>