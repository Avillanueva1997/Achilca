<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Table = $_POST['_Table'];
$_TipoEvento = $_POST['_TipoEvento'];
$_LineaProduccion = $_POST['_LineaProduccion'];

$sql = "select code, evento
from {$_Table} where tipo_evento = '".$_TipoEvento."' and linea_produccion = '".$_LineaProduccion."'
ORDER BY CAST(code as SIGNED INTEGER) ASC;";

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $evento=$row['evento'];

    $Data[] = array(
                            'code'=>$code,
                            'evento'=>$evento
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>