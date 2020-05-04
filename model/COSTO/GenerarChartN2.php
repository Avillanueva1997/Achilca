<?php 

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$Data = array();

$sqlData = "select t1.year, t1.real, t1.objetivo from costo_mtto t1;";

$resultData = mysqli_query($con,$sqlData);

if (!$resultData ) {
    printf("Error message: %s\n", mysqli_error($con));
}

while($row = mysqli_fetch_array($resultData)) 
{ 	    
    
    $year=$row['year'];
    $real=$row['real'];
    $objetivo=$row['objetivo'];

    $Data[] = array(
                            
                            'year'=>$year,                    
                            'real'=>$real,
                            'objetivo'=>$objetivo
    );
}

mysqli_free_result($resultData);
    
close_conection($con);

$json_string = json_encode($Data);

echo $json_string;

?>