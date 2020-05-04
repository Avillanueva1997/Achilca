<?php 

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$TM_Day = 0;

$_Year = $_POST['_Year'];
$_Month = $_POST['_Month'];
$_Month = $_Month + 1;
$_Linea = $_POST['_Linea'];

$date = $_Year.'-'.$_Month.'-'.'01';

$firstDayMonth = date('Y-m-01', strtotime($date));
$endDayMonth = date('Y-m-t', strtotime($date));

$Data = array();

$sqlData = "select fecha, SUM(produccion_neta) as produccion_neta 
            from okrs
            where fecha between '".$firstDayMonth."' and '".$endDayMonth."' and linea_produccion = '".$_Linea."' 
            group by fecha;";

$resultData = mysqli_query($con,$sqlData);

if (!$resultData ) {
    printf("Error message: %s\n", mysqli_error($con));
}

while($row = mysqli_fetch_array($resultData)) 
{ 	    
    
    //$fecha=$row['fecha']->format('m/d/Y');
    //$day=$row['fecha']->format('d');
    //$month=$row['fecha']->format('M');
    $fecha=$row['fecha'];
    $explodeFecha = explode('-', $fecha);
    $day = $explodeFecha[2];
    $month = $explodeFecha[1];
    $month=toChangeMonth($month);
    $fechaFinal = $day.' '. $month;
    $produccion_neta=$row['produccion_neta'];

    $Data[] = array(
                            'fecha'=>$fecha,
                            'day'=>$day,
                            'fechaFinal'=>$fechaFinal,
                            'produccion_neta'=>$produccion_neta
    );
}

mysqli_free_result($resultData);

//print_r($Data);

for ($i=0; $i < sizeof($Data); $i++) {

    /*$explode_fecha = $Data[$i]['fecha'];
    $explode_fecha = explode("/", $explode_fecha);
    $explode_month = $explode_fecha[0];
    $explode_day = $explode_fecha[1];
    $explode_year = $explode_fecha[2];

    $datePosition = $explode_year.'-'.$explode_month.'-'.$explode_day;*/
    $datePosition = $Data[$i]['fecha'];

    $joinDiametro  = '';

    $sql = "select t1.diametro, t2.meta
    from okrs t1
	inner join ball t2 on t1.diametro = t2.length and t1.linea_produccion = t2.linea_produccion
    where t1.fecha = '".$datePosition."' and t1.linea_produccion = '".$_Linea."' group by t1.diametro, t2.meta;";
    
    $result = mysqli_query($con,$sql);

    if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

    $row_count = mysqli_num_rows( $result );

    while($row = mysqli_fetch_array($result)) {

        $diametro = $row['diametro'];
        $meta = $row['meta'];

        $TM_Day += ($row_count == 1) ? $meta * 24 : $meta * 12;
        $joinDiametro .= $diametro.'|';
    }

    $joinDiametro = rtrim($joinDiametro, "|");

    $Data[$i]['diametro'] = $joinDiametro;
    $TM_Day = floor($TM_Day);
    $Data[$i]['TM_Day'] = $TM_Day;

    $TM_Day = 0;

    mysqli_free_result($result);

    $sql = "select sum(produccion_neta) as promedio_acumulado, sum(hrs_pp) as hrs_pp_acumulado
    from okrs
    where fecha between '".$firstDayMonth."' and '".$datePosition."' and linea_produccion = '".$_Linea."';";
    
    $result = mysqli_query($con,$sql);

    if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

    while($row = mysqli_fetch_array($result)) {

        $promedio_acumulado=$row['promedio_acumulado'];
        $hrs_pp_acumulado=$row['hrs_pp_acumulado'];
    }

    $Data[$i]['promedio_acumulado'] = $promedio_acumulado;
    $Data[$i]['hrs_pp_acumulado'] = $hrs_pp_acumulado;

    mysqli_free_result($result);
}

for ($i=0; $i < sizeof($Data) ; $i++) {
    $promedio_per_day = $Data[$i]['promedio_acumulado'] / ($Data[$i]['day'] - ($Data[$i]['hrs_pp_acumulado'] / 24));
    $promedio_per_day = intval($promedio_per_day);
    $Data[$i]['promedio'] = $promedio_per_day;
}

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;

?>