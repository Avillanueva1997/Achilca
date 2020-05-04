<?php

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$sql = "select * from sgs;";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$AcumuladoFinal = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    
    $code=$row['code'];
    $no_cfd_mayor=$row['no_cfd_mayor'];
    $no_cfd_menor=$row['no_cfd_menor'];
    $obs=$row['obs']; 
    
    $AcumuladoFinal[] = array(
        'code'=>$code,
        'no_cfd_mayor'=>$no_cfd_mayor,
        'no_cfd_menor'=>$no_cfd_menor,
        'obs'=>$obs
     );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode(compact('AcumuladoFinal'));

echo $json_string;

?>