<?php 

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_Month = $_POST['_Month'];
$_Year = $_POST['_Year'];

$DataKpi = array();

$sql ="select date_event, porcentaje_cumplimiento, week(date_event) as week
        from cumplimiento_entregas_apt 
        where year = {$_Year} and month = {$_Month};";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$row_count = mysqli_num_rows( $result );

if($row_count != 0){
    while( $row = mysqli_fetch_array($result) ) {

        $date_event=$row['date_event'];
        $date_event=explode("-", $date_event);
        $date_event = $date_event[2].'/'.$date_event[1];
        $porcentaje_cumplimiento=$row['porcentaje_cumplimiento'];
        $porcentaje_cumplimiento=$porcentaje_cumplimiento / 100;
        $week=$row['week'];
        
        $DataKpi[] = array(          
            'date_event'=> $date_event,
            'week'=> $week,
            'porcentaje_cumplimiento'=> $porcentaje_cumplimiento
        );
    }
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($DataKpi);

echo $json_string;

?>