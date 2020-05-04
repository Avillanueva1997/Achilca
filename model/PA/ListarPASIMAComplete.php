<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Table = $_POST['_Table'];

$sql = "select t1.type, t1.activity, t1.fecha_inicio, t1.fecha_fin, t1.responsable, t1.status, t2.area
from {$_Table} t1
inner join areas t2 on t1.area = t2.code
ORDER BY date_create ASC;";

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

    $type=$row['type'];
    $activity=$row['activity'];
    $fecha_inicio=$row['fecha_inicio'];
    $fecha_fin=$row['fecha_fin'];
    $area=$row['area'];
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

    $Data[] = array(
                            'correlativo'=>$correlativo,
                            'type'=>$type,
                            'activity'=>$activity,
    						'fecha_inicio'=>$fecha_inicio,
                            'fecha_fin'=>$fecha_fin,
                            'area'=>$area,
    						'responsable'=>$responsableString,
    						'status'=>$status
                         );
                         
                         $correlativo++;
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>