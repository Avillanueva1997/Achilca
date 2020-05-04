<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Auditoria = $_POST['_Auditoria'];

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$sqlCode = "select max(code) as code 
from info_auditoria;";

$resultCode = mysqli_query($con,$sqlCode);

if (!$resultCode ) {
    printf("Error message: %s\n", mysqli_error($con));
}

$row_countCode = mysqli_num_rows( $resultCode );

$codeFinal = 0;

    if($row_countCode == 1){
        while( $row = mysqli_fetch_array($resultCode) ) {
            $codeFinal = $row['code'];
            $codeFinal = $codeFinal + 1;
        }
    }

    mysqli_free_result($resultCode);

$sqlTerminos = "select * from terminos";

$resultTerminos = mysqli_query($con,$sqlTerminos);

if (!$resultTerminos ) {
    printf("Error message: %s\n", mysqli_error($con));
}

$AuditoriaTermino = array();

while($row = mysqli_fetch_array($resultTerminos)) 
{ 	    
    $code=$row['code'];

    $sql = "select * from info_auditoria where auditoria = '".$_Auditoria."' and termino = '".$code."';";
    
    $result = mysqli_query($con,$sql);

    if (!$result  ) {
    printf("Error message: %s\n", mysqli_error($con));
    }

    $row_count = mysqli_num_rows( $result );

    if($row_count == 1){

        while( $row = mysqli_fetch_array($result) ) {

            $AuditoriaTermino[] = array(
                'code' => $row['code'],                    
                'auditoria'=> $row['auditoria'],                    
                'termino'=>  $row['termino'],       
                'no_cfd_mayor'=>  $row['no_cfd_mayor'],       
                'no_cfd_menor'=>  $row['no_cfd_menor'],       
                'obs'=>  $row['obs']
            );
        }

    } else {
        $AuditoriaTermino[] = array(
            'code' => $codeFinal,                    
            'auditoria'=> $_Auditoria,                    
            'termino'=>  $code,       
            'no_cfd_mayor'=>  0,       
            'no_cfd_menor'=>  0,       
            'obs'=> 0
        );
    }

    mysqli_free_result($result);

    $codeFinal++;
}

mysqli_free_result($resultTerminos);

close_conection($con);

$json_string = json_encode($AuditoriaTermino);

echo $json_string;
?>