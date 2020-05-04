<?php 

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$Year = date("Y");
$Month = date("n");
$response = 'Neutral';
$responseCostoTRF = 'Neutral';
$responseCostoMANTTO = 'Neutral';
$contador = 0;

$sql = "select meta, costo_real from costo_trf_kpi where year = {$Year} and month = {$Month};";

$result = mysqli_query($con,$sql);

if (!$result) {
printf("Error message: %s\n", mysqli_error($con));
}

$row_count = mysqli_num_rows( $result );

if($row_count == 1){

    $row = mysqli_fetch_assoc($result);
    
    $Meta = $row['meta'];
    $CostoReal = $row['costo_real'];

    mysqli_free_result($result);

    if(is_null($Meta) || is_null($CostoReal)){
        $responseCostoTRF = 'Neutral';
    } else {
        if($Meta != 0){
            $Desempenio = ($CostoReal / $Meta) - 1;
            $Desempenio = toFixed($Desempenio,1);
            $responseCostoTRF = ($Desempenio >= 0) ? 'Good' : 'Error';
        } else {
            $responseCostoTRF = 'Neutral';
        }   
    }
} else {
    $responseCostoTRF = 'Neutral';
}

$sql = "select meta, costo_real from costo_mantto_kpi where year = {$Year} and month = {$Month};";

$result = mysqli_query($con,$sql);

if (!$result) {
printf("Error message: %s\n", mysqli_error($con));
}

$row_count = mysqli_num_rows( $result );

if($row_count == 1){

    $row = mysqli_fetch_assoc($result);
    
    $Meta = $row['meta'];
    $CostoReal = $row['costo_real'];

    mysqli_free_result($result);

    if(is_null($Meta) || is_null($CostoReal)){
        $responseCostoMANTTO = 'Neutral';
    } else {
        if($Meta != 0){
            $Desempenio = ($CostoReal / $Meta) - 1;
            $Desempenio = toFixed($Desempenio,1);
            $responseCostoMANTTO = ($Desempenio >= 0) ? 'Good' : 'Error';
        } else {
            $responseCostoMANTTO = 'Neutral';
        }
    }
} else {
    $responseCostoMANTTO = 'Neutral';
}

if($responseCostoTRF != 'Neutral'){
    $contador++;
    $responseCostoTRF = ($responseCostoTRF == 'Good') ? 1 : 0;
} else {
    $responseCostoTRF = 0;    
}

if($responseCostoMANTTO != 'Neutral'){
    $contador++;
    $responseCostoMANTTO = ($responseCostoMANTTO == 'Good') ? 1 : 0;
} else {
    $responseCostoMANTTO = 0;    
}

close_conection($con);

if($contador != 0){
    $response = ($responseCostoTRF + $responseCostoMANTTO) / $contador;
    $response = ($response >= 0.5) ? 'Good' : 'Error';
} else {
    $response = 'Neutral';
}

$root = array(
    'status' => $response
);

$json_string = json_encode(compact('root'));

echo $json_string;

?>