<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select info from nodos where view like 'sig01%';";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

$sql = '';

while($row = mysqli_fetch_array($result)) 
{ 	    
    $info = $row['info'];
    $info = strtolower($info);

    $sql .= "select code from {$info}
    union ";
}

mysqli_free_result($result);

$sql = substr($sql, 0, -6);

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];

    $Data[] = array(
                            'code'=>$code
                        );
}

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>