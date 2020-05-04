<?php 

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_Year = $_POST['_Year'];
$_Month = $_POST['_Month'];
$_Month = $_Month + 1;
$_Linea = $_POST['_Linea'];

$date = $_Year.'-'.$_Month.'-'.'01';

$firstDayMonth = date('Y-m-01', strtotime($date));
$endDayMonth = date('Y-m-t', strtotime($date));

$Data = array();

$sqlData = "select avg(uptime) as uptime,  avg(rendimiento) as rendimiento, avg(eficiencia) as eficiencia 
            from okrs
            where fecha between '".$firstDayMonth."' and '".$endDayMonth."' and linea_produccion = '".$_Linea."';";

$resultData = mysqli_query($con,$sqlData);

if (!$resultData ) {
    printf("Error message: %s\n", mysqli_error($con));
}

while($row = mysqli_fetch_array($resultData)) 
{ 	    
    $uptime = $row['uptime'];
    $uptime = toFixed($uptime, 1);
    $uptime = $uptime / 100;
    $rendimiento = $row['rendimiento'];
    $rendimiento = toFixed($rendimiento, 1);
    $rendimiento = $rendimiento / 100;
    $eficiencia = $row['eficiencia'];
    $eficiencia = toFixed($eficiencia, 1);
    $eficiencia = $eficiencia / 100;
    $oee = $uptime * $rendimiento *  $eficiencia;
    $oee = $oee * 100;
    $oee = toFixed($oee, 1); 

    $Data[] = array(
                    'oee' => 'OEE',
                    'quantity' =>$oee
    );
}

$Difference = $Data[0]["quantity"];
$Difference = 100 - $Difference;
$Difference = toFixed($Difference, 1);

$Data[] = array(
    'oee' => 'Diferencia',
    'quantity' => $Difference
);

mysqli_free_result($resultData);
    
close_conection($con);

$json_string = json_encode($Data);

echo $json_string;

?>