<?php 

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$Year = date("Y");
$Month = date("n");
$month = date('m');
$trimestre = GetTrimestre($month);
$response = 'Error';

$MetaUptimeL2 = ObtenerMetaUptime($con, $Year, 'L2', $trimestre);
$MetaUptimeL3 = ObtenerMetaUptime($con, $Year, 'L3', $trimestre);
$responseProduccionL2 = ObtenerProduccion($con, $Year, $Month, 'L2');
$responseProduccionL3 = ObtenerProduccion($con, $Year, $Month, 'L3');
$responseUptimeL2 = ObtenerUptime($con, $Year, $Month, 'L2', $MetaUptimeL2);
$responseUptimeL3 = ObtenerUptime($con, $Year, $Month, 'L3', $MetaUptimeL3);

close_conection($con);

$response = ($responseProduccionL2 + $responseProduccionL3 + $responseUptimeL2 + $responseUptimeL3) / 4;
$response = ($response >= 0.5) ? 'Good' : 'Error';

$root = array(
    'status' => $response
);

$json_string = json_encode(compact('root'));

echo $json_string;

function ObtenerProduccion($con, $year, $month, $linea_produccion){

    $DataKpi = array();

    $sql = "select sum(produccion_neta) as Value from cierre_okrs where YEAR(fecha)  = '".$year."' and MONTH(fecha) = '".$month."' and linea_produccion = '".$linea_produccion."';";        

    $result = mysqli_query($con,$sql);

    if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
    }

    $row_count = mysqli_num_rows( $result );

    if($row_count != 0){

        while( $row = mysqli_fetch_array($result) ) {

            $DataKpi[] = array(          
                'CodeMonth'=> $month,
                'Value'=> toFixed($row['Value'], 1)
            );
        }

    } else {
        $DataKpi[] = array(       
            'CodeMonth'=> $month,           
            'Value'=> 0
        );
    }

    mysqli_free_result($result);

    for ($i=0; $i < sizeof($DataKpi) ; $i++) { 
        if(array_key_exists("CodeMonth",$DataKpi[$i])){
            $sql = "select sum(tm) as Meta from programa_produccion where YEAR(start_date) = '".$year."' and MONTH(start_date) = '".$DataKpi[$i]['CodeMonth']."' and linea_produccion = '".$linea_produccion."';";
    
            $result = mysqli_query($con,$sql);
    
            if (!$result  ) {
                printf("Error message: %s\n", mysqli_error($con));
            }
    
            $Meta = 0;
    
            while( $row = mysqli_fetch_array($result) ) {
                $Meta=$row['Meta'];
                $Meta= intval($Meta);
            }
    
            $DataKpi[$i]['Meta'] = $Meta;
        }
    }

    if( sizeof($DataKpi) == 1){
        $Meta =  $DataKpi[0]['Meta'];

        if($Meta > 0){
            $Value =  $DataKpi[0]['Value'];
            $Desempenio = ($Value / $Meta) - 1;
            $Desempenio = $Desempenio  * 100;

            $response = ($Desempenio >= 0) ? 1 : 0;
        } else {
            $response = 0;
        }
        
    } else {
        $response = 0;
    }

    return $response;

}

function ObtenerUptime($con, $year, $month, $linea_produccion, $meta){

    $response = 0;

    if($meta != 0){

        $sql = "select t1.diametro, sum(t1.hrs_disp) as hrs_disp, sum(t1.hrs_pp) as hrs_pp,sum(t1.produccion_neta) as produccion_neta, sum(t1.bola_observada) as bola_observada, sum(t1.scrap) as scrap, AVG(t1.sobre_peso) as sobre_peso, AVG(t1.bpm) as bpm, t2.weight
        from okrs t1
        inner join ball t2 on t1.diametro = t2.length and t1.linea_produccion = t2.linea_produccion
        where YEAR(t1.fecha) = '".$year."' and MONTH(fecha) = '".$month."' and t1.linea_produccion = '".$linea_produccion."' group by t1.diametro, t2.weight;";     
    
        $result = mysqli_query($con,$sql);
    
        if (!$result) {
        printf("Error message: %s\n", mysqli_error($con));
        }
    
        $row_count = mysqli_num_rows( $result );
    
        if($row_count != 0){
    
            $Uptime = 0;
            $Hrs_disp = 0;
            $Hrs_pp = 0;
    
            while( $row = mysqli_fetch_array($result) ) {
    
                $uptime = (($row['produccion_neta'] + $row['bola_observada'] + $row['scrap']) / ((($row['sobre_peso'] / 100) + 1) * $row['weight'] * $row['bpm'] * 60 / 1000));
                $Uptime += $uptime;
                $Hrs_disp += $row['hrs_disp']; 
                $Hrs_pp += $row['hrs_pp']; 
            }
    
            $Uptime = $Uptime / ($Hrs_disp - $Hrs_pp);
            $Uptime = $Uptime * 100;
            $Uptime = toFixed($Uptime, 1);

            $Desempenio = (($Uptime * 100) / ($meta * 100)) - 1;
            $Desempenio = $Desempenio * 100;
            $Desempenio = toFixed($Desempenio,1);
    
            $response = ($Desempenio >= 0) ? 1 : 0;
    
        } else {
            $response = 0;
        }
    
        mysqli_free_result($result);

    } else {
        $response = 0;
    }

    return $response;

}

function ObtenerMetaUptime($con, $year, $linea_produccion, $trimestre){
    $Meta = 0;

    $sql ="select meta from meta_uptime where year = {$year} and linea_produccion = '".$linea_produccion."' and trimestre = '".$trimestre."';";

    $result = mysqli_query($con,$sql);

    if (!$result) {
        printf("Error message: %s\n", mysqli_error($con));
    }

    $row_count = mysqli_num_rows( $result );

    if($row_count == 1){
        while( $row = mysqli_fetch_array($result) ) {

            $Meta = $row['meta'];
        }
    }

    mysqli_free_result($result);

    return $Meta;
}

?>