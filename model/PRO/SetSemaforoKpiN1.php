<?php 

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$_LineaProduccion = $_POST['_LineaProduccion'];

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$Year = date("Y");
$Month = date("n");
$response = 'Neutral';

$response = ObtenerProduccion($con, $Year, $Month, $_LineaProduccion);

close_conection($con);

$root = array(
    'status' => $response
);

$json_string = json_encode(compact('root'));

echo $json_string;

function ObtenerProduccion($con, $year, $month, $linea_produccion){

    $response = 'Neutral';

    $sql = "select sum(produccion_neta) as Value from cierre_okrs where YEAR(fecha)  = '".$year."' and MONTH(fecha) = '".$month."' and linea_produccion = '".$linea_produccion."';";        

    $result = mysqli_query($con,$sql);

    if (!$result) {
        printf("Error message: %s\n", mysqli_error($con));
    }

    $row_count = mysqli_num_rows( $result );
    
    if($row_count == 1){

        $row = mysqli_fetch_assoc($result);
    
        $Value = $row['Value'];

        mysqli_free_result($result);

        if(is_null($Value)){
            $response = 'Neutral';
        } else {
            $Value = toFixed($Value, 1);

            $Meta;

            $sql = "select sum(tm) as Meta from programa_produccion where YEAR(start_date) = '".$year."' and MONTH(start_date) = '".$month."' and linea_produccion = '".$linea_produccion."';";
    
            $result = mysqli_query($con,$sql);
    
            if (!$result  ) {
                printf("Error message: %s\n", mysqli_error($con));
            }

            $row_count = mysqli_num_rows( $result );
    
            if($row_count == 1){
                $row = mysqli_fetch_assoc($result);
                $Meta = $row['Meta'];

                mysqli_free_result($result);

                if(is_null($Meta)){
                    $response = 'Neutral';
                } else {
                    $Meta= floatval($Meta);
                    if($Meta > 0){
                        $Desempenio = ($Value / $Meta) - 1;
                        $Desempenio *= 100;
                        $Desempenio = round($Desempenio, 1);
                        $response = ($Desempenio >= 0) ? 'Good' : 'Error';
                    } else {
                        $response = 'Neutral';                              
                    }
                }
            } else {
                $response = 'Neutral';                
            }
        }

    } else {
        $response = 'Neutral';
    }

    return $response;
}

?>