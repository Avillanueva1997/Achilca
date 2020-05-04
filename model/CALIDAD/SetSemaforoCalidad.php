<?php 

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$Year = date("Y");
$Month = date("n");
$response = 'Error';

$MetaL2 = ObtenerMetaBolaObservada($con, $Year, 'L2');
$MetaL3 = ObtenerMetaBolaObservada($con, $Year, 'L3');
$responseBolasObsL2 = ObtenerResponseBolaObservada($con, $Year, $Month, 'L2', $MetaL2);
$responseBolasObsL3 = ObtenerResponseBolaObservada($con, $Year, $Month, 'L3', $MetaL3);
$responseEficienciaL2 = ObtenerResponseEficiencia($con, $Year, $Month, 'L2', $MetaL2);
$responseEficienciaL3 = ObtenerResponseEficiencia($con, $Year, $Month, 'L3', $MetaL3);

close_conection($con);

$response = ($responseBolasObsL2 + $responseBolasObsL3 + $responseEficienciaL2 + $responseEficienciaL3) / 4;
$response = ($response >= 0.5) ? 'Good' : 'Error';

$root = array(
    'status' => $response
);

$json_string = json_encode(compact('root'));

echo $json_string;

function ObtenerMetaBolaObservada($con, $year, $linea_produccion){

    $Meta;

    $sql ="select meta from meta_bola_obs where year = {$year} and linea_produccion = '".$linea_produccion."';";

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

function ObtenerResponseBolaObservada($con, $year, $month, $linea_produccion, $meta){

    $response = 0;

    if($meta != 0){

        $sql = "select avg(bola_observada_second) as Value from cierre_okrs where YEAR(fecha)  = '".$year."' and MONTH(fecha) = '".$month."' and linea_produccion = '".$linea_produccion."';";        

        $result = mysqli_query($con,$sql);
    
        if (!$result  ) {
        printf("Error message: %s\n", mysqli_error($con));
        }
    
        $row_count = mysqli_num_rows( $result );
    
        if($row_count != 0){
            while( $row = mysqli_fetch_array($result) ) {
                if($row['Value'] == 0 || empty($row['Value'])){
                    $response = 0;
                } else {
                    
                    $Desempenio = (($row['Value'] * 100) / ($meta * 100)) - 1;
                    $Desempenio = $Desempenio * 100;
                    $Desempenio = toFixed($Desempenio,1);
    
                    if($Desempenio < 0){
                        $response = 1;
                    } else {
                        $response = 0;
                    }
                }
            }
    
        } else {
            $response = 0;
        }
    
        mysqli_free_result($result);
        
    } else {
        $response = 0;
    }

    return $response;

}

function ObtenerResponseEficiencia($con, $year, $month, $linea_produccion, $meta){

    $response = 0;

    if($meta != 0){

        $sql = "select avg(eficiencia) as Value from cierre_okrs where YEAR(fecha)  = '".$year."' and MONTH(fecha) = '".$month."' and linea_produccion = '".$linea_produccion."';";        

        $result = mysqli_query($con,$sql);
    
        if (!$result  ) {
        printf("Error message: %s\n", mysqli_error($con));
        }
    
        $row_count = mysqli_num_rows( $result );
    
        if($row_count != 0){
    
            while( $row = mysqli_fetch_array($result) ) {
    
                if($row['Value'] == 0 || empty($row['Value'])){
                    $response = 0;
                } else {
                    
                    $Desempenio = (($row['Value'] * 100) / ($meta * 100)) - 1;
                    $Desempenio = $Desempenio * 100;
                    $Desempenio = toFixed($Desempenio,1);
    
                    if($Desempenio >= 0){
                        $response = 1;
                    } else {
                        $response = 0;
                    }
                }
            }
    
        } else {
            $response = 0;
        }
    
        mysqli_free_result($result);

    } else {
        $response = 0;
    }

    return $response;
}

?>