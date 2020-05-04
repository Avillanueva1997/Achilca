<?php

require_once('../../security.php');
require '../DatosBD.php';


$area = $_POST['_area'];

$sql = "select kpi
from kpis t1
where area = '".$area."';";

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");


$result = mysqli_query($con,$sql);

$Kpis = array();

$i = 1;

while($row = mysqli_fetch_array($result)) 
{ 	    
    $kpi=$row['kpi'];

    $position = 'KPI '.$i;

    $Kpis[] = array(
    						'number'=>$position,
    						'kpi'=>$kpi
    					 );

    $i++;
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Kpis);

echo $json_string;
?>