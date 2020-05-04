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

$cuota = 0;
$meta = 0;
$Dif = 0;

$sqlData = "select sum(cuota) as cuota from okrs where fecha between '".$firstDayMonth."' and '".$endDayMonth."' and linea_produccion = '".$_Linea."';";

$resultData = mysqli_query($con,$sqlData);

if (!$resultData ) {
    printf("Error message: %s\n", mysqli_error($con));
}

while($row = mysqli_fetch_array($resultData)) 
{ 	    
    $cuota = $row['cuota'];
    $cuota = intval($cuota);

    $Data[] = array(
        'descrip' => 'PROY',
        'quantity' => $cuota
    );
}

mysqli_free_result($resultData);

$sqlData = "select sum(tm) as tm from programa_produccion where date(start_date) between '".$firstDayMonth."' and '".$endDayMonth."' and linea_produccion = '".$_Linea."';";

$resultData = mysqli_query($con,$sqlData);

if (!$resultData ) {
    printf("Error message: %s\n", mysqli_error($con));
}

while($row = mysqli_fetch_array($resultData)) 
{ 	    
    $meta=$row['tm'];
}

mysqli_free_result($resultData);

$Dif = $meta - $cuota;
$Dif = intval($Dif);

$Data[] = array(
    'descrip' => 'DIF',
    'quantity' => $Dif,
    'meta' => $meta
);
    
close_conection($con);

$json_string = json_encode($Data);

echo $json_string;

?>