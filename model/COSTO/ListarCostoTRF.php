<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Year = $_POST['_Year'];
$_Diametro = $_POST['_Diametro'];

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$sqlCode = "select max(code) as code from costo_trf;";

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

$sqlMonth = "select * from month";

$resultMonth = mysqli_query($con,$sqlMonth);

if (!$resultMonth ) {
    printf("Error message: %s\n", mysqli_error($con));
}

$CostoTRF = array();

while($row = mysqli_fetch_array($resultMonth)) 
{ 	    
    $code=$row['code'];

    $sql = "select * from costo_trf where year = '".$_Year."' and month = '".$code."' and diametro = '".$_Diametro."';";
    
    $result = mysqli_query($con,$sql);

    if (!$result  ) {
    printf("Error message: %s\n", mysqli_error($con));
}

    $row_count = mysqli_num_rows( $result );

    if($row_count == 1){

        while( $row = mysqli_fetch_array($result) ) {

            $CostoTRF[] = array(
                'code' => $row['code'],      
                'diametro' => $row['diametro'],                              
                'month'=> $code,
                'year'=> $_Year,
                'real'=> $row['real'],
                'objetivo'=> $row['objetivo'],
            );
        }

    } else {
        $CostoTRF[] = array(
            'code' => $codeFinal,    
            'diametro'=> '',                
            'month'=> $code,
            'year'=> $_Year,
            'real'=> '',
            'objetivo' => ''
        );
    }

    mysqli_free_result($result);

    $codeFinal++;
}

mysqli_free_result($resultMonth);

close_conection($con);

$json_string = json_encode($CostoTRF);

echo $json_string;
?>