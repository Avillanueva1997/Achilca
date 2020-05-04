<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Year = $_POST['_Year'];

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$sqlCode = "select max(code) as code from costo_mtto;";

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

$CostoMtto = array();

while($row = mysqli_fetch_array($resultMonth)) 
{ 	    
    $code=$row['code'];

    $sql = "select * from costo_mtto where year = '".$_Year."' and month = '".$code."';";
    
    $result = mysqli_query($con,$sql);

    if (!$result  ) {
    printf("Error message: %s\n", mysqli_error($con));
}

    $row_count = mysqli_num_rows( $result );

    if($row_count == 1){

        while( $row = mysqli_fetch_array($result) ) {

            $CostoMtto[] = array(
                'code' => $row['code'],                            
                'month'=> $code,
                'year'=> $_Year,
                'real'=> $row['real'],
                'objetivo'=> $row['objetivo'],
                'dolar'=> $row['dolar'],
                'prod'=> $row['prod']
            );
        }

    } else {
        $CostoMtto[] = array(
            'code' => $codeFinal,            
            'month'=> $code,
            'year'=> $_Year,
            'real'=> '',
            'objetivo' => '',
            'dolar' => '',
            'prod' => ''
        );
    }

    mysqli_free_result($result);

    $codeFinal++;
}

mysqli_free_result($resultMonth);

close_conection($con);

$json_string = json_encode($CostoMtto);

echo $json_string;
?>