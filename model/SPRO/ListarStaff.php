<?php

require_once('../../security.php');
require '../DatosBD.php';

$sql = "select * from staff;";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Staff = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $name=$row['name'];
    $position=$row['position'];
    $type=$row['type'];
    $area=$row['area'];

    $Staff[] = array(
    						'code'=>$code,
    						'name'=>$name,
    						'position'=>$position,
                            'type'=>$type,
                            'area'=>$area
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Staff);

echo $json_string;
?>