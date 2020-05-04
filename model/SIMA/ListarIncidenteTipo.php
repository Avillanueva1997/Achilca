<?php

require_once('../../security.php');
require '../DatosBD.php';

$_year = $_POST['_year'];

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$sqlCode = "select code 
from incidente_tipo
order by code desc
limit 1;";

$resultCode = mysqli_query($con,$sqlCode);

if (!$resultCode ) {
    printf("Error message: %s\n", mysqli_error($con));
}

$row_countCode = mysqli_num_rows( $resultCode );

$codeFinal = 1;

    if($row_countCode == 1){
        while( $row = mysqli_fetch_array($resultCode) ) {
            $codeFinal = $row['code'];
            $codeFinal = $codeFinal + 1;
        }
    }

    mysqli_free_result($resultCode);

$sqlTipoIncidente = "select * from tipo_incidente";

$resultTipoIncidente = mysqli_query($con,$sqlTipoIncidente);

if (!$resultTipoIncidente ) {
    printf("Error message: %s\n", mysqli_error($con));
}

$IncidenteTipo = array();

while($row = mysqli_fetch_array($resultTipoIncidente)) 
{ 	    
    $code=$row['code'];

    $sql = "select * from incidente_tipo where year = '".$_year."' and tipo = '".$code."';";
    
    $result = mysqli_query($con,$sql);

    if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
    }

    $row_count = mysqli_num_rows( $result );

    if($row_count == 1){

        while( $row = mysqli_fetch_array($result) ) {

            $IncidenteTipo[] = array(
                'code' => $row['code'],                    
                'tipo'=> $code,
                'year'=> $_year,
                'numero_incidentes'=> $row['numero_incidentes']
            );
        }

    } else {
        $IncidenteTipo[] = array(
            'code' => $codeFinal,                    
            'tipo'=> $code,
            'year'=> $_year,
            'numero_incidentes'=> 0
        );
    }

    mysqli_free_result($result);

    $codeFinal++;
}

mysqli_free_result($resultTipoIncidente);

close_conection($con);

$json_string = json_encode($IncidenteTipo);

echo $json_string;
?>