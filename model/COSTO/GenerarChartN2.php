<?php 

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$Data = array();

$sqlData = "select t1.year, (sum(t1.dolar) / sum(t1.prod)) as result, AVG(objetivo) as objetivo
from costo_mtto t1
where objetivo != '' and objetivo IS NOT NULL
group by t1.year
order by t1.year asc;";

$resultData = mysqli_query($con,$sqlData);

if (!$resultData ) {
    printf("Error message: %s\n", mysqli_error($con));
}

while($row = mysqli_fetch_array($resultData)) 
{ 	    
    
    $year=$row['year'];
    $result=$row['result'];
    $objetivo=$row['objetivo'];

    $Data[] = array(
                            
                            'year'=>$year,                    
                            'result'=>round($result),
                            'objetivo'=>round($objetivo)
    );
}

mysqli_free_result($resultData);
    
close_conection($con);

$json_string = json_encode($Data);

echo $json_string;

?>