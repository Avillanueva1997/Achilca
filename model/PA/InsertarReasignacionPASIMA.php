<?php

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_Code = $_POST['_Code'];
$_CodeCab = $_POST['_CodeCab'];
$_Responsable = $_POST['_Responsable'];
$_Usuario = $_POST['_Usuario'];

$sql = "select * from pa_sima_det where code = '".$_Code."' and code_cab = '".$_CodeCab."';";

$result = mysqli_query($con,$sql);

if (!$result ) {
    printf("Error message: %s\n", mysqli_error($con));
}

$row_count = mysqli_num_rows( $result );

if($row_count == 1){
    $row = mysqli_fetch_assoc($result);
    $actividad = $row['actividad'];
    $fecha_eje = $row['fecha_eje'];
    $area_res = $row['area_res'];
    mysqli_free_result($result);

    $Like = $_CodeCab.'%';

    $sql = "select max(cast(substring_index(code, '.', -1) as unsigned)) as code 
    from pa_sima_det 
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
        $Ini = $_CodeCab . '.1';
        if(is_null($code)){
            $code = $Ini;
        } else {
            $explodeCode = explode('.', $code);
            $secondNumber = $explodeCode[sizeof($explodeCode) - 1];
            $secondNumber = $secondNumber + 1;
            $code = $_CodeCab .'.'.$secondNumber;
        }

        $sql = "insert into pa_sima_det values('".$code."', '".$_CodeCab."', '".$actividad."', '".$fecha_eje."', '".$area_res."', '".$_Responsable."', '1', '', NOW(), '".$_Usuario."');";

        $result = mysqli_query($con,$sql);

        if (!$result ) {
            printf("Error message: %s\n", mysqli_error($con));
        }

        $sql = "update pa_sima_det set status = '3', code_rea = '".$code."' where code = '".$_Code."' and code_cab = '".$_CodeCab."';";

        $result = mysqli_query($con,$sql);

        if (!$result ) {
            printf("Error message: %s\n", mysqli_error($con));
        }

        $root = array(
            'status' => 'ok',
            'code' => $code,
            'oldCode' => $_Code
        );

    }
} else {
    $root = array(
        'status' => 'false'
    );
}

    close_conection($con);

    $json_string = json_encode(compact('root'));
        
    echo $json_string;

?>