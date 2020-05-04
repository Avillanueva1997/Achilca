<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Code = $_POST['_Code'];

$sql = "select t1.area, t2.email 
from areas t1 
inner join users t2 on t1.responsable = t2.code 
where t1.code = '".$_Code."';";

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $area=$row['area'];
    $email=$row['email'];

    $Data[] = array(
                            'area'=>$area,
                            'email'=>$email
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>