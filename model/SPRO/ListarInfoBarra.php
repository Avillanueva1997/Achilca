<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select * from info_barra;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$InfoBarra = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $code_sap=$row['code_sap'];
    $product=$row['product'];
    $length=$row['length'];
    $weight=$row['weight'];

    $InfoBarra[] = array(
    						'code'=>$code,
    						'code_sap'=>$code_sap,
    						'product'=>$product,
    						'length'=>$length,
    						'weight'=>$weight
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($InfoBarra);

echo $json_string;
?>