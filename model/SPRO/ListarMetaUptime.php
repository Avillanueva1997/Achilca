<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Year = $_POST['_Year'];
$_LineaProduccion = $_POST['_LineaProduccion'];

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$sqlCode = "select code from meta_uptime order by code desc limit 1;";

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

    $Data = array();

    $number = 1;

    for ($i=0; $i <= 3 ; $i++) { 
        $code = str_pad($number, 2, '0', STR_PAD_LEFT);

        $sql = "select * from meta_uptime where year = '".$_Year."' and trimestre = '".$code."' and linea_produccion = '".$_LineaProduccion."';";
        
        $result = mysqli_query($con,$sql);

        if (!$result  ) {
            printf("Error message: %s\n", mysqli_error($con));
        }


        $row_count = mysqli_num_rows( $result );

        if($row_count == 1){

            while( $row = mysqli_fetch_array($result) ) {

                $Data[] = array(
                    'code' => $row['code'],                             
                    'year'=> $_Year,
                    'trimestre'=> $code,
                    'meta'=> $row['meta'],
                    'linea_produccion'=> $row['linea_produccion'],
                );
            }

        } else {
            $Data[] = array(
                'code' => $codeFinal, 
                'year'=> $_Year,                
                'trimestre'=> $code,            
                'meta'=> '',
                'linea_produccion' => $_LineaProduccion
            );
        }

        mysqli_free_result($result);

        $codeFinal++;
        $number++;
    }

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>