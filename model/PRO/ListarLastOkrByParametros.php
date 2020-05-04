<?php

date_default_timezone_set('America/Lima');

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$_LineaProduccion = $_POST['_LineaProduccion'];
$_Moye = $_POST['_Moye'];
$_Turno = $_POST['_Turno'];

$explodeMoye = explode(".", $_Moye);
$_Month = $explodeMoye[0];
$_Month = $_Month + 1;
$_Year = $explodeMoye[1]; 

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$sql = "select code, fecha from okrs where linea_produccion = '".$_LineaProduccion."' and turno = '".$_Turno."' and MONTH(fecha) = {$_Month} and YEAR(fecha) = {$_Year} and fecha = (select max(fecha) from okrs);";

$result = mysqli_query($con, $sql);

if (!$result ) {
    printf("Error message: %s\n", mysqli_error($con));
}

$row_count = mysqli_num_rows( $result );

$_LastDate = '';
$_Code = '';

if($row_count == 1){
    $row = mysqli_fetch_assoc($result);
    $_LastDate = (!empty($row['fecha'])) ? $row['fecha'] : '';
    $_Code = (!empty($row['code'])) ? $row['code'] : '';
}

$data = array();

$data[] = array(
    'date' => $_LastDate,
    'code' => $_Code
);

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($data);

echo $json_string;

?>