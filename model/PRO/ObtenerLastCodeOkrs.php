<?php

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$sqlCode = "select max(code) as code from okrs;";

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

close_conection($con);

echo $codeFinal;
?>