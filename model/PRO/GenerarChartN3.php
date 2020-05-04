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

$sqlData = "select sum(produccion_neta) as produccion_neta,  sum(cuota) as cuota
            from okrs
            where fecha between '".$firstDayMonth."' and '".$endDayMonth."' and linea_produccion = '".$_Linea."';";

$resultData = mysqli_query($con,$sqlData);

if (!$resultData ) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Dif = 0;
$secondDif = 0;

while($row = mysqli_fetch_array($resultData)) 
{ 	    
    $produccion_neta = $row['produccion_neta'];
    $produccion_neta = intval($produccion_neta);
    $cuota = $row['cuota'];
    $cuota = intval($cuota);

    $Dif = $produccion_neta - $cuota;
    $Dif = intval($Dif);

    $secondDif = $cuota - $produccion_neta;
    $secondDif = intval($secondDif);

    $Data[] = array(
                    'descrip' => 'REAL',
                    'secondQuantity' => $produccion_neta,
                    'proy' => $cuota
    );
}

$Data[] = array(
    'descrip' => 'DIF',
    'quantity' => $Dif,
    'secondQuantity' => $secondDif
);

mysqli_free_result($resultData);
    
close_conection($con);

$json_string = json_encode($Data);

echo $json_string;

?>