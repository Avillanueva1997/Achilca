<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select * from kpis;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Kpi = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $kpi=$row['kpi'];
    $area=$row['area'];

    $Kpi[] = array(
    						'code'=>$code,
    						'kpi'=>$kpi,
    						'area'=>$area
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Kpi);

echo $json_string;
?>