<?php

require_once('../../security.php');
require '../DatosBD.php';

$_year = $_POST['_year'];

$sql = "select t2.description as tipo, t1.numero_incidentes
from incidente_tipo t1
inner join tipo_incidente t2 on t1.tipo = t2.code where t1.year = {$_year};";
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
    $tipo=$row['tipo'];
    $numero_incidentes=$row['numero_incidentes'];
    $sumaIncidentes += $row['numero_incidentes'];

    $Data[] = array(
    						'tipo'=>$tipo,
    						'numero_incidentes'=>$numero_incidentes
    					 );
}

$firstArray = array(
    'tipo' => $_year,
    'numero_incidentes' => $sumaIncidentes
);

array_unshift($Data, $firstArray);

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>