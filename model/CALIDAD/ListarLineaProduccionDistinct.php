<?php

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_Year = $_POST['_Year'];
$_Month = $_POST['_Month'];
$_Month = $_Month + 1;

$date = $_Year.'-'.$_Month.'-'.'01';

$firstDayMonth = date('Y-m-01', strtotime($date));
$endDayMonth = date('Y-m-t', strtotime($date));

$sql = "select distinct linea_produccion 
        from okrs
        where fecha between '".$firstDayMonth."' and '".$endDayMonth."';";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

while($row = mysqli_fetch_array($result)){ 	    
    $linea_produccion=$row['linea_produccion'];

    $Data[] = array(
    						'linea_produccion'=>$linea_produccion
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>