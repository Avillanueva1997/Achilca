<?php

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_Evento = $_POST['_Evento'];
$_Actividad = $_POST['_Actividad'];
$_Actividad = mb_strtoupper($_Actividad, 'UTF-8');
$_Actividad = mysqli_real_escape_string($con, $_Actividad);
$_FechaEje = $_POST['_FechaEje'];
$_Area = $_POST['_Area'];
$_Responsable = $_POST['_Responsable'];
$_Usuario = $_POST['_Usuario'];
$_Table = $_POST['_Table'];

$Like = $_Evento.'%';

$sql = "select max(cast(substring_index(code, '.', -1) as unsigned)) as code 
from {$_Table}
where code like '".$Like."';";

$result = mysqli_query($con,$sql);

if (!$result ) {
    printf("Error message: %s\n", mysqli_error($con));
}

$row_count = mysqli_num_rows( $result );

    if($row_count == 1){
        $row = mysqli_fetch_assoc($result);
        $code = $row['code'];
        mysqli_free_result($result);
        $Ini = $_Evento . '.1';
        if(is_null($code)){
            $code = $Ini;
        } else {
            $explodeCode = explode('.', $code);
            $secondNumber = $explodeCode[sizeof($explodeCode) - 1];
            $secondNumber = $secondNumber + 1;
            $code = $_Evento .'.'.$secondNumber;
        }

        $sql = "insert into {$_Table} values('".$code."', '".$_Evento."', '".$_Actividad."', '".$_FechaEje."', '".$_Area."', '".$_Responsable."', '1', '', NOW(), '".$_Usuario."');";

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