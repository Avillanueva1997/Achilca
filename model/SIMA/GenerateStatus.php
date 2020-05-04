<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Campo = $_POST['_Campo'];
$_Year = $_POST['_Year'];

$sql = "select {$_Campo} as Value
from sima_ytd t1
inner join year t2 on t1.year = t2.code
where t2.description = {$_Year};";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $Value=$row['Value'];

    $Data[] = array(
    						'Value'=>$Value
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>