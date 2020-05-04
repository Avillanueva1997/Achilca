<?php

require_once('../../security.php');
require '../DatosBD.php';

$_CodeCab = $_POST['_CodeCab'];
$_Table = $_POST['_Table'];

$sql = "select code, actividad
from {$_Table} where code_cab = '".$_CodeCab."' and status = '1'
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
    $actividad=$row['actividad'];

    $Data[] = array(
                            'code'=>$code,
                            'actividad'=>$actividad
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>