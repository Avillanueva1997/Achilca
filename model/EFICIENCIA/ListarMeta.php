<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Year = $_POST['_Year'];
$_LineaProduccion = $_POST['_LineaProduccion'];

$sql = "select meta from meta_eficiencia where year = {$_Year} and linea_produccion = '".$_LineaProduccion."';";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Meta = 0;

while($row = mysqli_fetch_array($result)) 
{ 	    
    $Meta=$row['meta'];
}

mysqli_free_result($result);

close_conection($con);

echo $Meta;
?>