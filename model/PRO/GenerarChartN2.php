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
//$addingOneDayEnd = date('Y-m-d',strtotime($endDayMonth . "+1 days"));

$Data = array();

$sqlData = "select fecha, SUM(produccion_neta) as produccion_neta, sum(carga_fria) as carga_fria
            from okrs
            where fecha between '".$firstDayMonth."' and '".$endDayMonth."' and linea_produccion = '".$_Linea."' 
            group by fecha;";

$resultData = mysqli_query($con,$sqlData);

if (!$resultData ) {
    printf("Error message: %s\n", mysqli_error($con));
}

while($row = mysqli_fetch_array($resultData)) 
{ 	    
    
    $fecha=$row['fecha'];
    $explodeFecha = explode('-', $fecha);
    $day = $explodeFecha[2];
    $month = $explodeFecha[1];
    $month=toChangeMonth($month);
    $fechaFinal = $day.' '. $month;
    $produccion_neta=$row['produccion_neta'];
    $carga_fria=$row['carga_fria'];
    $eficiencia = ($carga_fria > 0) ? $produccion_neta / $carga_fria : 0;
    $eficiencia = round($eficiencia,3);
    //$eficiencia = $eficiencia * 100;
    //$eficiencia = round($eficiencia);

    $Data[] = array(
                            'fecha'=>$fecha,
                            'fechaFinal'=>$fechaFinal,
                            'eficiencia'=>$eficiencia
    );
}

mysqli_free_result($resultData);


for ($i=0; $i < sizeof($Data); $i++) {

    $datePosition = $Data[$i]['fecha'];

    $joinDiametro  = '';

    $sql = "select diametro
    from okrs
    where fecha = '".$datePosition."' and linea_produccion = '".$_Linea."' group by diametro;";
    
    $result = mysqli_query($con,$sql);

    if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

    $row_count = mysqli_num_rows( $result );

    while($row = mysqli_fetch_array($result)) {

        $diametro = $row['diametro'];
        $joinDiametro .= $diametro.'|';
    }

    $joinDiametro = rtrim($joinDiametro, "|");
    $Data[$i]['diametro'] = $joinDiametro;

    mysqli_free_result($result);

    $sql = "select sum(produccion_neta) as produccion_neta_acumulado, sum(carga_fria) as carga_fria_acumulado
    from okrs
    where fecha between '".$firstDayMonth."' and '".$datePosition."' and linea_produccion = '".$_Linea."';";
    
    $result = mysqli_query($con,$sql);

    if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

    while($row = mysqli_fetch_array($result)) {

        $produccion_neta_acumulado=$row['produccion_neta_acumulado'];
        $carga_fria_acumulado=$row['carga_fria_acumulado'];
    }

    $Data[$i]['produccion_neta_acumulado'] = $produccion_neta_acumulado;
    $Data[$i]['carga_fria_acumulado'] = $carga_fria_acumulado;

    mysqli_free_result($result);
}

for ($i=0; $i < sizeof($Data) ; $i++) {
    $promedio_per_day = ($Data[$i]['carga_fria_acumulado'] > 0) ? $Data[$i]['produccion_neta_acumulado'] / $Data[$i]['carga_fria_acumulado'] : 0;
    $promedio_per_day = round($promedio_per_day,3);
    //$promedio_per_day = $promedio_per_day * 100;
    //$promedio_per_day = intval($promedio_per_day);
    $Data[$i]['promedio'] = $promedio_per_day;
}

    
close_conection($con);

$json_string = json_encode($Data);

echo $json_string;

?>