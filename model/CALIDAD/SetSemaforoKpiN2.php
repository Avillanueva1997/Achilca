<?php 

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_LineaProduccion = $_POST['_LineaProduccion'];
$Year = date("Y");
$Month = date("n");
$response = 'Neutral';

    $Meta = 0;

    $sql ="select meta from meta_eficiencia where year = {$Year} and linea_produccion = '".$_LineaProduccion."';";

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

    if($Meta != 0){

        $sql = "select avg(eficiencia) as Value from cierre_okrs where YEAR(fecha)  = '".$Year."' and MONTH(fecha) = '".$Month."' and linea_produccion = '".$_LineaProduccion."';";        

        $result = mysqli_query($con,$sql);

        if (!$result  ) {
        printf("Error message: %s\n", mysqli_error($con));
        }

        $row_count = mysqli_num_rows( $result );

        if($row_count == 1){

            $Desempenio;

            $row = mysqli_fetch_assoc($result);

            $Value = $row['Value'];

            if(is_null($Value)){
                $response = 'Neutral';
            } else {
                if($Value !== 0){
                    $Desempenio = (($Value * 100) / ($Meta * 100)) - 1;
                    $Desempenio = $Desempenio * 100;
                    $Desempenio = toFixed($Desempenio,1);
                    if($Desempenio >= 0){
                        $response = 'Good';
                    } else {
                        $response = 'Error';
                    }
                }
            }

        } else {
            $response = 'Neutral';
        }

        mysqli_free_result($result);

    } else {
        $response = 'Neutral';
    }

close_conection($con);

$root = array(
    'status' => $response
);

$json_string = json_encode(compact('root'));

echo $json_string;

?>