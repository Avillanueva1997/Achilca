<?php 

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$Year = date("Y");
$Month = date("n");
$response = 'Neutral';

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
        $response = 'Neutral';
    } else {
        if($Meta != 0){
            $Desempenio = ($CostoReal / $Meta) - 1;
            $Desempenio = toFixed($Desempenio,1);
            $response = ($Desempenio >= 0) ? 'Good' : 'Error';
        } else {
            $response = 'Neutral';
        }   
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

?>