<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select * from ball;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$InfoBall = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $product=$row['product'];
    $length=$row['length'];
    $weight=$row['weight'];
    $bpm=$row['bpm'];
    $meta=$row['meta'];
    $linea_produccion=$row['linea_produccion'];
    $bpmPropuesto=$row['bpmPropuesto'];

    $InfoBall[] = array(
    						'code'=>$code,
    						'product'=>$product,
    						'length'=>$length,
    						'weight'=>$weight,
                            'bpm'=>$bpm,
                            'meta'=>$meta,
                            'linea_produccion'=>$linea_produccion,
                            'bpmPropuesto'=>$bpmPropuesto
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($InfoBall);

echo $json_string;
?>