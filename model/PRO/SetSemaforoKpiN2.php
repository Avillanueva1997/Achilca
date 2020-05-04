<?php 

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$_LineaProduccion = $_POST['_LineaProduccion'];

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$Year = date("Y");
$Month = date("n");
$month = date('m');
$trimestre = GetTrimestre($month);
$response = 'Neutral';

$Meta;

$sql ="select meta from meta_uptime where year = {$Year} and linea_produccion = '".$_LineaProduccion."' and trimestre = '".$trimestre."';";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$row_count = mysqli_num_rows( $result );

if($row_count == 1){
    $row = mysqli_fetch_assoc($result);
    $Meta = $row['meta'];
    mysqli_free_result($result);

    if(is_null($Meta)){
        $response = 'Neutral';
    } else {
        $response = ObtenerUptime($con, $Year, $Month, $_LineaProduccion, $Meta);
    }

} else {
    $response = 'Neutral';
}

close_conection($con);

$root = array(
    'status' => $response
);

$json_string = json_encode(compact('root'));

echo $json_string;

function ObtenerUptime($con, $year, $month, $linea_produccion, $meta){

    $response = 'Neutral';

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

        $Desempenio = (($Uptime * 100) / ($meta * 100)) - 1;
        $Desempenio = round($Desempenio,3);

        $response = ($Desempenio >= 0) ? 'Good' : 'Error';

    } else {
        $response = 'Neutral';
    }

    mysqli_free_result($result);

    return $response;

}

?>