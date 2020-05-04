<?php

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_Evento = $_POST['_Evento'];
$_Evento = mb_strtoupper($_Evento, 'UTF-8');
$_Evento = mysqli_real_escape_string($con, $_Evento);
$_FechaEvento = $_POST['_FechaEvento'];
$_Usuario = $_POST['_Usuario'];
$_Type = $_POST['_Type'];

$sql = "select max(cast(code as signed)) as code
from pa_sima_cab;";

$result = mysqli_query($con,$sql);

if (!$result ) {
    printf("Error message: %s\n", mysqli_error($con));
}

$row_count = mysqli_num_rows( $result );

    if($row_count == 1){
        $row = mysqli_fetch_assoc($result);
        $code = $row['code'];
        mysqli_free_result($result);
        $code = (is_null($code)) ? 1 : $code + 1;

        $sql = "insert into pa_sima_cab values('".$code."', '".$_Type."', '".$_Evento."', '".$_FechaEvento."', NOW(), '".$_Usuario."');";

        $result = mysqli_query($con,$sql);

        if (!$result ) {
            printf("Error message: %s\n", mysqli_error($con));
        }

        $root = array(
            'status' => 'ok',
            'code' => $code
        );
        
    } else {
        $root = array(
            'status' => 'false'
        );
    }

    close_conection($con);

    $json_string = json_encode(compact('root'));
        
    echo $json_string;

?>