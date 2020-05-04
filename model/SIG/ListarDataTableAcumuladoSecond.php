<?php

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$Data = array();

$sql = 'select code, nota, fecha from (select code, nota, fecha from sgae union all select code, nota, fecha from nota_auditoria) t group by code, nota;';

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $nota=$row['nota'];
    $fecha=$row['fecha'];

    $Data[] = array(
                            'code'=>$code,
                            'nota'=>$nota,
                            'fecha'=>$fecha
                        );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>