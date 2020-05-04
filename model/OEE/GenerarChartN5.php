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

$firstDayMonthObject = date_create_from_format("Y-m-d", $firstDayMonth);
$endDayMonthObject = date_create_from_format("Y-m-d", $endDayMonth);
$diffDays = $endDayMonthObject->diff($firstDayMonthObject)->format("%a");

$Data = array();

for ($i=0; $i < $diffDays; $i++) {
    $sqlData = "select t1.fecha, t1.diametro, sum(carga_fria) as carga_fria, sum(t1.produccion_neta) as produccion_neta, sum(t1.bola_observada) as bola_observada, sum(t1.scrap) as scrap, sum(t1.bpm) as bpm, sum(t1.hrs_disp) as hrs_disp, sum(t1.hrs_pp) as hrs_pp, sum(t1.sobre_peso) as sobre_peso, count(t1.fecha) as numberRows, t2.weight, t2.bpm as bpmReal
                from okrs t1
                inner join ball t2 on t1.diametro = t2.length and t1.linea_produccion = t2.linea_produccion
                where t1.fecha = '".$firstDayMonth."' and t1.linea_produccion = '".$_Linea."' group by t1.fecha, t1.diametro, t2.weight, t2.bpm;";

    $resultData = mysqli_query($con,$sqlData);

    if (!$resultData ) {
    printf("Error message: %s\n", mysqli_error($con));
}

    while($row = mysqli_fetch_array($resultData)) 
    { 	    
        $fecha = $row['fecha'];
        $fecha = explode('-', $fecha);
        $day = $fecha[2];
        $month = $fecha[1];
        $month = toChangeMonth($month);
        $carga_fria = $row['carga_fria'];
        $produccion_neta = $row['produccion_neta'];
        $bola_observada = $row['bola_observada'];
        $scrap = $row['scrap'];
        $bpm = $row['bpm'];
        $hrs_disp = $row['hrs_disp'];
        $hrs_pp= $row['hrs_pp'];
        $sobre_peso= $row['sobre_peso'];
        $numberRows= $row['numberRows'];
        $weight= $row['weight'];
        $bpmReal= $row['bpmReal'];

        $Data[] = array(
                        'fecha' => $day . ' ' . $month,
                        'carga_fria' => $carga_fria,
                        'produccion_neta' => $produccion_neta,
                        'bola_observada' => $bola_observada,
                        'scrap' => $scrap,
                        'bpm' => $bpm,
                        'hrs_disp' => $hrs_disp,
                        'hrs_pp' => $hrs_pp,
                        'sobre_peso' => $sobre_peso,
                        'numberRows' => $numberRows,
                        'weight' => $weight,
                        'bpmReal' => $bpmReal
        );
    }
 
    mysqli_free_result($resultData);

    $firstDayMonth = date('Y-m-d',strtotime($firstDayMonth . "+1 days"));
}

for ($i=0; $i < sizeof($Data) ; $i++) { 
    //if($Data[$i]['numberRows'] == 2){
        $produccion_neta = $Data[$i]['produccion_neta'];
        $bola_observada = $Data[$i]['bola_observada'];
        $scrap = $Data[$i]['scrap'];
        $sobre_peso = $Data[$i]['sobre_peso'];
        $weight = $Data[$i]['weight'];
        $bpm = $Data[$i]['bpm'];
        $hrs_disp = $Data[$i]['hrs_disp'];
        $hrs_pp = $Data[$i]['hrs_pp'];
        $restaHrs = $hrs_disp - $hrs_pp;
        //var_dump($Data[$i]);
        $uptime = ($restaHrs > 0) ? (( $produccion_neta + $bola_observada + $scrap) / ((($sobre_peso / 2) + 1) * $weight * ($bpm / 2) * 60 / 1000 )) / ($restaHrs) : 0;
        //$uptime = $uptime * 100;
        $uptime = (fmod($uptime, 1) != 0) ? round($uptime, 3):$uptime;
        $Data[$i]['uptime'] = $uptime;
        $rendimiento = (($Data[$i]['bpm'] / 2) / $Data[$i]['bpmReal']);
        //$rendimiento = $rendimiento * 100;
        $rendimiento = (fmod($rendimiento, 1) != 0) ? round($rendimiento, 3):$rendimiento;
        $Data[$i]['rendimiento'] = $rendimiento;
        $eficiencia = ($Data[$i]['carga_fria'] != 0) ? $Data[$i]['produccion_neta'] / $Data[$i]['carga_fria'] : 0;
        //$eficiencia = $eficiencia * 100;
        $eficiencia = (fmod($eficiencia, 1) != 0) ? round($eficiencia, 3):$eficiencia;
        $Data[$i]['eficiencia'] = $eficiencia;
        $oee = ($Data[$i]['uptime'])  * ($Data[$i]['rendimiento']) * ($Data[$i]['eficiencia']);
        //$oee = $oee * 100;
        $oee = (fmod($oee, 1) != 0) ? round($oee, 3):$oee;
        $Data[$i]['oee'] = $oee;
    //}
}
    
close_conection($con);

$json_string = json_encode($Data);

echo $json_string;

?>