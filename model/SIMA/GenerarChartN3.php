<?php

require_once('../../security.php');
require '../DatosBD.php';

$_year = $_POST['_year'];

$sql = "select t2.description as month, t1.numero_incidentes 
from sima_mtd t1
inner join month t2 on t1.month = t2.code where t1.year = {$_year};";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

$sumaIncidentes = 0;
$row_count = mysqli_num_rows( $result );

while($row = mysqli_fetch_array($result)) 
{ 	    
    $month=$row['month'];
    $numero_incidentes=$row['numero_incidentes'];
    $sumaIncidentes += $row['numero_incidentes'];

    $Data[] = array(
    						'month'=>$month,
    						'numero_incidentes'=>$numero_incidentes
    					 );
}

$promedioIncidentes = ($row_count > 0) ? $sumaIncidentes / $row_count : 0;
$promedioIncidentes = round($promedioIncidentes, 2);

$firstArray = array(
    'month' => $_year,
    'numero_incidentes' => $sumaIncidentes
);

$secondArray = array(
    'month' => 'PROM',
    'numero_incidentes' => $promedioIncidentes
);

array_unshift($Data, $secondArray);
array_unshift($Data, $firstArray);

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>