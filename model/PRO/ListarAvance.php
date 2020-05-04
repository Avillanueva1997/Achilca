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

$Avance = 0;
$AvProy = 0;
$produccion_neta = 0;
$cuota = 0;
$meta = 0;
$Dif = 0;

$sqlData = "select sum(produccion_neta) as produccion_neta, sum(cuota) as cuota
            from okrs
            where fecha between '".$firstDayMonth."' and '".$endDayMonth."' and linea_produccion = '".$_Linea."';";

$resultData = mysqli_query($con,$sqlData);

if (!$resultData ) {
    printf("Error message: %s\n", mysqli_error($con));
}

while($row = mysqli_fetch_array($resultData)) 
{ 	    
    $produccion_neta=$row['produccion_neta'];
    $cuota=$row['cuota'];
}

mysqli_free_result($resultData);

$sqlData = "select sum(tm) as tm
            from programa_produccion
            where date(start_date) between '".$firstDayMonth."' and '".$endDayMonth."' and linea_produccion = '".$_Linea."';";

$resultData = mysqli_query($con,$sqlData);

if (!$resultData ) {
    printf("Error message: %s\n", mysqli_error($con));
}

while($row = mysqli_fetch_array($resultData)) 
{ 	    
    $meta=$row['tm'];
}

mysqli_free_result($resultData);

//Av. Real
$Avance = ($meta == 0 || is_null($meta)) ? 0 : $produccion_neta / $meta ;
$Avance = $Avance * 100;
$Avance = intval($Avance);

//Av. Proy
$AvProy = ($meta == 0 || is_null($meta)) ? 0 : $cuota / $meta;
$AvProy = $AvProy * 100;
$AvProy = intval($AvProy);

$Dif = $Avance - $AvProy;
$Dif = intval($Dif);
    
close_conection($con);

$root = array(
    'AvReal' => $Avance,
    'Diferencia' => $Dif
);

$json_string = json_encode(compact('root'));

echo $json_string;

?>