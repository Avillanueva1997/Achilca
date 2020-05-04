<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Auditoria = $_POST['_Auditoria'];

$sql = "select * from sgae_second where auditoria = '".$_Auditoria."';";
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
    $auditoria=$row['auditoria'];
    $proceso=$row['proceso'];
    $no_cfd_mayor=$row['no_cfd_mayor'];
    $no_cfd_menor=$row['no_cfd_menor'];
    $obs=$row['obs'];

    $Data[] = array(
    						'code'=>$code,
                            'auditoria'=>$auditoria,
                            'proceso'=>$proceso,
    						'no_cfd_mayor'=>$no_cfd_mayor,
    						'no_cfd_menor'=>$no_cfd_menor,
    						'obs'=>$obs
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>