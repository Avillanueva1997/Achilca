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
//$addingOneDayEnd = date('Y-m-d',strtotime($endDayMonth . "+1 days"));

$status_LP = '1';
$sqlLineas = "select code from lineas_produccion where status = '".$status_LP."';";

$resultLineas = mysqli_query($con,$sqlLineas);

if (!$resultLineas) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

while($row = mysqli_fetch_array($resultLineas)){

    $_LineaProduccion = $row['code'];

    $sqlData = "select linea_produccion, sum(produccion_neta) as produccion_neta, sum(bola_observada) as bola_observada
                from okrs
                where fecha between '".$firstDayMonth."' and '".$endDayMonth."' and linea_produccion = '".$_LineaProduccion."' group by linea_produccion;";                

    $resultData = mysqli_query($con,$sqlData);

    if (!$resultData ) {
    printf("Error message: %s\n", mysqli_error($con));
}

    while($row = mysqli_fetch_array($resultData)) 
    { 	    
        
        $linea_produccion=$row['linea_produccion'];
        $produccion_neta=$row['produccion_neta'];
        $bola_observada=$row['bola_observada'];

        $Data[] = array(
                                'linea_produccion'=>$linea_produccion,
                                'produccion_neta'=>$produccion_neta,
                                'bola_observada'=>$bola_observada
        );
    }

    mysqli_free_result($resultData);
}
   
    mysqli_free_result($resultLineas);
    
    close_conection($con);

	$json_string = json_encode($Data);

    echo $json_string;
?>