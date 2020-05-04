<?php

require_once('../../security.php');
require '../DatosBD.php';

$_year = $_POST['_year'];

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$sqlCode = "select code 
from database_costomantto
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

$sqlMonth = "select * from month";

$resultMonth = mysqli_query($con,$sqlMonth);

if (!$resultMonth ) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

while($row = mysqli_fetch_array($resultMonth)) 
{ 	    
    $code=$row['code'];

    $sql = "select * from database_costomantto where year = '".$_year."' and month = '".$code."';";
    
    $result = mysqli_query($con,$sql);

    if (!$result  ) {
    printf("Error message: %s\n", mysqli_error($con));
}

    $row_count = mysqli_num_rows( $result );

    if($row_count == 1){

        while( $row = mysqli_fetch_array($result) ) {

            $Data[] = array(
                'code' => $row['code'],           
                'month'=> $code,
                'year'=> $_year,
                'meta'=> $row['meta'],
                'data_real'=> $row['data_real']
            );
        }

    } else {
        $Data[] = array(
            'code' => $codeFinal,            
            'month'=> $code,
            'year'=> $_year,
            'meta'=> '',
            'data_real'=> ''
        );
    }

    mysqli_free_result($result);

    $codeFinal++;
}

mysqli_free_result($resultMonth);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>