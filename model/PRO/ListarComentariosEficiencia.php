<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Year = $_POST['_Year'];
$_Month = $_POST['_Month'];
$_Month = $_Month + 1;
$_Linea = $_POST['_Linea'];

$sql = "select fecha, comment from eficiencia_comments where year = {$_Year} and month = {$_Month} and linea_produccion = '".$_Linea. "' order by fecha asc;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Comments = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $fecha=$row['fecha'];
    $fecha = explode("-", $fecha);
    $fecha = $fecha[1].'/'.$fecha[2];
    $comment=$row['comment'];

    $Comments[] = array(
                            'fecha'=>$fecha,
                            'comment'=>$comment
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Comments);

echo $json_string;
?>