<?php

require_once('../../security.php');
require '../DatosBD.php';

$_Auditoria = $_POST['_Auditoria'];

$sql = "select t1.termino, t2.description, t1.no_cfd_mayor, t1.no_cfd_menor, t1.obs 
from info_auditoria t1 
inner join terminos t2 on t1.termino = t2.code
where t1.auditoria = '".$_Auditoria."';";

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $description=$row['description'];
    $no_cfd_mayor=$row['no_cfd_mayor'];
    $no_cfd_menor=$row['no_cfd_menor'];
    $obs=$row['obs'];

    $Data[] = array(
    						'description'=>$description,
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