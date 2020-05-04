<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Month = $_GET['_Month'];
$_Month += 1;
$_Year = $_GET['_Year'];

$sql = "select t1.date_event, t1.comments, t2.area, t1.porcentaje_cumplimiento
        from cumplimiento_entregas_apt t1
        inner join areas t2 on t1.area = t2.code
        where t1.year = {$_Year} and t1.month = {$_Month};";
        
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con)    );
}

$Data = array();

while($row = mysqli_fetch_array($result)) 
{ 	    

    $date_event =$row['date_event'];
    $date_event = explode("-", $date_event);
    $date_event = $date_event[2].'/'.$date_event[1];
    $comments = $row['comments'];
    $area = $row['area'];
    $porcentaje_cumplimiento = $row['porcentaje_cumplimiento'];

    $Data[] = array(
    						'date_event'=>$date_event,
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