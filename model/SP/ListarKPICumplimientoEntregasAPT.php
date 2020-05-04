<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Month = $_POST['_Month'];
$_Month += 1;
$_Year = $_POST['_Year'];

$sql = "select * from cumplimiento_entregas_apt where year = {$_Year} and month = {$_Month};";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con)    );
}

$Data = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $month=$row['month'];
    $year=$row['year'];
    $date_event=$row['date_event'];
    $entrega_proy=$row['entrega_proy'];
    $entrega_real=$row['entrega_real'];
    $comments=$row['comments'];
    $area=$row['area'];
    $porcentaje_cumplimiento=$row['porcentaje_cumplimiento'];

    $Data[] = array(
    						'code'=>$code,
    						'month'=>$month,
    						'year'=>$year,
    						'date_event'=>$date_event,
    						'entrega_proy'=>$entrega_proy,
                            'entrega_real'=>$entrega_real,
                            'comments'=>$comments,
                            'area'=>$area,
    						'porcentaje_cumplimiento'=>$porcentaje_cumplimiento
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>